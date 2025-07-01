// Sistema de loot e itens

const LootType = {
    WEAPON: 'weapon',
    ARMOR: 'armor',
    HEALTH: 'health',
    AMMO: 'ammo',
    ATTACHMENT: 'attachment'
};

const ItemRarity = {
    COMMON: { name: 'Comum', color: '#FFFFFF', weight: 50 },
    UNCOMMON: { name: 'Incomum', color: '#00FF00', weight: 30 },
    RARE: { name: 'Raro', color: '#0080FF', weight: 15 },
    EPIC: { name: 'Épico', color: '#8000FF', weight: 4 },
    LEGENDARY: { name: 'Lendário', color: '#FF8000', weight: 1 }
};

class LootItem {
    constructor(type, data, rarity = ItemRarity.COMMON) {
        this.type = type;
        this.data = data;
        this.rarity = rarity;
        this.id = this.generateId();
    }
    
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    getName() {
        switch (this.type) {
            case LootType.WEAPON:
                return this.data.name;
            case LootType.ARMOR:
                return `Colete (${this.data.protection} de proteção)`;
            case LootType.HEALTH:
                return `${this.data.name} (+${this.data.healing} vida)`;
            case LootType.AMMO:
                return `Munição (${this.data.amount} rounds)`;
            case LootType.ATTACHMENT:
                return this.data.name;
            default:
                return 'Item Desconhecido';
        }
    }
    
    getDescription() {
        switch (this.type) {
            case LootType.WEAPON:
                return `Dano: ${this.data.damage} | Alcance: ${this.data.range}m | Munição: ${this.data.maxAmmo}`;
            case LootType.ARMOR:
                return `Proteção: ${this.data.protection} pontos`;
            case LootType.HEALTH:
                return `Restaura ${this.data.healing} pontos de vida`;
            case LootType.AMMO:
                return `${this.data.amount} rounds de munição`;
            case LootType.ATTACHMENT:
                return this.data.description || 'Anexo para arma';
            default:
                return '';
        }
    }
    
    getIcon() {
        switch (this.type) {
            case LootType.WEAPON:
                return '🔫';
            case LootType.ARMOR:
                return '🛡️';
            case LootType.HEALTH:
                return '💊';
            case LootType.AMMO:
                return '📦';
            case LootType.ATTACHMENT:
                return '🔧';
            default:
                return '❓';
        }
    }
}

class LootGenerator {
    static generateRandomLoot() {
        const lootTypes = Object.values(LootType);
        const randomType = MathUtils.randomChoice(lootTypes);
        const rarity = this.getRandomRarity();
        
        switch (randomType) {
            case LootType.WEAPON:
                return this.generateWeapon(rarity);
            case LootType.ARMOR:
                return this.generateArmor(rarity);
            case LootType.HEALTH:
                return this.generateHealth(rarity);
            case LootType.AMMO:
                return this.generateAmmo(rarity);
            case LootType.ATTACHMENT:
                return this.generateAttachment(rarity);
        }
    }
    
    static getRandomRarity() {
        const rarities = Object.values(ItemRarity);
        const totalWeight = rarities.reduce((sum, rarity) => sum + rarity.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const rarity of rarities) {
            random -= rarity.weight;
            if (random <= 0) {
                return rarity;
            }
        }
        
        return ItemRarity.COMMON;
    }
    
    static generateWeapon(rarity) {
        const weapons = [
            { name: 'Pistola', damage: 25, fireRate: 0.3, range: 250, maxAmmo: 15 },
            { name: 'SMG', damage: 20, fireRate: 0.08, range: 300, maxAmmo: 40 },
            { name: 'Rifle de Assalto', damage: 30, fireRate: 0.15, range: 500, maxAmmo: 30 },
            { name: 'Shotgun', damage: 80, fireRate: 0.8, range: 200, maxAmmo: 8 },
            { name: 'Sniper', damage: 100, fireRate: 1.5, range: 800, maxAmmo: 5 },
            { name: 'LMG', damage: 35, fireRate: 0.12, range: 600, maxAmmo: 100 }
        ];
        
        const baseWeapon = MathUtils.randomChoice(weapons);
        
        // Aplicar modificadores baseados na raridade
        const rarityMultiplier = this.getRarityMultiplier(rarity);
        const weaponData = {
            ...baseWeapon,
            damage: Math.round(baseWeapon.damage * rarityMultiplier),
            range: Math.round(baseWeapon.range * rarityMultiplier),
            fireRate: baseWeapon.fireRate / rarityMultiplier
        };
        
        return new LootItem(LootType.WEAPON, weaponData, rarity);
    }
    
