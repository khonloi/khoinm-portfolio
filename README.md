# Pane — Interactive Retro Windows Desktop Portfolio

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand_5-443e38?style=for-the-badge&logo=react&logoColor=white)](https://github.com/pmndrs/zustand)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest_5-729B1B?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![ESLint](https://img.shields.io/badge/ESLint_9-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Sanity CMS](https://img.shields.io/badge/Sanity_v5-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)](https://www.sanity.io/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://vite-pwa-org.netlify.app/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**Pane** is a high-fidelity, interactive desktop operating system simulation inspired by classic Windows 95/98 aesthetics. It functions as an interactive full-stack developer portfolio for **Khoi NM**, merging authentic vintage computing interactions (window managers, beveled dialogs, retro cursors, audio synthesizer soundscapes, and iconic pixel art) with a modern web architecture powered by **React 19**, **TypeScript**, **Zustand v5**, **Tailwind CSS v4**, and **Sanity CMS**.

**Live Production Deployment:** [https://khoinm.vercel.app](https://khoinm.vercel.app)

---

## Table of Contents

- [Features Overview](#features-overview)
  - [Desktop Operating System](#desktop-operating-system)
  - [Built-in Applications](#built-in-applications)
  - [SEO & Deep Linking](#seo--deep-linking)
  - [Offline Support (PWA)](#offline-support-pwa)
- [Architecture & Modernization](#architecture--modernization)
  - [100% Strict TypeScript](#100-strict-typescript)
  - [Zustand v5 Store Architecture](#zustand-v5-store-architecture)
  - [Feature-Sliced Design (FSD) Organization](#feature-sliced-design-fsd-organization)
  - [Styling System & Scoped CSS Modules](#styling-system--scoped-css-modules)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#1-clone-and-install)
  - [Environment Variables](#2-environment-variables)
  - [Development Server](#3-run-development-server)
- [Available Scripts](#available-scripts)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Deployment](#deployment)
- [License & Credits](#license--credits)

---

## Features Overview

### Desktop Operating System
- **Advanced Window Manager:**
  - True multi-window system with focus-stacking, drag-and-drop movement, and boundary clamping.
  - Smooth maximize/restore, minimize-to-taskbar, and full-screen modes.
  - Authentic retro zoom rectangular wireframe animations on open, close, and minimize.
- **Dynamic Desktop Grid:**
  - Draggable desktop icons with grid snapping and keyboard navigation.
  - Persistent icon position layout across browser sessions stored via `localStorage`.
- **Taskbar & Start Menu Bar:**
  - Active running application chips, quick restore buttons, and collapsible taskbar drawer.
  - Live system clock and audio sound effect controls.
- **Retro Audio & Cursors:**
  - Synthesized system sound effects (boot chime, window open/close clicks, button beeps).
  - Pixel-perfect retro Windows cursors (`arrow`, `link`, `wait`, `busy`).

### Built-in Applications
The system includes 13 fully modular applications registered in the window registry:

| Application | Description | Domain Module |
| :--- | :--- | :--- |
| **Welcome** | Interactive boot greeting and quick-start system tour | `src/features/welcome` |
| **About Me** | Career background, tech stacks, bio, and resume highlights | `src/features/about` |
| **Projects / Explorer** | Dynamic filesystem folders for projects, certificates, and media powered by Sanity CMS | `src/components/Explorer.tsx` |
| **Notebook** | Text and code viewer with markdown syntax highlighting | `src/features/notebook` |
| **Photo Viewer** | Retro gallery for graphic designs, artworks, and UI snapshots | `src/features/photo-viewer` |
| **Media Player** | Retro audio/video player with playback controls and track selectors | `src/features/media-player` |
| **News** | Tech publication reader and engineering blog browser | `src/features/news` |
| **Line 98** | Classic retro color-matching puzzle game with scoped styling and scoring | `src/features/games/line98` |
| **Message Me** | Contact terminal integrated with **EmailJS** for direct client inquiries | `src/features/message` |
| **Matrix Rain** | Canvas-based screensaver simulation | `src/features/matrix-rain` |
| **Safe** | Encrypted secret vault with password easter egg unlocking | `src/features/safe` |
| **Standby & Fragile World** | Experimental interactive creative modules | `src/features/standby`, `src/features/fragile-world` |
| **CMS Studio Editor** | Embedded headless Sanity Studio for real-time portfolio content updates | `src/features/editor` |

### SEO & Deep Linking
- **URL Parameter Synchronization:** Deep-linking engine (`?open=projects`, `?open=about`) synchronizes open windows with browser history, enabling full forward/back navigation and direct link sharing.
- **Dynamic Meta Tags:** Automated document title, description, OpenGraph, and Twitter Card management via `SEO.tsx`.
- **Structured Data:** Embedded Schema.org JSON-LD graph (`WebSite`, `Person`, `ProfilePage`).
- **Crawler Fallbacks:** Semantic HTML fallbacks rendered inside `noscript` tags to guarantee 100% search engine discoverability.

### Offline Support (PWA)
- **Service Worker Caching:** Powered by `vite-plugin-pwa` and Workbox, pre-caching 150+ assets including icons, retro fonts, images, and audio tracks for full offline functionality.
- **Web App Manifest:** Installable as a standalone desktop or mobile application.

---

## Architecture & Modernization

The codebase has undergone a complete 5-phase architectural modernization:

### 100% Strict TypeScript
- 100% of `.js`/`.jsx` files migrated to strictly-typed `.ts`/`.tsx`.
- Centralized domain contracts defined in `src/types/index.ts` covering window states, desktop items, system models, and animation options.
- Zero TypeScript compiler errors (`tsc --noEmit` exits with 0).

### Zustand v5 Store Architecture
Global state has been transitioned from render-heavy monolithic React Contexts to high-performance, fine-grained **Zustand** stores:
- **`useWindowStore`:** Manages active window registry, focus stack, minimized queue, and zoom transitions.
- **`useDesktopStore`:** Manages desktop items, position persistence, and dynamic folder trees.
- **`useSystemStore`:** Coordinates boot/shutdown lifecycle, mobile safe-area buffers, and audio settings.
- **Backward-Compatible Context Adapters:** `WindowContext`, `DesktopContext`, and `SystemContext` adapt seamlessly to the stores, ensuring zero breaking changes for existing components.

### Feature-Sliced Design (FSD) Organization
- Every application lives in its own domain directory under `src/features/` with an explicit `index.ts` public contract.
- UI primitives (`Button`, `Dialog`, `Window`, `Input`, `LayeredBox`) are centralized under `src/components/index.ts`.
- Core hooks (`useDragDrop`, `useStartup`, `useAudio`, `useDeepLinking`) are unified under `src/hooks/index.ts`.

### Styling System & Scoped CSS Modules
- **Single CSS Entry Point:** Consolidated all styles into `src/index.css`.
- **CSS Modules:** Converted game and app-specific styles (`Line98.module.css`) to scoped modules to prevent selector leaks.
- **Tailwind Tokens:** Extended `tailwind.config.js` with retro cursors, Windows 95 3D beveled box shadows (`win-outset`, `win-inset`), and desktop z-index layers.

---

## Project Structure

```text
hayami/
├── public/                 # Static assets (favicons, manifest.json, robots.txt, sitemap.xml)
├── scripts/                # Build and deployment utilities (generate-sitemap.js)
├── src/
│   ├── assets/             # Retro icons (.ico), pixel images, audio (.wav), fonts (.ttf)
│   ├── components/         # Shared UI primitives and desktop shell
│   │   ├── __tests__/      # Component test suites (Button, Dialog, Window, Taskbar)
│   │   ├── Button.tsx
│   │   ├── Dialog.tsx
│   │   ├── Window.tsx
│   │   ├── Taskbar.tsx
│   │   ├── Desktop.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── SEO.tsx
│   │   └── index.ts        # Components barrel export
│   ├── config/             # Window registry, desktop items, and icon mappings
│   ├── context/            # Context backward-compatibility adapters
│   ├── css/                # Base retro variables, typography, and utility stylesheets
│   ├── data/               # Audio manifests, cursor mapping, and welcome tour data
│   ├── features/           # Domain-encapsulated feature applications
│   │   ├── about/          # About Me portfolio
│   │   ├── editor/         # Embedded Sanity Studio CMS
│   │   ├── fragile-world/  # Creative art module
│   │   ├── games/          # Game launcher and Line 98 (with Line98.module.css)
│   │   ├── matrix-rain/    # Matrix canvas screensaver
│   │   ├── media-player/   # Audio/video player
│   │   ├── message/        # EmailJS contact form
│   │   ├── news/           # Tech news reader
│   │   ├── notebook/       # Markdown notes viewer
│   │   ├── photo-viewer/   # Artwork photo gallery
│   │   ├── safe/           # Secret credential vault
│   │   ├── standby/        # Standby power screen
│   │   ├── welcome/        # Startup welcome walkthrough
│   │   └── index.ts        # Features barrel export
│   ├── hooks/              # Custom hooks and window management logic
│   │   ├── __tests__/      # Hook test suites (useDragDrop, useStartup, useDesktopItems, etc.)
│   │   ├── window/         # Window sub-hooks (lifecycle, transitions, positioning, mobile)
│   │   ├── useDragDrop.ts  # Desktop and window dragging physics
│   │   ├── useStartup.ts   # System boot orchestrator
│   │   └── index.ts        # Hooks barrel export
│   ├── lib/                # Third-party API clients (Sanity client)
│   ├── stores/             # Typed Zustand v5 stores
│   │   ├── __tests__/      # Store test suites (useWindowStore, useDesktopStore, useSystemStore)
│   │   ├── useWindowStore.ts
│   │   ├── useDesktopStore.ts
│   │   ├── useSystemStore.ts
│   │   └── index.ts
│   ├── test/               # Vitest environment setup
│   ├── types/              # TypeScript type definitions and interfaces
│   ├── App.tsx             # Root desktop application orchestrator
│   ├── index.css           # Consolidated primary stylesheet entry
│   └── main.tsx            # React 19 bootstrap entry
├── eslint.config.js        # ESLint 9 flat configuration with typescript-eslint
├── package.json            # Project dependencies, scripts, and overrides
├── tailwind.config.js      # Custom retro theme tokens, cursors, and shadows
├── tsconfig.json           # Strict TypeScript compiler options
├── vite.config.ts          # Vite build, PWA service worker, and path aliases
└── vitest.config.js        # Vitest test runner configuration and DOM mocking
```

---

## Getting Started

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **Package Manager:** `npm` (v9+) or `pnpm`

### 1. Clone and Install
```bash
# Clone the repository
git clone https://github.com/khonloi/khoinm-portfolio.git
cd hayami

# Install dependencies
npm install
```

### 2. Environment Variables
Copy the example environment template and fill in your API credentials:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# EmailJS (Contact form)
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_EMAILJS_TO_EMAIL=your_email@example.com

# Sanity CMS (Headless Content)
VITE_SANITY_PROJECT_ID=your_sanity_project_id
VITE_SANITY_DATASET=production

# Easter Egg Credentials
VITE_EASTER_EGG_URL=https://your-secret-url.com
VITE_EASTER_EGG_PASSWORD=your_easter_egg_password
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to experience the desktop environment.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with HMR |
| `npm run build` | Generates sitemap and builds production bundle with PWA precache |
| `npm run preview` | Locally serves the optimized production build |
| `npm run test` | Runs the full Vitest suite in single-run CI mode |
| `npm run test:watch`| Launches Vitest in interactive watch mode |
| `npm run typecheck` | Executes TypeScript type verification (`tsc --noEmit`) |
| `npm run lint` | Lints all `.ts`, `.tsx`, `.js`, and `.jsx` files via ESLint 9 |
| `npm run format` | Auto-formats code with Prettier |
| `npm run deploy` | Deploys the build output to GitHub Pages (`gh-pages`) |

---

## Testing & Quality Assurance

The project enforces code quality through automated checks:

- **Vitest & React Testing Library:** 12 test suites with 52 unit/integration tests verifying stores, hooks, and UI primitives:
  - Stores: `useWindowStore`, `useDesktopStore`, `useSystemStore`.
  - Components: `Button`, `Dialog`, `Window`, `Taskbar`.
  - Hooks: `useDragDrop`, `useStartup`, `useLoadingScreen`, `useDesktopItems`, `useWindowSystem`.
- **Strict TypeScript:** Full type checking without implicit `any` escapes.
- **ESLint 9 Flat Config:** Configured with `typescript-eslint` for strict static code analysis.

To execute the full verification suite:
```bash
npm run typecheck && npm run lint && npm run test
```

---

## Deployment

### Vercel (Recommended)
This repository is pre-configured for automated Vercel deployment:
1. Connect your repository to [Vercel](https://vercel.com/).
2. Set the framework preset to **Vite**.
3. Supply all environment variables under Project Settings.
4. The deployment pipeline will automatically run `npm run build` (which generates the sitemap and compiles the PWA).

### GitHub Pages
To publish directly to GitHub Pages:
```bash
npm run deploy
```

---

## License & Credits

- **Author:** [Khoi NM](https://github.com/khonloi)
- **Design Inspiration:** Classic Windows 95, Windows 98, and early graphical user interface operating systems.
- **License:** Open-source for educational and portfolio demonstration purposes. If you use parts of this code in your own project, attribution is appreciated.
