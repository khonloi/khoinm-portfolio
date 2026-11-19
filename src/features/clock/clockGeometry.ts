export interface Point {
  x: number;
  y: number;
}

export interface HandEdge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isHighlight: boolean;
}

export interface FacetedHandGeometry {
  pointsAttr: string;
  edges: HandEdge[];
}

export interface ClockDot {
  index: number;
  isHour: boolean;
  leftPct: number;
  topPct: number;
}

export const CLOCK_VIEWBOX_SIZE = 120;
export const CLOCK_CENTER = 60;
export const DOT_RADIUS_PCT = 45.5;

const roundCoord = (value: number): number => Math.round(value * 100) / 100;

/**
 * Computes the 60 perimeter dots (12 hour markers + 48 minute markers) in percentage coordinates.
 */
export function getClockDots(): ClockDot[] {
  const dots: ClockDot[] = [];
  for (let i = 0; i < 60; i++) {
    const rad = (i * 6 * Math.PI) / 180;
    dots.push({
      index: i,
      isHour: i % 5 === 0,
      leftPct: roundCoord(50 + DOT_RADIUS_PCT * Math.sin(rad)),
      topPct: roundCoord(50 - DOT_RADIUS_PCT * Math.cos(rad)),
    });
  }
  return dots;
}

/**
 * Computes clockwise rotation angles in degrees (0 = 12 o'clock) for hour, minute, and second hands.
 */
export function computeHandAngles(date: Date): {
  hourDeg: number;
  minuteDeg: number;
  secondDeg: number;
} {
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours() % 12;

  return {
    secondDeg: seconds * 6,
    minuteDeg: minutes * 6 + seconds * 0.1,
    hourDeg: hours * 30 + minutes * 0.5,
  };
}

/**
 * Builds a classic Windows 3.1 faceted diamond/kite hand polygon with light-direction-aware edge classification.
 * Light source shines from top-left (-1, -1).
 */
export function buildFacetedHand(
  angleDeg: number,
  tipLen: number,
  tailLen: number,
  shoulderOffset: number,
  halfWidth: number,
  center = CLOCK_CENTER
): FacetedHandGeometry {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  // Perpendicular vector pointing right relative to hand direction
  const px = Math.cos(rad);
  const py = Math.sin(rad);

  const vertices: Point[] = [
    // Tip
    {
      x: roundCoord(center + dx * tipLen),
      y: roundCoord(center + dy * tipLen),
    },
    // Right shoulder
    {
      x: roundCoord(center + dx * shoulderOffset + px * halfWidth),
      y: roundCoord(center + dy * shoulderOffset + py * halfWidth),
    },
    // Counterbalance tail
    {
      x: roundCoord(center - dx * tailLen),
      y: roundCoord(center - dy * tailLen),
    },
    // Left shoulder
    {
      x: roundCoord(center + dx * shoulderOffset - px * halfWidth),
      y: roundCoord(center + dy * shoulderOffset - py * halfWidth),
    },
  ];

  const pointsAttr = vertices.map((v) => `${v.x},${v.y}`).join(' ');

  // Outward normal for clockwise edge (A -> B) in screen coords (+x right, +y down) is (ey, -ex).
  // Dot with top-left light (-1, -1) simplifies to (ex - ey).
  const edges: HandEdge[] = vertices.map((curr, idx) => {
    const next = vertices[(idx + 1) % vertices.length];
    const ex = next.x - curr.x;
    const ey = next.y - curr.y;
    return {
      x1: curr.x,
      y1: curr.y,
      x2: next.x,
      y2: next.y,
      isHighlight: ex - ey > 0,
    };
  });

  return { pointsAttr, edges };
}

/**
 * Computes start and end coordinates for the 1px second hand.
 */
export function buildSecondHand(
  angleDeg: number,
  tipLen = 77,
  tailLen = 10,
  center = CLOCK_CENTER
): { x1: number; y1: number; x2: number; y2: number } {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  return {
    x1: roundCoord(center - dx * tailLen),
    y1: roundCoord(center - dy * tailLen),
    x2: roundCoord(center + dx * tipLen),
    y2: roundCoord(center + dy * tipLen),
  };
}

/**
 * Formats date as short M/D/YY for the classic Clock title bar (e.g., "6/6/23").
 */
export function formatClockTitleDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}

/**
 * Formats time for Digital Clock mode.
 */
export function formatDigitalTime(
  date: Date,
  options: { showSeconds: boolean; is24Hour: boolean }
): { timeText: string; periodText: string } {
  const rawHours = date.getHours();
  const periodText = options.is24Hour ? '' : rawHours >= 12 ? 'PM' : 'AM';
  const displayHours = options.is24Hour ? rawHours : rawHours % 12 || 12;

  const hh = String(displayHours).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  return {
    timeText: options.showSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`,
    periodText,
  };
}

/**
 * Formats full localized short date for Digital Clock display.
 */
export function formatDigitalDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
