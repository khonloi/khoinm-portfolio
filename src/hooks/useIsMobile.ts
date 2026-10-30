import { useSyncExternalStore } from 'react';
import { MOBILE_BREAKPOINT } from '../constants/ui';

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }
  const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  mediaQuery.addEventListener('change', callback);
  return () => {
    mediaQuery.removeEventListener('change', callback);
  };
};

const getSnapshot = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
};

const getServerSnapshot = () => false;

/**
 * Reactive mobile breakpoint detection hook using useSyncExternalStore.
 */
export const useIsMobile = (): boolean => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

