// js/modules/smokeText.js
export function animateSmokeText() {
  const smokeText = document.getElementById('smoke-text');
  const text = 'Site feito por Brunex';
  let charIndex = 0;

  function animate() {
    if (charIndex < text.length) {
      smokeText.innerHTML += `<span>${text[charIndex]}</span>`;
      charIndex++;
      setTimeout(animate, 100);
    } else {
      setTimeout(fade, 2000);
    }
  }

  function fade() {
    const spans = smokeText.querySelectorAll('span');
    spans.forEach((span, index) => {
      setTimeout(() => {
        span.classList.add('fade');
      }, index * 500);
    });
    setTimeout(() => {
      smokeText.innerHTML = '';
      charIndex = 0;
      animate();
    }, spans.length * 500 + 5000);
  }

  animate();
}

