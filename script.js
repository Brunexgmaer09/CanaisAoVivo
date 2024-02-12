const listaAmbientes = document.querySelectorAll('.ambiente');
const iframeVideo = document.getElementById('iframe-video');
const body = document.querySelector('body');
const idVideoPadrao = 'bbb'; // ID do vídeo do "Quarto Roxo"

// Adicione o ID da Rede Globo
const listaIds = ['bbb', 'bbb2', 'bbb4', 'bbb8', 'bbb9', 'bbb11', 'globomg-globominas'];

// Carregar o vídeo do "Quarto Roxo" por padrão
iframeVideo.src = `https://reidoscanais.com/embed/?id=${idVideoPadrao}`;

body.style.backgroundColor = '#000';

listaAmbientes.forEach((button) => {
    button.addEventListener('click', () => {
        const idIframe = button.getAttribute('data-id');

        // Se for a Rede Globo, use a URL específica
        if (idIframe === 'globomg-globominas') {
            iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
        } else {
            // Use o código existente para outros botões
            switch (idIframe) {
                case 'bbb2':
                    iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
                    break;
                case 'bbb4':
                    iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
                    break;
                case 'bbb8':
                    iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
                    break;
                case 'bbb9':
                    iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
                    break;
                case 'bbb11':
                    iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
                    break;
                default:
                    iframeVideo.src = `https://reidoscanais.com/embed/?id=${idVideoPadrao}`;
            }
        }

        // Animação para mostrar o vídeo
        iframeVideo.style.opacity = 0;
        iframeVideo.style.display = "block";
        iframeVideo.style.transition = "opacity 0.5s ease-in-out";
        setTimeout(() => {
            iframeVideo.style.opacity = 1;
        }, 100);
    });
});
