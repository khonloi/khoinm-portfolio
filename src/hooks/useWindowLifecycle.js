import { useState, useEffect, useRef } from 'react';

export const useWindowLifecycle = ({
  id,
  isFullScreen,
  isFullScreenActive,
  isMinimized,
  onLoadingChange,
  onFullScreenChange,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(!isFullScreen);
  const [isOpening, setIsOpening] = useState(!isFullScreen);
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);

  // Synchronously update isOpening during render when transitioning from minimized -> restored
  // to prevent any 1-frame flash of the window before useEffect runs.
  const [prevMinimized, setPrevMinimized] = useState(isMinimized);
  if (prevMinimized !== isMinimized) {
    setPrevMinimized(isMinimized);
    if (prevMinimized && !isMinimized && !isFullScreen && !isFullScreenActive) {
      setIsOpening(true);
    }
  }

  const hasAnimatedOpenRef = useRef(isFullScreen || false);
  const prevMinimizedRef = useRef(isMinimized);

  // Notify parent of loading state changes
  useEffect(() => {
    onLoadingChange?.(id, isLoading);
  }, [isLoading, id, onLoadingChange]);

  // Notify parent of full-screen state changes
  useEffect(() => {
    onFullScreenChange?.(isFullScreenActive && !isMinimized);
  }, [isFullScreenActive, isMinimized, onFullScreenChange]);

  // Handle ESC key to close full-screen window
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullScreenActive) {
        onFullScreenChange?.(false);
        onClose(id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenActive, id, onClose, onFullScreenChange]);

  // Initial application loading delay for regular applications
  useEffect(() => {
    if (isFullScreen || isFullScreenActive) {
      setIsLoading(false);
      return;
    }

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(loadingTimer);
  }, [isFullScreen, isFullScreenActive]);

  return {
    isLoading,
    setIsLoading,
    isOpening,
    setIsOpening,
    isClosing,
    setIsClosing,
    isMinimizing,
    setIsMinimizing,
    hasAnimatedOpenRef,
    prevMinimizedRef,
  };
};
