// B hero: whole scenes slide left; one clock drives text, routing and calls.
(() => {
  const root = document.querySelector('[data-b-flow]');
  if (!root) return;
  const scenes = Array.from(root.querySelectorAll('[data-b-scene]'));
  const tabs = Array.from(root.querySelectorAll('[data-b-go]'));
  const pauseButton = root.querySelector('[data-b-pause]');
  const progress = root.querySelector('.cp-b-progress i');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobilePreference = window.matchMedia('(max-width: 768px)');
  const duration = 8500;
  let active = 0;
  let playing = !preference.matches;
  let inView = true;
  let elapsed = 0;
  let lastFrame = 0;
  let frame = 0;
  let target;
  let characters = [];
  let count = -1;
  let phase = -1;

  const running = () => playing && inView && !document.hidden && !preference.matches;
  const syncPause = () => {
    root.classList.toggle('is-paused', !running());
    pauseButton.setAttribute('aria-pressed', String(!playing));
    pauseButton.setAttribute('aria-label', playing ? 'アニメーションを一時停止' : 'アニメーションを再生');
    pauseButton.querySelector('span').textContent = playing ? 'Ⅱ' : '▶';
  };
  const render = () => {
    const nextCount = Math.min(characters.length, Math.max(0, Math.floor((elapsed - 700) / 65)));
    if (nextCount !== count) {
      count = nextCount;
      target.textContent = characters.slice(0, count).join('');
      scenes[active].classList.toggle('is-typed', count === characters.length);
    }
    const nextPhase = elapsed >= 5100 ? 3 : elapsed >= 3400 ? 2 : elapsed >= 1000 ? 1 : 0;
    if (nextPhase !== phase) {
      phase = nextPhase;
      scenes[active].dataset.phase = String(phase);
    }
    progress.style.transform = `scaleX(${Math.min(1, elapsed / duration)})`;
  };
  const tick = (now) => {
    frame = 0;
    if (!running()) return;
    if (lastFrame) elapsed += Math.min(now - lastFrame, 150);
    lastFrame = now;
    if (elapsed >= duration) show(active + 1);
    else render();
    if (running() && !frame) frame = window.requestAnimationFrame(tick);
  };
  const schedule = () => {
    window.cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = 0;
    syncPause();
    if (running()) frame = window.requestAnimationFrame(tick);
  };
  const show = (index, focusTab = false, first = false) => {
    const next = (index + scenes.length) % scenes.length;
    const previous = scenes[active];
    const changed = next !== active;
    scenes.forEach((scene, i) => {
      scene.classList.remove('is-active', 'is-leaving', 'is-typed');
      scene.setAttribute('aria-hidden', String(i !== next));
      scene.inert = i !== next;
    });
    if (changed && !preference.matches) previous.classList.add('is-leaving');
    active = next;
    void scenes[active].offsetWidth;
    scenes[active].classList.add('is-active');
    root.classList.toggle('has-started', !first);
    root.dataset.bState = String(active);
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === active));
      tab.tabIndex = i === active ? 0 : -1;
    });
    if (focusTab) tabs[active].focus();
    target = scenes[active].querySelector('[data-b-typing]');
    characters = Array.from(mobilePreference.matches && target.dataset.bTypingMobile ? target.dataset.bTypingMobile : target.dataset.bTyping);
    target.setAttribute('aria-label', characters.join(''));
    count = phase = -1;
    elapsed = playing && !preference.matches ? 0 : 5200;
    render();
    schedule();
  };
  scenes.forEach((scene) => scene.addEventListener('animationend', (event) => {
    if (event.target === scene && event.animationName === 'cpBSceneOut') scene.classList.remove('is-leaving');
  }));
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => show(index));
    tab.addEventListener('keydown', (event) => {
      let next = null;
      if (event.key === 'ArrowRight') next = active + 1;
      if (event.key === 'ArrowLeft') next = active - 1;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = scenes.length - 1;
      if (next !== null) {
        event.preventDefault();
        show(next, true);
      }
    });
  });
  pauseButton.addEventListener('click', () => {
    if (preference.matches) return;
    playing = !playing;
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      root.classList.toggle('is-in-view', inView);
      schedule();
    }, {threshold: .15}).observe(root);
  }
  root.classList.add('is-in-view');
  preference.addEventListener('change', () => {
    playing = !preference.matches;
    show(active);
  });
  mobilePreference.addEventListener('change', () => show(active));
  show(0, false, true);
})();
