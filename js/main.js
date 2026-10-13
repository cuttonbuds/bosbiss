(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- theme toggle ---------- */

  var toggle = document.getElementById('themeToggle');
  var label = toggle ? toggle.querySelector('.theme-toggle-label') : null;
  var media = window.matchMedia('(prefers-color-scheme: light)');

  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set === 'light' || set === 'dark') return set;
    return media.matches ? 'light' : 'dark';
  }

  function paintLabel() {
    if (label) label.textContent = currentTheme();
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', currentTheme() === 'light' ? '#F7F7F8' : '#0B0D10');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('bb-theme', next); } catch (e) {}
      paintLabel();
    });
  }

  media.addEventListener('change', paintLabel);
  paintLabel();

  /* ---------- stem dot follows scroll progress ---------- */

  var dot = document.getElementById('stemDot');
  var ticking = false;

  function placeDot() {
    ticking = false;
    if (!dot) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? window.scrollY / max : 0;
    // keep the dot inside the viewport, with a little margin top and bottom
    var pad = 24;
    var y = pad + p * (window.innerHeight - pad * 2);
    dot.style.top = y + 'px';
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(placeDot);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  placeDot();

  /* ---------- reveal on scroll ---------- */

  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    reveals.forEach(function (el, i) {
      // tiny stagger for siblings that come into view together
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- active nav link ---------- */

  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = [];

  links.forEach(function (a) {
    var el = document.querySelector(a.getAttribute('href'));
    if (el) sections.push({ link: a, el: el });
  });

  if (sections.length && 'IntersectionObserver' in window) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.forEach(function (s) {
          s.link.classList.toggle('active', s.el === entry.target);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (s) { navIo.observe(s.el); });
  }
})();
