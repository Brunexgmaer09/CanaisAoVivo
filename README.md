# 🎮 Warzone 2D - Battle Royale

Um jogo de battle royale em 2D com visão top-down, inspirado no Warzone, desenvolvido em JavaScript puro com HTML5 Canvas.

## 🚀 Características

### 🎯 Gameplay Core
- **Battle Royale**: Sobreviva enquanto a zona segura se fecha
- **Combate em tempo real**: Sistema de tiro com diferentes armas
- **Coleta de loot**: Encontre armas, armaduras e suprimentos
- **Movimento fluido**: Controle preciso com WASD
- **Sistema de vida e armadura**: Mecânicas de sobrevivência

### 🗺️ Mundo do Jogo
- **Mapa procedural**: Casas, estradas, lagos e obstáculos gerados automaticamente
- **25+ casas**: Cada uma com loot aleatório
- **Terreno variado**: Grama, estradas, água e pedras
- **Zona segura dinâmica**: Se fecha em 6 fases ao longo da partida

### 🔫 Sistema de Armas
- **6 tipos de armas**:
  - Pistola (versátil, munição abundante)
  - SMG (alta cadência, curto alcance)
  - Rifle de Assalto (balanceado)
  - Shotgun (alto dano, curto alcance)
  - Sniper (alto dano, longo alcance)
  - LMG (alto dano, baixa mobilidade)

### 🎒 Sistema de Loot
- **5 tipos de raridade**: Comum, Incomum, Raro, Épico, Lendário
- **Categorias de items**:
  - Armas com estatísticas variadas
  - Coletes para proteção
  - Kits médicos para cura
  - Munição para recarregar
  - Anexos para melhorar armas

## 🎮 Controles

### ⌨️ Teclado
- **WASD** ou **Setas**: Movimento
- **E**: Coletar loot próximo
- **R**: Recarregar arma
- **1, 2, 3**: Trocar entre armas
- **ESC**: Pausar jogo
- **F1**: Toggle informações de debug (dev)

### 🖱️ Mouse
- **Movimento**: Mirar
- **Botão esquerdo**: Atirar
- **Botão direito**: Mira precisa (reduz velocidade)

### 🐛 Debug (Desenvolvimento)
- **Ctrl+Shift+D**: Toggle debug info
- **Ctrl+Shift+G**: God mode (vida e armadura máxima)
- **Ctrl+Shift+W**: Adicionar todas as armas
- **Ctrl+Shift+T**: Teleportar para o centro

## 🎯 Interface

### 📊 HUD Principal
- **Vida**: Barra vermelha/verde
- **Armadura**: Barra azul
- **Munição**: Contador atual/reserva
- **Arma**: Nome da arma equipada
- **Kills**: Contador de eliminações

### 🗺️ Minimap
- **Posição do jogador**: Ponto verde
- **Casas**: Retângulos marrons
- **Zona segura**: Círculo verde
- **Atualização em tempo real**

### ⚠️ Informações da Zona
- **Fase atual**: Qual zona está ativa
- **Timer**: Tempo até próxima zona
- **Status**: Dentro ou fora da zona
- **Distância**: Metros até a borda (se fora)

## �️ Arquitetura Técnica

### 📁 Estrutura de Arquivos
```
/
├── index.html          # Interface principal
├── js/
│   ├── utils.js        # Utilitários e matemática
│   ├── gameObjects.js  # Objetos base (casas, balas, etc)
│   ├── player.js       # Lógica do jogador
│   ├── weapons.js      # Sistema de armas
│   ├── loot.js         # Sistema de loot e raridades
│   ├── map.js          # Geração e renderização do mapa
│   ├── game.js         # Loop principal e gerenciamento
│   └── main.js         # Inicialização e setup
└── README.md
```

### 🎨 Sistemas Implementados

#### 🔧 Sistema de Utilitários (`utils.js`)
- **Vector2**: Matemática vetorial
- **MathUtils**: Funções matemáticas
- **CollisionUtils**: Detecção de colisões
- **InputManager**: Gerenciamento de entrada
- **EffectsManager**: Sistema de partículas
- **SoundManager**: Sistema de áudio (simulado)

#### 🏠 Objetos do Jogo (`gameObjects.js`)
- **GameObject**: Classe base
- **House**: Casas com quartos e loot
- **Bullet**: Projéteis com física
- **LootBox**: Contêineres de loot
- **SafeZone**: Zona segura dinâmica

#### � Jogador (`player.js`)
- **Movimento**: Física baseada em velocidade
- **Combate**: Sistema de tiro e recarga
- **Inventário**: Gerenciamento de items
- **Stats**: Vida, armadura, munição
- **Efeitos visuais**: Flash de dano, muzzle flash

