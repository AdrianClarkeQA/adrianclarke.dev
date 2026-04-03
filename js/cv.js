/* ─────────────────────────────────────────
   js/cv.js
   Fetches /data/cv.json and renders it as
   syntax-highlighted HTML in #json-output.
───────────────────────────────────────── */

fetch('/data/cv.json')
  .then(function (res) { return res.json(); })
  .then(function (data) {
    var raw = JSON.stringify(data, null, 2);
    document.getElementById('json-output').innerHTML = highlight(raw);
  });

function highlight(json) {
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      function (match) {
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            return '<span class="j-key">' + match + '</span>';
          }
          return '<span class="j-string">' + match + '</span>';
        }
        if (/true|false/.test(match)) {
          return '<span class="j-bool">' + match + '</span>';
        }
        if (/null/.test(match)) {
          return '<span class="j-null">' + match + '</span>';
        }
        return '<span class="j-number">' + match + '</span>';
      }
    );
}