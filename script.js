/**
 * Wedding Invitation v2
 * Korean Mobile 청첩장 - Script
 */

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function formatDate(dateStr, timeStr) {
    const d = new Date(`${dateStr}T${timeStr}:00`);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const day = days[d.getDay()];
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const period = hours < 12 ? '오전' : '오후';
    const h12 = hours % 12 || 12;
    const minuteStr = minutes > 0 ? ` ${minutes}분` : '';
    return `${year}년 ${month}월 ${date}일 ${day}요일 ${period} ${h12}시${minuteStr}`;
  }

  function getWeddingDateTime() {
    return new Date(`${CONFIG.wedding.date}T${CONFIG.wedding.time}:00`);
  }

  /* ═══════════════════════════════════════════
     Image Auto-Detection
     ═══════════════════════════════════════════ */

  function loadImagesFromFolder(folder, maxAttempts = 50) {
    return new Promise(resolve => {
      const images = [];
      let current = 1;
      let consecutiveFails = 0;

      function tryNext() {
        if (current > maxAttempts || consecutiveFails >= 3) {
          resolve(images);
          return;
        }
        const img = new Image();
        const path = `images/${folder}/${current}.jpg`;
        img.onload = function () {
          images.push(path);
          consecutiveFails = 0;
          current++;
          tryNext();
        };
        img.onerror = function () {
          consecutiveFails++;
          current++;
          tryNext();
        };
        img.src = path;
      }

      tryNext();
    });
  }

  /* ═══════════════════════════════════════════
     Toast
     ═══════════════════════════════════════════ */

  let toastTimer = null;
  function showToast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2500);
  }

  /* ═══════════════════════════════════════════
     Clipboard
     ═══════════════════════════════════════════ */

  async function copyToClipboard(text, successMsg) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showToast(successMsg || '복사되었습니다');
    } catch {
      showToast('복사에 실패했습니다');
    }
  }

  /* ═══════════════════════════════════════════
     OG Meta Tags
     ═══════════════════════════════════════════ */

  function setMetaTags() {
    const m = CONFIG.meta;
    document.title = m.title;
    const setMeta = (attr, val, content) => {
      const el = document.querySelector(`meta[${attr}="${val}"]`);
      if (el) el.setAttribute('content', content);
    };
    setMeta('property', 'og:title', m.title);
    setMeta('property', 'og:description', m.description);
    setMeta('property', 'og:image', 'images/og/1.jpg');
    setMeta('name', 'description', m.description);
  }

  /* ═══════════════════════════════════════════
     Hero
     ═══════════════════════════════════════════ */

  function initHero() {
    $('#heroPhoto').src = 'images/hero/1.jpg';
    initSnow();
  }

  function initSnow() {
    const container = $('#heroSnow');
    if (!container) return;
    const count = 40;
    let html = '';
    for (let i = 0; i < count; i++) {
      const size = (Math.random() * 3 + 2).toFixed(1); // 2px ~ 5px
      const left = (Math.random() * 100).toFixed(2);
      const duration = (Math.random() * 6 + 7).toFixed(2); // 7s ~ 13s
      const delay = (Math.random() * -13).toFixed(2);
      const drift = (Math.random() * 60 - 30).toFixed(0);
      const opacity = (Math.random() * 0.5 + 0.4).toFixed(2);
      html += `<span class="snowflake" style="width:${size}px;height:${size}px;left:${left}%;opacity:${opacity};--drift:${drift}px;animation-duration:${duration}s;animation-delay:${delay}s;"></span>`;
    }
    container.innerHTML = html;
  }

  /* ═══════════════════════════════════════════
     Greeting
     ═══════════════════════════════════════════ */

  function initGreeting() {
    $('#greetingTitle').textContent = CONFIG.greeting.title;
    $('#greetingQuote').textContent = CONFIG.greeting.quote;
    $('#greetingContent').textContent = CONFIG.greeting.content;

    const g = CONFIG.groom;
    const b = CONFIG.bride;

    function parentLine(father, mother, fatherDeceased, motherDeceased) {
      const fd = fatherDeceased ? ' deceased' : '';
      const md = motherDeceased ? ' deceased' : '';
      return `<span class="parent-name${fd}">${father}</span> · <span class="parent-name${md}">${mother}</span>`;
    }

    $('#greetingParents').innerHTML = `
      <div class="parent-row">${parentLine(g.father, g.mother, g.fatherDeceased, g.motherDeceased)}<span class="relation">의 차남</span> <span class="child-name">${g.name}</span></div>
      <div class="parent-row">${parentLine(b.father, b.mother, b.fatherDeceased, b.motherDeceased)}<span class="relation">의 차녀</span> <span class="child-name">${b.name}</span></div>
    `;
  }

  /* ═══════════════════════════════════════════
     Interview
     ═══════════════════════════════════════════ */

  function initInterview() {
    const iv = CONFIG.interview;
    $('#interviewTitle').textContent = iv.title;
    $('#interviewSubtitle').textContent = iv.subtitle;
    $('#interviewGroomPhoto').src = 'images/profile/1.jpg';
    $('#interviewBridePhoto').src = 'images/profile/2.jpg';
  }

  /* ═══════════════════════════════════════════
     Calendar + Countdown
     ═══════════════════════════════════════════ */

  function initCalendar() {
    const dt = getWeddingDateTime();
    const year = dt.getFullYear();
    const month = dt.getMonth();
    const weddingDay = dt.getDate();

    $('#calendarDateHeading').textContent = `${year}.${String(month + 1).padStart(2, '0')}.${String(weddingDay).padStart(2, '0')}`;
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const hours = dt.getHours();
    const period = hours < 12 ? '오전' : '오후';
    const h12 = hours % 12 || 12;
    $('#calendarDateSub').textContent = `${days[dt.getDay()]}요일 ${period} ${h12}시${dt.getMinutes() > 0 ? ' ' + dt.getMinutes() + '분' : ''}`;

    const grid = $('#calendarGrid');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const wdRow = document.createElement('div');
    wdRow.className = 'calendar__weekdays';
    weekdays.forEach((wd, i) => {
      const el = document.createElement('span');
      el.className = 'calendar__weekday' + (i === 0 ? ' is-weekend-sun' : i === 6 ? ' is-weekend-sat' : '');
      el.textContent = wd;
      wdRow.appendChild(el);
    });
    grid.appendChild(wdRow);

    const daysContainer = document.createElement('div');
    daysContainer.className = 'calendar__days';

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('span');
      empty.className = 'calendar__day is-empty';
      daysContainer.appendChild(empty);
    }

    for (let d = 1; d <= lastDate; d++) {
      const dayEl = document.createElement('span');
      const dow = new Date(year, month, d).getDay();
      let cls = 'calendar__day';
      if (dow === 0) cls += ' is-sun';
      if (dow === 6) cls += ' is-sat';
      if (d === weddingDay) cls += ' is-today';
      dayEl.className = cls;
      if (d === weddingDay) {
        dayEl.innerHTML = `<span class="calendar__day-badge">${d}</span>`;
      } else {
        dayEl.textContent = d;
      }
      daysContainer.appendChild(dayEl);
    }

    grid.appendChild(daysContainer);
  }

  function initCountdown() {
    const descEl = $('#countdownDesc');
    if (!descEl) return;

    const wedding = getWeddingDateTime();
    const now = new Date();
    const diff = wedding - now;

    if (diff <= 0) {
      descEl.textContent = `정은, 상우의 결혼식 날입니다.`;
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    descEl.textContent = `정은, 상우의 결혼식이 ${days + 1}일 남았습니다.`;
  }

  /* ═══════════════════════════════════════════
     Location
     ═══════════════════════════════════════════ */

  function renderTransitList(listId, items) {
    const listEl = $(`#${listId}`);
    if (!listEl || !items || !items.length) return;
    listEl.innerHTML = items.map(item => `
      <li>
        <span class="location__transit-dot" style="background-color:${item.color || '#999'}"></span>
        <span>${item.text}</span>
      </li>
    `).join('');
  }

  function initLocationTransit() {
    const transit = CONFIG.wedding.transit;
    if (!transit) return;

    renderTransitList('locationSubwayList', transit.subway);
    renderTransitList('locationBusList', transit.bus);

    const subwayNoteEl = $('#locationSubwayNote');
    if (transit.subway && transit.subway.length && subwayNoteEl) subwayNoteEl.textContent = transit.subwayNote || '';

    const shuttleNoteEl = $('#locationShuttleNote');
    if (transit.bus && transit.bus.length && shuttleNoteEl) shuttleNoteEl.textContent = transit.shuttleNote || '';
  }

  function initLocation() {
    const w = CONFIG.wedding;
    $('#locationVenue').textContent = w.venue;
    $('#locationAddress').textContent = w.address;
    $('#locationMapImg').src = 'images/location/1.jpg';
    $('#naverMapBtn').href = w.mapLinks.naver || '#';

    $('#copyAddressBtn').addEventListener('click', () => {
      copyToClipboard(w.address, '주소가 복사되었습니다');
    });

    initLocationTransit();
  }

  /* ═══════════════════════════════════════════
     Gallery
     ═══════════════════════════════════════════ */

  let galleryImages = [];
  let galleryIndex = 0;

  function setGalleryIndex(i) {
    if (!galleryImages.length) return;
    galleryIndex = (i + galleryImages.length) % galleryImages.length;

    const mainImg = $('#galleryMainImg');
    if (mainImg) mainImg.src = galleryImages[galleryIndex];

    $$('.gallery__thumb').forEach((thumb, idx) => {
      thumb.classList.toggle('is-active', idx === galleryIndex);
    });

    const activeThumb = $(`.gallery__thumb[data-index="${galleryIndex}"]`);
    if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  function initGallery(images) {
    const thumbsWrap = $('#galleryThumbs');
    const placeholder = thumbsWrap ? thumbsWrap.querySelector('.loading-placeholder') : null;
    if (placeholder) placeholder.remove();

    if (images.length === 0) {
      const gallerySection = $('#gallery');
      if (gallerySection) gallerySection.style.display = 'none';
      return;
    }

    galleryImages = images;
    galleryIndex = 0;

    const mainImg = $('#galleryMainImg');
    if (mainImg) {
      mainImg.src = galleryImages[0];
      mainImg.addEventListener('click', () => openPhotoModal(galleryImages, galleryIndex));
    }

    if (thumbsWrap) {
      thumbsWrap.innerHTML = galleryImages.map((src, i) => `
        <div class="gallery__thumb${i === 0 ? ' is-active' : ''}" data-index="${i}">
          <img src="${src}" alt="갤러리 사진 ${i + 1}" loading="lazy">
        </div>
      `).join('');

      $$('.gallery__thumb', thumbsWrap).forEach((thumb) => {
        thumb.addEventListener('click', () => setGalleryIndex(Number(thumb.dataset.index)));
      });
    }

    const prevBtn = $('#galleryPrevBtn');
    const nextBtn = $('#galleryNextBtn');
    const hasMultiple = galleryImages.length > 1;
    if (prevBtn) {
      prevBtn.style.display = hasMultiple ? '' : 'none';
      prevBtn.addEventListener('click', () => setGalleryIndex(galleryIndex - 1));
    }
    if (nextBtn) {
      nextBtn.style.display = hasMultiple ? '' : 'none';
      nextBtn.addEventListener('click', () => setGalleryIndex(galleryIndex + 1));
    }
  }

  /* ═══════════════════════════════════════════
     Photo Modal
     ═══════════════════════════════════════════ */

  let modalImages = [];
  let modalIndex = 0;
  let touchStartX = 0, touchEndX = 0, touchStartY = 0, touchEndY = 0;

  function openPhotoModal(images, index) {
    modalImages = images;
    modalIndex = index;
    showModalImage();
    $('#photoModal').classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closePhotoModal() {
    $('#photoModal').classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  function showModalImage() {
    const img = $('#modalImg');
    img.src = modalImages[modalIndex];
    $('#modalCounter').textContent = `${modalIndex + 1} / ${modalImages.length}`;
    $('#modalPrev').style.display = modalIndex > 0 ? '' : 'none';
    $('#modalNext').style.display = modalIndex < modalImages.length - 1 ? '' : 'none';
  }

  function modalNavigate(dir) {
    const newIndex = modalIndex + dir;
    if (newIndex >= 0 && newIndex < modalImages.length) {
      modalIndex = newIndex;
      showModalImage();
    }
  }

  function initPhotoModal() {
    $('#modalClose').addEventListener('click', closePhotoModal);
    $('#modalPrev').addEventListener('click', () => modalNavigate(-1));
    $('#modalNext').addEventListener('click', () => modalNavigate(1));

    const modal = $('#photoModal');
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.id === 'modalContainer') closePhotoModal();
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closePhotoModal();
      if (e.key === 'ArrowLeft') modalNavigate(-1);
      if (e.key === 'ArrowRight') modalNavigate(1);
    });

    const container = $('#modalContainer');
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const minSwipe = 50;
    if (Math.abs(diffX) < minSwipe || Math.abs(diffX) < Math.abs(diffY)) return;
    modalNavigate(diffX > 0 ? 1 : -1);
  }

  /* ═══════════════════════════════════════════
     Closing
     ═══════════════════════════════════════════ */

  function initClosing(storyImages) {
    const photo = $('#closingPhoto');
    if (photo) photo.src = (storyImages && storyImages[0]) || 'images/hero/1.jpg';
  }

  /* ═══════════════════════════════════════════
     Account
     ═══════════════════════════════════════════ */

  function renderAccounts(accounts, containerId) {
    const container = $(`#${containerId}`);
    container.innerHTML = accounts.map(acc => `
      <div class="account-item">
        <div class="account-item__info">
          <div class="account-item__role">${acc.role || ''}</div>
          <div class="account-item__detail">
            <span class="account-item__name">${acc.name || ''}</span>
            ${acc.bank} ${acc.number}
          </div>
        </div>
        <button class="account-item__copy" data-account="${acc.bank} ${acc.number} ${acc.name || ''}">복사</button>
      </div>
    `).join('');
  }

  function initAccordion(triggerId, panelId) {
    const trigger = $(`#${triggerId}`);
    const panel = $(`#${panelId}`);

    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', !expanded);
      panel.style.maxHeight = expanded ? '0' : panel.scrollHeight + 'px';
    });
  }

  function initAccounts() {
    renderAccounts(CONFIG.accounts.groom, 'groomAccountList');
    renderAccounts(CONFIG.accounts.bride, 'brideAccountList');

    initAccordion('groomAccordion', 'groomAccordionPanel');
    initAccordion('brideAccordion', 'brideAccordionPanel');

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.account-item__copy');
      if (!btn) return;
      copyToClipboard(btn.dataset.account, '계좌번호가 복사되었습니다');
    });
  }

  /* ═══════════════════════════════════════════
     Footer / Share
     ═══════════════════════════════════════════ */

  function initFooter() {
    const dt = getWeddingDateTime();
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    $('#footerText').textContent = `${CONFIG.groom.name} & ${CONFIG.bride.name} — ${year}.${month}.${day}`;

    $('#shareBtn').addEventListener('click', async () => {
      const shareData = {
        title: CONFIG.meta.title,
        text: CONFIG.meta.description,
        url: window.location.href
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch (e) { /* cancelled */ }
      } else {
        copyToClipboard(window.location.href, '청첩장 링크가 복사되었습니다');
      }
    });
  }

  /* ═══════════════════════════════════════════
     Loading Placeholders
     ═══════════════════════════════════════════ */

  function showLoadingPlaceholders() {
    const galleryThumbs = $('#galleryThumbs');
    const placeholderHTML = '<div class="loading-placeholder"><span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span></div>';
    if (galleryThumbs) galleryThumbs.innerHTML = placeholderHTML;
  }

  /* ═══════════════════════════════════════════
     Scroll Animations
     ═══════════════════════════════════════════ */

  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    $$('.animate-item').forEach((el) => observer.observe(el));

    const mutObs = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.classList && node.classList.contains('animate-item')) observer.observe(node);
          if (node.querySelectorAll) node.querySelectorAll('.animate-item').forEach((el) => observer.observe(el));
        });
      });
    });

    mutObs.observe(document.body, { childList: true, subtree: true });
  }

  /* ═══════════════════════════════════════════
     Init
     ═══════════════════════════════════════════ */

  async function init() {
    setMetaTags();
    initHero();
    initGreeting();
    initInterview();
    initCalendar();
    initCountdown();
    initLocation();
    initAccounts();
    initFooter();
    initPhotoModal();
    initScrollAnimations();

    showLoadingPlaceholders();

    const [galleryImgs, storyImgs] = await Promise.all([
      loadImagesFromFolder('gallery'),
      loadImagesFromFolder('story')
    ]);

    initGallery(galleryImgs);
    initClosing(storyImgs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
