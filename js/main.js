// Arquivo principal - inicialização do jogo Warzone 2D

// Variáveis globais
let game = null;

// Função para inicializar o jogo
function initGame() {
    try {
        console.log('Inicializando Warzone 2D...');
        
        // Verificar se o canvas existe
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            throw new Error('Canvas não encontrado!');
        }
        
        // Verificar suporte a Canvas 2D
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Canvas 2D não suportado pelo navegador!');
        }
        
        // Criar e iniciar o jogo
        game = new Game();
        game.start();
        
        console.log('Jogo inicializado com sucesso!');
        
    } catch (error) {
        console.error('Erro ao inicializar o jogo:', error);
        showError('Erro ao carregar o jogo: ' + error.message);
    }
}

// Função para mostrar erros
function showError(message) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.innerHTML = `
            <div style="color: #ff0000; text-align: center;">
                <h2>Erro!</h2>
                <p>${message}</p>
                <p>Tente recarregar a página (F5)</p>
            </div>
        `;
    }
}

// Função para verificar compatibilidade do navegador
function checkBrowserCompatibility() {
    const issues = [];
    
    // Verificar Canvas
    const canvas = document.createElement('canvas');
    if (!canvas.getContext || !canvas.getContext('2d')) {
        issues.push('Canvas 2D não suportado');
    }
    
    // Verificar requestAnimationFrame
    if (!window.requestAnimationFrame) {
        issues.push('requestAnimationFrame não suportado');
    }
    
    // Verificar addEventListener
    if (!document.addEventListener) {
        issues.push('addEventListener não suportado');
    }
    
    return issues;
}

// Função para otimizar performance
function optimizePerformance() {
    // Desabilitar seleção de texto no canvas
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        canvas.style.userSelect = 'none';
        canvas.style.webkitUserSelect = 'none';
        canvas.style.mozUserSelect = 'none';
        canvas.style.msUserSelect = 'none';
        
        // Desabilitar menu de contexto no canvas
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }
}

// Função para configurar shortcuts de debug
function setupDebugShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Apenas em development
        if (!game) return;
        
        // Ctrl + Shift + combinações para debug
        if (e.ctrlKey && e.shiftKey) {
            switch (e.key) {
                case 'D':
                    game.showDebugInfo = !game.showDebugInfo;
                    console.log('Debug info:', game.showDebugInfo ? 'ON' : 'OFF');
                    e.preventDefault();
                    break;
                    
                case 'G':
                    // God mode (imortal)
                    game.player.health = game.player.maxHealth;
                    game.player.armor = game.player.maxArmor;
                    console.log('God mode ativado');
                    e.preventDefault();
                    break;
                    
                case 'W':
                    // Dar todas as armas
                    game.player.weapons[0] = Weapon.createAssaultRifle();
                    game.player.weapons[1] = Weapon.createShotgun();
                    game.player.weapons[2] = Weapon.createSniper();
                    console.log('Todas as armas adicionadas');
                    e.preventDefault();
                    break;
                    
                case 'T':
                    // Teleport para centro do mapa
                    game.player.x = game.gameMap.width / 2;
                    game.player.y = game.gameMap.height / 2;
                    console.log('Teleportado para o centro');
                    e.preventDefault();
                    break;
            }
        }
    });
}

// Função para configurar mobile
function setupMobileOptimizations() {
    // Detectar dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('Dispositivo móvel detectado');
        
        // Prevenir zoom
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            );
        }
        
        // Adicionar controles touch (implementação futura)
        document.body.classList.add('mobile');
        
        // Reduzir tamanho do canvas para mobile
        const canvas = document.getElementById('gameCanvas');
        if (canvas && window.innerWidth < 1200) {
            const scale = window.innerWidth / 1200;
            canvas.style.transform = `scale(${scale})`;
            canvas.style.transformOrigin = 'top left';
        }
    }
}

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, inicializando jogo...');
    
    // Verificar compatibilidade
    const issues = checkBrowserCompatibility();
    if (issues.length > 0) {
        showError('Navegador incompatível:\n' + issues.join('\n'));
        return;
    }
    
    // Configurar otimizações
    optimizePerformance();
    setupMobileOptimizations();
    
    // Configurar debug apenas em desenvolvimento
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setupDebugShortcuts();
        console.log('Modo de desenvolvimento ativo');
        console.log('Debug shortcuts:');
        console.log('  Ctrl+Shift+D: Toggle debug info');
        console.log('  Ctrl+Shift+G: God mode');
        console.log('  Ctrl+Shift+W: Add all weapons');
        console.log('  Ctrl+Shift+T: Teleport to center');
    }
    
    // Pequeno delay para garantir que tudo foi carregado
    setTimeout(() => {
        initGame();
    }, 100);
});

// Exports para debug global (apenas em desenvolvimento)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.gameDebug = {
        getGame: () => game,
        getPlayer: () => game ? game.player : null,
        getMap: () => game ? game.gameMap : null,
        godMode: () => {
            if (game) {
                game.player.health = game.player.maxHealth;
                game.player.armor = game.player.maxArmor;
            }
        },
        addWeapons: () => {
            if (game) {
                game.player.weapons[0] = Weapon.createAssaultRifle();
                game.player.weapons[1] = Weapon.createShotgun();
                game.player.weapons[2] = Weapon.createSniper();
            }
        },
        teleport: (x, y) => {
            if (game) {
                game.player.x = x || game.gameMap.width / 2;
                game.player.y = y || game.gameMap.height / 2;
            }
        }
    };
    
    console.log('Debug disponível em window.gameDebug');
}

