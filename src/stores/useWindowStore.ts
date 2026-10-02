import { create } from 'zustand';
import { desktopItems } from '../config/programConfig';
import { playSound } from '../data/sounds';
import type { DesktopItem, WindowState, MinimizedWindow, Rect, ZoomAnimation, TriggerZoomAnimationOptions } from '../types';

// Flatten desktop items for faster lookup
const flattenDesktopItems = (items: DesktopItem[]) => {
  const flatMap = new Map<string, DesktopItem>();
  const processItems = (itemList: DesktopItem[]) => {
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

export interface WindowStoreState {
  openWindows: WindowState[];
  focusedWindow: string | null;
  minimizedWindows: MinimizedWindow[];
  minimizedWindowIds: Set<string>;
  loadingWindows: Set<string>;
  windowLoadingStates: Record<string, boolean>;
  zoomAnimations: ZoomAnimation[];

  // Actions
  openWindow: (windowData: Partial<WindowState> & { id: string; title?: string }) => void;
  focusWindow: (id: string) => void;
  handleCloseWindow: (windowId: string) => void;
  handleMinimizeWindow: (windowId: string, windowData: { title?: string; icon?: string }) => Promise<void>;
  handleRestoreWindow: (windowId: string, extra?: { originRect?: Rect }) => Promise<void>;
  handleItemDoubleClick: (
    idOrItem: string | DesktopItem,
    label?: string,
    options?: { skipTracking?: boolean; originRect?: Rect }
  ) => void;
  updateWindowOriginRect: (id: string, originRect: Rect) => void;
  handleWindowLoadingChange: (windowId: string, isLoading: boolean) => void;
  minimizeAll: () => void;
  closeAll: () => void;

  // Zoom Animations
  triggerZoomAnimation: (options: TriggerZoomAnimationOptions) => string;
  handleAnimationComplete: (id: string) => void;
  cancelZoomAnimation: (id: string) => void;

  // Reset state (useful for tests and cleanup)
  reset: () => void;
}

// Module-level state tracking
let nextZIndex = 1000;
const loadingTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const animationCallbacks = new Map<string, () => void>();
let lastCloseTime = 0;
let lastTrackedId: string | null = null;
let lastTrackedTime = 0;

const initialWindowState = {
  openWindows: [] as WindowState[],
  focusedWindow: null as string | null,
  minimizedWindows: [] as MinimizedWindow[],
  minimizedWindowIds: new Set<string>(),
  loadingWindows: new Set<string>(),
  windowLoadingStates: {} as Record<string, boolean>,
  zoomAnimations: [] as ZoomAnimation[],
};

export const useWindowStore = create<WindowStoreState>((set, get) => ({
  ...initialWindowState,

  reset: () => {
    nextZIndex = 1000;
    loadingTimeouts.forEach((timeout) => clearTimeout(timeout));
    loadingTimeouts.clear();
    animationCallbacks.clear();
    lastCloseTime = 0;
    lastTrackedId = null;
    lastTrackedTime = 0;
    set({
      ...initialWindowState,
      minimizedWindowIds: new Set<string>(),
      loadingWindows: new Set<string>(),
      windowLoadingStates: {},
      zoomAnimations: [],
    });
  },

  focusWindow: (id: string) => {
    nextZIndex += 1;
    const currentZIndex = nextZIndex;

    set((state) => {
      const windowIndex = state.openWindows.findIndex((win) => win.id === id);
      if (windowIndex === -1) {
        return { focusedWindow: id };
      }

      const updatedWindows = [...state.openWindows];
      updatedWindows[windowIndex] = {
        ...updatedWindows[windowIndex],
        zIndex: currentZIndex,
      };

      return {
        focusedWindow: id,
        openWindows: updatedWindows,
      };
    });
  },

  openWindow: (windowData: Partial<WindowState> & { id: string; title?: string }) => {
    nextZIndex += 1;
    const currentZIndex = nextZIndex;

    set((state) => {
      const existing = state.openWindows.find((win) => win.id === windowData.id);
      if (existing) {
        return state;
      }

      const newWindow: WindowState = {
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
        zIndex: currentZIndex,
      };

      return {
        openWindows: [...state.openWindows, newWindow],
        focusedWindow: windowData.id,
      };
    });
  },

  updateWindowOriginRect: (id: string, originRect: Rect) => {
    set((state) => ({
      openWindows: state.openWindows.map((win) =>
        win.id === id ? { ...win, originRect } : win
      ),
    }));
  },

  handleItemDoubleClick: (
    idOrItem: string | DesktopItem,
    label?: string,
    options: { skipTracking?: boolean; originRect?: Rect } = {}
  ) => {
    const { skipTracking = false, originRect } = options;
    const now = Date.now();

    const item = typeof idOrItem === 'string' ? desktopItemsMap.get(idOrItem) : idOrItem;
    const id = typeof idOrItem === 'string' ? idOrItem : idOrItem.id;
    const itemLabel = label || item?.label;

    if (!item) {
      console.warn(`Item with id ${id} not found`);
      return;
    }

    if (now - lastCloseTime < 300 && !skipTracking) {
      return;
    }

    const isDeduplication = id === lastTrackedId && now - lastTrackedTime < 200;

    if (!skipTracking && !isDeduplication) {
      lastTrackedId = id;
      lastTrackedTime = now;
    }

    if (item.link) {
      if (!isDeduplication) {
        window.open(item.link, '_blank', 'noopener,noreferrer');
        playSound('open').catch(() => {});
        lastTrackedId = id;
        lastTrackedTime = now;
      }
      return;
    }

    const state = get();
    const isWindowOpen = state.openWindows.some((win) => win.id === id);
    const isWindowMinimized = state.minimizedWindowIds.has(id);

    if (isWindowOpen) {
      if (isWindowMinimized) {
        const nextMinimized = state.minimizedWindows.filter((w) => w.id !== id);
        const nextMinimizedIds = new Set(nextMinimized.map((w) => w.id));
        set({
          minimizedWindows: nextMinimized,
          minimizedWindowIds: nextMinimizedIds,
        });
        setTimeout(() => get().focusWindow(id), 10);
        playSound('maximize').catch(() => {});
      } else {
        get().focusWindow(id);
      }
      return;
    }

    // Set loading window state
    set((s) => ({
      loadingWindows: new Set(s.loadingWindows).add(id),
    }));

    const existingTimeout = loadingTimeouts.get(id);
    if (existingTimeout) clearTimeout(existingTimeout);

    const timeoutId = setTimeout(() => {
      set((s) => {
        if (!s.loadingWindows.has(id)) return s;
        const newSet = new Set(s.loadingWindows);
        newSet.delete(id);
        return { loadingWindows: newSet };
      });
      loadingTimeouts.delete(id);
    }, 2000);

    loadingTimeouts.set(id, timeoutId);

    get().openWindow({
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
      originRect,
    });
  },

  handleMinimizeWindow: async (
    windowId: string,
    windowData: { title?: string; icon?: string }
  ) => {
    set((state) => {
      if (state.minimizedWindows.some((w) => w.id === windowId)) return state;
      const nextMinimized = [
        ...state.minimizedWindows,
        {
          id: windowId,
          title: windowData.title,
          icon: windowData.icon,
        },
      ];
      return {
        minimizedWindows: nextMinimized,
        minimizedWindowIds: new Set(nextMinimized.map((w) => w.id)),
      };
    });

    try {
      await playSound('minimize');
    } catch {
      // sound playback failed silently
    }
  },

  handleRestoreWindow: async (windowId: string, extra: { originRect?: Rect } = {}) => {
    if (extra?.originRect) {
      get().updateWindowOriginRect(windowId, extra.originRect);
    }

    set((state) => {
      const nextMinimized = state.minimizedWindows.filter((w) => w.id !== windowId);
      return {
        minimizedWindows: nextMinimized,
        minimizedWindowIds: new Set(nextMinimized.map((w) => w.id)),
      };
    });

    setTimeout(() => get().focusWindow(windowId), 10);

    try {
      await playSound('maximize');
    } catch {
      // sound playback failed silently
    }
  },

  handleCloseWindow: (windowId: string) => {
    lastCloseTime = Date.now();

    set((state) => {
      const remainingWindows = state.openWindows.filter((win) => win.id !== windowId);
      let nextFocused = state.focusedWindow;

      if (remainingWindows.length === 0) {
        nextFocused = null;
      } else if (state.focusedWindow === windowId) {
        const topWindow = remainingWindows.reduce(
          (highest, current) => (current.zIndex > highest.zIndex ? current : highest),
          remainingWindows[0]
        );
        nextFocused = topWindow.id;
      }

      const nextMinimized = state.minimizedWindows.filter((w) => w.id !== windowId);
      const nextLoadingStates = { ...state.windowLoadingStates };
      delete nextLoadingStates[windowId];

      return {
        openWindows: remainingWindows,
        focusedWindow: nextFocused,
        minimizedWindows: nextMinimized,
        minimizedWindowIds: new Set(nextMinimized.map((w) => w.id)),
        windowLoadingStates: nextLoadingStates,
      };
    });
  },

  handleWindowLoadingChange: (windowId: string, isLoading: boolean) => {
    set((state) => ({
      windowLoadingStates: {
        ...state.windowLoadingStates,
        [windowId]: isLoading,
      },
    }));
  },

  minimizeAll: () => {
    const { openWindows, minimizedWindowIds, handleMinimizeWindow } = get();
    openWindows.forEach((win) => {
      if (!minimizedWindowIds.has(win.id)) {
        handleMinimizeWindow(win.id, { title: win.title, icon: win.iconSrc ?? undefined });
      }
    });
  },

  closeAll: () => {
    const { openWindows, handleCloseWindow } = get();
    [...openWindows].forEach((win) => {
      handleCloseWindow(win.id);
    });
  },

  triggerZoomAnimation: ({
    id = Math.random().toString(36).substring(2, 9),
    fromRect,
    toRect,
    type = 'open',
    duration = 220,
    steps = 5,
    onComplete,
  }: TriggerZoomAnimationOptions) => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onComplete?.();
      return id;
    }

    const defaultOrigin: Rect = {
      x: typeof window !== 'undefined' ? window.innerWidth / 2 - 40 : 100,
      y: typeof window !== 'undefined' ? window.innerHeight / 2 - 48 : 100,
      width: 80,
      height: 96,
    };

    const defaultTarget: Rect = {
      x: typeof window !== 'undefined' ? (window.innerWidth - 400) / 2 : 100,
      y: typeof window !== 'undefined' ? (window.innerHeight - 300) / 2 : 100,
      width: 400,
      height: 300,
    };

    const finalFrom = fromRect || defaultOrigin;
    const finalTo = toRect || defaultTarget;

    if (onComplete) {
      animationCallbacks.set(id, onComplete);
    }

    const newAnim: ZoomAnimation = {
      id,
      fromRect: finalFrom,
      toRect: finalTo,
      type,
      duration,
      steps,
      startTime: performance.now(),
    };

    set((state) => ({
      zoomAnimations: [...state.zoomAnimations.filter((a) => a.id !== id), newAnim],
    }));

    return id;
  },

  handleAnimationComplete: (id: string) => {
    const cb = animationCallbacks.get(id);
    if (cb) {
      cb();
      animationCallbacks.delete(id);
    }
    set((state) => ({
      zoomAnimations: state.zoomAnimations.filter((a) => a.id !== id),
    }));
  },

  cancelZoomAnimation: (id: string) => {
    animationCallbacks.delete(id);
    set((state) => ({
      zoomAnimations: state.zoomAnimations.filter((a) => a.id !== id),
    }));
  },
}));

// Derived Selectors
export const selectHasFullScreenWindow = (state: WindowStoreState) =>
  state.openWindows.some(
    (win) =>
      win.isFullScreen &&
      !state.minimizedWindowIds.has(win.id) &&
      state.windowLoadingStates[win.id] === false
  );

export const selectHasActiveWindows = (state: WindowStoreState) => {
  const hasVisibleContent = state.openWindows.some(
    (win) => win.isDialog || state.windowLoadingStates[win.id] === false
  );
  return hasVisibleContent || state.minimizedWindows.length > 0;
};
