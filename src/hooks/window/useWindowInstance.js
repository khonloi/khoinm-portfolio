import { useState, useCallback, useRef, useMemo } from 'react';
import { useWindowPosition } from './useWindowPosition';
import { useWindowMobile } from './useWindowMobile';
import { useWindowLifecycle } from './useWindowLifecycle';
import { useWindowTransitions } from './useWindowTransitions';

const MENU_BAR_HEIGHT_CONST = 36;

export const useWindowInstance = ({
  id,
  title,
  icon,
  onClose,
  onMinimize,
  onFocus,
  onFullScreenChange,
  onLoadingChange,
  initialPosition,
  originRect,
  triggerZoomAnimation,
  isMinimized,
  isMaximized: initialMaximized,
  isFullScreen,
}) => {
  const MENU_BAR_HEIGHT = useRef(MENU_BAR_HEIGHT_CONST).current;
  const initialMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const initialMaximizedState = initialMobile || initialMaximized || false;

  const [isFullScreenActive, setIsFullScreenActive] = useState(isFullScreen);

  // Position & Dimensions hook
  const {
    position,
    setPosition,
    windowDimensions,
    isMaximized,
    setIsMaximized,
    preMaximizePosition,
    setPreMaximizePosition,
    hasCentered,
    setHasCentered,
    elementRef,
    isDragging,
    previewPosition,
    handleMouseDown,
    handleTouchStart: dragTouchStart,
  } = useWindowPosition({
    id,
    initialPosition,
    initialMaximizedState,
    isFullScreenActive,
    isMobile: initialMobile, // updated below
    onFocus,
    MENU_BAR_HEIGHT,
  });

  // Mobile hook
  const { isMobile, touchStartTime, setTouchStartTime } = useWindowMobile({
    initialMobile,
    isMinimized,
    isFullScreenActive,
    position,
    setPosition,
    isMaximized,
    setIsMaximized,
    setPreMaximizePosition,
    MENU_BAR_HEIGHT,
  });

  // Lifecycle hook
  const {
    isLoading,
    isOpening,
    setIsOpening,
    isClosing,
    setIsClosing,
    isMinimizing,
    setIsMinimizing,
    hasAnimatedOpenRef,
    prevMinimizedRef,
  } = useWindowLifecycle({
    id,
    isFullScreen,
    isFullScreenActive,
    isMinimized,
    onLoadingChange,
    onFullScreenChange,
    onClose,
  });

  // Animations hook
  useWindowTransitions({
    id,
    isFullScreen,
    isFullScreenActive,
    isMinimized,
    isLoading,
    setIsOpening,
    hasAnimatedOpenRef,
    prevMinimizedRef,
    triggerZoomAnimation,
    originRect,
    elementRef,
    setPosition,
    setPreMaximizePosition,
    hasCentered,
    setHasCentered,
    isMaximized,
    isMobile,
    MENU_BAR_HEIGHT,
  });

  // Event Handlers
  const handleTitleBarMouseDown = useCallback(
    (e) => {
      if (
        !e.target.closest('.window-title-bar') ||
        e.target.closest('.control-button') ||
        e.target.closest('button') ||
        isMaximized ||
        isMobile ||
        isFullScreenActive
      )
        return;
      handleMouseDown(e);
    },
    [handleMouseDown, isMaximized, isMobile, isFullScreenActive]
  );

  const handleTitleBarTouchStart = useCallback(
    (e) => {
      if (
        !e.target.closest('.window-title-bar') ||
        e.target.closest('.control-button') ||
        e.target.closest('button') ||
        isMaximized ||
        isMobile ||
        isFullScreenActive
      )
        return;
      dragTouchStart(e);
    },
    [dragTouchStart, isMaximized, isMobile, isFullScreenActive]
  );

  const handleTouchStart = useCallback(
    (e) => {
      if (isFullScreenActive && isMobile) {
        setTouchStartTime(Date.now());
      }
      handleTitleBarTouchStart(e);
    },
    [isFullScreenActive, isMobile, handleTitleBarTouchStart, setTouchStartTime]
  );

  const handleTouchEnd = useCallback(() => {
    if (isFullScreenActive && isMobile && touchStartTime) {
      const touchDuration = Date.now() - touchStartTime;
      if (touchDuration >= 1000) {
        onFullScreenChange?.(false);
        onClose(id);
      }
    }
    setTouchStartTime(null);
  }, [
    isFullScreenActive,
    isMobile,
    touchStartTime,
    id,
    onClose,
    onFullScreenChange,
    setTouchStartTime,
  ]);

  const handleMinimizeClick = useCallback(() => {
    if (isMinimizing || isClosing) return;

    if (isFullScreen || isFullScreenActive || !triggerZoomAnimation) {
      if (onMinimize) {
        setIsFullScreenActive(false);
        onMinimize(id, { title, icon, position });
      }
      return;
    }

    if (elementRef.current) {
      setIsMinimizing(true);
      const rect = elementRef.current.getBoundingClientRect();
      const fromRect = {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      };

      const taskbarTargetRect = {
        x: 20,
        y: window.innerHeight - 56,
        width: 44,
        height: 44,
      };

      triggerZoomAnimation({
        id: `minimize-${id}`,
        fromRect,
        toRect: taskbarTargetRect,
        type: 'minimize',
        duration: 220,
        steps: 7,
        onComplete: () => {
          setIsFullScreenActive(false);
          setIsMinimizing(false);
          if (onMinimize) {
            onMinimize(id, { title, icon, position });
          }
        },
      });
    } else {
      if (onMinimize) {
        setIsFullScreenActive(false);
        onMinimize(id, { title, icon, position });
      }
    }
  }, [
    id,
    title,
    icon,
    position,
    triggerZoomAnimation,
    isMinimizing,
    isClosing,
    isFullScreen,
    isFullScreenActive,
    onMinimize,
    elementRef,
    setIsMinimizing,
    setIsFullScreenActive,
  ]);

  const handleMaximizeClick = useCallback(() => {
    if (isMobile || isFullScreenActive || isClosing || isMinimizing || isOpening) return;

    if (!elementRef.current || !triggerZoomAnimation) {
      if (isMaximized) {
        setPosition(preMaximizePosition);
        setIsMaximized(false);
      } else {
        setPreMaximizePosition(position);
        setPosition({ x: 0, y: MENU_BAR_HEIGHT });
        setIsMaximized(true);
      }
      return;
    }

    const currentRect = elementRef.current.getBoundingClientRect();
    const fromRect = {
      x: currentRect.left,
      y: currentRect.top,
      width: currentRect.width,
      height: currentRect.height,
    };

    if (!isMaximized) {
      // Maximizing: normal -> maximized
      setPreMaximizePosition(position);
      setIsMaximized(true);
      setPosition({ x: 0, y: MENU_BAR_HEIGHT });
      setIsOpening(true);

      requestAnimationFrame(() => {
        if (!elementRef.current) return;
        const maxRect = elementRef.current.getBoundingClientRect();
        const toRect = {
          x: maxRect.left,
          y: maxRect.top,
          width: maxRect.width,
          height: maxRect.height,
        };

        triggerZoomAnimation({
          id: `maximize-${id}-${Date.now()}`,
          fromRect,
          toRect,
          type: 'maximize',
          duration: 220,
          steps: 7,
          onComplete: () => {
            setIsOpening(false);
          },
        });
      });
    } else {
      // Unmaximizing: maximized -> normal
      setIsMaximized(false);
      setPosition(preMaximizePosition);
      setIsOpening(true);

      requestAnimationFrame(() => {
        if (!elementRef.current) return;
        const normRect = elementRef.current.getBoundingClientRect();
        const toRect = {
          x: normRect.left,
          y: normRect.top,
          width: normRect.width,
          height: normRect.height,
        };

        triggerZoomAnimation({
          id: `unmaximize-${id}-${Date.now()}`,
          fromRect,
          toRect,
          type: 'unmaximize',
          duration: 220,
          steps: 7,
          onComplete: () => {
            setIsOpening(false);
          },
        });
      });
    }
  }, [
    id,
    isMobile,
    isFullScreenActive,
    isClosing,
    isMinimizing,
    isOpening,
    isMaximized,
    position,
    preMaximizePosition,
    MENU_BAR_HEIGHT,
    triggerZoomAnimation,
    elementRef,
    setIsMaximized,
    setPosition,
    setPreMaximizePosition,
    setIsOpening,
  ]);

  const handleCloseClick = useCallback(() => {
    if (isClosing) return;

    if (isFullScreen || isFullScreenActive || !triggerZoomAnimation) {
      setIsFullScreenActive(false);
      if (onClose) {
        onClose(id);
      }
      return;
    }

    if (elementRef.current) {
      setIsClosing(true);
      const rect = elementRef.current.getBoundingClientRect();
      const fromRect = {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      };

      triggerZoomAnimation({
        id: `close-${id}`,
        fromRect,
        toRect: originRect,
        type: 'close',
        duration: 220,
        steps: 7,
        onComplete: () => {
          setIsFullScreenActive(false);
          if (onClose) {
            onClose(id);
          }
        },
      });
    } else {
      if (onClose) {
        setIsFullScreenActive(false);
        onClose(id);
      }
    }
  }, [
    id,
    originRect,
    triggerZoomAnimation,
    isClosing,
    isFullScreen,
    isFullScreenActive,
    onClose,
    elementRef,
    setIsClosing,
    setIsFullScreenActive,
  ]);

  return useMemo(
    () => ({
      elementRef,
      position,
      isLoading,
      isOpening,
      isClosing,
      isMinimizing,
      isMaximized,
      isMobile,
      isFullScreenActive,
      windowDimensions,
      previewPosition,
      isDragging,
      hasCentered,
      handleTitleBarMouseDown,
      handleTouchStart,
      handleTouchEnd,
      handleMinimizeClick,
      handleMaximizeClick,
      handleCloseClick,
      MENU_BAR_HEIGHT,
    }),
    [
      elementRef,
      position,
      isLoading,
      isOpening,
      isClosing,
      isMinimizing,
      isMaximized,
      isMobile,
      isFullScreenActive,
      windowDimensions,
      previewPosition,
      isDragging,
      hasCentered,
      handleTitleBarMouseDown,
      handleTouchStart,
      handleTouchEnd,
      handleMinimizeClick,
      handleMaximizeClick,
      handleCloseClick,
      MENU_BAR_HEIGHT,
    ]
  );
};
