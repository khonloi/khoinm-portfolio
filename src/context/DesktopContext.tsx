/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useCMSContent } from '../hooks/useDesktopItems';
import { useDesktopStore } from '../stores/useDesktopStore';
import type { DesktopContextType } from '../types';

export const DesktopContext = createContext<DesktopContextType | null>(null);

export interface DesktopProviderProps {
  children: React.ReactNode;
}

export const DesktopProvider: React.FC<DesktopProviderProps> = ({ children }) => {
  const { folderMap, cdDrive, customShortcuts, loading: cmsLoading } = useCMSContent();
  const store = useDesktopStore();

  // Sync CMS content into store
  useEffect(() => {
    useDesktopStore.getState().setCMSContent({
      folderMap,
      cdDrive,
      customShortcuts,
      loading: cmsLoading,
    });
  }, [folderMap, cdDrive, customShortcuts, cmsLoading]);

  // Handle window resize for right-aligned items
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        useDesktopStore.getState().handleResize(window.innerWidth);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  const value: DesktopContextType = useMemo(
    () => ({
      allDesktopItems: store.allDesktopItems,
      itemPositions: store.itemPositions,
      handleItemPositionChange: store.handleItemPositionChange,
      resetDefaultPositions: store.resetDefaultPositions,
      selectedIcon: store.selectedIcon,
      setSelectedIcon: store.setSelectedIcon,
      folderDataMap: store.folderDataMap,
      cdDrive: store.cdDrive,
      cmsLoading: store.cmsLoading,
    }),
    [
      store.allDesktopItems,
      store.itemPositions,
      store.handleItemPositionChange,
      store.resetDefaultPositions,
      store.selectedIcon,
      store.setSelectedIcon,
      store.folderDataMap,
      store.cdDrive,
      store.cmsLoading,
    ]
  );

  return (
    <DesktopContext.Provider value={value}>
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktopContext = (): DesktopContextType => {
  const context = useContext(DesktopContext);
  const store = useDesktopStore();

  const fallbackValue: DesktopContextType = useMemo(
    () => ({
      allDesktopItems: store.allDesktopItems,
      itemPositions: store.itemPositions,
      handleItemPositionChange: store.handleItemPositionChange,
      resetDefaultPositions: store.resetDefaultPositions,
      selectedIcon: store.selectedIcon,
      setSelectedIcon: store.setSelectedIcon,
      folderDataMap: store.folderDataMap,
      cdDrive: store.cdDrive,
      cmsLoading: store.cmsLoading,
    }),
    [
      store.allDesktopItems,
      store.itemPositions,
      store.handleItemPositionChange,
      store.resetDefaultPositions,
      store.selectedIcon,
      store.setSelectedIcon,
      store.folderDataMap,
      store.cdDrive,
      store.cmsLoading,
    ]
  );

  return context || fallbackValue;
};

export default DesktopContext;
