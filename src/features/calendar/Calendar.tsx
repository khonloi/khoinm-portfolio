import React, { memo, useState, useMemo, useCallback } from 'react';
import Button from '../../components/Button';
import LayeredBox from '../../components/LayeredBox';
import { playSound } from '../../data/sounds';
import {
  WEEKDAY_LETTERS,
  formatDateKey,
  formatFullSelectedDate,
  formatMonthYear,
  getMonthGrid,
  shiftMonthPreservingDay,
  loadCalendarNotes,
  saveCalendarNotes,
} from './calendarUtils';

export interface CalendarProps {
  id?: string;
  initialDate?: Date;
}

const PixelArrowLeft: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 9 9"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    <rect x="6" y="0" width="1" height="9" />
    <rect x="5" y="1" width="1" height="7" />
    <rect x="4" y="2" width="1" height="5" />
    <rect x="3" y="3" width="1" height="3" />
    <rect x="2" y="4" width="1" height="1" />
  </svg>
);

const PixelArrowRight: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 9 9"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    <rect x="2" y="0" width="1" height="9" />
    <rect x="3" y="1" width="1" height="7" />
    <rect x="4" y="2" width="1" height="5" />
    <rect x="5" y="3" width="1" height="3" />
    <rect x="6" y="4" width="1" height="1" />
  </svg>
);

const PixelChevronRight: React.FC = () => (
  <svg
    width="6"
    height="9"
    viewBox="0 0 6 9"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    <rect x="1" y="1" width="1" height="1" />
    <rect x="2" y="2" width="1" height="1" />
    <rect x="3" y="3" width="1" height="1" />
    <rect x="4" y="4" width="1" height="1" />
    <rect x="3" y="5" width="1" height="1" />
    <rect x="2" y="6" width="1" height="1" />
    <rect x="1" y="7" width="1" height="1" />
  </svg>
);

const PixelChevronLeft: React.FC = () => (
  <svg
    width="6"
    height="9"
    viewBox="0 0 6 9"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
    <rect x="4" y="1" width="1" height="1" />
    <rect x="3" y="2" width="1" height="1" />
    <rect x="2" y="3" width="1" height="1" />
    <rect x="1" y="4" width="1" height="1" />
    <rect x="2" y="5" width="1" height="1" />
    <rect x="3" y="6" width="1" height="1" />
    <rect x="4" y="7" width="1" height="1" />
  </svg>
);

