# Pane - Interactive Retro Windows Portfolio

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Sanity](https://img.shields.io/badge/Sanity-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)](https://www.sanity.io/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**Pane** is a high-fidelity, interactive desktop environment inspired by classic retro Windows operating systems. It serves as a creative developer portfolio, combining vintage desktop computing aesthetics with modern frontend technologies, headless content management, and progressive web application capabilities.

**Live Demo:** [https://khoinm.vercel.app](https://khoinm.vercel.app)

---

## Features

### Desktop Environment
- **Multi-Window System:** Draggable, resizable, focusable, and minimizable windows with a custom window manager.
- **Taskbar and Menu Bar:** Active window tracking, system controls, restore capabilities, and system sound effects.
- **Icon Management:** Desktop shortcuts with selection, drag-and-drop movement, keyboard navigation, and double-click execution.
- **Dynamic Folders:** Explorer folders (Projects, Certificates, Online Accounts, Random Stuff) fetched dynamically from Sanity CMS.

### Built-in Applications
- **Notebook:** Functional text editor and notes viewer.
- **Photo Viewer:** Image gallery for visual work and designs.
- **Media Player:** Audio and video player supporting embedded tracks and media links.
- **Paint:** In-browser pixel drawing and canvas program.
- **Games:** Classic retro games, including Line 98.
- **News:** News reader and tech article browser.
- **Message Me:** Interactive contact form powered by EmailJS.

### SEO, Deep Linking, and Architecture
- **Deep Linking:** Full URL parameter synchronization (`?open=projects`, `?open=about`) allowing direct links to specific programs or folders with browser history integration (Back/Forward navigation).
- **Dynamic Metadata:** React 19 native head hoisting and DOM synchronization for OpenGraph, Twitter Cards, and canonical URLs.
- **Structured Data:** Comprehensive Schema.org JSON-LD graph (`WebSite`, `Person`, `ProfilePage`).
- **Crawler Fallback:** Semantic HTML fallback within `noscript` tags for search engine discoverability.
- **PWA & Offline Support:** Offline-ready service worker caching powered by VitePWA and Workbox.
- **Web Analytics:** Integrated Vercel Analytics for Core Web Vitals and usage monitoring.

---

## Tech Stack

- **Core:** [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) and Vanilla CSS
- **CMS:** [Sanity.io](https://www.sanity.io/) (Headless CMS)
- **Analytics:** [@vercel/analytics](https://vercel.com/analytics)
- **PWA:** [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- **Deployment:** [Vercel](https://vercel.com/)
- **Libraries:** Lucide React, EmailJS, Portable Text, React Markdown

---

## Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the repository
```bash
git clone https://github.com/khonloi/khoinm-portfolio.git
cd hayami
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 4. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## Project Structure

```text
hayami/
├── public/             # Static assets (favicons, sitemap.xml, robots.txt, manifest.json)
├── src/
│   ├── assets/         # Icons, images, sounds, and fonts
│   ├── components/     # Core UI components (Desktop, Window, Taskbar, SEO, Icon)
│   ├── config/         # Desktop configurations, icon imports, and window registry
│   ├── data/           # Audio mappings, cursors, and welcome content
│   ├── features/       # Feature applications (Paint, Line98, News, About, Message)
│   ├── hooks/          # Custom hooks (useWindowSystem, useDragDrop, useDeepLinking, useStartup)
│   ├── lib/            # External integrations (Sanity client)
│   ├── App.jsx         # Root application component
│   └── main.jsx        # Application entry point
├── sanity/             # Sanity CMS schemas and studio configuration
└── vite.config.js      # Vite and PWA configuration
```

---

## Building for Production

To create an optimized production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## License

This project is open-source. Please credit the author if you use any part of this project.

Designed and developed by **Khoi NM**.
