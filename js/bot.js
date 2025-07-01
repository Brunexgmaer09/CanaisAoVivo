// Sistema de Bots IA para Battle Royale

class Bot extends GameObject {
    constructor(x, y, id) {
        super(x, y, 20, 20);
        
        this.id = id;
        this.name = this.generateName();
        
        // Stats do bot
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.maxArmor = 100;
        this.armor = 0;
        this.speed = MathUtils.random(180, 220); // Velocidade variável
        
        // Movimento e AI
        this.velocity = new Vector2(0, 0);
        this.angle = 0;
        this.targetPosition = null;
        this.lastPosition = new Vector2(x, y);
        this.stuckTimer = 0;
        
        // Combate
        this.weapons = [
            Weapon.createPistol(),
            null,
            null
        ];
        this.currentWeaponIndex = 0;
        this.target = null;
        this.lastShotTime = 0;
        this.detectionRange = MathUtils.random(200, 350);
        this.shootingAccuracy = MathUtils.random(0.6, 0.9);
        
        // Estados da IA
        this.state = 'explore'; // 'explore', 'loot', 'combat', 'flee', 'zone'
        this.lastStateChange = 0;
        this.personality = this.generatePersonality();
        
        // Navegação
        this.path = [];
        this.currentPathIndex = 0;
        this.lastPathUpdate = 0;
        
        // Memória
        this.knownLoot = [];
        this.knownEnemies = [];
        this.visitedHouses = [];
        this.lastLootScan = 0;
        
        // Estatísticas
        this.kills = 0;
        this.timeAlive = 0;
        this.isAlive = true;
        
        // Efeitos visuais
        this.muzzleFlashTimer = 0;
        this.hitFlashTimer = 0;
        
        // Nome do bot visível
        this.nameDisplayTimer = 0;
    }
    
    generateName() {
        const firstNames = [
            'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel',
            'India', 'Juliet', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa',
            'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey',
            'X-Ray', 'Yankee', 'Zulu', 'Phantom', 'Ghost', 'Shadow', 'Viper',
            'Hawk', 'Wolf', 'Tiger', 'Eagle', 'Falcon', 'Raven', 'Storm', 'Blaze'
        ];
        
        const numbers = MathUtils.randomInt(1, 999);
        return MathUtils.randomChoice(firstNames) + numbers;
    }
    
    generatePersonality() {
        return {
            aggression: MathUtils.random(0.3, 1.0),     // Quão agressivo
            caution: MathUtils.random(0.2, 0.8),        // Quão cauteloso
            lootGreed: MathUtils.random(0.4, 1.0),      // Foco em loot
            teamwork: MathUtils.random(0.1, 0.6),       // Tendência a agrupar
            accuracy: MathUtils.random(0.5, 0.95),      // Precisão nos tiros
            reactionTime: MathUtils.random(0.2, 0.8)    // Tempo de reação
        };
    }
    
    update(deltaTime, gameMap, player, otherBots, bullets) {
        if (!this.isAlive) return;
        
        this.timeAlive += deltaTime;
        
        // Atualizar timers
        this.updateTimers(deltaTime);
        
        // Verificar dano da zona
        this.checkZoneDamage(gameMap, deltaTime);
        
        // Atualizar IA
        this.updateAI(deltaTime, gameMap, player, otherBots);
        
        // Atualizar movimento
        this.updateMovement(deltaTime, gameMap.houses);
        
        // Atualizar combate
        this.updateCombat(deltaTime, player, otherBots);
        
        // Verificar se morreu
        if (this.health <= 0) {
            this.die();
        }
    }
    
    updateTimers(deltaTime) {
        if (this.muzzleFlashTimer > 0) {
            this.muzzleFlashTimer -= deltaTime;
        }
        
        if (this.hitFlashTimer > 0) {
            this.hitFlashTimer -= deltaTime;
        }
        
        if (this.nameDisplayTimer > 0) {
            this.nameDisplayTimer -= deltaTime;
        }
    }
    
    checkZoneDamage(gameMap, deltaTime) {
        const center = this.getCenter();
        if (!gameMap.isInSafeZone(center.x, center.y)) {
            const damage = 5 * deltaTime;
            this.takeDamage(damage);
            
            // Priorizar fugir da zona
            if (this.state !== 'zone') {
                this.setState('zone');
            }
        }
    }
    
