import React, { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Desktop from './components/Desktop';
import BSOD from './components/BSOD';
import Dialog from './components/Dialog';
import { SystemProvider, useSystem } from './context/SystemContext';
import { DesktopProvider } from './context/DesktopContext';
import { WindowProvider } from './context/WindowContext';
import { setCursorVariables } from './data/cursors';

const Editor = React.lazy(() => import('./components/Editor'));

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
          <AppShell />
        </WindowProvider>
      </DesktopProvider>
    </SystemProvider>
  );
}

export default App;
