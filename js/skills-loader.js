/**
 * skills-loader.js
 * Renders homepage skills cards from /data/cv.json.
 */
(function () {
  var grid = document.getElementById('skills-grid');

  if (!grid) {
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

      if (!skills.length) {
        grid.innerHTML = '<p class="skills-empty">No skills available right now.</p>';
        return;
      }

      grid.innerHTML = skills
        .map(function (skill) {
          var name = escapeHtml(skill.name || 'Skill');
          var tools = Array.isArray(skill.tools) && skill.tools.length
            ? escapeHtml(skill.tools.join(' · '))
            : 'General';

          return [
            '<div class="skill">',
            '<div class="skill-name">' + name + '</div>',
            '<div class="skill-detail">' + tools + '</div>',
            '</div>'
          ].join('');
        })
        .join('');
    })
    .catch(function () {
      grid.innerHTML = '<p class="skills-error">Could not load skills data.</p>';
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
