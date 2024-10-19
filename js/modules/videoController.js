// js/modules/videoController.js
export function showVideo(channel) {
  const videoContainer = document.getElementById('video-container');
  const iframeVideo = document.getElementById('iframe-video');

  videoContainer.style.display = 'block';
  videoContainer.style.opacity = 0;

  setTimeout(() => {
    videoContainer.style.opacity = 1;
    iframeVideo.src = `https://reidoscanais.eu/embed/?id=${channel}`;
  }, 10);
}

