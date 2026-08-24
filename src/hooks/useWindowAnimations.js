import { useEffect } from 'react';

export const useWindowAnimations = ({
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
}) => {
  // Center window and trigger opening ZoomRect animation once initial loading delay completes
  useEffect(() => {
    if (isFullScreen || isFullScreenActive) {
      hasAnimatedOpenRef.current = true;
      setIsOpening(false);
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
    isMobile,
    isFullScreenActive,
    isFullScreen,
    isMaximized,
    MENU_BAR_HEIGHT,
    elementRef,
    setPosition,
    setPreMaximizePosition,
    setHasCentered,
    setIsOpening,
    hasAnimatedOpenRef
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
    setIsOpening,
    prevMinimizedRef
  ]);
};
