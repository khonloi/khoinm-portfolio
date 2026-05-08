import { useState, useCallback, useMemo, useRef } from 'react';

export const useWindow = () => {
  const [openWindows, setOpenWindows] = useState([]);
  const [focusedWindow, setFocusedWindow] = useState(null);
  const nextZIndexRef = useRef(1000);

  const focusWindow = useCallback((id) => {
    setFocusedWindow(prevFocused => {
      if (prevFocused === id) return prevFocused;
      return id;
    });
    
    setOpenWindows(prev => {
      const windowIndex = prev.findIndex(win => win.id === id);
      if (windowIndex === -1) return prev;

      const newZIndex = nextZIndexRef.current + 1;
      nextZIndexRef.current = newZIndex;
      
      const newWindows = [...prev];
      newWindows[windowIndex] = { ...newWindows[windowIndex], zIndex: newZIndex };
      return newWindows;
    });
  }, []);

  const openWindow = useCallback((windowData) => {
    setOpenWindows(prev => {
      const existingWindow = prev.find(win => win.id === windowData.id);
      if (existingWindow) {
        // We'll focus in a separate step or via the check above, 
        // but focusing inside a state setter is generally avoided.
        // The calling component should handle focusing existing windows.
        return prev;
      }

      const newZIndex = nextZIndexRef.current + 1;
      nextZIndexRef.current = newZIndex;
      
      const newWindow = {
        id: windowData.id,
        title: windowData.title,
        type: windowData.type || 'program',
        folderId: windowData.folderId || null,
        isMaximizable: windowData.isMaximizable !== false,
        isMaximized: windowData.isMaximized || false,
        isFullScreen: windowData.isFullScreen || false,
        isDialog: windowData.isDialog || false,
        iconSrc: windowData.iconSrc || null,
        filetype: windowData.filetype || null,
        fileContent: windowData.fileContent || null,
        initialPosition: { x: 0, y: 0, shouldCenter: true },
        zIndex: newZIndex,
      };

      setFocusedWindow(windowData.id);
      return [...prev, newWindow];
    });
  }, []);

  const closeWindow = useCallback((id) => {
    setOpenWindows(prev => {
      const remainingWindows = prev.filter(win => win.id !== id);
      
      if (remainingWindows.length === 0) {
        setFocusedWindow(null);
      } else {
        // Find top window to focus if closed window was focused
        setFocusedWindow(prevFocused => {
          if (prevFocused !== id) return prevFocused;
          const topWindow = remainingWindows.reduce((highest, current) => 
            current.zIndex > highest.zIndex ? current : highest, remainingWindows[0]);
          return topWindow.id;
        });
      }
      
      return remainingWindows;
    });
  }, []);

  return useMemo(() => ({
    openWindows,
    focusedWindow,
    openWindow,
    closeWindow,
    focusWindow,
  }), [openWindows, focusedWindow, openWindow, closeWindow, focusWindow]);
};