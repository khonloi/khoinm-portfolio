import { describe, it, expect, beforeEach } from 'vitest';
import { useDesktopStore } from '../useDesktopStore';

describe('useDesktopStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useDesktopStore.getState().reset();
  });

  it('initializes with default items and positions', () => {
    const state = useDesktopStore.getState();
    expect(state.allDesktopItems.length).toBeGreaterThan(0);
    expect(Object.keys(state.itemPositions).length).toBeGreaterThan(0);
    expect(state.selectedIcon).toBeNull();
  });

  it('selects and deselects an icon', () => {
    useDesktopStore.getState().setSelectedIcon('about');
    expect(useDesktopStore.getState().selectedIcon).toBe('about');

    useDesktopStore.getState().setSelectedIcon(null);
    expect(useDesktopStore.getState().selectedIcon).toBeNull();
  });

  it('updates item position and persists to localStorage', () => {
    const newPos = { x: 150, y: 250 };
    useDesktopStore.getState().handleItemPositionChange('about', newPos);

    expect(useDesktopStore.getState().itemPositions['about']).toEqual(newPos);

    const saved = localStorage.getItem('pane_icon_positions_v1');
    expect(saved).toBeTruthy();
    expect(JSON.parse(saved!)['about']).toEqual(newPos);
  });

  it('resets default positions', () => {
    useDesktopStore.getState().handleItemPositionChange('about', { x: 999, y: 999 });
    useDesktopStore.getState().resetDefaultPositions();

    const currentPos = useDesktopStore.getState().itemPositions['about'];
    expect(currentPos.x).not.toBe(999);
  });

  it('merges CMS content and custom shortcuts', () => {
    const customShortcuts = [
      {
        id: 'custom-1',
        label: 'Custom Shortcut',
        type: 'program' as const,
        iconSrc: 'custom.ico',
      },
    ];

    useDesktopStore.getState().setCMSContent({
      customShortcuts,
      loading: false,
    });

    const state = useDesktopStore.getState();
    expect(state.cmsLoading).toBe(false);
    expect(state.allDesktopItems.some((item) => item.id === 'custom-1')).toBe(true);
    expect(state.itemPositions['custom-1']).toBeDefined();
  });
});
