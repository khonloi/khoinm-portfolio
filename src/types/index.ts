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
  title: string;
  icon?: string;
  type?: 'file' | 'folder' | 'app' | 'link';
  windowId?: string;
  url?: string;
  position?: { x: number; y: number };
  content?: string;
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
