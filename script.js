(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- sEMG-style trace under the hero ----------------------------------
  // Quiet baseline with a few muscle-activation bursts. Seeded so it looks
  // the same on every visit.
  var trace = document.querySelector('.signal-trace');
  if (trace) {
    var seed = 7;
    var rand = function () {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    var bursts = [
      { at: 130, width: 38, amp: 0.55 },
      { at: 330, width: 60, amp: 0.95 },
      { at: 520, width: 30, amp: 0.4 },
      { at: 720, width: 70, amp: 1.0 },
      { at: 930, width: 45, amp: 0.7 },
      { at: 1100, width: 28, amp: 0.45 }
    ];
    var d = 'M0 45';
    for (var x = 2; x <= 1200; x += 2) {
      var envelope = 0.05;
      for (var i = 0; i < bursts.length; i++) {
        var b = bursts[i];
        var z = (x - b.at) / b.width;
        envelope += b.amp * Math.exp(-z * z);
      }
      var y = 45 + (rand() * 2 - 1) * envelope * 42;
      d += ' L' + x + ' ' + y.toFixed(1);
    }
    trace.setAttribute('d', d);
    if (!reduceMotion) {
      requestAnimationFrame(function () { trace.classList.add('drawn'); });
    }
  }

  // ---- Talk videos: thumbnail -> embedded YouTube player ---------------
  document.querySelectorAll('.video-facade[data-video]').forEach(function (card) {
    card.addEventListener('click', function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();

      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + card.dataset.video + '?autoplay=1&rel=0';
      frame.title = card.dataset.title;
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allowFullscreen = true;

      var wrapper = document.createElement('div');
      wrapper.className = 'video-frame';
      wrapper.appendChild(frame);
      card.replaceWith(wrapper);
    });
  });

  // ---- Paper summaries: show two lines, expand on demand ---------------
  document.querySelectorAll('.pub-desc.clamp').forEach(function (desc) {
    desc.classList.add('clamped');
    if (desc.scrollHeight <= desc.clientHeight + 2) {
      desc.classList.remove('clamped');
      return;
    }
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'more';
    button.textContent = 'Read more';
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', function () {
      var expanded = desc.classList.toggle('clamped') === false;
      button.textContent = expanded ? 'Show less' : 'Read more';
      button.setAttribute('aria-expanded', String(expanded));
    });
    desc.insertAdjacentElement('afterend', button);
  });

  // ---- Fade sections in as they scroll into view -----------------------
  var revealables = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  // ---- Light / dark toggle ---------------------------------------------
  // Follows the system setting until the visitor picks one; the choice is
  // remembered on this device.
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  var currentTheme = function () {
    return root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
  };
  var updateToggleLabel = function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' mode');
  };
  if (toggle) {
    updateToggleLabel();
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
      updateToggleLabel();
    });
    if (systemDark.addEventListener) systemDark.addEventListener('change', updateToggleLabel);
  }

  // ---- Accent colour picker -------------------------------------------
  var accentToggle = document.querySelector('.accent-toggle');
  var accentMenu = document.getElementById('accent-menu');
  if (accentToggle && accentMenu) {
    var swatches = accentMenu.querySelectorAll('.swatch');
    var markSelected = function () {
      var current = root.getAttribute('data-accent') || 'sienna';
      swatches.forEach(function (sw) {
        sw.setAttribute('aria-checked', String(sw.dataset.accent === current));
      });
    };
    var setMenu = function (open) {
      accentMenu.hidden = !open;
      accentToggle.setAttribute('aria-expanded', String(open));
    };
    markSelected();

    accentToggle.addEventListener('click', function (event) {
      event.stopPropagation();
      setMenu(accentMenu.hidden);
    });
    swatches.forEach(function (sw) {
      sw.addEventListener('click', function () {
        var accent = sw.dataset.accent;
        if (accent === 'sienna') root.removeAttribute('data-accent');
        else root.setAttribute('data-accent', accent);
        try { localStorage.setItem('accent', accent); } catch (e) { /* storage unavailable */ }
        markSelected();
      });
    });
    document.addEventListener('click', function (event) {
      if (!accentMenu.hidden && !accentMenu.contains(event.target)) setMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !accentMenu.hidden) {
        setMenu(false);
        accentToggle.focus();
      }
    });
  }

  // ---- Top bar border + current-section highlight ----------------------
  var topbar = document.querySelector('.topbar');
  var onScroll = function () { topbar.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var navLinks = document.querySelectorAll('.nav-links a');
  if ('IntersectionObserver' in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('active'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { navObserver.observe(s); });
  }
})();
