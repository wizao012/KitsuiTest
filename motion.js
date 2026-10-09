(() => {
  const targets = document.querySelectorAll('.js-reveal');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });
  targets.forEach((el) => observer.observe(el));
})();

(() => {
  const root = document.querySelector('[data-flow-rotator]');
  const panels = Array.from(document.querySelectorAll('[data-flow-panel]'));
  const tabs = Array.from(document.querySelectorAll('[data-flow-tab]'));
  if (!root || panels.length < 2 || tabs.length !== panels.length) return;

  let active = 0;
  let timer = null;
  let cleanup = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const syncTabs = () => tabs.forEach((tab, index) => {
    const selected = index === active;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });

  const show = (next) => {
    const targetIndex = (next + panels.length) % panels.length;
    if (targetIndex === active) return;
    const current = panels[active];
    const target = panels[targetIndex];
    if (cleanup) window.clearTimeout(cleanup);

    current.classList.remove('is-active');
    current.classList.add('is-leaving');
    current.setAttribute('aria-hidden', 'true');
    target.classList.remove('is-leaving');
    target.setAttribute('aria-hidden', 'false');
    void target.offsetWidth;
    target.classList.add('is-active');
    active = targetIndex;
    syncTabs();

    cleanup = window.setTimeout(() => current.classList.remove('is-leaving'), 760);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };
  const start = () => {
    stop();
    if (!reducedMotion) timer = window.setInterval(() => show(active + 1), 4600);
  };

  tabs.forEach((tab, index) => tab.addEventListener('click', () => {
    show(index);
    start();
  }));
  const shell = root.parentElement;
  shell.addEventListener('mouseenter', stop);
  shell.addEventListener('mouseleave', start);
  shell.addEventListener('focusin', stop);
  shell.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  syncTabs();
  start();
})();


(() => {
  const items = Array.from(document.querySelectorAll('.js-faq-accord'));
  items.forEach((item, index) => {
    const question = item.querySelector('.c-faq__question');
    const answer = item.querySelector('.c-faq__answer');
    if (!question || !answer) return;
    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');
    const sync = () => question.setAttribute('aria-expanded', String(item.classList.contains('is-open')));
    const toggle = () => {
      const willOpen = !item.classList.contains('is-open');
      item.classList.toggle('is-open', willOpen);
      item.classList.toggle('is-close', !willOpen);
      sync();
    };
    question.addEventListener('click', toggle);
    question.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });
    sync();
  });
})();

(() => {
  const flows = Array.from(document.querySelectorAll('[data-universal-flow]'));
  if (!flows.length) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  flows.forEach((flow) => {
    const track = flow.querySelector('[data-uf-track]');
    const slides = Array.from(flow.querySelectorAll('[data-uf-slide]'));
    const tabs = Array.from(flow.querySelectorAll('[data-uf-go]'));
    if (!track || slides.length < 2 || tabs.length !== slides.length) return;
    const duration = Number(flow.dataset.ufDuration) || 5200;

    let current = 0;
    let timer = 0;
    let runToken = 0;

    const typeSlide = async (slide, token) => {
      const field = slide.querySelector('[data-uf-typing]');
      if (!field) return;
      const copy = field.dataset.ufTyping || '';
      field.textContent = '';
      if (reducedMotion) {
        field.textContent = copy;
        return;
      }
      await sleep(500);
      for (let index = 0; index < copy.length; index += 1) {
        if (token !== runToken) return;
        field.textContent += copy[index];
        await sleep(52 + Math.random() * 34);
      }
    };

    const restartProgress = (nextDuration) => {
      flow.style.setProperty('--cp-flow-duration', `${nextDuration}ms`);
      flow.classList.remove('is-running');
      void flow.offsetWidth;
      flow.classList.add('is-running');
    };

    const show = (index, userTriggered = false) => {
      current = (index + slides.length) % slides.length;
      runToken += 1;
      track.style.transform = `translateX(-${current * 33.333333}%)`;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === current);
        slide.setAttribute('aria-hidden', String(slideIndex !== current));
        const field = slide.querySelector('[data-uf-typing]');
        if (field && slideIndex !== current) field.textContent = '';
      });
      tabs.forEach((tab, tabIndex) => tab.setAttribute('aria-selected', String(tabIndex === current)));
      const nextDuration = userTriggered ? duration + 1000 : duration;
      restartProgress(nextDuration);
      typeSlide(slides[current], runToken);
      window.clearTimeout(timer);
      if (!reducedMotion) timer = window.setTimeout(() => show(current + 1), nextDuration);
    };

    tabs.forEach((tab) => tab.addEventListener('click', () => show(Number(tab.dataset.ufGo), true)));
    document.addEventListener('visibilitychange', () => {
      window.clearTimeout(timer);
      if (!document.hidden && !reducedMotion) timer = window.setTimeout(() => show(current + 1), duration);
    });
    show(0);
  });
})();

