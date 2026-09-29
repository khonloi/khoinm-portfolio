/**
 * Core domain types for the Hayami portfolio system
 */

export interface SkillCategory {
  id: string;
  title: string;
  skills: string[];
}

export interface DesktopItem {
  id: string;
  label?: string;
  title?: string;
  icon?: string;
  iconSrc?: string;
  type?: 'file' | 'folder' | 'app' | 'link' | 'icon';
  windowId?: string;
  url?: string;
  position?: 'left' | 'right' | { x: number; y: number };
  content?: string;
  filetype?: string;
  fileContent?: string;
  isMaximizable?: boolean;
  isFullScreen?: boolean;
  isDialog?: boolean;
  startup?: boolean;
  hidden?: boolean;
  contents?: DesktopItem[];
}


export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  component?: React.ComponentType<any>;
}

export interface Logger {
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}
