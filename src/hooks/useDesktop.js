import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { desktopItems } from "../config/programConfig";

// Constants for positioning - extracted for better maintainability
const POSITIONING_CONSTANTS = {
  EDGE_PADDING: 20,
  EDGE_PADDING_RESIZE: 20,
  ICON_SPACING: 100,
  ICON_WIDTH: 80,
  TOP_PADDING: 20,
};

export const useDesktop = (cdDrive) => {
  // Create memoized desktop items
  const allDesktopItems = useMemo(() => {
    return desktopItems.map(item => {
      if (item.id === 'cddrive' && cdDrive) {
        return {
          ...item,
          label: cdDrive.label || item.label,
          fileContent: cdDrive.fileContent || item.fileContent,
        };
      }
      return item;
    }).filter(item => !item.hidden);
  }, [cdDrive]);
  
  // Use ref to track if positions are initialized
  const positionsInitialized = useRef(false);

  // Initialize positions - memoized calculation
  const initialPositions = useMemo(() => {
    const positions = {};
    let leftIconIndex = 0;
    let rightIconIndex = 0;
    
    const { EDGE_PADDING, ICON_SPACING, ICON_WIDTH, TOP_PADDING } = POSITIONING_CONSTANTS;
    
    allDesktopItems.forEach((item) => {
      if (item.position === "right") {
        positions[item.id] = {
          x: window.innerWidth - ICON_WIDTH - EDGE_PADDING,
          y: TOP_PADDING + rightIconIndex * ICON_SPACING,
        };
        rightIconIndex++;
      } else {
        positions[item.id] = {
          x: EDGE_PADDING,
          y: TOP_PADDING + leftIconIndex * ICON_SPACING,
        };
        leftIconIndex++;
      }
    });
    
    positionsInitialized.current = true;
    return positions;
  }, [allDesktopItems]);

  const [itemPositions, setItemPositions] = useState(initialPositions);

  // Update positions if allDesktopItems change (e.g. after Sanity load)
  useEffect(() => {
    setItemPositions(initialPositions);
  }, [initialPositions]);

  // Memoize right-aligned items for resize handler
  const rightAlignedItems = useMemo(
    () => allDesktopItems.filter(item => item.position === "right"),
    [allDesktopItems]
  );
  
  // ... existing resize effect ...
  useEffect(() => {
    let resizeTimer;
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setItemPositions(prev => {
          const newPositions = { ...prev };
          const { EDGE_PADDING_RESIZE, ICON_WIDTH } = POSITIONING_CONSTANTS;
          
          rightAlignedItems.forEach(item => {
            if (newPositions[item.id]) {
              newPositions[item.id] = {
                ...newPositions[item.id],
                x: window.innerWidth - ICON_WIDTH - EDGE_PADDING_RESIZE,
              };
            }
          });
          
          return newPositions;
        });
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [rightAlignedItems]);

  const handleItemPositionChange = useCallback((id, newPosition, contextFolderId = null) => {
    if (contextFolderId) {
      return;
    }
    
    setItemPositions(prev => {
      const currentPos = prev[id];
      if (
        currentPos &&
        currentPos.x === newPosition.x &&
        currentPos.y === newPosition.y
      ) {
        return prev;
      }
      
      return {
        ...prev,
        [id]: newPosition,
      };
    });
  }, []);

  return {
    allDesktopItems,
    itemPositions,
    handleItemPositionChange
  };
};