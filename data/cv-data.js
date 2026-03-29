/* ─────────────────────────────────────────
   js/cv.js
   Fetches data/cv.json and renders it as
   syntax-highlighted HTML in #json-output.

   Requires a local server to run — open
   the project with:  npx serve
───────────────────────────────────────── */

(function () {

  function highlight(value, indent) {
    indent = indent || 0;
    var pad  = '  '.repeat(indent);
    var pad1 = '  '.repeat(indent + 1);

    if (value === null) {
      return span('j-null', 'null');
    }
    if (typeof value === 'boolean') {
      return span('j-bool', String(value));
    }
    if (typeof value === 'number') {
      return span('j-number', String(value));
    }
    if (typeof value === 'string') {
      return span('j-string', '"' + esc(value) + '"');
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return span('j-bracket', '[]');

      var allPrimitive = value.every(function (v) {
        return typeof v !== 'object' || v === null;
      });
      if (allPrimitive) {
        var inline = value.map(function (v) { return highlight(v, 0); })
                          .join(span('j-comma', ',') + ' ');
        return span('j-bracket', '[') + inline + span('j-bracket', ']');
      }

      var rows = value.map(function (v, i) {
        var comma = i < value.length - 1 ? span('j-comma', ',') : '';
        return pad1 + highlight(v, indent + 1) + comma;
      });
      return span('j-bracket', '[') + '\n' + rows.join('\n') + '\n' + pad + span('j-bracket', ']');
    }
    if (typeof value === 'object') {
      var keys = Object.keys(value);
      if (keys.length === 0) return span('j-brace', '{}');

      var lines = keys.map(function (k, i) {
        var comma = i < keys.length - 1 ? span('j-comma', ',') : '';
        return pad1
          + span('j-key', '"' + esc(k) + '"')
          + span('j-colon', ':') + ' '
          + highlight(value[k], indent + 1)
          + comma;
      });
      return span('j-brace', '{') + '\n' + lines.join('\n') + '\n' + pad + span('j-brace', '}');
    }

    return esc(String(value));
  }

  function span(cls, content) {
    return '<span class="' + cls + '">' + content + '</span>';
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var output = document.getElementById('json-output');

  fetch('data/cv.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      output.innerHTML = highlight(data, 0);
    })
    .catch(function (err) {
      output.innerHTML = span('j-error',
        '// Could not load data/cv.json\n' +
        '// ' + esc(err.message) + '\n\n' +
        '// Make sure you are running a local server:\n' +
        '//   cd your-project-folder\n' +
        '//   npx serve'
      );
    });

}());