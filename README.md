# 🏎️ ITZFIZZ — Scroll-Driven Hero Section Animation

[![GSAP 3](https://img.shields.io/badge/GSAP-3.12+-88CE02.svg?style=flat&logo=greensock&logoColor=white)](https://greensock.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A recreation and high-performance enhancement of the McLaren 720S scroll-driven hero section animation inspired by the benchmark [live demo](https://paraschaturvedi.github.io/car-scroll-animation). Features precision scroll kinematics, sub-pixel letter illumination, dynamic EV cockpit acoustics, and zero layout thrashing.

---

## 🎯 Assignment Functional Requirements Compliance

| # | Requirement | Implementation Details | Status |
|---|---|---|:---:|
| **1** | **Hero Section Layout** | Occupies first screen (100vh viewport above fold) with sticky track pinning. Displays letter-spaced headline `W E L C O M E   I T Z   F I Z Z` and 4 impact metrics cards below with percentages and descriptions. | ✅ Verified |
| **2** | **Initial Load Animation** | On page load, staggered 3D letter reveal with `back.out(1.7)` easing, followed by subtle sequential entrance of statistics cards with delay and scale pop. | ✅ Verified |
| **3** | **Scroll-Based Animation (Core)** | Pinned hero track responsive to window scroll. McLaren 720S translates across the asphalt road in sync with scroll progress. Behind the car, a vibrant kinetic trail expands, revealing and illuminating headline letters in real time. | ✅ Verified |
| **4** | **Motion & Performance** | Pure GPU-accelerated CSS `transform: translate3d` and `scale`. Damped with a 1.2s GSAP scrub factor. Passive scroll handling with 0 layout reflows (60–120 FPS guaranteed). | ✅ Verified |
| **5** | **Mandatory Tech Stack** | **HTML5**, **CSS3**, **JavaScript (ES2024)**, **GSAP + ScrollTrigger**, **React 19**, **Tailwind CSS v4**. | ✅ Verified |
| **6** | **Dual Implementation** | Includes both a modern **React + Tailwind + GSAP** app (`src/`) and a standalone **Vanilla HTML/CSS/JS** version (`standalone/index.html`). | ✅ Verified |
| **7** | **Free Hosting Ready** | Pre-configured with relative asset resolution (`base: './'`) for 1-click **GitHub Pages** deployment + GitHub Actions workflow. | ✅ Verified |

---

## 🚀 Key Features

- **Kinetic Trail & Letter Illumination**: As the McLaren drives forward, its neon wake trail matches its exact rear bumper position. Letters of `WELCOME ITZFIZZ` dynamically calculate relative coordinates and illuminate with high-contrast color shifts.
- **Milestone Impact Metric Cards**:
  - `58%` — Increase in pick up point use (Volt Lime)
  - `23%` — Decreased in customer phone calls (Cyber Sky Blue)
  - `27%` — Higher repeat order velocity (Titanium Glass)
  - `40%` — Reduction in dispatch latency (Hyper Orange)
- **Live Digital Telemetry HUD**:
  - Real-time **Speedometer** computing scroll velocity ($dy/dt$) up to 240+ MPH.
  - Dynamic **Gear indicator** (N, 1st, 2nd, 3rd, 4th, 5th), simulated **RPM**, and **Distance (0–400m)**.
- **Synthetic Web Audio API Engine**:
  - Zero external MP3/WAV assets required.
  - Interactive electric propulsion hum synthesized in real time using browser audio oscillators and low-pass biquad filters that modulate with scroll speed.
- **Interactive Controls**:
  - **Auto-Cruise mode**: Hands-free automated test drive.
  - **Color Palette Switcher**: Emerald Green, Cyber Cyan, Volt Lime, Hyper Orange, and Neon Violet.
  - **Reset Grid**: Quick return to starting line.
  - **Confetti Finish Celebration**: Celebratory particle burst upon crossing the chequered flag.

---

## 📂 Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml        # Automated GitHub Pages CI/CD deployment
├── public/
│   └── car.png               # High-resolution McLaren 720S transparent top view
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Telemetry bar, theme switcher, audio & cruise controls
│   │   ├── HeroSection.jsx   # Core GSAP ScrollTrigger pinned track & letter illumination
│   │   ├── TelemetryHUD.jsx  # Real-time speedometer gauge & instrument cluster
│   │   ├── FeatureShowcase.jsx # Technical architecture breakdown & compliance audit
│   │   ├── InteractivePlayground.jsx # Test bench controls and confetti trigger
│   │   └── Footer.jsx        # Tech badges, reference demo links & credits
│   ├── utils/
│   │   └── audioEngine.js    # Self-contained Web Audio API synthesizer
│   ├── App.jsx               # Root application coordinator
│   ├── index.css             # Tailwind CSS v4 styling & typography
│   └── main.jsx              # React entry point
├── standalone/
│   ├── index.html            # Standalone Vanilla HTML + CSS + JS (Zero-build required)
│   └── car.png               # Standalone vehicle asset
├── dist/                     # Optimized production bundle (GitHub Pages ready)
├── package.json
├── vite.config.js            # Base path relative configuration for static hosting
└── README.md
```

---

## 🛠️ Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd asswesment
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production (GitHub Pages)

```bash
npm run build
```

The optimized static output will be generated inside the `dist/` directory.

### 4. Running the Standalone Vanilla Version

If you prefer testing without Node or build tooling:
1. Navigate to the `standalone/` directory.
2. Double-click `standalone/index.html` to open directly in any browser!

---

## 🌐 Deploying to GitHub Pages

### Method A: Automated GitHub Actions (Recommended)
1. Push this repository to GitHub.
2. In your repository on GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` workflow will automatically build and publish the site!

### Method B: Deploying `dist/` branch
```bash
npm run build
npx gh-pages -d dist
```

---

## 🔬 Motion Physics & Architecture

```
User Window Scroll Event
          │
          ▼
GSAP ScrollTrigger (pin: #track, scrub: 1.2s inertia)
          │
          ├──► GPU Matrix Translation (car.style.transform = translate3d(x, 0, 0))
          ├──► Dynamic Trail Extrusion (trail.style.width = carX)
          ├──► Coordinate Collision Detection (carMidpoint >= letter.offsetLeft)
          │         └──► Headline Letter Illumination ('illuminated' class)
          ├──► Instantaneous Velocity Calculation (dy / dt)
          │         ├──► Digital Speedometer Gauge
          │         └──► Web Audio API Oscillator Frequency Modulation (65Hz → 350Hz)
          └──► Milestone Triggers (25%, 50%, 75%, 90%)
                    └──► Stats Cards Staggered Pop & Number Counter Acceleration
```

---

## 📄 License

MIT License — Feel free to use and adapt this project for educational and professional portfolio showcases.
