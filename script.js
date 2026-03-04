(function () {
  'use strict';

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

  var form = document.querySelector('.rsvp-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you! Your response has been recorded. (Connect this form to Formspree or your backend.)');
      form.reset();
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
