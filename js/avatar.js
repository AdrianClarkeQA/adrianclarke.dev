(function () {
  var avatars = [
    '/images/avatar-caricature.jpg',
    '/images/avatar-8bit.jpg',
    '/images/avatar-polygon.jpg',
    '/images/avatar-brick.jpg'
  ];
  var img = document.getElementById('avatar-img');
  if (img) {
    img.src = avatars[Math.floor(Math.random() * avatars.length)];
  }
})();
