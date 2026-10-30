import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../useIsMobile';
import type { Position } from '../../types';

export interface UseWindowMobileProps {
  initialMobile?: boolean;
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
  isMinimized,
  isFullScreenActive,
  position,
  setPosition,
  isMaximized,
  setIsMaximized,
  setPreMaximizePosition,
  MENU_BAR_HEIGHT,
}: UseWindowMobileProps) => {
  const isMobile = useIsMobile();
  const [preMobileState, setPreMobileState] = useState<{ position: Position; isMaximized: boolean } | null>(null);
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);
  const prevIsMobileRef = useRef<boolean>(isMobile);

  useEffect(() => {
    if (isMobile === prevIsMobileRef.current) return;
    prevIsMobileRef.current = isMobile;

    if (isMobile && !isMinimized && !isFullScreenActive) {
      setPreMobileState({
        position,
        isMaximized,
      });
      setPreMaximizePosition(position);
      setPosition({ x: 0, y: MENU_BAR_HEIGHT });
      setIsMaximized(true);
    } else if (
      !isMobile &&
      preMobileState &&
      !isMinimized &&
      !isFullScreenActive
    ) {
      setPosition(preMobileState.position);
      setIsMaximized(preMobileState.isMaximized);
      setPreMobileState(null);
    }
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
