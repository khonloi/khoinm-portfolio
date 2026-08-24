import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useDragDrop } from './useDragDrop';

const DEFAULT_POSITION = { x: 100, y: 100 };
const MENU_BAR_HEIGHT_CONST = 36;

// Utility to calculate initial position
const getInitialPos = (pos) => {
  if (!pos) return DEFAULT_POSITION;
  if (pos.shouldCenter) return { x: 0, y: 0 };
  return { x: pos.x || 100, y: pos.y || 100 };
};

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
  // Use a ref for the constant value
  const MENU_BAR_HEIGHT = useRef(MENU_BAR_HEIGHT_CONST).current;

  // Position state
  const initialMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const initialMaximizedState = initialMobile || initialMaximized || false;

  const [position, setPosition] = useState(() => {
    if (initialMaximizedState) return { x: 0, y: MENU_BAR_HEIGHT_CONST };
    return getInitialPos(initialPosition);
  });
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isLoading, setIsLoading] = useState(!isFullScreen);
  const [isOpening, setIsOpening] = useState(!isFullScreen);
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(initialMaximizedState);
  const [preMaximizePosition, setPreMaximizePosition] = useState(() =>
    getInitialPos(initialPosition)
  );
  const [preMobileState, setPreMobileState] = useState(null);
  const [isFullScreenActive, setIsFullScreenActive] = useState(isFullScreen);
  const [touchStartTime, setTouchStartTime] = useState(null);
  const [hasCentered, setHasCentered] = useState(
    initialMaximizedState || isFullScreen || !initialPosition?.shouldCenter
  );
  const [isMobile, setIsMobile] = useState(initialMobile);

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

  // Drag logic - calling this early to get elementRef
  const handlePositionChange = useCallback(
    (_, newPos) => {
      if (!isMaximized && !isMobile && !isFullScreenActive) setPosition(newPos);
    },
    [isMaximized, isMobile, isFullScreenActive]
  );

  const {
    elementRef,
    isDragging,
    previewPosition,
    handleMouseDown,
    handleTouchStart: dragTouchStart,
  } = useDragDrop(id, position, handlePositionChange, onFocus, {
    useOutline: true,
  });

  // Track dimensions when dragging starts
  useEffect(() => {
    if (isDragging && elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setWindowDimensions({ width: rect.width, height: rect.height });
    }
  }, [isDragging, elementRef]);

  // Notify parent of loading state changes
  useEffect(() => {
    onLoadingChange?.(id, isLoading);
  }, [isLoading, id, onLoadingChange]);

  // Notify parent of full-screen state changes
  useEffect(() => {
    onFullScreenChange?.(isFullScreenActive && !isMinimized);
  }, [isFullScreenActive, isMinimized, onFullScreenChange]);

  // Handle mobile detection and state transitions
  useEffect(() => {
    let resizeTimer;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const mobile = window.innerWidth <= 768;

        if (mobile && !isMobile && !isMinimized && !isFullScreenActive) {
          setPreMobileState({
            position,
            isMaximized,
          });
          setPreMaximizePosition(position);
          setPosition({ x: 0, y: MENU_BAR_HEIGHT });
          setIsMaximized(true);
        } else if (
          !mobile &&
          isMobile &&
          preMobileState &&
          !isMinimized &&
          !isFullScreenActive
        ) {
          setPosition(preMobileState.position);
          setIsMaximized(preMobileState.isMaximized);
          setPreMobileState(null);
        }

        setIsMobile(mobile);
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [
    isMobile,
    isMinimized,
    position,
    isMaximized,
    preMobileState,
    MENU_BAR_HEIGHT,
    isFullScreenActive,
  ]);

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

  // Center window and trigger opening ZoomRect animation once initial loading delay completes
  useEffect(() => {
    if (isFullScreen || isFullScreenActive) {
      hasAnimatedOpenRef.current = true;
      setIsOpening(false);
      setIsLoading(false);
      return;
    }

    if (isLoading || isMinimized) return;
    if (hasAnimatedOpenRef.current) return;

    let cancelRef = false;

    const runSetupAndAnimate = () => {
      if (cancelRef || !elementRef.current) return;

      const windowElement = elementRef.current;
      const windowRect = windowElement.getBoundingClientRect();
      const windowWidth = windowRect.width;
      const windowHeight = windowRect.height;

      // If dimensions are not ready in DOM yet, request next frame
      if (windowWidth === 0 || windowHeight === 0) {
        requestAnimationFrame(runSetupAndAnimate);
        return;
      }

      // Handle centering calculation if required
      if (
        !isMobile &&
        !isFullScreenActive &&
        !isMaximized &&
        initialPosition?.shouldCenter &&
        !hasCentered
      ) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const safeBottomBuffer =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              '--safe-bottom-buffer'
            )
          ) || 0;

        const centerX = (viewportWidth - windowWidth) / 2;
        const availableHeight =
          viewportHeight - MENU_BAR_HEIGHT - safeBottomBuffer;
        const centerY = (availableHeight - windowHeight) / 2;

        const finalX = Math.max(0, Math.min(centerX, viewportWidth - windowWidth));
        const finalY = Math.max(0, Math.min(centerY, availableHeight - windowHeight));

        setPosition({ x: finalX, y: finalY });
        setPreMaximizePosition({ x: finalX, y: finalY });
        setHasCentered(true);

        // After position state updates, measure the exact DOM bounding box in next frame
        requestAnimationFrame(() => {
          if (cancelRef || !elementRef.current) return;
          const updatedRect = elementRef.current.getBoundingClientRect();
          hasAnimatedOpenRef.current = true;

          const targetRect = {
            x: updatedRect.left,
            y: updatedRect.top,
            width: updatedRect.width,
            height: updatedRect.height,
          };

          if (triggerZoomAnimation) {
            triggerZoomAnimation({
              id: `open-${id}`,
              fromRect: originRect,
              toRect: targetRect,
              type: 'open',
              duration: 220,
              steps: 7,
              onComplete: () => {
                setIsOpening(false);
              },
            });
          } else {
            setIsOpening(false);
          }
        });
        return;
      }

      hasAnimatedOpenRef.current = true;

      // Exact pixel-perfect viewport coordinates
      const targetRect = {
        x: windowRect.left,
        y: windowRect.top,
        width: windowRect.width,
        height: windowRect.height,
      };

      if (triggerZoomAnimation) {
        triggerZoomAnimation({
          id: `open-${id}`,
          fromRect: originRect,
          toRect: targetRect,
          type: 'open',
          duration: 220,
          steps: 7,
          onComplete: () => {
            setIsOpening(false);
          },
        });
      } else {
        setIsOpening(false);
      }
    };

    const animFrameId = requestAnimationFrame(runSetupAndAnimate);

    return () => {
      cancelRef = true;
      cancelAnimationFrame(animFrameId);
    };
  }, [
    id,
    isLoading,
    originRect,
    triggerZoomAnimation,
    isMinimized,
    hasCentered,
    initialPosition,
    isMobile,
    isFullScreenActive,
    isFullScreen,
    isMaximized,
    MENU_BAR_HEIGHT,
    elementRef,
  ]);

  // Handle un-minimizing / restore animation
  useEffect(() => {
    if (isFullScreen || isFullScreenActive) {
      setIsOpening(false);
      prevMinimizedRef.current = isMinimized;
      return;
    }

    if (prevMinimizedRef.current && !isMinimized) {
      // Just restored
      let cancelRef = false;

      const runRestoreAnimation = () => {
        if (cancelRef || !elementRef.current) return;

        const rect = elementRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          requestAnimationFrame(runRestoreAnimation);
          return;
        }

        const targetRect = {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        };

        if (triggerZoomAnimation) {
          triggerZoomAnimation({
            id: `restore-${id}`,
            fromRect: originRect || {
              x: 20,
              y: window.innerHeight - 56,
              width: 44,
              height: 44,
            },
            toRect: targetRect,
            type: 'restore',
            duration: 220,
            steps: 7,
            onComplete: () => {
              setIsOpening(false);
            },
          });
        } else {
          setIsOpening(false);
        }
      };

      const animFrame = requestAnimationFrame(runRestoreAnimation);

      return () => {
        cancelRef = true;
        cancelAnimationFrame(animFrame);
      };
    }
    prevMinimizedRef.current = isMinimized;
  }, [
    isMinimized,
    id,
    originRect,
    triggerZoomAnimation,
    isFullScreen,
    isFullScreenActive,
    elementRef,
  ]);

  const handleTitleBarMouseDown = useCallback(
    (e) => {
      if (
        !e.target.closest('.window-title-bar') ||
        e.target.closest('.control-button') ||
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
    [isFullScreenActive, isMobile, handleTitleBarTouchStart]
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
