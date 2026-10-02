import { useMemo } from 'react';
import { useWindowStore } from '../../stores/useWindowStore';

export const useWindowSystem = () => {
  const openWindows = useWindowStore((s) => s.openWindows);
  const focusedWindow = useWindowStore((s) => s.focusedWindow);
  const minimizedWindows = useWindowStore((s) => s.minimizedWindows);
  const minimizedWindowIds = useWindowStore((s) => s.minimizedWindowIds);
  const loadingWindows = useWindowStore((s) => s.loadingWindows);

  const handleItemDoubleClick = useWindowStore((s) => s.handleItemDoubleClick);
  const handleMinimizeWindow = useWindowStore((s) => s.handleMinimizeWindow);
  const handleRestoreWindow = useWindowStore((s) => s.handleRestoreWindow);
  const handleCloseWindow = useWindowStore((s) => s.handleCloseWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const updateWindowOriginRect = useWindowStore((s) => s.updateWindowOriginRect);

  return useMemo(
    () => ({
      openWindows,
      focusedWindow,
      minimizedWindows,
      minimizedWindowIds,
      loadingWindows,
      handleItemDoubleClick,
      handleMinimizeWindow,
      handleRestoreWindow,
      handleCloseWindow,
      focusWindow,
      updateWindowOriginRect,
    }),
    [
      openWindows,
      focusedWindow,
      minimizedWindows,
      minimizedWindowIds,
      loadingWindows,
      handleItemDoubleClick,
      handleMinimizeWindow,
      handleRestoreWindow,
      handleCloseWindow,
      focusWindow,
      updateWindowOriginRect,
    ]
  );
};
