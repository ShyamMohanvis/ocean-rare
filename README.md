# 🌊 Ocean Rare — From the Ocean. To Your Table.

> **An immersive scroll-driven storytelling seafood experience & e-commerce portal.**

[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg)](https://vite.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88ce02.svg)](https://greensock.com/gsap/)
[![Live Demo](https://img.shields.io/badge/demo-GitHub%20Pages-blue.svg)](https://shyammohanvis.github.io/ocean-rare/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Ocean Rare brings the culinary journey of premium, sustainably sourced seafood to life through video scroll-scrubbing, dynamic interactive chapters, a cart & checkout interface, and an AI-driven video synthesis backend using Google Gemini.

---

## Live Website & Interactive Demo

- **Live Site**: [https://shyammohanvis.github.io/ocean-rare/](https://shyammohanvis.github.io/ocean-rare/)

---

## Features

- 🎬 **Video Scroll-Scrubbing**: High-fidelity video synchronization tied directly to scroll progress via requestAnimationFrame.
- 📖 **Story Chapters**: Step-by-step visual narrative covering ocean origins, sustainable catch, processing, cuts, and doorstep delivery.
- 🛒 **Interactive Seafood Catalog & Cart**: Browse curated cuts (Salmon, Red Snapper, Tiger Prawns, Tuna Steak, Sea Bass, Jumbo Crab) with real-time sliding drawer cart management.
- 💳 **Checkout Interface**: Responsive checkout review with temperature-controlled shipping indicators.
- 🤖 **Gemini AI Video Generator Backend**: Express server integrating Google GenAI SDK (`veo-2.0-generate-001`) for on-demand procedural video generation.

---

## Technology Stack

- **Frontend Framework**: React 19 (`react`, `react-dom`, `react-router-dom`)
- **Build Tool**: Vite 8
- **Animation & Motion**: GSAP (GreenSock Animation Platform)
- **Icons**: Lucide React
- **Linter**: Oxlint
- **Backend**: Node.js & Express.js
- **AI / Video Synthesis**: `@google/genai` (Google GenAI SDK)
- **Styling**: Vanilla CSS with tailored typography (Playfair Display & Inter)

---

## Quick Start & Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/ShyamMohanvis/ocean-rare.git
cd ocean-rare
```

### 2. Install dependencies & run frontend

```bash
npm install
npm run dev
```

The frontend will start locally at `http://localhost:5173/`.

### 3. Run the AI backend server (Optional)

```bash
cd server
npm install
cp .env.example .env
# Edit .env and supply your GEMINI_API_KEY
node server.js
```

The server runs at `http://localhost:3001/` with `/api/videos/generate` endpoints.

---

## Environment Variables

For the optional AI video generation server, configure `server/.env`:

| Variable | Description | Default |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini / GenAI API Key | Required for Veo generation |
| `PORT` | Express server port | `3001` |

*(Note: The frontend runs fully client-side on GitHub Pages without requiring the backend server).*

---

## Build & Test Commands

```bash
# Run Oxlint
npm run lint

# Compile production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```
ocean-rare/
│
├── .github/
│   └── workflows/
│       └── deploy.yml           ← GitHub Pages automated build & deploy
│
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── media/                   ← Production video assets & product imagery
│       ├── cuts.mp4
│       ├── delivery.mp4
│       ├── fishing.mp4
│       ├── marketplace.mp4
│       ├── ocean.mp4
│       ├── ocean-rare-master-scroll.mp4
│       ├── processing.mp4
│       └── products/
│
├── server/                      ← Gemini AI video generation backend
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── test_gen.mjs
│
├── src/
│   ├── components/
│   │   ├── CartDrawer.jsx
│   │   └── CartDrawer.css
│   ├── context/
│   │   └── CartContext.jsx
│   ├── data/
│   │   └── storyConfig.js
│   ├── pages/
│   │   ├── StoryPage.jsx
│   │   ├── StoryPage.css
│   │   ├── CheckoutPage.jsx
│   │   └── CheckoutPage.css
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## License

MIT
