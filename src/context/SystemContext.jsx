/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLoadingScreen } from '../hooks/useLoadingScreen';
import { useShutdown } from '../hooks/useShutdown';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import networkIcon from '../assets/icons/win-local-area-network.ico';

export const SystemContext = createContext(null);

export const SystemProvider = ({ children, onFullScreenChange, onTriggerBSOD }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isBSODActive, setIsBSODActive] = useState(false);
  const isOnline = useNetworkStatus();
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineDialog(true);
    }
  }, [isOnline]);

  const {
    isLoading,
    isDelaying,
    progress,
    menuBarVisible,
    skipLoading,
  } = useLoadingScreen();

  const {
    isShuttingDown,
    shutdownStage,
    startShutdown,
  } = useShutdown();

  const handleFullScreenChange = useCallback((active) => {
    setIsFullScreen(active);
    onFullScreenChange?.(active);
  }, [onFullScreenChange]);

  const triggerBSOD = useCallback(() => {
    setIsBSODActive(true);
    onTriggerBSOD?.();
  }, [onTriggerBSOD]);

  const closeBSOD = useCallback(() => {
    setIsBSODActive(false);
  }, []);

  const value = {
    isFullScreen,
    setIsFullScreen: handleFullScreenChange,
    isBSODActive,
    triggerBSOD,
    closeBSOD,
    isOnline,
    showOfflineDialog,
    setShowOfflineDialog,
    networkIcon,
    isLoading,
    isDelaying,
    progress,
    menuBarVisible,
    skipLoading,
    isShuttingDown,
    shutdownStage,
    startShutdown,
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};

export default SystemContext;
