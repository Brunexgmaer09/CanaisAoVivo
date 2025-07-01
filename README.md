# 🎮 Warzone 2D - Battle Royale

Um jogo de battle royale em 2D com visão top-down, inspirado no Warzone, desenvolvido em JavaScript puro com HTML5 Canvas.

## 🚀 Características

### 🎯 Gameplay Core
- **Battle Royale**: Sobreviva enquanto a zona segura se fecha
- **Combate em tempo real**: Sistema de tiro com diferentes armas
- **Coleta de loot**: Encontre armas, armaduras e suprimentos
- **Movimento fluido**: Controle preciso com WASD
- **Sistema de vida e armadura**: Mecânicas de sobrevivência
- **🤖 139 Bots IA inteligentes** - Battle Royale completo com 140 jogadores!

### 🤖 Sistema de Bots IA (NOVO!)
- **Comportamento Inteligente**: 
  - Estados: Explorar, Coletar Loot, Combate, Fugir, Escapar da Zona
  - Personalidades únicas (agressividade, cautela, precisão)
  - Detecção de inimigos e navegação autônoma
- **Combate Avançado**:
  - Diferentes níveis de precisão e tempo de reação
  - Estratégias de combate (flanquear, manter distância)
  - Sistema de recarga e troca de armas
- **Sobrevivência**:
  - Fuga inteligente da zona de dano
  - Coleta automática de loot
  - Tomada de decisão baseada em situação (vida baixa = fugir)

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

## 🎯 Como Jogar

### Controles Desktop
- **WASD** - Movimento
- **Mouse** - Mirar
- **Click Esquerdo** - Atirar
- **E** - Coletar loot próximo
- **R** - Recarregar arma
- **1, 2, 3** - Trocar arma
- **ESC** - Pausar jogo

### Controles Mobile
- **Touch** - Mover para posição tocada
- **Tap** - Atirar na direção tocada
- **Drag** - Mirar continuamente

## � Objetivo

**Seja o último sobrevivente!** 

Você começa com mais 139 bots IA em um mapa gigante. Colete armas e equipamentos, elimine inimigos e sobreviva à zona que vai fechando. Os bots têm personalidades e estratégias diferentes - alguns são agressivos, outros cautelosos, alguns fogem quando feridos.

**🥇 CHICKEN DINNER** - Elimine todos os 139 bots para vencer!

## 🚀 Tecnologias

- **HTML5 Canvas** - Renderização 2D
- **JavaScript ES6+** - Lógica do jogo
- **CSS3** - Interface e responsividade
- **Arquitetura orientada a objetos** - Classes para Player, Bots, Armas, etc.

## 📱 Compatibilidade

- ✅ **Desktop** - Chrome, Firefox, Safari, Edge
- ✅ **Mobile** - Android e iOS (touch otimizado)
- ✅ **Performance** - 60 FPS estável
- ✅ **Responsivo** - Adapta a diferentes tamanhos de tela

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

### 🎨 Visual
- [ ] Sprites customizados
- [ ] Animações de personagem
- [ ] Efeitos de iluminação
- [ ] Shaders simples
- [ ] Temas visuais

### 🎨 Mobile
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

### 📊 Monitoramento
- **FPS counter**: Visível no debug
- **Performance API**: Métricas detalhadas
- **Memory usage**: Otimização de memória
- **Debug tools**: Informações em tempo real

## 🤝 Contribuindo

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

**🎮 Divirta-se sobrevivendo no Warzone 2D! Que a sorte esteja com você no Battle Royale!**
