/* =========================================================================
   COMCLAVE Indore — "Equiduct" template · main.js
   Progressive enhancement: nav, smooth-close, countdown, scroll-reveal
   (GSAP enhancement + IntersectionObserver fallback), tilt, form.
   ========================================================================= */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;

  /* ---------------- Nav: scroll state ---------------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Nav: mobile toggle ---------------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  function closeMenu() {
    if (!links || !toggle) return;
    links.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    // close when a link is tapped
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    // close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------------- Countdown to event ---------------- */
  // Saturday, 25 July 2026, 9:00 AM IST
  var target = new Date('2026-07-25T09:00:00+05:30').getTime();
  var cdEls = {
    days: document.querySelector('[data-cd="days"]'),
    hours: document.querySelector('[data-cd="hours"]'),
    minutes: document.querySelector('[data-cd="minutes"]'),
    seconds: document.querySelector('[data-cd="seconds"]')
  };
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    var diff = target - Date.now();
    if (diff < 0) diff = 0;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    if (cdEls.days) cdEls.days.textContent = pad(d);
    if (cdEls.hours) cdEls.hours.textContent = pad(h);
    if (cdEls.minutes) cdEls.minutes.textContent = pad(m);
    if (cdEls.seconds) cdEls.seconds.textContent = pad(s);
  }
  if (cdEls.days) { tick(); setInterval(tick, 1000); }

  /* ---------------- Smooth anchor scroll (with header offset) ---------------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    var top = el.getBoundingClientRect().top + window.scrollY - 74;
    window.scrollTo({ top: top, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function showAll() {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }
  if (prefersReduced || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    // anything already in view on load
    requestAnimationFrame(function () {
      revealEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-visible');
      });
    });
  }
  // We took over reveal — cancel the inline failsafe so scroll-reveal stays intact.
  if (window.__revealFailsafe) clearTimeout(window.__revealFailsafe);

  /* ---------------- GSAP enhancement (optional) ---------------- */
  if (window.gsap && !prefersReduced) {
    try {
      // subtle hero background drift on scroll
      if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        gsap.to('.hero__bg', {
          yPercent: 14, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        });
      }
      // hero entrance
      gsap.from('.hero__copy > *', { y: 26, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out', delay: .1 });
    } catch (err) { /* enhancement only — ignore */ }
  }

  /* ---------------- Tilt (3D hover) ---------------- */
  if (!isTouch && !prefersReduced) {
    var tiltEls = document.querySelectorAll('[data-tilt]');
    var MAX = 7; // degrees
    tiltEls.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rx = (py - 0.5) * -2 * MAX;
        var ry = (px - 0.5) * 2 * MAX;
        el.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ---------------- Register form ---------------- */
  var form = document.getElementById('registerForm');
  var msg = document.getElementById('registerMsg');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!msg) return;
      msg.className = 'register__formnote';
      if (!form.checkValidity()) {
        msg.textContent = 'Please fill in your name, a valid email, phone and tick the box.';
        msg.classList.add('is-err');
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      var name = (form.querySelector('#rf-name') || {}).value || 'there';
      var first = String(name).trim().split(' ')[0];
      msg.textContent = '🎉 Thanks, ' + first + '! Your free seat request is in. We’ll email your COMCLAVE Indore confirmation shortly.';
      msg.classList.add('is-ok');
      form.reset();
    });
  }

})();
