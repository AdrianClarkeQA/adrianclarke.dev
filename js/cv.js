/* ─────────────────────────────────────────
   js/cv.js
   CV page (pages/cv.html). Fetches /data/cv.json and renders:
   - a syntax-highlighted, foldable JSON view in #json-output
   - a readable CV in #cv-readable (via cv-render.js)
   plus the JSON / Readable toggle and Print.
   Requires js/cv-render.js to be loaded first.
───────────────────────────────────────── */

(function () {
  var MAX_INDENT_CLASS = 6;

  var output = document.getElementById('json-output');
  var jsonView = document.getElementById('cv-json-view');
  var readableView = document.getElementById('cv-readable');
  var note = document.getElementById('cv-note');
  var viewButtons = document.querySelectorAll('[data-cv-view]');
  var printButton = document.getElementById('cv-print');

  if (!output || !window.CvRender) return;

  var escapeHtml = window.CvRender.escapeHtml;
  var cvData = null;
  var folded = {};

  window.CvRender.loadCv()
    .then(function (data) {
      cvData = data;
      renderJson();
      if (readableView) readableView.innerHTML = window.CvRender.renderReadable(data);
    })
    .catch(function () {
      output.innerHTML = '<p class="terminal-status">Could not load CV JSON.</p>';
      if (readableView) readableView.innerHTML = '<p class="cv-status">Could not load CV data.</p>';
    });

  /* ── JSON view ─────────────────────────── */

  function token(text, kind) {
    return { text: text, kind: kind };
  }

  function primitiveToken(value) {
    if (typeof value === 'string') return token(JSON.stringify(value), 'str');
    return token(String(value), 'num'); // numbers, booleans, null
  }

  /* Walks the CV and returns one entry per rendered line.
     Top-level keys are foldable. */
  function buildLines(data) {
    var lines = [];

    function push(depth, tokens, foldKey) {
      lines.push({ depth: depth, tokens: tokens, foldKey: foldKey || null });
    }

    function walk(value, depth, key, hasComma, foldKey) {
      var head = key !== null ? [token(JSON.stringify(key), 'key'), token(': ', 'p')] : [];
      var comma = hasComma ? ',' : '';

      if (value !== null && typeof value === 'object') {
        var isArray = Array.isArray(value);
        var open = isArray ? '[' : '{';
        var close = isArray ? ']' : '}';
        var entries = isArray
          ? value.map(function (item) { return [null, item]; })
          : Object.keys(value).map(function (k) { return [k, value[k]]; });

        if (foldKey && folded[foldKey]) {
          push(depth, head.concat([token(open + ' … ' + close + comma, 'p')]), foldKey);
          return;
        }

        push(depth, head.concat([token(open, 'p')]), foldKey);
        entries.forEach(function (entry, i) {
          var childFoldKey = depth === 0 ? entry[0] : null;
          walk(entry[1], depth + 1, entry[0], i < entries.length - 1, childFoldKey);
        });
        push(depth, [token(close + comma, 'p')]);
        return;
      }

      push(depth, head.concat([primitiveToken(value), token(comma, 'p')]), foldKey);
    }

    walk(data, 0, null, false, null);
    return lines;
  }

  function renderLine(line, index) {
    var code = line.tokens.map(function (t) {
      return t.text ? '<span class="j-' + t.kind + '">' + escapeHtml(t.text) + '</span>' : '';
    }).join('');

    var fold = '';
    var rowAttrs = '';

    if (line.foldKey) {
      var isFolded = !!folded[line.foldKey];
      rowAttrs = ' data-fold="' + escapeHtml(line.foldKey) + '"';
      fold = '<button type="button" class="json-fold-btn" aria-expanded="' + !isFolded + '"' +
        ' aria-label="' + (isFolded ? 'Expand ' : 'Fold ') + escapeHtml(line.foldKey) + '">' +
        (isFolded ? '+' : '−') + '</button>';
    }

    return [
      '<div class="json-line' + (line.foldKey ? ' is-foldable' : '') + '"' + rowAttrs + '>',
      '<span class="json-ln" aria-hidden="true">' + (index + 1) + '</span>',
      '<span class="json-mark">' + fold + '</span>',
      '<span class="json-code json-d' + Math.min(line.depth, MAX_INDENT_CLASS) + '">' + code + '</span>',
      '</div>'
    ].join('');
  }

  function renderJson(focusKey) {
    output.innerHTML = buildLines(cvData).map(renderLine).join('');

    if (focusKey) {
      var row = output.querySelector('[data-fold="' + focusKey + '"] .json-fold-btn');
      if (row) row.focus();
    }
  }

  // Clicking anywhere on a top-level key's line folds/unfolds it
  output.addEventListener('click', function (event) {
    var row = event.target.closest('[data-fold]');
    if (!row || !cvData) return;

    var key = row.getAttribute('data-fold');
    var cameFromButton = !!event.target.closest('.json-fold-btn');
    folded[key] = !folded[key];
    renderJson(cameFromButton ? key : null);
  });

  /* ── View toggle ───────────────────────── */

  function setView(view) {
    var showReadable = view === 'readable';
    if (jsonView) jsonView.hidden = showReadable;
    if (readableView) readableView.hidden = !showReadable;
    if (note) note.hidden = showReadable; // the note belongs with the JSON view only

    viewButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-cv-view') === view));
    });
  }

  viewButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      setView(button.getAttribute('data-cv-view'));
    });
  });

  /* ── Print ─────────────────────────────── */

  if (printButton) {
    printButton.addEventListener('click', function () {
      setView('readable');
      setTimeout(function () { window.print(); }, 50);
    });
  }
})();
