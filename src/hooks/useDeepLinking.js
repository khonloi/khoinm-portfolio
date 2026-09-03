import { useEffect, useRef } from 'react';

/**
 * useDeepLinking Hook
 * Synchronizes the application state with URL search parameters (?open=id).
 * Supports direct links (deep linking), sharing URLs, and browser Back/Forward navigation.
 */
export const useDeepLinking = ({
  handleItemDoubleClick,
  openWindows,
  focusedWindow,
  focusWindow,
  hasBooted,
}) => {
  const initialHandledRef = useRef(false);
  const openWindowsRef = useRef(openWindows);
  const initialTargetRef = useRef(
    (() => {
      if (typeof window === 'undefined') return null;
      const params = new URLSearchParams(window.location.search);
      return params.get('open') || params.get('app') || params.get('window');
    })()
  );

  useEffect(() => {
    openWindowsRef.current = openWindows;
  }, [openWindows]);

  // 1. Handle initial deep link on page load after desktop boots
  useEffect(() => {
    if (!hasBooted || initialHandledRef.current) return;
    initialHandledRef.current = true;

    const target = initialTargetRef.current;

    if (target) {
      // Slight delay to ensure desktop is fully ready
      const timer = setTimeout(() => {
        const isAlreadyOpen = openWindowsRef.current.some((w) => w.id === target);
        if (isAlreadyOpen) {
          focusWindow(target);
        } else {
          handleItemDoubleClick(target, undefined, { skipTracking: true });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hasBooted, focusWindow, handleItemDoubleClick]);

  // 2. Sync URL when focused window changes
  useEffect(() => {
    if (!hasBooted) return;

    const currentUrlParams = new URLSearchParams(window.location.search);
    const currentOpenParam = currentUrlParams.get('open');

    if (focusedWindow) {
      if (currentOpenParam !== focusedWindow) {
        const newUrl = `${window.location.pathname}?open=${encodeURIComponent(focusedWindow)}`;
        window.history.replaceState({ open: focusedWindow }, '', newUrl);
      }
    } else if (openWindows.length === 0 && currentOpenParam) {
      // Clear query params when all windows are closed
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [focusedWindow, openWindows.length, hasBooted]);

  // 3. Handle browser Back/Forward (popstate event)
  useEffect(() => {
    const handlePopState = (e) => {
      const params = new URLSearchParams(window.location.search);
      const target = params.get('open') || e.state?.open;

      if (target) {
        const isAlreadyOpen = openWindowsRef.current.some((w) => w.id === target);
        if (isAlreadyOpen) {
          focusWindow(target);
        } else {
          handleItemDoubleClick(target, undefined, { skipTracking: true });
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [focusWindow, handleItemDoubleClick]);
};

export default useDeepLinking;