    static generateArmor(rarity) {
        const baseProtection = 25;
        const rarityMultiplier = this.getRarityMultiplier(rarity);
        
        const armorData = {
            protection: Math.round(baseProtection * rarityMultiplier),
            name: 'Colete'
        };
        
        return new LootItem(LootType.ARMOR, armorData, rarity);
    }
    
    static generateHealth(rarity) {
        const healthItems = [
            { name: 'Bandagem', healing: 25 },
            { name: 'Kit Médico', healing: 50 },
            { name: 'Seringa', healing: 75 },
            { name: 'Kit Médico Avançado', healing: 100 }
        ];
        
        const baseItem = MathUtils.randomChoice(healthItems);
        const rarityMultiplier = this.getRarityMultiplier(rarity);
        
        const healthData = {
            ...baseItem,
            healing: Math.round(baseItem.healing * rarityMultiplier)
        };
        
        return new LootItem(LootType.HEALTH, healthData, rarity);
    }
    
    static generateAmmo(rarity) {
        const baseAmount = 30;
        const rarityMultiplier = this.getRarityMultiplier(rarity);
        
        const ammoData = {
            amount: Math.round(baseAmount * rarityMultiplier),
            type: 'universal'
        };
        
        return new LootItem(LootType.AMMO, ammoData, rarity);
    }
    
    static generateAttachment(rarity) {
        const attachments = [
            { name: 'Mira Telescópica', effect: { accuracy: 0.1, range: 100 } },
            { name: 'Silenciador', effect: { damage: -5, accuracy: 0.05 } },
            { name: 'Carregador Estendido', effect: { maxAmmo: 15 } },
            { name: 'Punho Frontal', effect: { accuracy: 0.08, fireRate: -0.02 } },
            { name: 'Compensador', effect: { accuracy: 0.12, fireRate: 0.01 } },
            { name: 'Laser', effect: { accuracy: 0.06 } }
        ];
        
        const baseAttachment = MathUtils.randomChoice(attachments);
        const rarityMultiplier = this.getRarityMultiplier(rarity);
        
        // Aplicar multiplicador aos efeitos
        const enhancedEffect = {};
        for (const [key, value] of Object.entries(baseAttachment.effect)) {
            enhancedEffect[key] = value * rarityMultiplier;
        }
        
        const attachmentData = {
            ...baseAttachment,
            effect: enhancedEffect,
            description: `Melhora as estatísticas da arma`
        };
        
        return new LootItem(LootType.ATTACHMENT, attachmentData, rarity);
    }
    
    static getRarityMultiplier(rarity) {
        switch (rarity) {
            case ItemRarity.COMMON: return 1.0;
            case ItemRarity.UNCOMMON: return 1.2;
            case ItemRarity.RARE: return 1.4;
            case ItemRarity.EPIC: return 1.6;
            case ItemRarity.LEGENDARY: return 2.0;
            default: return 1.0;
        }
    }
    
    static generateLootForHouse(houseSize) {
        const lootCount = Math.min(Math.max(Math.floor(houseSize / 1000), 2), 6);
        const loot = [];
        
        for (let i = 0; i < lootCount; i++) {
            loot.push(this.generateRandomLoot());
        }
        
        return loot;
    }
    
    static generateLootBox(x, y, lootType = null) {
        const item = lootType ? this.generateSpecificLoot(lootType) : this.generateRandomLoot();
        return new LootContainer(x, y, item);
    }
    
    static generateSpecificLoot(type) {
        const rarity = this.getRandomRarity();
        
        switch (type) {
            case LootType.WEAPON:
                return this.generateWeapon(rarity);
            case LootType.ARMOR:
                return this.generateArmor(rarity);
            case LootType.HEALTH:
                return this.generateHealth(rarity);
            case LootType.AMMO:
                return this.generateAmmo(rarity);
            case LootType.ATTACHMENT:
                return this.generateAttachment(rarity);
            default:
                return this.generateRandomLoot();
        }
    }
}

class LootContainer extends GameObject {
    constructor(x, y, item) {
        super(x, y, 24, 24);
        this.item = item;
        this.collected = false;
        this.pulseTimer = 0;
        this.glowIntensity = 0;
        this.interactionRange = 40;
    }
    
