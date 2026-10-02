import { useState, useCallback, useEffect } from 'react';
import { useDragDrop } from '../useDragDrop';
import type { Position } from '../../types';

const DEFAULT_POSITION: Position = { x: 100, y: 100 };

export const getInitialPos = (pos?: { x?: number; y?: number; shouldCenter?: boolean }): Position => {
  if (!pos) return DEFAULT_POSITION;
  if (pos.shouldCenter) return { x: 0, y: 0 };
  return { x: pos.x || 100, y: pos.y || 100 };
};

export interface UseWindowPositionProps {
  id: string;
  initialPosition?: { x?: number; y?: number; shouldCenter?: boolean };
  initialMaximizedState?: boolean;
  isFullScreenActive?: boolean;
  isMobile?: boolean;
  onFocus?: (id: string) => void;
  MENU_BAR_HEIGHT: number;
}

export const useWindowPosition = ({
  id,
  initialPosition,
  initialMaximizedState,
  isFullScreenActive,
  isMobile,
  onFocus,
  MENU_BAR_HEIGHT,
}: UseWindowPositionProps) => {
  const [position, setPosition] = useState<Position>(() => {
    if (initialMaximizedState) return { x: 0, y: MENU_BAR_HEIGHT };
    return getInitialPos(initialPosition);
  });
  
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [isMaximized, setIsMaximized] = useState(initialMaximizedState || false);
  
  const [preMaximizePosition, setPreMaximizePosition] = useState<Position>(() =>
    getInitialPos(initialPosition)
  );
  
  const [hasCentered, setHasCentered] = useState(
    Boolean(initialMaximizedState || !initialPosition?.shouldCenter)
  );

  const handlePositionChange = useCallback(
    (_: string, newPos: Position) => {
      if (!isMaximized && !isMobile && !isFullScreenActive) setPosition(newPos);
    },
    [isMaximized, isMobile, isFullScreenActive]
  );

  const dragProps = useDragDrop(id, position, handlePositionChange, onFocus, {
    useOutline: true,
  });

  // Track dimensions when dragging starts
  useEffect(() => {
    if (dragProps.isDragging && dragProps.elementRef.current) {
      const rect = dragProps.elementRef.current.getBoundingClientRect();
      setWindowDimensions({ width: rect.width, height: rect.height });
    }
  }, [dragProps.isDragging, dragProps.elementRef]);

  return {
    position,
    setPosition,
    windowDimensions,
    isMaximized,
    setIsMaximized,
    preMaximizePosition,
    setPreMaximizePosition,
    hasCentered,
    setHasCentered,
    ...dragProps,
  };
};
