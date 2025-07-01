// Classe do jogador

class Player extends GameObject {
    constructor(x, y) {
        super(x, y, 20, 20);
        
        // Stats do jogador
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.maxArmor = 100;
        this.armor = 0;
        this.speed = 200; // pixels por segundo
        
        // Movimento
        this.velocity = new Vector2(0, 0);
        this.angle = 0; // Ângulo que o jogador está olhando
        
        // Combate
        this.weapons = [
            new Weapon('Rifle de Assalto', 30, 0.15, 500, 30, 90),
            null,
            null
        ];
        this.currentWeaponIndex = 0;
        this.isShooting = false;
        this.lastShotTime = 0;
        this.isAiming = false;
        
        // Inventário
        this.inventory = [];
        this.maxInventorySize = 8;
        
        // Estado
        this.kills = 0;
        this.isMoving = false;
        this.lastDamageTime = 0;
        
        // Efeitos visuais
        this.muzzleFlashTimer = 0;
        this.hitFlashTimer = 0;
    }
    
    getCurrentWeapon() {
        return this.weapons[this.currentWeaponIndex];
    }
    
    update(deltaTime, input, camera, houses) {
        this.handleInput(input, deltaTime);
        this.updateMovement(deltaTime, houses);
        this.updateCombat(deltaTime);
        this.updateEffects(deltaTime);
        
        // Atualizar ângulo baseado na posição do mouse
        const mouseWorldX = input.mouse.x + camera.x;
        const mouseWorldY = input.mouse.y + camera.y;
        this.angle = MathUtils.angleBetween(
            this.x + this.width / 2,
            this.y + this.height / 2,
            mouseWorldX,
            mouseWorldY
        );
    }
    
    handleInput(input, deltaTime) {
        // Movimento
        this.velocity.x = 0;
        this.velocity.y = 0;
        
        if (input.isKeyPressed('KeyW') || input.isKeyPressed('ArrowUp')) {
            this.velocity.y = -1;
        }
        if (input.isKeyPressed('KeyS') || input.isKeyPressed('ArrowDown')) {
            this.velocity.y = 1;
        }
        if (input.isKeyPressed('KeyA') || input.isKeyPressed('ArrowLeft')) {
            this.velocity.x = -1;
        }
        if (input.isKeyPressed('KeyD') || input.isKeyPressed('ArrowRight')) {
            this.velocity.x = 1;
        }
        
        // Normalizar movimento diagonal
        if (this.velocity.x !== 0 && this.velocity.y !== 0) {
            this.velocity = this.velocity.normalize();
        }
        
        this.isMoving = this.velocity.x !== 0 || this.velocity.y !== 0;
        
        // Tiro
        this.isShooting = input.isMousePressed('left');
        this.isAiming = input.isMousePressed('right');
        
        // Trocar arma
        if (input.isKeyPressed('Digit1')) this.switchWeapon(0);
        if (input.isKeyPressed('Digit2')) this.switchWeapon(1);
        if (input.isKeyPressed('Digit3')) this.switchWeapon(2);
        
        // Recarregar
        if (input.isKeyPressed('KeyR')) {
            this.reload();
        }
    }
    
    updateMovement(deltaTime, houses) {
        if (!this.isMoving) return;
        
        // Aplicar velocidade baseada em movimento
        let moveSpeed = this.speed;
        if (this.isAiming) {
            moveSpeed *= 0.5; // Movimento mais lento quando mirando
        }
        
        const movement = this.velocity.multiply(moveSpeed * deltaTime);
        const newX = this.x + movement.x;
        const newY = this.y + movement.y;
        
        // Verificar colisão com casas
        let canMoveX = true;
        let canMoveY = true;
        
        for (const house of houses) {
            // Verificar colisão X
            if (house.containsPoint(newX, this.y) || 
                house.containsPoint(newX + this.width, this.y) ||
                house.containsPoint(newX, this.y + this.height) ||
                house.containsPoint(newX + this.width, this.y + this.height)) {
                canMoveX = false;
            }
            
            // Verificar colisão Y
            if (house.containsPoint(this.x, newY) || 
                house.containsPoint(this.x + this.width, newY) ||
                house.containsPoint(this.x, newY + this.height) ||
                house.containsPoint(this.x + this.width, newY + this.height)) {
                canMoveY = false;
            }
        }
        
        // Aplicar movimento se possível
        if (canMoveX) {
            this.x = newX;
        }
        if (canMoveY) {
            this.y = newY;
        }
        
        // Limitar aos limites do mapa
        this.x = MathUtils.clamp(this.x, 0, 2000 - this.width);
        this.y = MathUtils.clamp(this.y, 0, 2000 - this.height);
    }
    