#### 🔫 Armas (`weapons.js`)
- **Weapon**: Classe base com estatísticas
- **WeaponAttachment**: Sistema de anexos
- **WeaponManager**: Gerenciamento de arsenal
- **Balanceamento**: Cada arma tem características únicas

#### 🎁 Loot (`loot.js`)
- **LootItem**: Items com raridade e efeitos
- **LootGenerator**: Geração procedural
- **LootContainer**: Contêineres físicos
- **Sistema de raridade**: 5 níveis de qualidade

#### �️ Mapa (`map.js`)
- **GameMap**: Mundo principal
- **Geração procedural**: Casas, terreno, loot
- **Renderização**: Múltiplas camadas
- **Minimap**: Representação em escala

#### 🎮 Game Loop (`game.js`)
- **Loop principal**: 60 FPS com delta time
- **Estados**: Menu, jogo, pausa, game over
- **Câmera**: Seguimento suave do jogador
- **UI**: HUD, minimap, informações

## 🚀 Como Executar

### 💻 Localmente
1. Clone ou baixe os arquivos
2. Abra `index.html` em um navegador moderno
3. O jogo iniciará automaticamente

### 🌐 Servidor Web
1. Coloque os arquivos em um servidor web
2. Acesse pelo navegador
3. Melhor performance que execução local

### 📱 Mobile
- Suporte básico para dispositivos móveis
- Detecção automática e otimizações
- Controles touch em desenvolvimento

## ⚡ Performance

### 🎯 Otimizações
- **60 FPS**: Loop otimizado com requestAnimationFrame
- **Delta time**: Movimento independente do framerate
- **Garbage collection**: Minimização de alocações
- **Culling**: Renderização apenas do visível
- **Mobile**: Detecção e otimizações automáticas

### 📊 Monitoramento
- **FPS counter**: Visível no debug
- **Performance API**: Métricas detalhadas
- **Memory usage**: Otimização de memória
- **Debug tools**: Informações em tempo real

## 🎨 Características Visuais

### 🌈 Estilo Artístico
- **Top-down 2D**: Perspectiva clássica
- **Pixel art style**: Visual limpo e claro
- **Cores vibrantes**: Fácil identificação
- **Animações fluidas**: 60 FPS constante

### ✨ Efeitos Especiais
- **Partículas**: Muzzle flash, sangue, coleta
- **Pulsação**: Items com glow animado
- **Transparências**: Overlays e UI
- **Gradientes**: Zonas e efeitos

## 🎵 Áudio (Simulado)

- **Sistema preparado**: SoundManager implementado
- **Eventos sonoros**: Tiros, coleta, recarregar
- **Volume control**: Sistema de configuração
- **3D audio**: Preparado para implementação

## 🔮 Funcionalidades Futuras

### 🎮 Gameplay
- [ ] Múltiplos jogadores (multiplayer)
- [ ] IA para bots inimigos
- [ ] Mais tipos de armas
- [ ] Veículos
- [ ] Granadas e explosivos
- [ ] Sistema de crafting

### 🗺️ Mundo
- [ ] Múltiplos mapas
- [ ] Clima dinâmico
- [ ] Dia/noite
- [ ] Destruição de ambiente
- [ ] Mais tipos de terreno

### 🎨 Visual
- [ ] Sprites customizados
- [ ] Animações de personagem
- [ ] Efeitos de iluminação
- [ ] Shaders simples
- [ ] Temas visuais

### � Mobile
- [ ] Controles touch completos
- [ ] UI adaptativa
- [ ] Vibração
- [ ] Notificações push

## 🐛 Debug e Desenvolvimento

### 🔧 Ferramentas Disponíveis
- **Console logging**: Informações detalhadas
- **Debug overlay**: F1 para toggle
- **God mode**: Imortalidade para testes
- **Teleporte**: Movimento rápido
- **Item spawning**: Teste de equipamentos

### � Métricas
- **FPS em tempo real**
- **Posição do jogador**
- **Estado da câmera**
- **Contadores de objetos**
- **Timers do jogo**

## 🤝 Contribuindo

### � Como Contribuir
1. Fork o projeto
2. Crie sua feature branch
3. Teste suas mudanças
4. Faça commit das alterações
5. Envie um pull request

### 🎯 Áreas de Contribuição
- **Bug fixes**: Correção de problemas
- **Performance**: Otimizações
- **Features**: Novas funcionalidades
- **Arte**: Assets visuais
- **Audio**: Efeitos sonoros
- **Mobile**: Suporte mobile

## 📜 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🎉 Créditos

Desenvolvido como um projeto educacional para demonstrar:
- Desenvolvimento de jogos em JavaScript
- HTML5 Canvas e APIs modernas
- Arquitetura de software para jogos
- Sistemas de gameplay complexos
- Otimização de performance

---

**Divirta-se jogando Warzone 2D!** 🎮🏆
