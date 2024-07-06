// Select elements
const channelButtons = document.querySelectorAll('.channel-button');
const videoContainer = document.getElementById('video-container');
const iframeVideo = document.getElementById('iframe-video');

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

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
