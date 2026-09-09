import { graduationConfig } from './config.js';

/* ==========================================================================
   01 — CELEBRATION CANVAS: CÁNH HOA, BỤI VÀNG & MŨ CỬ NHÂN RƠI NHẸ NHÀNG
   ========================================================================== */
class CelebrationCanvas {
  constructor() {
    this.canvas = document.getElementById('fallingCelebrationCanvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    const isMobile = window.innerWidth < 768;
    // Item 18: Desktop ~10–20 max, Mobile ~5–10 max. Soft and subtle.
    this.maxParticles = isMobile ? 6 : 14;
    this.types = ['petal', 'cap', 'sparkle'];
    this.burstParticles = [];
    this.running = true;

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    this.initParticles();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(dpr, dpr);
  }

  createParticle(y = -20) {
    const isMobile = this.width < 768;
    const rand = Math.random();
    let type = 'petal';
    if (rand > 0.75) type = 'cap';
    else if (rand > 0.5) type = 'sparkle';

    const baseSize = isMobile
      ? (type === 'sparkle' ? 2 : Math.random() * 3 + 6)
      : (type === 'sparkle' ? 2.8 : Math.random() * 4 + 8);

    return {
      x: Math.random() * this.width,
      y: y,
      type: type,
      size: baseSize,
      speedY: Math.random() * 0.35 + 0.25,
      speedX: (Math.random() - 0.5) * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.01 + 0.006,
      swayAmplitude: Math.random() * 1.0 + 0.5,
      opacity: Math.random() * 0.25 + 0.35
    };
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.createParticle(Math.random() * this.height);
      this.particles.push(p);
    }
  }

  // Item 4: Gentle rising float for 1.5-2s, runs only once
  spawnBurst(originX, originY, count = 8) {
    for (let i = 0; i < count; i++) {
      const p = this.createParticle(originY);
      p.x = originX + (Math.random() - 0.5) * 50;
      p.speedY = -(Math.random() * 1.1 + 0.5); // Rise gently upwards
      p.speedX = (Math.random() - 0.5) * 1.2;
      p.lifetime = Math.floor(Math.random() * 25 + 75); // ~1.5 seconds
      p.maxLife = p.lifetime;
      this.burstParticles.push(p);
    }
  }

