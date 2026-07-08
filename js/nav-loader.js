/**
 * nav-loader.js
 * Fetches nav.html and injects it before the first element in <body>.
 * Usage: <script src="/js/nav-loader.js" defer></script>
 *
 * The script resolves nav.html relative to the site root by default.
 * If your nav.html lives somewhere else, update NAV_PATH below.
 */

(function () {
  const NAV_PATH = '/pages/nav.html';

  fetch(NAV_PATH)
    .then(function (res) {
      if (!res.ok) throw new Error('Could not load nav: ' + res.status);
      return res.text();
    })
    .then(function (html) {
      const placeholder = document.getElementById('nav-placeholder');
      if (placeholder) {
        placeholder.outerHTML = html;
      } else {
        document.body.insertAdjacentHTML('afterbegin', html);
      }

      const toggle = document.querySelector('.nav-toggle');
      const links  = document.getElementById('nav-links');
      if (toggle && links) {
        toggle.addEventListener('click', function () {
          const open = links.classList.toggle('is-open');
          toggle.setAttribute('aria-expanded', open);
        });
      }

      if (window.__initThemeToggle) window.__initThemeToggle();
    })
    .catch(function (err) {
      console.warn(err);
    });
})();