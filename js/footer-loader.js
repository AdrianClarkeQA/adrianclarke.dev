/**
 * footer-loader.js
 * Fetches footer.html and injects it before the closing </body> tag.
 * Usage: <script src="/js/footer-loader.js" defer></script>
 *
 * The script resolves footer.html relative to the site root by default.
 * If your footer.html lives somewhere else, update FOOTER_PATH below.
 */

(function () {
  const FOOTER_PATH = '/pages/footer.html';

  fetch(FOOTER_PATH)
    .then(function (res) {
      if (!res.ok) throw new Error('Could not load footer: ' + res.status);
      return res.text();
    })
    .then(function (html) {
      const placeholder = document.getElementById('footer-placeholder');
      if (placeholder) {
        placeholder.outerHTML = html;
      } else {
        document.body.insertAdjacentHTML('beforeend', html);
      }
    })
    .catch(function (err) {
      console.warn(err);
    });
})();