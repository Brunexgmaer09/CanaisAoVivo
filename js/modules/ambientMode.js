// js/modules/ambientMode.js
const darkColors = [
  '#1A1A2E', '#16213E', '#0F3460', '#1F1D36',
  '#3F0071', '#150050', '#000000', '#1B1B1B'
];

export function getRandomDarkColor() {
  return darkColors[Math.floor(Math.random() * darkColors.length)];
}

export function toggleAmbientMode(isActive) {
  document.body.classList.toggle('ambient-mode', isActive);
  
  const videoBackground = document.querySelector('.video-background');
  if (videoBackground) {
    videoBackground.style.backgroundColor = isActive ? getRandomDarkColor() : '';
  }
}

