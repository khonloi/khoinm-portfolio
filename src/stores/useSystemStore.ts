import { create } from 'zustand';
import networkIcon from '../assets/icons/win-local-area-network.ico';
import { playSound } from '../data/sounds';

export interface SystemStoreState {
  isFullScreen: boolean;
  isBSODActive: boolean;
  isOnline: boolean;
  showOfflineDialog: boolean;
  networkIcon: string;
  isLoading: boolean;
  isDelaying: boolean;
  progress: number;
  menuBarVisible: boolean;
  isShuttingDown: boolean;
  shutdownStage: number;

  // Actions
  setIsFullScreen: (active: boolean) => void;
  triggerBSOD: () => void;
  closeBSOD: () => void;
  setIsOnline: (online: boolean) => void;
  setShowOfflineDialog: (show: boolean) => void;
  setLoadingState: (loadingState: Partial<{
    isLoading: boolean;
    isDelaying: boolean;
    progress: number;
    menuBarVisible: boolean;
  }>) => void;
  skipLoading: () => void;
  startShutdown: () => void;
  setShutdownStage: (stage: number) => void;
  reset: () => void;
}

let shutdownTimers: ReturnType<typeof setTimeout>[] = [];

const clearShutdownTimers = () => {
  shutdownTimers.forEach((timer) => clearTimeout(timer));
  shutdownTimers = [];
};

const initialSystemState = {
  isFullScreen: false,
  isBSODActive: false,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  showOfflineDialog: false,
  networkIcon,
  isLoading: true,
  isDelaying: false,
  progress: 0,
  menuBarVisible: false,
  isShuttingDown: false,
  shutdownStage: 0,
};

export const useSystemStore = create<SystemStoreState>((set) => ({
  ...initialSystemState,

  reset: () => {
    clearShutdownTimers();
    set({
      ...initialSystemState,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    });
  },

  setIsFullScreen: (active: boolean) => {
    set({ isFullScreen: active });
  },

  triggerBSOD: () => {
    set({ isBSODActive: true });
  },

  closeBSOD: () => {
    set({ isBSODActive: false });
  },

  setIsOnline: (online: boolean) => {
    set((state) => ({
      isOnline: online,
      showOfflineDialog: !online ? true : state.showOfflineDialog,
    }));
  },

  setShowOfflineDialog: (show: boolean) => {
    set({ showOfflineDialog: show });
  },

  setLoadingState: (loadingState) => {
    set((state) => ({ ...state, ...loadingState }));
  },

  skipLoading: () => {
    set({
      isLoading: false,
      isDelaying: false,
      menuBarVisible: true,
      progress: 100,
    });
  },

  startShutdown: () => {
    clearShutdownTimers();
    set({ isShuttingDown: true, shutdownStage: 0 });
    playSound('logoff').catch(() => {});

    const timer1 = setTimeout(() => {
      set({ shutdownStage: 1 });
    }, 3000);

    const timer2 = setTimeout(() => {
      set({ shutdownStage: 2 });
    }, 6000);

    shutdownTimers.push(timer1, timer2);
  },

  setShutdownStage: (stage: number) => {
    set({ shutdownStage: stage });
  },
}));
