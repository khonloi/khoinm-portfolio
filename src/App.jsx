import React, { useState, useCallback, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Desktop from './components/Desktop';
import BSOD from './components/BSOD';
import Dialog from './components/Dialog';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import networkIcon from './assets/icons/win-local-area-network.ico';
import { setCursorVariables } from './data/cursors';
const Editor = React.lazy(() => import('./components/Editor'));

function App() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isBSODActive, setIsBSODActive] = useState(false);

  const isOnline = useNetworkStatus();
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineDialog(true);
    }
  }, [isOnline]);

  // Initialize cursor variables and preload critical offline assets on mount
  useEffect(() => {
    setCursorVariables();
    const img = new Image();
    img.src = networkIcon;
  }, []);

  const handleFullScreenChange = useCallback((isFullScreenActive) => {
    setIsFullScreen(isFullScreenActive);
  }, []);

  const triggerBSOD = useCallback(() => {
    setIsBSODActive(true);
  }, []);

  if (window.location.pathname.startsWith('/editor')) {
    return (
      <React.Suspense fallback={<div style={{ padding: '2rem', color: '#fff', background: '#000', height: '100vh' }}>Loading Editor...</div>}>
        <Editor />
      </React.Suspense>
    );
  }

  return (
    <div className={`App ${isFullScreen ? 'fullscreen' : ''}`}>
      <Desktop
        onFullScreenChange={handleFullScreenChange}
        onTriggerBSOD={triggerBSOD}
      />

      <div className="mobile-safe-buffer" />


      {isBSODActive && <BSOD onClose={() => setIsBSODActive(false)} />}

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
            onClick: () => setShowOfflineDialog(false)
          }
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

export default App;
