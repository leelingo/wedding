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
    $('#heroDate').textContent = `${CONFIG.hero.dateDay} ${CONFIG.hero.dateMonth}`;
  }

  /* ═══════════════════════════════════════════
     Greeting
     ═══════════════════════════════════════════ */

  function initGreeting() {
    $('#greetingTitle').textContent = CONFIG.greeting.title;
    $('#greetingQuote').textContent = CONFIG.greeting.quote;
    $('#greetingQuoteSource').textContent = CONFIG.greeting.quoteSource;
    $('#greetingContent').textContent = CONFIG.greeting.content;

    const g = CONFIG.groom;
    const b = CONFIG.bride;

    function parentLine(father, mother, fatherDeceased, motherDeceased) {
      const fd = fatherDeceased ? ' deceased' : '';
      const md = motherDeceased ? ' deceased' : '';
      return `<span class="${fd}">${father}</span> · <span class="${md}">${mother}</span>`;
    }

    $('#greetingParents').innerHTML = `
      <div class="parent-row">${parentLine(g.father, g.mother, g.fatherDeceased, g.motherDeceased)}의 아들 <span class="child-name">${g.name}</span></div>
      <div class="parent-row">${parentLine(b.father, b.mother, b.fatherDeceased, b.motherDeceased)}의 딸 <span class="child-name">${b.name}</span></div>
    `;

    const contactList = $('#contactList');
    contactList.innerHTML = `
      <div class="contact-item">
        <span class="contact-item__name">신랑 ${g.name}</span>
        <div class="contact-item__actions">
          <a class="contact-item__btn" href="tel:${g.tel}">전화</a>
          <a class="contact-item__btn" href="sms:${g.tel}">문자</a>
        </div>
      </div>
      <div class="contact-item">
        <span class="contact-item__name">신부 ${b.name}</span>
        <div class="contact-item__actions">
          <a class="contact-item__btn" href="tel:${b.tel}">전화</a>
          <a class="contact-item__btn" href="sms:${b.tel}">문자</a>
        </div>
      </div>
    `;

    $('#contactBtn').addEventListener('click', () => openSheet('contactModal'));
  }

  /* ═══════════════════════════════════════════
     Sheet Modals (연락하기 / 인터뷰)
     ═══════════════════════════════════════════ */

  function openSheet(id) {
    $(`#${id}`).classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closeSheet(id) {
    $(`#${id}`).classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  function initSheetModals() {
    $('#contactClose').addEventListener('click', () => closeSheet('contactModal'));
    $('#contactBackdrop').addEventListener('click', () => closeSheet('contactModal'));
    $('#interviewClose').addEventListener('click', () => closeSheet('interviewModal'));
    $('#interviewBackdrop').addEventListener('click', () => closeSheet('interviewModal'));
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

    $('#interviewList').innerHTML = iv.questions.map(item => `
      <div class="interview-item">
        <p class="interview-item__q">Q. ${item.q}</p>
        <div class="interview-item__a">
          <p><b>신랑</b> ${item.answerGroom}</p>
          <p><b>신부</b> ${item.answerBride}</p>
        </div>
      </div>
    `).join('');

    $('#interviewBtn').addEventListener('click', () => openSheet('interviewModal'));
  }

  /* ═══════════════════════════════════════════
     Profile
     ═══════════════════════════════════════════ */

  function initProfile() {
    const p = CONFIG.profile;
    $('#profileTitle').textContent = p.title;

    $('#profileGroomName').textContent = CONFIG.groom.name;
    $('#profileGroomMeta').textContent = `${p.groom.birth}  ${p.groom.region}`;
    $('#profileGroomTags').textContent = p.groom.tags;
    $('#profileGroomTagline').textContent = p.groom.tagline;

    $('#profileBrideName').textContent = CONFIG.bride.name;
    $('#profileBrideMeta').textContent = `${p.bride.birth}  ${p.bride.region}`;
    $('#profileBrideTags').textContent = p.bride.tags;
    $('#profileBrideTagline').textContent = p.bride.tagline;
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
      dayEl.textContent = d;
      daysContainer.appendChild(dayEl);
    }

    grid.appendChild(daysContainer);
  }

  let countdownTimer = null;
  function initCountdown() {
    const descEl = $('#countdownDesc');

    function tick() {
      const wedding = getWeddingDateTime();
      const now = new Date();
      const diff = wedding - now;

      if (diff <= 0) {
        $('#cdDays').textContent = '0';
        $('#cdHours').textContent = '00';
        $('#cdMinutes').textContent = '00';
        $('#cdSeconds').textContent = '00';
        if (descEl) descEl.textContent = `${CONFIG.bride.name}, ${CONFIG.groom.name}의 결혼식 날입니다.`;
        clearInterval(countdownTimer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      $('#cdDays').textContent = days;
      $('#cdHours').textContent = String(hours).padStart(2, '0');
      $('#cdMinutes').textContent = String(minutes).padStart(2, '0');
      $('#cdSeconds').textContent = String(seconds).padStart(2, '0');
      if (descEl) descEl.textContent = `${CONFIG.bride.name}, ${CONFIG.groom.name}의 결혼식이 ${days + 1}일 남았습니다.`;
    }

    tick();
    countdownTimer = setInterval(tick, 1000);
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
    $('#locationHall').textContent = w.hall;
    $('#locationAddress').textContent = w.address;
    $('#locationTel').textContent = w.tel ? `Tel. ${w.tel}` : '';
    $('#locationMapImg').src = 'images/location/1.jpg';
    $('#kakaoMapBtn').href = w.mapLinks.kakao || '#';
    $('#naverMapBtn').href = w.mapLinks.naver || '#';
    $('#tmapBtn').href = w.mapLinks.tmap || '#';

    $('#copyAddressBtn').addEventListener('click', () => {
      copyToClipboard(w.address, '주소가 복사되었습니다');
    });

    initLocationTransit();
  }

  /* ═══════════════════════════════════════════
     Info Cards
     ═══════════════════════════════════════════ */

  function initInfoCards() {
    const info = CONFIG.info;
    $('#infoTitle').textContent = info.title;

    $('#infoCards').innerHTML = info.cards.map(card => `
      <div class="info__card">
        <div class="info__card-img"><img src="${card.image}" alt="${card.title}" loading="lazy"></div>
        <p class="info__card-title">${card.title}</p>
        <p class="info__card-text">${card.content}</p>
      </div>
    `).join('');
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
    $('#closingLabel').textContent = CONFIG.closing.label;
    $('#closingMessage').textContent = CONFIG.closing.message;
    const photo = $('#closingPhoto');
    if (photo) photo.src = (storyImages && storyImages[0]) || 'images/hero/1.jpg';
  }

  /* ═══════════════════════════════════════════
     Account
     ═══════════════════════════════════════════ */

  function renderAccountCards(side) {
    const list = CONFIG.accounts[side] || [];
    $('#accountCards').innerHTML = list.map(acc => `
      <div class="account-card">
        <p class="account-card__name">${acc.name}</p>
        <div class="account-card__bank">
          <span>${acc.bank} ${acc.number}</span>
          <button class="account-card__copy" data-account="${acc.bank} ${acc.number}">복사</button>
        </div>
      </div>
    `).join('');
  }

  function initAccounts() {
    renderAccountCards('groom');

    const groomTab = $('#groomTabBtn');
    const brideTab = $('#brideTabBtn');

    groomTab.addEventListener('click', () => {
      groomTab.classList.add('is-active');
      brideTab.classList.remove('is-active');
      renderAccountCards('groom');
    });

    brideTab.addEventListener('click', () => {
      brideTab.classList.add('is-active');
      groomTab.classList.remove('is-active');
      renderAccountCards('bride');
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.account-card__copy');
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
    initProfile();
    initCalendar();
    initCountdown();
    initLocation();
    initInfoCards();
    initAccounts();
    initFooter();
    initSheetModals();
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