// C hero: keep the phone fixed while response, memo and notification change.
(() => {
  const root = document.querySelector('[data-c-flow]');
  if (!root) return;
  const scenes = Array.from(root.querySelectorAll('[data-c-scene]'));
  const screens = Array.from(root.querySelectorAll('[data-c-screen]'));
  const tabs = Array.from(root.querySelectorAll('[data-c-go]'));
  const pauseButton = root.querySelector('[data-c-pause]');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let playing = !motionPreference.matches;
  let inView = true;
  let cycleTimer = 0;
  let typingTimer = 0;
  const duration = 6500;

  const schedule = () => {
    window.clearTimeout(cycleTimer);
    if (playing && inView && !document.hidden) {
      cycleTimer = window.setTimeout(() => show(active + 1), duration);
    }
  };
  const syncPause = () => {
    root.classList.toggle('is-paused', !playing);
    pauseButton.setAttribute('aria-pressed', String(!playing));
    pauseButton.setAttribute('aria-label', playing ? 'アニメーションを一時停止' : 'アニメーションを再生');
    pauseButton.querySelector('span').textContent = playing ? 'Ⅱ' : '▶';
  };
  const typeResponse = (scene) => {
    window.clearInterval(typingTimer);
    const target = scene.querySelector('[data-c-typing]');
    const text = window.matchMedia('(max-width: 768px)').matches && target.dataset.cTypingMobile ? target.dataset.cTypingMobile : target.dataset.cTyping;
    target.setAttribute('aria-label', text);
    scene.classList.remove('is-typed');
    if (motionPreference.matches) {
      target.textContent = text;
      scene.classList.add('is-typed');
      return;
    }
    const characters = Array.from(text);
    let count = 0;
    let delay = 6;
    target.textContent = '';
    typingTimer = window.setInterval(() => {
      if (!playing || !inView || document.hidden) return;
      if (delay-- > 0) return;
      count += 1;
      target.textContent = characters.slice(0, count).join('');
      if (count >= characters.length) {
        window.clearInterval(typingTimer);
        scene.classList.add('is-typed');
      }
    }, 65);
  };
  const show = (index, focusTab = false) => {
    active = (index + scenes.length) % scenes.length;
    scenes.forEach((scene, i) => {
      scene.classList.remove('is-active');
      scene.setAttribute('aria-hidden', String(i !== active));
    });
    // Restart the staged bubble / notification entrance on every selection.
    void scenes[active].offsetWidth;
    scenes[active].classList.add('is-active');
    screens.forEach((screen, i) => screen.classList.toggle('is-active', i === active));
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === active));
      tab.tabIndex = i === active ? 0 : -1;
    });
    if (focusTab) tabs[active].focus();
    typeResponse(scenes[active]);
    if (!playing && !motionPreference.matches) {
      const target = scenes[active].querySelector('[data-c-typing]');
      target.textContent = window.matchMedia('(max-width: 768px)').matches && target.dataset.cTypingMobile ? target.dataset.cTypingMobile : target.dataset.cTyping;
      scenes[active].classList.add('is-typed');
      window.clearInterval(typingTimer);
    }
    schedule();
  };
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
    playing = !playing;
    syncPause();
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      schedule();
    }, { threshold: .15 }).observe(root);
  }
  motionPreference.addEventListener('change', () => {
    playing = !motionPreference.matches;
    syncPause();
    show(active);
  });
  syncPause();
  show(0);
})();
