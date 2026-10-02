/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useCallback, useEffect, useMemo } from 'react';
import { useLoadingScreen } from '../hooks/useLoadingScreen';
import { useShutdown } from '../hooks/useShutdown';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useSystemStore } from '../stores/useSystemStore';
import type { SystemContextType } from '../types';

export const SystemContext = createContext<SystemContextType | null>(null);

export interface SystemProviderProps {
  children: React.ReactNode;
  onFullScreenChange?: (active: boolean) => void;
  onTriggerBSOD?: () => void;
}

export const SystemProvider: React.FC<SystemProviderProps> = ({
  children,
  onFullScreenChange,
  onTriggerBSOD,
}) => {
  const isOnline = useNetworkStatus();
  const loading = useLoadingScreen();
  const shutdown = useShutdown();
  const store = useSystemStore();

  // Sync network status
  useEffect(() => {
    useSystemStore.getState().setIsOnline(isOnline);
  }, [isOnline]);

  // Sync loading screen state
  useEffect(() => {
    useSystemStore.getState().setLoadingState({
      isLoading: loading.isLoading,
      isDelaying: loading.isDelaying,
      progress: loading.progress,
      menuBarVisible: loading.menuBarVisible,
    });
  }, [loading.isLoading, loading.isDelaying, loading.progress, loading.menuBarVisible]);

  // Sync shutdown state
  useEffect(() => {
    useSystemStore.getState().setShutdownStage(shutdown.shutdownStage);
  }, [shutdown.shutdownStage]);

  const handleFullScreenChange = useCallback(
    (active: boolean) => {
      useSystemStore.getState().setIsFullScreen(active);
      onFullScreenChange?.(active);
    },
    [onFullScreenChange]
  );

  const triggerBSOD = useCallback(() => {
    useSystemStore.getState().triggerBSOD();
    onTriggerBSOD?.();
  }, [onTriggerBSOD]);

  const closeBSOD = useCallback(() => {
    useSystemStore.getState().closeBSOD();
  }, []);

  const setShowOfflineDialog = useCallback((show: boolean) => {
    useSystemStore.getState().setShowOfflineDialog(show);
  }, []);

  const handleStartShutdown = useCallback(() => {
    useSystemStore.getState().startShutdown();
    shutdown.startShutdown();
  }, [shutdown]);

  const value: SystemContextType = useMemo(
    () => ({
      isFullScreen: store.isFullScreen,
      setIsFullScreen: handleFullScreenChange,
      isBSODActive: store.isBSODActive,
      triggerBSOD,
      closeBSOD,
      isOnline: store.isOnline,
      showOfflineDialog: store.showOfflineDialog,
      setShowOfflineDialog,
      networkIcon: store.networkIcon,
      isLoading: store.isLoading,
      isDelaying: store.isDelaying,
      progress: store.progress,
      menuBarVisible: store.menuBarVisible,
      skipLoading: loading.skipLoading,
      isShuttingDown: store.isShuttingDown || shutdown.isShuttingDown,
      shutdownStage: store.shutdownStage,
      startShutdown: handleStartShutdown,
    }),
    [
      store.isFullScreen,
      handleFullScreenChange,
      store.isBSODActive,
      triggerBSOD,
      closeBSOD,
      store.isOnline,
      store.showOfflineDialog,
      setShowOfflineDialog,
      store.networkIcon,
      store.isLoading,
      store.isDelaying,
      store.progress,
      store.menuBarVisible,
      loading.skipLoading,
      store.isShuttingDown,
      shutdown.isShuttingDown,
      store.shutdownStage,
      handleStartShutdown,
    ]
  );

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = (): SystemContextType => {
  const context = useContext(SystemContext);
  const store = useSystemStore();

  const fallbackValue: SystemContextType = useMemo(
    () => ({
      isFullScreen: store.isFullScreen,
      setIsFullScreen: store.setIsFullScreen,
      isBSODActive: store.isBSODActive,
      triggerBSOD: store.triggerBSOD,
      closeBSOD: store.closeBSOD,
      isOnline: store.isOnline,
      showOfflineDialog: store.showOfflineDialog,
      setShowOfflineDialog: store.setShowOfflineDialog,
      networkIcon: store.networkIcon,
      isLoading: store.isLoading,
      isDelaying: store.isDelaying,
      progress: store.progress,
      menuBarVisible: store.menuBarVisible,
      skipLoading: store.skipLoading,
      isShuttingDown: store.isShuttingDown,
      shutdownStage: store.shutdownStage,
      startShutdown: store.startShutdown,
    }),
    [
      store.isFullScreen,
      store.setIsFullScreen,
      store.isBSODActive,
      store.triggerBSOD,
      store.closeBSOD,
      store.isOnline,
      store.showOfflineDialog,
      store.setShowOfflineDialog,
      store.networkIcon,
      store.isLoading,
      store.isDelaying,
      store.progress,
      store.menuBarVisible,
      store.skipLoading,
      store.isShuttingDown,
      store.shutdownStage,
      store.startShutdown,
    ]
  );

  return context || fallbackValue;
};

export default SystemContext;