const Calendar = memo<CalendarProps>(({ initialDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => initialDate ?? new Date()
  );
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    loadCalendarNotes()
  );

  const todayKey = useMemo(
    () => formatDateKey(initialDate ?? new Date()),
    [initialDate]
  );
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  const selectedDateKey = formatDateKey(selectedDate);

  const fullDateLabel = useMemo(
    () => formatFullSelectedDate(selectedDate),
    [selectedDate]
  );

  const monthYearLabel = useMemo(
    () => formatMonthYear(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const gridCells = useMemo(
    () => getMonthGrid(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const handleShiftMonth = useCallback((deltaMonths: number) => {
    setSelectedDate((prev) => shiftMonthPreservingDay(prev, deltaMonths));
    playSound('expand').catch(() => {});
  }, []);

  const handleSelectDay = useCallback(
    (day: number) => {
      setSelectedDate(new Date(currentYear, currentMonth, day));
    },
    [currentYear, currentMonth]
  );

  const handleJumpToday = useCallback(() => {
    setSelectedDate(initialDate ?? new Date());
    playSound('expand').catch(() => {});
  }, [initialDate]);

  const handleNoteChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setNotes((prev) => {
        const next = { ...prev };
        if (value) {
          next[selectedDateKey] = value;
        } else {
          delete next[selectedDateKey];
        }
        saveCalendarNotes(next);
        return next;
      });
    },
    [selectedDateKey]
  );

  const currentNote = notes[selectedDateKey] || '';

  return (
    <div className="flex flex-col w-full h-full md:w-[27rem] md:h-[29rem] [.maximized_&]:md:w-full [.maximized_&]:md:h-full bg-windows-grey text-windows-black font-main text-sm select-none overflow-hidden p-3.5 sm:p-4 gap-3">
      {/* Top Toolbar: Previous Month + Sunken Selected Date + Next Month */}
      <div className="flex items-center gap-2 shrink-0 min-w-0">
        <Button
          variant="control"
          onClick={() => handleShiftMonth(-1)}
          ariaLabel="Previous month"
          title="Previous month"
          className="shrink-0"
        >
          <PixelArrowLeft />
        </Button>

        <LayeredBox
          variant="inward"
          bgColor="#ffffff"
          parentBgColor="#c0c0c0"
          className="flex-1 min-w-0 h-9 [&_.layered-box-layer-1]:h-full [&_.layered-box-layer-3]:h-full [&_.layered-box-layer-3]:flex [&_.layered-box-layer-3]:items-center"
        >
          <button
            type="button"
            onClick={handleJumpToday}
            data-testid="calendar-selected-date"
            title="Jump to Today"
            className="w-full px-2.5 text-center text-xs sm:text-sm font-bold text-windows-black truncate bg-transparent border-0 cursor-pointer hover:underline focus:outline-none"
          >
            {fullDateLabel}
          </button>
        </LayeredBox>

        <Button
          variant="control"
          onClick={() => handleShiftMonth(1)}
          ariaLabel="Next month"
          title="Next month"
          className="shrink-0"
        >
          <PixelArrowRight />
        </Button>
      </div>

      {/* Main Calendar Sheet inside LayeredBox */}
      <LayeredBox
        variant="inward"
        bgColor="#ffffff"
        parentBgColor="#c0c0c0"
        className="flex flex-1 flex-col min-h-0 w-full [&_.layered-box-layer-1]:flex [&_.layered-box-layer-1]:flex-col [&_.layered-box-layer-1]:h-full [&_.layered-box-layer-3]:flex [&_.layered-box-layer-3]:flex-col [&_.layered-box-layer-3]:h-full"
      >
        {/* Month Banner + Weekday Row */}
        <div className="bg-windows-purple text-windows-white p-1 text-center font-bold text-base leading-tight border-b-2 border-windows-black shrink-0">
          <span data-testid="calendar-month-title">{monthYearLabel}</span>
        </div>
        <div className="grid grid-cols-7 text-center text-sm font-bold bg-windows-grey-light text-windows-black border-b-2 border-windows-black shrink-0">
          {WEEKDAY_LETTERS.map((letter, index) => (
            <div
              key={index}
              className={`py-1 border-r border-windows-grey last:border-r-0 ${
                index === 0 || index === 6
                  ? 'text-windows-blue'
                  : 'text-windows-black'
              }`}
            >
              {letter}
            </div>
          ))}
        </div>

        {/* Month Days Grid */}
        <div
          role="grid"
          aria-label={`${monthYearLabel} calendar`}
          className="flex-1 min-h-0 grid grid-cols-7 auto-rows-fr bg-windows-white"
        >
          {gridCells.map((cell) => {
            if (cell.day === null || cell.dateKey === null) {
              return (
                <div
                  key={cell.key}
                  className="border-r border-b border-windows-grey [&:nth-child(7n)]:border-r-0 bg-windows-grey-shade-1/40"
                  aria-hidden="true"
                />
              );
            }

            const isSelected = cell.dateKey === selectedDateKey;
            const isToday = cell.dateKey === todayKey;
            const hasNote = Boolean(notes[cell.dateKey]);

            return (
              <button
                key={cell.key}
                type="button"
                role="gridcell"
                aria-selected={isSelected}
                aria-label={`${monthYearLabel.split(' ')[0]} ${cell.day}, ${currentYear}`}
                onClick={() => handleSelectDay(cell.day as number)}
                className={`relative flex items-center justify-center min-w-0 min-h-0 border-r border-b border-windows-grey [&:nth-child(7n)]:border-r-0 text-xs sm:text-base [.maximized_&]:sm:text-lg cursor-pointer focus:outline-none ${
                  isSelected
                    ? 'bg-windows-purple text-windows-white font-bold'
                    : 'bg-windows-white text-windows-black hover:bg-windows-grey-light'
                }`}
              >
                {isSelected ? (
                  <span className="flex items-center justify-between w-full px-1 sm:px-2">
                    <PixelChevronRight />
                    <span>{cell.day}</span>
                    <PixelChevronLeft />
                  </span>
                ) : (
                  <span
                    className={
                      isToday ? 'text-windows-blue underline font-bold' : ''
                    }
                  >
                    {cell.day}
                  </span>
                )}

                {hasNote && !isSelected && (
                  <span
                    data-testid={`calendar-note-dot-${cell.dateKey}`}
                    className="absolute top-1 right-1 w-1.5 h-1.5 bg-windows-teal pointer-events-none"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </LayeredBox>

      {/* Post-it Yellow Daily Scratchpad matching Hayami Welcome memo aesthetic */}
      <LayeredBox
        variant="inward"
        bgColor="#f9f1a5"
        parentBgColor="#c0c0c0"
        className="w-full shrink-0"
      >
        <textarea
          rows={2}
          value={currentNote}
          onChange={handleNoteChange}
          aria-label={`Notes for ${fullDateLabel}`}
          placeholder="Write a note for this day..."
          className="block w-full h-12 sm:h-14 [.maximized_&]:sm:h-20 resize-none border-none bg-transparent p-1.5 sm:p-2 font-main text-xs sm:text-sm text-windows-black outline-none placeholder:text-windows-grey-dark"
        />
      </LayeredBox>
    </div>
  );
});

Calendar.displayName = 'Calendar';

export default Calendar;
