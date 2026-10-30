import { useEffect } from 'react';
import { useCMSContent } from './useDesktopItems';
import { useDesktopStore } from '../stores/useDesktopStore';

/**
 * Headless bootstrap hook for desktop CMS sync and layout resizing.
 * Replaces the legacy DesktopContext provider.
 */
export const useDesktopBootstrap = () => {
  const { folderMap, cdDrive, customShortcuts, loading: cmsLoading } = useCMSContent();

  // Sync CMS content into desktop store
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
};