    updateAI(deltaTime, gameMap, player, otherBots) {
        // Escanear ambiente periodicamente
        if (Date.now() - this.lastLootScan > 2000) {
            this.scanForLoot(gameMap);
            this.scanForEnemies(player, otherBots);
            this.lastLootScan = Date.now();
        }
        
        // Decidir estado baseado na situação
        this.decideState(gameMap, player, otherBots);
        
        // Executar comportamento do estado atual
        switch (this.state) {
            case 'explore':
                this.exploreState(gameMap);
                break;
            case 'loot':
                this.lootState(gameMap);
                break;
            case 'combat':
                this.combatState(player, otherBots);
                break;
            case 'flee':
                this.fleeState(player, otherBots);
                break;
            case 'zone':
                this.zoneState(gameMap);
                break;
        }
    }
    
    decideState(gameMap, player, otherBots) {
        const center = this.getCenter();
        
        // Prioridade 1: Zona de dano
        if (!gameMap.isInSafeZone(center.x, center.y)) {
            this.setState('zone');
            return;
        }
        
        // Prioridade 2: Combate se inimigo próximo
        const nearbyEnemy = this.findNearestEnemy(player, otherBots);
        if (nearbyEnemy && this.getDistanceTo(nearbyEnemy) < this.detectionRange) {
            if (this.health < 30 && this.personality.caution > 0.6) {
                this.setState('flee');
            } else if (this.personality.aggression > 0.5) {
                this.setState('combat');
                this.target = nearbyEnemy;
            }
            return;
        }
        
        // Prioridade 3: Loot se disponível e necessário
        if (this.needsLoot() && this.knownLoot.length > 0) {
            this.setState('loot');
            return;
        }
        
        // Padrão: Explorar
        this.setState('explore');
    }
    
    setState(newState) {
        if (this.state !== newState) {
            this.state = newState;
            this.lastStateChange = Date.now();
            this.path = []; // Limpar path quando muda estado
        }
    }
    
    exploreState(gameMap) {
        // Explorar casas não visitadas ou mover para zona segura
        if (!this.targetPosition || this.hasReachedTarget()) {
            this.setExploreTarget(gameMap);
        }
    }
    
    lootState(gameMap) {
        // Ir para o loot mais próximo
        const nearestLoot = this.findNearestLoot();
        if (nearestLoot) {
            this.targetPosition = new Vector2(nearestLoot.x, nearestLoot.y);
        } else {
            this.setState('explore');
        }
    }
    
    combatState(player, otherBots) {
        if (!this.target || !this.isTargetAlive(this.target)) {
            this.target = this.findNearestEnemy(player, otherBots);
        }
        
        if (this.target) {
            const distance = this.getDistanceTo(this.target);
            
            // Manter distância ótima baseada na arma
            const weapon = this.getCurrentWeapon();
            const optimalRange = weapon ? weapon.range * 0.7 : 200;
            
            if (distance > optimalRange) {
                // Aproximar
                this.targetPosition = this.target.getCenter();
            } else if (distance < optimalRange * 0.5) {
                // Afastar mantendo linha de visão
                this.targetPosition = this.calculateFlankPosition(this.target);
            } else {
                // Distância boa, parar e atirar
                this.targetPosition = null;
                this.velocity = new Vector2(0, 0);
            }
        }
    }
    
    fleeState(player, otherBots) {
        // Fugir do inimigo mais próximo
        const nearestEnemy = this.findNearestEnemy(player, otherBots);
        if (nearestEnemy) {
            const fleeDirection = this.getCenter().subtract(nearestEnemy.getCenter()).normalize();
            this.targetPosition = this.getCenter().add(fleeDirection.multiply(300));
        }
        
        // Voltar para combate se recuperou vida
        if (this.health > 60) {
            this.setState('combat');
        }
    }
    
    zoneState(gameMap) {
        // Correr para zona segura
        const center = this.getCenter();
        const safeZone = gameMap.safeZone;
        
        if (safeZone) {
            const directionToSafe = new Vector2(safeZone.centerX - center.x, safeZone.centerY - center.y).normalize();
            this.targetPosition = center.add(directionToSafe.multiply(200));
        }
    }
    
