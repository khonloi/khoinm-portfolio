import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  useWindowStore,
  selectHasFullScreenWindow,
  selectHasActiveWindows,
} from '../useWindowStore';

vi.mock('../../data/sounds', () => ({
  playSound: vi.fn().mockResolvedValue(undefined),
}));

describe('useWindowStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useWindowStore.getState().reset();
  });

  it('initializes with default empty state', () => {
    const state = useWindowStore.getState();
    expect(state.openWindows).toEqual([]);
    expect(state.focusedWindow).toBeNull();
    expect(state.minimizedWindows).toEqual([]);
    expect(state.minimizedWindowIds.size).toBe(0);
    expect(selectHasActiveWindows(state)).toBe(false);
    expect(selectHasFullScreenWindow(state)).toBe(false);
  });

  it('opens a window and sets focus', () => {
    useWindowStore.getState().openWindow({
      id: 'app-1',
      title: 'App One',
      type: 'program',
    });
    useWindowStore.getState().handleWindowLoadingChange('app-1', false);

    const state = useWindowStore.getState();
    expect(state.openWindows).toHaveLength(1);
    expect(state.openWindows[0].id).toBe('app-1');
    expect(state.focusedWindow).toBe('app-1');
    expect(selectHasActiveWindows(state)).toBe(true);
  });

  it('does not duplicate window if opened twice', () => {
    useWindowStore.getState().openWindow({ id: 'app-1', title: 'App One' });
    useWindowStore.getState().openWindow({ id: 'app-1', title: 'App One' });

    expect(useWindowStore.getState().openWindows).toHaveLength(1);
  });

  it('focuses a window and brings it to the top z-index', () => {
    useWindowStore.getState().openWindow({ id: 'app-1', title: 'App One' });
    useWindowStore.getState().openWindow({ id: 'app-2', title: 'App Two' });

    const win1InitialZ = useWindowStore.getState().openWindows.find((w) => w.id === 'app-1')!.zIndex;
    const win2InitialZ = useWindowStore.getState().openWindows.find((w) => w.id === 'app-2')!.zIndex;
    expect(win2InitialZ).toBeGreaterThan(win1InitialZ);

    useWindowStore.getState().focusWindow('app-1');
    const win1UpdatedZ = useWindowStore.getState().openWindows.find((w) => w.id === 'app-1')!.zIndex;
    expect(win1UpdatedZ).toBeGreaterThan(win2InitialZ);
    expect(useWindowStore.getState().focusedWindow).toBe('app-1');
  });

  it('minimizes and restores a window', async () => {
    useWindowStore.getState().openWindow({ id: 'app-1', title: 'App One', iconSrc: 'icon.png' });

    await useWindowStore.getState().handleMinimizeWindow('app-1', {
      title: 'App One',
      icon: 'icon.png',
    });

    let state = useWindowStore.getState();
    expect(state.minimizedWindows).toHaveLength(1);
    expect(state.minimizedWindowIds.has('app-1')).toBe(true);

    await useWindowStore.getState().handleRestoreWindow('app-1');

    state = useWindowStore.getState();
    expect(state.minimizedWindows).toHaveLength(0);
    expect(state.minimizedWindowIds.has('app-1')).toBe(false);
  });

  it('closes a window and adjusts focused window', () => {
    useWindowStore.getState().openWindow({ id: 'app-1', title: 'App One' });
    useWindowStore.getState().openWindow({ id: 'app-2', title: 'App Two' });

    expect(useWindowStore.getState().focusedWindow).toBe('app-2');

    useWindowStore.getState().handleCloseWindow('app-2');

    const state = useWindowStore.getState();
    expect(state.openWindows).toHaveLength(1);
    expect(state.openWindows[0].id).toBe('app-1');
    expect(state.focusedWindow).toBe('app-1');

    useWindowStore.getState().handleCloseWindow('app-1');
    expect(useWindowStore.getState().openWindows).toHaveLength(0);
    expect(useWindowStore.getState().focusedWindow).toBeNull();
  });

  it('handles zoom animation lifecycle', () => {
    const onComplete = vi.fn();
    const animId = useWindowStore.getState().triggerZoomAnimation({
      id: 'test-anim',
      onComplete,
    });

    expect(useWindowStore.getState().zoomAnimations).toHaveLength(1);
    expect(useWindowStore.getState().zoomAnimations[0].id).toBe(animId);

    useWindowStore.getState().handleAnimationComplete(animId);
    expect(onComplete).toHaveBeenCalled();
    expect(useWindowStore.getState().zoomAnimations).toHaveLength(0);
  });
});
