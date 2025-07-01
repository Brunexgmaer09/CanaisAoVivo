// Sistema de armas

class Weapon {
    constructor(name, damage, fireRate, range, maxAmmo = 30, reserveAmmo = 90) {
        this.name = name;
        this.damage = damage;
        this.fireRate = fireRate; // Tempo entre tiros em segundos
        this.range = range;
        this.maxAmmo = maxAmmo;
        this.currentAmmo = maxAmmo;
        this.reserveAmmo = reserveAmmo;
        this.bulletSpeed = 800;
        this.accuracy = 0.95; // 0-1, onde 1 é 100% preciso
        this.reloadTime = 2.0; // Segundos para recarregar
        
        // Definir características específicas baseadas no nome
        this.setupWeaponStats();
    }
    
    setupWeaponStats() {
        switch (this.name.toLowerCase()) {
            case 'rifle de assalto':
                this.damage = 30;
                this.fireRate = 0.15;
                this.range = 500;
                this.maxAmmo = 30;
                this.bulletSpeed = 900;
                this.accuracy = 0.85;
                this.reloadTime = 2.0;
                break;
                
            case 'shotgun':
                this.damage = 80;
                this.fireRate = 0.8;
                this.range = 200;
                this.maxAmmo = 8;
                this.bulletSpeed = 600;
                this.accuracy = 0.7;
                this.reloadTime = 3.5;
                this.pellets = 8; // Número de projéteis por tiro
                break;
                
            case 'sniper':
                this.damage = 100;
                this.fireRate = 1.5;
                this.range = 800;
                this.maxAmmo = 5;
                this.bulletSpeed = 1200;
                this.accuracy = 0.98;
                this.reloadTime = 3.0;
                break;
                
            case 'smg':
                this.damage = 20;
                this.fireRate = 0.08;
                this.range = 300;
                this.maxAmmo = 40;
                this.bulletSpeed = 700;
                this.accuracy = 0.75;
                this.reloadTime = 1.5;
                break;
                
            case 'pistola':
                this.damage = 25;
                this.fireRate = 0.3;
                this.range = 250;
                this.maxAmmo = 15;
                this.bulletSpeed = 650;
                this.accuracy = 0.8;
                this.reloadTime = 1.2;
                break;
                
            case 'lmg':
                this.damage = 35;
                this.fireRate = 0.12;
                this.range = 600;
                this.maxAmmo = 100;
                this.bulletSpeed = 850;
                this.accuracy = 0.7;
                this.reloadTime = 4.0;
                break;
        }
        
        // Garantir que a munição atual não exceda o máximo
        this.currentAmmo = Math.min(this.currentAmmo, this.maxAmmo);
    }
    
    canShoot() {
        return this.currentAmmo > 0;
    }
    
    shoot() {
        if (!this.canShoot()) return null;
        
        this.currentAmmo--;
        
        // Para shotgun, criar múltiplos projéteis
        if (this.name.toLowerCase() === 'shotgun') {
            return this.createShotgunPellets();
        }
        
        return this.createBullet();
    }
    
    createBullet(angleOffset = 0) {
        // Aplicar imprecisão baseada na accuracy da arma
        const inaccuracy = (1 - this.accuracy) * MathUtils.degToRad(10);
        const spread = MathUtils.random(-inaccuracy, inaccuracy) + angleOffset;
        
        return {
            damage: this.damage,
            speed: this.bulletSpeed,
            range: this.range,
            spread: spread
        };
    }
    
    createShotgunPellets() {
        const pellets = [];
        const spreadAngle = MathUtils.degToRad(30); // 30 graus de dispersão total
        
        for (let i = 0; i < this.pellets; i++) {
            const angleOffset = MathUtils.random(-spreadAngle/2, spreadAngle/2);
            pellets.push(this.createBullet(angleOffset));
        }
        
        return pellets;
    }
    
    reload() {
        if (this.reserveAmmo <= 0 || this.currentAmmo === this.maxAmmo) {
            return false;
        }
        
        const ammoNeeded = this.maxAmmo - this.currentAmmo;
        const ammoToReload = Math.min(ammoNeeded, this.reserveAmmo);
        
        this.currentAmmo += ammoToReload;
        this.reserveAmmo -= ammoToReload;
        
        return true;
    }
    
    addAmmo(amount) {
        this.reserveAmmo += amount;
    }
    
    getAmmoPercentage() {
        return this.currentAmmo / this.maxAmmo;
    }
    
    getTotalAmmo() {
        return this.currentAmmo + this.reserveAmmo;
    }
    
    isEmpty() {
        return this.currentAmmo === 0 && this.reserveAmmo === 0;
    }
    
    getStats() {
        return {
            name: this.name,
            damage: this.damage,
            fireRate: Math.round(60 / this.fireRate), // RPM
            range: this.range,
            accuracy: Math.round(this.accuracy * 100),
            currentAmmo: this.currentAmmo,
            maxAmmo: this.maxAmmo,
            reserveAmmo: this.reserveAmmo,
            reloadTime: this.reloadTime
        };
    }
    
    // Métodos estáticos para criar armas específicas
    static createAssaultRifle() {
        return new Weapon('Rifle de Assalto', 30, 0.15, 500, 30, 120);
    }
    
