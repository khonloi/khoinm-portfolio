import { useState, useCallback, useMemo, useRef } from 'react';
import { desktopItems } from '../config/programConfig';
import { playSound } from '../data/sounds';

// Flatten desktop items for faster lookup
const flattenDesktopItems = (items) => {
  const flatMap = new Map();
  const processItems = (itemList) => {
    itemList.forEach((item) => {
      flatMap.set(item.id, item);
      if (item.contents) {
        processItems(item.contents);
      }
    });
  };
  processItems(items);
  return flatMap;
};

const desktopItemsMap = flattenDesktopItems(desktopItems);

export const useWindowSystem = () => {
  // State from useWindow.js
  const [openWindows, setOpenWindows] = useState([]);
  const [focusedWindow, setFocusedWindow] = useState(null);
  const nextZIndexRef = useRef(1000);

  // State from useWindowManager.js
  const [minimizedWindows, setMinimizedWindows] = useState([]);
  const [loadingWindows, setLoadingWindows] = useState(new Set());
  const loadingTimeoutsRef = useRef(new Map());
  const lastCloseTimeRef = useRef(0);
  const lastTrackedIdRef = useRef(null);
  const lastTrackedTimeRef = useRef(0);

  const minimizedWindowIds = useMemo(
    () => new Set(minimizedWindows.map((w) => w.id)),
    [minimizedWindows]
  );

  const playWindowSound = useCallback(async (soundType) => {
    try {
      await playSound(soundType);
    } catch {
      console.warn('Failed to play window sound');
    }
  }, []);

  const focusWindow = useCallback((id) => {
    setFocusedWindow((prevFocused) => {
      if (prevFocused === id) return prevFocused;
      return id;
    });

    setOpenWindows((prev) => {
      const windowIndex = prev.findIndex((win) => win.id === id);
      if (windowIndex === -1) return prev;

      const newZIndex = nextZIndexRef.current + 1;
      nextZIndexRef.current = newZIndex;

      const newWindows = [...prev];
      newWindows[windowIndex] = { ...newWindows[windowIndex], zIndex: newZIndex };
      return newWindows;
    });
  }, []);

  const openWindow = useCallback((windowData) => {
    setOpenWindows((prev) => {
      const existingWindow = prev.find((win) => win.id === windowData.id);
      if (existingWindow) {
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
        originRect: windowData.originRect || null,
        initialPosition: { x: 0, y: 0, shouldCenter: true },
        zIndex: newZIndex,
      };

      setFocusedWindow(windowData.id);
      return [...prev, newWindow];
    });
  }, []);

  const updateWindowOriginRect = useCallback((id, originRect) => {
    setOpenWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, originRect } : win))
    );
  }, []);

  const handleItemDoubleClick = useCallback(
    (idOrItem, label, options = {}) => {
      const { skipTracking = false } = options;
      const now = Date.now();

      const item = typeof idOrItem === 'string' ? desktopItemsMap.get(idOrItem) : idOrItem;
      const id = typeof idOrItem === 'string' ? idOrItem : idOrItem.id;
      const itemLabel = label || item?.label;

      if (!item) {
        console.warn(`Item with id ${id} not found`);
        return;
      }

      if (now - lastCloseTimeRef.current < 300 && !skipTracking) {
        return;
      }

      const isDeduplication = id === lastTrackedIdRef.current && now - lastTrackedTimeRef.current < 200;

      if (!skipTracking && !isDeduplication) {
        lastTrackedIdRef.current = id;
        lastTrackedTimeRef.current = now;
      }

      if (item.link) {
        if (!isDeduplication) {
          window.open(item.link, '_blank', 'noopener,noreferrer');
          playWindowSound('open');
          lastTrackedIdRef.current = id;
          lastTrackedTimeRef.current = now;
        }
        return;
      }

      const isWindowOpen = openWindows.some((win) => win.id === id);
      const isWindowMinimized = minimizedWindowIds.has(id);

      if (isWindowOpen) {
        if (isWindowMinimized) {
          setMinimizedWindows((prev) => prev.filter((w) => w.id !== id));
          setTimeout(() => focusWindow(id), 10);
          playWindowSound('maximize');
        } else {
          focusWindow(id);
        }
        return;
      }

      setLoadingWindows((prev) => new Set(prev).add(id));

      const existingTimeout = loadingTimeoutsRef.current.get(id);
      if (existingTimeout) clearTimeout(existingTimeout);

      const timeoutId = setTimeout(() => {
        setLoadingWindows((prev) => {
          if (!prev.has(id)) return prev;
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        loadingTimeoutsRef.current.delete(id);
      }, 2000);

      loadingTimeoutsRef.current.set(id, timeoutId);

      openWindow({
        id,
        title: itemLabel,
        type: item.type,
        folderId: item.type === 'folder' ? id : undefined,
        isMaximizable: item.isMaximizable ?? true,
        isMaximized: item.isMaximized ?? false,
        isFullScreen: item.isFullScreen ?? false,
        isDialog: item.isDialog ?? false,
        iconSrc: item.iconSrc,
        filetype: item.filetype,
        fileContent: item.content || item.fileContent,
        originRect: options.originRect,
      });
    },
    [minimizedWindowIds, playWindowSound, openWindows, openWindow, focusWindow]
  );

  const handleMinimizeWindow = useCallback(
    async (windowId, windowData) => {
      setMinimizedWindows((prev) => {
        if (prev.some((w) => w.id === windowId)) return prev;
        return [
          ...prev,
          {
            id: windowId,
            title: windowData.title,
            icon: windowData.icon,
          },
        ];
      });

      await playWindowSound('minimize');
    },
    [playWindowSound]
  );

  const handleRestoreWindow = useCallback(
    async (windowId) => {
      setMinimizedWindows((prev) => prev.filter((w) => w.id !== windowId));
      setTimeout(() => focusWindow(windowId), 10);
      await playWindowSound('maximize');
    },
    [playWindowSound, focusWindow]
  );

  const handleCloseWindow = useCallback((windowId) => {
    lastCloseTimeRef.current = Date.now();
    
    // Close Window Logic
    setOpenWindows((prev) => {
      const remainingWindows = prev.filter((win) => win.id !== windowId);
      
      if (remainingWindows.length === 0) {
        setFocusedWindow(null);
      } else {
        setFocusedWindow((prevFocused) => {
          if (prevFocused !== windowId) return prevFocused;
          const topWindow = remainingWindows.reduce((highest, current) => 
            current.zIndex > highest.zIndex ? current : highest, remainingWindows[0]);
          return topWindow.id;
        });
      }
      
      return remainingWindows;
    });

    setMinimizedWindows((prev) => prev.filter((w) => w.id !== windowId));
  }, []);

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
