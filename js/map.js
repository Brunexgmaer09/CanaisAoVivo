// Sistema de mapa e geração de mundo

class GameMap {
    constructor(width = 2000, height = 2000) {
        this.width = width;
        this.height = height;
        this.houses = [];
        this.lootContainers = [];
        this.safeZone = null;
        this.terrain = this.generateTerrain();
        
        this.generateHouses();
        this.generateLoot();
        this.initializeSafeZone();
    }
    
    generateTerrain() {
        // Gerar diferentes tipos de terreno
        const terrain = {
            grass: [],
            roads: [],
            water: [],
            rocks: []
        };
        
        // Gerar estradas principais
        this.generateRoads(terrain);
        
        // Gerar áreas de água
        this.generateWater(terrain);
        
        // Gerar pedras/obstáculos
        this.generateRocks(terrain);
        
        return terrain;
    }
    
    generateRoads(terrain) {
        // Estrada horizontal principal
        terrain.roads.push({
            x: 0,
            y: this.height / 2 - 25,
            width: this.width,
            height: 50
        });
        
        // Estrada vertical principal
        terrain.roads.push({
            x: this.width / 2 - 25,
            y: 0,
            width: 50,
            height: this.height
        });
        
        // Estradas secundárias
        for (let i = 0; i < 4; i++) {
            terrain.roads.push({
                x: 0,
                y: (this.height / 5) * (i + 1) - 15,
                width: this.width,
                height: 30
            });
            
            terrain.roads.push({
                x: (this.width / 5) * (i + 1) - 15,
                y: 0,
                width: 30,
                height: this.height
            });
        }
    }
    
    generateWater(terrain) {
        // Gerar lagos pequenos
        for (let i = 0; i < 3; i++) {
            const size = MathUtils.randomInt(80, 150);
            terrain.water.push({
                x: MathUtils.randomInt(50, this.width - size - 50),
                y: MathUtils.randomInt(50, this.height - size - 50),
                width: size,
                height: size
            });
        }
        
        // Rio
        const riverPoints = [];
        const numPoints = 20;
        for (let i = 0; i <= numPoints; i++) {
            riverPoints.push({
                x: (this.width / numPoints) * i,
                y: this.height * 0.7 + Math.sin(i * 0.5) * 100
            });
        }
        
        terrain.water.push({
            type: 'river',
            points: riverPoints,
            width: 40
        });
    }
    
    generateRocks(terrain) {
        for (let i = 0; i < 20; i++) {
            const size = MathUtils.randomInt(20, 60);
            terrain.rocks.push({
                x: MathUtils.randomInt(0, this.width - size),
                y: MathUtils.randomInt(0, this.height - size),
                width: size,
                height: size
            });
        }
    }
    
    generateHouses() {
        const numHouses = 25;
        const minDistance = 150;
        
        for (let i = 0; i < numHouses; i++) {
            let attempts = 0;
            let validPosition = false;
            let houseX, houseY, houseWidth, houseHeight;
            
            while (!validPosition && attempts < 50) {
                houseWidth = MathUtils.randomInt(60, 120);
                houseHeight = MathUtils.randomInt(60, 120);
                houseX = MathUtils.randomInt(50, this.width - houseWidth - 50);
                houseY = MathUtils.randomInt(50, this.height - houseHeight - 50);
                
                validPosition = this.isValidHousePosition(houseX, houseY, houseWidth, houseHeight, minDistance);
                attempts++;
            }
            
            if (validPosition) {
                const house = new House(houseX, houseY, houseWidth, houseHeight);
                this.houses.push(house);
            }
        }
    }
    
    isValidHousePosition(x, y, width, height, minDistance) {
        // Verificar se não está muito perto de outras casas
        for (const house of this.houses) {
            const distance = MathUtils.distance(
                x + width / 2, y + height / 2,
                house.x + house.width / 2, house.y + house.height / 2
            );
            if (distance < minDistance) {
                return false;
            }
        }
        
        // Verificar se não está em cima de água
        for (const water of this.terrain.water) {
            if (water.type === 'river') continue;
            
            if (CollisionUtils.rectIntersect(x, y, width, height, water.x, water.y, water.width, water.height)) {
                return false;
            }
        }
        
        return true;
    }
    
