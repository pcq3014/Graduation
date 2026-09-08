import { graduationConfig } from './config.js';

/* ==========================================================================
   01 — CELEBRATION CANVAS: HOA RƠI, MŨ CỬ NHÂN RƠI, ĐIỂM 100 RƠI & BỤI VÀNG
   ========================================================================== */
class CelebrationCanvas {
  constructor() {
    this.canvas = document.getElementById('fallingCelebrationCanvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    const isMobile = window.innerWidth < 768;
    // Tối ưu nhẹ nhàng cho điện thoại: chỉ 12-14 hạt rơi êm dịu, không giật lag
    this.maxParticles = isMobile ? 14 : 26;
    this.types = ['petal', 'cap', 'score', 'sparkle'];
    this.running = true;

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    this.initParticles();
    this.animate();

    // Tap nhẹ trên màn hình mở màn để tạo 5-8 hạt rơi tự nhiên
    const curtain = document.getElementById('openingCurtain');
    curtain?.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') {
        this.spawnBurst(e.clientX, e.clientY, isMobile ? 6 : 10);
      }
    });
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    // Cắt giảm DPR tối đa 1.5 để điện thoại mượt mà 60fps và tiết kiệm pin
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
    if (rand > 0.8) type = 'score';
    else if (rand > 0.55) type = 'cap';
    else if (rand > 0.45) type = 'sparkle';

    const baseSize = isMobile 
      ? (type === 'sparkle' ? 2.5 : Math.random() * 5 + 9)
      : (type === 'sparkle' ? 3.5 : Math.random() * 7 + 12);

    return {
      x: Math.random() * this.width,
      y: y,
      type: type,
      size: baseSize,
      speedY: Math.random() * 0.6 + 0.45, // Tốc độ rơi êm ái, bồng bềnh
      speedX: (Math.random() - 0.5) * 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.015 + 0.01,
      swayAmplitude: Math.random() * 1.4 + 0.8,
      opacity: Math.random() * 0.35 + 0.6,
      scaleX: 1
    };
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.createParticle(Math.random() * this.height);
      this.particles.push(p);
    }
  }

  spawnBurst(originX, originY, count = 8) {
    for (let i = 0; i < count; i++) {
      const p = this.createParticle(originY);
      p.x = originX + (Math.random() - 0.5) * 60;
      p.speedY = Math.random() * 1.5 + 0.8;
      p.speedX = (Math.random() - 0.5) * 2;
      this.particles.push(p);
    }
    // Giữ số lượng hạt tối đa không vượt quá 35
    if (this.particles.length > 35) {
      this.particles.splice(0, this.particles.length - 35);
    }
  }

  drawPetal(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.scale(Math.cos(p.swayOffset), 1);
    this.ctx.globalAlpha = p.opacity;

    // Elegant soft pink / warm ivory flower petal
    const gradient = this.ctx.createLinearGradient(0, -p.size, 0, p.size);
    gradient.addColorStop(0, 'rgba(255, 230, 235, 0.95)');
    gradient.addColorStop(0.5, 'rgba(235, 175, 185, 0.9)');
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

    const s = p.size * 0.85;

    // Diamond Mortarboard Top
    this.ctx.fillStyle = '#232021';
    this.ctx.beginPath();
    this.ctx.moveTo(0, -s * 0.45);
    this.ctx.lineTo(s * 1.1, 0);
    this.ctx.lineTo(0, s * 0.45);
    this.ctx.lineTo(-s * 1.1, 0);
    this.ctx.closePath();
    this.ctx.fill();

    // Mortarboard Outline in Gold
    this.ctx.strokeStyle = 'rgba(197, 160, 89, 0.75)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    // Cap Skull Base
    this.ctx.fillStyle = '#3a3435';
    this.ctx.beginPath();
    this.ctx.ellipse(0, s * 0.25, s * 0.45, s * 0.2, 0, 0, Math.PI);
    this.ctx.fill();

    // Gold Tassel
    this.ctx.strokeStyle = '#C5A059';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.quadraticCurveTo(s * 0.5, s * 0.2, s * 0.8, s * 0.7);
    this.ctx.stroke();

    // Tassel tip
    this.ctx.fillStyle = '#F3E5AB';
    this.ctx.beginPath();
    this.ctx.arc(s * 0.8, s * 0.7, 2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  drawScore100(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation * 0.5);
    this.ctx.scale(Math.cos(p.swayOffset * 0.5), 1);
    this.ctx.globalAlpha = p.opacity;

    const s = p.size;

    // Red & Gold Excellence 100 Badge
    this.ctx.font = `bold ${Math.round(s)}px 'Be Vietnam Pro', sans-serif`;
    this.ctx.fillStyle = '#A32035';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.shadowColor = 'rgba(163, 32, 53, 0.4)';
    this.ctx.shadowBlur = 4;
    this.ctx.fillText('100', 0, 0);

    // Double underline for Vietnamese 100 points
    this.ctx.strokeStyle = '#C5A059';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(-s * 0.65, s * 0.55);
    this.ctx.lineTo(s * 0.65, s * 0.55);
    this.ctx.moveTo(-s * 0.5, s * 0.75);
    this.ctx.lineTo(s * 0.5, s * 0.75);
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
    this.ctx.shadowColor = '#C5A059';
    this.ctx.shadowBlur = 8;

    // 4-point star
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

      // Update position
      p.swayOffset += p.swaySpeed;
      p.x += Math.sin(p.swayOffset) * p.swayAmplitude + p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      // Draw according to type
      if (p.type === 'petal') this.drawPetal(p);
      else if (p.type === 'cap') this.drawCap(p);
      else if (p.type === 'score') this.drawScore100(p);
      else if (p.type === 'sparkle') this.drawSparkle(p);

      // Wrap around
      if (p.y > this.height + 30) {
        p.y = -20;
        p.x = Math.random() * this.width;
      }
      if (p.x < -30) p.x = this.width + 20;
      if (p.x > this.width + 30) p.x = -20;
    }

    requestAnimationFrame(() => this.animate());
  }
}