    updateMovement(deltaTime, houses) {
        if (!this.targetPosition) return;
        
        const currentPos = this.getCenter();
        const direction = this.targetPosition.subtract(currentPos).normalize();
        
        // Verificar se está travado
        const distanceMoved = currentPos.distance(this.lastPosition);
        if (distanceMoved < 5) {
            this.stuckTimer += deltaTime;
            if (this.stuckTimer > 2.0) {
                // Está travado, tentar contornar obstáculo
                this.targetPosition = this.findAlternativePosition(houses);
                this.stuckTimer = 0;
            }
        } else {
            this.stuckTimer = 0;
        }
        
        this.lastPosition = currentPos;
        
        // Aplicar movimento
        this.velocity = direction;
        const movement = this.velocity.multiply(this.speed * deltaTime);
        const newX = this.x + movement.x;
        const newY = this.y + movement.y;
        
        // Verificar colisão com casas
        let canMoveX = true;
        let canMoveY = true;
        
        for (const house of houses) {
            if (house.containsPoint(newX, this.y) || 
                house.containsPoint(newX + this.width, this.y) ||
                house.containsPoint(newX, this.y + this.height) ||
                house.containsPoint(newX + this.width, this.y + this.height)) {
                canMoveX = false;
            }
            
            if (house.containsPoint(this.x, newY) || 
                house.containsPoint(this.x + this.width, newY) ||
                house.containsPoint(this.x, newY + this.height) ||
                house.containsPoint(this.x + this.width, newY + this.height)) {
                canMoveY = false;
            }
        }
        
        if (canMoveX) this.x = newX;
        if (canMoveY) this.y = newY;
        
        // Limitar aos limites do mapa
        this.x = MathUtils.clamp(this.x, 0, 2000 - this.width);
        this.y = MathUtils.clamp(this.y, 0, 2000 - this.height);
        
        // Atualizar ângulo baseado no movimento ou target
        if (this.target) {
            const targetPos = this.target.getCenter();
            this.angle = MathUtils.angleBetween(
                currentPos.x, currentPos.y,
                targetPos.x, targetPos.y
            );
        } else if (this.velocity.magnitude() > 0) {
            this.angle = this.velocity.angle();
        }
    }
    
    updateCombat(deltaTime, player, otherBots) {
        if (this.state !== 'combat' && this.state !== 'flee') return;
        
        const weapon = this.getCurrentWeapon();
        if (!weapon || weapon.currentAmmo <= 0) {
            this.reload();
            return;
        }
        
        if (this.target && this.isTargetAlive(this.target)) {
            const distance = this.getDistanceTo(this.target);
            const weapon = this.getCurrentWeapon();
            
            if (distance < weapon.range && this.hasLineOfSight(this.target)) {
                const timeSinceLastShot = Date.now() - this.lastShotTime;
                const fireRate = weapon.fireRate * 1000 * (2 - this.personality.aggression);
                
                if (timeSinceLastShot >= fireRate) {
                    this.shoot();
                }
            }
        }
    }
    
    shoot() {
        const weapon = this.getCurrentWeapon();
        if (!weapon || weapon.currentAmmo <= 0) return null;
        
        weapon.currentAmmo--;
        this.lastShotTime = Date.now();
        
        // Calcular precisão baseada na personalidade e distância
        const targetCenter = this.target.getCenter();
        const distance = this.getDistanceTo(this.target);
        const maxRange = weapon.range;
        const distanceAccuracy = 1 - (distance / maxRange) * 0.5;
        const finalAccuracy = this.personality.accuracy * distanceAccuracy;
        
        // Aplicar imprecisão
        const spread = (1 - finalAccuracy) * MathUtils.degToRad(20);
        const baseAngle = MathUtils.angleBetween(
            this.x + this.width / 2, this.y + this.height / 2,
            targetCenter.x, targetCenter.y
        );
        const shotAngle = baseAngle + MathUtils.random(-spread, spread);
        
        // Criar bala
        const bulletX = this.x + this.width / 2 + Math.cos(shotAngle) * 15;
        const bulletY = this.y + this.height / 2 + Math.sin(shotAngle) * 15;
        
        const bullet = new Bullet(
            bulletX, bulletY, shotAngle,
            weapon.bulletSpeed || 800,
            weapon.damage, weapon.range, this
        );
        
        // Efeitos
        this.muzzleFlashTimer = 0.1;
        EffectsManager.addMuzzleFlash(bulletX, bulletY);
        
        return bullet;
    }
    
