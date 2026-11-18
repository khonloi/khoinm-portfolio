import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Clock from '../Clock';
import {
  getClockDots,
  computeHandAngles,
  buildFacetedHand,
  formatClockTitleDate,
  formatDigitalTime,
} from '../clockGeometry';
import { useWindowStore } from '../../../stores/useWindowStore';
import { isRegisteredWindow } from '../../../config/windowRegistry';

describe('clockGeometry utilities', () => {
  it('generates 60 perimeter dots with 12 hour markers and 48 minute markers', () => {
    const dots = getClockDots();
    expect(dots).toHaveLength(60);
    expect(dots.filter((d) => d.isHour)).toHaveLength(12);
    expect(dots.filter((d) => !d.isHour)).toHaveLength(48);

    // 12 o'clock dot should sit at top-center (x = 50%, y = 4.5%)
    expect(dots[0].leftPct).toBeCloseTo(50, 1);
    expect(dots[0].topPct).toBeCloseTo(4.5, 1);

    // 3 o'clock dot should sit at middle-right (x = 95.5%, y = 50%)
    expect(dots[15].leftPct).toBeCloseTo(95.5, 1);
    expect(dots[15].topPct).toBeCloseTo(50, 1);
  });

  it('computes accurate hand angles for 10:10:30', () => {
    const sample = new Date(2023, 5, 6, 10, 10, 30);
    const { hourDeg, minuteDeg, secondDeg } = computeHandAngles(sample);
    expect(secondDeg).toBe(180);
    expect(minuteDeg).toBeCloseTo(63, 2);
    expect(hourDeg).toBeCloseTo(305, 2);
  });

  it('computes top-left light highlights and bottom-right shadows on faceted hand edges', () => {
    const handAt2OClock = buildFacetedHand(60, 54, 14, 4, 7.5);
    const highlights = handAt2OClock.edges.filter((e) => e.isHighlight);
    const shadows = handAt2OClock.edges.filter((e) => !e.isHighlight);
    expect(handAt2OClock.edges).toHaveLength(4);
    expect(highlights.length).toBeGreaterThan(0);
    expect(shadows.length).toBeGreaterThan(0);
  });

  it('formats title date and digital time strings cleanly', () => {
    const sample = new Date(2023, 5, 6, 14, 5, 9);
    expect(formatClockTitleDate(sample)).toBe('6/6/23');

    expect(formatDigitalTime(sample, { showSeconds: true, is24Hour: false })).toEqual({
      timeText: '02:05:09',
      periodText: 'PM',
    });

    expect(formatDigitalTime(sample, { showSeconds: false, is24Hour: true })).toEqual({
      timeText: '14:05',
      periodText: '',
    });
  });
});

describe('Clock component', () => {
  const sampleDate = new Date(2023, 5, 6, 10, 10, 23);

  beforeEach(() => {
    useWindowStore.getState().reset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('is registered in the window registry', () => {
    expect(isRegisteredWindow('clock')).toBe(true);
  });

  it('renders 12 hour dots and 48 minute dots using LayeredBox', () => {
    render(<Clock id="clock" initialDate={sampleDate} />);

    for (let h = 0; h < 12; h++) {
      const hourDot = screen.getByTestId(`clock-hour-dot-${h}`);
      expect(hourDot).toBeInTheDocument();
      expect(hourDot.querySelector('.layered-box-layer-1')).toBeInTheDocument();
    }

    const minuteDot = screen.getByTestId('clock-minute-dot-1');
    expect(minuteDot).toBeInTheDocument();
    expect(minuteDot.querySelector('.layered-box-layer-1')).toBeInTheDocument();
  });

  it('renders crisp pixelated SVG clock hands in analog mode', () => {
    render(<Clock id="clock" initialDate={sampleDate} />);

    const hourHand = screen.getByTestId('clock-hour-hand');
    const minuteHand = screen.getByTestId('clock-minute-hand');
    const secondHand = screen.getByTestId('clock-second-hand');
    const svg = hourHand.closest('svg');

    expect(hourHand).toBeInTheDocument();
    expect(minuteHand).toBeInTheDocument();
    expect(secondHand).toBeInTheDocument();
    expect(svg).toHaveAttribute('shape-rendering', 'crispEdges');
  });

  it('updates open window title with formatted date and toggles it via Settings -> Date', () => {
    useWindowStore.getState().openWindow({ id: 'clock', title: 'Clock' });

    render(<Clock id="clock" initialDate={sampleDate} />);
    expect(
      useWindowStore.getState().openWindows.find((w) => w.id === 'clock')?.title
    ).toBe('Clock - 6/6/23');

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: /date/i }));

    expect(
      useWindowStore.getState().openWindows.find((w) => w.id === 'clock')?.title
    ).toBe('Clock');
  });

  it('switches to Digital mode and supports Seconds and 24-Hour settings', () => {
    const afternoon = new Date(2023, 5, 6, 14, 5, 9);
    render(<Clock id="clock" initialDate={afternoon} />);

    // Open Settings -> Digital
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(screen.getByRole('menuitemradio', { name: /digital/i }));

    expect(screen.getByTestId('clock-digital-time')).toHaveTextContent('02:05:09');
    expect(screen.getByTestId('clock-digital-period')).toHaveTextContent('PM');
    expect(screen.getByTestId('clock-digital-date')).toBeInTheDocument();

    // Toggle 24-Hour
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: /24-hour/i }));
    expect(screen.getByTestId('clock-digital-time')).toHaveTextContent('14:05:09');
    expect(screen.queryByTestId('clock-digital-period')).not.toBeInTheDocument();

    // Toggle Seconds off
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: /seconds/i }));
    expect(screen.getByTestId('clock-digital-time')).toHaveTextContent('14:05');
  });

  it('hides the second hand in analog mode when Seconds is unchecked', () => {
    render(<Clock id="clock" initialDate={sampleDate} />);
    expect(screen.getByTestId('clock-second-hand')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: /seconds/i }));

    expect(screen.queryByTestId('clock-second-hand')).not.toBeInTheDocument();
  });

  it('maintains 1:1 square dial sizing and excludes About Clock from Settings', () => {
    render(<Clock id="clock" initialDate={sampleDate} />);

    const dial = screen.getByRole('img', { name: /analog clock showing/i });
    expect(dial).toHaveClass('aspect-square');
    expect(dial).not.toHaveClass('max-w-[300px]');
    expect(dial.parentElement).toHaveClass('[container-type:size]');

    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    expect(screen.queryByRole('menuitem', { name: /about clock/i })).not.toBeInTheDocument();
  });
});
