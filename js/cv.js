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
    initializeCvModal(data);
  })
  .catch(function () {
    var output = document.getElementById('json-output');
    output.textContent = 'Could not load CV JSON.';
    initializeCvModal(null);
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

function initializeCvModal(initialData) {
  var trigger = document.getElementById('open-cv-modal');
  var modal = document.getElementById('cv-modal');
  var content = document.getElementById('cv-modal-content');
  var printButton = document.getElementById('cv-modal-print');

  if (!trigger || !modal || !content) {
    return;
  }

  var closeButtons = modal.querySelectorAll('[data-close-modal]');
  var renderedData = initialData || null;
  var previousFocus = null;

  trigger.addEventListener('click', openModal);

  closeButtons.forEach(function (button) {
    button.addEventListener('click', closeModal);
  });

  if (printButton) {
    printButton.addEventListener('click', function () {
      window.print();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });

  function openModal() {
    previousFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('has-open-modal');

    if (!renderedData) {
      loadCvData();
    }

    var closeButton = modal.querySelector('.cv-modal-close');
    if (closeButton) {
      closeButton.focus();
    }
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('has-open-modal');
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
  }

  function loadCvData() {
    content.innerHTML = '<p class="cv-doc-loading">Loading document...</p>';
    fetch('/data/cv.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        renderedData = data;
        renderCvDocument(content, data);
      })
      .catch(function () {
        content.innerHTML = [
          '<div class="cv-doc-error">',
          '<p>Could not load CV data.</p>',
          '<button type="button" class="btn-primary" id="cv-modal-retry">Retry</button>',
          '</div>'
        ].join('');

        var retry = document.getElementById('cv-modal-retry');
        if (retry) {
          retry.addEventListener('click', loadCvData);
        }
      });
  }

  if (renderedData) {
    renderCvDocument(content, renderedData);
  }
}

function renderCvDocument(root, data) {
  var basics = data.basics || {};
  var experience = Array.isArray(data.experience) ? data.experience : [];
  var skills = Array.isArray(data.skills) ? data.skills : [];
  var education = Array.isArray(data.education) ? data.education : [];
  var certifications = Array.isArray(data.certifications) ? data.certifications : [];
  var languages = Array.isArray(data.languages) ? data.languages : [];

  var summaryHtml = data.summary
    ? '<section class="cv-doc-section"><h3>Summary</h3><p>' + escapeHtml(data.summary) + '</p></section>'
    : '';

  root.innerHTML = [
    '<article class="cv-doc">',
    '<header class="cv-doc-header">',
    '<div class="cv-doc-header-main">',
    '<h1>' + escapeHtml(basics.name || 'Adrian Clarke') + '</h1>',
    basics.label ? '<p class="cv-doc-role">' + escapeHtml(basics.label) + '</p>' : '',
    '<ul class="cv-doc-meta">',
    basics.location ? '<li>' + escapeHtml(basics.location) + '</li>' : '',
    basics.url ? '<li>URL: ' + escapeHtml(basics.url) + '</li>' : '',
    '</ul>',
    '</div>',
    '<div class="cv-doc-header-avatar">',
    '<img src="/images/avatar-brick-square.jpg" alt="Adrian Clarke avatar">',
    '</div>',
    '</header>',
    '<div class="cv-doc-grid">',
    '<aside class="cv-doc-sidebar">',
    renderSkillsSection(skills),
    renderLanguagesSection(languages),
    renderCertificationsSection(certifications),
    '</aside>',
    '<main class="cv-doc-main">',
    summaryHtml,
    renderExperienceSection(experience),
    renderEducationSection(education),
    '</main>',
    '</div>',
    '</article>'
  ].join('');
}

function renderSkillsSection(skills) {
  if (!skills.length) {
    return '';
  }

  var items = skills.map(function (skill) {
    var tools = Array.isArray(skill.tools) ? skill.tools.join(', ') : '';
    return [
      '<li>',
      '<p class="cv-doc-subhead">' + escapeHtml(skill.name || '') + '</p>',
      tools ? '<p>' + escapeHtml(tools) + '</p>' : '',
      '</li>'
    ].join('');
  }).join('');

  return '<section class="cv-doc-section"><h3>Skills</h3><ul class="cv-doc-list">' + items + '</ul></section>';
}

function renderLanguagesSection(languages) {
  if (!languages.length) {
    return '';
  }

  var items = languages.map(function (entry) {
    var label = [entry.language, entry.fluency].filter(Boolean).join(' - ');
    return '<li>' + escapeHtml(label) + '</li>';
  }).join('');

  return '<section class="cv-doc-section"><h3>Languages</h3><ul class="cv-doc-list">' + items + '</ul></section>';
}

function renderCertificationsSection(certifications) {
  if (!certifications.length) {
    return '';
  }

  var items = certifications.map(function (item) {
    var label = [item.name, item.issuer, item.year].filter(Boolean).join(' - ');
    return '<li>' + escapeHtml(label) + '</li>';
  }).join('');

  return '<section class="cv-doc-section"><h3>Certifications</h3><ul class="cv-doc-list">' + items + '</ul></section>';
}

function renderExperienceSection(experience) {
  if (!experience.length) {
    return '';
  }

  var cards = experience.map(function (item) {
    var highlights = Array.isArray(item.highlights)
      ? item.highlights.map(function (point) { return '<li>' + escapeHtml(point) + '</li>'; }).join('')
      : '';
    var stack = Array.isArray(item.stack) && item.stack.length
      ? '<p class="cv-doc-stack"><strong>Stack:</strong> ' + escapeHtml(item.stack.join(', ')) + '</p>'
      : '';

    return [
      '<article class="cv-doc-entry">',
      '<header>',
      '<h4>' + escapeHtml(item.role || '') + '</h4>',
      '<p class="cv-doc-company">' + escapeHtml(item.company || '') + '</p>',
      '<p class="cv-doc-dates">' + formatDateRange(item.from, item.to, item.current) + '</p>',
      '</header>',
      highlights ? '<ul class="cv-doc-bullets">' + highlights + '</ul>' : '',
      stack,
      '</article>'
    ].join('');
  }).join('');

  return '<section class="cv-doc-section"><h3>Experience</h3>' + cards + '</section>';
}

function renderEducationSection(education) {
  if (!education.length) {
    return '';
  }

  var entries = education.map(function (item) {
    var details = [item.degree, item.grade].filter(Boolean).join(' - ');
    return [
      '<article class="cv-doc-entry">',
      '<header>',
      '<h4>' + escapeHtml(item.institution || '') + '</h4>',
      details ? '<p class="cv-doc-company">' + escapeHtml(details) + '</p>' : '',
      '<p class="cv-doc-dates">' + formatDateRange(item.from, item.to, false) + '</p>',
      '</header>',
      '</article>'
    ].join('');
  }).join('');

  return '<section class="cv-doc-section"><h3>Education</h3>' + entries + '</section>';
}

function formatDateRange(from, to, current) {
  if (!from && !to && !current) {
    return '';
  }

  if (from && current) {
    return escapeHtml(from + ' - Present');
  }

  if (from || to) {
    return escapeHtml([from || '', to || ''].filter(Boolean).join(' - '));
  }

  return '';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}