    reload() {
        const weapon = this.getCurrentWeapon();
        if (!weapon) return;
        
        const ammoNeeded = weapon.maxAmmo - weapon.currentAmmo;
        const ammoToReload = Math.min(ammoNeeded, weapon.reserveAmmo);
        
        weapon.currentAmmo += ammoToReload;
        weapon.reserveAmmo -= ammoToReload;
    }
    
    scanForLoot(gameMap) {
        const center = this.getCenter();
        const scanRange = 150;
        
        this.knownLoot = gameMap.lootContainers.filter(loot => {
            if (loot.collected) return false;
            const distance = MathUtils.distance(
                center.x, center.y,
                loot.x + loot.width / 2,
                loot.y + loot.height / 2
            );
            return distance <= scanRange;
        });
    }
    
    scanForEnemies(player, otherBots) {
        const center = this.getCenter();
        this.knownEnemies = [];
        
        // Verificar jogador
        const playerDistance = this.getDistanceTo(player);
        if (playerDistance <= this.detectionRange && this.hasLineOfSight(player)) {
            this.knownEnemies.push(player);
        }
        
        // Verificar outros bots
        for (const bot of otherBots) {
            if (bot === this || !bot.isAlive) continue;
            
            const botDistance = this.getDistanceTo(bot);
            if (botDistance <= this.detectionRange && this.hasLineOfSight(bot)) {
                this.knownEnemies.push(bot);
            }
        }
    }
    
    findNearestEnemy(player, otherBots) {
        let nearest = null;
        let nearestDistance = Infinity;
        
        // Verificar jogador
        if (this.isTargetAlive(player)) {
            const distance = this.getDistanceTo(player);
            if (distance < nearestDistance && distance <= this.detectionRange) {
                nearest = player;
                nearestDistance = distance;
            }
        }
        
        // Verificar outros bots
        for (const bot of otherBots) {
            if (bot === this || !bot.isAlive) continue;
            
            const distance = this.getDistanceTo(bot);
            if (distance < nearestDistance && distance <= this.detectionRange) {
                nearest = bot;
                nearestDistance = distance;
            }
        }
        
        return nearest;
    }
    
    findNearestLoot() {
        if (this.knownLoot.length === 0) return null;
        
        const center = this.getCenter();
        let nearest = null;
        let nearestDistance = Infinity;
        
        for (const loot of this.knownLoot) {
            const distance = MathUtils.distance(
                center.x, center.y,
                loot.x + loot.width / 2,
                loot.y + loot.height / 2
            );
            
            if (distance < nearestDistance) {
                nearest = loot;
                nearestDistance = distance;
            }
        }
        
        return nearest;
    }
    
    needsLoot() {
        const weapon = this.getCurrentWeapon();
        
        // Precisa de arma melhor
        if (!weapon || weapon.name === 'Pistola') return true;
        
        // Precisa de munição
        if (weapon.currentAmmo + weapon.reserveAmmo < 30) return true;
        
        // Precisa de vida
        if (this.health < 70) return true;
        
        // Precisa de armadura
        if (this.armor < 50) return true;
        
        return false;
    }
    
    hasLineOfSight(target) {
        // Simplificado - apenas verificar se não há casas grandes no caminho
        return true; // TODO: Implementar raycasting real se necessário
    }
    
    hasReachedTarget() {
        if (!this.targetPosition) return true;
        
        const center = this.getCenter();
        const distance = center.distance(this.targetPosition);
        return distance < 30;
    }
    
