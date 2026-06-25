// =================== preloader js  ================== //
document.addEventListener('DOMContentLoaded', function () {
    var preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.transition = 'opacity 0.5s ease';
        setTimeout(function () {
            preloader.style.opacity = '0';
            setTimeout(function () {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});
// =================== preloader js end ================== //


// =================== dark-only theme ================== //
// COMCLAVE build: the site ships in dark mode only. The original template's
// light/dark switch + image-path swapping has been removed so there is no
// dependency on a #btnSwitch element (its absence used to throw a TypeError
// and break all downstream JS: sliders, counters, mobile menu).
document.documentElement.setAttribute('data-bs-theme', 'dark');
// =================== dark-only theme end ================== //




// =================== header js start here ===================

// Add class 'menu-item-has-children' to parent li elements of '.submenu'
var submenuList = document.querySelectorAll("ul>li>.submenu");
submenuList.forEach(function (submenu) {
    var parentLi = submenu.parentElement;
    if (parentLi) {
        parentLi.classList.add("menu-item-has-children");
    }
});

// Fix dropdown menu overflow problem
var menuList = document.querySelectorAll("ul");
menuList.forEach(function (menu) {
    var parentLi = menu.parentElement;
    if (parentLi) {
        parentLi.addEventListener("mouseover", function () {
            var menuPos = menu.getBoundingClientRect();
            if (menuPos.left + menu.offsetWidth > window.innerWidth) {
                menu.style.left = -menu.offsetWidth + "px";
            }
        });
    }
});



// Toggle submenu on click (mobile)
var menuLinks = document.querySelectorAll(".menu li a");
menuLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
        e.stopPropagation();
        var element = link.parentElement;
        if (parseInt(window.innerWidth, 10) < 1200) {
            var sub = element.querySelector("ul");
            if (sub) {
                if (element.classList.contains("open")) {
                    element.classList.remove("open");
                    sub.style.display = "none";
                } else {
                    element.classList.add("open");
                    sub.style.display = "block";
                }
            }
        }
    });
});

// Close the mobile menu after tapping an in-page anchor link
var anchorLinks = document.querySelectorAll('.menu li a[href^="#"]');
anchorLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        if (parseInt(window.innerWidth, 10) < 1200) {
            var hb = document.querySelector(".header-bar");
            var menu = document.querySelector(".menu");
            if (hb) hb.classList.remove("active");
            if (menu) menu.classList.remove("active");
        }
    });
});


// Toggle header bar (hamburger) on click
var headerBar = document.querySelector(".header-bar");
if (headerBar) {
    headerBar.addEventListener("click", function () {
        headerBar.classList.toggle("active");
        var menu = document.querySelector(".menu");
        if (menu) {
            menu.classList.toggle("active");
        }
    });
}


// Header sticky on scroll
var fixedTop = document.querySelector("header");
window.addEventListener("scroll", function () {
    if (!fixedTop) return;
    if (window.scrollY > 300) {
        fixedTop.classList.add("header-fixed", "fadeInUp");
    } else {
        fixedTop.classList.remove("header-fixed", "fadeInUp");
    }
});

// =================== header js end here =================== //




// Animation on Scroll initializing
AOS.init();




// =================== custom trk slider js here =================== //

// partner / sponsor logo marquee
const Partner = new Swiper('.partner__slider', {
    spaceBetween: 24,
    grabCursor: true,
    loop: true,
    slidesPerView: 2,
    breakpoints: {
        576: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        992: { slidesPerView: 4, spaceBetween: 15 },
        1200: { slidesPerView: 4, spaceBetween: 25 },
    },
    autoplay: {
        delay: 1,
        disableOnInteraction: true,
    },
    speed: 2000,
});

// social-proof slider
const testimonial = new Swiper('.testimonial__slider', {
    spaceBetween: 24,
    grabCursor: true,
    loop: true,
    slidesPerView: 1,
    breakpoints: {
        576: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 2 },
        1200: { slidesPerView: 2, spaceBetween: 25 },
    },
    autoplay: true,
    speed: 500,
    navigation: {
        nextEl: ".testimonial__slider-next",
        prevEl: ".testimonial__slider-prev",
    },
});

// =================== custom trk slider end here =================== //




// =================== scroll-to-top js start here =================== //
window.addEventListener('scroll', function () {
    var stt = document.querySelector('.scrollToTop');
    if (stt) {
        if (window.pageYOffset > 300) {
            stt.style.bottom = '7%';
            stt.style.opacity = '1';
            stt.style.transition = 'all .5s ease';
        } else {
            stt.style.bottom = '-30%';
            stt.style.opacity = '0';
            stt.style.transition = 'all .5s ease';
        }
    }
});

var scrollToTop = document.querySelector('.scrollToTop');
if (scrollToTop) {
    scrollToTop.addEventListener('click', function (e) {
        e.preventDefault();
        var scrollDuration = 100;
        var scrollStep = -window.scrollY / (scrollDuration / 15);
        var scrollInterval = setInterval(function () {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 15);
    });
}
// =================== scroll-to-top js end here =================== //



// =================== counters =================== //
new PureCounter();
// =================== counters end =================== //




// =================== hero countdown =================== //
// Counts down to COMCLAVE Indore: Sat 25 July 2026, 9:00 AM IST (+05:30).
// The target is an absolute instant, so it stays correct in any viewer timezone.
(function () {
    var target = new Date('2026-07-25T09:00:00+05:30').getTime();
    var elDays = document.getElementById('cd-days');
    var elHours = document.getElementById('cd-hours');
    var elMins = document.getElementById('cd-mins');
    var elSecs = document.getElementById('cd-secs');
    if (!elDays || !elHours || !elMins || !elSecs) return;

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    var timer = null;
    function tick() {
        var diff = target - Date.now();
        if (diff <= 0) {
            elDays.textContent = '00';
            elHours.textContent = '00';
            elMins.textContent = '00';
            elSecs.textContent = '00';
            var wrap = document.querySelector('.cc-countdown');
            if (wrap) wrap.classList.add('cc-countdown--ended');
            var live = document.querySelector('.cc-countdown__live');
            if (live) live.textContent = 'Happening now';
            if (timer) clearInterval(timer);
            return;
        }
        elDays.textContent = pad(Math.floor(diff / 86400000));
        elHours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
        elMins.textContent = pad(Math.floor((diff % 3600000) / 60000));
        elSecs.textContent = pad(Math.floor((diff % 60000) / 1000));
    }

    tick();
    timer = setInterval(tick, 1000);
})();
// =================== hero countdown end =================== //