    generateLoot() {
        // Gerar loot dentro das casas
        for (const house of this.houses) {
            const lootCount = MathUtils.randomInt(2, 5);
            
            for (let i = 0; i < lootCount; i++) {
                const position = house.getRandomPositionInside();
                const lootContainer = LootGenerator.generateLootBox(position.x, position.y);
                this.lootContainers.push(lootContainer);
            }
        }
        
        // Gerar loot espalhado pelo mapa
        for (let i = 0; i < 30; i++) {
            let validPosition = false;
            let attempts = 0;
            
            while (!validPosition && attempts < 50) {
                const x = MathUtils.randomInt(50, this.width - 50);
                const y = MathUtils.randomInt(50, this.height - 50);
                
                validPosition = this.isValidLootPosition(x, y);
                
                if (validPosition) {
                    const lootContainer = LootGenerator.generateLootBox(x, y);
                    this.lootContainers.push(lootContainer);
                }
                
                attempts++;
            }
        }
    }
    
    isValidLootPosition(x, y) {
        // Verificar se não está dentro de uma casa
        for (const house of this.houses) {
            if (house.containsPoint(x, y)) {
                return false;
            }
        }
        
        // Verificar se não está em água
        for (const water of this.terrain.water) {
            if (water.type === 'river') continue;
            
            if (CollisionUtils.pointInRect(x, y, water.x, water.y, water.width, water.height)) {
                return false;
            }
        }
        
        return true;
    }
    
    initializeSafeZone() {
        this.safeZone = new SafeZone(this.width / 2, this.height / 2, Math.min(this.width, this.height) / 2);
    }
    
    update(deltaTime) {
        // Atualizar loot containers
        for (const lootContainer of this.lootContainers) {
            lootContainer.update(deltaTime);
        }
        
        // Atualizar zona segura
        if (this.safeZone) {
            this.safeZone.update(deltaTime);
        }
    }
    
    draw(ctx, camera) {
        this.drawTerrain(ctx, camera);
        this.drawHouses(ctx, camera);
        this.drawLoot(ctx, camera);
        this.drawSafeZone(ctx, camera);
    }
    
    drawTerrain(ctx, camera) {
        // Desenhar grama (fundo)
        ctx.fillStyle = Colors.BACKGROUND;
        ctx.fillRect(-camera.x, -camera.y, this.width, this.height);
        
        // Desenhar estradas
        ctx.fillStyle = '#555555';
        for (const road of this.terrain.roads) {
            ctx.fillRect(road.x - camera.x, road.y - camera.y, road.width, road.height);
            
            // Linhas centrais da estrada
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = 2;
            ctx.setLineDash([20, 20]);
            
            if (road.width > road.height) {
                // Estrada horizontal
                ctx.beginPath();
                ctx.moveTo(road.x - camera.x, road.y + road.height / 2 - camera.y);
                ctx.lineTo(road.x + road.width - camera.x, road.y + road.height / 2 - camera.y);
                ctx.stroke();
            } else {
                // Estrada vertical
                ctx.beginPath();
                ctx.moveTo(road.x + road.width / 2 - camera.x, road.y - camera.y);
                ctx.lineTo(road.x + road.width / 2 - camera.x, road.y + road.height - camera.y);
                ctx.stroke();
            }
            
            ctx.setLineDash([]);
        }
        
        // Desenhar água
        ctx.fillStyle = '#4169E1';
        for (const water of this.terrain.water) {
            if (water.type === 'river') {
                this.drawRiver(ctx, camera, water);
            } else {
                ctx.fillRect(water.x - camera.x, water.y - camera.y, water.width, water.height);
                
                // Efeito de ondas
                ctx.strokeStyle = '#6495ED';
                ctx.lineWidth = 2;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(
                        water.x + water.width / 2 - camera.x,
                        water.y + water.height / 2 - camera.y,
                        10 + i * 10,
                        0,
                        Math.PI * 2
                    );
                    ctx.stroke();
                }
            }
        }
        
