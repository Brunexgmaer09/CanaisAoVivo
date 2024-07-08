// Select elements
const channelButtons = document.querySelectorAll('.channel-button');
const videoContainer = document.getElementById('video-container');
const iframeVideo = document.getElementById('iframe-video');
const ambientModeToggle = document.getElementById('ambient-mode-toggle');
const ambientBackground = document.getElementById('ambient-background');

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
    document.body.classList.toggle('ambient-mode', isAmbientModeActive);
    
    if (isAmbientModeActive) {
        updateAmbientColor();
    } else {
        ambientBackground.style.backgroundColor = '';
        updateVideoBackground('');
    }
}

// Função para atualizar a cor do ambiente
function updateAmbientColor() {
    if (!isAmbientModeActive) return;
    
    const randomColor = getRandomDarkColor();
    ambientBackground.style.backgroundColor = randomColor;
    updateVideoBackground(randomColor);
}

// Função para atualizar o fundo do vídeo
function updateVideoBackground(color) {
    const videoBackground = document.querySelector('.video-background');
    if (videoBackground) {
        videoBackground.style.backgroundColor = color;
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

// Atualizar a cor do ambiente e do fundo do vídeo a cada 5 segundos quando ativo
setInterval(() => {
    if (isAmbientModeActive) {
        updateAmbientColor();
    }
}, 5000);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
