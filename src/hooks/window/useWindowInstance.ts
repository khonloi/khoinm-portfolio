import { useState, useCallback, useMemo } from 'react';
import { useWindowPosition } from './useWindowPosition';
import { useWindowMobile } from './useWindowMobile';
import { useWindowLifecycle } from './useWindowLifecycle';
import { useWindowTransitions } from './useWindowTransitions';
import { runWindowZoom } from './runWindowZoom';
import { useIsMobile } from '../useIsMobile';
import { measureElementRect } from '../../utils/dom';
import { MENU_BAR_HEIGHT } from '../../constants/ui';
import type { Position, Rect, TriggerZoomAnimationOptions } from '../../types';

export interface UseWindowInstanceProps {
  id: string;
  title?: string;
  icon?: string;
  onClose: (id: string) => void;
  onMinimize?: (id: string, data: { title?: string; icon?: string; position?: Position }) => void;
  onFocus?: (id: string) => void;
  onFullScreenChange?: (active: boolean) => void;
  onLoadingChange?: (id: string, isLoading: boolean) => void;
  initialPosition?: { x?: number; y?: number; shouldCenter?: boolean };
  originRect?: Rect | null;
  triggerZoomAnimation?: (options: TriggerZoomAnimationOptions) => string;
  isMinimized?: boolean;
  isMaximized?: boolean;
  isFullScreen?: boolean;
}

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
}: UseWindowInstanceProps) => {
  const isMobile = useIsMobile();
  const initialMaximizedState = isMobile || initialMaximized || false;

  const [isFullScreenActive, setIsFullScreenActive] = useState(isFullScreen || false);

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
    isMobile,
    onFocus,
    MENU_BAR_HEIGHT,
  });

  // Mobile hook
  const { touchStartTime, setTouchStartTime } = useWindowMobile({
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
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest('.window-title-bar') ||
        target.closest('.control-button') ||
        target.closest('button') ||
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
    (e: React.TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest('.window-title-bar') ||
        target.closest('.control-button') ||
        target.closest('button') ||
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
    (e: React.TouchEvent) => {
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

    if (isFullScreen || isFullScreenActive) {
      setIsFullScreenActive(false);
      onMinimize?.(id, { title, icon, position });
      return;
    }

    const fromRect = measureElementRect(elementRef.current);
    const taskbarTargetRect: Rect = {
      x: 20,
      y: window.innerHeight - 56,
      width: 44,
      height: 44,
    };

    setIsMinimizing(true);
    runWindowZoom(triggerZoomAnimation, {
      id: `minimize-${id}`,
      fromRect,
      toRect: taskbarTargetRect,
      type: 'minimize',
      onComplete: () => {
        setIsFullScreenActive(false);
        setIsMinimizing(false);
        onMinimize?.(id, { title, icon, position });
      },
    });
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

    const fromRect = measureElementRect(elementRef.current);

    if (!isMaximized) {
      // Maximizing: normal -> maximized
      setPreMaximizePosition(position);
      setIsMaximized(true);
      setPosition({ x: 0, y: MENU_BAR_HEIGHT });
      setIsOpening(true);

      requestAnimationFrame(() => {
        const toRect = measureElementRect(elementRef.current);
        runWindowZoom(triggerZoomAnimation, {
          id: `maximize-${id}-${Date.now()}`,
          fromRect,
          toRect,
          type: 'maximize',
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
        const toRect = measureElementRect(elementRef.current);
        runWindowZoom(triggerZoomAnimation, {
          id: `unmaximize-${id}-${Date.now()}`,
          fromRect,
          toRect,
          type: 'unmaximize',
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
    triggerZoomAnimation,
    elementRef,
    setIsMaximized,
    setPosition,
    setPreMaximizePosition,
    setIsOpening,
  ]);

  const handleCloseClick = useCallback(() => {
    if (isClosing) return;

    if (isFullScreen || isFullScreenActive) {
      setIsFullScreenActive(false);
      onClose?.(id);
      return;
    }

    const fromRect = measureElementRect(elementRef.current);
    setIsClosing(true);

    runWindowZoom(triggerZoomAnimation, {
      id: `close-${id}`,
      fromRect,
      toRect: originRect,
      type: 'close',
      onComplete: () => {
        setIsFullScreenActive(false);
        onClose?.(id);
      },
    });
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
    ]
  );
};
