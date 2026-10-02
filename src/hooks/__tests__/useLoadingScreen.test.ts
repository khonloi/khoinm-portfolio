import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useLoadingScreen } from '../useLoadingScreen';

vi.mock('../../data/sounds', () => ({
  playSound: vi.fn(),
}));

vi.mock('../../data/cursors', () => ({
  getCursorStyle: vi.fn().mockReturnValue('default'),
}));

describe('useLoadingScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useLoadingScreen());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isDelaying).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.menuBarVisible).toBe(false);
  });

  it('skipLoading should immediately finish loading', () => {
    const { result } = renderHook(() => useLoadingScreen());
    
    act(() => {
      result.current.skipLoading();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isDelaying).toBe(false);
    expect(result.current.menuBarVisible).toBe(true);
  });
});
