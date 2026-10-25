/**
 * skills-loader.js
 * Renders the homepage skills index from /data/cv.json.
 */
(function () {
  var list = document.getElementById('skills-grid');
  var count = document.getElementById('skills-count');

  if (!list) {
    return;
  }

  fetch('/data/cv.json')
    .then(function (res) {
      if (!res.ok) {
        throw new Error('Could not load skills: ' + res.status);
      }
      return res.json();
    })
    .then(function (data) {
      var skills = Array.isArray(data.skills) ? data.skills : [];

      if (count) {
        count.textContent = skills.length + (skills.length === 1 ? ' discipline' : ' disciplines');
      }

      if (!skills.length) {
        list.innerHTML = '<li class="skills-empty">No skills available right now.</li>';
        return;
      }

      list.innerHTML = skills
        .map(function (skill, index) {
          var name = escapeHtml(skill.name || 'Skill');
          var tools = Array.isArray(skill.tools) && skill.tools.length
            ? escapeHtml(skill.tools.join(' · '))
            : 'General';

          return [
            '<li class="skill-row">',
            '<span class="skill-index" aria-hidden="true">' + String(index + 1).padStart(2, '0') + '</span>',
            '<span class="skill-name">' + name + '</span>',
            '<span class="skill-tools">' + tools + '</span>',
            '</li>'
          ].join('');
        })
        .join('');
    })
    .catch(function () {
      list.innerHTML = '<li class="skills-error">Could not load skills data.</li>';
    });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
