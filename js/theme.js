/**
 * theme.js
 * Applies saved/preferred theme immediately (no defer) to prevent FOUC,
 * then exposes __initThemeToggle() for nav-loader.js to wire up the button.
 */

(function () {
  function getPreferredTheme() {
    return localStorage.getItem('theme') || 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // Apply immediately so the page renders in the correct theme
  applyTheme(getPreferredTheme());

  // Called by nav-loader.js after the nav HTML is injected into the DOM
  window.__initThemeToggle = function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    function syncButton() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    syncButton();

    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('theme', next);
      syncButton();
    });
  };
})();