    update(deltaTime) {
        if (this.collected) return;
        
        this.pulseTimer += deltaTime * 3;
        this.glowIntensity = (Math.sin(this.pulseTimer) + 1) / 2;
    }
    
    draw(ctx, camera) {
        if (this.collected) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Desenhar brilho baseado na raridade
        const glowRadius = 15 + this.glowIntensity * 10;
        const gradient = ctx.createRadialGradient(
            screenX + this.width / 2, screenY + this.height / 2, 0,
            screenX + this.width / 2, screenY + this.height / 2, glowRadius
        );
        
        gradient.addColorStop(0, this.item.rarity.color + '40');
        gradient.addColorStop(1, this.item.rarity.color + '00');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
            screenX - glowRadius,
            screenY - glowRadius,
            this.width + glowRadius * 2,
            this.height + glowRadius * 2
        );
        
        // Desenhar caixa principal
        ctx.fillStyle = '#2A2A2A';
        ctx.fillRect(screenX, screenY, this.width, this.height);
        
        // Desenhar borda da raridade
        ctx.strokeStyle = this.item.rarity.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX, screenY, this.width, this.height);
        
        // Desenhar ícone do item
        ctx.fillStyle = this.item.rarity.color;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            this.item.getIcon(),
            screenX + this.width / 2,
            screenY + this.height / 2 + 6
        );
        
        // Desenhar indicador de raridade
        const rarityDots = this.getRarityDots();
        for (let i = 0; i < rarityDots; i++) {
            ctx.fillStyle = this.item.rarity.color;
            ctx.beginPath();
            ctx.arc(
                screenX + 4 + i * 4,
                screenY + this.height - 4,
                1,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }
    
    getRarityDots() {
        switch (this.item.rarity) {
            case ItemRarity.COMMON: return 1;
            case ItemRarity.UNCOMMON: return 2;
            case ItemRarity.RARE: return 3;
            case ItemRarity.EPIC: return 4;
            case ItemRarity.LEGENDARY: return 5;
            default: return 1;
        }
    }
    
    canBeCollected(playerX, playerY) {
        const distance = MathUtils.distance(
            playerX, playerY,
            this.x + this.width / 2,
            this.y + this.height / 2
        );
        return distance <= this.interactionRange && !this.collected;
    }
    
    collect() {
        if (this.collected) return null;
        
        this.collected = true;
        this.active = false;
        
        // Efeitos visuais de coleta
        EffectsManager.addLootCollectionEffect(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.item.rarity.color
        );
        
        SoundManager.play('loot_pickup', 0.5);
        
        return this.item;
    }
    
    drawTooltip(ctx, camera, mouseX, mouseY) {
        if (this.collected) return;
        
        const distance = MathUtils.distance(
            mouseX + camera.x, mouseY + camera.y,
            this.x + this.width / 2,
            this.y + this.height / 2
        );
        
        if (distance > this.interactionRange) return;
        
        // Desenhar tooltip
        const tooltipWidth = 200;
        const tooltipHeight = 80;
        const tooltipX = mouseX + 10;
        const tooltipY = mouseY - tooltipHeight - 10;
        
        // Fundo do tooltip
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        
        // Borda do tooltip
        ctx.strokeStyle = this.item.rarity.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        
        // Texto do tooltip
        ctx.fillStyle = this.item.rarity.color;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(this.item.getName(), tooltipX + 10, tooltipY + 20);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.fillText(this.item.rarity.name, tooltipX + 10, tooltipY + 40);
        
        // Quebrar descrição em linhas
        const description = this.item.getDescription();
        const words = description.split(' ');
        let line = '';
        let y = tooltipY + 60;
        
        for (const word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > tooltipWidth - 20 && line !== '') {
                ctx.fillText(line, tooltipX + 10, y);
                line = word + ' ';
                y += 15;
            } else {
                line = testLine;
            }
        }
        
        if (line !== '') {
            ctx.fillText(line, tooltipX + 10, y);
        }
    }
}

// Expandir EffectsManager para incluir efeitos de loot
EffectsManager.addLootCollectionEffect = function(x, y, color) {
    for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10;
        const speed = MathUtils.random(50, 150);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        const particle = new Particle(
            x, y, vx, vy,
            color,
            800,
            MathUtils.random(2, 5)
        );
        
        this.particles.push(particle);
    }
};