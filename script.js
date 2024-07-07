// Select elements
const channelButtons = document.querySelectorAll('.channel-button');
const videoContainer = document.getElementById('video-container');
const iframeVideo = document.getElementById('iframe-video');
const ambientModeToggle = document.getElementById('ambient-mode-toggle');
const ambientBackground = document.getElementById('ambient-background');

let isAmbientModeActive = false;
const colorThief = new ColorThief();

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

// Function to toggle ambient mode
const toggleAmbientMode = () => {
  isAmbientModeActive = !isAmbientModeActive;
  document.body.classList.toggle('ambient-mode', isAmbientModeActive);
  ambientModeToggle.textContent = isAmbientModeActive ? 'Desativar Modo Ambiente' : 'Ativar Modo Ambiente';
  
  if (isAmbientModeActive) {
    updateAmbientColor();
  } else {
    ambientBackground.style.backgroundColor = '';
  }
};

// Function to update ambient color
const updateAmbientColor = () => {
  if (!isAmbientModeActive) return;

  // Create a canvas element
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Set canvas size to match the video
  canvas.width = iframeVideo.clientWidth;
  canvas.height = iframeVideo.clientHeight;

  // Draw the current frame of the video onto the canvas
  context.drawImage(iframeVideo, 0, 0, canvas.width, canvas.height);

  // Get the dominant color
  const dominantColor = colorThief.getColor(canvas);

  // Set the background color
  ambientBackground.style.backgroundColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
};

// Add click event listeners to channel buttons
channelButtons.forEach(button => {
  button.addEventListener('click', () => {
    const channel = button.getAttribute('data-channel');
    showVideo(channel);
  });
});

// Add click event listener to ambient mode toggle
ambientModeToggle.addEventListener('click', toggleAmbientMode);

// Update ambient color periodically
setInterval(updateAmbientColor, 1000);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