  drawPetal(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.scale(Math.cos(p.swayOffset), 1);
    this.ctx.globalAlpha = p.opacity;

    const gradient = this.ctx.createLinearGradient(0, -p.size, 0, p.size);
    gradient.addColorStop(0, 'rgba(255, 235, 240, 0.95)');
    gradient.addColorStop(0.5, 'rgba(235, 185, 195, 0.9)');
    gradient.addColorStop(1, 'rgba(197, 160, 89, 0.5)');

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -p.size);
    this.ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.6, 0, p.size);
    this.ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.6, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
    this.ctx.fill();

    this.ctx.restore();
  }

  drawCap(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.scale(Math.cos(p.swayOffset * 0.7), 1);
    this.ctx.globalAlpha = p.opacity;

    const s = p.size * 0.75;
    this.ctx.fillStyle = '#232021';
    this.ctx.beginPath();
    this.ctx.moveTo(0, -s * 0.45);
    this.ctx.lineTo(s * 1.1, 0);
    this.ctx.lineTo(0, s * 0.45);
    this.ctx.lineTo(-s * 1.1, 0);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.strokeStyle = 'rgba(197, 160, 89, 0.75)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawSparkle(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.globalAlpha = p.opacity * Math.abs(Math.sin(p.swayOffset * 2));

    const s = p.size;
    this.ctx.fillStyle = '#F5E6B8';
    this.ctx.beginPath();
    this.ctx.moveTo(0, -s);
    this.ctx.quadraticCurveTo(0, 0, s, 0);
    this.ctx.quadraticCurveTo(0, 0, 0, s);
    this.ctx.quadraticCurveTo(0, 0, -s, 0);
    this.ctx.quadraticCurveTo(0, 0, 0, -s);
    this.ctx.fill();

    this.ctx.restore();
  }

  animate() {
    if (!this.running) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.swayOffset += p.swaySpeed;
      p.x += Math.sin(p.swayOffset) * p.swayAmplitude + p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.type === 'petal') this.drawPetal(p);
      else if (p.type === 'cap') this.drawCap(p);
      else if (p.type === 'sparkle') this.drawSparkle(p);

      if (p.y > this.height + 30) {
        p.y = -20;
        p.x = Math.random() * this.width;
      }
      if (p.x < -30) p.x = this.width + 20;
      if (p.x > this.width + 30) p.x = -20;
    }

    // Render one-time rising burst particles (Item 4)
    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const p = this.burstParticles[i];
      p.lifetime--;
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, (p.lifetime / p.maxLife) * 0.55);

      if (p.type === 'petal') this.drawPetal(p);
      else if (p.type === 'cap') this.drawCap(p);
      else if (p.type === 'sparkle') this.drawSparkle(p);

      if (p.lifetime <= 0) {
        this.burstParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

/* ==========================================================================
   02 — BACKGROUND MUSIC PLAYER
   ========================================================================== */
class MusicManager {
  constructor() {
    this.audio = document.getElementById('bgmAudio');
    this.btn = document.getElementById('btnAudioToggle');
    this.statusText = document.getElementById('audioStatusText');
    this.isPlaying = false;

    if (!this.audio) return;
    this.audio.volume = 0.65;

    this.btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });
  }

  play() {
    if (!this.audio) return;
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.btn?.classList.add('playing');
      if (this.statusText) this.statusText.textContent = 'Phát';
    }).catch(() => {
      // Browser autoplay policy
    });
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    this.btn?.classList.remove('playing');
    if (this.statusText) this.statusText.textContent = 'Nhạc';
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}

/* ==========================================================================
   03 — INVITATION COVER OPENING EXPERIENCE
   ========================================================================== */
function initInvitationCover(musicMgr, celebration) {
  const cover = document.getElementById('invitationCover');
  const btnOpen = document.getElementById('btnOpenCover');
  const hero = document.getElementById('hero');
  if (!cover) return;

  let isOpened = false;
  const openCover = (e) => {
    if (isOpened) return;
    isOpened = true;

    const posX = e && e.clientX ? e.clientX : window.innerWidth / 2;
    const posY = e && e.clientY ? e.clientY : window.innerHeight / 2;
    celebration?.spawnBurst(posX, posY, 8);

    cover.classList.add('opened');
    hero?.classList.add('hero-revealed');
    musicMgr?.play();

    // Remove cover from DOM flow after animation finishes
    setTimeout(() => {
      cover.style.display = 'none';
    }, 1100);
  };

  btnOpen?.addEventListener('click', openCover);
}

/* ==========================================================================
   04 — REAL-TIME COUNTDOWN (NO 00/00/00 FLICKER)
   ========================================================================== */
function initCountdown() {
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  if (!cdDays || !cdHours || !cdMinutes || !cdSeconds) return;

  const targetDate = new Date(graduationConfig.event.isoDateTime).getTime();

  function animateDigit(elem, newVal, isInitial = false) {
    if (elem.textContent === newVal) return;
    if (isInitial || !elem.textContent || elem.textContent === '--') {
      elem.textContent = newVal;
      return;
    }
    elem.classList.add('slide-out');
    setTimeout(() => {
      elem.textContent = newVal;
      elem.classList.remove('slide-out');
      elem.classList.add('slide-in');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          elem.classList.remove('slide-in');
        });
      });
    }, 140);
  }

  function update(isInitial = false) {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      animateDigit(cdDays, '00', isInitial);
      animateDigit(cdHours, '00', isInitial);
      animateDigit(cdMinutes, '00', isInitial);
      animateDigit(cdSeconds, '00', isInitial);
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const dStr = String(days).padStart(2, '0');
    const hStr = String(hours).padStart(2, '0');
    const mStr = String(minutes).padStart(2, '0');
    const sStr = String(seconds).padStart(2, '0');

    animateDigit(cdDays, dStr, isInitial);
    animateDigit(cdHours, hStr, isInitial);
    animateDigit(cdMinutes, mStr, isInitial);
    animateDigit(cdSeconds, sStr, isInitial);
  }

  // Run calculation immediately
  update(true);
  setInterval(() => update(false), 1000);
}

