import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Dialog from '../Dialog';

describe('Dialog component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('does not render when isVisible is false', () => {
    render(<Dialog isVisible={false} title="Hidden Dialog" message="Secret" />);
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title, message, and buttons after initial loading delay', () => {
    const handleConfirm = vi.fn();
    const handleCancel = vi.fn();

    render(
      <Dialog
        id="test-dlg"
        isVisible={true}
        title="Confirm Delete"
        message="Are you sure you want to delete this file?"
        buttons={[
          { label: 'Cancel', onClick: handleCancel },
          { label: 'Confirm', onClick: handleConfirm },
        ]}
      />
    );

    // During loading delay (< 500ms), nothing rendered
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Advance timers past 500ms simulated delay
    act(() => {
      vi.advanceTimersByTime(550);
    });

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this file?')).toBeInTheDocument();

    const confirmBtn = screen.getByText('Confirm');
    fireEvent.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalledOnce();

    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);
    expect(handleCancel).toHaveBeenCalledOnce();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();

    render(
      <Dialog
        id="test-dlg"
        isVisible={true}
        title="Settings"
        onClose={handleClose}
      />
    );

    act(() => {
      vi.advanceTimersByTime(550);
    });

    const closeBtn = screen.getByLabelText('Close Window');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledWith('test-dlg');
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();

    render(
      <Dialog
        id="test-dlg"
        isVisible={true}
        title="Modal"
        onClose={handleClose}
      />
    );

    act(() => {
      vi.advanceTimersByTime(550);
    });

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledWith('test-dlg');
  });
});
