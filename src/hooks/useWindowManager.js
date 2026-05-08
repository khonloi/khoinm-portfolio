import { useState, useCallback, useMemo, useRef } from 'react';
import { desktopItems } from "../config/programConfig";
import { playSound } from '../data/sounds';

// Flatten desktop items for faster lookup - created at module level
const flattenDesktopItems = (items) => {
  const flatMap = new Map();
  const processItems = (itemList) => {
    itemList.forEach(item => {
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

export const useWindowManager = () => {
  const [minimizedWindows, setMinimizedWindows] = useState([]);
  const [loadingWindows, setLoadingWindows] = useState(new Set());
  const loadingTimeoutsRef = useRef(new Map());

  const minimizedWindowIds = useMemo(
    () => new Set(minimizedWindows.map(w => w.id)),
    [minimizedWindows]
  );
  
  const playWindowSound = useCallback(async (soundType) => {
    try {
      await playSound(soundType);
    } catch (error) {
      console.warn('Failed to play window sound:', error);
    }
  }, []);
  
  const lastCloseTimeRef = useRef(0);
  const lastTrackedIdRef = useRef(null);
  const lastTrackedTimeRef = useRef(0);

  const handleItemDoubleClick = useCallback((idOrItem, label, openWindows, openWindow, focusWindow, options = {}) => {
    const { skipTracking = false } = options;
    const now = Date.now();
    
    // Support both ID string (for legacy/static) and full item object (for dynamic)
    const item = typeof idOrItem === 'string' ? desktopItemsMap.get(idOrItem) : idOrItem;
    const id = typeof idOrItem === 'string' ? idOrItem : idOrItem.id;
    const itemLabel = label || item?.label;
    
    if (!item) {
      console.warn(`Item with id ${id} not found`);
      return;
    }

    // 1. Click-through prevention
    if (now - lastCloseTimeRef.current < 300 && !skipTracking) {
      return;
    }

    // 2. Event deduplication
    const isDeduplication = (id === lastTrackedIdRef.current && now - lastTrackedTimeRef.current < 200);
    
    if (!skipTracking && !isDeduplication) {
      lastTrackedIdRef.current = id;
      lastTrackedTimeRef.current = now;
    }

    // 3. Action handling
    if (item.link) {
      if (!isDeduplication) {
        window.open(item.link, "_blank", "noopener,noreferrer");
        playWindowSound('open');
        lastTrackedIdRef.current = id;
        lastTrackedTimeRef.current = now;
      }
      return;
    }

    const isWindowOpen = openWindows.some(win => win.id === id);
    const isWindowMinimized = minimizedWindowIds.has(id);

    if (isWindowOpen) {
      if (isWindowMinimized) {
        setMinimizedWindows(prev => prev.filter(w => w.id !== id));
        setTimeout(() => focusWindow(id), 10);
        playWindowSound('maximize');
      } else {
        focusWindow(id);
      }
      return;
    }

    setLoadingWindows(prev => new Set(prev).add(id));

    const existingTimeout = loadingTimeoutsRef.current.get(id);
    if (existingTimeout) clearTimeout(existingTimeout);

    const timeoutId = setTimeout(() => {
      setLoadingWindows(prev => {
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
      folderId: item.type === "folder" ? id : undefined,
      isMaximizable: item.isMaximizable ?? true,
      isMaximized: item.isMaximized ?? false,
      isFullScreen: item.isFullScreen ?? false,
      isDialog: item.isDialog ?? false,
      iconSrc: item.iconSrc,
      filetype: item.filetype,
      fileContent: item.content || item.fileContent,
    });
  }, [minimizedWindowIds, playWindowSound]);

  const handleMinimizeWindow = useCallback(async (windowId, windowData) => {
    setMinimizedWindows(prev => {
      if (prev.some(w => w.id === windowId)) return prev;
      return [...prev, {
        id: windowId,
        title: windowData.title,
        icon: windowData.iconSrc,
      }];
    });

    await playWindowSound('minimize');
  }, [playWindowSound]);

  const handleRestoreWindow = useCallback(async (windowId, focusWindow) => {
    setMinimizedWindows(prev => prev.filter(w => w.id !== windowId));
    setTimeout(() => focusWindow(windowId), 10);
    await playWindowSound('maximize');
  }, [playWindowSound]);

  const handleCloseWindow = useCallback((windowId, closeWindow) => {
    lastCloseTimeRef.current = Date.now();
    closeWindow(windowId);
    setMinimizedWindows(prev => prev.filter(w => w.id !== windowId));
  }, []);

  return useMemo(() => ({
    minimizedWindows,
    loadingWindows,
    handleItemDoubleClick,
    handleMinimizeWindow,
    handleRestoreWindow,
    handleCloseWindow
  }), [
    minimizedWindows, 
    loadingWindows, 
    handleItemDoubleClick, 
    handleMinimizeWindow, 
    handleRestoreWindow, 
    handleCloseWindow
  ]);
};