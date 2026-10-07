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

    const restartProgress = () => {
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
        const field = slide.querySelector('[data-uf-typing]');
        if (field && slideIndex !== current) field.textContent = '';
      });
      tabs.forEach((tab, tabIndex) => tab.setAttribute('aria-selected', String(tabIndex === current)));
      restartProgress();
      typeSlide(slides[current], runToken);
      window.clearTimeout(timer);
      if (!reducedMotion) timer = window.setTimeout(() => show(current + 1), userTriggered ? 6200 : 5200);
    };

    tabs.forEach((tab) => tab.addEventListener('click', () => show(Number(tab.dataset.ufGo), true)));
    document.addEventListener('visibilitychange', () => {
      window.clearTimeout(timer);
      if (!document.hidden && !reducedMotion) timer = window.setTimeout(() => show(current + 1), 5200);
    });
    show(0);
  });
})();
