import { describe, it, expect, beforeEach } from 'vitest';
import { useSystemStore } from '../useSystemStore';

describe('useSystemStore', () => {
  beforeEach(() => {
    useSystemStore.getState().reset();
  });

  it('initializes with default system state', () => {
    const state = useSystemStore.getState();
    expect(state.isFullScreen).toBe(false);
    expect(state.isBSODActive).toBe(false);
    expect(state.isLoading).toBe(true);
    expect(state.isShuttingDown).toBe(false);
    expect(state.shutdownStage).toBe(0);
  });

  it('triggers and closes BSOD', () => {
    useSystemStore.getState().triggerBSOD();
    expect(useSystemStore.getState().isBSODActive).toBe(true);

    useSystemStore.getState().closeBSOD();
    expect(useSystemStore.getState().isBSODActive).toBe(false);
  });

  it('toggles full screen mode', () => {
    useSystemStore.getState().setIsFullScreen(true);
    expect(useSystemStore.getState().isFullScreen).toBe(true);

    useSystemStore.getState().setIsFullScreen(false);
    expect(useSystemStore.getState().isFullScreen).toBe(false);
  });

  it('updates network status and shows offline dialog when disconnected', () => {
    useSystemStore.getState().setIsOnline(false);
    expect(useSystemStore.getState().isOnline).toBe(false);
    expect(useSystemStore.getState().showOfflineDialog).toBe(true);

    useSystemStore.getState().setShowOfflineDialog(false);
    expect(useSystemStore.getState().showOfflineDialog).toBe(false);
  });

  it('skips loading screen', () => {
    useSystemStore.getState().skipLoading();
    const state = useSystemStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.isDelaying).toBe(false);
    expect(state.menuBarVisible).toBe(true);
    expect(state.progress).toBe(100);
  });

  it('handles shutdown sequence stages', () => {
    useSystemStore.getState().startShutdown();
    expect(useSystemStore.getState().isShuttingDown).toBe(true);

    useSystemStore.getState().setShutdownStage(1);
    expect(useSystemStore.getState().shutdownStage).toBe(1);

    useSystemStore.getState().setShutdownStage(2);
    expect(useSystemStore.getState().shutdownStage).toBe(2);
  });
});
