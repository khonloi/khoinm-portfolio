import { create } from 'zustand';
import { desktopItems } from '../config/programConfig';
import type { DesktopItem, Position } from '../types';

const STORAGE_KEY_POSITIONS = 'pane_icon_positions_v1';

export const POSITIONING_CONSTANTS = {
  EDGE_PADDING: 20,
  EDGE_PADDING_RESIZE: 20,
  ICON_SPACING: 100,
  ICON_WIDTH: 80,
  TOP_PADDING: 20,
};

export interface DesktopStoreState {
  allDesktopItems: DesktopItem[];
  itemPositions: Record<string, Position>;
  selectedIcon: string | null;
  folderDataMap: Map<string, DesktopItem>;
  cdDrive: any;
  cmsLoading: boolean;

  // Actions
  setSelectedIcon: (id: string | null) => void;
  handleItemPositionChange: (id: string, newPosition: Position, contextFolderId?: string | null) => void;
  resetDefaultPositions: () => void;
  setCMSContent: (data: {
    folderMap?: Record<string, any>;
    cdDrive?: any;
    customShortcuts?: DesktopItem[];
    loading?: boolean;
  }) => void;
  handleResize: (windowWidth: number) => void;
  reset: () => void;
}

export const calculatePositions = (
  items: DesktopItem[],
  windowWidth: number = typeof window !== 'undefined' ? window.innerWidth : 1024
): Record<string, Position> => {
  const positions: Record<string, Position> = {};
  let leftIconIndex = 0;
  let rightIconIndex = 0;

  const { EDGE_PADDING, ICON_SPACING, ICON_WIDTH, TOP_PADDING } = POSITIONING_CONSTANTS;

  items.forEach((item) => {
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
};

export const buildFolderDataMap = (
  items: DesktopItem[],
  folderMap?: Record<string, any>
): Map<string, DesktopItem> => {
  const map = new Map<string, DesktopItem>();
  const processItems = (itemList: DesktopItem[]) => {
    itemList.forEach((item) => {
      if (item.type === 'folder') {
        map.set(item.id, item);
      }
      if (item.contents) {
        processItems(item.contents);
      }
    });
  };
  processItems(items);

  // Merge dynamic folder contents from Sanity
  Object.entries(folderMap || {}).forEach(([folderId, dynamicItems]) => {
    const folder = map.get(folderId);
    if (folder) {
      folder.contents = dynamicItems as DesktopItem[];
      const processDynamic = (subItems: DesktopItem[]) => {
        subItems.forEach((subItem) => {
          if (subItem.type === 'folder') {
            map.set(subItem.id, subItem);
            if (subItem.contents) processDynamic(subItem.contents);
          }
        });
      };
      processDynamic(dynamicItems as DesktopItem[]);
    }
  });

  return map;
};

const getSavedPositions = (): Record<string, Position> => {
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
};

const initialItems = desktopItems.filter((item) => !item.hidden);
const initialDefaults = calculatePositions(initialItems);
const initialPositions = { ...initialDefaults, ...getSavedPositions() };
const initialFolderMap = buildFolderDataMap(initialItems);

export const useDesktopStore = create<DesktopStoreState>((set, get) => ({
  allDesktopItems: initialItems,
  itemPositions: initialPositions,
  selectedIcon: null,
  folderDataMap: initialFolderMap,
  cdDrive: null,
  cmsLoading: true,

  reset: () => {
    const defaultPositions = calculatePositions(initialItems);
    set({
      allDesktopItems: initialItems,
      itemPositions: defaultPositions,
      selectedIcon: null,
      folderDataMap: buildFolderDataMap(initialItems),
      cdDrive: null,
      cmsLoading: false,
    });
  },

  setSelectedIcon: (id: string | null) => {
    set({ selectedIcon: id });
  },

  handleItemPositionChange: (id: string, newPosition: Position, contextFolderId?: string | null) => {
    if (contextFolderId) return;

    set((state) => {
      const currentPos = state.itemPositions[id];
      if (currentPos && currentPos.x === newPosition.x && currentPos.y === newPosition.y) {
        return state;
      }

      const updated = {
        ...state.itemPositions,
        [id]: newPosition,
      };

      try {
        localStorage.setItem(STORAGE_KEY_POSITIONS, JSON.stringify(updated));
      } catch {
        // ignore localStorage quota errors
      }

      return { itemPositions: updated };
    });
  },

  resetDefaultPositions: () => {
    try {
      localStorage.removeItem(STORAGE_KEY_POSITIONS);
    } catch {
      // ignore
    }
    const defaults = calculatePositions(get().allDesktopItems);
    set({ itemPositions: defaults });
  },

  setCMSContent: ({ folderMap, cdDrive, customShortcuts, loading }) => {
    set((state) => {
      const nextCdDrive = cdDrive !== undefined ? cdDrive : state.cdDrive;
      const nextLoading = loading !== undefined ? loading : state.cmsLoading;

      const baseItems: DesktopItem[] = desktopItems
        .map((item) => {
          if (item.id === 'cddrive' && nextCdDrive) {
            return {
              ...item,
              label: nextCdDrive.label || item.label,
              fileContent: nextCdDrive.fileContent || item.fileContent,
            };
          }
          return item;
        })
        .filter((item) => !item.hidden);

      if (customShortcuts && customShortcuts.length > 0) {
        baseItems.push(...customShortcuts);
      }

      const nextFolderMap = buildFolderDataMap(baseItems, folderMap);
      const defaults = calculatePositions(baseItems);
      const updatedPositions = { ...defaults, ...state.itemPositions };

      return {
        allDesktopItems: baseItems,
        folderDataMap: nextFolderMap,
        cdDrive: nextCdDrive,
        cmsLoading: nextLoading,
        itemPositions: updatedPositions,
      };
    });
  },

  handleResize: (windowWidth: number) => {
    set((state) => {
      const { EDGE_PADDING_RESIZE, ICON_WIDTH } = POSITIONING_CONSTANTS;
      const newPositions = { ...state.itemPositions };

      state.allDesktopItems
        .filter((item) => item.position === 'right')
        .forEach((item) => {
          if (newPositions[item.id]) {
            newPositions[item.id] = {
              ...newPositions[item.id],
              x: windowWidth - ICON_WIDTH - EDGE_PADDING_RESIZE,
            };
          }
        });

      return { itemPositions: newPositions };
    });
  },
}));
