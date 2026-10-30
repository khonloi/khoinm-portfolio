export interface PreviewBall {
  color: number;
  r: number;
  c: number;
}

export interface MovingBall {
  r: number;
  c: number;
  color: number;
}

export const GRID_SIZE = 9;
export const COLORS = [1, 2, 3, 4, 5, 6, 7];

/**
 * Checks if 5 or more balls of the same color are aligned horizontally,
 * vertically, or diagonally intersecting (r, c).
 * Returns array of coordinates to remove.
 */
export const checkLines = (board: number[][], r: number, c: number): [number, number][] => {
  const color = board[r][c];
  if (color === 0) return [];

  const directions = [
    [0, 1],  // Horizontal
    [1, 0],  // Vertical
    [1, 1],  // Diagonal \
    [1, -1], // Diagonal /
  ];

  const allToRemove = new Set<string>();
  allToRemove.add(`${r},${c}`);

  directions.forEach(([dr, dc]) => {
    const line = [`${r},${c}`];

    let nr = r + dr;
    let nc = c + dc;
    while (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && board[nr][nc] === color) {
      line.push(`${nr},${nc}`);
      nr += dr;
      nc += dc;
    }

    nr = r - dr;
    nc = c - dc;
    while (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && board[nr][nc] === color) {
      line.push(`${nr},${nc}`);
      nr -= dr;
      nc -= dc;
    }

    if (line.length >= 5) {
      line.forEach((pos) => allToRemove.add(pos));
    }
  });

  if (allToRemove.size >= 5) {
    return Array.from(allToRemove).map((s) => {
      const [nr, nc] = s.split(',').map(Number);
      return [nr, nc] as [number, number];
    });
  }
  return [];
};

/**
 * Breadth-First Search (BFS) pathfinding between empty cells on the grid.
 */
export const findPath = (
  currentGrid: number[][],
  start: [number, number],
  end: [number, number]
): [number, number][] | null => {
  const [sr, sc] = start;
  const [er, ec] = end;
  if (currentGrid[er][ec] !== 0) return null;

  const queue: [number, number, [number, number][]][] = [[sr, sc, [[sr, sc]]]];
  const visited = new Set([`${sr},${sc}`]);
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) break;
    const [r, c, path] = item;
    if (r === er && c === ec) return path;

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 &&
        nr < GRID_SIZE &&
        nc >= 0 &&
        nc < GRID_SIZE &&
        currentGrid[nr][nc] === 0 &&
        !visited.has(`${nr},${nc}`)
      ) {
        visited.add(`${nr},${nc}`);
        queue.push([nr, nc, [...path, [nr, nc]]]);
      }
    }
  }
  return null;
};

/**
 * Creates a fresh board with 3 initial balls and 3 preview balls.
 */
export const createInitialBoard = (): { grid: number[][]; previews: PreviewBall[] } => {
  const newGrid = Array(GRID_SIZE)
    .fill(0)
    .map(() => Array(GRID_SIZE).fill(0));
  const emptyCells: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      emptyCells.push([r, c]);
    }
  }

  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(Math.random() * emptyCells.length);
    const [r, c] = emptyCells.splice(idx, 1)[0];
    newGrid[r][c] = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  const nextPreviews: PreviewBall[] = [];
  for (let i = 0; i < 3 && emptyCells.length > 0; i++) {
    const idx = Math.floor(Math.random() * emptyCells.length);
    const [r, c] = emptyCells.splice(idx, 1)[0];
    nextPreviews.push({ color: COLORS[Math.floor(Math.random() * COLORS.length)], r, c });
  }

  return { grid: newGrid, previews: nextPreviews };
};

/**
 * Spawns preview balls onto the grid, calculates lines cleared, and generates next previews.
 */
export const spawnBalls = (
  currentGrid: number[][],
  currentPreviews: PreviewBall[]
): {
  nextGrid: number[][];
  cleared: [number, number][];
  nextPreviews: PreviewBall[];
  isGameOver: boolean;
} => {
  const nextGrid = currentGrid.map((row) => [...row]);
  const actualSpawned: [number, number][] = [];

  currentPreviews.forEach(({ color, r, c }) => {
    if (nextGrid[r][c] !== 0) {
      const emptyCells: [number, number][] = [];
      nextGrid.forEach((row, ri) => {
        row.forEach((cell, ci) => {
          if (cell === 0) emptyCells.push([ri, ci]);
        });
      });
      if (emptyCells.length > 0) {
        const idx = Math.floor(Math.random() * emptyCells.length);
        const [nr, nc] = emptyCells[idx];
        nextGrid[nr][nc] = color;
        actualSpawned.push([nr, nc]);
      }
    } else {
      nextGrid[r][c] = color;
      actualSpawned.push([r, c]);
    }
  });

  let toRemove: [number, number][] = [];
  actualSpawned.forEach(([r, c]) => {
    const removed = checkLines(nextGrid, r, c);
    toRemove = [...toRemove, ...removed];
  });

  const uniqueToRemove: [number, number][] =
    toRemove.length > 0
      ? Array.from(new Set(toRemove.map((p) => p.join(',')))).map((s) => {
          const [ur, uc] = s.split(',').map(Number);
          return [ur, uc] as [number, number];
        })
      : [];

  uniqueToRemove.forEach(([r, c]) => {
    nextGrid[r][c] = 0;
  });

  const remainingEmpty: [number, number][] = [];
  nextGrid.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      if (cell === 0) remainingEmpty.push([ri, ci]);
    });
  });

  const isGameOver = remainingEmpty.length === 0 && actualSpawned.length > 0 && uniqueToRemove.length === 0;

  const nextPreviews: PreviewBall[] = [];
  for (let i = 0; i < 3 && remainingEmpty.length > 0; i++) {
    const idx = Math.floor(Math.random() * remainingEmpty.length);
    const [r, c] = remainingEmpty.splice(idx, 1)[0];
    nextPreviews.push({ color: COLORS[Math.floor(Math.random() * COLORS.length)], r, c });
  }

  return {
    nextGrid,
    cleared: uniqueToRemove,
    nextPreviews,
    isGameOver,
  };
};

