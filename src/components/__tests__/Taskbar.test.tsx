import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Taskbar from '../Taskbar';
import { useWindowStore } from '../../stores/useWindowStore';
import type { MinimizedWindow } from '../../types';

describe('Taskbar component', () => {
  beforeEach(() => {
    useWindowStore.getState().reset();
  });

  it('renders nothing when there are no minimized windows', () => {
    const { container } = render(<Taskbar minimizedWindows={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders restore buttons for minimized windows', () => {
    const mockWindows: MinimizedWindow[] = [
      { id: 'notepad', title: 'Notepad', icon: '/icons/notepad.ico' },
      { id: 'paint', title: 'Paint', icon: '/icons/paint.ico' },
    ];

    render(<Taskbar minimizedWindows={mockWindows} />);

    expect(screen.getByTitle('Restore Notepad')).toBeInTheDocument();
    expect(screen.getByTitle('Restore Paint')).toBeInTheDocument();
    expect(screen.getByTitle('Collapse Taskbar')).toBeInTheDocument();
  });

  it('calls onRestore when a minimized window item is clicked', () => {
    const handleRestore = vi.fn();
    const mockWindows: MinimizedWindow[] = [
      { id: 'calc', title: 'Calculator' },
    ];

    render(<Taskbar minimizedWindows={mockWindows} onRestore={handleRestore} />);

    const restoreBtn = screen.getByTitle('Restore Calculator');
    act(() => {
      fireEvent.click(restoreBtn);
    });

    expect(handleRestore).toHaveBeenCalledWith('calc', expect.objectContaining({
      originRect: expect.any(Object),
    }));
  });

  it('toggles collapse state via onToggleCollapse', () => {
    const handleToggle = vi.fn();
    const mockWindows: MinimizedWindow[] = [
      { id: 'calc', title: 'Calculator' },
    ];

    const { rerender } = render(
      <Taskbar
        minimizedWindows={mockWindows}
        isCollapsed={false}
        onToggleCollapse={handleToggle}
      />
    );

    const collapseBtn = screen.getByTitle('Collapse Taskbar');
    expect(collapseBtn).toBeInTheDocument();
    expect(screen.getByTitle('Restore Calculator')).toBeInTheDocument();

    act(() => {
      fireEvent.click(collapseBtn);
    });
    expect(handleToggle).toHaveBeenCalledOnce();

    rerender(
      <Taskbar
        minimizedWindows={mockWindows}
        isCollapsed={true}
        onToggleCollapse={handleToggle}
      />
    );

    expect(screen.getByTitle('Expand Taskbar')).toBeInTheDocument();
    expect(screen.queryByTitle('Restore Calculator')).not.toBeInTheDocument();
  });
});
