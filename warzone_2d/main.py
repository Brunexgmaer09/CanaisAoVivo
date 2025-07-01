import pygame
import sys
import math
import random
from typing import List, Tuple
from game_objects import Player, House, LootBox, Bullet, Item, ItemType
from game_map import GameMap
from hud import HUD

# Configurações do jogo
SCREEN_WIDTH = 1200
SCREEN_HEIGHT = 800
FPS = 60

# Cores
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)
GRAY = (128, 128, 128)
BROWN = (139, 69, 19)

class Game:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Warzone 2D - Battle Royale")
        self.clock = pygame.time.Clock()
        
        # Camera
        self.camera_x = 0
        self.camera_y = 0
        
        # Objetos do jogo
        self.player = Player(400, 300)
        self.game_map = GameMap()
        self.houses = self.game_map.generate_houses()
        self.loot_boxes = []
        self.bullets = []
        self.hud = HUD()
        
        # Gerar loot nas casas
        self.generate_loot()
        
        # Estado do jogo
        self.running = True
        self.paused = False
        
    def generate_loot(self):
        """Gera loot boxes dentro e ao redor das casas"""
        for house in self.houses:
            # Loot dentro da casa
            for _ in range(random.randint(2, 5)):
                x = house.x + random.randint(10, house.width - 30)
                y = house.y + random.randint(10, house.height - 30)
                item_type = random.choice(list(ItemType))
                loot_box = LootBox(x, y, item_type)
                self.loot_boxes.append(loot_box)
    
    def update_camera(self):
        """Atualiza a posição da câmera para seguir o jogador"""
        self.camera_x = self.player.x - SCREEN_WIDTH // 2
        self.camera_y = self.player.y - SCREEN_HEIGHT // 2
        
        # Limitar câmera aos limites do mapa
        self.camera_x = max(0, min(self.camera_x, self.game_map.width - SCREEN_WIDTH))
        self.camera_y = max(0, min(self.camera_y, self.game_map.height - SCREEN_HEIGHT))
    
    def handle_events(self):
        """Gerencia eventos do jogo"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    self.paused = not self.paused
                elif event.key == pygame.K_e:
                    self.collect_nearby_loot()
                elif event.key == pygame.K_r:
                    self.player.reload()
                elif event.key == pygame.K_1:
                    self.player.switch_weapon(0)
                elif event.key == pygame.K_2:
                    self.player.switch_weapon(1)
                elif event.key == pygame.K_3:
                    self.player.switch_weapon(2)
            
            elif event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1:  # Botão esquerdo do mouse
                    self.player.start_shooting()
                elif event.button == 3:  # Botão direito do mouse
                    self.player.aim_down_sights = True
            
            elif event.type == pygame.MOUSEBUTTONUP:
                if event.button == 1:
                    self.player.stop_shooting()
                elif event.button == 3:
                    self.player.aim_down_sights = False
    
    def collect_nearby_loot(self):
        """Coleta loot próximo ao jogador"""
        for loot_box in self.loot_boxes[:]:
            distance = math.sqrt((self.player.x - loot_box.x)**2 + (self.player.y - loot_box.y)**2)
            if distance < 50:
                if self.player.add_item(loot_box.item):
                    self.loot_boxes.remove(loot_box)
    
    def update(self, dt):
        """Atualiza o estado do jogo"""
        if self.paused:
            return
            
        # Atualizar jogador
        keys = pygame.key.get_pressed()
        mouse_pos = pygame.mouse.get_pos()
        world_mouse_x = mouse_pos[0] + self.camera_x
        world_mouse_y = mouse_pos[1] + self.camera_y
        
        self.player.update(dt, keys, (world_mouse_x, world_mouse_y), self.houses)
        
        # Criar balas se o jogador está atirando
        new_bullet = self.player.get_bullet()
        if new_bullet:
            self.bullets.append(new_bullet)
        
        # Atualizar balas
        for bullet in self.bullets[:]:
            bullet.update(dt)
            if bullet.should_remove():
                self.bullets.remove(bullet)
            else:
                # Verificar colisão com casas
                for house in self.houses:
                    if house.collides_with_point(bullet.x, bullet.y):
                        if bullet in self.bullets:
                            self.bullets.remove(bullet)
                        break
        
        # Atualizar câmera
        self.update_camera()
    
    def draw(self):
        """Desenha todos os elementos do jogo"""
        self.screen.fill(GREEN)  # Grama
        
        # Desenhar mapa de fundo
        self.game_map.draw(self.screen, self.camera_x, self.camera_y)
        
        # Desenhar casas
        for house in self.houses:
            house.draw(self.screen, self.camera_x, self.camera_y)
        
        # Desenhar loot boxes
        for loot_box in self.loot_boxes:
            loot_box.draw(self.screen, self.camera_x, self.camera_y)
        
        # Desenhar balas
        for bullet in self.bullets:
            bullet.draw(self.screen, self.camera_x, self.camera_y)
        
        # Desenhar jogador
        self.player.draw(self.screen, self.camera_x, self.camera_y)
        
        # Desenhar HUD
        self.hud.draw(self.screen, self.player)
        
        # Desenhar instruções
        self.draw_instructions()
        
        # Se pausado, desenhar overlay
        if self.paused:
            self.draw_pause_overlay()
        
        pygame.display.flip()
    
    def draw_instructions(self):
        """Desenha as instruções na tela"""
        font = pygame.font.Font(None, 24)
        instructions = [
            "WASD - Mover",
            "Mouse - Mirar",
            "Click Esquerdo - Atirar",
            "Click Direito - Mira",
            "E - Coletar loot",
            "R - Recarregar",
            "1,2,3 - Trocar arma",
            "ESC - Pausar"
        ]
        
        for i, instruction in enumerate(instructions):
            text = font.render(instruction, True, WHITE)
            self.screen.blit(text, (10, 10 + i * 25))
    
    def draw_pause_overlay(self):
        """Desenha overlay de pausa"""
        overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT))
        overlay.fill(BLACK)
        overlay.set_alpha(128)
        self.screen.blit(overlay, (0, 0))
        
        font = pygame.font.Font(None, 74)
        text = font.render("PAUSADO", True, WHITE)
        text_rect = text.get_rect(center=(SCREEN_WIDTH//2, SCREEN_HEIGHT//2))
        self.screen.blit(text, text_rect)
    
    def run(self):
        """Loop principal do jogo"""
        while self.running:
            dt = self.clock.tick(FPS) / 1000.0  # Delta time em segundos
            
            self.handle_events()
            self.update(dt)
            self.draw()
        
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    game = Game()
    game.run()