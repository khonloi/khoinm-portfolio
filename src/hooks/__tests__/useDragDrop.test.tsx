import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDragDrop } from '../useDragDrop';
import type { Position } from '../../types';

interface TestDraggableProps {
  id?: string;
  initialPos?: Position;
  onPositionChange?: (id: string, pos: Position) => void;
  onSelect?: (id: string) => void;
  useOutline?: boolean;
}

const TestDraggable: React.FC<TestDraggableProps> = ({
  id = 'item-1',
  initialPos = { x: 50, y: 50 },
  onPositionChange,
  onSelect,
  useOutline = false,
}) => {
  const { elementRef, isDragging, previewPosition, handleMouseDown } = useDragDrop(
    id,
    initialPos,
    onPositionChange,
    onSelect,
    { useOutline }
  );

  return (
    <div className="desktop" style={{ width: 800, height: 600, position: 'relative' }}>
      <div
        ref={elementRef}
        data-testid="draggable-box"
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          left: previewPosition.x,
          top: previewPosition.y,
          width: 80,
          height: 80,
        }}
      >
        <span data-testid="status">{isDragging ? 'Dragging' : 'Idle'}</span>
        <button data-testid="nested-btn" type="button">
          Action
        </button>
      </div>
    </div>
  );
};

describe('useDragDrop hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 80,
      height: 80,
      top: 50,
      left: 50,
      bottom: 130,
      right: 130,
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

  it('initializes with idle state and initial position', () => {
    render(<TestDraggable initialPos={{ x: 100, y: 150 }} />);

    expect(screen.getByTestId('status')).toHaveTextContent('Idle');
    const box = screen.getByTestId('draggable-box');
    expect(box.style.left).toBe('100px');
    expect(box.style.top).toBe('150px');
  });

  it('triggers onSelect and enters dragging state on primary mousedown', () => {
    const handleSelect = vi.fn();
    render(<TestDraggable onSelect={handleSelect} />);

    const box = screen.getByTestId('draggable-box');

    act(() => {
      fireEvent.mouseDown(box, { button: 0, clientX: 60, clientY: 60 });
    });

    expect(handleSelect).toHaveBeenCalledWith('item-1');
    expect(screen.getByTestId('status')).toHaveTextContent('Dragging');
  });

  it('does not start dragging on secondary (right click) mousedown', () => {
    const handleSelect = vi.fn();
    render(<TestDraggable onSelect={handleSelect} />);

    const box = screen.getByTestId('draggable-box');

    act(() => {
      fireEvent.mouseDown(box, { button: 2, clientX: 60, clientY: 60 });
    });

    expect(screen.getByTestId('status')).toHaveTextContent('Idle');
  });

  it('does not start dragging when clicking on a nested button', () => {
    const handleSelect = vi.fn();
    render(<TestDraggable onSelect={handleSelect} />);

    const btn = screen.getByTestId('nested-btn');

    act(() => {
      fireEvent.mouseDown(btn, { button: 0, clientX: 60, clientY: 60 });
    });

    expect(screen.getByTestId('status')).toHaveTextContent('Idle');
  });

  it('terminates dragging on mouseup', () => {
    render(<TestDraggable />);

    const box = screen.getByTestId('draggable-box');

    act(() => {
      fireEvent.mouseDown(box, { button: 0, clientX: 60, clientY: 60 });
    });
    expect(screen.getByTestId('status')).toHaveTextContent('Dragging');

    act(() => {
      fireEvent.mouseUp(document);
    });
    expect(screen.getByTestId('status')).toHaveTextContent('Idle');
  });
});
