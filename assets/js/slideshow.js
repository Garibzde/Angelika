(function () {
  const INTERVAL = 5000;
  const ZOOM_DUR = 6000;
  const FADE_DUR = 800;

  document.querySelectorAll('.slideshow').forEach(function (el) {
    const rawSlides  = el.getAttribute('data-slides');
    const hideTarget = el.getAttribute('data-hide');
    if (!rawSlides) return;

    let slides;    
    try { slides = JSON.parse(rawSlides); } catch (e) { return; }
    if (!slides.length) return;

    if (hideTarget) {
      document.querySelectorAll(hideTarget).forEach(function (t) {
        t.style.opacity    = '0';
        t.style.transition = 'opacity ' + FADE_DUR + 'ms';
      });
    }

    el.style.cssText += 'position:absolute;inset:0;overflow:hidden;';

    function pickSrc(slide) {
      const w = window.innerWidth;
      if (w <= 767  && slide.img_m) return slide.img_m;
      if (w <= 1099 && slide.img_t) return slide.img_t;
      if (w <= 1450 && slide.img_n) return slide.img_n;
      return slide.img || slide.img_h || slide.img_n || slide.img_t || slide.img_m || '';
    }

    let layers = [];
    for (let i = 0; i < 2; i++) {
      const div = document.createElement('div');
      div.style.cssText = [
        'position:absolute', 'inset:0',
        'background-size:cover',
        'background-position:center bottom',
        'background-repeat:no-repeat',
        'will-change:transform,opacity',
        'opacity:0',
      ].join(';');
      el.appendChild(div);
      layers.push(div);
    }

    let active  = 0;
    let current = 0;
    let started = false;

    function preload(src, cb) {
      const img = new Image();
      img.onload = img.onerror = function () { cb(src); };
      img.src = src;
    }

    function showSlide(index) {
      const slide = slides[index];
      const src   = pickSrc(slide);
      const next  = active === 0 ? 1 : 0;

      preload(src, function (s) {
        layers[next].style.backgroundImage = 'url(' + s + ')';
        layers[next].style.transform       = 'scale(1)';
        layers[next].style.transition      = 'opacity ' + FADE_DUR + 'ms ease';
        layers[next].style.opacity         = '0';

        void layers[next].offsetWidth;

        layers[next].style.opacity = '1';
        if (started) layers[active].style.opacity = '0';

        setTimeout(function () {
          layers[next].style.transition =
            'opacity ' + FADE_DUR + 'ms ease, transform ' + ZOOM_DUR + 'ms ease-out';
          layers[next].style.transform = 'scale(1.07)';
        }, 50);

        active  = next;
        started = true;
      });
    }

    showSlide(0);

    setInterval(function () {
      current = (current + 1) % slides.length;
      showSlide(current);
    }, INTERVAL);
  });
})();
