(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  qsa('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = qs(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      qs('.js-sp-menu')?.classList.remove('is-open');
      qs('.js-menu-btn')?.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    });
  });

  const menuButton = qs('.js-menu-btn');
  const menu = qs('.js-sp-menu');
  menuButton?.addEventListener('click', () => {
    const open = menuButton.classList.toggle('is-open');
    menu?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });

  qsa('.js-voice-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const current = qs('audio', button);
      qsa('.js-voice-btn audio').forEach((audio) => {
        if (audio !== current) { audio.pause(); audio.currentTime = 0; }
      });
      if (!current) return;
      if (current.paused) current.play(); else current.pause();
    });
  });

  const slides = qsa('.visual .slide .pho');
  if (slides.length > 1) {
    let current = 0;
    slides.forEach((slide, index) => slide.setAttribute('aria-hidden', index ? 'true' : 'false'));
    window.setInterval(() => {
      slides[current].setAttribute('aria-hidden', 'true');
      current = (current + 1) % slides.length;
      slides[current].setAttribute('aria-hidden', 'false');
    }, 4400);
  }

  qsa('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let note = qs('.static-form-note', form);
      if (!note) {
        note = document.createElement('p');
        note.className = 'static-form-note';
        note.textContent = '静的プレビューのため、フォーム送信は停止しています。';
        form.appendChild(note);
      }
      note.classList.add('is-visible');
    });
  });
})();
