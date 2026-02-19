document.addEventListener('DOMContentLoaded', function () {
  var track = document.querySelector('.carousel-track');
  if (!track) return;

  var images = track.querySelectorAll('img');
  var loaded = 0;

  function onAllLoaded() {
    var items = track.querySelectorAll('.carousel-item');
    var half = items.length / 2;
    var width = 0;
    for (var i = 0; i < half; i++) width += items[i].offsetWidth;
    width += 40 * (half - 1);
    var duration = width / 20;
    document.documentElement.style.setProperty('--carousel-duration', duration + 's');
  }

  images.forEach(function (img) {
    if (img.complete) { loaded++; }
    else { img.addEventListener('load', function () { if (++loaded === images.length) onAllLoaded(); }); }
  });

  if (loaded === images.length) onAllLoaded();
});
