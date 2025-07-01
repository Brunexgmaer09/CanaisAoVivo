// Objetos base do jogo

class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    collidesWith(other) {
        return CollisionUtils.rectIntersect(
            this.x, this.y, this.width, this.height,
            other.x, other.y, other.width, other.height
        );
    }
    
    containsPoint(px, py) {
        return CollisionUtils.pointInRect(px, py, this.x, this.y, this.width, this.height);
    }
}

// Casa/Edifício
class House extends GameObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.color = Colors.HOUSE;
        this.doorX = x + width / 2 - 10;
        this.doorY = y + height - 5;
        this.doorWidth = 20;
        this.doorHeight = 5;
        this.rooms = this.generateRooms();
    }
    
    generateRooms() {
        const rooms = [];
        const roomWidth = this.width / 2;
        const roomHeight = this.height / 2;
        
        // Dividir a casa em quartos
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                rooms.push({
                    x: this.x + i * roomWidth,
                    y: this.y + j * roomHeight,
                    width: roomWidth,
                    height: roomHeight
                });
            }
        }
        
        return rooms;
    }
    
    draw(ctx, camera) {
        if (!this.active) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Desenhar casa principal
        ctx.fillStyle = this.color;
        ctx.fillRect(screenX, screenY, this.width, this.height);
        
        // Desenhar contorno
        ctx.strokeStyle = '#4A4A4A';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX, screenY, this.width, this.height);
        
        // Desenhar divisões dos quartos
        ctx.strokeStyle = '#5A5A5A';
        ctx.lineWidth = 1;
        
        // Linha vertical
        ctx.beginPath();
        ctx.moveTo(screenX + this.width / 2, screenY);
        ctx.lineTo(screenX + this.width / 2, screenY + this.height);
        ctx.stroke();
        
        // Linha horizontal
        ctx.beginPath();
        ctx.moveTo(screenX, screenY + this.height / 2);
        ctx.lineTo(screenX + this.width, screenY + this.height / 2);
        ctx.stroke();
        
        // Desenhar porta
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(screenX + this.width / 2 - 10, screenY + this.height - 5, 20, 5);
    }
    
    isInsideHouse(x, y) {
        return this.containsPoint(x, y);
    }
    
    getRandomPositionInside() {
        return {
            x: this.x + MathUtils.random(10, this.width - 10),
            y: this.y + MathUtils.random(10, this.height - 10)
        };
    }
}

// Bala
class Bullet extends GameObject {
    constructor(x, y, angle, speed, damage, range, owner) {
        super(x, y, 4, 4);
        this.angle = angle;
        this.speed = speed;
        this.damage = damage;
        this.range = range;
        this.owner = owner;
        this.distanceTraveled = 0;
        this.velocity = Vector2.fromAngle(angle, speed);
    }
    
    update(deltaTime) {
        if (!this.active) return;
        
        // Mover a bala
        const movement = this.velocity.multiply(deltaTime);
        this.x += movement.x;
        this.y += movement.y;
        this.distanceTraveled += movement.magnitude();
        
        // Verificar se excedeu o alcance
        if (this.distanceTraveled >= this.range) {
            this.active = false;
        }
    }
    
    draw(ctx, camera) {
        if (!this.active) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        ctx.fillStyle = Colors.BULLET;
        ctx.beginPath();
        ctx.arc(screenX, screenY, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Desenhar rastro
        const trailLength = 10;
        const trailX = screenX - Math.cos(this.angle) * trailLength;
        const trailY = screenY - Math.sin(this.angle) * trailLength;
        
        ctx.strokeStyle = Colors.BULLET;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(trailX, trailY);
        ctx.lineTo(screenX, screenY);
        ctx.stroke();
    }
    
    checkCollisionWithHouses(houses) {
        for (const house of houses) {
            if (house.containsPoint(this.x, this.y)) {
                this.active = false;
                return true;
            }
        }
        return false;
    }
}

// Caixa de loot
class LootBox extends GameObject {
    constructor(x, y, lootType) {
        super(x, y, 20, 20);
        this.lootType = lootType;
        this.collected = false;
        this.item = this.generateItem();
        this.color = this.getColorByType();
        this.pulseTimer = 0;
    }
    