    updateCombat(deltaTime) {
        const currentTime = Date.now();
        const weapon = this.getCurrentWeapon();
        
        if (this.isShooting && weapon && weapon.currentAmmo > 0) {
            if (currentTime - this.lastShotTime >= weapon.fireRate * 1000) {
                this.shoot();
                this.lastShotTime = currentTime;
            }
        }
    }
    
    updateEffects(deltaTime) {
        if (this.muzzleFlashTimer > 0) {
            this.muzzleFlashTimer -= deltaTime;
        }
        
        if (this.hitFlashTimer > 0) {
            this.hitFlashTimer -= deltaTime;
        }
    }
    
    shoot() {
        const weapon = this.getCurrentWeapon();
        if (!weapon || weapon.currentAmmo <= 0) return;
        
        weapon.currentAmmo--;
        
        // Calcular posição da bala
        const bulletX = this.x + this.width / 2 + Math.cos(this.angle) * 15;
        const bulletY = this.y + this.height / 2 + Math.sin(this.angle) * 15;
        
        // Adicionar dispersão se não estiver mirando
        let shotAngle = this.angle;
        if (!this.isAiming) {
            const spread = MathUtils.degToRad(5); // 5 graus de dispersão
            shotAngle += MathUtils.random(-spread, spread);
        }
        
        // Criar bala
        const bullet = new Bullet(
            bulletX,
            bulletY,
            shotAngle,
            weapon.bulletSpeed || 800,
            weapon.damage,
            weapon.range,
            this
        );
        
        // Efeitos
        this.muzzleFlashTimer = 0.1;
        EffectsManager.addMuzzleFlash(bulletX, bulletY);
        SoundManager.play('gunshot', 0.7);
        
        return bullet;
    }
    
    reload() {
        const weapon = this.getCurrentWeapon();
        if (!weapon) return;
        
        const ammoNeeded = weapon.maxAmmo - weapon.currentAmmo;
        const ammoToReload = Math.min(ammoNeeded, weapon.reserveAmmo);
        
        weapon.currentAmmo += ammoToReload;
        weapon.reserveAmmo -= ammoToReload;
        
        SoundManager.play('reload', 0.5);
    }
    
    switchWeapon(index) {
        if (index >= 0 && index < this.weapons.length && this.weapons[index]) {
            this.currentWeaponIndex = index;
            SoundManager.play('weapon_switch', 0.3);
        }
    }
    
    addItem(item) {
        if (!item) return false;
        
        switch (item.type) {
            case 'weapon':
                return this.addWeapon(item);
            case 'armor':
                this.armor = Math.min(this.maxArmor, this.armor + item.protection);
                return true;
            case 'health':
                this.health = Math.min(this.maxHealth, this.health + item.healing);
                return true;
            case 'ammo':
                return this.addAmmo(item.amount);
            default:
                return this.addToInventory(item);
        }
    }
    
