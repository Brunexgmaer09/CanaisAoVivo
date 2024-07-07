// Select elements
const channelButtons = document.querySelectorAll('.channel-button');
const videoContainer = document.getElementById('video-container');
const iframeVideo = document.getElementById('iframe-video');
const ambientModeToggle = document.getElementById('ambient-mode-toggle');
const body = document.body;

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

// Add click event listeners to channel buttons
channelButtons.forEach(button => {
  button.addEventListener('click', () => {
    const channel = button.getAttribute('data-channel');
    showVideo(channel);
  });
});

// Ambient mode toggle functionality
let isAmbientMode = false;

ambientModeToggle.addEventListener('click', () => {
  isAmbientMode = !isAmbientMode;
  body.classList.toggle('ambient-mode', isAmbientMode);
  ambientModeToggle.textContent = isAmbientMode ? 'Modo Ambiente: Ativado' : 'Modo Ambiente: Desativado';
  
  if (isAmbientMode) {
    // Scroll to the video when ambient mode is activated
    videoContainer.scrollIntoView({ behavior: 'smooth' });
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Exit ambient mode when clicking outside the video
document.addEventListener('click', (event) => {
  if (isAmbientMode && !videoContainer.contains(event.target) && event.target !== ambientModeToggle) {
    ambientModeToggle.click();
  }
});

// Keyboard shortcut to toggle ambient mode (press 'A' key)
document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'a') {
    ambientModeToggle.click();
  }
});