/* ==========================================================================
   05 — ADD TO CALENDAR & ICS DOWNLOAD
   ========================================================================== */
function initCalendar() {
  const btnCalendar = document.getElementById('btnAddToCalendar');
  if (!btnCalendar) return;

  btnCalendar.addEventListener('click', () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Le Thi Thanh//Graduation Invitation//VI',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:graduation-le-thi-thanh-2027@phenikaa.edu.vn',
      'DTSTAMP:20270101T000000Z',
      'DTSTART:20270120T010000Z', // 08:00 AM UTC+7
      'DTEND:20270120T043000Z',   // 11:30 AM UTC+7
      `SUMMARY:Lễ Tốt Nghiệp Cử Nhân Lê Thị Thanh (K16 Phenikaa)`,
      `DESCRIPTION:Lễ Trao Bằng Tốt Nghiệp Đại Học Tân Cử Nhân Luật Kinh tế Lê Thị Thanh - Khóa 16 Trường Đại học Phenikaa.`,
      `LOCATION:${graduationConfig.event.location.hall}, ${graduationConfig.event.location.venue}, ${graduationConfig.event.location.address}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Le_Thi_Thanh_Graduation_2027.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Đã lưu lịch hẹn (ICS) vào điện thoại của bạn! 📅');
  });
}

/* ==========================================================================
   06 — SHARE CARD WITH WEB SHARE API & CLIPBOARD
   ========================================================================== */
function initShare() {
  const btnShare = document.getElementById('btnShareCard');
  if (!btnShare) return;

  btnShare.addEventListener('click', async () => {
    const shareData = {
      title: 'Thiệp Mời Tốt Nghiệp — Lê Thị Thanh 2027',
      text: 'Trân trọng kính mời bạn đến chung vui trong Lễ Tốt Nghiệp Cử Nhân Luật Kinh tế của Lê Thị Thanh tại Đại học Phenikaa (20.01.2027)!',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('Đã sao chép liên kết thiệp mời thành công! 💌');
    }).catch(() => {
      showToast('Liên kết thiệp: ' + window.location.href);
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3200);
}

/* ==========================================================================
   07 — LIVE GUESTBOOK & INLINE RSVP
   ========================================================================== */
function getGuestbookEntries() {
  try {
    const raw = localStorage.getItem('thanh_graduation_guestbook');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Tự động dọn dẹp các lời chúc mẫu trước đây nếu còn tồn tại trong cache
        const sampleNames = ['Hoàng My', 'Đặng Tuấn Anh', 'Lan Anh (K16 Luật)'];
        const realEntries = parsed.filter(item => !sampleNames.includes(item.name));
        if (realEntries.length !== parsed.length) {
          localStorage.setItem('thanh_graduation_guestbook', JSON.stringify(realEntries));
        }
        return realEntries;
      }
    }
    return [];
  } catch (err) {
    return [];
  }
}

function formatRelativeTime(isoString) {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'Vừa xong';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return 'Gần đây';
  }
}

function renderGuestbook() {
  const stream = document.getElementById('guestbookStream');
  const counter = document.getElementById('guestbookCounter');
  if (!stream) return;

  const entries = getGuestbookEntries();
  if (counter) counter.textContent = `${entries.length} lời chúc`;

  stream.innerHTML = '';

  if (entries.length === 0) {
    stream.innerHTML = `
      <div class="guestbook-empty-state">
        <p>Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc mừng đến Thanh nhé! 💌</p>
      </div>
    `;
    return;
  }

  entries.slice().reverse().forEach((item) => {
    const card = document.createElement('div');
    card.className = 'guestbook-card';

    const isAttending = item.attendance === 'attending';
    const tagClass = isAttending ? 'tag-attending' : 'tag-remote';
    const tagText = isAttending ? '✨ Sẽ tham dự' : '💌 Gửi lời chúc từ xa';
    const timeText = formatRelativeTime(item.timestamp);

    card.innerHTML = `
      <div class="guestbook-card-top">
        <div class="guestbook-author-wrap">
          <span class="guestbook-author">${escapeHtml(item.name)}</span>
          <span class="guestbook-status-tag ${tagClass}">${tagText}</span>
        </div>
        <span class="guestbook-time">${timeText}</span>
      </div>
      <p class="guestbook-msg">"${escapeHtml(item.message)}"</p>
    `;
    stream.appendChild(card);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function initRsvp(celebration) {
  const form = document.getElementById('rsvpInlineForm');
  const thankYouPanel = document.getElementById('rsvpThankYou');
  const thankYouMsg = document.getElementById('thankYouMsg');
  const btnSendAnother = document.getElementById('btnSendAnother');

  renderGuestbook();

  if (!form || !thankYouPanel) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('rsvpName');
    const msgInput = document.getElementById('rsvpMessage');
    const attendance = form.querySelector('input[name="rsvpAttendance"]:checked')?.value || 'attending';

    const guestName = nameInput?.value.trim() || 'Bạn';
    const guestMsg = msgInput?.value.trim() || '';

    const entry = {
      name: guestName,
      attendance: attendance,
      message: guestMsg,
      timestamp: new Date().toISOString()
    };

    // 1. Lưu vào LocalStorage
    try {
      const existing = getGuestbookEntries();
      existing.push(entry);
      localStorage.setItem('thanh_graduation_guestbook', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    // 2. Gửi đồng bộ lên Google Sheets (nếu đã cấu hình webhook trong config)
    const webhook = graduationConfig.rsvpConfig?.googleSheetWebhookUrl;
    if (webhook) {
      try {
        fetch(webhook, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        }).catch(() => {});
      } catch (err) {
        console.warn('Google Sheet sync error:', err);
      }
    }

    // 3. Hiệu ứng ăn mừng hoa rơi
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      const rect = submitBtn.getBoundingClientRect();
      celebration?.spawnBurst(rect.left + rect.width / 2, rect.top, 16);
    }

    // 4. Thông điệp cá nhân hóa
    if (attendance === 'attending') {
      thankYouMsg.textContent = `Thanh vô cùng háo hức và mong chờ được đón tiếp ${guestName} vào ngày 20.01.2027 tại Trường Đại học Phenikaa!`;
    } else {
      thankYouMsg.textContent = `Dù bạn không thể đến dự trực tiếp, sự quan tâm và lời chúc phúc của ${guestName} luôn là món quà vô giá với Thanh.`;
    }

    // 5. Cập nhật bảng lời chúc trực tiếp
    renderGuestbook();

    // 6. Chuyển cảnh sang màn hình Cảm ơn
    form.style.display = 'none';
    thankYouPanel.style.display = 'block';
  });

  btnSendAnother?.addEventListener('click', () => {
    form.reset();
    thankYouPanel.style.display = 'none';
    form.style.display = 'flex';
  });
}

/* ==========================================================================
   08 — ADMIN DASHBOARD DÀNH CHO CHỦ TIỆC (XEM DANH SÁCH & XUẤT EXCEL)
   ========================================================================== */
function initAdminDashboard() {
  const btnOpen = document.getElementById('btnOpenAdmin');
  const btnClose = document.getElementById('btnCloseAdmin');
  const modal = document.getElementById('adminModal');
  const authStep = document.getElementById('adminAuthStep');
  const dashStep = document.getElementById('adminDashboardStep');
  const pinForm = document.getElementById('adminPinForm');
  const pinInput = document.getElementById('adminPinInput');
  const pinError = document.getElementById('adminPinError');

  const statTotal = document.getElementById('statTotal');
  const statAttending = document.getElementById('statAttending');
  const statRemote = document.getElementById('statRemote');
  const filterAllCount = document.getElementById('filterAllCount');
  const filterYesCount = document.getElementById('filterYesCount');
  const filterNoCount = document.getElementById('filterNoCount');

  const filterTabs = document.querySelectorAll('.filter-tab');
  const searchInput = document.getElementById('adminSearchInput');
  const tableBody = document.getElementById('adminGuestTableBody');
  const btnExport = document.getElementById('btnExportCsv');

  let currentFilter = 'all';
  let isAuthenticated = false;

  if (!btnOpen || !modal) return;

  const openAdmin = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    if (isAuthenticated) {
      renderDashboard();
    } else {
      authStep.style.display = 'block';
      dashStep.style.display = 'none';
      if (pinInput) pinInput.value = '';
      if (pinError) pinError.style.display = 'none';
      setTimeout(() => pinInput?.focus(), 150);
    }
  };

  const closeAdmin = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  btnOpen.addEventListener('click', openAdmin);
  btnClose?.addEventListener('click', closeAdmin);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAdmin();
  });

  // PIN Verification
  pinForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = pinInput?.value.trim();
    const correctPin = graduationConfig.rsvpConfig?.adminPin || '2027';

    if (entered === correctPin) {
      isAuthenticated = true;
      authStep.style.display = 'none';
      dashStep.style.display = 'block';
      renderDashboard();
    } else {
      if (pinError) pinError.style.display = 'block';
      if (pinInput) {
        pinInput.focus();
        pinInput.select();
      }
    }
  });

  function renderDashboard() {
    const entries = getGuestbookEntries();
    const total = entries.length;
    const attendingCount = entries.filter(e => e.attendance === 'attending').length;
    const remoteCount = entries.filter(e => e.attendance === 'cannot_make_it').length;

    if (statTotal) statTotal.textContent = total;
    if (statAttending) statAttending.textContent = attendingCount;
    if (statRemote) statRemote.textContent = remoteCount;

    if (filterAllCount) filterAllCount.textContent = total;
    if (filterYesCount) filterYesCount.textContent = attendingCount;
    if (filterNoCount) filterNoCount.textContent = remoteCount;

    renderTableRows();
  }

  function renderTableRows() {
    if (!tableBody) return;
    const entries = getGuestbookEntries();
    const keyword = searchInput?.value.trim().toLowerCase() || '';

    let filtered = entries.filter(item => {
      if (currentFilter === 'attending' && item.attendance !== 'attending') return false;
      if (currentFilter === 'cannot_make_it' && item.attendance !== 'cannot_make_it') return false;
      if (keyword && !item.name.toLowerCase().includes(keyword) && !item.message.toLowerCase().includes(keyword)) {
        return false;
      }
      return true;
    });

    tableBody.innerHTML = '';

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--color-charcoal-light);">Chưa có dữ liệu phù hợp</td></tr>`;
      return;
    }

    filtered.slice().reverse().forEach((item, index) => {
      const tr = document.createElement('tr');
      const isAttending = item.attendance === 'attending';
      const statusBadge = isAttending
        ? `<span class="guestbook-status-tag tag-attending">✨ Sẽ đến</span>`
        : `<span class="guestbook-status-tag tag-remote">💌 Vắng mặt</span>`;

      const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleString('vi-VN') : '—';

      tr.innerHTML = `
        <td style="text-align: center; width: 40px;">${index + 1}</td>
        <td>${escapeHtml(item.name)}</td>
        <td>${statusBadge}</td>
        <td style="max-width: 260px;">${escapeHtml(item.message)}</td>
        <td style="white-space: nowrap; font-size: 0.78rem;">${dateStr}</td>
        <td style="text-align: center; width: 60px;">
          <button class="btn-del-entry" data-timestamp="${item.timestamp || ''}" data-name="${escapeHtml(item.name)}" type="button">Xóa</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Delete single entry event
  tableBody?.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-del-entry');
    if (!btn) return;
    const ts = btn.getAttribute('data-timestamp');
    const name = btn.getAttribute('data-name') || 'khách này';

    if (confirm(`Bạn có chắc chắn muốn xóa lời chúc của "${name}" không?`)) {
      let entries = getGuestbookEntries();
      entries = entries.filter(item => item.timestamp !== ts);
      localStorage.setItem('thanh_graduation_guestbook', JSON.stringify(entries));
      renderDashboard();
      renderGuestbook();
      showToast(`Đã xóa lời chúc của ${name}! 🗑️`);
    }
  });

  // Reset data to empty
  const btnReset = document.getElementById('btnResetData');
  btnReset?.addEventListener('click', () => {
    if (confirm('Bạn có muốn xóa toàn bộ danh sách lời chúc không?')) {
      localStorage.setItem('thanh_graduation_guestbook', JSON.stringify([]));
      renderDashboard();
      renderGuestbook();
      showToast('Đã làm sạch danh sách lời chúc! 🧹');
    }
  });

  // Filter tab click
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter') || 'all';
      renderTableRows();
    });
  });

  // Search input typing
  searchInput?.addEventListener('input', () => {
    renderTableRows();
  });

  // Export CSV (Excel compatible with UTF-8 BOM)
  btnExport?.addEventListener('click', () => {
    const entries = getGuestbookEntries();
    if (entries.length === 0) {
      showToast('Chưa có khách mời nào để xuất file!');
      return;
    }

    let csvContent = '\uFEFF'; // UTF-8 BOM for Excel
    csvContent += 'STT,Họ và Tên,Trạng Thái Tham Dự,Lời Chúc Mừng,Thời Gian Gửi\r\n';

    entries.forEach((item, idx) => {
      const status = item.attendance === 'attending' ? 'Sẽ tham dự' : 'Không thể đến';
      const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleString('vi-VN') : '';
      const cleanName = `"${(item.name || '').replace(/"/g, '""')}"`;
      const cleanMsg = `"${(item.message || '').replace(/"/g, '""')}"`;
      const cleanTime = `"${dateStr}"`;

      csvContent += `${idx + 1},${cleanName},"${status}",${cleanMsg},${cleanTime}\r\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Danh_Sach_Xac_Nhan_Le_Thi_Thanh_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Đã tải xuống file Excel/CSV danh sách khách mời! 📊');
  });
}

/* ==========================================================================
   08 — LIGHTBOX MODAL FOR GALLERY (PREMIUM EDITORIAL VIEWER)
   ========================================================================== */
function initLightbox() {
  const items = document.querySelectorAll('.memory-image-container');
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const counter = document.getElementById('lightboxCounter');
  const closeBtn = document.getElementById('btnLightboxClose');
  const prevBtn = document.getElementById('btnLightboxPrev');
  const nextBtn = document.getElementById('btnLightboxNext');

  if (!modal || !items.length) return;

  const galleryData = Array.from(items).map(item => ({
    src: item.getAttribute('data-full') || '',
    caption: item.getAttribute('data-caption') || ''
  }));

  let currentIndex = 0;

  function renderImage(index, animate = true) {
    currentIndex = (index + galleryData.length) % galleryData.length;
    const current = galleryData[currentIndex];

    if (counter) {
      counter.textContent = `0${currentIndex + 1} / 0${galleryData.length}`;
    }

    if (caption) {
      caption.textContent = current.caption;
    }

    if (img) {
      if (animate) {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.97)';
        setTimeout(() => {
          img.src = current.src;
          img.style.opacity = '1';
          img.style.transform = 'scale(1)';
        }, 120);
      } else {
        img.src = current.src;
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      }
    }
  }

  items.forEach((item, idx) => {
    item.addEventListener('click', () => {
      currentIndex = idx;
      renderImage(currentIndex, false);
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  closeBtn?.addEventListener('click', closeModal);

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    renderImage(currentIndex - 1);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    renderImage(currentIndex + 1);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard navigation (Item 9)
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') renderImage(currentIndex - 1);
    if (e.key === 'ArrowRight') renderImage(currentIndex + 1);
  });

  // Mobile Touch Swipe Navigation (Item 9)
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        renderImage(currentIndex - 1); // Swipe right -> prev
      } else {
        renderImage(currentIndex + 1); // Swipe left -> next
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   09 — NAVIGATION OVERLAY
   ========================================================================== */
function initNavigation() {
  const menuToggle = document.getElementById('btnMenuToggle');
  const menuClose = document.getElementById('btnMenuClose');
  const overlay = document.getElementById('menuOverlay');
  const navLinks = document.querySelectorAll('.menu-nav-links a');

  if (!menuToggle || !overlay) return;

  const openMenu = () => overlay.classList.add('active');
  const closeMenu = () => overlay.classList.remove('active');

  menuToggle.addEventListener('click', openMenu);
  menuClose?.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   10 — SCROLL REVEAL SYSTEM (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const headlines = document.querySelectorAll('.editorial-section-title, .chapter-big-headline, .location-main-title, .rsvp-big-headline');
  headlines.forEach(el => el.classList.add('reveal-headline'));

  const images = document.querySelectorAll('.chapter-image-wrapper, .memory-image-container');
  images.forEach(el => el.classList.add('reveal-image'));

  const textBlocks = document.querySelectorAll('.editorial-section-sub, .chapter-narrative, .chapter-editorial-quote, .invitation-letter-body, .location-accordion, .rsvp-inline-form');
  textBlocks.forEach(el => el.classList.add('reveal-on-scroll'));

  const allRevealElements = document.querySelectorAll('.reveal-headline, .reveal-image, .reveal-on-scroll, .reveal-stagger-item');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay');
        if (delay) {
          setTimeout(() => {
            el.classList.add('is-revealed');
          }, parseInt(delay, 10));
        } else {
          el.classList.add('is-revealed');
        }
        obs.unobserve(el);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -6% 0px',
    threshold: 0.1
  });

  allRevealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   11 — TIMELINE SCROLL PROGRESS & GLOW DOT ACTIVATION
   ========================================================================== */
function initTimelineScroll() {
  const timeline = document.querySelector('.cinematic-timeline');
  const scrollFill = document.getElementById('timelineScrollFill');
  const milestones = document.querySelectorAll('.timeline-milestone');
  if (!timeline || !scrollFill) return;

  const updateProgress = () => {
    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const startY = windowHeight * 0.7;
    const progress = (startY - rect.top) / rect.height;
    const clamped = Math.max(0, Math.min(1, progress));
    scrollFill.style.transform = `scaleY(${clamped})`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  const dotObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
      }
    });
  }, {
    rootMargin: '0px 0px -15% 0px',
    threshold: 0.2
  });

  milestones.forEach(m => dotObserver.observe(m));
}

/* ==========================================================================
   12 — MOBILE GALLERY SCROLL COUNTER SYNCHRONIZER
   ========================================================================== */
function initMobileGalleryIndicator() {
  const scrollContainer = document.querySelector('.memories-editorial-scroll');
  const counterTag = document.getElementById('galleryActiveCounter');
  const slides = document.querySelectorAll('.memory-magazine-slide');
  if (!scrollContainer || !counterTag || !slides.length) return;

  const updateCounter = () => {
    const scrollLeft = scrollContainer.scrollLeft;
    const slideWidth = slides[0].offsetWidth;
    const activeIdx = Math.min(Math.round(scrollLeft / (slideWidth + 16)), slides.length - 1);
    counterTag.textContent = `0${activeIdx + 1} / 0${slides.length}`;
  };

  scrollContainer.addEventListener('scroll', updateCounter, { passive: true });
}

/* ==========================================================================
   13 — INITIALIZATION ON DOM READY
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const celebration = new CelebrationCanvas();
  const musicMgr = new MusicManager();

  initInvitationCover(musicMgr, celebration);
  initCountdown();
  initCalendar();
  initShare();
  initRsvp(celebration);
  initAdminDashboard();
  initLightbox();
  initNavigation();
  initScrollReveal();
  initTimelineScroll();
  initMobileGalleryIndicator();
});
