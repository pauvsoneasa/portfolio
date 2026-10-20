# Pauv Soneasa — Creative Multimedia Designer Portfolio

Official responsive web portfolio for **Pauv Soneasa**, Computer Multimedia Designer (Year 3) at BELTEI International University (Campus 1).

Featuring commercial branding systems, snack packaging suites, institutional print collateral, streetwear merchandise, and official WorldSkills ASEAN Manila 2025 competition test package modules.

## 🎨 Design & Technology
- **Main Accent**: Electric Sky Light Blue (`#38bdf8` / `#0ea5e9` / `#7dd3fc`)
- **Theme Surfaces**: Deep Obsidian Glass Studio (`#070a12`, `#0b1120`) & Glacier Alabaster Light Mode
- **Audio Feedback**: Subtle synthesized UI audio cues using HTML5 Web Audio API
- **Dynamic Features**:
  - Live Phnom Penh, Cambodia Clock (UTC+7)
  - Interactive Project Color Palette Inspector with 1-click HEX copy
  - High-Resolution Lightbox Inspector with Zoom & Pan
  - Category Filter Pills & Real-time Live Search
  - 3D Perspective Card Tilt
  - Animated Statistics & Skill Meters

---

## 🚀 How to Host on GitHub Pages (Zero-Config)

1. Create a new repository on GitHub (e.g. `portfolio` or `<your-username>.github.io`).
2. Push all files in this directory to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Pauv Soneasa Portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
3. In your GitHub repository:
   - Navigate to **Settings** > **Pages**
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**
   - Select the `main` branch and `/ (root)` folder, then click **Save**.
4. Your portfolio will be live at:
   `https://<your-username>.github.io/<your-repo-name>/`

---

## 📁 Directory Structure
```
├── index.html            # Main semantic HTML5 webpage
├── deck.html             # Full-screen auto-playing editorial design deck
├── style.css             # Light-blue modern design system & glassmorphism
├── deck.css              # Device-frame presentation styles
├── script.js             # Interactive engine, live clock, sound & lightbox
├── deck.js               # Deck slide transition & autoplay engine
├── projects-data.js      # Structured portfolio catalogue & authentic project data
├── assets/
│   ├── profile/          # Pauv Soneasa portrait & renders
│   ├── images/
│   │   ├── my-artwork/   # Authentic personal design artworks (web & thumbs)
│   │   ├── worldskills/  # WorldSkills ASEAN Manila 2025 competition package
│   │   ├── competitions/ # National Robotics & Youth Summer Camp
│   │   └── summer camp/  # Summer camp leadership assets
│   └── audio/            # Background audio track
├── .nojekyll             # Bypasses Jekyll for GitHub Pages
└── README.md             # Documentation
```
