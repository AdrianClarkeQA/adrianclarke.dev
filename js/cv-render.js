/* ─────────────────────────────────────────
   js/cv-render.js
   Shared helpers for the CV pages (cv.html and
   curriculum-vitae.html): loading /data/cv.json,
   rendering the readable CV, and printing with a
   tidy PDF file name.
   Exposes window.CvRender.
───────────────────────────────────────── */

(function () {
  var CV_PATH = '/data/cv.json';
  var PRINT_FILE_NAME = 'Adrian-Clarke-QA-CV';
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function loadCv() {
    return fetch(CV_PATH).then(function (res) {
      if (!res.ok) throw new Error('Could not load CV: ' + res.status);
      return res.json();
    });
  }

  /* "2020-11" → "Nov 2020"; "2020" or 2020 → "2020" */
  function formatMonth(value) {
    if (value === null || value === undefined || value === '') return '';
    var parts = String(value).split('-');
    var month = Number(parts[1]);
    return month >= 1 && month <= 12 ? MONTHS[month - 1] + ' ' + parts[0] : parts[0];
  }

  function formatPeriod(from, to, current) {
    var start = formatMonth(from);
    var end = current ? 'Present' : (formatMonth(to) || 'Present');
    return start ? start + ' — ' + end : end;
  }

  function safeUrl(value) {
    return /^https?:\/\//i.test(String(value || '')) ? String(value) : '';
  }

  function hostOf(url) {
    return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  }

  function externalLink(url, label) {
    return '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener">' + escapeHtml(label) + '</a>';
  }

  function renderBasics(data) {
    var basics = data.basics || {};
    var subtitle = [basics.label, basics.location].filter(Boolean).join(' · ');
    var links = [];

    if (safeUrl(basics.linkedin)) links.push(externalLink(basics.linkedin, 'LinkedIn ↗'));
    if (safeUrl(basics.github)) links.push(externalLink(basics.github, 'GitHub ↗'));
    if (safeUrl(basics.url)) links.push(externalLink(basics.url, hostOf(basics.url)));

    return [
      '<section class="cv-basics">',
      '<h2 class="cv-name">' + escapeHtml(basics.name || 'Adrian Clarke') + '</h2>',
      subtitle ? '<p class="cv-subtitle">' + escapeHtml(subtitle) + '</p>' : '',
      links.length ? '<p class="cv-links">' + links.join('') + '</p>' : '',
      data.summary ? '<p class="cv-summary">' + escapeHtml(data.summary) + '</p>' : '',
      '</section>'
    ].join('');
  }

  function renderExperience(experience) {
    if (!experience.length) return '';

    var rows = experience.map(function (job) {
      var highlights = asArray(job.highlights).map(function (point) {
        return '<li>' + escapeHtml(point) + '</li>';
      }).join('');
      var stack = asArray(job.stack).join(' · ');

      return [
        '<article class="cv-job">',
        '<p class="cv-period">' + escapeHtml(formatPeriod(job.from, job.to, job.current)) + '</p>',
        '<div class="cv-job-body">',
        '<h3 class="cv-role">' + escapeHtml(job.role || '') + '</h3>',
        job.company ? '<p class="cv-company">' + escapeHtml(job.company) + '</p>' : '',
        highlights ? '<ul class="cv-highlights">' + highlights + '</ul>' : '',
        stack ? '<p class="cv-stack">' + escapeHtml(stack) + '</p>' : '',
        '</div>',
        '</article>'
      ].join('');
    }).join('');

    return '<section class="cv-section"><h2 class="section-label">Experience</h2>' + rows + '</section>';
  }

  function renderSkills(skills) {
    if (!skills.length) return '';

    var items = skills.map(function (skill) {
      var tools = asArray(skill.tools).join(' · ');
      return [
        '<div class="cv-skill">',
        '<p class="cv-skill-name">' + escapeHtml(skill.name || '') + '</p>',
        tools ? '<p class="cv-skill-tools">' + escapeHtml(tools) + '</p>' : '',
        '</div>'
      ].join('');
    }).join('');

    return '<section class="cv-section"><h2 class="section-label">Skills</h2><div class="cv-skills">' + items + '</div></section>';
  }

  function renderEducation(education) {
    if (!education.length) return '';

    var items = education.map(function (item) {
      var years = [item.from, item.to].filter(function (y) { return y !== null && y !== undefined && y !== ''; }).join('–');
      var meta = [item.institution, years, item.grade].filter(Boolean).join(' · ');
      return [
        '<div class="cv-entry">',
        '<p class="cv-entry-title">' + escapeHtml(item.degree || item.institution || '') + '</p>',
        meta ? '<p class="cv-entry-meta">' + escapeHtml(meta) + '</p>' : '',
        '</div>'
      ].join('');
    }).join('');

    return '<section><h2 class="section-label">Education</h2><div class="cv-entries">' + items + '</div></section>';
  }

  function renderCertifications(certifications) {
    if (!certifications.length) return '';

    var items = certifications.map(function (item) {
      var meta = [item.issuer, item.year].filter(Boolean).join(', ');
      return [
        '<div class="cv-entry">',
        '<p class="cv-entry-title">' + escapeHtml(item.name || '') + '</p>',
        meta ? '<p class="cv-entry-meta">' + escapeHtml(meta) + '</p>' : '',
        '</div>'
      ].join('');
    }).join('');

    return '<section><h2 class="section-label">Certifications</h2><div class="cv-entries">' + items + '</div></section>';
  }

  function renderLanguages(languages) {
    if (!languages.length) return '';

    var items = languages.map(function (entry) {
      return [
        '<p class="cv-language">',
        '<strong>' + escapeHtml(entry.language || '') + '</strong>',
        entry.fluency ? ' <span class="cv-entry-meta">— ' + escapeHtml(entry.fluency) + '</span>' : '',
        '</p>'
      ].join('');
    }).join('');

    return '<section><h2 class="section-label">Languages</h2><div class="cv-entries">' + items + '</div></section>';
  }

  /* Full readable CV as an HTML string */
  function renderReadable(data) {
    var extras = [
      renderEducation(asArray(data.education)),
      renderCertifications(asArray(data.certifications)),
      renderLanguages(asArray(data.languages))
    ].join('');

    return [
      renderBasics(data),
      renderExperience(asArray(data.experience)),
      renderSkills(asArray(data.skills)),
      extras ? '<div class="cv-extras">' + extras + '</div>' : ''
    ].join('');
  }

  /* Give the saved PDF a sensible file name, however printing is triggered */
  var originalTitle = document.title;

  window.addEventListener('beforeprint', function () {
    originalTitle = document.title;
    document.title = PRINT_FILE_NAME;
  });

  window.addEventListener('afterprint', function () {
    document.title = originalTitle;
  });

  window.CvRender = {
    escapeHtml: escapeHtml,
    loadCv: loadCv,
    formatMonth: formatMonth,
    formatPeriod: formatPeriod,
    renderReadable: renderReadable
  };
})();
