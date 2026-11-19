export const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

export interface CalendarCell {
  key: string;
  day: number | null;
  dateKey: string | null;
}

const STORAGE_KEY = 'hayami_calendar_notes';

/**
 * Formats a Date into a stable local YYYY-MM-DD lookup key.
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a Date into full human-readable header form, e.g. "Saturday, April 12, 2025".
 */
export function formatFullSelectedDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats month and year title, e.g. "April 2025".
 */
export function formatMonthYear(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Generates a 7-column month grid (5 or 6 complete rows) with blank padding cells.
 */
export function getMonthGrid(year: number, month: number): CalendarCell[] {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: CalendarCell[] = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push({
      key: `empty-start-${year}-${month}-${i}`,
      day: null,
      dateKey: null,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({
      key: dateKey,
      day,
      dateKey,
    });
  }

  const remainder = cells.length % 7;
  if (remainder !== 0) {
    const trailingCount = 7 - remainder;
    for (let i = 0; i < trailingCount; i++) {
      cells.push({
        key: `empty-end-${year}-${month}-${i}`,
        day: null,
        dateKey: null,
      });
    }
  }

  return cells;
}

/**
 * Shifts a Date by `deltaMonths`, clamping the day of month so e.g. Jan 31 -> Feb 28/29.
 */
export function shiftMonthPreservingDay(date: Date, deltaMonths: number): Date {
  const targetYear = date.getFullYear();
  const targetMonth = date.getMonth() + deltaMonths;
  const normalizedFirst = new Date(targetYear, targetMonth, 1);
  const maxDayInTarget = new Date(
    normalizedFirst.getFullYear(),
    normalizedFirst.getMonth() + 1,
    0
  ).getDate();
  const clampedDay = Math.min(date.getDate(), maxDayInTarget);
  return new Date(normalizedFirst.getFullYear(), normalizedFirst.getMonth(), clampedDay);
}

/**
 * Loads persisted scratchpad notes map from localStorage safely.
 */
export function loadCalendarNotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * Saves scratchpad notes map to localStorage safely.
 */
export function saveCalendarNotes(notes: Record<string, string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}
