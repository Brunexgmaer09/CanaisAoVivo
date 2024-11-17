import { showVideo } from './modules/videoController.js';
import { toggleAmbientMode, initAmbientMode } from './modules/ambientMode.js';
import { animateSmokeText } from './modules/smokeText.js';

// Selecionar elementos
const channelButtons = document.querySelectorAll('.channel-button');
const ambientModeToggle = document.getElementById('ambient-mode-toggle');

// Variáveis de estado
let isAmbientModeActive = false;
let ambientInterval;

// Adicione no início do arquivo main.js
function checkAdBlocker() {
    if (window.canRunAds === undefined) {
        console.log('Ad blocker detectado - não afeta a funcionalidade principal');
    }
}

// Inicializar modo ambiente
document.addEventListener('DOMContentLoaded', () => {
    initAmbientMode();
    animateSmokeText();
});

// Adicionar listeners aos botões de canal
channelButtons.forEach(button => {
    button.addEventListener('click', () => {
        const channel = button.getAttribute('data-channel');
        showVideo(channel);
    });
});

// Função para atualizar fundo do vídeo
function updateVideoBackground() {
    const videoBackground = document.querySelector('.video-background');
    if (videoBackground) {
        videoBackground.style.backgroundColor = getRandomDarkColor();
    }
}

// Alternar modo ambiente
ambientModeToggle.addEventListener('change', () => {
    isAmbientModeActive = ambientModeToggle.checked;
    toggleAmbientMode(isAmbientModeActive);

    if (isAmbientModeActive) {
        updateVideoBackground();
        ambientInterval = setInterval(updateVideoBackground, 5000);
    } else {
        clearInterval(ambientInterval);
    }
});

