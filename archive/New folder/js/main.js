/* =========================================================================
   COMCLAVE — The Commodity Masterclass · MCQube
   Shared front-end behaviour. Vanilla JS, defensive, no dependencies.
   ========================================================================= */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  /* ----------------------------------------------------------------------
     1. STICKY NAV — scroll state + mobile toggle
     ---------------------------------------------------------------------- */
  function initNav() {
    var nav = document.getElementById("site-nav");
    var menu = document.getElementById("nav-menu");
    var toggle = document.querySelector("[data-nav-toggle]");

    if (nav) {
      var onScroll = function () {
        if (window.pageYOffset > 40) {
          nav.classList.add("is-scrolled");
        } else {
          nav.classList.remove("is-scrolled");
        }
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (toggle && menu) {
      var closeMenu = function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      };
      var openMenu = function () {
        menu.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
      };

      toggle.addEventListener("click", function () {
        if (menu.classList.contains("is-open")) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      // Clicking any menu link closes the mobile menu
      var links = menu.querySelectorAll("a");
      for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", closeMenu);
      }

      // Close on Escape
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && menu.classList.contains("is-open")) {
          closeMenu();
          if (typeof toggle.focus === "function") { toggle.focus(); }
        }
      });
    }
  }

  /* ----------------------------------------------------------------------
     2. COUNTDOWN
     ---------------------------------------------------------------------- */
  function initCountdown() {
    var roots = document.querySelectorAll("[data-countdown]");
    if (!roots.length) { return; }

    function pad(n) { return (n < 10 ? "0" : "") + n; }

    Array.prototype.forEach.call(roots, function (root) {
      var deadlineStr = root.getAttribute("data-deadline");
      var deadline = deadlineStr ? new Date(deadlineStr).getTime() : NaN;

      var fields = {
        days: root.querySelector('[data-unit="days"]'),
        hours: root.querySelector('[data-unit="hours"]'),
        minutes: root.querySelector('[data-unit="minutes"]'),
        seconds: root.querySelector('[data-unit="seconds"]')
      };

      function setZeros() {
        if (fields.days) fields.days.textContent = "00";
        if (fields.hours) fields.hours.textContent = "00";
        if (fields.minutes) fields.minutes.textContent = "00";
        if (fields.seconds) fields.seconds.textContent = "00";
      }

      if (isNaN(deadline)) { setZeros(); return; }

      function tick() {
        var diff = deadline - Date.now();
        if (diff <= 0) {
          setZeros();
          if (timer) { clearInterval(timer); }
          return;
        }
        var s = Math.floor(diff / 1000);
        var days = Math.floor(s / 86400);
        var hours = Math.floor((s % 86400) / 3600);
        var minutes = Math.floor((s % 3600) / 60);
        var seconds = s % 60;

        if (fields.days) fields.days.textContent = pad(days);
        if (fields.hours) fields.hours.textContent = pad(hours);
        if (fields.minutes) fields.minutes.textContent = pad(minutes);
        if (fields.seconds) fields.seconds.textContent = pad(seconds);
      }

      tick();
      var timer = setInterval(tick, 1000);
    });
  }

  /* ----------------------------------------------------------------------
     3. CAROUSEL (generic, one slide at a time, wrap-around)
     ---------------------------------------------------------------------- */
  function initCarousels() {
    var carousels = document.querySelectorAll("[data-carousel]");
    if (!carousels.length) { return; }

    Array.prototype.forEach.call(carousels, function (carousel) {
      var slides = carousel.querySelectorAll("[data-carousel-slide]");
      if (!slides.length) { return; }

      var prevBtn = carousel.querySelector("[data-carousel-prev]");
      var nextBtn = carousel.querySelector("[data-carousel-next]");

      var index = 0;
      for (var i = 0; i < slides.length; i++) {
        if (slides[i].classList.contains("is-active")) { index = i; break; }
      }

      function show(next) {
        var total = slides.length;
        index = (next % total + total) % total;
        for (var j = 0; j < total; j++) {
          if (j === index) {
            slides[j].classList.add("is-active");
            slides[j].removeAttribute("aria-hidden");
          } else {
            slides[j].classList.remove("is-active");
            slides[j].setAttribute("aria-hidden", "true");
          }
        }
      }

      show(index);

      if (prevBtn) {
        prevBtn.addEventListener("click", function () { show(index - 1); });
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", function () { show(index + 1); });
      }
    });
  }

  /* ----------------------------------------------------------------------
     4. SCROLL REVEAL
     ---------------------------------------------------------------------- */
  function prefersReducedMotion() {
    return !!(window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function showAll(items) {
    Array.prototype.forEach.call(items, function (el) {
      el.classList.add("is-visible");
    });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) { return; }

    // We are taking over reveal -> cancel the inline no-JS failsafe timer.
    if (window.__cmcRevealFallback) { window.clearTimeout(window.__cmcRevealFallback); }

    // Reduced motion -> just show everything, no animation.
    if (prefersReducedMotion()) { showAll(items); return; }

    var hasGSAP = !!(window.gsap && window.ScrollTrigger);
    if (!hasGSAP) { initFallbackReveal(items); return; }

    try {
      initGsapAnimations(items);
    } catch (e) {
      // Never leave content hidden if GSAP setup throws.
      showAll(items);
    }
  }

  /* IntersectionObserver fallback (no GSAP / CDN blocked) */
  function initFallbackReveal(items) {
    if (!("IntersectionObserver" in window)) { showAll(items); return; }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    Array.prototype.forEach.call(items, function (el) { observer.observe(el); });

    // Safety net: never leave content permanently hidden.
    window.setTimeout(function () { showAll(items); }, 1600);
  }

  /* Rich scroll animations via GSAP + ScrollTrigger */
  function initGsapAnimations(items) {
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    // GSAP owns the reveal animation; the CSS hook disables the .reveal
    // transition so the two don't fight each other.
    document.documentElement.classList.add("gsap-on");

    var all = gsap.utils.toArray(items);
    gsap.set(all, { opacity: 0, y: 30 });

    // --- Hero: a strong staggered entrance on load ---
    var heroEls = gsap.utils.toArray("#hero .reveal");
    if (heroEls.length) {
      gsap.to(heroEls, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        stagger: 0.12, delay: 0.15
      });
    }

    // Gentle continuous float on the hero photo frame
    var heroFrame = document.querySelector("#hero .hero__photo-frame");
    if (heroFrame) {
      gsap.to(heroFrame, { y: -12, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }

    // --- Everything else: reveal on scroll, batched & staggered ---
    var rest = all.filter(function (el) { return !el.closest("#hero"); });
    ScrollTrigger.batch(rest, {
      start: "top 86%",
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          stagger: 0.1, overwrite: true
        });
      }
    });

    // --- Count-up on stat numbers ---
    countUp(gsap, ScrollTrigger, ".hero__stat-num");
    countUp(gsap, ScrollTrigger, ".gallery__stat-num");

    // --- Gallery image parallax ---
    var gimg = document.querySelector(".gallery__img");
    if (gimg) {
      gsap.set(gimg, { scale: 1.18 });
      gsap.fromTo(gimg, { yPercent: -9 }, {
        yPercent: 9, ease: "none",
        scrollTrigger: { trigger: "#gallery", start: "top bottom", end: "bottom top", scrub: true }
      });
    }

    // Recalculate trigger positions once images/fonts settle.
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    window.setTimeout(function () { ScrollTrigger.refresh(); }, 700);
  }

  /* Animate a numeric stat from 0 -> its value when scrolled into view */
  function countUp(gsap, ScrollTrigger, selector) {
    var nums = document.querySelectorAll(selector);
    Array.prototype.forEach.call(nums, function (el) {
      var raw = el.textContent.trim();
      var m = raw.match(/^(\D*?)(\d[\d,]*)(.*)$/);
      if (!m) { return; }
      var prefix = m[1], suffix = m[3];
      var target = parseInt(m[2].replace(/,/g, ""), 10);
      if (isNaN(target)) { return; }
      var counter = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 92%", once: true,
        onEnter: function () {
          gsap.to(counter, {
            v: target, duration: 1.5, ease: "power2.out",
            onUpdate: function () {
              el.textContent = prefix + Math.round(counter.v).toLocaleString() + suffix;
            },
            onComplete: function () { el.textContent = raw; }
          });
        }
      });
    });
  }

  /* ----------------------------------------------------------------------
     Boot
     ---------------------------------------------------------------------- */
  ready(function () {
    try { initNav(); } catch (e) {}
    try { initCountdown(); } catch (e) {}
    try { initCarousels(); } catch (e) {}
    try { initReveal(); } catch (e) {}
  });
})();