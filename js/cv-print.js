/* ─────────────────────────────────────────
   js/cv-print.js
   Print-friendly CV page (pages/curriculum-vitae.html).
   Fetches /data/cv.json and renders the readable CV
   into #cv-print-content.
   Requires js/cv-render.js to be loaded first.
───────────────────────────────────────── */

(function () {
  var root = document.getElementById('cv-print-content');
  var printButton = document.getElementById('cv-print-btn');

  if (printButton) {
    printButton.addEventListener('click', function () {
      window.print();
    });
  }

  if (!root || !window.CvRender) return;

  window.CvRender.loadCv()
    .then(function (data) {
      root.innerHTML = window.CvRender.renderReadable(data);
    })
    .catch(function () {
      root.innerHTML = '<p class="cv-status">Could not load CV data.</p>';
    });
})();
