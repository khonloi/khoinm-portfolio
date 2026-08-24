import { useState, useCallback, useEffect, useRef } from 'react';
import { useDragDrop } from '../useDragDrop';

const DEFAULT_POSITION = { x: 100, y: 100 };

export const getInitialPos = (pos) => {
  if (!pos) return DEFAULT_POSITION;
  if (pos.shouldCenter) return { x: 0, y: 0 };
  return { x: pos.x || 100, y: pos.y || 100 };
};

export const useWindowPosition = ({
  id,
  initialPosition,
  initialMaximizedState,
  isFullScreenActive,
  isMobile,
  onFocus,
  MENU_BAR_HEIGHT,
}) => {
  const [position, setPosition] = useState(() => {
    if (initialMaximizedState) return { x: 0, y: MENU_BAR_HEIGHT };
    return getInitialPos(initialPosition);
  });
  
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [isMaximized, setIsMaximized] = useState(initialMaximizedState);
  
  const [preMaximizePosition, setPreMaximizePosition] = useState(() =>
    getInitialPos(initialPosition)
  );
  
  const [hasCentered, setHasCentered] = useState(
    initialMaximizedState || !initialPosition?.shouldCenter
  );

  const handlePositionChange = useCallback(
    (_, newPos) => {
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
