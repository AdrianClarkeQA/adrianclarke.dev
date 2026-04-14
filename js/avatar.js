(function () {
  var avatars = [
    // '/assets/images/avatar-caricature.jpg',
    // '/assets/images/avatar-polygon.jpg',
    '/assets/images/avatar-hoodie.jpg',
    '/assets/images/avatar-suit.jpg',
    '/assets/images/avatar-brick.jpg'
  ];
  var img = document.getElementById('avatar-img');
  if (img) {
    img.src = avatars[Math.floor(Math.random() * avatars.length)];
  }
})();
