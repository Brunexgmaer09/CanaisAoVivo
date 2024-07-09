// Select elements
const channelButtons = document.querySelectorAll('.channel-button');
const videoContainer = document.getElementById('video-container');
const iframeVideo = document.getElementById('iframe-video');
const ambientModeToggle = document.getElementById('ambient-mode-toggle');

let isAmbientModeActive = false;

// Array de cores escuras
const darkColors = [
    '#1A1A2E', '#16213E', '#0F3460', '#1F1D36',
    '#3F0071', '#150050', '#000000', '#1B1B1B'
];

// Função para obter uma cor aleatória do array
function getRandomDarkColor() {
    return darkColors[Math.floor(Math.random() * darkColors.length)];
}

// Function to show video
const showVideo = (channel) => {
  // Add a fade-in effect
  videoContainer.style.display = 'block';
  videoContainer.style.opacity = 0;
  
  setTimeout(() => {
    videoContainer.style.opacity = 1;
    
    // Load the video
    iframeVideo.src = `https://reidoscanais.eu/embed/?id=${channel}`;
  }, 10);
};

// Função para alternar o modo ambiente
function toggleAmbientMode() {
    isAmbientModeActive = !isAmbientModeActive;
    
    if (isAmbientModeActive) {
        updateVideoBackground();
    } else {
        updateVideoBackground('');
    }
}

// Função para atualizar o fundo do vídeo
function updateVideoBackground(color) {
    const videoBackground = document.querySelector('.video-background');
    if (videoBackground) {
        videoBackground.style.backgroundColor = color || getRandomDarkColor();
    }
}

// Add click event listeners to channel buttons
channelButtons.forEach(button => {
  button.addEventListener('click', () => {
    const channel = button.getAttribute('data-channel');
    showVideo(channel);
  });
});

// Adicionar evento de change ao checkbox
ambientModeToggle.addEventListener('change', toggleAmbientMode);

// Atualizar a cor do fundo do vídeo a cada 5 segundos quando ativo
setInterval(() => {
    if (isAmbientModeActive) {
        updateVideoBackground();
    }
}, 5000);

// Smoke text animation
const smokeText = document.getElementById('smoke-text');
const text = 'Site feito por Brunex';
let charIndex = 0;

function animateSmokeText() {
    if (charIndex < text.length) {
        smokeText.innerHTML += `<span>${text[charIndex]}</span>`;
        charIndex++;
        setTimeout(animateSmokeText, 100);
    } else {
        setTimeout(fadeSmokeText, 2000);
    }
}

function fadeSmokeText() {
    const spans = smokeText.querySelectorAll('span');
    spans.forEach((span, index) => {
        setTimeout(() => {
            span.classList.add('fade');
        }, index * 500);
    });
    setTimeout(() => {
        smokeText.innerHTML = '';
        charIndex = 0;
        animateSmokeText();
    }, spans.length * 500 + 5000);
}

animateSmokeText();
