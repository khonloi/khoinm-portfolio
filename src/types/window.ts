import type { Position, Rect } from './desktop';

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
  component?: React.ComponentType<Record<string, unknown>>;
  crop43?: boolean;
  [key: string]: unknown;
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

