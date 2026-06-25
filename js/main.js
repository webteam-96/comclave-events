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
