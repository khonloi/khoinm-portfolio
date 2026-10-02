/**
 * Core domain types for the Hayami portfolio system
 */

export interface SkillCategory {
  id: string;
  title: string;
  skills: string[];
}

export interface Position {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface DesktopItem {
  id: string;
  label?: string;
  title?: string;
  icon?: string;
  iconSrc?: string;
  type?: 'file' | 'folder' | 'app' | 'link' | 'icon' | 'program';
  windowId?: string;
  url?: string;
  link?: string;
  position?: 'left' | 'right' | Position;
  content?: string;
  filetype?: string;
  fileContent?: string;
  isMaximizable?: boolean;
  isMaximized?: boolean;
  isFullScreen?: boolean;
  isDialog?: boolean;
  startup?: boolean;
  hidden?: boolean;
  contents?: DesktopItem[];
}

export interface WindowState {
  id: string;
  title?: string;
  type?: string;
  folderId?: string | null;
  isOpen?: boolean;
  isMinimized?: boolean;
  isMaximizable?: boolean;
  isMaximized?: boolean;
  isFullScreen?: boolean;
  isDialog?: boolean;
  iconSrc?: string | null;
  filetype?: string | null;
  fileContent?: string | null;
  originRect?: Rect | null;
  initialPosition?: { x: number; y: number; shouldCenter?: boolean };
  zIndex: number;
  position?: Position;
  size?: { width: number; height: number };
  component?: React.ComponentType<any>;
  crop43?: boolean;
  [key: string]: any;
}

export interface MinimizedWindow {
  id: string;
  title?: string;
  icon?: string;
}

export interface ZoomAnimation {
  id: string;
  fromRect: Rect;
  toRect: Rect;
  type: 'open' | 'close' | 'minimize' | 'restore' | 'maximize' | 'unmaximize';
  duration: number;
  steps: number;
  startTime: number;
}

export interface TriggerZoomAnimationOptions {
  id?: string;
  fromRect?: Rect | null;
  toRect?: Rect | null;
  type?: 'open' | 'close' | 'minimize' | 'restore' | 'maximize' | 'unmaximize';
  duration?: number;
  steps?: number;
  onComplete?: () => void;
}

export interface Logger {
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}

export interface SystemContextType {
  isFullScreen: boolean;
  setIsFullScreen: (active: boolean) => void;
  isBSODActive: boolean;
  triggerBSOD: () => void;
  closeBSOD: () => void;
  isOnline: boolean;
  showOfflineDialog: boolean;
  setShowOfflineDialog: (show: boolean) => void;
  networkIcon: string;
  isLoading: boolean;
  isDelaying: boolean;
  progress: number;
  menuBarVisible: boolean;
  skipLoading: () => void;
  isShuttingDown: boolean;
  shutdownStage: number;
  startShutdown: () => void;
}

export interface DesktopContextType {
  allDesktopItems: DesktopItem[];
  itemPositions: Record<string, Position>;
  handleItemPositionChange: (id: string, newPosition: Position, contextFolderId?: string | null) => void;
  resetDefaultPositions: () => void;
  selectedIcon: string | null;
  setSelectedIcon: (id: string | null) => void;
  folderDataMap: Map<string, DesktopItem>;
  cdDrive: any;
  cmsLoading: boolean;
}

export interface WindowContextType {
  openWindows: WindowState[];
  focusedWindow: string | null;
  minimizedWindows: MinimizedWindow[];
  minimizedWindowIds: Set<string>;
  loadingWindows: Set<string>;
  windowLoadingStates: Record<string, boolean>;
  handleItemDoubleClick: (idOrItem: string | DesktopItem, label?: string, options?: { skipTracking?: boolean; originRect?: Rect }) => void;
  handleMinimizeWindow: (windowId: string, windowData: { title?: string; icon?: string }) => void | Promise<void>;
  handleRestoreWindow: (windowId: string, extra?: { originRect?: Rect }) => void;
  handleCloseWindow: (windowId: string) => void;
  focusWindow: (id: string) => void;
  updateWindowOriginRect: (id: string, originRect: Rect) => void;
  handleWindowLoadingChange: (windowId: string, isLoading: boolean) => void;
  minimizeAll: () => void;
  closeAll: () => void;
  zoomAnimations: ZoomAnimation[];
  triggerZoomAnimation: (options: TriggerZoomAnimationOptions) => string;
  handleAnimationComplete: (id: string) => void;
  hasFullScreenWindow: boolean;
  hasActiveWindows: boolean;
}

