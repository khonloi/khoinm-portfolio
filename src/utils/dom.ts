import type { Rect } from '../types';

/**
 * Safely measures a DOM element's bounding rect and returns standard Rect properties.
 * Returns undefined if element is null or undefined.
 */
export const measureElementRect = (
  element: Element | HTMLElement | null | undefined
): Rect | undefined => {
  if (!element || typeof element.getBoundingClientRect !== 'function') {
    return undefined;
  }

  const clientRect = element.getBoundingClientRect();
  return {
    x: clientRect.left,
    y: clientRect.top,
    width: clientRect.width,
    height: clientRect.height,
  };
};

/**
 * Checks whether the current environment matches mobile media query.
 */
export const checkIsMobile = (breakpoint = 768): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
};

