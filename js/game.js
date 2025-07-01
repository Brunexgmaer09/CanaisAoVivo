// Classe principal do jogo

class Game {
    constructor() {
        // Canvas e contexto
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.minimapCanvas = document.getElementById('minimap');
        this.minimapCtx = this.minimapCanvas.getContext('2d');
        
        // Sistemas do jogo
        this.input = new InputManager();
        this.gameMap = new GameMap();
        
        // Camera
        this.camera = { x: 0, y: 0 };
        
        // Player
        const spawnPoint = this.gameMap.getRandomSpawnPoint();
        this.player = new Player(spawnPoint.x, spawnPoint.y);
        
        // Balas
        this.bullets = [];
        
        // Estado do jogo
        this.gameState = 'playing'; // 'menu', 'playing', 'paused', 'gameOver'
        this.isPaused = false;
        this.gameTime = 0;
        
        // Battle Royale
        this.zoneTimer = 120; // 2 minutos até primeira zona
        this.zonePhase = 0;
        this.maxZonePhases = 6;
        
        // Performance
        this.lastTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        this.fpsTimer = 0;
        
        // UI
        this.showTooltips = true;
        this.showDebugInfo = false;
        
        this.setupEventListeners();
        this.initializeGame();
    }
    
    initializeGame() {
        // Ocultar tela de loading
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
        
        // Atualizar crosshair
        this.updateCrosshair();
        
        // Começar zona segura
        this.scheduleZoneShrink();
        
        console.log('Warzone 2D iniciado!');
        console.log(`Jogador spawnou em: ${this.player.x}, ${this.player.y}`);
        console.log(`Mapa: ${this.gameMap.width}x${this.gameMap.height}`);
        console.log(`Casas geradas: ${this.gameMap.houses.length}`);
        console.log(`Loot gerado: ${this.gameMap.lootContainers.length}`);
    }
    