    addWeapon(weaponData) {
        // Procurar slot vazio
        for (let i = 0; i < this.weapons.length; i++) {
            if (!this.weapons[i]) {
                this.weapons[i] = new Weapon(
                    weaponData.name,
                    weaponData.damage,
                    weaponData.fireRate,
                    weaponData.range
                );
                return true;
            }
        }
        
        // Substituir arma atual se não houver slots vazios
        this.weapons[this.currentWeaponIndex] = new Weapon(
            weaponData.name,
            weaponData.damage,
            weaponData.fireRate,
            weaponData.range
        );
        return true;
    }
    
    addAmmo(amount) {
        const weapon = this.getCurrentWeapon();
        if (weapon) {
            weapon.reserveAmmo += amount;
            return true;
        }
        return false;
    }
    
    addToInventory(item) {
        if (this.inventory.length < this.maxInventorySize) {
            this.inventory.push(item);
            return true;
        }
        return false;
    }
    
    takeDamage(damage) {
        const currentTime = Date.now();
        
        // Armadura absorve parte do dano
        if (this.armor > 0) {
            const armorAbsorption = Math.min(damage * 0.7, this.armor);
            this.armor -= armorAbsorption;
            damage -= armorAbsorption;
        }
        
        this.health -= damage;
        this.health = Math.max(0, this.health);
        this.lastDamageTime = currentTime;
        this.hitFlashTimer = 0.2;
        
        EffectsManager.addBloodSplatter(
            this.x + this.width / 2,
            this.y + this.height / 2
        );
        
        SoundManager.play('player_hit', 0.6);
        
        return this.health <= 0;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    addArmor(amount) {
        this.armor = Math.min(this.maxArmor, this.armor + amount);
    }
    
    isAlive() {
        return this.health > 0;
    }
    
    draw(ctx, camera) {
        if (!this.active) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Efeito de flash quando atingido
        if (this.hitFlashTimer > 0) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(screenX - 2, screenY - 2, this.width + 4, this.height + 4);
        }
        
        // Corpo do jogador (triângulo)
        ctx.save();
        ctx.translate(screenX + this.width / 2, screenY + this.height / 2);
        ctx.rotate(this.angle);
        
        // Desenhar triângulo
        ctx.fillStyle = Colors.PLAYER;
        ctx.beginPath();
        ctx.moveTo(15, 0);  // Ponta do triângulo
        ctx.lineTo(-10, -8); // Canto inferior esquerdo
        ctx.lineTo(-10, 8);  // Canto inferior direito
        ctx.closePath();
        ctx.fill();
        
        // Contorno
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Desenhar arma
        const weapon = this.getCurrentWeapon();
        if (weapon) {
            ctx.strokeStyle = '#444444';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(20, 0);
            ctx.stroke();
        }
        
        ctx.restore();
        
        // Desenhar flash do tiro
        if (this.muzzleFlashTimer > 0) {
            const flashX = screenX + this.width / 2 + Math.cos(this.angle) * 20;
            const flashY = screenY + this.height / 2 + Math.sin(this.angle) * 20;
            
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(flashX, flashY, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Desenhar barra de vida
        this.drawHealthBar(ctx, screenX, screenY - 10);
        
        // Desenhar barra de armadura se houver
        if (this.armor > 0) {
            this.drawArmorBar(ctx, screenX, screenY - 20);
        }
    }
    
    drawHealthBar(ctx, x, y) {
        const barWidth = this.width;
        const barHeight = 4;
        const healthPercent = this.health / this.maxHealth;
        
        // Fundo da barra
        ctx.fillStyle = '#333333';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Barra de vida
        ctx.fillStyle = healthPercent > 0.3 ? '#00FF00' : '#FF0000';
        ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
        
        // Contorno
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, barHeight);
    }
    
    drawArmorBar(ctx, x, y) {
        const barWidth = this.width;
        const barHeight = 4;
        const armorPercent = this.armor / this.maxArmor;
        
        // Fundo da barra
        ctx.fillStyle = '#333333';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Barra de armadura
        ctx.fillStyle = '#00AAFF';
        ctx.fillRect(x, y, barWidth * armorPercent, barHeight);
        
        // Contorno
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, barHeight);
    }
    
    getCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }
}