    static createShotgun() {
        return new Weapon('Shotgun', 80, 0.8, 200, 8, 32);
    }
    
    static createSniper() {
        return new Weapon('Sniper', 100, 1.5, 800, 5, 25);
    }
    
    static createSMG() {
        return new Weapon('SMG', 20, 0.08, 300, 40, 160);
    }
    
    static createPistol() {
        return new Weapon('Pistola', 25, 0.3, 250, 15, 60);
    }
    
    static createLMG() {
        return new Weapon('LMG', 35, 0.12, 600, 100, 200);
    }
    
    static getRandomWeapon() {
        const weapons = [
            () => Weapon.createAssaultRifle(),
            () => Weapon.createShotgun(),
            () => Weapon.createSniper(),
            () => Weapon.createSMG(),
            () => Weapon.createPistol(),
            () => Weapon.createLMG()
        ];
        
        return MathUtils.randomChoice(weapons)();
    }
}

// Sistema de anexos/modificações de arma
class WeaponAttachment {
    constructor(name, type, effect) {
        this.name = name;
        this.type = type; // 'scope', 'barrel', 'grip', 'magazine'
        this.effect = effect; // Modificadores para as estatísticas da arma
    }
    
    applyTo(weapon) {
        // Aplicar os efeitos do anexo à arma
        if (this.effect.damage) weapon.damage += this.effect.damage;
        if (this.effect.accuracy) weapon.accuracy += this.effect.accuracy;
        if (this.effect.range) weapon.range += this.effect.range;
        if (this.effect.fireRate) weapon.fireRate += this.effect.fireRate;
        if (this.effect.maxAmmo) weapon.maxAmmo += this.effect.maxAmmo;
        
        // Garantir que os valores permaneçam dentro dos limites
        weapon.accuracy = MathUtils.clamp(weapon.accuracy, 0, 1);
        weapon.fireRate = Math.max(weapon.fireRate, 0.05);
        weapon.maxAmmo = Math.max(weapon.maxAmmo, 1);
    }
    
    static createScope() {
        return new WeaponAttachment('Mira Telescópica', 'scope', {
            accuracy: 0.1,
            range: 100
        });
    }
    
    static createSilencer() {
        return new WeaponAttachment('Silenciador', 'barrel', {
            damage: -5,
            accuracy: 0.05
        });
    }
    
    static createExtendedMag() {
        return new WeaponAttachment('Carregador Estendido', 'magazine', {
            maxAmmo: 15
        });
    }
    
    static createForegrip() {
        return new WeaponAttachment('Punho Frontal', 'grip', {
            accuracy: 0.08,
            fireRate: -0.02
        });
    }
}

// Classe para gerenciar o arsenal do jogador
class WeaponManager {
    constructor() {
        this.weapons = [null, null, null]; // 3 slots de arma
        this.currentSlot = 0;
        this.attachments = {};
    }
    
    addWeapon(weapon, slot = null) {
        if (slot !== null && slot >= 0 && slot < this.weapons.length) {
            this.weapons[slot] = weapon;
            return true;
        }
        
        // Procurar slot vazio
        for (let i = 0; i < this.weapons.length; i++) {
            if (!this.weapons[i]) {
                this.weapons[i] = weapon;
                return true;
            }
        }
        
        // Substituir arma atual se não houver slots vazios
        this.weapons[this.currentSlot] = weapon;
        return true;
    }
    
    removeWeapon(slot) {
        if (slot >= 0 && slot < this.weapons.length) {
            this.weapons[slot] = null;
            
            // Se removeu a arma atual, trocar para a próxima disponível
            if (slot === this.currentSlot) {
                this.switchToNextWeapon();
            }
        }
    }
    
    switchWeapon(slot) {
        if (slot >= 0 && slot < this.weapons.length && this.weapons[slot]) {
            this.currentSlot = slot;
            return true;
        }
        return false;
    }
    
    switchToNextWeapon() {
        for (let i = 1; i <= this.weapons.length; i++) {
            const nextSlot = (this.currentSlot + i) % this.weapons.length;
            if (this.weapons[nextSlot]) {
                this.currentSlot = nextSlot;
                return;
            }
        }
    }
    
    getCurrentWeapon() {
        return this.weapons[this.currentSlot];
    }
    
    hasWeapon() {
        return this.getCurrentWeapon() !== null;
    }
    
    addAttachment(weaponSlot, attachment) {
        if (!this.attachments[weaponSlot]) {
            this.attachments[weaponSlot] = {};
        }
        
        this.attachments[weaponSlot][attachment.type] = attachment;
        
        // Aplicar o anexo à arma se ela existir
        if (this.weapons[weaponSlot]) {
            attachment.applyTo(this.weapons[weaponSlot]);
        }
    }
    
    getWeaponInfo(slot) {
        const weapon = this.weapons[slot];
        if (!weapon) return null;
        
        return {
            ...weapon.getStats(),
            attachments: this.attachments[slot] || {}
        };
    }
    
    getAllWeapons() {
        return this.weapons.map((weapon, index) => ({
            slot: index,
            weapon: weapon,
            isCurrent: index === this.currentSlot,
            info: this.getWeaponInfo(index)
        }));
    }
}