import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Window from '../Window';

describe('Window component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      return setTimeout(cb, 16) as unknown as number;
    });
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 500,
      height: 400,
      top: 50,
      left: 50,
      bottom: 450,
      right: 550,
      x: 50,
      y: 50,
      toJSON: () => {},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders window title and content', () => {
    act(() => {
      render(
        <Window id="win-1" title="My Documents" onClose={vi.fn()}>
          <div>Document Content</div>
        </Window>
      );
    });

    expect(screen.getByText('My Documents')).toBeInTheDocument();
    expect(screen.getByText('Document Content')).toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked', () => {
    const handleClose = vi.fn();

    act(() => {
      render(
        <Window id="win-close-test" title="Editor" onClose={handleClose}>
          <div>Content</div>
        </Window>
      );
    });

    const closeBtn = screen.getByTitle('Close Window');
    act(() => {
      fireEvent.click(closeBtn);
    });
    expect(handleClose).toHaveBeenCalledWith('win-close-test');
  });

  it('triggers onMinimize when minimize button is clicked', () => {
    const handleMinimize = vi.fn();

    act(() => {
      render(
        <Window
          id="win-min-test"
          title="Terminal"
          onClose={vi.fn()}
          onMinimize={handleMinimize}
        >
          <div>Terminal Body</div>
        </Window>
      );
    });

    const minBtn = screen.getByTitle('Minimize Window');
    act(() => {
      fireEvent.click(minBtn);
    });
    expect(handleMinimize).toHaveBeenCalledWith('win-min-test', expect.objectContaining({
      title: 'Terminal',
    }));
  });

  it('renders Maximize button when window is not maximized', () => {
    act(() => {
      render(
        <Window
          id="win-max-test"
          title="Gallery"
          onClose={vi.fn()}
          isMaximizable={true}
          isMaximized={false}
        >
          <div>Images</div>
        </Window>
      );
    });

    expect(screen.getByTitle('Maximize Window')).toBeInTheDocument();
  });

  it('renders Restore button when window is initialized as maximized', () => {
    act(() => {
      render(
        <Window
          id="win-restore-test"
          title="Gallery"
          onClose={vi.fn()}
          isMaximizable={true}
          isMaximized={true}
        >
          <div>Images</div>
        </Window>
      );
    });

    expect(screen.getByTitle('Restore Window')).toBeInTheDocument();
  });

  it('applies focused style when isFocused is true', () => {
    let rerenderFn: any;
    act(() => {
      const { rerender } = render(
        <Window id="win-focus" title="Active Win" onClose={vi.fn()} isFocused={true}>
          <div>Body</div>
        </Window>
      );
      rerenderFn = rerender;
    });

    const titleBar = screen.getByText('Active Win').closest('.window-title-bar');
    expect(titleBar).toHaveClass('bg-windows-purple');

    act(() => {
      rerenderFn(
        <Window id="win-focus" title="Active Win" onClose={vi.fn()} isFocused={false}>
          <div>Body</div>
        </Window>
      );
    });

    expect(titleBar).toHaveClass('bg-windows-grey');
  });

  it('handles fullscreen mode and escape key', () => {
    const handleClose = vi.fn();
    const handleFullScreenChange = vi.fn();

    act(() => {
      render(
        <Window
          id="win-fs"
          title="Game"
          onClose={handleClose}
          onFullScreenChange={handleFullScreenChange}
          isFullScreen={true}
        >
          <div data-testid="game-content">Full Game Area</div>
        </Window>
      );
    });

    expect(screen.getByTestId('game-content')).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });

    expect(handleClose).toHaveBeenCalledWith('win-fs');
    expect(handleFullScreenChange).toHaveBeenCalledWith(false);
  });
});
