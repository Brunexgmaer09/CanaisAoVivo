// js/modules/ambientMode.js
const darkColors = [
  '#1A1A2E', '#16213E', '#0F3460', '#1F1D36',
  '#3F0071', '#150050', '#000000', '#1B1B1B'
];

export function getRandomDarkColor() {
  return darkColors[Math.floor(Math.random() * darkColors.length)];
}

// Função para inicializar os listeners
export function initAmbientMode() {
  // Adicionar listener para tecla ESC
  document.addEventListener('keydown', handleEscKey);
  
  // Adicionar listener para o toggle switch
  const ambientToggle = document.getElementById('ambient-mode-toggle');
  if (ambientToggle) {
    ambientToggle.addEventListener('change', (e) => {
      toggleAmbientMode(e.target.checked);
    });
  }
}

// Função separada para lidar com a tecla ESC
function handleEscKey(e) {
  if (e.key === 'Escape') {
    const ambientToggle = document.getElementById('ambient-mode-toggle');
    if (document.body.classList.contains('ambient-mode') && ambientToggle) {
      ambientToggle.checked = false;
      toggleAmbientMode(false);
    }
  }
}

export function toggleAmbientMode(isActive) {
  document.body.classList.toggle('ambient-mode', isActive);
  
  const videoContainer = document.querySelector('.video-container');
  const mainContent = document.querySelector('.container');
  const textContainer = document.querySelector('.text-container');
  const programInfo = document.querySelector('.program-info');
  
  if (isActive) {
    mainContent.style.opacity = '0.3';
    textContainer.style.opacity = '0.3';
    
    videoContainer.classList.add('theater-mode');
    
    // Fade out inicial das informações do programa
    if (programInfo) {
      programInfo.style.opacity = '0';
      programInfo.style.transform = 'translateY(100%)';
    }
    
    // Mostrar mensagem ESC
    showEscMessage(videoContainer);
    
    videoContainer.style.backgroundColor = getRandomDarkColor();
  } else {
    mainContent.style.opacity = '1';
    textContainer.style.opacity = '1';
    
    videoContainer.classList.remove('theater-mode');
    
    // Restaura a visibilidade das informações do programa
    if (programInfo) {
      programInfo.style.opacity = '1';
      programInfo.style.transform = 'translateY(0)';
    }
    
    // Remover mensagem ESC se existir
    removeEscMessage();
    
    videoContainer.style.backgroundColor = '';
  }
}

// Função para mostrar mensagem ESC
function showEscMessage(container) {
  removeEscMessage(); // Remove mensagem existente se houver
  
  const message = document.createElement('div');
  message.className = 'esc-message';
  message.innerHTML = 'Pressione ESC para sair do modo ambiente';
  document.body.appendChild(message); // Adiciona ao body ao invés do container
  
  // Fade in da mensagem
  requestAnimationFrame(() => {
    message.classList.add('show');
  });
  
  // Fade out após alguns segundos
  setTimeout(() => {
    message.classList.add('hide');
    setTimeout(() => {
      message.remove();
    }, 500);
  }, 3000);
}

// Função para remover mensagem ESC
function removeEscMessage() {
  const existingMessage = document.querySelector('.esc-message');
  if (existingMessage) {
    existingMessage.classList.add('hide');
    setTimeout(() => {
      existingMessage.remove();
    }, 500);
  }
}

