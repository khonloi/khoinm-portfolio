import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Calendar from '../Calendar';
import {
  getMonthGrid,
  formatFullSelectedDate,
  formatMonthYear,
  shiftMonthPreservingDay,
} from '../calendarUtils';
import { isRegisteredWindow } from '../../../config/windowRegistry';

describe('calendarUtils', () => {
  it('generates a complete 7-column grid for April 2025 starting on Tuesday', () => {
    const grid = getMonthGrid(2025, 3); // April is month 3 (0-indexed)
    expect(grid).toHaveLength(35);
    // April 1, 2025 is Tuesday (index 2): Sunday & Monday are blank
    expect(grid[0].day).toBeNull();
    expect(grid[1].day).toBeNull();
    expect(grid[2].day).toBe(1);
    expect(grid[2].dateKey).toBe('2025-04-01');
    // April 30 is at index 31 (2 + 29)
    expect(grid[31].day).toBe(30);
    // Trailing blanks
    expect(grid[32].day).toBeNull();
    expect(grid[34].day).toBeNull();
  });

  it('formats full selected date and month/year labels cleanly', () => {
    const april12 = new Date(2025, 3, 12);
    expect(formatFullSelectedDate(april12)).toBe('Saturday, April 12, 2025');
    expect(formatMonthYear(2025, 3)).toBe('April 2025');
  });

  it('clamps month end days cleanly when shifting months', () => {
    const jan31 = new Date(2025, 0, 31);
    const feb = shiftMonthPreservingDay(jan31, 1);
    expect(feb.getFullYear()).toBe(2025);
    expect(feb.getMonth()).toBe(1);
    expect(feb.getDate()).toBe(28);
  });
});

describe('Calendar component', () => {
  const sampleDate = new Date(2025, 3, 12); // Saturday, April 12, 2025

  beforeEach(() => {
    localStorage.clear();
  });

  it('is registered in the window registry', () => {
    expect(isRegisteredWindow('calendar')).toBe(true);
  });

  it('renders Hayami themed controls, LayeredBox containers, and selected day without clock section', () => {
    render(<Calendar id="calendar" initialDate={sampleDate} />);

    const dateBanner = screen.getByTestId('calendar-selected-date');
    expect(dateBanner).toHaveTextContent('Saturday, April 12, 2025');
    expect(dateBanner.closest('.layered-box-layer-1')).toBeInTheDocument();
    expect(dateBanner.closest('.h-9')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-month-title')).toHaveTextContent('April 2025');
    expect(screen.queryByText(/:\d{2}\s*(AM|PM)/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Today' })).not.toBeInTheDocument();

    const prevBtn = screen.getByRole('button', { name: 'Previous month' });
    const nextBtn = screen.getByRole('button', { name: 'Next month' });
    expect(prevBtn).toHaveClass('trim-corners-ring');
    expect(prevBtn).toHaveClass('ring-2');
    expect(prevBtn).not.toHaveClass('!ring-1');
    expect(nextBtn).toHaveClass('trim-corners-ring');
    expect(nextBtn).toHaveClass('ring-2');
    expect(nextBtn).not.toHaveClass('!ring-1');

    const weekdayHeaders = screen.getAllByText('W')[0];
    expect(weekdayHeaders).toHaveClass('border-r', 'border-windows-grey');

    const grid = screen.getByRole('grid', { name: 'April 2025 calendar' });
    expect(grid.closest('.layered-box-layer-1')).toBeInTheDocument();

    const selectedCell = screen.getByRole('gridcell', { name: 'April 12, 2025' });
    expect(selectedCell).toHaveAttribute('aria-selected', 'true');
    expect(selectedCell).toHaveClass('bg-windows-purple');
  });

  it('selects another day when clicked and updates the full date header', () => {
    render(<Calendar id="calendar" initialDate={sampleDate} />);

    const day24 = screen.getByRole('gridcell', { name: 'April 24, 2025' });
    fireEvent.click(day24);

    expect(day24).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('calendar-selected-date')).toHaveTextContent(
      'Thursday, April 24, 2025'
    );
  });

  it('navigates between months via Previous and Next month buttons', () => {
    render(<Calendar id="calendar" initialDate={sampleDate} />);

    fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByTestId('calendar-month-title')).toHaveTextContent('May 2025');
    expect(screen.getByTestId('calendar-selected-date')).toHaveTextContent(
      'Monday, May 12, 2025'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByTestId('calendar-month-title')).toHaveTextContent('April 2025');
  });

  it('saves per-day scratchpad notes inside a LayeredBox and marks dates with notes', () => {
    render(<Calendar id="calendar" initialDate={sampleDate} />);

    const noteInput = screen.getByLabelText('Notes for Saturday, April 12, 2025');
    expect(noteInput.closest('.layered-box-layer-1')).toBeInTheDocument();

    fireEvent.change(noteInput, { target: { value: 'Ship Calendar app' } });
    expect(noteInput).toHaveValue('Ship Calendar app');

    // Switch to April 13: note clears, April 12 shows note indicator dot
    fireEvent.click(screen.getByRole('gridcell', { name: 'April 13, 2025' }));
    expect(screen.getByLabelText('Notes for Sunday, April 13, 2025')).toHaveValue('');
    expect(screen.getByTestId('calendar-note-dot-2025-04-12')).toBeInTheDocument();

    // Switch back to April 12: note is preserved
    fireEvent.click(screen.getByRole('gridcell', { name: 'April 12, 2025' }));
    expect(screen.getByLabelText('Notes for Saturday, April 12, 2025')).toHaveValue(
      'Ship Calendar app'
    );
  });
});
