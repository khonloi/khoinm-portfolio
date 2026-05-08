import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useDragDrop } from './useDragDrop';

const DEFAULT_POSITION = { x: 100, y: 100 };
const MENU_BAR_HEIGHT_CONST = 30;

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
  isMinimized,
  isMaximized: initialMaximized,
  isFullScreen,
}) => {
  // Use a ref for the constant value
  const MENU_BAR_HEIGHT = useRef(MENU_BAR_HEIGHT_CONST).current;

  // Position state
  const initialMobile = window.innerWidth <= 768;
  const initialMaximizedState = initialMobile || initialMaximized || false;

  const [position, setPosition] = useState(() => {
    if (initialMaximizedState) return { x: 0, y: MENU_BAR_HEIGHT_CONST };
    return getInitialPos(initialPosition);
  });
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isMaximized, setIsMaximized] = useState(initialMaximizedState);
  const [preMaximizePosition, setPreMaximizePosition] = useState(() => getInitialPos(initialPosition));
  const [preMobileState, setPreMobileState] = useState(null);
  const [isFullScreenActive, setIsFullScreenActive] = useState(isFullScreen);
  const [touchStartTime, setTouchStartTime] = useState(null);
  const [hasCentered, setHasCentered] = useState(initialMaximizedState);
  const [isMobile, setIsMobile] = useState(initialMobile);

  // Drag logic - calling this early to get elementRef
  const handlePositionChange = useCallback(
    (_, newPos) => {
      if (!isMaximized && !isMobile && !isFullScreenActive)
        setPosition(newPos);
    },
    [isMaximized, isMobile, isFullScreenActive]
  );

  const {
    elementRef,
    isDragging,
    previewPosition,
    handleMouseDown,
    handleTouchStart: dragTouchStart,
  } = useDragDrop(id, position, handlePositionChange, onFocus, { useOutline: true });

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

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
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
      if (e.key === "Escape" && isFullScreenActive) {
        onFullScreenChange?.(false);
        onClose(id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreenActive, id, onClose, onFullScreenChange]);

  // Handle loading timer
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Center window logic
  useEffect(() => {
    if (isLoading || isMobile || isMinimized || isMaximized || isFullScreenActive || hasCentered)
      return;

    if (!initialPosition || !initialPosition.shouldCenter) {
      setHasCentered(true);
      return;
    }

    const centerWindow = () => {
      if (!elementRef.current) return;

      const windowElement = elementRef.current;
      const windowRect = windowElement.getBoundingClientRect();
      const windowWidth = windowRect.width;
      const windowHeight = windowRect.height;

      if (windowWidth === 0 || windowHeight === 0) {
        requestAnimationFrame(centerWindow);
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const centerX = (viewportWidth - windowWidth) / 2;
      const availableHeight = viewportHeight - MENU_BAR_HEIGHT;
      const centerY = MENU_BAR_HEIGHT + (availableHeight - windowHeight) / 2;

      const finalX = Math.max(0, Math.min(centerX, viewportWidth - windowWidth));
      const finalY = Math.max(MENU_BAR_HEIGHT, Math.min(centerY, viewportHeight - windowHeight));

      setPosition({ x: finalX, y: finalY });
      setPreMaximizePosition({ x: finalX, y: finalY });
      setHasCentered(true);
    };

    const requestId = requestAnimationFrame(() => {
      requestAnimationFrame(centerWindow);
    });
    
    return () => cancelAnimationFrame(requestId);
  }, [
    isLoading,
    isMinimized,
    isMaximized,
    isMobile,
    isFullScreenActive,
    hasCentered,
    initialPosition,
    MENU_BAR_HEIGHT,
    elementRef,
  ]);

  const handleTitleBarMouseDown = useCallback(
    (e) => {
      if (
        !e.target.closest(".window-title-bar") ||
        e.target.closest(".control-button") ||
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
        !e.target.closest(".window-title-bar") ||
        e.target.closest(".control-button") ||
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
    if (onMinimize) {
      setIsFullScreenActive(false);
      onMinimize(id, { title, icon, position });
    }
  }, [id, title, icon, position, onMinimize]);

  const handleMaximizeClick = useCallback(() => {
    if (isMobile || isFullScreenActive) return;
    if (isMaximized) {
      setPosition(preMaximizePosition);
      setIsMaximized(false);
    } else {
      setPreMaximizePosition(position);
      setPosition({ x: 0, y: MENU_BAR_HEIGHT });
      setIsMaximized(true);
    }
  }, [
    isMaximized,
    position,
    preMaximizePosition,
    MENU_BAR_HEIGHT,
    isMobile,
    isFullScreenActive,
  ]);

  const handleCloseClick = useCallback(() => {
    if (onClose) {
      setIsFullScreenActive(false);
      onClose(id);
    }
  }, [id, onClose]);

  return useMemo(() => ({
    elementRef,
    position,
    isLoading,
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
  }), [
    elementRef,
    position,
    isLoading,
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
  ]);
};