/* ==========================================================================
   02 — BACKGROUND MUSIC PLAYER (MOMENTS TO MEMORIES)
   ========================================================================== */
class MusicManager {
  constructor() {
    this.audio = document.getElementById('bgmAudio');
    this.btn = document.getElementById('btnAudioToggle');
    this.statusText = document.getElementById('audioStatusText');
    this.isPlaying = false;
    this.userInteracted = false;

    if (!this.audio) return;

    this.audio.volume = 0.65;

    this.btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Try starting music on first meaningful user interaction
    const startOnInteraction = () => {
      if (!this.userInteracted) {
        this.userInteracted = true;
        this.play();
      }
      window.removeEventListener('click', startOnInteraction);
      window.removeEventListener('keydown', startOnInteraction);
      window.removeEventListener('touchstart', startOnInteraction);
    };

    window.addEventListener('click', startOnInteraction, { once: true });
    window.addEventListener('keydown', startOnInteraction, { once: true });
    window.addEventListener('touchstart', startOnInteraction, { once: true });
  }

  play() {
    if (!this.audio) return;
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.btn?.classList.add('playing');
      if (this.statusText) this.statusText.textContent = 'Đang Phát';
    }).catch((err) => {
      console.log('Autoplay restriction, waiting for direct user click:', err);
    });
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    this.btn?.classList.remove('playing');
    if (this.statusText) this.statusText.textContent = 'Bật Nhạc';
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
   03 — CINEMATIC OPENING SEQUENCE
   ========================================================================== */
function initOpeningSequence(musicMgr) {
  const curtain = document.getElementById('openingCurtain');
  const badge = document.getElementById('openingBadge');
  const line = document.getElementById('openingLine');
  const year = document.getElementById('openingYear');
  const name = document.getElementById('openingName');
  const degree = document.getElementById('openingDegree');
  const indicator = document.getElementById('openingIndicator');
  const skipBtn = document.getElementById('skipOpeningBtn');

  if (!curtain) return;

  // Staggered luxury reveal timers
  setTimeout(() => {
    if (badge) {
      badge.style.opacity = '1';
      badge.style.transform = 'translateY(0)';
    }
  }, 400);

  setTimeout(() => {
    if (line) {
      line.style.width = '70px';
    }
  }, 1000);

  setTimeout(() => {
    if (year) {
      year.style.opacity = '1';
      year.style.transform = 'scale(1)';
    }
  }, 1600);

  setTimeout(() => {
    if (name) {
      name.style.opacity = '1';
      name.style.transform = 'translateY(0)';
    }
  }, 2400);

  setTimeout(() => {
    if (degree) {
      degree.style.opacity = '1';
      degree.style.transform = 'translateY(0)';
    }
  }, 3200);

  setTimeout(() => {
    if (indicator) {
      indicator.style.opacity = '1';
    }
  }, 3800);

  // Close Opening Experience
  let isClosed = false;
  function closeOpening() {
    if (isClosed) return;
    isClosed = true;
    curtain.classList.add('hidden');
    document.body.style.overflow = '';
    musicMgr?.play();
  }

  skipBtn?.addEventListener('click', closeOpening);
  indicator?.addEventListener('click', closeOpening);

  // Auto-dismiss on scroll or touch drag
  window.addEventListener('wheel', (e) => {
    if (e.deltaY > 20) closeOpening();
  }, { passive: true });

  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (touchStartY - e.touches[0].clientY > 30) {
      closeOpening();
    }
  }, { passive: true });
}

