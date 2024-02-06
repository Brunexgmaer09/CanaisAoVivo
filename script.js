const listaAmbientes = document.querySelectorAll('.ambiente');
const iframeVideo = document.getElementById('iframe-video');
const body = document.querySelector('body');
const idVideoPadrao = 'bbb'; // ID do vídeo do "Quarto Roxo"
// Carregar o vídeo do "Quarto Roxo" por padrão
iframeVideo.src = `https://reidoscanais.com/embed/?id=${idVideoPadrao}`;

body.style.backgroundColor = '#000';

listaAmbientes.forEach((button) => {
    button.addEventListener('click', () => {
        const idIframe = button.getAttribute('data-id');
        iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;

        // Animação para mostrar o vídeo
        iframeVideo.style.opacity = 0;
        iframeVideo.style.display = "block";
        iframeVideo.style.transition = "opacity 0.5s ease-in-out";
        setTimeout(() => {
            iframeVideo.style.opacity = 1;
        }, 100);
    });
});
