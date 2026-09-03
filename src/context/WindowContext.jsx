/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useWindowSystem, useZoomAnimationManager } from '../hooks/window';

export const WindowContext = createContext(null);

export const WindowProvider = ({ children }) => {
  const {
    openWindows,
    focusedWindow,
    minimizedWindows,
    minimizedWindowIds,
    loadingWindows,
    handleItemDoubleClick,
    handleMinimizeWindow,
    handleRestoreWindow: handleRestoreWindowBase,
    handleCloseWindow: handleCloseWindowBase,
    focusWindow,
    updateWindowOriginRect,
  } = useWindowSystem();

  const { zoomAnimations, triggerZoomAnimation, handleAnimationComplete } =
    useZoomAnimationManager();

  const [windowLoadingStates, setWindowLoadingStates] = useState({});

  const handleRestoreWindow = useCallback(
    (windowId, extra = {}) => {
      if (extra?.originRect) {
        updateWindowOriginRect(windowId, extra.originRect);
      }
      handleRestoreWindowBase(windowId);
    },
    [handleRestoreWindowBase, updateWindowOriginRect]
  );

  const handleCloseWindow = useCallback(
    (windowId) => {
      handleCloseWindowBase(windowId);
      setWindowLoadingStates((prev) => {
        const newStates = { ...prev };
        delete newStates[windowId];
        return newStates;
      });
    },
    [handleCloseWindowBase]
  );

  const handleWindowLoadingChange = useCallback((windowId, isLoading) => {
    setWindowLoadingStates((prev) => ({
      ...prev,
      [windowId]: isLoading,
    }));
  }, []);

  const minimizeAll = useCallback(() => {
    openWindows.forEach((win) => {
      if (!minimizedWindowIds.has(win.id)) {
        handleMinimizeWindow(win.id, { title: win.title, icon: win.iconSrc });
      }
    });
  }, [openWindows, minimizedWindowIds, handleMinimizeWindow]);

  const closeAll = useCallback(() => {
    [...openWindows].forEach((win) => {
      handleCloseWindow(win.id);
    });
  }, [openWindows, handleCloseWindow]);

  // Derived states
  const hasFullScreenWindow = useMemo(() => {
    return openWindows.some(
      (win) =>
        win.isFullScreen &&
        !minimizedWindowIds.has(win.id) &&
        windowLoadingStates[win.id] === false
    );
  }, [openWindows, minimizedWindowIds, windowLoadingStates]);

  const hasActiveWindows = useMemo(() => {
    const hasVisibleContent = openWindows.some(
      (win) => win.isDialog || windowLoadingStates[win.id] === false
    );
    const hasMinimized = minimizedWindows.length > 0;
    return hasVisibleContent || hasMinimized;
  }, [openWindows, windowLoadingStates, minimizedWindows.length]);

  const value = {
    openWindows,
    focusedWindow,
    minimizedWindows,
    minimizedWindowIds,
    loadingWindows,
    windowLoadingStates,
    handleItemDoubleClick,
    handleMinimizeWindow,
    handleRestoreWindow,
    handleCloseWindow,
    focusWindow,
    updateWindowOriginRect,
    handleWindowLoadingChange,
    minimizeAll,
    closeAll,
    zoomAnimations,
    triggerZoomAnimation,
    handleAnimationComplete,
    hasFullScreenWindow,
    hasActiveWindows,
  };

  return (
    <WindowContext.Provider value={value}>
      {children}
    </WindowContext.Provider>
  );
};

export const useWindowContext = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowContext must be used within a WindowProvider');
  }
  return context;
};

export default WindowContext;