/* ==========================================================================
   04 — EDITORIAL REAL-TIME COUNTDOWN
   ========================================================================== */
function initCountdown() {
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  if (!cdDays) return;

  const targetDate = new Date(graduationConfig.event.isoDateTime).getTime();

  function update() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   05 — ADD TO CALENDAR & ICS DOWNLOAD
   ========================================================================== */
function initCalendar(celebrationInstance) {
  const btnCalendar = document.getElementById('btnAddToCalendar');
  const btnQuickCal = document.getElementById('btnQuickAddToCal');
  const specialDay = document.getElementById('calSpecialDay');

  const downloadIcs = () => {
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

    showToast('Đã lưu lịch hẹn (ICS) vào điện thoại của bạn!');
  };

  btnCalendar?.addEventListener('click', downloadIcs);
  btnQuickCal?.addEventListener('click', downloadIcs);

  // Click on Day 20 Star Marker
  specialDay?.addEventListener('click', (e) => {
    celebrationInstance?.spawnBurst(e.clientX, e.clientY, 12);
    showToast('⭐ Ngày 20.01.2027: Lễ Trao Bằng Tốt Nghiệp Lê Thị Thanh tại ĐH Phenikaa!');
  });
}

/* ==========================================================================
   06 — SHARE CARD WITH TOAST FEEDBACK
   ========================================================================== */
function initShare() {
  const btnShare = document.getElementById('btnShareCard');
  if (!btnShare) return;

  btnShare.addEventListener('click', async () => {
    const shareData = {
      title: 'Thiệp Mời Tốt Nghiệp — Lê Thị Thanh 2027',
      text: 'Trân trọng kính mời bạn đến chung vui trong Lễ Tốt Nghiệp Cử Nhân Luật Kinh tế của Lê Thị Thanh tại Đại học Phenikaa!',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback
      }
    }

    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('Đã sao chép liên kết thiệp mời thành công!');
    }).catch(() => {
      showToast('Sao chép liên kết: ' + window.location.href);
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
   07 — RSVP & GUESTBOOK MODAL
   ========================================================================== */
function initRsvp() {
  const btnOpen = document.getElementById('btnOpenRsvp');
  const modal = document.getElementById('rsvpModal');
  const btnClose = document.getElementById('btnCloseRsvp');
  const form = document.getElementById('rsvpForm');

  if (!btnOpen || !modal) return;

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  btnOpen.addEventListener('click', openModal);
  btnClose?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('rsvpName');
    const msgInput = document.getElementById('rsvpMessage');
    const attSelect = document.getElementById('rsvpAttendance');

    const entry = {
      name: nameInput?.value.trim(),
      attendance: attSelect?.value,
      message: msgInput?.value.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('thanh_graduation_guestbook') || '[]');
      existing.push(entry);
      localStorage.setItem('thanh_graduation_guestbook', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    form.reset();
    closeModal();
    showToast(`Cảm ơn ${entry.name}! Lời chúc tốt đẹp đã gửi đến Thanh ✨`);
  });
}

/* ==========================================================================
   08 — LIGHTBOX MODAL FOR GALLERY
   ========================================================================== */
function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('btnLightboxClose');

  if (!modal || !items.length) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const fullSrc = item.getAttribute('data-full');
      const text = item.getAttribute('data-caption');
      if (img) img.src = fullSrc;
      if (caption) caption.textContent = text;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
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
   10 — 3D PAPER TILT EFFECT ON DESKTOP
   ========================================================================== */
function initCardTilt() {
  const card = document.getElementById('invitationCard');
  if (!card || window.innerWidth < 1024) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 4.5;
    const rotY = (x / (rect.width / 2)) * 4.5;

    card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
}

/* ==========================================================================
   11 — INITIALIZATION ON DOM READY
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const celebration = new CelebrationCanvas();
  const musicMgr = new MusicManager();
  initOpeningSequence(musicMgr);
  initCountdown();
  initCalendar(celebration);
  initShare();
  initRsvp();
  initLightbox();
  initNavigation();
  initCardTilt();
});