    setExploreTarget(gameMap) {
        // Escolher casa não visitada ou posição aleatória na zona segura
        const unvisitedHouses = gameMap.houses.filter(house => 
            !this.visitedHouses.includes(house)
        );
        
        if (unvisitedHouses.length > 0 && Math.random() < this.personality.lootGreed) {
            const house = MathUtils.randomChoice(unvisitedHouses);
            this.targetPosition = new Vector2(
                house.x + house.width / 2,
                house.y + house.height / 2
            );
            this.visitedHouses.push(house);
        } else {
            // Posição aleatória na zona segura
            const safeZone = gameMap.safeZone;
            if (safeZone) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * safeZone.currentRadius * 0.8;
                this.targetPosition = new Vector2(
                    safeZone.centerX + Math.cos(angle) * radius,
                    safeZone.centerY + Math.sin(angle) * radius
                );
            }
        }
    }
    
    findAlternativePosition(houses) {
        // Tentar contornar obstáculo
        const center = this.getCenter();
        const angles = [Math.PI/4, -Math.PI/4, Math.PI/2, -Math.PI/2];
        
        for (const angle of angles) {
            const testPos = center.add(Vector2.fromAngle(angle, 100));
            
            // Verificar se posição é válida
            let valid = true;
            for (const house of houses) {
                if (house.containsPoint(testPos.x, testPos.y)) {
                    valid = false;
                    break;
                }
            }
            
            if (valid) {
                return testPos;
            }
        }
        
        // Se nenhuma posição válida, mover aleatoriamente
        const randomAngle = Math.random() * Math.PI * 2;
        return center.add(Vector2.fromAngle(randomAngle, 150));
    }
    
    calculateFlankPosition(target) {
        const targetCenter = target.getCenter();
        const myCenter = this.getCenter();
        const direction = myCenter.subtract(targetCenter).normalize();
        
        // Calcular posição de flanco perpendicular
        const perpendicular = new Vector2(-direction.y, direction.x);
        const flankDirection = Math.random() < 0.5 ? perpendicular : perpendicular.multiply(-1);
        
        return myCenter.add(flankDirection.multiply(100));
    }
    
    getCurrentWeapon() {
        return this.weapons[this.currentWeaponIndex];
    }
    
    getCenter() {
        return new Vector2(this.x + this.width / 2, this.y + this.height / 2);
    }
    
    getDistanceTo(target) {
        const myCenter = this.getCenter();
        const targetCenter = target.getCenter();
        return myCenter.distance(targetCenter);
    }
    
    isTargetAlive(target) {
        if (!target) return false;
        if (typeof target.isAlive === 'function') {
            return target.isAlive();
        }
        if (typeof target.isAlive === 'boolean') {
            return target.isAlive;
        }
        return false;
    }
    
    takeDamage(damage) {
        // Armadura absorve parte do dano
        if (this.armor > 0) {
            const armorAbsorption = Math.min(damage * 0.7, this.armor);
            this.armor -= armorAbsorption;
            damage -= armorAbsorption;
        }
        
        this.health -= damage;
        this.health = Math.max(0, this.health);
        this.hitFlashTimer = 0.2;
        this.nameDisplayTimer = 3.0; // Mostrar nome quando atingido
        
        EffectsManager.addBloodSplatter(
            this.x + this.width / 2,
            this.y + this.height / 2
        );
        
        return this.health <= 0;
    }
    
    addItem(item) {
        if (!item) return false;
        
        switch (item.type) {
            case 'weapon':
                return this.addWeapon(item);
            case 'armor':
                this.armor = Math.min(this.maxArmor, this.armor + item.data.protection);
                return true;
            case 'health':
                this.health = Math.min(this.maxHealth, this.health + item.data.healing);
                return true;
            case 'ammo':
                return this.addAmmo(item.data.amount);
        }
        return false;
    }
    
    addWeapon(weaponData) {
        // Procurar slot vazio ou substituir pistola
        for (let i = 0; i < this.weapons.length; i++) {
            if (!this.weapons[i] || this.weapons[i].name === 'Pistola') {
                // Criar arma baseada no nome
                let newWeapon;
                switch(weaponData.name || weaponData) {
                    case 'SMG':
                        newWeapon = Weapon.createSMG();
                        break;
                    case 'Rifle de Assalto':
                        newWeapon = Weapon.createAssaultRifle();
                        break;
                    case 'Shotgun':
                        newWeapon = Weapon.createShotgun();
                        break;
                    case 'Sniper':
                        newWeapon = Weapon.createSniper();
                        break;
                    case 'LMG':
                        newWeapon = Weapon.createLMG();
                        break;
                    default:
                        newWeapon = Weapon.createPistol();
                }
                
                this.weapons[i] = newWeapon;
                this.currentWeaponIndex = i;
                return true;
            }
        }
        return false;
    }
    
    addAmmo(amount) {
        const weapon = this.getCurrentWeapon();
        if (weapon) {
            weapon.reserveAmmo += amount;
            return true;
        }
        return false;
    }
    
    die() {
        this.isAlive = false;
        this.velocity = new Vector2(0, 0);
        
        // Efeito de morte
        EffectsManager.addBloodSplatter(
            this.x + this.width / 2,
            this.y + this.height / 2
        );
        
        console.log(`Bot ${this.name} foi eliminado após ${Math.round(this.timeAlive)}s`);
    }
    
    draw(ctx, camera) {
        if (!this.isAlive) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Efeito de flash quando atingido
        if (this.hitFlashTimer > 0) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(screenX - 2, screenY - 2, this.width + 4, this.height + 4);
        }
        
        // Corpo do bot (triângulo vermelho)
        ctx.save();
        ctx.translate(screenX + this.width / 2, screenY + this.height / 2);
        ctx.rotate(this.angle);
        
        // Desenhar triângulo (cor baseada na vida)
        const healthPercent = this.health / this.maxHealth;
        const red = Math.round(255 * (1 - healthPercent * 0.5));
        const green = Math.round(100 * healthPercent);
        ctx.fillStyle = `rgb(${red}, ${green}, 0)`;
        
        ctx.beginPath();
        ctx.moveTo(12, 0);   // Ponta do triângulo
        ctx.lineTo(-8, -6);  // Canto inferior esquerdo
        ctx.lineTo(-8, 6);   // Canto inferior direito
        ctx.closePath();
        ctx.fill();
        
        // Contorno
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Desenhar arma
        const weapon = this.getCurrentWeapon();
        if (weapon) {
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(8, 0);
            ctx.lineTo(16, 0);
            ctx.stroke();
        }
        
        ctx.restore();
        
        // Desenhar flash do tiro
        if (this.muzzleFlashTimer > 0) {
            const flashX = screenX + this.width / 2 + Math.cos(this.angle) * 18;
            const flashY = screenY + this.height / 2 + Math.sin(this.angle) * 18;
            
            ctx.fillStyle = '#FFAA00';
            ctx.beginPath();
            ctx.arc(flashX, flashY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Desenhar nome se necessário
        if (this.nameDisplayTimer > 0 || this.target) {
            ctx.fillStyle = '#FFFF00';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.name, screenX + this.width / 2, screenY - 8);
        }
        
        // Desenhar indicador de estado
        this.drawStateIndicator(ctx, screenX, screenY);
        
        // Desenhar barra de vida se ferido
        if (this.health < this.maxHealth) {
            this.drawHealthBar(ctx, screenX, screenY - 15);
        }
    }
    
    drawStateIndicator(ctx, screenX, screenY) {
        let color;
        switch (this.state) {
            case 'combat': color = '#FF0000'; break;
            case 'flee': color = '#FFFF00'; break;
            case 'zone': color = '#FF8800'; break;
            case 'loot': color = '#00FF00'; break;
            default: color = '#FFFFFF'; break;
        }
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(screenX + this.width - 3, screenY + 3, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawHealthBar(ctx, x, y) {
        const barWidth = this.width;
        const barHeight = 3;
        const healthPercent = this.health / this.maxHealth;
        
        // Fundo da barra
        ctx.fillStyle = '#333333';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Barra de vida
        ctx.fillStyle = healthPercent > 0.3 ? '#00FF00' : '#FF0000';
        ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
    }
}

// Gerenciador de Bots
class BotManager {
    constructor() {
        this.bots = [];
        this.maxBots = 139;
        this.spawnedBots = 0;
        this.aliveBots = 0;
        this.botsEliminated = 0;
    }
    
    spawnBots(gameMap) {
        console.log('Spawning 139 bots...');
        
        for (let i = 0; i < this.maxBots; i++) {
            const spawnPoint = gameMap.getRandomSpawnPoint();
            const bot = new Bot(spawnPoint.x, spawnPoint.y, i + 1);
            
            // Dar equipamento inicial variado
            this.giveInitialLoadout(bot);
            
            this.bots.push(bot);
            this.spawnedBots++;
        }
        
        this.aliveBots = this.spawnedBots;
        console.log(`${this.spawnedBots} bots spawned successfully!`);
    }
    
    giveInitialLoadout(bot) {
        // 30% chance de começar com arma melhor
        if (Math.random() < 0.3) {
            const weapons = ['SMG', 'Rifle de Assalto', 'Shotgun'];
            const weaponName = MathUtils.randomChoice(weapons);
            bot.addWeapon({ name: weaponName });
        }
        
        // Chance de armadura inicial
        if (Math.random() < 0.2) {
            bot.armor = MathUtils.randomInt(25, 50);
        }
    }
    
    update(deltaTime, gameMap, player, bullets) {
        this.aliveBots = 0;
        
        for (const bot of this.bots) {
            if (bot.isAlive) {
                bot.update(deltaTime, gameMap, player, this.bots, bullets);
                this.aliveBots++;
                
                // Bot coleta loot próximo automaticamente
                this.handleBotLootCollection(bot, gameMap);
            }
        }
    }
    
    handleBotLootCollection(bot, gameMap) {
        const center = bot.getCenter();
        const nearbyLoot = gameMap.getLootInArea(center.x, center.y, 25);
        
        for (const lootContainer of nearbyLoot) {
            if (lootContainer.canBeCollected(center.x, center.y)) {
                const item = lootContainer.collect();
                if (item) {
                    bot.addItem(item);
                }
            }
        }
    }
    
    getBotShots(deltaTime) {
        const bullets = [];
        
        for (const bot of this.bots) {
            if (bot.isAlive && bot.state === 'combat' && bot.target) {
                const bullet = bot.shoot();
                if (bullet) {
                    bullets.push(bullet);
                }
            }
        }
        
        return bullets;
    }
    
    checkBulletCollisions(bullets, player) {
        const results = [];
        
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            if (!bullet.active) continue;
            
            // Verificar colisão com jogador
            if (bullet.owner !== player && player.isAlive()) {
                const playerCenter = player.getCenter();
                const distance = MathUtils.distance(
                    bullet.x, bullet.y,
                    playerCenter.x, playerCenter.y
                );
                
                if (distance < 15) {
                    const died = player.takeDamage(bullet.damage);
                    bullet.active = false;
                    
                    if (died && bullet.owner.kills !== undefined) {
                        bullet.owner.kills++;
                        console.log(`${bullet.owner.name} eliminou o jogador!`);
                    }
                    
                    results.push({
                        type: 'player_hit',
                        shooter: bullet.owner,
                        damage: bullet.damage
                    });
                    continue;
                }
            }
            
            // Verificar colisão com bots
            for (const bot of this.bots) {
                if (!bot.isAlive || bot === bullet.owner) continue;
                
                const botCenter = bot.getCenter();
                const distance = MathUtils.distance(
                    bullet.x, bullet.y,
                    botCenter.x, botCenter.y
                );
                
                if (distance < 15) {
                    const died = bot.takeDamage(bullet.damage);
                    bullet.active = false;
                    
                    if (died) {
                        if (bullet.owner.kills !== undefined) {
                            bullet.owner.kills++;
                        }
                        
                        this.botsEliminated++;
                        
                        const shooterName = bullet.owner.name || 'Jogador';
                        console.log(`${shooterName} eliminou ${bot.name}!`);
                        
                        results.push({
                            type: 'bot_eliminated',
                            shooter: bullet.owner,
                            victim: bot
                        });
                    }
                    
                    break;
                }
            }
        }
        
        return results;
    }
    
    getAliveBots() {
        return this.bots.filter(bot => bot.isAlive);
    }
    
    getStats() {
        return {
            total: this.maxBots,
            alive: this.aliveBots,
            eliminated: this.botsEliminated,
            remaining: this.aliveBots + 1 // +1 para o jogador
        };
    }
    
    draw(ctx, camera) {
        for (const bot of this.bots) {
            if (bot.isAlive) {
                bot.draw(ctx, camera);
            }
        }
    }
    
    drawMinimap(ctx, scaleX, scaleY) {
        for (const bot of this.bots) {
            if (bot.isAlive) {
                const screenX = bot.x * scaleX;
                const screenY = bot.y * scaleY;
                
                // Cor baseada no estado
                let color = '#FF4444';
                if (bot.state === 'combat') color = '#FF0000';
                else if (bot.state === 'flee') color = '#FFAA00';
                else if (bot.state === 'zone') color = '#FF8800';
                
                ctx.fillStyle = color;
                ctx.fillRect(screenX - 1, screenY - 1, 2, 2);
            }
        }
    }
}