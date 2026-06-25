/* THE COMCLAVE 1.2 — interactions */
(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');

  /* ---------- mobile menu ---------- */
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var icon = toggle.querySelector('i');
      if (icon) icon.className = nav.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        var icon = toggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  /* ---------- schedule day tabs ---------- */
  var tabs = document.querySelectorAll('.sched__tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var day = tab.getAttribute('data-day');
      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      document.querySelectorAll('.sched__panel').forEach(function (p) {
        p.classList.toggle('is-active', p.id === day);
      });
    });
  });

  /* ---------- scrollspy: highlight active nav link ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  var sections = links
    .map(function (l) {
      var id = l.getAttribute('href');
      return id && id.charAt(0) === '#' && id.length > 1 ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function onScroll() {
    var pos = window.scrollY + 120;
    var current = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec.id;
    });
    links.forEach(function (l) {
      l.classList.toggle('is-active', l.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ---------- countdown to COMCLAVE Indore: 25 July 2026, 9:00 AM IST ---------- */
(function () {
  'use strict';
  var target = new Date('2026-07-25T09:00:00+05:30').getTime();
  var d = document.getElementById('cd-days'),
      h = document.getElementById('cd-hours'),
      m = document.getElementById('cd-mins'),
      s = document.getElementById('cd-secs');
  if (!d || !h || !m || !s) return;
  function p(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    var diff = target - Date.now();
    if (diff < 0) diff = 0;
    d.textContent = p(Math.floor(diff / 864e5));
    h.textContent = p(Math.floor(diff / 36e5 % 24));
    m.textContent = p(Math.floor(diff / 6e4 % 60));
    s.textContent = p(Math.floor(diff / 1e3 % 60));
  }
  tick();
  setInterval(tick, 1000);
})();


/* ============================================================
   GSAP — entrance + scroll-reveal animations + parallax.
   Uses gsap.from so all content stays visible if GSAP fails to
   load, and bails out under prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  // hero entrance on load
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero__presents, .hero__title, .hero__sub, .hero__cta, .hero__passes',
      { y: 26, opacity: 0, duration: .7, stagger: .1 })
    .from('.hero__art', { y: 24, opacity: 0, scale: .96, duration: .9 }, '-=.55')
    .from('.hero__timer, .hero__eventmeta', { y: 20, opacity: 0, duration: .6, stagger: .12 }, '-=.4');

  // section headings reveal
  gsap.utils.toArray('.sec-head').forEach(function (el) {
    gsap.from(el.children, {
      scrollTrigger: { trigger: el, start: 'top 86%' },
      y: 28, opacity: 0, duration: .7, stagger: .08, ease: 'power2.out'
    });
  });

  // staggered card grids
  ['.spk-grid', '.learn-grid', '.worth-grid', '.who-grid', '.hl__grid', '.fit__list'].forEach(function (sel) {
    var grid = document.querySelector(sel);
    if (!grid) return;
    gsap.from(grid.children, {
      scrollTrigger: { trigger: grid, start: 'top 84%' },
      y: 30, opacity: 0, duration: .55, stagger: .07, ease: 'power2.out'
    });
  });

  // single content blocks
  ['.why__content', '.why__art', '.fit__card', '.fit__art', '.init__content', '.init__art',
   '.reg-ticket-wrap', '.who', '.cta-band__inner', '.partners__row'].forEach(function (sel) {
    var el = document.querySelector(sel);
    if (!el) return;
    gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 86%' }, y: 30, opacity: 0, duration: .7, ease: 'power2.out' });
  });

  // schedule rows slide in
  var rows = document.querySelectorAll('.sched__row');
  if (rows.length) {
    gsap.from(rows, { scrollTrigger: { trigger: '.sched__list', start: 'top 82%' }, x: -18, opacity: 0, duration: .4, stagger: .04, ease: 'power1.out' });
  }

  // countdown tiles pop in
  gsap.from('.countdown__unit', {
    scrollTrigger: { trigger: '.hero__timer', start: 'top 92%' },
    scale: .8, opacity: 0, duration: .5, stagger: .08, ease: 'back.out(1.6)'
  });

  // subtle parallax on the candlestick chart
  gsap.to('.hero__chart', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
})();
