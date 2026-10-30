import type { Rect } from '../types';

export const MENU_BAR_HEIGHT = 36;
export const MOBILE_BREAKPOINT = 768;

export const TASKBAR_FALLBACK_RECT: Rect = {
  x: 0,
  y: 0,
  width: 80,
  height: 28,
};

export const ZOOM_DEFAULTS = {
  DURATION: 200,
  STEPS: 5,
} as const;

export const Z_INDEX = {
  BASE: 1000,
  MENU_BAR: 9000,
  MODAL: 9999,
  BSOD: 99999,
} as const;

export const POSITIONING_CONSTANTS = {
  EDGE_PADDING: 20,
  EDGE_PADDING_RESIZE: 20,
  ICON_SPACING: 100,
  ICON_WIDTH: 80,
  TOP_PADDING: 20,
} as const;

