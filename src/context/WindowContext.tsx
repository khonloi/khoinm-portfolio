/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo } from 'react';
import {
  useWindowStore,
  selectHasFullScreenWindow,
  selectHasActiveWindows,
} from '../stores/useWindowStore';
import type { WindowContextType } from '../types';

export const WindowContext = createContext<WindowContextType | null>(null);

export interface WindowProviderProps {
  children: React.ReactNode;
}

export const WindowProvider: React.FC<WindowProviderProps> = ({ children }) => {
  const store = useWindowStore();
  const hasFullScreenWindow = selectHasFullScreenWindow(store);
  const hasActiveWindows = selectHasActiveWindows(store);

  const value: WindowContextType = useMemo(
    () => ({
      openWindows: store.openWindows,
      focusedWindow: store.focusedWindow,
      minimizedWindows: store.minimizedWindows,
      minimizedWindowIds: store.minimizedWindowIds,
      loadingWindows: store.loadingWindows,
      windowLoadingStates: store.windowLoadingStates,
      handleItemDoubleClick: store.handleItemDoubleClick,
      handleMinimizeWindow: store.handleMinimizeWindow,
      handleRestoreWindow: store.handleRestoreWindow,
      handleCloseWindow: store.handleCloseWindow,
      focusWindow: store.focusWindow,
      updateWindowOriginRect: store.updateWindowOriginRect,
      handleWindowLoadingChange: store.handleWindowLoadingChange,
      minimizeAll: store.minimizeAll,
      closeAll: store.closeAll,
      zoomAnimations: store.zoomAnimations,
      triggerZoomAnimation: store.triggerZoomAnimation,
      handleAnimationComplete: store.handleAnimationComplete,
      hasFullScreenWindow,
      hasActiveWindows,
    }),
    [store, hasFullScreenWindow, hasActiveWindows]
  );

  return (
    <WindowContext.Provider value={value}>
      {children}
    </WindowContext.Provider>
  );
};

export const useWindowContext = (): WindowContextType => {
  const context = useContext(WindowContext);
  const store = useWindowStore();
  const hasFullScreenWindow = selectHasFullScreenWindow(store);
  const hasActiveWindows = selectHasActiveWindows(store);

  const fallbackValue: WindowContextType = useMemo(
    () => ({
      openWindows: store.openWindows,
      focusedWindow: store.focusedWindow,
      minimizedWindows: store.minimizedWindows,
      minimizedWindowIds: store.minimizedWindowIds,
      loadingWindows: store.loadingWindows,
      windowLoadingStates: store.windowLoadingStates,
      handleItemDoubleClick: store.handleItemDoubleClick,
      handleMinimizeWindow: store.handleMinimizeWindow,
      handleRestoreWindow: store.handleRestoreWindow,
      handleCloseWindow: store.handleCloseWindow,
      focusWindow: store.focusWindow,
      updateWindowOriginRect: store.updateWindowOriginRect,
      handleWindowLoadingChange: store.handleWindowLoadingChange,
      minimizeAll: store.minimizeAll,
      closeAll: store.closeAll,
      zoomAnimations: store.zoomAnimations,
      triggerZoomAnimation: store.triggerZoomAnimation,
      handleAnimationComplete: store.handleAnimationComplete,
      hasFullScreenWindow,
      hasActiveWindows,
    }),
    [store, hasFullScreenWindow, hasActiveWindows]
  );

  return context || fallbackValue;
};

export default WindowContext;
