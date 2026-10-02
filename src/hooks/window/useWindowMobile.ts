import { useState, useEffect } from 'react';
import type { Position } from '../../types';

export interface UseWindowMobileProps {
  initialMobile: boolean;
  isMinimized?: boolean;
  isFullScreenActive?: boolean;
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>> | ((pos: Position) => void);
  isMaximized: boolean;
  setIsMaximized: React.Dispatch<React.SetStateAction<boolean>> | ((max: boolean) => void);
  setPreMaximizePosition: React.Dispatch<React.SetStateAction<Position>> | ((pos: Position) => void);
  MENU_BAR_HEIGHT: number;
}

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
}: UseWindowMobileProps) => {
  const [isMobile, setIsMobile] = useState(initialMobile);
  const [preMobileState, setPreMobileState] = useState<{ position: Position; isMaximized: boolean } | null>(null);
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
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
      if (resizeTimer) clearTimeout(resizeTimer);
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
