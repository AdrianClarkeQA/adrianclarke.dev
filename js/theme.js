/**
 * theme.js
 * Applies saved/preferred theme immediately (no defer) to prevent FOUC,
 * then exposes __initThemeToggle() for nav-loader.js to wire up the button.
 *
 * Order: saved choice (localStorage 'theme') → OS preference → light.
 */

(function () {
  var STORAGE_KEY = 'theme';

  function readSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* storage unavailable — theme still applies for this page view */
    }
  }

  function getPreferredTheme() {
    var saved = readSavedTheme();
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
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

  // Called by nav-loader.js after the sidebar HTML is injected into the DOM
  window.__initThemeToggle = function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    var label = btn.querySelector('.theme-toggle-label');

    function syncButton() {
      if (label) label.textContent = isDark() ? 'Light mode' : 'Dark mode';
    }

    syncButton();

    btn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      applyTheme(next);
      saveTheme(next);
      syncButton();
    });
  };
})();
