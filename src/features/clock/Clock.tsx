import React, {
  memo,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import LayeredBox from '../../components/LayeredBox';
import { useWindowStore } from '../../stores/useWindowStore';
import { playSound } from '../../data/sounds';
import {
  CLOCK_VIEWBOX_SIZE,
  CLOCK_CENTER,
  getClockDots,
  computeHandAngles,
  buildFacetedHand,
  buildSecondHand,
  formatClockTitleDate,
  formatDigitalTime,
  formatDigitalDate,
  type FacetedHandGeometry,
} from './clockGeometry';

export type ClockMode = 'analog' | 'digital';

export interface ClockProps {
  id?: string;
  initialDate?: Date;
}

const CLOCK_DOTS = getClockDots();
const CLOCK_TEAL = '#008080';
const CLOCK_SHADOW = '#404040';
const CLOCK_HIGHLIGHT = '#ffffff';
const CLOCK_SECOND_COLOR = '#555555';

interface FacetedHandSvgProps {
  geometry: FacetedHandGeometry;
  testId: string;
}

const FacetedHandSvg: React.FC<FacetedHandSvgProps> = ({
  geometry,
  testId,
}) => (
  <g data-testid={testId}>
    <polygon points={geometry.pointsAttr} fill={CLOCK_TEAL} />
    {geometry.edges.map((edge, index) => (
      <line
        key={index}
        x1={edge.x1}
        y1={edge.y1}
        x2={edge.x2}
        y2={edge.y2}
        stroke={edge.isHighlight ? CLOCK_HIGHLIGHT : CLOCK_SHADOW}
        strokeWidth={1.25}
      />
    ))}
  </g>
);

const Clock = memo<ClockProps>(({ id = 'clock', initialDate }) => {
  const [now, setNow] = useState<Date>(() => initialDate ?? new Date());
  const [mode, setMode] = useState<ClockMode>('analog');
  const [showSeconds, setShowSeconds] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [is24Hour, setIs24Hour] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [clockSize, setClockSize] = useState(0);

  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const faceContainerRef = useRef<HTMLDivElement | null>(null);
  const updateWindowTitle = useWindowStore((s) => s.updateWindowTitle);

  // Sync window title with classic "Clock - M/D/YY" format
  const titleDateStr = formatClockTitleDate(now);
  useEffect(() => {
    if (!id) return;
    const nextTitle = showDate ? `Clock - ${titleDateStr}` : 'Clock';
    updateWindowTitle(id, nextTitle);
  }, [id, showDate, titleDateStr, updateWindowTitle]);

  // Tick smoothly on second boundaries when live
  useEffect(() => {
    if (initialDate) return;
    let lastSecond = Math.floor(Date.now() / 1000);
    const intervalId = setInterval(() => {
      const currentMs = Date.now();
      const currentSecond = Math.floor(currentMs / 1000);
      if (currentSecond !== lastSecond) {
        lastSecond = currentSecond;
        setNow(new Date(currentMs));
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, [initialDate]);

  // Observe available space so the clock face scales cleanly at any window size
  useEffect(() => {
    const container = faceContainerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const updateSize = () => {
      const style = window.getComputedStyle(container);
      const padX =
        parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const padY =
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      const innerWidth = Math.max(0, container.clientWidth - padX);
      const innerHeight = Math.max(0, container.clientHeight - padY);
      const nextSize = Math.floor(Math.min(innerWidth, innerHeight));
      if (nextSize > 0) {
        setClockSize(nextSize);
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [mode]);

  // Close Settings menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const handleToggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleSelectMode = useCallback((nextMode: ClockMode) => {
    setMode(nextMode);
    setMenuOpen(false);
    playSound('expand').catch(() => {});
  }, []);

  const handleToggleSeconds = useCallback(() => {
    setShowSeconds((prev) => !prev);
    setMenuOpen(false);
    playSound('expand').catch(() => {});
  }, []);

  const handleToggleDate = useCallback(() => {
    setShowDate((prev) => !prev);
    setMenuOpen(false);
    playSound('expand').catch(() => {});
  }, []);

  const handleToggle24Hour = useCallback(() => {
    setIs24Hour((prev) => !prev);
    setMenuOpen(false);
    playSound('expand').catch(() => {});
  }, []);

  const { hourDeg, minuteDeg, secondDeg } = useMemo(
    () => computeHandAngles(now),
    [now]
  );

  const hourHand = useMemo(
    () => buildFacetedHand(hourDeg, 54, 14, 4, 7.5),
    [hourDeg]
  );

  const minuteHand = useMemo(
    () => buildFacetedHand(minuteDeg, 74, 16, 4, 6),
    [minuteDeg]
  );

  const secondHand = useMemo(
    () => buildSecondHand(secondDeg, 77, 10),
    [secondDeg]
  );

  const { timeText, periodText } = useMemo(
    () => formatDigitalTime(now, { showSeconds, is24Hour }),
    [now, showSeconds, is24Hour]
  );

  const digitalDateStr = useMemo(() => formatDigitalDate(now), [now]);

  const hourDotSizeClass =
    clockSize >= 480
      ? 'w-3.5 h-3.5'
      : clockSize > 0 && clockSize < 220
        ? 'w-2 h-2'
        : 'w-2.5 h-2.5';

  const minuteDotSizeClass = clockSize >= 480 ? 'w-1.5 h-1.5' : 'w-1 h-1';

  return (
    <div className="flex flex-col w-full h-full md:w-[24rem] md:h-[26rem] [.maximized_&]:md:w-full [.maximized_&]:md:h-full bg-windows-grey font-main text-sm select-none overflow-hidden">
      {/* Classic Windows Settings Menu Bar */}
      <div
        ref={menuContainerRef}
        className="relative flex items-center bg-windows-grey p-1 shrink-0 z-20"
      >
        <button
          type="button"
          onClick={handleToggleMenu}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className={`px-2 py-0.5 text-sm font-main cursor-pointer focus:outline-none ${
            menuOpen
              ? 'bg-windows-blue-bright text-windows-white'
              : 'text-windows-black hover:bg-windows-blue-bright hover:text-windows-white'
          }`}
        >
          <span className="underline">S</span>ettings
        </button>

        {menuOpen && (
          <div
            role="menu"
            aria-label="Clock settings"
            className="absolute left-2 top-full mt-0.5 z-30"
          >
            <LayeredBox
              variant="outward"
              bgColor="#c0c0c0"
              parentBgColor="#c0c0c0"
              className="min-w-[164px]"
            >
              <div className="p-0.5 flex flex-col bg-windows-grey text-windows-black text-sm">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={mode === 'analog'}
                  onClick={() => handleSelectMode('analog')}
                  className="flex items-center gap-2 px-2 py-1 text-left hover:bg-windows-blue-bright hover:text-windows-white cursor-pointer"
                >
                  <span className="w-3 inline-block text-center font-bold">
                    {mode === 'analog' ? '✓' : ''}
                  </span>
                  <span>Analog</span>
                </button>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={mode === 'digital'}
                  onClick={() => handleSelectMode('digital')}
                  className="flex items-center gap-2 px-2 py-1 text-left hover:bg-windows-blue-bright hover:text-windows-white cursor-pointer"
                >
                  <span className="w-3 inline-block text-center font-bold">
                    {mode === 'digital' ? '✓' : ''}
                  </span>
                  <span>Digital</span>
                </button>

                <div className="my-1 border-t border-windows-grey-dark border-b border-windows-white" />

                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={showSeconds}
                  onClick={handleToggleSeconds}
                  className="flex items-center gap-2 px-2 py-1 text-left hover:bg-windows-blue-bright hover:text-windows-white cursor-pointer"
                >
                  <span className="w-3 inline-block text-center font-bold">
                    {showSeconds ? '✓' : ''}
                  </span>
                  <span>Seconds</span>
                </button>
                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={showDate}
                  onClick={handleToggleDate}
                  className="flex items-center gap-2 px-2 py-1 text-left hover:bg-windows-blue-bright hover:text-windows-white cursor-pointer"
                >
                  <span className="w-3 inline-block text-center font-bold">
                    {showDate ? '✓' : ''}
                  </span>
                  <span>Date</span>
                </button>
                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={is24Hour}
                  disabled={mode === 'analog'}
                  onClick={handleToggle24Hour}
                  className={`flex items-center gap-2 px-2 py-1 text-left ${
                    mode === 'analog'
                      ? 'text-windows-grey-dark [text-shadow:1px_1px_0_var(--windows-white)] cursor-not-allowed'
                      : 'hover:bg-windows-blue-bright hover:text-windows-white cursor-pointer'
                  }`}
                >
                  <span className="w-3 inline-block text-center font-bold">
                    {is24Hour ? '✓' : ''}
                  </span>
                  <span>24-Hour</span>
                </button>
              </div>
            </LayeredBox>
          </div>
        )}
      </div>

      {/* Main Clock Viewport */}
      <div className="flex-1 min-h-0 min-w-0 flex items-center justify-center p-3 overflow-hidden">
        {mode === 'analog' ? (
          <div
            ref={faceContainerRef}
            className="w-full h-full flex items-center justify-center [container-type:size]"
          >
            <div
              role="img"
              aria-label={`Analog clock showing ${timeText}${periodText ? ` ${periodText}` : ''}`}
              className="relative shrink-0 aspect-square"
              style={{
                width: 'min(100cqw, 100cqh)',
                height: 'min(100cqw, 100cqh)',
              }}
            >
              {/* 60 Perimeter Dots rendered via Hayami LayeredBox */}
              {CLOCK_DOTS.map((dot) => (
                <div
                  key={dot.index}
                  data-testid={
                    dot.isHour
                      ? `clock-hour-dot-${dot.index / 5}`
                      : `clock-minute-dot-${dot.index}`
                  }
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ left: `${dot.leftPct}%`, top: `${dot.topPct}%` }}
                  aria-hidden="true"
                >
                  {dot.isHour ? (
                    <LayeredBox
                      variant="outward"
                      bgColor={CLOCK_TEAL}
                      parentBgColor="#c0c0c0"
                      className={`!m-0 ${hourDotSizeClass}`}
                    />
                  ) : (
                    <LayeredBox
                      variant="outward"
                      bgColor="#c0c0c0"
                      className={`!m-0 !shadow-none ${minuteDotSizeClass}`}
                    />
                  )}
                </div>
              ))}

              {/* Pixelized Faceted Clock Hands */}
              <svg
                viewBox={`0 0 ${CLOCK_VIEWBOX_SIZE} ${CLOCK_VIEWBOX_SIZE}`}
                shapeRendering="crispEdges"
                className="absolute inset-0 w-full h-full pointer-events-none image-pixelated overflow-visible"
                aria-hidden="true"
              >
                <FacetedHandSvg geometry={hourHand} testId="clock-hour-hand" />
                <FacetedHandSvg
                  geometry={minuteHand}
                  testId="clock-minute-hand"
                />
                {showSeconds && (
                  <line
                    data-testid="clock-second-hand"
                    x1={secondHand.x1}
                    y1={secondHand.y1}
                    x2={secondHand.x2}
                    y2={secondHand.y2}
                    stroke={CLOCK_SECOND_COLOR}
                    strokeWidth={1.15}
                  />
                )}
                <rect
                  x={CLOCK_CENTER - 1}
                  y={CLOCK_CENTER - 1}
                  width={2}
                  height={2}
                  fill={CLOCK_TEAL}
                />
              </svg>
            </div>
          </div>
        ) : (
          /* Classic Retro Digital Mode */
          <div className="w-full max-w-[340px] [.maximized_&]:max-w-[540px]">
            <LayeredBox
              variant="inward"
              bgColor="#001818"
              parentBgColor="#c0c0c0"
              className="w-full"
            >
              <div className="flex flex-col items-center justify-center py-8 px-4 sm:py-10 sm:px-6 text-center">
                <div className="flex items-baseline justify-center gap-2">
                  <span
                    data-testid="clock-digital-time"
                    className="font-terminal font-bold text-[#30e8e0] tracking-wider tabular-nums leading-none text-4xl sm:text-5xl [.maximized_&]:sm:text-7xl"
                  >
                    {timeText}
                  </span>
                  {periodText && (
                    <span
                      data-testid="clock-digital-period"
                      className="font-terminal font-bold text-[#20a8a0] text-lg sm:text-xl [.maximized_&]:sm:text-2xl"
                    >
                      {periodText}
                    </span>
                  )}
                </div>
                {showDate && (
                  <div
                    data-testid="clock-digital-date"
                    className="mt-3 font-terminal text-sm sm:text-base text-[#80dfdf] tracking-wide"
                  >
                    {digitalDateStr}
                  </div>
                )}
              </div>
            </LayeredBox>
          </div>
        )}
      </div>
    </div>
  );
});

Clock.displayName = 'Clock';

export default Clock;
