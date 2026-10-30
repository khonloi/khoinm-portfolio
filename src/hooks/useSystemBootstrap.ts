import { useEffect } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { useLoadingScreen } from './useLoadingScreen';
import { useSystemStore } from '../stores/useSystemStore';

/**
 * Headless bootstrap hook for system-level subscriptions and sync.
 * Replaces the legacy SystemContext provider.
 */
export const useSystemBootstrap = () => {
  const isOnline = useNetworkStatus();
  const loading = useLoadingScreen();

  // Sync network status into system store
  useEffect(() => {
    useSystemStore.getState().setIsOnline(isOnline);
  }, [isOnline]);

  // Sync loading screen state into system store
  useEffect(() => {
    useSystemStore.getState().setLoadingState({
      isLoading: loading.isLoading,
      isDelaying: loading.isDelaying,
      progress: loading.progress,
      menuBarVisible: loading.menuBarVisible,
    });
  }, [loading.isLoading, loading.isDelaying, loading.progress, loading.menuBarVisible]);
};

