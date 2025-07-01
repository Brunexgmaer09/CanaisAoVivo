// Funções utilitárias para o jogo

class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    
    subtract(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    
    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2(0, 0);
        return new Vector2(this.x / mag, this.y / mag);
    }
    
    distance(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    angle() {
        return Math.atan2(this.y, this.x);
    }
    
    static fromAngle(angle, magnitude = 1) {
        return new Vector2(
            Math.cos(angle) * magnitude,
            Math.sin(angle) * magnitude
        );
    }
}

// Funções matemáticas úteis
const MathUtils = {
    clamp: (value, min, max) => Math.max(min, Math.min(max, value)),
    
    lerp: (start, end, t) => start + (end - start) * t,
    
    random: (min, max) => Math.random() * (max - min) + min,
    
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    randomChoice: (array) => array[Math.floor(Math.random() * array.length)],
    
    angleBetween: (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1),
    
    degToRad: (degrees) => degrees * Math.PI / 180,
    
    radToDeg: (radians) => radians * 180 / Math.PI,
    
    distance: (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
};

// Sistema de colisão
const CollisionUtils = {
    pointInRect: (px, py, rx, ry, rw, rh) => {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    },
    
    rectIntersect: (r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) => {
        return !(r2x > r1x + r1w || r2x + r2w < r1x || r2y > r1y + r1h || r2y + r2h < r1y);
    },
    
    circleIntersect: (c1x, c1y, c1r, c2x, c2y, c2r) => {
        const distance = Math.sqrt((c1x - c2x) ** 2 + (c1y - c2y) ** 2);
        return distance < c1r + c2r;
    },
    
    pointInCircle: (px, py, cx, cy, radius) => {
        const distance = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
        return distance <= radius;
    },
    
    lineIntersect: (x1, y1, x2, y2, x3, y3, x4, y4) => {
        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denom === 0) return null;
        
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
        
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: x1 + t * (x2 - x1),
                y: y1 + t * (y2 - y1)
            };
        }
        return null;
    }
};

// Sistema de cores
const Colors = {
    BACKGROUND: '#2d5a27',
    PLAYER: '#4169E1',
    ENEMY: '#DC143C',
    WALL: '#8B4513',
    HOUSE: '#654321',
    LOOT_WEAPON: '#FFD700',
    LOOT_ARMOR: '#C0C0C0',
    LOOT_HEALTH: '#FF6347',
    LOOT_AMMO: '#32CD32',
    BULLET: '#FFFF00',
    UI_TEXT: '#FFFFFF',
    UI_BACKGROUND: 'rgba(0, 0, 0, 0.7)',
    MINIMAP_PLAYER: '#00FF00',
    MINIMAP_HOUSE: '#8B4513'
};

// Sistema de entrada (input)
class InputManager {
    constructor() {
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            left: false,
            right: false,
            middle: false
        };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Eventos de mouse
        document.addEventListener('mousemove', (e) => {
            const canvas = document.getElementById('gameCanvas');
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        // Eventos de touch para mobile
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const canvas = document.getElementById('gameCanvas');
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;
        });
        
        document.addEventListener('mousedown', (e) => {
            switch(e.button) {
                case 0: this.mouse.left = true; break;
                case 1: this.mouse.middle = true; break;
                case 2: this.mouse.right = true; break;
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            switch(e.button) {
                case 0: this.mouse.left = false; break;
                case 1: this.mouse.middle = false; break;
                case 2: this.mouse.right = false; break;
            }
        });
        
        // Touch events para mobile
        document.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.mouse.left = true;
            const canvas = document.getElementById('gameCanvas');
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;
        });
        
        document.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.mouse.left = false;
            this.mouse.right = false;
        });
        
        // Prevenir menu de contexto
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    isKeyPressed(keyCode) {
        return this.keys[keyCode] || false;
    }
    
    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }
    
    isMousePressed(button = 'left') {
        return this.mouse[button];
    }
}

// Sistema de partículas simples
class Particle {
    constructor(x, y, vx, vy, color, life = 1000, size = 2) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = size;
        this.alive = true;
    }
    
    update(deltaTime) {
        if (!this.alive) return;
        
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.life -= deltaTime;
        
        if (this.life <= 0) {
            this.alive = false;
        }
    }
    
    draw(ctx, camera) {
        if (!this.alive) return;
        
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.size, this.size);
        ctx.restore();
    }
}

// Sistema de som (simulado)
const SoundManager = {
    sounds: {},
    
    play: (soundName, volume = 1.0) => {
        // Simulação de som - em um jogo real usaria Web Audio API
        console.log(`Playing sound: ${soundName} at volume ${volume}`);
    },
    
    stop: (soundName) => {
        console.log(`Stopping sound: ${soundName}`);
    }
};

// Sistema de efeitos visuais
const EffectsManager = {
    particles: [],
    
    init: function() {
        this.particles = [];
    },
    
    addMuzzleFlash: (x, y) => {
        if (!EffectsManager.particles) {
            EffectsManager.particles = [];
        }
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = MathUtils.random(50, 100);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            const particle = new Particle(
                x, y, vx, vy,
                MathUtils.randomChoice(['#FFFF00', '#FFA500', '#FF4500']),
                100,
                MathUtils.random(2, 4)
            );
            
            EffectsManager.particles.push(particle);
        }
    },
    
    addBloodSplatter: (x, y) => {
        if (!EffectsManager.particles) {
            EffectsManager.particles = [];
        }
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = MathUtils.random(30, 80);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            const particle = new Particle(
                x, y, vx, vy,
                '#8B0000',
                500,
                MathUtils.random(1, 3)
            );
            
            EffectsManager.particles.push(particle);
        }
    },
    
    update: (deltaTime) => {
        if (!EffectsManager.particles) {
            EffectsManager.particles = [];
            return;
        }
        for (let i = EffectsManager.particles.length - 1; i >= 0; i--) {
            EffectsManager.particles[i].update(deltaTime);
            if (!EffectsManager.particles[i].alive) {
                EffectsManager.particles.splice(i, 1);
            }
        }
    },
    
    draw: (ctx, camera) => {
        if (!EffectsManager.particles) {
            EffectsManager.particles = [];
            return;
        }
        EffectsManager.particles.forEach(particle => {
            particle.draw(ctx, camera);
        });
    }
};