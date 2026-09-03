/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { desktopItems } from '../config/programConfig';
import { useCMSContent } from '../hooks/useDesktopItems';

export const DesktopContext = createContext(null);

const STORAGE_KEY_POSITIONS = 'pane_icon_positions_v1';

const POSITIONING_CONSTANTS = {
  EDGE_PADDING: 20,
  EDGE_PADDING_RESIZE: 20,
  ICON_SPACING: 100,
  ICON_WIDTH: 80,
  TOP_PADDING: 20,
};

export const DesktopProvider = ({ children }) => {
  const { folderMap, cdDrive, loading: cmsLoading } = useCMSContent();
  const [selectedIcon, setSelectedIcon] = useState(null);

  // Memoized desktop items merged with cdDrive
  const allDesktopItems = useMemo(() => {
    return desktopItems
      .map((item) => {
        if (item.id === 'cddrive' && cdDrive) {
          return {
            ...item,
            label: cdDrive.label || item.label,
            fileContent: cdDrive.fileContent || item.fileContent,
          };
        }
        return item;
      })
      .filter((item) => !item.hidden);
  }, [cdDrive]);

  // Default positions calculation
  const calculateDefaultPositions = useCallback(() => {
    const positions = {};
    let leftIconIndex = 0;
    let rightIconIndex = 0;

    const { EDGE_PADDING, ICON_SPACING, ICON_WIDTH, TOP_PADDING } = POSITIONING_CONSTANTS;
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;

    allDesktopItems.forEach((item) => {
      if (item.position === 'right') {
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

    return positions;
  }, [allDesktopItems]);

  // Initialize positions with localStorage fallback
  const [itemPositions, setItemPositions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POSITIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch {
      // ignore localStorage errors
    }
    return {};
  });

  // When allDesktopItems are ready, fill in missing positions if any
  useEffect(() => {
    setItemPositions((prev) => {
      const defaultPositions = calculateDefaultPositions();
      const updated = { ...defaultPositions, ...prev };
      return updated;
    });
  }, [calculateDefaultPositions]);

  // Handle window resize for right-aligned items
  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setItemPositions((prev) => {
          const newPositions = { ...prev };
          const { EDGE_PADDING_RESIZE, ICON_WIDTH } = POSITIONING_CONSTANTS;
          const windowWidth = window.innerWidth;

          allDesktopItems
            .filter((item) => item.position === 'right')
            .forEach((item) => {
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
      clearTimeout(resizeTimer);
    };
  }, [allDesktopItems]);

  // Position change with localStorage persistence
  const handleItemPositionChange = useCallback((id, newPosition, contextFolderId = null) => {
    if (contextFolderId) return;

    setItemPositions((prev) => {
      const currentPos = prev[id];
      if (currentPos && currentPos.x === newPosition.x && currentPos.y === newPosition.y) {
        return prev;
      }
      const updated = {
        ...prev,
        [id]: newPosition,
      };

      try {
        localStorage.setItem(STORAGE_KEY_POSITIONS, JSON.stringify(updated));
      } catch {
        // ignore localStorage quota errors
      }

      return updated;
    });
  }, []);

  // Reset desktop positions to defaults
  const resetDefaultPositions = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_POSITIONS);
    } catch {
      // ignore
    }
    const defaults = calculateDefaultPositions();
    setItemPositions(defaults);
  }, [calculateDefaultPositions]);

  // Memoized folder data lookup
  const folderDataMap = useMemo(() => {
    const map = new Map();
    const processItems = (itemList) => {
      itemList.forEach((item) => {
        if (item.type === 'folder') {
          map.set(item.id, item);
        }
        if (item.contents) {
          processItems(item.contents);
        }
      });
    };
    processItems(allDesktopItems);

    // Merge dynamic folder contents from Sanity
    Object.entries(folderMap).forEach(([folderId, dynamicItems]) => {
      const folder = map.get(folderId);
      if (folder) {
        folder.contents = dynamicItems;
        const processDynamic = (items) => {
          items.forEach((item) => {
            if (item.type === 'folder') {
              map.set(item.id, item);
              if (item.contents) processDynamic(item.contents);
            }
          });
        };
        processDynamic(dynamicItems);
      }
    });

    return map;
  }, [allDesktopItems, folderMap]);

  const value = {
    allDesktopItems,
    itemPositions,
    handleItemPositionChange,
    resetDefaultPositions,
    selectedIcon,
    setSelectedIcon,
    folderDataMap,
    cdDrive,
    cmsLoading,
  };

  return (
    <DesktopContext.Provider value={value}>
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktopContext = () => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktopContext must be used within a DesktopProvider');
  }
  return context;
};

export default DesktopContext;
