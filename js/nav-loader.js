/**
 * nav-loader.js
 * Fetches nav.html (the sidebar) and swaps it in for #nav-placeholder.
 * Usage: <script src="/js/nav-loader.js" defer></script>
 *
 * The script resolves nav.html relative to the site root by default.
 * If your nav.html lives somewhere else, update NAV_PATH below.
 */

(function () {
  const NAV_PATH = '/pages/nav.html';

  // Which nav item each route belongs to
  const ROUTE_SECTIONS = {
    '/': 'home',
    '/index.html': 'home',
    '/pages/about-me.html': 'about',
    '/pages/cv.html': 'cv',
    '/pages/curriculum-vitae.html': 'cv'
  };

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

      markCurrentPage();

      if (window.__initThemeToggle) window.__initThemeToggle();
    })
    .catch(function (err) {
      console.warn(err);
    });

  function markCurrentPage() {
    const section = ROUTE_SECTIONS[window.location.pathname];
    if (!section) return;

    const link = document.querySelector('.nav [data-nav="' + section + '"]');
    if (link) link.setAttribute('aria-current', 'page');
  }
})();
