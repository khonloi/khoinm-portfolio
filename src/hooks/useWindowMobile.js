import { useState, useEffect } from 'react';

export const useWindowMobile = ({
  initialMobile,
  isMinimized,
  isFullScreenActive,
  position,
  setPosition,
  isMaximized,
  setIsMaximized,
  setPreMaximizePosition,
  MENU_BAR_HEIGHT,
}) => {
  const [isMobile, setIsMobile] = useState(initialMobile);
  const [preMobileState, setPreMobileState] = useState(null);
  const [touchStartTime, setTouchStartTime] = useState(null);

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
    handleResize(); // Initial check

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
    setPosition,
    setIsMaximized,
    setPreMaximizePosition,
  ]);

  return {
    isMobile,
    touchStartTime,
    setTouchStartTime,
  };
};
