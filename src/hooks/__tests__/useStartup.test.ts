import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useStartup } from '../useStartup';

vi.mock('../../data/sounds', () => ({
  playSound: vi.fn().mockResolvedValue(undefined),
}));

describe('useStartup hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('does not start while loading or delaying', () => {
    const handleDoubleClick = vi.fn();

    let hookResult: any;
    act(() => {
      const { result } = renderHook(() =>
        useStartup({
          isLoading: true,
          isDelaying: false,
          isShuttingDown: false,
          handleItemDoubleClick: handleDoubleClick,
        })
      );
      hookResult = result;
    });

    expect(hookResult.current.hasStarted).toBe(false);
    expect(handleDoubleClick).not.toHaveBeenCalled();
  });

  it('triggers startup programs and boots when loading completes', async () => {
    const handleDoubleClick = vi.fn();

    let hookResult: any;
    let rerenderFn: any;

    act(() => {
      const { result, rerender } = renderHook(
        ({ isLoading }) =>
          useStartup({
            isLoading,
            isDelaying: false,
            isShuttingDown: false,
            handleItemDoubleClick: handleDoubleClick,
          }),
        { initialProps: { isLoading: true } }
      );
      hookResult = result;
      rerenderFn = rerender;
    });

    expect(hookResult.current.hasStarted).toBe(false);

    // Transition to loaded state
    await act(async () => {
      rerenderFn({ isLoading: false });
    });

    expect(hookResult.current.hasStarted).toBe(true);
    expect(handleDoubleClick).toHaveBeenCalled();
  });

  it('resets idle counter on user activity', async () => {
    const handleDoubleClick = vi.fn();

    let hookResult: any;
    act(() => {
      const { result } = renderHook(() =>
        useStartup({
          isLoading: false,
          isDelaying: false,
          isShuttingDown: false,
          handleItemDoubleClick: handleDoubleClick,
        })
      );
      hookResult = result;
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(hookResult.current.hasStarted).toBe(true);

    // Simulate mouse move to trigger idle reset
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove'));
    });
  });
});
