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

  // Filmstrip & Drawer DOM Elements
  const filmstripDrawer = document.getElementById('deckFilmstripDrawer');
  const filmstripTrack = document.getElementById('filmstripTrack');
  const filmstripBtn = document.getElementById('filmstripBtn');
  const filmstripCloseBtn = document.getElementById('filmstripCloseBtn');
  let filmstripItems = [];

  // Contact Modal DOM Elements
  const quickContactBtn = document.getElementById('quickContactBtn');
  const contactModal = document.getElementById('deckContactModal');
  const contactCloseBtn = document.getElementById('contactCloseBtn');
  const contactModalOverlay = document.getElementById('contactModalOverlay');
  const copyEmailRow = document.getElementById('copyEmailRow');
  const copyEmailTag = document.getElementById('copyEmailTag');

  // Keyboard Shortcuts Modal DOM Elements
  const shortcutsBtn = document.getElementById('shortcutsBtn');
  const shortcutsModal = document.getElementById('deckShortcutsModal');
  const shortcutsCloseBtn = document.getElementById('shortcutsCloseBtn');
  const shortcutsModalOverlay = document.getElementById('shortcutsModalOverlay');

  // Smart Hover-Pause Engine State
  let isHoverPaused = false;
  let hoverPauseRemaining = SLIDE_DURATION;

  // 15 Presentation Slides Metadata for Figma/Keynote Filmstrip Tray
  const filmstripData = [
    { num: 1, title: 'MY PORT-FOLIO 2026', cat: 'TITLE', thumb: './assets/profile/pauv_presenter_cutout.png' },
    { num: 2, title: 'About Pauv Soneasa', cat: 'BIO & LEADERSHIP', thumb: './assets/profile/pauv_standing_bw.png' },
    { num: 3, title: 'Commercial Campaigns', cat: 'CAMPAIGN', thumb: './assets/images/my-artwork/thumbs/cheese_corn_portrait_01.jpg' },
    { num: 4, title: 'Product Photography', cat: 'PHOTO & RETOUCH', thumb: './assets/images/my-artwork/thumbs/cheese_corn_landscape_01.jpg' },
    { num: 5, title: 'Competitions & Honors', cat: 'AWARDS & STEM', thumb: './assets/images/competitions/thumbs/robotic_img_7829.jpg' },
    { num: 6, title: 'Video Production & Lab', cat: 'CINEMA & EDIT', thumb: './assets/video/classroom_management_thumb.jpg' },
    { num: 7, title: 'Creative Artworks', cat: 'KEY VISUALS', thumb: './assets/images/my-artwork/thumbs/green_matcha_story.jpg' },
    { num: 8, title: 'Social Feeds & Grid', cat: 'SOCIAL DESIGN', thumb: './assets/images/my-artwork/thumbs/beverage_social_01.jpg' },
    { num: 9, title: 'Stories & Motion Ads', cat: 'VERTICAL MEDIA', thumb: './assets/images/my-artwork/thumbs/matcha_promo_banner.jpg' },
    { num: 10, title: 'Identity & Typography', cat: 'BRANDING', thumb: './assets/images/my-artwork/thumbs/logo_frame_station.jpg' },
    { num: 11, title: 'Brochure & Editorial', cat: 'WORLDSKILLS', thumb: './assets/images/worldskills/thumbs/wsa_m2_editorial_spread.jpg' },
    { num: 12, title: 'Vector Illustration', cat: 'CHARACTER ART', thumb: './assets/images/my-artwork/thumbs/vector_character_01.jpg' },
    { num: 13, title: 'Packaging Design', cat: 'WORLDSKILLS', thumb: './assets/images/worldskills/thumbs/wsa_m3_box_mockup.jpg' },
    { num: 14, title: 'Applied Brand Mockups', cat: 'WORLDSKILLS', thumb: './assets/images/worldskills/thumbs/wsa_m3_applied_mockup.jpg' },
    { num: 15, title: "Let's Connect & Hire", cat: 'COLLABORATION', thumb: './assets/profile/pauv_presenter_cutout.png' }
  ];

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
    const unlockEvents = ['click', 'pointerdown', 'mousedown', 'keydown', 'touchstart', 'wheel', 'scroll'];
    function onFirstUserGesture() {
      interactionUnlocked = true;
      unlockEvents.forEach(evt => {
        window.removeEventListener(evt, onFirstUserGesture);
        document.removeEventListener(evt, onFirstUserGesture);
      });
      if (musicDesiredState && bgAudio && bgAudio.paused) {
        playBgMusic();
      }
    }
    unlockEvents.forEach(evt => {
      window.addEventListener(evt, onFirstUserGesture, { once: true, passive: true });
      document.addEventListener(evt, onFirstUserGesture, { once: true, passive: true });
    });
  }

  if (bgAudio) {
    bgAudio.volume = TARGET_VOLUME;
    bgAudio.loop = true;
    // Explicit ended fallback to guarantee continuous gapless looping on all browsers
    bgAudio.addEventListener('ended', () => {
      bgAudio.currentTime = 0;
      bgAudio.play().catch(() => {});
    });
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

    // Sync filmstrip items active highlighter
    filmstripItems.forEach((item, idx) => {
      const isActive = idx === index;
      item.classList.toggle('active', isActive);
      if (isActive && filmstripDrawer && filmstripDrawer.classList.contains('active')) {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  }

  // Jump to Slide by Index (Exact Slide-to-Screen Top Alignment)
  function jumpToSlide(idx) {
    if (idx < 0) idx = 0;
    if (idx >= totalSlides) idx = totalSlides - 1;
    const target = slides[idx];
    if (target) {
      playBeep(560 + (idx * 16), 'triangle', 0.08);

      // Exact pixel alignment to guarantee slide fills 100% of viewport without cutting
      const targetTop = target.offsetTop;
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });

      // Refresh entrance animations
      slides.forEach(s => s.classList.remove('is-visible'));
      target.classList.add('is-visible');
      currentSlideIndex = idx;
      updateNavigationState(idx);
    }
  }

  // Progress Bar Animation Loop
  function updateProgressLoop() {
    if (!isAutoplaying || isHoverPaused) return;
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

  // Smart Hover-Pause Engine
  function setHoverPause(paused) {
    if (!isAutoplaying) return;
    if (paused && !isHoverPaused) {
      isHoverPaused = true;
      const elapsed = performance.now() - slideStartTime;
      hoverPauseRemaining = Math.max(600, SLIDE_DURATION - elapsed);
      cancelAnimationFrame(progressRaf);
      showToast('PAUSED • HOVERING', 1200);
    } else if (!paused && isHoverPaused) {
      isHoverPaused = false;
      slideStartTime = performance.now() - (SLIDE_DURATION - hoverPauseRemaining);
      cancelAnimationFrame(progressRaf);
      progressRaf = requestAnimationFrame(updateProgressLoop);
    }
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

    // Autoplay background music together with deck playback
    if (musicDesiredState && bgAudio && bgAudio.paused) {
      playBgMusic();
    }

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

  // True Slide-by-Slide Wheel Navigation (Prevents in-between half-slide states)
  let isWheelThrottled = false;
  window.addEventListener('wheel', (e) => {
    // If user is inside an open lightbox, contact modal, shortcuts modal, or filmstrip, permit local scrolling
    if ((lightbox && lightbox.classList.contains('active')) ||
        (contactModal && contactModal.classList.contains('active')) ||
        (shortcutsModal && shortcutsModal.classList.contains('active')) ||
        (filmstripDrawer && filmstripDrawer.classList.contains('active'))) {
      return;
    }

    e.preventDefault(); // Stop arbitrary pixel drift between slides
    handleUserManualScroll();

    if (isWheelThrottled) return;

    if (Math.abs(e.deltaY) > 8 || Math.abs(e.deltaX) > 8) {
      isWheelThrottled = true;
      if (e.deltaY > 0 || e.deltaX > 0) {
        jumpToSlide(currentSlideIndex + 1);
      } else {
        jumpToSlide(currentSlideIndex - 1);
      }
      setTimeout(() => {
        isWheelThrottled = false;
      }, 520); // 520ms throttle: 1 deliberate wheel motion = exactly 1 full slide transition
    }
  }, { passive: false });

  // Auto-Dimming Top HUD on Idle (Ensures 100% Immersive Full-Screen Deck View)
  const deckTopSwitcher = document.getElementById('deckTopSwitcher');
  let navDimTimer = null;
  function resetNavDimming() {
    if (!deckTopSwitcher) return;
    deckTopSwitcher.classList.remove('is-dimmed');
    clearTimeout(navDimTimer);
    navDimTimer = setTimeout(() => {
      const hasOpenModal = (lightbox && lightbox.classList.contains('active')) ||
                           (contactModal && contactModal.classList.contains('active')) ||
                           (shortcutsModal && shortcutsModal.classList.contains('active')) ||
                           (filmstripDrawer && filmstripDrawer.classList.contains('active'));
      if (!hasOpenModal) {
        deckTopSwitcher.classList.add('is-dimmed');
      }
    }, 3200);
  }

  ['mousemove', 'mousedown', 'keydown', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, resetNavDimming, { passive: true });
  });
  resetNavDimming();

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
    // Escape closes any open dialog, modal, or drawer
    if (e.key === 'Escape') {
      if (lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
        return;
      }
      if (contactModal && contactModal.classList.contains('active')) {
        closeContactModal();
        return;
      }
      if (shortcutsModal && shortcutsModal.classList.contains('active')) {
        toggleShortcutsModal(false);
        return;
      }
      if (filmstripDrawer && filmstripDrawer.classList.contains('active')) {
        toggleFilmstrip(false);
        return;
      }
    }

    // Toggle Filmstrip Overview (O key)
    if (e.key === 'o' || e.key === 'O') {
      e.preventDefault();
      toggleFilmstrip();
      return;
    }

    // Toggle Shortcuts Helper Dialog (? key or H key)
    if (e.key === '?' || (e.shiftKey && e.key === '/') || e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      toggleShortcutsModal();
      return;
    }

    // If any modal is actively displayed, ignore slide stepping keys
    if ((lightbox && lightbox.classList.contains('active')) ||
        (contactModal && contactModal.classList.contains('active')) ||
        (shortcutsModal && shortcutsModal.classList.contains('active'))) {
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
      const projectId = card.getAttribute('data-project') || card.getAttribute('data-id');
      const imgEl = card.querySelector('img');
      const captionEl = card.querySelector('.card-caption');
      const fullImg = card.getAttribute('data-full-img') || (imgEl ? imgEl.src : '');
      const cat = card.getAttribute('data-cat') || 'COMPETITION & EVENTS';
      const client = card.getAttribute('data-client') || 'Pauv Soneasa Portfolio';
      const desc = card.getAttribute('data-desc') || '';

      let project = null;
      const projectsList = (typeof portfolioProjects !== 'undefined') ? portfolioProjects : (window.portfolioProjects || null);
      if (projectId && projectsList) {
        project = projectsList.find(p => String(p.id) === String(projectId));
      }
      openLightbox(project, fullImg, captionEl ? captionEl.textContent : '', cat, client, desc);
    });
  });

  function openLightbox(project, fallbackImg, fallbackTitle, fallbackCat, fallbackClient, fallbackDesc) {
    if (!lightbox) return;
    pauseAutoplay('PAUSED FOR INSPECTION');
    playBeep(680, 'sine', 0.1);

    const mediaWrap = lightbox.querySelector('.lightbox-media-wrap');

    if (project) {
      if (project.video && mediaWrap) {
        mediaWrap.innerHTML = `
          <video controls autoplay playsinline class="lightbox-video" poster="${project.image || project.thumb}" style="max-width:100%; max-height:75vh; border-radius:12px; box-shadow:0 20px 50px rgba(0,0,0,0.6); outline:none;">
            <source src="${project.video}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;
      } else if (mediaWrap) {
        mediaWrap.innerHTML = `<img src="${project.image || project.thumb || fallbackImg}" alt="Artwork Preview" id="lightboxMediaImg">`;
      }
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
      if (mediaWrap) {
        mediaWrap.innerHTML = `<img src="${fallbackImg}" alt="Artwork Preview" id="lightboxMediaImg">`;
      }
      if (lightboxCategory) lightboxCategory.textContent = fallbackCat ? fallbackCat.toUpperCase() : 'GRAPHIC DESIGN';
      if (lightboxClient) lightboxClient.textContent = fallbackClient || 'Pauv Soneasa Portfolio';
      if (lightboxTitle) lightboxTitle.textContent = fallbackTitle || 'Creative Showcase';
      if (lightboxDesc) lightboxDesc.textContent = fallbackDesc || 'High-resolution commercial creative asset crafted by Sok Sereyisal & Pauv Soneasa for brand campaigns, social media, and digital print.';
      if (lightboxPalette) lightboxPalette.innerHTML = '<span class="lightbox-swatch" style="background-color: #04098a;"></span><span class="lightbox-swatch" style="background-color: #38bdf8;"></span><span class="lightbox-swatch" style="background-color: #ffffff;"></span>';
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    playBeep(450, 'sine', 0.08);
    const v = lightbox.querySelector('video');
    if (v) {
      try { v.pause(); } catch(e) {}
    }
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    scheduleInactivityResume();
  }

  window.openProjectLightboxById = function(id) {
    const projectsList = (typeof portfolioProjects !== 'undefined') ? portfolioProjects : (window.portfolioProjects || null);
    if (!projectsList) return;
    const project = projectsList.find(p => String(p.id) === String(id));
    if (project) {
      openLightbox(project);
    }
  };

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  // ===================================================================
  // 1. FIGMA / APPLE KEYNOTE 15-SLIDE FILMSTRIP TRAY ENGINE
  // ===================================================================
  function initFilmstrip() {
    if (!filmstripTrack) return;
    filmstripTrack.innerHTML = '';
    filmstripItems = [];

    filmstripData.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = `filmstrip-item ${idx === currentSlideIndex ? 'active' : ''}`;
      el.setAttribute('data-index', idx);
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', `Slide ${item.num}: ${item.title}`);
      el.innerHTML = `
        <span class="filmstrip-item-num">${String(item.num).padStart(2, '0')}</span>
        <img src="${item.thumb}" alt="${item.title}" loading="lazy">
        <span class="filmstrip-item-title">${item.title}</span>
      `;

      el.addEventListener('click', () => {
        handleUserManualScroll();
        jumpToSlide(idx);
        playBeep(640, 'triangle', 0.08);
      });

      // Keyboard enter/space navigation inside filmstrip
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleUserManualScroll();
          jumpToSlide(idx);
          playBeep(640, 'triangle', 0.08);
        }
      });

      filmstripTrack.appendChild(el);
      filmstripItems.push(el);
    });
  }

  function toggleFilmstrip(open) {
    if (!filmstripDrawer) return;
    const shouldOpen = open !== undefined ? open : !filmstripDrawer.classList.contains('active');
    filmstripDrawer.classList.toggle('active', shouldOpen);
    filmstripDrawer.setAttribute('aria-hidden', (!shouldOpen).toString());
    if (filmstripBtn) {
      filmstripBtn.classList.toggle('active', shouldOpen);
    }
    if (shouldOpen) {
      playBeep(780, 'sine', 0.08);
      setTimeout(() => {
        const activeItem = filmstripItems[currentSlideIndex];
        if (activeItem) {
          activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 50);
    } else {
      playBeep(480, 'sine', 0.06);
    }
  }

  if (filmstripBtn) {
    filmstripBtn.addEventListener('click', () => toggleFilmstrip());
  }
  if (filmstripCloseBtn) {
    filmstripCloseBtn.addEventListener('click', () => toggleFilmstrip(false));
  }

  // ===================================================================
  // 2. QUICK GET IN TOUCH / HIRE MODAL ENGINE
  // ===================================================================
  function openContactModal() {
    if (!contactModal) return;
    pauseAutoplay('PAUSED FOR CONTACT');
    contactModal.classList.add('active');
    contactModal.setAttribute('aria-hidden', 'false');
    playBeep(740, 'sine', 0.08);
  }

  function closeContactModal() {
    if (!contactModal) return;
    contactModal.classList.remove('active');
    contactModal.setAttribute('aria-hidden', 'true');
    playBeep(460, 'sine', 0.06);
    scheduleInactivityResume();
  }

  if (quickContactBtn) quickContactBtn.addEventListener('click', openContactModal);
  if (contactCloseBtn) contactCloseBtn.addEventListener('click', closeContactModal);
  if (contactModalOverlay) contactModalOverlay.addEventListener('click', closeContactModal);

  if (copyEmailRow && copyEmailTag) {
    copyEmailRow.addEventListener('click', () => {
      const email = 'neasa232006@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        playBeep(960, 'triangle', 0.1);
        copyEmailTag.textContent = 'COPIED! ✓';
        copyEmailTag.style.background = '#22c55e';
        copyEmailTag.style.color = '#ffffff';
        showToast('Email copied: ' + email);
        setTimeout(() => {
          copyEmailTag.textContent = 'COPY';
          copyEmailTag.style.background = '';
          copyEmailTag.style.color = '';
        }, 2200);
      }).catch(() => {
        showToast('Email: neasa232006@gmail.com');
      });
    });
  }

  // ===================================================================
  // 3. KEYBOARD SHORTCUTS HELPER MODAL
  // ===================================================================
  function toggleShortcutsModal(open) {
    if (!shortcutsModal) return;
    const shouldOpen = open !== undefined ? open : !shortcutsModal.classList.contains('active');
    shortcutsModal.classList.toggle('active', shouldOpen);
    shortcutsModal.setAttribute('aria-hidden', (!shouldOpen).toString());
    if (shouldOpen) {
      pauseAutoplay('PAUSED • SHORTCUTS');
      playBeep(720, 'sine', 0.08);
    } else {
      playBeep(460, 'sine', 0.06);
      scheduleInactivityResume();
    }
  }

  if (shortcutsBtn) shortcutsBtn.addEventListener('click', () => toggleShortcutsModal());
  if (shortcutsCloseBtn) shortcutsCloseBtn.addEventListener('click', () => toggleShortcutsModal(false));
  if (shortcutsModalOverlay) shortcutsModalOverlay.addEventListener('click', () => toggleShortcutsModal(false));

  // ===================================================================
  // 4. 3D CURSOR PARALLAX & SPECULAR SHEEN ENGINE
  // ===================================================================
  function initCardParallaxAndSheen() {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    const cards = document.querySelectorAll('.card-frame');
    cards.forEach(card => {
      if (!card.querySelector('.card-sheen')) {
        const sheen = document.createElement('div');
        sheen.className = 'card-sheen';
        card.appendChild(sheen);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 4.5;
        const rotateX = -((y - centerY) / centerY) * 4.5;

        const pctX = ((x / rect.width) * 100).toFixed(1);
        const pctY = ((y / rect.height) * 100).toFixed(1);

        card.style.transform = `perspective(700px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
        card.style.setProperty('--mouse-x', `${pctX}%`);
        card.style.setProperty('--mouse-y', `${pctY}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ===================================================================
  // 5. SMART HOVER-PAUSE LISTENER ATTACHMENT
  // ===================================================================
  function initSmartHoverPause() {
    const hoverTargets = document.querySelectorAll('.card-frame, .video-card-frame, .v-white-pane, .about-text-wrap, .wsa-editorial-card');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => setHoverPause(true));
      target.addEventListener('mouseleave', () => setHoverPause(false));
    });
  }

  // Initialize all interactive presentation features
  initFilmstrip();
  initCardParallaxAndSheen();
  initSmartHoverPause();

  // Initial State: Start autoplay immediately by default!
  jumpToSlide(0);
  startAutoplay('AUTOPLAY ON');

});
