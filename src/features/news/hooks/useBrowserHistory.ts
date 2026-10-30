import { useState, useCallback, useRef, useEffect } from 'react';

export const HOME_PAGE_ID = 'home';

export interface UseBrowserHistoryOptions {
  onScrollReset?: () => void;
}

export const useBrowserHistory = (options: UseBrowserHistoryOptions = {}) => {
  const { onScrollReset } = options;
  const [history, setHistory] = useState<(string | number)[]>([HOME_PAGE_ID]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isNavLoading, setIsNavLoading] = useState(false);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, []);

  const simulateLoad = useCallback(
    (callback: () => void) => {
      setIsNavLoading(true);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = setTimeout(() => {
        callback();
        setIsNavLoading(false);
      }, 300);
    },
    []
  );

  const currentPageId = history[historyIndex];
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const navigate = useCallback(
    (pageId: string | number) => {
      simulateLoad(() => {
        setHistory((prev) => [...prev.slice(0, historyIndex + 1), pageId]);
        setHistoryIndex((prev) => prev + 1);
        onScrollReset?.();
      });
    },
    [historyIndex, simulateLoad, onScrollReset]
  );

  const goBack = useCallback(() => {
    if (!canGoBack) return;
    simulateLoad(() => {
      setHistoryIndex((prev) => prev - 1);
      onScrollReset?.();
    });
  }, [canGoBack, simulateLoad, onScrollReset]);

  const goForward = useCallback(() => {
    if (!canGoForward) return;
    simulateLoad(() => {
      setHistoryIndex((prev) => prev + 1);
      onScrollReset?.();
    });
  }, [canGoForward, simulateLoad, onScrollReset]);

  const goHome = useCallback(() => {
    if (currentPageId !== HOME_PAGE_ID) navigate(HOME_PAGE_ID);
  }, [currentPageId, navigate]);

  return {
    history,
    historyIndex,
    currentPageId,
    canGoBack,
    canGoForward,
    isNavLoading,
    setIsNavLoading,
    simulateLoad,
    navigate,
    goBack,
    goForward,
    goHome,
  };
};