    generateItem() {
        switch (this.lootType) {
            case 'weapon':
                return {
                    type: 'weapon',
                    name: MathUtils.randomChoice(['Rifle de Assalto', 'Shotgun', 'Sniper', 'SMG']),
                    damage: MathUtils.randomInt(25, 50),
                    fireRate: MathUtils.random(0.1, 0.5),
                    range: MathUtils.randomInt(300, 800)
                };
            case 'armor':
                return {
                    type: 'armor',
                    name: 'Colete',
                    protection: MathUtils.randomInt(25, 75)
                };
            case 'health':
                return {
                    type: 'health',
                    name: 'Kit Médico',
                    healing: MathUtils.randomInt(25, 100)
                };
            case 'ammo':
                return {
                    type: 'ammo',
                    name: 'Munição',
                    amount: MathUtils.randomInt(30, 90)
                };
            default:
                return this.generateItem(); // Recursão para garantir um item válido
        }
    }
    
    getColorByType() {
        switch (this.lootType) {
            case 'weapon': return Colors.LOOT_WEAPON;
            case 'armor': return Colors.LOOT_ARMOR;
            case 'health': return Colors.LOOT_HEALTH;
            case 'ammo': return Colors.LOOT_AMMO;
            default: return '#FFFFFF';
        }
    }
    
    update(deltaTime) {
        if (this.collected) return;
        
        this.pulseTimer += deltaTime;
    }
    
    draw(ctx, camera) {
        if (this.collected) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Efeito de pulsação
        const pulse = 1 + Math.sin(this.pulseTimer * 5) * 0.2;
        const size = this.width * pulse;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(
            screenX - (size - this.width) / 2,
            screenY - (size - this.height) / 2,
            size,
            size
        );
        
        // Contorno
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            screenX - (size - this.width) / 2,
            screenY - (size - this.height) / 2,
            size,
            size
        );
        
        // Desenhar símbolo do tipo
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        let symbol = '';
        switch (this.lootType) {
            case 'weapon': symbol = '⚔'; break;
            case 'armor': symbol = '🛡'; break;
            case 'health': symbol = '+'; break;
            case 'ammo': symbol = '•'; break;
        }
        
        ctx.fillText(symbol, screenX + this.width / 2, screenY + this.height / 2 + 4);
    }
    
    canBeCollected(playerX, playerY, collectRange = 30) {
        const distance = MathUtils.distance(playerX, playerY, this.x + this.width / 2, this.y + this.height / 2);
        return distance <= collectRange && !this.collected;
    }
    
    collect() {
        this.collected = true;
        this.active = false;
        return this.item;
    }
}

// Zona de segurança (círculo que se fecha)
class SafeZone {
    constructor(centerX, centerY, initialRadius) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.currentRadius = initialRadius;
        this.targetRadius = initialRadius;
        this.shrinkSpeed = 0;
        this.damagePerSecond = 5;
        this.isActive = false;
    }
    
    startShrinking(targetRadius, duration) {
        this.targetRadius = targetRadius;
        this.shrinkSpeed = (this.currentRadius - targetRadius) / duration;
        this.isActive = true;
    }
    
    update(deltaTime) {
        if (!this.isActive || this.currentRadius <= this.targetRadius) {
            this.isActive = false;
            return;
        }
        
        this.currentRadius -= this.shrinkSpeed * deltaTime;
        if (this.currentRadius < this.targetRadius) {
            this.currentRadius = this.targetRadius;
            this.isActive = false;
        }
    }
    
    draw(ctx, camera) {
        const screenX = this.centerX - camera.x;
        const screenY = this.centerY - camera.y;
        
        // Desenhar zona segura
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.currentRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Desenhar zona de dano (área fora do círculo)
        ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        ctx.fillRect(-camera.x, -camera.y, 2000, 2000); // Preencher tudo
        
        // "Apagar" a zona segura
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.currentRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }
    
    isPointInside(x, y) {
        const distance = MathUtils.distance(x, y, this.centerX, this.centerY);
        return distance <= this.currentRadius;
    }
    
    getDistanceFromEdge(x, y) {
        const distance = MathUtils.distance(x, y, this.centerX, this.centerY);
        return this.currentRadius - distance;
    }
}