        // Desenhar pedras
        ctx.fillStyle = '#696969';
        for (const rock of this.terrain.rocks) {
            ctx.fillRect(rock.x - camera.x, rock.y - camera.y, rock.width, rock.height);
            
            // Sombra da pedra
            ctx.fillStyle = '#2F2F2F';
            ctx.fillRect(rock.x + 2 - camera.x, rock.y + 2 - camera.y, rock.width, rock.height);
            ctx.fillStyle = '#696969';
        }
    }
    
    drawRiver(ctx, camera, river) {
        ctx.strokeStyle = '#4169E1';
        ctx.lineWidth = river.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        for (let i = 0; i < river.points.length; i++) {
            const point = river.points[i];
            if (i === 0) {
                ctx.moveTo(point.x - camera.x, point.y - camera.y);
            } else {
                ctx.lineTo(point.x - camera.x, point.y - camera.y);
            }
        }
        ctx.stroke();
    }
    
    drawHouses(ctx, camera) {
        for (const house of this.houses) {
            house.draw(ctx, camera);
        }
    }
    
    drawLoot(ctx, camera) {
        for (const lootContainer of this.lootContainers) {
            lootContainer.draw(ctx, camera);
        }
    }
    
    drawSafeZone(ctx, camera) {
        if (this.safeZone) {
            this.safeZone.draw(ctx, camera);
        }
    }
    
    drawMinimap(ctx, playerX, playerY, canvasWidth = 150, canvasHeight = 150) {
        const scaleX = canvasWidth / this.width;
        const scaleY = canvasHeight / this.height;
        
        // Limpar minimap
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Desenhar casas no minimap
        ctx.fillStyle = Colors.MINIMAP_HOUSE;
        for (const house of this.houses) {
            ctx.fillRect(
                house.x * scaleX,
                house.y * scaleY,
                Math.max(2, house.width * scaleX),
                Math.max(2, house.height * scaleY)
            );
        }
        
        // Desenhar zona segura no minimap
        if (this.safeZone) {
            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(
                this.safeZone.centerX * scaleX,
                this.safeZone.centerY * scaleY,
                this.safeZone.currentRadius * scaleX,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }
        
        // Desenhar jogador no minimap
        ctx.fillStyle = Colors.MINIMAP_PLAYER;
        ctx.beginPath();
        ctx.arc(
            playerX * scaleX,
            playerY * scaleY,
            3,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Borda do minimap
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
    }
    
    getHousesInArea(x, y, width, height) {
        return this.houses.filter(house => 
            CollisionUtils.rectIntersect(x, y, width, height, house.x, house.y, house.width, house.height)
        );
    }
    
    getLootInArea(x, y, radius) {
        return this.lootContainers.filter(loot => {
            if (loot.collected) return false;
            
            const distance = MathUtils.distance(
                x, y,
                loot.x + loot.width / 2,
                loot.y + loot.height / 2
            );
            return distance <= radius;
        });
    }
    
    collectLoot(playerX, playerY, collectRadius = 30) {
        const nearbyLoot = this.getLootInArea(playerX, playerY, collectRadius);
        const collectedItems = [];
        
        for (const lootContainer of nearbyLoot) {
            if (lootContainer.canBeCollected(playerX, playerY)) {
                const item = lootContainer.collect();
                if (item) {
                    collectedItems.push(item);
                }
            }
        }
        
        return collectedItems;
    }
    
    isInSafeZone(x, y) {
        if (!this.safeZone) return true;
        return this.safeZone.isPointInside(x, y);
    }
    
    getSafeZoneDistance(x, y) {
        if (!this.safeZone) return 0;
        return this.safeZone.getDistanceFromEdge(x, y);
    }
    
    startZoneShrinking(targetRadius, duration) {
        if (this.safeZone) {
            this.safeZone.startShrinking(targetRadius, duration);
        }
    }
    
    addLootContainer(lootContainer) {
        this.lootContainers.push(lootContainer);
    }
    
    removeLootContainer(lootContainer) {
        const index = this.lootContainers.indexOf(lootContainer);
        if (index > -1) {
            this.lootContainers.splice(index, 1);
        }
    }
    
    getRandomSpawnPoint() {
        let attempts = 0;
        
        while (attempts < 100) {
            const x = MathUtils.randomInt(100, this.width - 100);
            const y = MathUtils.randomInt(100, this.height - 100);
            
            // Verificar se não está dentro de uma casa
            let validSpawn = true;
            for (const house of this.houses) {
                if (house.containsPoint(x, y)) {
                    validSpawn = false;
                    break;
                }
            }
            
            // Verificar se não está em água
            if (validSpawn) {
                for (const water of this.terrain.water) {
                    if (water.type === 'river') continue;
                    
                    if (CollisionUtils.pointInRect(x, y, water.x, water.y, water.width, water.height)) {
                        validSpawn = false;
                        break;
                    }
                }
            }
            
            if (validSpawn) {
                return { x, y };
            }
            
            attempts++;
        }
        
        // Fallback para o centro do mapa
        return { x: this.width / 2, y: this.height / 2 };
    }
}