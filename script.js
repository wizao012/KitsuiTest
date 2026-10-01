const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#site-menu');

if (menuButton && menu) {
  const closeMenu = () => {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
  };

  menuButton.addEventListener('click', () => {
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    menuButton.setAttribute('aria-expanded', String(willOpen));
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const faqMoreButton = document.querySelector('.faq-more-toggle');
const faqMore = document.querySelector('#faq-more');

if (faqMoreButton && faqMore) {
  faqMoreButton.addEventListener('click', () => {
    const shouldOpen = faqMore.hidden;
    faqMore.hidden = !shouldOpen;
    faqMoreButton.setAttribute('aria-expanded', String(shouldOpen));
    faqMoreButton.querySelector('span').textContent = shouldOpen ? 'その他の質問を閉じる' : 'その他の質問を表示';
  });
}

const form = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');

if (form && formStatus) {
  form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) return;
    event.preventDefault();

    if (form.elements.website.value) return;

    formStatus.textContent = '入力内容を確認しました。公開時に送信先エンドポイントを接続してください。';
    formStatus.focus?.();
  });
}

window.addEventListener('load', () => {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (target) window.requestAnimationFrame(() => target.scrollIntoView());
});
