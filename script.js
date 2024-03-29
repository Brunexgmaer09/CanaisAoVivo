const listaAmbientes = document.querySelectorAll('.ambiente');
const iframeVideo = document.getElementById('iframe-video');
const body = document.querySelector('body');

// Adicione os IDs dos novos canais
const listaIds = ['bbb', 'bbb2', 'bbb3', 'bbb4', 'bbb5', 'bbb6', 'bbb7', 'bbb8', 'bbb10', 'bbb11', 'globomg-globominas'];

// Carregar o "Acompanhe a Casa" por padrão
iframeVideo.src = `https://reidoscanais.com/embed/?id=bbb`;

body.style.backgroundColor = '#000';

listaAmbientes.forEach((button) => {
  button.addEventListener('click', () => {
    const idIframe = button.getAttribute('data-id');

    // Atualize a lógica para usar os novos IDs
    switch (idIframe) {
      case 'bbb':
        iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
        break;
      case 'bbb2':
        iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
        break;
      case 'bbb3':
        iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
        break;
      case 'bbb4':
        iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
        break;
      case 'bbb5':
        iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
        break;
      case 'bbb6':
        iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
        break;
      case 'bbb7':
        iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
        break;
      case 'bbb8':
        iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
        break;
      case 'bbb10':
        iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
        break;
      case 'bbb11':
        iframeVideo.src = `https://reidoscanais.com/embed/?id=${idIframe}`;
        break;
      default:
        console.log('ID do canal inválido:', idIframe);
    }
  });
});
