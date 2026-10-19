/* ===================================================================
   RYAN SAPUTRA PRESENTATION DECK CONTROLLER (Download.mp4 replica)
   Pauv Soneasa Portfolio Deck Engine v3 — High Velocity Editorial
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const slides = Array.from(document.querySelectorAll('.slide-section'));
  const totalSlides = slides.length;
  let currentSlideIndex = 0;

  // 1. AUTOPLAY AS DEFAULT (Requested by user)
  let isAutoplaying = true;
  const SLIDE_DURATION = 3900; // 3.9 seconds per slide (matches TikTok pacing)
  let slideStartTime = performance.now();
  let progressRaf = null;

  // 2. INACTIVITY AUTO-RESUME ENGINE (2 minutes = 120,000 ms)
  const INACTIVITY_DELAY = 120000;
  let inactivityTimer = null;

  // Audio SFX state
  let soundEnabled = localStorage.getItem('deck_sfx') !== 'false';

  // DOM Elements
  const slideIndicator = document.getElementById('slideIndicator');
  const topProgressBar = document.getElementById('topProgressBar');
  const dotButtons = Array.from(document.querySelectorAll('.dot-btn'));
  const autoplayBtn = document.getElementById('autoplayBtn');
  const playLabel = document.getElementById('playLabel');
  const playIcon = document.getElementById('playIcon');
  const musicBtn = document.getElementById('musicBtn');
  const musicLabel = document.getElementById('musicLabel');
  const soundBtn = document.getElementById('soundBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const deckToast = document.getElementById('deckToast');
  const bgAudio = document.getElementById('deckBgAudio');

  // Lightbox DOM Elements
  const lightbox = document.getElementById('deckLightbox');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxMediaImg = document.getElementById('lightboxMediaImg');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxClient = document.getElementById('lightboxClient');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxPalette = document.getElementById('lightboxPalette');

  // Web Audio Synthesizer (Zero external audio file dependencies)
  let audioCtx = null;
  function playBeep(freq = 600, type = 'sine', duration = 0.08) {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy
    }
  }

  // Toast Notification System
  let toastTimer = null;
  function showToast(text, duration = 2400) {
    if (!deckToast) return;
    deckToast.innerHTML = `<span>●</span> ${text}`;
    deckToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      deckToast.classList.remove('show');
    }, duration);
  }

  // ---- Relaxing Background Audio Engine (Soft, looping, non-intrusive 18% volume) ----
  const TARGET_VOLUME = 0.18; // Relaxing gentle background volume
  let musicDesiredState = localStorage.getItem('deck_bg_music') !== 'false'; // default to true

  function updateMusicUI(active) {
    if (musicBtn) {
      musicBtn.classList.toggle('active', active);
    }
    if (musicLabel) {
      musicLabel.textContent = active ? 'MUSIC ON' : 'MUSIC OFF';
    }
  }

  function playBgMusic() {
    if (!bgAudio || !musicDesiredState) return;
    bgAudio.volume = TARGET_VOLUME;
    bgAudio.loop = true;
    const p = bgAudio.play();
    if (p !== undefined) {
      p.then(() => {
        updateMusicUI(true);
      }).catch(() => {
        // Browser autoplay policy requires user gesture
        updateMusicUI(false);
        listenForFirstInteraction();
      });
    }
  }

  function pauseBgMusic() {
    if (!bgAudio) return;
    bgAudio.pause();
    updateMusicUI(false);
  }

  function toggleBgMusic() {
    musicDesiredState = !musicDesiredState;
    localStorage.setItem('deck_bg_music', musicDesiredState);
    if (musicDesiredState) {
      playBgMusic();
      showToast('Background Music: Playing softly 🎵');
    } else {
      pauseBgMusic();
      showToast('Background Music: Muted');
    }
  }

  let interactionUnlocked = false;
  function listenForFirstInteraction() {
    if (interactionUnlocked) return;
    const unlockEvents = ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'];
    function onFirstUserGesture() {
      interactionUnlocked = true;
      unlockEvents.forEach(evt => window.removeEventListener(evt, onFirstUserGesture));
      if (musicDesiredState && bgAudio && bgAudio.paused) {
        playBgMusic();
      }
    }
    unlockEvents.forEach(evt => window.addEventListener(evt, onFirstUserGesture, { once: true, passive: true }));
  }

  if (bgAudio) {
    bgAudio.volume = TARGET_VOLUME;
    bgAudio.loop = true;
    if (musicDesiredState) {
      playBgMusic();
    } else {
      updateMusicUI(false);
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      playBeep(720, 'sine', 0.08);
      toggleBgMusic();
    });
  }

  // Update SFX button
  if (soundBtn) {
    soundBtn.style.opacity = soundEnabled ? '1' : '0.45';
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('deck_sfx', soundEnabled);
      soundBtn.style.opacity = soundEnabled ? '1' : '0.45';
      if (soundEnabled) playBeep(750, 'sine', 0.1);
    });
  }

  // IntersectionObserver to observe currently visible slide
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        slides.forEach(s => {
          if (s !== entry.target) {
            s.classList.remove('is-visible');
          }
        });
        entry.target.classList.add('is-visible');
        const id = entry.target.id;
        const num = parseInt(id.replace('slide-', ''), 10);
        if (!isNaN(num)) {
          currentSlideIndex = num - 1;
          updateNavigationState(currentSlideIndex);
        }
      }
    });
  }, { threshold: 0.52 });

  slides.forEach(s => observer.observe(s));

  // Update Navigation UI State
  function updateNavigationState(index) {
    const num = index + 1;
    if (slideIndicator) {
      slideIndicator.textContent = `SLIDE ${String(num).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
    }
    dotButtons.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
  }

  // Jump to Slide by Index
  function jumpToSlide(idx) {
    if (idx < 0) idx = 0;
    if (idx >= totalSlides) idx = totalSlides - 1;
    const target = slides[idx];
    if (target) {
      playBeep(560 + (idx * 16), 'triangle', 0.08);
      target.scrollIntoView({ behavior: 'smooth' });

      // Refresh entrance animations
      slides.forEach(s => s.classList.remove('is-visible'));
      target.classList.add('is-visible');
      currentSlideIndex = idx;
      updateNavigationState(idx);
    }
  }

  // Progress Bar Animation Loop
  function updateProgressLoop() {
    if (!isAutoplaying) return;
    const now = performance.now();
    const elapsed = now - slideStartTime;
    const slideFraction = Math.min(1, elapsed / SLIDE_DURATION);
    const overallPct = ((currentSlideIndex + slideFraction) / totalSlides) * 100;

    if (topProgressBar) {
      topProgressBar.style.width = `${overallPct}%`;
    }

    if (elapsed >= SLIDE_DURATION) {
      let nextIndex = currentSlideIndex + 1;
      if (nextIndex >= totalSlides) nextIndex = 0;
      jumpToSlide(nextIndex);
      slideStartTime = performance.now();
    }

    progressRaf = requestAnimationFrame(updateProgressLoop);
  }

  // Start Autoplay Engine
  function startAutoplay(toastMsg) {
    isAutoplaying = true;
    if (playLabel) playLabel.textContent = 'PAUSE';
    if (autoplayBtn) autoplayBtn.classList.add('active');
    if (playIcon) {
      playIcon.innerHTML = '<rect x="6" y="4" width="3.5" height="16" fill="currentColor"/><rect x="14.5" y="4" width="3.5" height="16" fill="currentColor"/>';
    }
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
    slideStartTime = performance.now();
    cancelAnimationFrame(progressRaf);
    progressRaf = requestAnimationFrame(updateProgressLoop);
    if (toastMsg) showToast(toastMsg);
  }

  // Pause Autoplay Engine
  function pauseAutoplay(toastMsg) {
    if (!isAutoplaying) return;
    isAutoplaying = false;
    cancelAnimationFrame(progressRaf);
    if (playLabel) playLabel.textContent = 'PLAY';
    if (autoplayBtn) autoplayBtn.classList.remove('active');
    if (playIcon) {
      playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
    }
    if (topProgressBar) {
      const pct = ((currentSlideIndex + 1) / totalSlides) * 100;
      topProgressBar.style.width = `${pct}%`;
    }
    if (toastMsg) showToast(toastMsg);
    scheduleInactivityResume();
  }

  // Schedule auto-resume after 2 minutes of user inactivity
  function scheduleInactivityResume() {
    clearTimeout(inactivityTimer);
    if (!isAutoplaying) {
      inactivityTimer = setTimeout(() => {
        startAutoplay('AUTOPLAY RESUMED (2M IDLE)');
        playBeep(880, 'sine', 0.12);
      }, INACTIVITY_DELAY);
    }
  }

  // Reset inactivity timer when user moves mouse, clicks, or types
  function handleUserActivity() {
    if (!isAutoplaying) {
      scheduleInactivityResume();
    }
  }

  // Handle User Manual Scroll: Pause Autoplay immediately & let user scroll
  function handleUserManualScroll() {
    if (isAutoplaying) {
      pauseAutoplay('PAUSED • SCROLL FREELY');
    }
    handleUserActivity();
  }

  // Wheel Scroll Listener
  window.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > 2 || Math.abs(e.deltaX) > 2) {
      handleUserManualScroll();
    }
  }, { passive: true });

  // Touch Swipe & Scroll Listeners
  window.addEventListener('touchmove', () => {
    handleUserManualScroll();
  }, { passive: true });

  // Key Navigation Listeners
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space'].includes(e.code)) {
      handleUserManualScroll();
    } else {
      handleUserActivity();
    }
  });

  // Track cursor or pointer movement
  ['mousemove', 'mousedown', 'pointerdown'].forEach(evt => {
    window.addEventListener(evt, handleUserActivity, { passive: true });
  });

  // Side Dot Navigation Listeners
  dotButtons.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      handleUserManualScroll();
      jumpToSlide(idx);
    });
  });

  // Autoplay Button Click Listener
  if (autoplayBtn) {
    autoplayBtn.addEventListener('click', () => {
      if (isAutoplaying) {
        pauseAutoplay('PAUSED');
      } else {
        startAutoplay('AUTOPLAYING');
        playBeep(880, 'triangle', 0.1);
      }
    });
  }

  // Fullscreen Engine
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // Corner Arrow and Restart buttons
  document.querySelectorAll('.slide-arrow-btn, .restart-deck-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleUserManualScroll();
      if (btn.classList.contains('restart-deck-btn')) {
        jumpToSlide(0);
        startAutoplay('RESTARTING DECK');
      } else {
        jumpToSlide(currentSlideIndex + 1);
      }
    });
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        jumpToSlide(currentSlideIndex + 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        jumpToSlide(currentSlideIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        jumpToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        jumpToSlide(totalSlides - 1);
        break;
      case 'p':
      case 'P':
        if (isAutoplaying) pauseAutoplay('PAUSED');
        else startAutoplay('AUTOPLAYING');
        break;
      case 'f':
      case 'F':
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
        break;
      case 'm':
      case 'M':
        toggleBgMusic();
        break;
      case 's':
      case 'S':
        if (soundBtn) soundBtn.click();
        break;
    }
  });

  // Touch Gesture Fast Swipe
  let touchStartY = 0;
  let touchEndY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    const diff = touchEndY - touchStartY;
    if (Math.abs(diff) > 50) {
      handleUserManualScroll();
      if (diff < 0) {
        jumpToSlide(currentSlideIndex + 1);
      } else {
        jumpToSlide(currentSlideIndex - 1);
      }
    }
  }, { passive: true });

  // Lightbox Inspection Engine
  document.querySelectorAll('.card-frame').forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectId = card.getAttribute('data-project');
      const imgEl = card.querySelector('img');
      const captionEl = card.querySelector('.card-caption');
      const fullImg = card.getAttribute('data-full-img') || (imgEl ? imgEl.src : '');
      const cat = card.getAttribute('data-cat') || 'COMPETITION & EVENTS';
      const client = card.getAttribute('data-client') || 'Pauv Soneasa Portfolio';
      const desc = card.getAttribute('data-desc') || '';

      let project = null;
      if (projectId && window.portfolioProjects) {
        project = window.portfolioProjects.find(p => p.id === projectId);
      }
      openLightbox(project, fullImg, captionEl ? captionEl.textContent : '', cat, client, desc);
    });
  });

  function openLightbox(project, fallbackImg, fallbackTitle, fallbackCat, fallbackClient, fallbackDesc) {
    if (!lightbox) return;
    pauseAutoplay('PAUSED FOR INSPECTION');
    playBeep(680, 'sine', 0.1);

    if (project) {
      if (lightboxMediaImg) lightboxMediaImg.src = project.image || project.thumb || fallbackImg;
      if (lightboxCategory) lightboxCategory.textContent = (project.category || 'DESIGN').toUpperCase();
      if (lightboxClient) lightboxClient.textContent = project.client || 'Client Project';
      if (lightboxTitle) lightboxTitle.textContent = project.title;
      if (lightboxDesc) lightboxDesc.textContent = project.details || project.summary;

      if (lightboxPalette) {
        const colors = project.palette || ['#04098a', '#38bdf8', '#0f172a', '#ffffff'];
        lightboxPalette.innerHTML = colors.map(hex => 
          `<span class="lightbox-swatch" style="background-color: ${hex};" data-hex="${hex}" title="Click to copy ${hex}"></span>`
        ).join('');

        lightboxPalette.querySelectorAll('.lightbox-swatch').forEach(swatch => {
          swatch.addEventListener('click', (e) => {
            e.stopPropagation();
            const hex = swatch.getAttribute('data-hex');
            navigator.clipboard.writeText(hex).then(() => {
              playBeep(940, 'triangle', 0.08);
              swatch.style.transform = 'scale(1.4)';
              setTimeout(() => swatch.style.transform = '', 300);
            });
          });
        });
      }
    } else {
      if (lightboxMediaImg) lightboxMediaImg.src = fallbackImg;
      if (lightboxCategory) lightboxCategory.textContent = fallbackCat ? fallbackCat.toUpperCase() : 'GRAPHIC DESIGN';
      if (lightboxClient) lightboxClient.textContent = fallbackClient || 'Pauv Soneasa Portfolio';
      if (lightboxTitle) lightboxTitle.textContent = fallbackTitle || 'Creative Showcase';
      if (lightboxDesc) lightboxDesc.textContent = fallbackDesc || 'High-resolution commercial creative asset crafted by Pauv Soneasa for brand campaigns, social media, and digital print.';
      if (lightboxPalette) lightboxPalette.innerHTML = '<span class="lightbox-swatch" style="background-color: #04098a;"></span><span class="lightbox-swatch" style="background-color: #38bdf8;"></span><span class="lightbox-swatch" style="background-color: #ffffff;"></span>';
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    playBeep(450, 'sine', 0.08);
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    scheduleInactivityResume();
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  // Initial State: Start autoplay immediately by default!
  jumpToSlide(0);
  startAutoplay('AUTOPLAY ON');

});
