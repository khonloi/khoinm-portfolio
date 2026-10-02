import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { desktopItems } from "../config/programConfig";
import type { DesktopItem, Position } from "../types";

// Constants for positioning - extracted for better maintainability
const POSITIONING_CONSTANTS = {
  EDGE_PADDING: 20,
  EDGE_PADDING_RESIZE: 20,
  ICON_SPACING: 100,
  ICON_WIDTH: 80,
  TOP_PADDING: 20,
};

export interface CdDriveData {
  label?: string;
  fileContent?: string;
}

export const useDesktop = (cdDrive?: CdDriveData | null) => {
  // Create memoized desktop items
  const allDesktopItems = useMemo<DesktopItem[]>(() => {
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
  const initialPositions = useMemo<Record<string, Position>>(() => {
    const positions: Record<string, Position> = {};
    let leftIconIndex = 0;
    let rightIconIndex = 0;
    
    const { EDGE_PADDING, ICON_SPACING, ICON_WIDTH, TOP_PADDING } = POSITIONING_CONSTANTS;
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    
    allDesktopItems.forEach((item) => {
      if (item.position === "right") {
        positions[item.id] = {
          x: windowWidth - ICON_WIDTH - EDGE_PADDING,
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

  const [itemPositions, setItemPositions] = useState<Record<string, Position>>(initialPositions);

  // Update positions if allDesktopItems change (e.g. after Sanity load)
  useEffect(() => {
    setItemPositions(initialPositions);
  }, [initialPositions]);

  // Memoize right-aligned items for resize handler
  const rightAlignedItems = useMemo(
    () => allDesktopItems.filter(item => item.position === "right"),
    [allDesktopItems]
  );
  
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setItemPositions(prev => {
          const newPositions = { ...prev };
          const { EDGE_PADDING_RESIZE, ICON_WIDTH } = POSITIONING_CONSTANTS;
          const windowWidth = window.innerWidth;
          
          rightAlignedItems.forEach(item => {
            if (newPositions[item.id]) {
              newPositions[item.id] = {
                ...newPositions[item.id],
                x: windowWidth - ICON_WIDTH - EDGE_PADDING_RESIZE,
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
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, [rightAlignedItems]);

  const handleItemPositionChange = useCallback((id: string, newPosition: Position, contextFolderId: string | null = null) => {
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