    setupEventListeners() {
        // Teclas especiais
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Escape':
                    this.togglePause();
                    break;
                case 'KeyE':
                    this.collectNearbyLoot();
                    break;
                case 'KeyR':
                    this.player.reload();
                    break;
                case 'Digit1':
                    this.player.switchWeapon(0);
                    break;
                case 'Digit2':
                    this.player.switchWeapon(1);
                    break;
                case 'Digit3':
                    this.player.switchWeapon(2);
                    break;
                case 'F1':
                    this.showDebugInfo = !this.showDebugInfo;
                    break;
            }
        });
        
        // Redimensionamento da janela
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // Foco da janela
        window.addEventListener('blur', () => {
            if (this.gameState === 'playing') {
                this.togglePause();
            }
        });
    }
    
    resizeCanvas() {
        // Manter proporção do canvas se necessário
        const container = this.canvas.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        // Ajustar tamanho se necessário
        // Por enquanto mantemos tamanho fixo
    }
    
    update(deltaTime) {
        if (this.isPaused || this.gameState !== 'playing') return;
        
        // Atualizar tempo de jogo
        this.gameTime += deltaTime;
        
        // Atualizar zona
        this.updateZone(deltaTime);
        
        // Atualizar jogador
        this.player.update(deltaTime, this.input, this.camera, this.gameMap.houses);
        
        // Verificar se jogador está vivo
        if (!this.player.isAlive()) {
            this.gameOver();
            return;
        }
        
        // Aplicar dano da zona
        this.applyZoneDamage(deltaTime);
        
        // Criar balas
        this.handleShooting();
        
        // Atualizar balas
        this.updateBullets(deltaTime);
        
        // Atualizar mapa
        this.gameMap.update(deltaTime);
        
        // Atualizar efeitos
        EffectsManager.update(deltaTime);
        
        // Atualizar câmera
        this.updateCamera();
        
        // Atualizar UI
        this.updateUI();
    }
    
    updateZone(deltaTime) {
        if (this.zoneTimer > 0) {
            this.zoneTimer -= deltaTime;
            
            if (this.zoneTimer <= 0) {
                this.triggerZoneShrink();
            }
        }
    }
    
    scheduleZoneShrink() {
        this.zoneTimer = 120; // 2 minutos
    }
    
    triggerZoneShrink() {
        if (this.zonePhase < this.maxZonePhases) {
            this.zonePhase++;
            
            const zoneReduction = 0.8; // Reduzir para 80% do tamanho atual
            const currentRadius = this.gameMap.safeZone.currentRadius;
            const newRadius = currentRadius * zoneReduction;
            const shrinkDuration = 60; // 1 minuto para se fechar
            
            this.gameMap.startZoneShrinking(newRadius, shrinkDuration);
            
            // Próxima zona
            this.scheduleZoneShrink();
            
            console.log(`Zona ${this.zonePhase} iniciada! Novo raio: ${Math.round(newRadius)}`);
        }
    }
    
    applyZoneDamage(deltaTime) {
        const playerCenter = this.player.getCenter();
        
        if (!this.gameMap.isInSafeZone(playerCenter.x, playerCenter.y)) {
            const damage = 5 * deltaTime; // 5 de dano por segundo
            this.player.takeDamage(damage);
        }
    }
    
    handleShooting() {
        if (this.input.isMousePressed('left')) {
            const bullet = this.player.shoot();
            if (bullet) {
                this.bullets.push(bullet);
            }
        }
    }
    
    updateBullets(deltaTime) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update(deltaTime);
            
            // Verificar colisões com casas
            bullet.checkCollisionWithHouses(this.gameMap.houses);
            
            // Remover balas inativas
            if (!bullet.active) {
                this.bullets.splice(i, 1);
            }
        }
    }
    
    updateCamera() {
        // Fazer câmera seguir o jogador suavemente
        const targetX = this.player.x + this.player.width / 2 - this.canvas.width / 2;
        const targetY = this.player.y + this.player.height / 2 - this.canvas.height / 2;
        
        const lerpFactor = 0.1;
        this.camera.x = MathUtils.lerp(this.camera.x, targetX, lerpFactor);
        this.camera.y = MathUtils.lerp(this.camera.y, targetY, lerpFactor);
        
        // Limitar câmera aos limites do mapa
        this.camera.x = MathUtils.clamp(this.camera.x, 0, this.gameMap.width - this.canvas.width);
        this.camera.y = MathUtils.clamp(this.camera.y, 0, this.gameMap.height - this.canvas.height);
    }
    
    updateCrosshair() {
        const crosshair = document.getElementById('crosshair');
        if (crosshair) {
            const mousePos = this.input.getMousePosition();
            crosshair.style.left = mousePos.x + 'px';
            crosshair.style.top = mousePos.y + 'px';
        }
    }
    
    updateUI() {
        this.updateCrosshair();
        this.updateHUD();
    }
    
    updateHUD() {
        // Atualizar elementos do HUD
        const healthElement = document.getElementById('health');
        const armorElement = document.getElementById('armor');
        const ammoElement = document.getElementById('ammo');
        const weaponElement = document.getElementById('weapon');
        const killsElement = document.getElementById('kills');
        
        if (healthElement) healthElement.textContent = Math.round(this.player.health);
        if (armorElement) armorElement.textContent = Math.round(this.player.armor);
        if (killsElement) killsElement.textContent = this.player.kills;
        
        const currentWeapon = this.player.getCurrentWeapon();
        if (currentWeapon) {
            if (weaponElement) weaponElement.textContent = currentWeapon.name;
            if (ammoElement) ammoElement.textContent = `${currentWeapon.currentAmmo}/${currentWeapon.reserveAmmo}`;
        } else {
            if (weaponElement) weaponElement.textContent = 'Desarmado';
            if (ammoElement) ammoElement.textContent = '0/0';
        }
    }
    
    collectNearbyLoot() {
        const playerCenter = this.player.getCenter();
        const collectedItems = this.gameMap.collectLoot(playerCenter.x, playerCenter.y, 40);
        
        for (const item of collectedItems) {
            this.player.addItem(item);
            console.log(`Coletado: ${item.getName()}`);
        }
    }
    
    draw() {
        // Limpar canvas principal
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameState === 'playing') {
            // Desenhar mundo
            this.gameMap.draw(this.ctx, this.camera);
            
            // Desenhar balas
            for (const bullet of this.bullets) {
                bullet.draw(this.ctx, this.camera);
            }
            
            // Desenhar jogador
            this.player.draw(this.ctx, this.camera);
            
            // Desenhar efeitos
            EffectsManager.draw(this.ctx, this.camera);
            
            // Desenhar tooltips de loot
            if (this.showTooltips) {
                this.drawLootTooltips();
            }
            
            // Desenhar informações de zona
            this.drawZoneInfo();
            
            // Desenhar minimap
            this.drawMinimap();
            
            // Desenhar informações de debug
            if (this.showDebugInfo) {
                this.drawDebugInfo();
            }
        }
        
        // Desenhar overlay se pausado
        if (this.isPaused) {
            this.drawPauseOverlay();
        }
    }
    
    drawLootTooltips() {
        const mousePos = this.input.getMousePosition();
        
        for (const lootContainer of this.gameMap.lootContainers) {
            lootContainer.drawTooltip(this.ctx, this.camera, mousePos.x, mousePos.y);
        }
    }
    
    drawZoneInfo() {
        const playerCenter = this.player.getCenter();
        const distance = this.gameMap.getSafeZoneDistance(playerCenter.x, playerCenter.y);
        
        // Informações da zona
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(this.canvas.width - 220, 10, 200, 80);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        
        this.ctx.fillText(`Zona ${this.zonePhase}/${this.maxZonePhases}`, this.canvas.width - 210, 30);
        this.ctx.fillText(`Próxima zona: ${Math.max(0, Math.round(this.zoneTimer))}s`, this.canvas.width - 210, 50);
        
        if (distance < 0) {
            this.ctx.fillStyle = '#FF0000';
            this.ctx.fillText(`FORA DA ZONA! ${Math.round(-distance)}m`, this.canvas.width - 210, 70);
        } else {
            this.ctx.fillStyle = '#00FF00';
            this.ctx.fillText(`Na zona segura`, this.canvas.width - 210, 70);
        }
    }
    
    drawMinimap() {
        const playerCenter = this.player.getCenter();
        this.gameMap.drawMinimap(
            this.minimapCtx,
            playerCenter.x,
            playerCenter.y,
            this.minimapCanvas.width,
            this.minimapCanvas.height
        );
    }
    
    drawDebugInfo() {
        const debugInfo = [
            `FPS: ${this.fps}`,
            `Posição: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`,
            `Câmera: ${Math.round(this.camera.x)}, ${Math.round(this.camera.y)}`,
            `Balas: ${this.bullets.length}`,
            `Loot: ${this.gameMap.lootContainers.filter(l => !l.collected).length}`,
            `Tempo: ${Math.round(this.gameTime)}s`,
            `Vida: ${Math.round(this.player.health)}/${this.player.maxHealth}`,
            `Armadura: ${Math.round(this.player.armor)}/${this.player.maxArmor}`
        ];
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, this.canvas.height - 160, 200, 150);
        
        this.ctx.fillStyle = '#00FF00';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';
        
        for (let i = 0; i < debugInfo.length; i++) {
            this.ctx.fillText(debugInfo[i], 15, this.canvas.height - 145 + i * 15);
        }
        
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.fillText('F1 - Toggle Debug', 15, this.canvas.height - 25);
    }
    
    drawPauseOverlay() {
        // Overlay escuro
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Texto de pausa
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('JOGO PAUSADO', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Pressione ESC para continuar', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        console.log(this.isPaused ? 'Jogo pausado' : 'Jogo despausado');
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        console.log('Game Over!');
        
        // Mostrar tela de game over
        this.showGameOverScreen();
    }
    
    showGameOverScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Sobreviveu por ${Math.round(this.gameTime)} segundos`, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText(`Kills: ${this.player.kills}`, this.canvas.width / 2, this.canvas.height / 2 + 30);
        this.ctx.fillText('Pressione F5 para reiniciar', this.canvas.width / 2, this.canvas.height / 2 + 80);
    }
    
    // Loop principal do jogo
    gameLoop(currentTime) {
        // Calcular delta time
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.016); // Max 60 FPS
        this.lastTime = currentTime;
        
        // Calcular FPS
        this.frameCount++;
        this.fpsTimer += deltaTime;
        if (this.fpsTimer >= 1.0) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTimer = 0;
        }
        
        // Atualizar jogo
        this.update(deltaTime);
        
        // Desenhar jogo
        this.draw();
        
        // Continuar loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    start() {
        console.log('Iniciando Warzone 2D...');
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }
}