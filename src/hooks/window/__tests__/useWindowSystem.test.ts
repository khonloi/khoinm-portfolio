import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useWindowSystem } from '../useWindowSystem';
import * as sounds from '../../../data/sounds';

import { useWindowStore } from '../../../stores/useWindowStore';

// Mock the sounds to prevent audio playback errors during tests
vi.mock('../../../data/sounds', () => ({
  playSound: vi.fn(),
}));

describe('useWindowSystem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useWindowStore.getState().reset();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useWindowSystem());
    expect(result.current.openWindows).toEqual([]);
    expect(result.current.focusedWindow).toBeNull();
    expect(result.current.minimizedWindows).toEqual([]);
  });

  it('should open a window via handleItemDoubleClick', () => {
    const { result } = renderHook(() => useWindowSystem());
    
    act(() => {
      result.current.handleItemDoubleClick({
        id: 'test-app',
        title: 'Test App',
        type: 'program',
      }, 'Test App Label', { skipTracking: true });
    });

    expect(result.current.openWindows).toHaveLength(1);
    expect(result.current.openWindows[0].id).toBe('test-app');
    expect(result.current.focusedWindow).toBe('test-app');
  });

  it('should close a window', () => {
    const { result } = renderHook(() => useWindowSystem());
    
    act(() => {
      result.current.handleItemDoubleClick({ id: 'win1', title: 'Window 1', type: 'program' }, 'Win1', { skipTracking: true });
    });
    
    expect(result.current.openWindows).toHaveLength(1);

    act(() => {
      result.current.handleCloseWindow('win1');
    });

    expect(result.current.openWindows).toHaveLength(0);
    expect(result.current.focusedWindow).toBeNull();
  });

  it('should minimize and restore a window', async () => {
    const { result } = renderHook(() => useWindowSystem());
    
    act(() => {
      result.current.handleItemDoubleClick({ id: 'win1', title: 'Window 1', type: 'program', icon: 'icon1' }, 'Win1', { skipTracking: true });
    });
    
    // Minimize
    await act(async () => {
      await result.current.handleMinimizeWindow('win1', { title: 'Window 1', icon: 'icon1' });
    });

    expect(result.current.minimizedWindows).toHaveLength(1);
    expect(result.current.minimizedWindows[0].id).toBe('win1');
    expect(result.current.minimizedWindowIds.has('win1')).toBe(true);
    expect(sounds.playSound).toHaveBeenCalledWith('minimize');

    // Restore
    await act(async () => {
      await result.current.handleRestoreWindow('win1');
    });

    expect(result.current.minimizedWindows).toHaveLength(0);
    expect(result.current.minimizedWindowIds.has('win1')).toBe(false);
  });
});
