import React, { useEffect, useState, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Desktop from './components/Desktop';
import BSOD from './components/BSOD';
import Dialog from './components/Dialog';
import { SystemProvider, useSystem } from './context/SystemContext';
import { DesktopProvider } from './context/DesktopContext';
import { WindowProvider, useWindowContext } from './context/WindowContext';
import { setCursorVariables } from './data/cursors';
import ErrorBoundary from './components/ErrorBoundary';

import type { WindowState } from './types';

const Editor = React.lazy(() => import('./components/Editor'));

function WindowAnnouncer() {
  const { openWindows, focusedWindow } = useWindowContext();
  const [announcement, setAnnouncement] = useState('');
  const prevWindowsRef = useRef<WindowState[]>([]);

  useEffect(() => {
    const prev = prevWindowsRef.current;
    const curr = openWindows;

    if (curr.length > prev.length) {
      const newWin = curr.find(w => !prev.some(pw => pw.id === w.id));
      if (newWin) {
        setAnnouncement(`${newWin.title} window opened`);
      }
    } else if (curr.length < prev.length) {
      const closedWin = prev.find(pw => !curr.some(w => w.id === pw.id));
      if (closedWin) {
        setAnnouncement(`${closedWin.title} window closed`);
      }
    } else if (focusedWindow) {
      const focusedWin = curr.find(w => w.id === focusedWindow);
      // Don't repeat focus announcement if it's the same window that just opened
      if (focusedWin && announcement !== `${focusedWin.title} window opened`) {
        setAnnouncement(`${focusedWin.title} window focused`);
      }
    }

    prevWindowsRef.current = curr;
  }, [openWindows, focusedWindow, announcement]);

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  );
}

function AppShell() {
  const {
    isFullScreen,
    isBSODActive,
    closeBSOD,
    showOfflineDialog,
    setShowOfflineDialog,
    networkIcon,
  } = useSystem();

  return (
    <div className={`App ${isFullScreen ? 'fullscreen' : ''}`}>
      {/* Skip to content link for keyboard/screen reader users */}
      <a
        href="#desktop-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-1 focus:left-1 focus:z-[999999] focus:bg-windows-yellow focus:text-windows-black focus:px-4 focus:py-2 focus:text-lg focus:font-bold"
      >
        Skip to desktop content
      </a>
      <WindowAnnouncer />
      <Desktop />

      <div className="mobile-safe-buffer" />

      {isBSODActive && <BSOD onClose={closeBSOD} />}

      <Dialog
        id="offline-dialog"
        isVisible={showOfflineDialog}
        title="PANE"
        message={`You are currently offline.\nPlease check your internet connection.`}
        icon={networkIcon}
        onClose={() => setShowOfflineDialog(false)}
        buttons={[
          {
            label: "OK",
            onClick: () => setShowOfflineDialog(false),
          },
        ]}
      />

      {/* Hidden preloader for offline assets and custom cursors to prevent flickers */}
      <div style={{ position: 'fixed', opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
        <img src={networkIcon} alt="" width="1" height="1" loading="eager" decoding="async" />
        <div style={{ cursor: 'var(--cursor-arrow)' }}></div>
        <div style={{ cursor: 'var(--cursor-link)' }}></div>
        <div style={{ cursor: 'var(--cursor-wait)' }}></div>
        <div style={{ cursor: 'var(--cursor-busy)' }}></div>
      </div>

      <Analytics />
    </div>
  );
}

function App() {
  useEffect(() => {
    setCursorVariables();
  }, []);

  if (window.location.pathname.startsWith('/editor')) {
    return (
      <React.Suspense fallback={<div style={{ padding: '2rem', color: '#fff', background: '#000', height: '100vh' }}>Loading Editor...</div>}>
        <Editor />
      </React.Suspense>
    );
  }

  return (
    <SystemProvider>
      <DesktopProvider>
        <WindowProvider>
          <ErrorBoundary name="Desktop" onClose={() => window.location.reload()}>
            <AppShell />
          </ErrorBoundary>
        </WindowProvider>
      </DesktopProvider>
    </SystemProvider>
  );
}

export default App;
