// js/modules/videoController.js
import { updateChannelInfo } from './programInfo.js';

export function showVideo(channel) {
  const videoContainer = document.getElementById('video-container');
  const iframeVideo = document.getElementById('iframe-video');
  const loadingOverlay = videoContainer.querySelector('.loading-overlay');
  const programInfo = videoContainer.querySelector('.program-info');
  
  // Mostra overlay de carregamento
  loadingOverlay.classList.add('active');
  
  // Adiciona classe para animação de fade out
  videoContainer.classList.add('fade-out');
  if (programInfo) {
    programInfo.style.opacity = '0';
  }
  
  setTimeout(() => {
    // Verifica se é o canal Globo MG que tem um ID especial
    const channelId = channel === 'globomg' ? 'globomg-globominas' : channel;
    
    iframeVideo.src = `https://reidoscanais.eu/embed/?id=${channelId}`;
    
    // Mostra o container se estiver oculto
    videoContainer.style.display = 'block';
    
    // Atualiza as informações do programa
    updateChannelInfo(channel);
    
    // Remove a classe de fade out e adiciona fade in
    videoContainer.classList.remove('fade-out');
    videoContainer.classList.add('fade-in');
    
    // Quando o iframe carregar
    iframeVideo.onload = () => {
      // Remove overlay de carregamento
      loadingOverlay.classList.remove('active');
      
      // Se estiver em modo ambiente, aplica modo teatro
      if (document.body.classList.contains('ambient-mode')) {
        videoContainer.classList.add('theater-mode');
      }
      
      // Fade in das informações do programa
      if (programInfo) {
        setTimeout(() => {
          programInfo.style.opacity = '1';
        }, 500);
      }
    };
    
    // Limpa a classe de fade in após a animação
    setTimeout(() => {
      videoContainer.classList.remove('fade-in');
    }, 1000);
  }, 300);
}

