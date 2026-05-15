# 🪟 Pane 3.1 - Interactive Retro Portfolio

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Sanity](https://img.shields.io/badge/Sanity-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)](https://www.sanity.io/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**Pane 3.1** is a high-fidelity, interactive desktop environment inspired by the classic Windows 3.1 and 9x era. It serves as a personal portfolio, blending retro aesthetics with modern web technologies to create a unique and engaging user experience.

🔗 **Live Demo:** [https://khoinm.vercel.app](https://khoinm.vercel.app)

---

## ✨ Features

### 🖥️ Desktop Environment
- **Multi-Window System:** Draggable, resizable, and minimizable windows with a custom window manager.
- **Taskbar & Start Menu:** Active window tracking, system clock, and quick access to programs.
- **Icon Management:** Desktop shortcuts for folders and applications.
- **Dynamic Folders:** Folder contents (Projects, Certificates, Online Accounts) are fetched dynamically from **Sanity CMS**.

### 🛠️ Built-in Applications
- **📝 Notebook:** A functional text editor for reading personal notes.
- **🖼️ Photo Viewer:** High-fidelity image gallery for showcasing visual work.
- **🎥 Media Player:** Integrated video player with support for external links and YouTube.
- **🎨 Paint:** A creative drawing application built within the browser.
- **🎮 Games:** Retro classics like Line 98, Pikachu, and Maze Test.
- **📷 Camera:** Web-app camera integration for a "retro" hardware feel.
- **🗞️ News:** A custom news reader for staying updated.

### 🎭 UX & Easter Eggs
- **⚡ Performance:** Fast loading times using React Lazy loading and optimized assets.
- **💀 BSOD (Blue Screen of Death):** Randomized system "crashes" for unimplemented features to maintain the retro vibe.
- **📟 Matrix Rain:** A digital "screen saver" effect.
- **💤 Standby Mode:** Custom idle state with clock and calendar.
- **📬 Message Me:** Contact form integration via EmailJS.

---

## 🚀 Tech Stack

- **Core:** [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Styling:** [TailwindCSS 4](https://tailwindcss.com/), [Styled Components](https://styled-components.com/), and Vanilla CSS
- **CMS:** [Sanity.io](https://www.sanity.io/) (Headless CMS for content management)
- **Icons:** Custom Windows 3.x/9x icon library
- **Deployment:** [Vercel](https://vercel.com/)
- **Other Tools:** Lucide React, EmailJS, Portable Text

---

## 🛠️ Installation & Setup

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
Create a `.env` file in the root directory and add your Sanity and EmailJS credentials:
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

## 📂 Project Structure

```text
hayami/
├── public/             # Static assets (favicons, sw.js)
├── src/
│   ├── assets/         # Icons, images, sounds, and fonts
│   ├── components/     # Core UI components (Window, Taskbar, Explorer)
│   ├── config/         # Program and desktop configurations
│   ├── features/       # Individual application implementations (Paint, Games, etc.)
│   ├── hooks/          # Custom React hooks (window management, instances)
│   ├── lib/            # External library configurations (Sanity client)
│   ├── App.jsx         # Main application entry point
│   └── main.jsx        # React DOM rendering
├── sanity/             # Sanity CMS schemas and configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite build configuration
```

---

## 🏗️ Building for Production

To create an optimized production build:
```bash
npm run build
```
The output will be generated in the `dist/` directory.

---

## 📜 License

This project is open-source. Please credit the author if you use any part of this project.

---

Designed with ❤️ by **Khoi NM**
