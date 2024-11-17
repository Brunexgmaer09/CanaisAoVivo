// js/modules/smokeText.js
export function animateSmokeText() {
  const smokeText = document.getElementById('smoke-text');
  const text = '• Transmissão ao vivo •';
  let charIndex = 0;

  function animate() {
    if (charIndex < text.length) {
      smokeText.innerHTML += `<span>${text[charIndex]}</span>`;
      charIndex++;
      setTimeout(animate, 150);
    } else {
      setTimeout(fade, 8000);
    }
  }

  function fade() {
    const spans = smokeText.querySelectorAll('span');
    spans.forEach((span, index) => {
      setTimeout(() => {
        span.classList.add('fade');
      }, index * 800);
    });
    setTimeout(() => {
      smokeText.innerHTML = '';
      charIndex = 0;
      setTimeout(animate, 5000);
    }, spans.length * 800 + 8000);
  }

  animate();
}

