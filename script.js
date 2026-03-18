(function () {
  'use strict';

  // Language toggle
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var isEnglish = window.location.pathname.indexOf('hindi.html') === -1;
      if (isEnglish) {
        window.location.href = 'hindi.html';
      } else {
        window.location.href = 'index.html';
      }
    });
  }

  var scene = document.getElementById('cardScene');
  var openBtn = document.getElementById('openInvitation');
  var frontFace = document.querySelector('.card-face-front');
  var audio = document.getElementById('bgMusic');

  function openInvitation() {
    if (scene && !scene.classList.contains('opened')) {
      scene.classList.add('opened');
      if (audio) audio.play().catch(function () {});
      // Ensure top sections (couple images + invitation) show on mobile when card opens
      var coupleSection = document.querySelector('.couple-images-section');
      var inviteSection = document.querySelector('.invitation-section');
      function markVisible() {
        if (coupleSection) coupleSection.classList.add('in-view');
        if (inviteSection) inviteSection.classList.add('in-view');
      }
      requestAnimationFrame(function () { requestAnimationFrame(markVisible); });
    }
  }

  if (openBtn) openBtn.addEventListener('click', function (e) { e.stopPropagation(); openInvitation(); });
  if (frontFace) frontFace.addEventListener('click', openInvitation);

  // Countdown to 20 April 2026
  var weddingDate = new Date('2026-04-20T00:00:00');
  var els = {
    days: document.getElementById('cdDays'),
    hours: document.getElementById('cdHours'),
    mins: document.getElementById('cdMins'),
    secs: document.getElementById('cdSecs')
  };

  function pad(n) { return n < 10 ? '0' + n : n; }
  function updateCountdown() {
    var now = new Date();
    if (now >= weddingDate) {
      if (els.days) els.days.textContent = '00';
      if (els.hours) els.hours.textContent = '00';
      if (els.mins) els.mins.textContent = '00';
      if (els.secs) els.secs.textContent = '00';
      return;
    }
    var d = weddingDate - now;
    var days = Math.floor(d / 86400000);
    var hours = Math.floor((d % 86400000) / 3600000);
    var mins = Math.floor((d % 3600000) / 60000);
    var secs = Math.floor((d % 60000) / 1000);
    if (els.days) els.days.textContent = pad(days);
    if (els.hours) els.hours.textContent = pad(hours);
    if (els.mins) els.mins.textContent = pad(mins);
    if (els.secs) els.secs.textContent = pad(secs);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      var target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ── RSVP → Google Sheet ──
  // PASTE YOUR DEPLOYED GOOGLE APPS SCRIPT URL BELOW
  var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyvJUd7TIT28PYeWqX7s-oeDFPhIJYzp3TVb_MaHmPDghwIm9JXtJMm_U2CBfIU7Jwycw/exec';

  var form = document.querySelector('.rsvp-form');
  if (form) {
    var savedRsvp = localStorage.getItem('rsvp_submitted');
    if (savedRsvp) {
      try {
        var data = JSON.parse(savedRsvp);
        var btn = form.querySelector('.btn-submit');
        if (btn) { btn.textContent = 'RSVP Sent ✓'; btn.disabled = true; btn.style.opacity = '0.7'; }
        var nameInput = form.querySelector('input[name="name"]');
        var attendSelect = form.querySelector('select[name="attendance"]');
        var msgTextarea = form.querySelector('textarea[name="message"]');
        if (nameInput) { nameInput.value = data.name || ''; nameInput.readOnly = true; }
        if (attendSelect) { attendSelect.value = data.attendance || ''; attendSelect.disabled = true; }
        if (msgTextarea) { msgTextarea.value = data.message || ''; msgTextarea.readOnly = true; }
        var resetBtn = document.getElementById('rsvpReset');
        if (resetBtn) resetBtn.style.display = '';
      } catch (err) {}
    }
    var rsvpResetBtn = document.getElementById('rsvpReset');
    if (rsvpResetBtn) {
      rsvpResetBtn.addEventListener('click', function () {
        localStorage.removeItem('rsvp_submitted');
        form.reset();
        var btn = form.querySelector('.btn-submit');
        var isHindi = document.documentElement.lang === 'hi';
        if (btn) { btn.textContent = isHindi ? 'भेजें' : 'Send RSVP'; btn.disabled = false; btn.style.opacity = ''; }
        form.querySelector('input[name="name"]').readOnly = false;
        form.querySelector('select[name="attendance"]').disabled = false;
        form.querySelector('textarea[name="message"]').readOnly = false;
        rsvpResetBtn.style.display = 'none';
      });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.querySelector('input[name="name"]').value || '').trim();
      var attendance = form.querySelector('select[name="attendance"]').value;
      var message = (form.querySelector('textarea[name="message"]').value || '').trim();
      if (!name) return;
      var btn = form.querySelector('.btn-submit');
      var rsvpData = {
        name: name,
        attendance: attendance,
        message: message,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('rsvp_submitted', JSON.stringify(rsvpData));
      var allRsvps = [];
      try { allRsvps = JSON.parse(localStorage.getItem('rsvp_all') || '[]'); } catch (err) {}
      allRsvps.push(rsvpData);
      localStorage.setItem('rsvp_all', JSON.stringify(allRsvps));
      if (btn) { btn.textContent = 'RSVP Sent ✓'; btn.disabled = true; btn.style.opacity = '0.7'; }
      form.querySelector('input[name="name"]').readOnly = true;
      form.querySelector('select[name="attendance"]').disabled = true;
      form.querySelector('textarea[name="message"]').readOnly = true;
      var resetBtn = document.getElementById('rsvpReset');
      if (resetBtn) resetBtn.style.display = '';
      alert('Thank you, ' + name + '! Your RSVP has been saved.');
      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rsvpData)
        }).catch(function () {});
      }
    });
  }

  // Scroll-into-view reveal: animate sections when they enter viewport
  var revealEls = document.querySelectorAll('.section-reveal, .footer-reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { root: document.querySelector('.card-face-back'), rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  // April 2026 calendar (wedding 20th; April 2026 starts Wednesday)
  (function fillCalendar() {
    var grid = document.getElementById('calendar-grid');
    if (!grid) return;
    var weddingDay = 20;
    var firstDay = 3; // 0=Sun, 3=Wed
    var daysInMonth = 30;
    var html = '';
    for (var i = 0; i < firstDay; i++) html += '<span class="cal-cell cal-cell-empty"></span>';
    for (var d = 1; d <= daysInMonth; d++) {
      var cls = 'cal-cell';
      if (d === weddingDay) cls += ' cal-cell-wedding';
      html += '<span class="' + cls + '">' + d + '</span>';
    }
    grid.innerHTML = html;
  })();

  // Make Ganesh logo transparent: strip white/near-white background from JPG
  function makeLogoTransparent() {
    var img = document.querySelector('.cover-ganesh-logo');
    if (!img) return;
    var src = (img.currentSrc || img.src || '').toString();
    if (src.indexOf('data:') === 0) return;
    if (!img.complete || !img.naturalWidth) {
      img.addEventListener('load', makeLogoTransparent);
      return;
    }
    try {
      var w = img.naturalWidth;
      var h = img.naturalHeight;
      var canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      var data = ctx.getImageData(0, 0, w, h);
      var d = data.data;
      var threshold = 228;
      for (var i = 0; i < d.length; i += 4) {
        var r = d[i];
        var g = d[i + 1];
        var b = d[i + 2];
        if (r >= threshold && g >= threshold && b >= threshold) d[i + 3] = 0;
      }
      ctx.putImageData(data, 0, 0);
      img.src = canvas.toDataURL('image/png');
      if (img.parentElement) img.parentElement.classList.add('logo-transparent');
    } catch (e) {}
  }
  makeLogoTransparent();
  window.addEventListener('load', makeLogoTransparent);

  // Falling rose petals on cover
  (function createRosePetals() {
    var container = document.getElementById('rosePetals');
    if (!container) return;
    var isMobile = window.innerWidth <= 480;
    var petalCount = isMobile ? 8 : 18;
    var colors = [
      'rgba(210, 80, 95, 0.85)',
      'rgba(190, 60, 75, 0.8)',
      'rgba(225, 105, 115, 0.82)',
      'rgba(180, 50, 65, 0.78)',
      'rgba(230, 130, 140, 0.8)'
    ];
    for (var i = 0; i < petalCount; i++) {
      var petal = document.createElement('span');
      petal.className = 'rose-petal';
      var size = 10 + Math.random() * 12;
      var left = Math.random() * 100;
      var delay = Math.random() * 8;
      var duration = 6 + Math.random() * 6;
      var swayDur = 3 + Math.random() * 4;
      var color = colors[Math.floor(Math.random() * colors.length)];
      petal.style.cssText =
        'left:' + left + '%;' +
        'width:' + size + 'px;' +
        'height:' + size + 'px;' +
        'background:' + color + ';' +
        'animation-duration:' + duration + 's;' +
        'animation-delay:' + delay + 's;' +
        'animation-name:petal-fall,petal-sway;' +
        'animation-timing-function:linear,ease-in-out;' +
        'animation-iteration-count:infinite,infinite;' +
        'animation-duration:' + duration + 's,' + swayDur + 's;' +
        'animation-delay:' + delay + 's,' + delay + 's;';
      container.appendChild(petal);
    }
    var sceneEl = document.getElementById('cardScene');
    if (sceneEl) {
      new MutationObserver(function () {
        container.style.display = sceneEl.classList.contains('opened') ? 'none' : '';
      }).observe(sceneEl, { attributes: true, attributeFilter: ['class'] });
    }
  })();

  // UPI copy on tap
  var upiBox = document.getElementById('contribution-upi-box');
  var upiIdEl = document.getElementById('contribution-upi-id');
  if (upiBox && upiIdEl) {
    upiBox.addEventListener('click', function () {
      var id = (upiIdEl.textContent || '').trim();
      if (!id || id === 'Your-UPI@id') return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(id).then(function () {
          var copyIcon = document.getElementById('contribution-upi-copy');
          if (copyIcon) { copyIcon.textContent = '✓'; setTimeout(function () { copyIcon.textContent = '📋'; }, 1500); }
        });
      }
    });
  }
})();
