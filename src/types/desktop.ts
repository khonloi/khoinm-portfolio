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

