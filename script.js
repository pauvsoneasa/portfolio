/* ===================================================================
   PAUV SONEASA &mdash; PORTFOLIO ENGINE v4
   Exact 1:1 Match of Rin Layheang's Showcase Template (@heangbeksloy)
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- 1. Parametric Harmonic Sinusoidal Contours Generator (Rin Layheang Style) ----
  function initHeroContours() {
    const svg = document.getElementById('heroContours');
    if (!svg) return;

    // Harmonic wave centers
    const centers = [
      [260, 250, 1.0],
      [1180, 190, 0.85],
      [900, 760, 1.15]
    ];

    let svgPaths = '';
    centers.forEach(([cx, cy, scale], i) => {
      for (let a = 1; a <= 7; a++) {
        const rBase = a * 46 * scale;
        let d = '';
        for (let t = 0; t <= 64; t++) {
          const angle = (t / 64) * Math.PI * 2;
          const r = rBase * (1 + 0.16 * Math.sin(angle * 3 + i * 2 + a * 0.35) + 0.08 * Math.cos(angle * 5 - i));
          const x = (cx + Math.cos(angle) * r * 1.25).toFixed(1);
          const y = (cy + Math.sin(angle) * r).toFixed(1);
          d += `${t ? 'L' : 'M'}${x} ${y}`;
        }
        svgPaths += `<path d="${d}Z" />`;
      }
    });

    svg.innerHTML = svgPaths;
  }
  initHeroContours();

  // ---- 2. Dual-Layer Hero Portrait Toggle (3D Chrome Sculpture & Real Photo) ----
  const heroSwitchBtn = document.getElementById('heroSwitchBtn');
  const heroPortrait = document.getElementById('heroPortrait');
  const heroSwitchLabel = document.getElementById('heroSwitchLabel');
  const activeLayerTag = document.getElementById('activeLayerTag');

  if (heroSwitchBtn && heroPortrait) {
    heroSwitchBtn.addEventListener('click', () => {
      const current = heroPortrait.getAttribute('data-layer') || 'photo';
      const next = current === 'photo' ? 'alt' : 'photo';
      heroPortrait.setAttribute('data-layer', next);
      
      if (next === 'alt') {
        heroSwitchLabel.textContent = 'SWITCH TO REAL PHOTO';
        if (activeLayerTag) activeLayerTag.textContent = '3D CHROME SCULPTURE';
        playUiSound(840, 'triangle', 0.12);
        showToast('Viewing 3D Futuristic Chrome Avatar');
      } else {
        heroSwitchLabel.textContent = 'SWITCH TO 3D CHROME';
        if (activeLayerTag) activeLayerTag.textContent = 'PORTRAIT PHOTO';
        playUiSound(640, 'triangle', 0.1);
        showToast('Viewing Real Portrait Photo');
      }
    });
  }

  // ---- 3. Custom Magnetic Cursor ----
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
    let rx = 0, ry = 0;
    window.addEventListener('mousemove', e => {
      cursorDot.style.left  = e.clientX + 'px';
      cursorDot.style.top   = e.clientY + 'px';
      rx += (e.clientX - rx) * 0.18;
      ry += (e.clientY - ry) * 0.18;
    });

    function animateCursor() {
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .project-card, [role=button], .filter-btn').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
    });
  }

  // Global UI State
  let currentCategory = 'all';
  let searchQuery = '';
  let activeLightboxIndex = 0;
  let isZoomed = false;
  let soundEnabled = true;

  // Web Audio API Synthesizer
  let audioCtx = null;
  function playUiSound(freq = 600, type = 'sine', duration = 0.08) {
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
      // Audio autoplay restrictions
    }
  }



  // ---- 4. Floating Pill Navbar Interactions ----
  const navbar = document.getElementById('navbar');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navCenterMenu = document.querySelector('.nav-center-menu');
  const backToTopBtn = document.getElementById('backToTopBtn');

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 60) {
      navbar.classList.add('is-scrolled');
      backToTopBtn.classList.add('visible');

      if (currentScrollY > lastScrollY + 10 && currentScrollY > 240) {
        navbar.classList.add('is-hidden');
      } else if (currentScrollY < lastScrollY - 6) {
        navbar.classList.remove('is-hidden');
      }
    } else {
      navbar.classList.remove('is-scrolled', 'is-hidden');
      backToTopBtn.classList.remove('visible');
    }

    lastScrollY = currentScrollY;
    updateActiveNavLink();
  }, { passive: true });

  if (mobileNavToggle && navCenterMenu) {
    mobileNavToggle.addEventListener('click', () => {
      playUiSound(540, 'triangle', 0.08);
      navCenterMenu.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        playUiSound(600, 'sine', 0.05);
        navCenterMenu.classList.remove('open');
      });
    });
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section, header');
    let currentId = 'top';
    sections.forEach(section => {
      const top = section.offsetTop - 140;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.getAttribute('id') || 'top';
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  backToTopBtn.addEventListener('click', () => {
    playUiSound(880, 'sine', 0.12);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- 5. Theme Switcher (Defaulting to Editorial Light Paper as seen in Video) ----
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconDark = document.getElementById('themeIconDark');
  const themeIconLight = document.getElementById('themeIconLight');

  // Default to light (Rin Layheang signature) unless explicitly saved
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      playUiSound(720, 'sine', 0.1);
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Obsidian' : 'Editorial Light'} theme`);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      themeIconDark.style.display = 'block';
      themeIconLight.style.display = 'none';
    } else {
      themeIconDark.style.display = 'none';
      themeIconLight.style.display = 'block';
    }
  }

  // ---- 6. Interactive Editorial Slide Deck Engine (Ryan Saputra Style) ----
  const editorialSlides = [
    {
      category: "Campaigns & Packaging",
      title: "Cheese Corn Cambodia Commercial Campaign",
      client: "Cheese Corn Cambodia & Salford & Co.",
      year: "Year 2024 – 2026",
      desc: "High-energy commercial snack packaging and promotional campaign featuring bold typography, savory cheese corn product staging, and vibrant color psychology.",
      bullets: [
        "Portrait Campaign Posters & Billboards",
        "Snack Packaging Headers & POS Badges",
        "Retail Storefront & Social Feed Creatives"
      ],
      img1: "assets/images/my-artwork/thumbs/cheese_corn_portrait_01.jpg",
      caption1: "Portrait Campaign",
      img2: "assets/images/my-artwork/thumbs/green_matcha_story.jpg",
      caption2: "Matcha Just Dropped",
      projectId: 1
    },
    {
      category: "Video & Educational Media",
      title: "Happy Chandara School Educational Video Production",
      client: "Happy Chandara School (Toutes à l'école)",
      year: "Year 2025 – 2026",
      desc: "Educational video documentary filmed on location at Happy Chandara School with ICT supervisor Mr. Chhorn Ieng on classroom management methodologies, wireless lavalier audio recording, and bilingual Khmer subtitles.",
      bullets: [
        "On-Location Classroom Documentary",
        "Khmer Closed Captioning & Typographic Timing",
        "Wireless Audio Mastering & Broadcast Color Grading"
      ],
      img1: "assets/video/classroom_management_thumb.jpg",
      caption1: "Classroom Video",
      img2: "assets/images/my-artwork/thumbs/certificate_excellence.jpg",
      caption2: "Summer Camp 2026 Certificate",
      projectId: 3
    },
    {
      category: "Brand Identity & Logos",
      title: "Design Logo & Brand System",
      client: "Frame Station Creative Studio & Organic Cosmetics",
      year: "Year 2024 – 2026",
      desc: "Precision geometric logo systems, botanical identity marks, negative space construction, and complete corporate stationery standards.",
      bullets: [
        "Vector Master Logomarks & Emblems",
        "Geometric Construction & Grid Systems",
        "Corporate Stationery Brand Guidelines"
      ],
      img1: "assets/images/my-artwork/thumbs/logo_frame_station.jpg",
      caption1: "Geometric Mark",
      img2: "assets/images/my-artwork/thumbs/logo_organic_cosmetics.jpg",
      caption2: "Botanical Logo",
      projectId: 10
    },
    {
      category: "Institutional Signage & Prepress",
      title: "Institutional Signage & Prepress",
      client: "La Fondation Dassault Systèmes, L'Oréal Foundation & Toutes à l'école",
      year: "Year 2024 – 2026",
      desc: "Architectural Fablab dedication plaques, L'Oréal Foundation donor acknowledgements, and large-format Marie Stopes debate championship stage banners.",
      bullets: [
        "Fablab Architectural Plaque (30x20cm)",
        "L'Oréal Foundation Donor Recognition",
        "Public Debate Championship Stage Visual"
      ],
      img1: "assets/images/my-artwork/thumbs/fablab_stem_poster.jpg",
      caption1: "Fablab Plaque",
      img2: "assets/images/my-artwork/thumbs/debate_competition_poster.jpg",
      caption2: "Debate Championship",
      projectId: 15
    },
    {
      category: "3D Coffee Staging & Real Estate",
      title: "3D Product Staging & Real Estate Collateral",
      client: "Café Storia & Fauget Real Estate",
      year: "Year 2024 – 2026",
      desc: "3D takeaway coffee cup product staging against scenic mountain landscapes, morning breakfast promotion banners, and modern architectural property flyers.",
      bullets: [
        "Café Storia 3D Takeaway Cup Staging",
        "Artisan Coffee Sunrise Promotion",
        "Fauget Real Estate Sales Flyer"
      ],
      img1: "assets/images/my-artwork/thumbs/coffee_milk_poster.jpg",
      caption1: "Café Storia 3D Cups",
      img2: "assets/images/my-artwork/thumbs/culinary_festival_poster.jpg",
      caption2: "Real Estate Flyer",
      projectId: 5
    },
    {
      category: "WorldSkills Manila 2025",
      title: "WorldSkills Manila 2025",
      client: "WorldSkills ASEAN Manila 2025 (Competition Test Package)",
      year: "Year 2025 – 2026",
      desc: "Official Graphic Design Technology competition test package execution: Module 1 Corporate Branding & A1 Poster, Module 2 Multi-page Editorial Layout, and Module 3 Structural 3D Packaging & POS Display.",
      bullets: [
        "Module 1: Corporate Vector Logo & Dynamic A1 Event Poster",
        "Module 2: Multi-Page Editorial Spread & Baseline Grid Layout",
        "Module 3: Structural Dieline Blueprints & 3D Packaging Box"
      ],
      img1: "assets/images/worldskills/thumbs/wsa_m1_poster_a1.jpg",
      caption1: "WorldSkills A1 Poster",
      img2: "assets/images/worldskills/thumbs/wsa_m3_box_mockup.jpg",
      caption2: "3D Packaging Box",
      projectId: 21
    }
  ];

  let currentDeckIndex = 0;
  const deckCounter = document.getElementById('deckCounter');
  const deckPills = document.querySelectorAll('.deck-pill');
  const deckTitle = document.getElementById('deckTitle');
  const deckYear = document.getElementById('deckYear');
  const deckClient = document.getElementById('deckClient');
  const deckDesc = document.getElementById('deckDesc');
  const deckBullets = document.getElementById('deckBullets');
  const deckImg1 = document.getElementById('deckImg1');
  const deckImg2 = document.getElementById('deckImg2');
  const deckCaption1 = document.getElementById('deckCaption1');
  const deckCaption2 = document.getElementById('deckCaption2');
  const deckPrevBtn = document.getElementById('deckPrevBtn');
  const deckNextBtn = document.getElementById('deckNextBtn');
  const deckInspectCurrentBtn = document.getElementById('deckInspectCurrentBtn');

  function renderDeckSlide(index) {
    if (!deckTitle) return;
    currentDeckIndex = (index + editorialSlides.length) % editorialSlides.length;
    const slide = editorialSlides[currentDeckIndex];

    // Update Counter
    if (deckCounter) {
      deckCounter.textContent = `SLIDE 0${currentDeckIndex + 1} / 0${editorialSlides.length}`;
    }

    // Update Pills
    deckPills.forEach((pill, idx) => {
      pill.classList.toggle('active', idx === currentDeckIndex);
    });

    // Animate content smoothly
    const infoPanel = document.querySelector('.deck-info-panel');
    const mediaPanel = document.getElementById('deckMediaPanel');
    if (infoPanel) {
      infoPanel.style.opacity = '0.3';
      infoPanel.style.transform = 'translateY(6px)';
      infoPanel.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
    }
    if (mediaPanel) {
      mediaPanel.style.opacity = '0.6';
      mediaPanel.style.transition = 'opacity 0.22s ease';
    }

    setTimeout(() => {
      if (deckTitle) deckTitle.textContent = slide.title;
      if (deckYear) deckYear.textContent = slide.year;
      if (deckClient) deckClient.textContent = slide.client;
      if (deckDesc) deckDesc.textContent = slide.desc;
      
      if (deckBullets) {
        deckBullets.innerHTML = slide.bullets.map(b => `<li>${b}</li>`).join('');
      }

      if (deckImg1) {
        deckImg1.src = slide.img1;
        deckImg1.alt = slide.caption1;
      }
      if (deckCaption1) deckCaption1.textContent = slide.caption1;

      if (deckImg2) {
        deckImg2.src = slide.img2;
        deckImg2.alt = slide.caption2;
      }
      if (deckCaption2) deckCaption2.textContent = slide.caption2;

      if (infoPanel) {
        infoPanel.style.opacity = '1';
        infoPanel.style.transform = 'translateY(0)';
      }
      if (mediaPanel) {
        mediaPanel.style.opacity = '1';
      }
    }, 140);
  }

  // Pill clicks
  deckPills.forEach((pill, idx) => {
    pill.addEventListener('click', () => {
      playUiSound(620, 'triangle', 0.08);
      renderDeckSlide(idx);
    });
  });

  // Prev / Next arrow buttons
  if (deckPrevBtn) {
    deckPrevBtn.addEventListener('click', () => {
      playUiSound(540, 'triangle', 0.08);
      renderDeckSlide(currentDeckIndex - 1);
    });
  }

  if (deckNextBtn) {
    deckNextBtn.addEventListener('click', () => {
      playUiSound(680, 'triangle', 0.08);
      renderDeckSlide(currentDeckIndex + 1);
    });
  }

  // Inspect button opens Lightbox modal for this project
  if (deckInspectCurrentBtn) {
    deckInspectCurrentBtn.addEventListener('click', () => {
      playUiSound(720, 'sine', 0.1);
      const slide = editorialSlides[currentDeckIndex];
      const targetIndex = portfolioProjects.findIndex(p => p.id === slide.projectId);
      if (targetIndex !== -1) {
        openLightbox(targetIndex);
      }
    });
  }

  // Framed Polaroid cards click opens Lightbox modal
  document.querySelectorAll('.framed-art-card').forEach(card => {
    card.addEventListener('click', () => {
      playUiSound(750, 'sine', 0.1);
      const slide = editorialSlides[currentDeckIndex];
      const targetIndex = portfolioProjects.findIndex(p => p.id === slide.projectId);
      if (targetIndex !== -1) {
        openLightbox(targetIndex);
      }
    });
  });

  // ---- 7. Render Filterable 2-Column Projects Grid ----
  const portfolioGrid = document.getElementById('portfolioGrid');
  const emptyGalleryState = document.getElementById('emptyGalleryState');
  const filterPillsRow = document.getElementById('filterPillsRow');
  const projectSearchInput = document.getElementById('projectSearchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');

  function renderPortfolio() {
    if (!portfolioGrid) return;
    portfolioGrid.innerHTML = '';

    const filtered = portfolioProjects.filter(project => {
      const matchesCategory = (currentCategory === 'all' || project.category === currentCategory);
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch = 
        project.title.toLowerCase().includes(q) ||
        project.client.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        project.tools.some(t => t.toLowerCase().includes(q)) ||
        project.tags.some(tag => tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      if (emptyGalleryState) emptyGalleryState.classList.add('visible');
    } else {
      if (emptyGalleryState) emptyGalleryState.classList.remove('visible');
    }

    filtered.forEach((project, idx) => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.setAttribute('data-id', project.id);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View ${project.title}`);

      // Swatches HTML
      const swatchesHtml = (project.palette || ['#04098a', '#38bdf8', '#ffffff', '#0f172a'])
        .map(color => `<span class="palette-swatch" data-hex="${color}" style="background-color: ${color};" title="Click to copy ${color}"></span>`)
        .join('');

      const isVideo = !!project.video;
      const mediaBadge = isVideo
        ? `<div style="position:absolute; top:12px; left:12px; background:rgba(4,9,138,0.9); color:#fff; font-family:var(--mono); font-size:10px; font-weight:700; padding:4px 8px; border-radius:4px; display:flex; align-items:center; gap:5px; z-index:3; backdrop-filter:blur(4px); box-shadow:0 2px 8px rgba(0,0,0,0.3);"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg> VIDEO</div>`
        : '';

      card.innerHTML = `
        <div class="card-media-wrapper">
          <img src="${project.thumb}" alt="${project.title}" loading="lazy">
          ${mediaBadge}
          <div class="card-overlay-hover">
            <span class="inspect-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              <span>${isVideo ? 'WATCH DOCUMENTARY' : 'INSPECT ASSETS'}</span>
            </span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-top-meta">
            <div class="card-client-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>${project.client}</span>
            </div>
            <div class="card-palette-strip" title="Brand Color Palette">
              ${swatchesHtml}
            </div>
          </div>
          <h3 class="card-project-title">${project.title}</h3>
          <p class="card-project-desc">${project.summary}</p>
          <div class="card-bottom-actions">
            <div class="card-tags-list">
              ${project.tags.slice(0, 2).map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
            </div>
            <span class="card-action-btn">
              <span>DETAILS</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </span>
          </div>
        </div>
      `;

      // Swatch click to copy hex
      card.querySelectorAll('.palette-swatch').forEach(swatch => {
        swatch.addEventListener('click', (e) => {
          e.stopPropagation();
          const hex = swatch.getAttribute('data-hex');
          navigator.clipboard.writeText(hex).then(() => {
            playUiSound(920, 'sine', 0.08);
            showToast(`Copied color swatch ${hex}`);
          });
        });
      });

      // Card click opens Lightbox
      card.addEventListener('click', () => {
        playUiSound(480, 'sine', 0.1);
        const originalIndex = portfolioProjects.findIndex(p => p.id === project.id);
        openLightbox(originalIndex);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const originalIndex = portfolioProjects.findIndex(p => p.id === project.id);
          openLightbox(originalIndex);
        }
      });

      portfolioGrid.appendChild(card);
    });
  }

  // Category Filtering
  if (filterPillsRow) {
    filterPillsRow.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playUiSound(650, 'sine', 0.06);
        filterPillsRow.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        renderPortfolio();
      });
    });
  }

  // Search Input
  if (projectSearchInput) {
    projectSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.classList.toggle('visible', searchQuery.length > 0);
      }
      renderPortfolio();
    });

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        projectSearchInput.value = '';
        searchQuery = '';
        searchClearBtn.classList.remove('visible');
        renderPortfolio();
        projectSearchInput.focus();
      });
    }
  }

  renderPortfolio();

  // ---- 7. Lightbox Modal Engine ----
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxZoomBtn = document.getElementById('lightboxZoomBtn');
  const lightboxActiveImg = document.getElementById('lightboxActiveImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxProjectTitle = document.getElementById('lightboxProjectTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClient = document.getElementById('lightboxClient');
  const lightboxRole = document.getElementById('lightboxRole');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxDate = document.getElementById('lightboxDate');
  const lightboxPalette = document.getElementById('lightboxPalette');
  const lightboxTools = document.getElementById('lightboxTools');

  let lightboxMode = 'project'; // 'project' | 'competition'
  let activeCompetitionIndex = 0;

  const competitionGalleryItems = [
    {
      img: './assets/images/worldskills/web/wsa_m1_poster_a1.jpg',
      title: 'WorldSkills ASEAN Manila 2025 — Module 1 A1 Event Poster',
      desc: 'Official Graphic Design Technology competition test package: High-impact A1 promotional event poster featuring corporate typography, dynamic vector geometry, and calibrated Pantone-to-CMYK prepress output under strict timed trade standards.',
      category: 'WORLDSKILLS ASEAN 2025',
      date: '2025 - 2026',
      client: 'WorldSkills ASEAN Manila 2025 (Test Package)',
      tools: ['Adobe Illustrator', 'Adobe InDesign', 'Pantone CMYK Prepress']
    },
    {
      img: './assets/images/worldskills/web/wsa_m3_box_mockup.jpg',
      title: 'WorldSkills ASEAN Manila 2025 — Module 3 3D Packaging Box',
      desc: 'Structural 3D folding carton box dieline engineering with gold foil accents, spot UV varnish separation plates, and photorealistic 3D presentation.',
      category: 'WORLDSKILLS PACKAGING',
      date: '2025 - 2026',
      client: 'WorldSkills ASEAN Manila 2025',
      tools: ['Structural Dielines', 'Adobe Photoshop 3D', 'Prepress Proofing']
    },
    {
      img: './assets/images/worldskills/web/wsa_m2_editorial_spread.jpg',
      title: 'WorldSkills ASEAN Manila 2025 — Module 2 Editorial Publication Spread',
      desc: '12-column baseline grid publication spread engineered with typographical hierarchy, baseline locking, photo framing, and CMYK offset separation.',
      category: 'WORLDSKILLS EDITORIAL',
      date: '2025 - 2026',
      client: 'WorldSkills ASEAN Manila 2025',
      tools: ['Adobe InDesign', 'Typography Grid', 'CMYK Offset Export']
    },
    {
      img: './assets/images/worldskills/web/wsa_m1_logo_display.jpg',
      title: 'WorldSkills ASEAN Manila 2025 — Module 1 Corporate Vector Logo',
      desc: 'Corporate vector identity mark with mathematical bezier curves, clear space safety rules, negative space balance, and monochrome variations.',
      category: 'WORLDSKILLS BRANDING',
      date: '2025 - 2026',
      client: 'WorldSkills ASEAN Manila 2025',
      tools: ['Adobe Illustrator', 'Vector Bezier Math', 'Identity Manual']
    },
    {
      img: './assets/images/worldskills/web/wsa_m3_pos_display.jpg',
      title: 'WorldSkills ASEAN Manila 2025 — Retail POS Counter Display',
      desc: 'Point-of-sale (POS) retail counter merchandising unit designed for promotional retail presentation and modular packaging staging.',
      category: 'WORLDSKILLS RETAIL POS',
      date: '2025 - 2026',
      client: 'WorldSkills ASEAN Manila 2025',
      tools: ['Retail POS Engineering', 'Photoshop Staging', 'Prepress Cutlines']
    },
    {
      img: './assets/images/competitions/web/robotic_img_7829.jpg',
      title: 'Robotics Competition — 2nd Place Honor',
      desc: 'National Robotics Competition Runner-Up: Autonomous maze traversal, real-time sensor feedback loops, and dual-motor chassis control engineered under high-stakes competitive arena constraints.',
      category: 'ROBOTICS & ENGINEERING',
      date: '2023 - 2024',
      client: 'National Robotics Challenge & IT Step Academy',
      tools: ['Arduino Microcontroller', 'IR Sensor Array', 'Motor Drivers', 'C++ Logic']
    },
    {
      img: './assets/images/competitions/web/robotic_img_20231216_185703_0159.jpg',
      title: 'Hardware & Sensor Calibration',
      desc: 'Bench testing and precision ultrasonic sensor tuning for obstacle avoidance and line-following agility during trial runs.',
      category: 'HARDWARE ENGINEERING',
      date: '2023 - 2024',
      client: 'Robotics Development Lab',
      tools: ['Sensor Calibration', 'Soldering', 'Chassis Tuning']
    },
    {
      img: './assets/images/competitions/web/robotic_img_7831.jpg',
      title: 'Robotics Arena Testing',
      desc: 'Testing autonomous mobile platform navigation dynamics across the tournament obstacle course.',
      category: 'ARENA TESTING',
      date: '2023 - 2024',
      client: 'Robotics Challenge Arena',
      tools: ['Rapid Prototyping', 'Telemetry Debugging']
    },
    {
      img: './assets/images/competitions/web/worldskill_cambodia_img_7830.jpg',
      title: 'WorldSkills Cambodia — Graphic Design Technology Finalist',
      desc: 'National WorldSkills championship in Graphic Design Technology. Multi-day rigorous trade challenge testing vector identity design, editorial layout, and print production packaging under strict international judging criteria.',
      category: 'WORLDSKILLS COMPETITION',
      date: '2024',
      client: 'Ministry of Labour & Vocational Training',
      tools: ['Adobe Illustrator', 'Adobe InDesign', 'Photoshop', 'Prepress Spec']
    },
    {
      img: './assets/images/competitions/web/worldskill_cambodia_img_7449.jpg',
      title: 'WorldSkills Stage & Competitor Arena',
      desc: 'Stage inspection and competitor workstation review with national jury evaluators and technical delegates.',
      category: 'WORLDSKILLS CAMBODIA',
      date: '2024',
      client: 'WorldSkills Secretariat',
      tools: ['Technical Workstation', 'Visual Design']
    },
    {
      img: './assets/images/competitions/web/worldskill_cambodia_img_7480.jpg',
      title: 'Live Workstation Design Sprint',
      desc: 'High-focus speed design challenge producing branding collaterals and multi-page layouts under timed benchmark modules.',
      category: 'WORLDSKILLS ARENA',
      date: '2024',
      client: 'WorldSkills Cambodia',
      tools: ['Vector Layout', 'Print Packaging']
    },
    {
      img: './assets/images/competitions/web/worldskill_cambodia_img_7481.jpg',
      title: 'Final Submission & Review',
      desc: 'Prepress color management inspection, CMYK calibration, and packaging mockup proofing ready for final jury assessment.',
      category: 'WORLDSKILLS ARENA',
      date: '2024',
      client: 'WorldSkills Cambodia',
      tools: ['CMYK Proofing', 'Production File Standards']
    },
    {
      img: './assets/images/competitions/web/public_speaking_img_5232.jpg',
      title: 'Public Speaking Competition Final',
      desc: 'Live stage keynote delivery and leadership presentation communicating creative vision, technological impact, and persuasive storytelling.',
      category: 'ORATORY & SPEECH',
      date: '2024',
      client: 'Public Speaking & Leadership Forum',
      tools: ['Keynote Presentation', 'Stage Presence', 'Storytelling']
    },
    {
      img: './assets/images/competitions/web/public_speaking_img_5235.jpg',
      title: 'Stage Address Delivery',
      desc: 'Live address before judicial panel and audience discussing youth empowerment and technological creativity.',
      category: 'PUBLIC SPEAKING',
      date: '2024',
      client: 'Leadership Forum',
      tools: ['Audience Engagement', 'Rhetoric']
    },
    {
      img: './assets/images/competitions/web/public_speaking_img_5239.jpg',
      title: 'Q&A Judicial Defense',
      desc: 'Defending thesis proposals and answering jury inquiries during the final round of the speech tournament.',
      category: 'PUBLIC SPEAKING',
      date: '2024',
      client: 'Public Speaking Forum',
      tools: ['Live Defense', 'Critical Thinking']
    },
    {
      img: './assets/images/competitions/web/public_speaking_img_5749.jpg',
      title: 'Certificate of Distinction',
      desc: 'Official certificate of distinction awarded by the judges and tournament organizers.',
      category: 'HONORS & RECOGNITION',
      date: '2024',
      client: 'Leadership Committee',
      tools: ['Distinction Award', 'Public Speaking Merit']
    },
    {
      img: './assets/images/competitions/web/public_speaking_img_5754.jpg',
      title: 'Finalist Cohort Celebration',
      desc: 'Finalist cohort stage celebration with judges, coaches, and academic mentors.',
      category: 'PUBLIC SPEAKING',
      date: '2024',
      client: 'Leadership Forum',
      tools: ['Cohort Celebration', 'Community Engagement']
    },
    {
      img: './assets/images/competitions/web/workshop_fb_img_1686049170737.jpg',
      title: 'Design Thinking & Technical Workshop',
      desc: 'Collaborative design thinking workshop and agile digital production training with industry mentors.',
      category: 'PROFESSIONAL WORKSHOP',
      date: '2023 - 2024',
      client: 'Creative Mentorship Program',
      tools: ['Design Thinking', 'Ideation Sprint', 'Rapid Prototyping']
    },
    {
      img: './assets/images/competitions/web/workshop_fb_img_1686315245483.jpg',
      title: 'Workshop Group Certification',
      desc: 'Team completion certification and project presentation for innovative physical and digital packaging solutions.',
      category: 'CREATIVE WORKSHOPS',
      date: '2023',
      client: 'Design Lab',
      tools: ['Group Presentation', 'Certification']
    },
    {
      img: './assets/images/competitions/web/event_untitled_shoot-09778.jpg',
      title: 'National Stage Gala Ceremony',
      desc: 'Formal ceremony and institutional gala stage recognition for outstanding young creators and technological innovators.',
      category: 'NATIONAL CEREMONY',
      date: '2024',
      client: 'National Event Gala',
      tools: ['Gala Recognition', 'Institutional Award']
    },
    {
      img: './assets/images/competitions/web/event_img_6922.jpg',
      title: 'Academic Distinction & Best Seller',
      desc: 'Best Seller Award for retail packaging & sales at Happy Chandara School, plus Foundation Year Academic Distinction at BELTEI International University.',
      category: 'ACADEMIC HONORS',
      date: '2024',
      client: 'BELTEI & Happy Chandara',
      tools: ['Academic Distinction', 'Sales Merit']
    },
    {
      img: './assets/images/competitions/web/event_img_1886.jpg',
      title: 'BELTEI University Campus Ceremony',
      desc: 'Campus 1 Awarding Ceremony celebration recognizing top academic performers in foundation year programs.',
      category: 'BELTEI INTERNATIONAL UNIV',
      date: '2024',
      client: 'BELTEI Academic Council',
      tools: ['Academic Excellence', 'Honor Roll']
    },
    {
      img: './assets/images/competitions/web/event_img_1890.jpg',
      title: 'Honor Medal & Certificate Presentation',
      desc: 'Stage recognition moment receiving the honors medal and certificate from university leadership.',
      category: 'HONORS & AWARDS',
      date: '2024',
      client: 'Awarding Committee',
      tools: ['Medal of Honor', 'Academic Recognition']
    },
    {
      img: './assets/images/summer camp/web/IMG_6209.jpg',
      title: 'Youth Technology Summer Camp Lead',
      desc: 'Organized and led youth skill workshops, team challenges, and creative problem-solving sessions empowering student cohorts in technology.',
      category: 'SUMMER CAMP LEAD',
      date: '2024',
      client: 'Youth Technology Summer Camp',
      tools: ['Team Leadership', 'Mentorship', 'Youth Engagement', 'Workshop Facilitation']
    },
    {
      img: './assets/images/summer camp/web/IMG_6213.jpg',
      title: 'Workshop Mentorship & Group Collaboration',
      desc: 'Mentoring student teams during hands-on collaborative problem solving and presentation preparation.',
      category: 'SUMMER CAMP LEAD',
      date: '2024',
      client: 'Youth Summer Camp',
      tools: ['Workshop Mentorship', 'Collaboration', 'Problem Solving']
    },
    {
      img: './assets/images/summer camp/web/IMG_6342.jpg',
      title: 'Summer Camp Cohort & Celebration',
      desc: 'Final team project exhibition and cohort celebration at the summer camp closing ceremony.',
      category: 'SUMMER CAMP LEAD',
      date: '2024',
      client: 'Youth Summer Camp',
      tools: ['Cohort Celebration', 'Community Engagement']
    }
  ];

  function openLightbox(index) {
    if (!lightboxModal) return;
    lightboxMode = 'project';
    activeLightboxIndex = (index + portfolioProjects.length) % portfolioProjects.length;
    const project = portfolioProjects[activeLightboxIndex];

    if (project.video) {
      lightboxImgContainer.innerHTML = `
        <video controls autoplay playsinline class="lightbox-video" poster="${project.image}" style="max-width:100%; max-height:75vh; border-radius:12px; box-shadow:0 20px 50px rgba(0,0,0,0.6); outline:none;">
          <source src="${project.video}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
    } else {
      lightboxImgContainer.innerHTML = `<img src="${project.image}" alt="${project.title}" class="lightbox-image" id="lightboxActiveImg">`;
    }
    const currentImg = document.getElementById('lightboxActiveImg');

    lightboxCounter.textContent = `${String(activeLightboxIndex + 1).padStart(2, '0')} / ${String(portfolioProjects.length).padStart(2, '0')}`;
    lightboxProjectTitle.textContent = project.title;
    lightboxDesc.textContent = project.details || project.summary;
    lightboxClient.textContent = project.client;
    lightboxRole.textContent = project.role;
    lightboxCategory.textContent = project.category.toUpperCase();
    lightboxDate.textContent = project.date;

    // Palette
    lightboxPalette.innerHTML = (project.palette || ['#04098a', '#38bdf8', '#ffffff'])
      .map(c => `<span class="palette-swatch" data-hex="${c}" style="background-color:${c}; width:20px; height:20px;" title="${c}"></span>`)
      .join('');

    lightboxPalette.querySelectorAll('.palette-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const hex = swatch.getAttribute('data-hex');
        navigator.clipboard.writeText(hex).then(() => {
          playUiSound(920, 'sine', 0.08);
          showToast(`Copied palette swatch ${hex}`);
        });
      });
    });

    // Tools
    lightboxTools.innerHTML = (project.tools || ['Photoshop', 'Illustrator'])
      .map(t => `<span>${t}</span>`)
      .join('');

    isZoomed = false;
    if (currentImg) currentImg.classList.remove('zoomed');

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function renderCompetitionLightbox(idx, fallbackImg, fallbackTitle, fallbackDesc, fallbackCat, fallbackDate, fallbackClient) {
    playUiSound(540, 'triangle', 0.1);
    const item = competitionGalleryItems[idx] || {};
    const img = item.img || fallbackImg;
    const title = item.title || fallbackTitle;
    const desc = item.desc || fallbackDesc;
    const cat = item.category || fallbackCat || 'COMPETITION';
    const date = item.date || fallbackDate || '2024';
    const client = item.client || fallbackClient || 'Official Event';
    const tools = item.tools || ['Competition Stage', 'Engineering & Speech', 'Live Presentation'];

    lightboxImgContainer.innerHTML = `<img src="${img}" alt="${title}" class="lightbox-image" id="lightboxActiveImg">`;
    const currentImg = document.getElementById('lightboxActiveImg');

    lightboxCounter.textContent = `COMPETITION ${String(idx + 1).padStart(2, '0')} / ${String(competitionGalleryItems.length).padStart(2, '0')}`;
    lightboxProjectTitle.textContent = title;
    lightboxDesc.textContent = desc;
    lightboxClient.textContent = client;
    lightboxRole.textContent = 'Participant & Competitor';
    lightboxCategory.textContent = cat.toUpperCase();
    lightboxDate.textContent = date;

    lightboxPalette.innerHTML = ['#04098a', '#1e40af', '#38bdf8', '#fbbf24']
      .map(c => `<span class="palette-swatch" data-hex="${c}" style="background-color:${c}; width:20px; height:20px;" title="${c}"></span>`)
      .join('');

    lightboxPalette.querySelectorAll('.palette-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const hex = swatch.getAttribute('data-hex');
        navigator.clipboard.writeText(hex).then(() => {
          playUiSound(920, 'sine', 0.08);
          showToast(`Copied palette swatch ${hex}`);
        });
      });
    });

    lightboxTools.innerHTML = tools.map(t => `<span>${t}</span>`).join('');

    isZoomed = false;
    if (currentImg) currentImg.classList.remove('zoomed');

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  window.openCompetitionLightbox = function(imgSrc, title, desc, cat, date, client) {
    if (!lightboxModal) return;
    lightboxMode = 'competition';
    let matchIdx = competitionGalleryItems.findIndex(item => item.img === imgSrc || item.img.includes(imgSrc.split('/').pop()));
    if (matchIdx === -1) {
      matchIdx = 0;
    }
    activeCompetitionIndex = matchIdx;
    renderCompetitionLightbox(activeCompetitionIndex, imgSrc, title, desc, cat, date, client);
  };

  window.openProjectLightboxById = function(id) {
    const idx = portfolioProjects.findIndex(p => p.id === id);
    if (idx !== -1) {
      playUiSound(520, 'sine', 0.1);
      openLightbox(idx);
    }
  };

  function closeLightbox() {
    if (!lightboxModal) return;
    const v = lightboxModal.querySelector('video');
    if (v) v.pause();
    playUiSound(420, 'sine', 0.08);
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', () => {
    playUiSound(580, 'sine', 0.05);
    if (lightboxMode === 'competition') {
      activeCompetitionIndex = (activeCompetitionIndex - 1 + competitionGalleryItems.length) % competitionGalleryItems.length;
      renderCompetitionLightbox(activeCompetitionIndex);
    } else {
      openLightbox(activeLightboxIndex - 1);
    }
  });
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', () => {
    playUiSound(580, 'sine', 0.05);
    if (lightboxMode === 'competition') {
      activeCompetitionIndex = (activeCompetitionIndex + 1) % competitionGalleryItems.length;
      renderCompetitionLightbox(activeCompetitionIndex);
    } else {
      openLightbox(activeLightboxIndex + 1);
    }
  });

  if (lightboxZoomBtn && lightboxActiveImg) {
    lightboxZoomBtn.addEventListener('click', () => {
      isZoomed = !isZoomed;
      lightboxActiveImg.classList.toggle('zoomed', isZoomed);
      playUiSound(isZoomed ? 700 : 500, 'sine', 0.08);
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      if (lightboxMode === 'competition') {
        activeCompetitionIndex = (activeCompetitionIndex - 1 + competitionGalleryItems.length) % competitionGalleryItems.length;
        renderCompetitionLightbox(activeCompetitionIndex);
      } else {
        openLightbox(activeLightboxIndex - 1);
      }
    }
    if (e.key === 'ArrowRight') {
      if (lightboxMode === 'competition') {
        activeCompetitionIndex = (activeCompetitionIndex + 1) % competitionGalleryItems.length;
        renderCompetitionLightbox(activeCompetitionIndex);
      } else {
        openLightbox(activeLightboxIndex + 1);
      }
    }
    if (e.key === 'z' || e.key === 'Z') {
      isZoomed = !isZoomed;
      lightboxActiveImg.classList.toggle('zoomed', isZoomed);
    }
  });

  // ---- 8. Interactive Stats Number Counter ----
  const statNumbers = document.querySelectorAll('[data-count]');
  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseInt(el.getAttribute('data-count'), 10);
        let startVal = 0;
        const duration = 1200;
        const stepTime = 30;
        const increment = Math.ceil(targetVal / (duration / stepTime));

        const timer = setInterval(() => {
          startVal += increment;
          if (startVal >= targetVal) {
            startVal = targetVal;
            clearInterval(timer);
          }
          if (el.textContent.includes('+')) {
            el.textContent = `${startVal}+`;
          } else if (el.textContent.includes('x')) {
            el.textContent = `${startVal}x`;
          } else {
            el.textContent = startVal;
          }
        }, stepTime);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(s => statObserver.observe(s));

  // ---- 9. Copy-to-Clipboard Buttons ----
  const toastNotice = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        playUiSound(880, 'sine', 0.09);
        showToast(`Copied "${textToCopy}" to clipboard!`);
      }).catch(() => {
        showToast('Unable to copy.');
      });
    });
  });

  function showToast(msg) {
    if (!toastNotice || !toastMessage) return;
    toastMessage.textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3000);
  }



});
