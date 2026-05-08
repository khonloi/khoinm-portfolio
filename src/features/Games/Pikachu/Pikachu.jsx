import React, { useState, useEffect, useCallback, useRef } from "react";
import Button from '../../../components/Button';
import "./Pikachu.css";


const ROWS = 9;
const COLS = 16;
const PADDING = 1; // Extra border for pathfinding
const TOTAL_CELLS = ROWS * COLS;
const UNIQUE_TILES = 26; // A-Z

const Pikachu = ({ onClose }) => {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(10);
  const [timeLeft, setTimeLeft] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [path, setPath] = useState([]);
  const [combo, setCombo] = useState(0);
  const lastMatchTime = useRef(Date.now());

  // Initialize game
  const initGame = useCallback((lvl) => {
    let tiles = [];
    // Ensure every tile has a pair
    const pairsNeeded = TOTAL_CELLS / 2;
    for (let i = 0; i < pairsNeeded; i++) {
      const type = (i % UNIQUE_TILES) + 1;
      tiles.push(type, type);
    }

    // Shuffle tiles
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    // Create padded grid
    const newGrid = Array(ROWS + 2 * PADDING).fill(0).map(() => Array(COLS + 2 * PADDING).fill(0));
    let index = 0;
    for (let r = PADDING; r < ROWS + PADDING; r++) {
      for (let c = PADDING; c < COLS + PADDING; c++) {
        newGrid[r][c] = tiles[index++];
      }
    }

    setGrid(newGrid);
    setSelected(null);
    setTimeLeft(100);
    setGameOver(false);
    setScore(0);
    setCombo(0);
  }, []);

  useEffect(() => {
    initGame(level);
  }, [level, initGame]);

  // Timer logic
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        // Goal: ~300 seconds (5 minutes) for the full bar at lvl 1
        // (100% / 300s) = 0.333% per second.
        // Every 100ms deduction: 0.0333%.
        const baseDeduction = 0.0333;
        const levelMultiplier = 1 + (level - 1) * 0.05; // Less aggressive scaling
        const deduction = baseDeduction * levelMultiplier;

        if (prev - deduction <= 0) {
          setGameOver(true);
          return 0;
        }
        return prev - deduction;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [level, gameOver]);

  // Pathfinding Logic (2 turns Max)
  const isPathClear = (p1, p2) => {
    if (p1.r === p2.r) {
      const minC = Math.min(p1.c, p2.c);
      const maxC = Math.max(p1.c, p2.c);
      for (let c = minC + 1; c < maxC; c++) {
        if (grid[p1.r][c] !== 0) return false;
      }
      return true;
    } else if (p1.c === p2.c) {
      const minR = Math.min(p1.r, p2.r);
      const maxR = Math.max(p1.r, p2.r);
      for (let r = minR + 1; r < maxR; r++) {
        if (grid[r][p1.c] !== 0) return false;
      }
      return true;
    }
    return false;
  };

  const getMatchPath = (p1, p2) => {
    if (grid[p1.r][p1.c] !== grid[p2.r][p2.c] || (p1.r === p2.r && p1.c === p2.c)) return null;

    // 0 Turns (Straight)
    if (isPathClear(p1, p2)) return [p1, p2];

    // 1 Turn (L-shape)
    let corners = [
      { r: p1.r, c: p2.c },
      { r: p2.r, c: p1.c }
    ];
    for (let cp of corners) {
      if (grid[cp.r][cp.c] === 0 && isPathClear(p1, cp) && isPathClear(cp, p2)) {
        return [p1, cp, p2];
      }
    }

    // 2 Turns (Z or U-shape) - Scan Horizontally
    for (let r = 0; r < ROWS + 2 * PADDING; r++) {
      const corner1 = { r, c: p1.c };
      const corner2 = { r, c: p2.c };
      if (grid[corner1.r][corner1.c] === 0 && grid[corner2.r][corner2.c] === 0 ||
        (corner1.r === p1.r && corner1.c === p1.c) || (corner2.r === p2.r && corner2.c === p2.c)) {

        const c1Clear = (corner1.r === p1.r && corner1.c === p1.c) || (grid[corner1.r][corner1.c] === 0 && isPathClear(p1, corner1));
        const c2Clear = (corner2.r === p2.r && corner2.c === p2.c) || (grid[corner2.r][corner2.c] === 0 && isPathClear(p2, corner2));

        if (c1Clear && c2Clear && isPathClear(corner1, corner2)) {
          return [p1, corner1, corner2, p2];
        }
      }
    }

    // 2 Turns (Z or U-shape) - Scan Vertically
    for (let c = 0; c < COLS + 2 * PADDING; c++) {
      const corner1 = { r: p1.r, c };
      const corner2 = { r: p2.r, c };
      if (grid[corner1.r][corner1.c] === 0 && grid[corner2.r][corner2.c] === 0 ||
        (corner1.r === p1.r && corner1.c === p1.c) || (corner2.r === p2.r && corner2.c === p2.c)) {

        const c1Clear = (corner1.r === p1.r && corner1.c === p1.c) || (grid[corner1.r][corner1.c] === 0 && isPathClear(p1, corner1));
        const c2Clear = (corner2.r === p2.r && corner2.c === p2.c) || (grid[corner2.r][corner2.c] === 0 && isPathClear(p2, corner2));

        if (c1Clear && c2Clear && isPathClear(corner1, corner2)) {
          return [p1, corner1, corner2, p2];
        }
      }
    }

    return null;
  };

  const applyGravity = (currentGrid) => {
    let nextGrid = currentGrid.map(row => [...row]);

    const compact = (arr, toEnd = true) => {
      let filtered = arr.filter(x => x !== 0);
      let zeros = Array(arr.length - filtered.length).fill(0);
      return toEnd ? [...zeros, ...filtered] : [...filtered, ...zeros];
    };

    const getCol = (g, c) => g.slice(PADDING, PADDING + ROWS).map(r => r[c]);
    const setCol = (g, c, vals) => {
      for (let r = 0; r < ROWS; r++) g[r + PADDING][c] = vals[r];
    };

    const getRow = (g, r) => g[r].slice(PADDING, PADDING + COLS);
    const setRow = (g, r, vals) => {
      for (let c = 0; c < COLS; c++) g[r][c + PADDING] = vals[c];
    };

    switch (level) {
      case 2: // Down
        for (let c = PADDING; c < COLS + PADDING; c++) {
          setCol(nextGrid, c, compact(getCol(nextGrid, c), true));
        }
        break;
      case 3: // Up
        for (let c = PADDING; c < COLS + PADDING; c++) {
          setCol(nextGrid, c, compact(getCol(nextGrid, c), false));
        }
        break;
      case 4: // Right to Left
        for (let r = PADDING; r < ROWS + PADDING; r++) {
          setRow(nextGrid, r, compact(getRow(nextGrid, r), false));
        }
        break;
      case 5: // Left to Right
        for (let r = PADDING; r < ROWS + PADDING; r++) {
          setRow(nextGrid, r, compact(getRow(nextGrid, r), true));
        }
        break;
      case 6: // Lateral Inward
        for (let r = PADDING; r < ROWS + PADDING; r++) {
          let rowData = getRow(nextGrid, r);
          let mid = Math.floor(COLS / 2);
          let left = rowData.slice(0, mid).filter(x => x !== 0);
          let right = rowData.slice(mid).filter(x => x !== 0);
          let newRow = [
            ...Array(mid - left.length).fill(0),
            ...left,
            ...right,
            ...Array(COLS - mid - right.length).fill(0)
          ];
          setRow(nextGrid, r, newRow);
        }
        break;
      case 7: // Lateral Outward
        for (let r = PADDING; r < ROWS + PADDING; r++) {
          let rowData = getRow(nextGrid, r);
          let mid = Math.floor(COLS / 2);
          let left = rowData.slice(0, mid).filter(x => x !== 0);
          let right = rowData.slice(mid).filter(x => x !== 0);
          let newRow = [
            ...left,
            ...Array(mid - left.length).fill(0),
            ...Array(COLS - mid - right.length).fill(0),
            ...right
          ];
          setRow(nextGrid, r, newRow);
        }
        break;
      case 8: // Vertical Inward
        for (let c = PADDING; c < COLS + PADDING; c++) {
          let colData = getCol(nextGrid, c);
          let mid = Math.floor(ROWS / 2);
          let top = colData.slice(0, mid).filter(x => x !== 0);
          let bottom = colData.slice(mid).filter(x => x !== 0);
          let newCol = [
            ...Array(mid - top.length).fill(0),
            ...top,
            ...bottom,
            ...Array(ROWS - mid - bottom.length).fill(0)
          ];
          setCol(nextGrid, c, newCol);
        }
        break;
      case 9: // Vertical Outward
        for (let c = PADDING; c < COLS + PADDING; c++) {
          let colData = getCol(nextGrid, c);
          let mid = Math.floor(ROWS / 2);
          let top = colData.slice(0, mid).filter(x => x !== 0);
          let bottom = colData.slice(mid).filter(x => x !== 0);
          let newCol = [
            ...top,
            ...Array(mid - top.length).fill(0),
            ...Array(ROWS - mid - bottom.length).fill(0),
            ...bottom
          ];
          setCol(nextGrid, c, newCol);
        }
        break;
      default: break;
    }
    return nextGrid;
  };

  const checkNoMoreMoves = (currentGrid) => {
    for (let r1 = PADDING; r1 < ROWS + PADDING; r1++) {
      for (let c1 = PADDING; c1 < COLS + PADDING; c1++) {
        if (currentGrid[r1][c1] === 0) continue;
        for (let r2 = PADDING; r2 < ROWS + PADDING; r2++) {
          for (let c2 = PADDING; c2 < COLS + PADDING; c2++) {
            if (r1 === r2 && c1 === c2) continue;
            if (currentGrid[r1][c1] === currentGrid[r2][c2]) {
              if (getMatchPathInternal(currentGrid, { r: r1, c: c1 }, { r: r2, c: c2 })) {
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  };

  // Internal pathfinding for shuffle check (doesn't use state)
  const isPathClearInternal = (grid, p1, p2) => {
    if (p1.r === p2.r) {
      const minC = Math.min(p1.c, p2.c);
      const maxC = Math.max(p1.c, p2.c);
      for (let c = minC + 1; c < maxC; c++) if (grid[p1.r][c] !== 0) return false;
      return true;
    } else if (p1.c === p2.c) {
      const minR = Math.min(p1.r, p2.r);
      const maxR = Math.max(p1.r, p2.r);
      for (let r = minR + 1; r < maxR; r++) if (grid[r][p1.c] !== 0) return false;
      return true;
    }
    return false;
  };

  const getMatchPathInternal = (grid, p1, p2) => {
    if (grid[p1.r][p1.c] !== grid[p2.r][p2.c] || (p1.r === p2.r && p1.c === p2.c)) return null;
    if (isPathClearInternal(grid, p1, p2)) return [p1, p2];
    let corners = [{ r: p1.r, c: p2.c }, { r: p2.r, c: p1.c }];
    for (let cp of corners) {
      if (grid[cp.r][cp.c] === 0 && isPathClearInternal(grid, p1, cp) && isPathClearInternal(grid, cp, p2)) return [p1, cp, p2];
    }
    for (let r = 0; r < ROWS + 2 * PADDING; r++) {
      const c1 = { r, c: p1.c }, c2 = { r, c: p2.c };
      if ((grid[c1.r][c1.c] === 0 || (c1.r === p1.r && c1.c === p1.c)) && (grid[c2.r][c2.c] === 0 || (c2.r === p2.r && c2.c === p2.c))) {
        if (isPathClearInternal(grid, p1, c1) && isPathClearInternal(grid, c1, c2) && isPathClearInternal(grid, c2, p2)) return [p1, c1, c2, p2];
      }
    }
    for (let c = 0; c < COLS + 2 * PADDING; c++) {
      const c1 = { r: p1.r, c }, c2 = { r: p2.r, c };
      if ((grid[c1.r][c1.c] === 0 || (c1.r === p1.r && c1.c === p1.c)) && (grid[c2.r][c2.c] === 0 || (c2.r === p2.r && c2.c === p2.c))) {
        if (isPathClearInternal(grid, p1, c1) && isPathClearInternal(grid, c1, c2) && isPathClearInternal(grid, c2, p2)) return [p1, c1, c2, p2];
      }
    }
    return null;
  };

  const shuffleGrid = (currentGrid) => {
    let tiles = [];
    for (let r = PADDING; r < ROWS + PADDING; r++) {
      for (let c = PADDING; c < COLS + PADDING; c++) {
        if (currentGrid[r][c] !== 0) tiles.push(currentGrid[r][c]);
      }
    }

    let attempts = 0;
    let newGrid;
    do {
      for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
      }
      newGrid = currentGrid.map(row => row.map(() => 0));
      let index = 0;
      for (let r = PADDING; r < ROWS + PADDING; r++) {
        for (let c = PADDING; c < COLS + PADDING; c++) {
          if (currentGrid[r][c] !== 0 || index < tiles.length) { // maintain mask if possible or just refill
            // If we want to maintain the exact same shape, we only fill where it was non-zero
          }
        }
      }
      // Simplest shuffle: just redistribute remaining tiles into the current occupied slots
      let idx = 0;
      newGrid = currentGrid.map(row => [...row]);
      for (let r = PADDING; r < ROWS + PADDING; r++) {
        for (let c = PADDING; c < COLS + PADDING; c++) {
          if (newGrid[r][c] !== 0) newGrid[r][c] = tiles[idx++];
        }
      }
      attempts++;
    } while (checkNoMoreMoves(newGrid) && attempts < 100);

    if (checkNoMoreMoves(newGrid)) {
      setGameOver(true);
    }
    return newGrid;
  };

  const handleCellClick = (r, c) => {
    if (gameOver || grid[r][c] === 0) return;

    if (!selected) {
      setSelected({ r, c });
    } else {
      if (selected.r === r && selected.c === c) {
        setSelected(null);
        return;
      }

      const matchPath = getMatchPath(selected, { r, c });
      if (matchPath) {
        setPath(matchPath);
        setTimeout(() => {
          setPath([]);
          const newGrid = grid.map((row) => [...row]);
          newGrid[selected.r][selected.c] = 0;
          newGrid[r][c] = 0;

          let updatedGrid = applyGravity(newGrid);

          // Check if level cleared
          const isCleared = updatedGrid.every(row => row.every(cell => cell === 0));
          if (isCleared) {
            if (level < 9) {
              setLevel(level + 1);
            } else {
              setGameOver(true); // Win!
            }
            return;
          }

          // Check for more moves
          if (checkNoMoreMoves(updatedGrid)) {
            if (lives > 0) {
              setLives(prev => prev - 1);
              updatedGrid = shuffleGrid(updatedGrid);
            } else {
              setGameOver(true);
            }
          }

          setGrid(updatedGrid);
          setSelected(null);

          // Update score and time
          const now = Date.now();
          const timeDiff = now - lastMatchTime.current;
          const currentCombo = timeDiff < 3000 ? combo + 1 : 0;
          setCombo(currentCombo);
          setScore(prev => prev + 10 + currentCombo * 5);
          setTimeLeft(prev => Math.min(100, prev + 2));
          lastMatchTime.current = now;

        }, 400); // Shows for 400ms
      } else {
        setSelected({ r, c });
      }
    }
  };

  const getTileChar = (val) => String.fromCharCode(64 + val);

  return (
    <div className="pikachu-container">
      <div className="pikachu-header-container">
        <div className="pikachu-header-layer-2"></div>
        <div className="pikachu-header-layer-1">
          <div className="pikachu-header">
            <div className="pikachu-header-left">
              <div className="pikachu-stat">
                <span className="pikachu-stat-label">LEVEL</span>
                <span className="pikachu-stat-value">{level}</span>
              </div>
              <div className="pikachu-stat">
                <span className="pikachu-stat-label">SCORE</span>
                <span className="pikachu-stat-value">{score}</span>
              </div>
              <div className="pikachu-stat">
                <span className="pikachu-stat-label">LIVES</span>
                <span className="pikachu-stat-value">{lives}</span>
              </div>
            </div>
            <div className="pikachu-header-center">
              <div className="pikachu-timer-wrapper">
                <div className="pikachu-timer-layer-2"></div>
                <div className="pikachu-timer-container">
                  <div className="pikachu-timer-bar" style={{ width: `${timeLeft}%` }}></div>
                </div>
              </div>
            </div>
            <div className="pikachu-header-right">
              <Button onClick={() => initGame(level)}>Reset</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pikachu-grid-outer-container">
        <div className="pikachu-grid-layer-2"></div>
        <div className="pikachu-grid-wrapper">
          <div className="pikachu-grid" style={{ gridTemplateColumns: `repeat(${COLS + 2 * PADDING}, 1fr)` }}>
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isSelected = selected && selected.r === r && selected.c === c;
                const isBorder = r === 0 || r === ROWS + 2 * PADDING - 1 || c === 0 || c === COLS + 2 * PADDING - 1;
                return (
                  <Button
                    key={`${r}-${c}`}
                    className={`pikachu-cell ${cell === 0 ? "pikachu-empty" : ""} ${isBorder ? "pikachu-padding-cell" : ""}`}
                    isPressed={isSelected}
                    onClick={() => !isBorder && handleCellClick(r, c)}
                    disabled={cell === 0 || isBorder}
                  >
                    {cell !== 0 && <span className={`pikachu-tile-icon pikachu-tile-${cell}`}>{getTileChar(cell)}</span>}
                  </Button>
                );
              })
            )}
            {path.length > 0 && <PathRenderer path={path} />}
          </div>
        </div>
      </div>

      {gameOver && (
        <div className="pikachu-overlay">
          <div className="pikachu-game-over-box">
            <h2>GAME OVER</h2>
            <p>Final Score: {score}</p>
            <button className="pikachu-win95-btn" onClick={() => { setLevel(1); initGame(1); }}>RESTART</button>
          </div>
        </div>
      )}
    </div>
  );
};

const PathRenderer = ({ path }) => {
  return (
    <svg 
      className="pikachu-path-svg" 
      viewBox={`0 0 ${COLS + 2 * PADDING} ${ROWS + 2 * PADDING}`} 
      preserveAspectRatio="none"
    >
      <polyline
        points={path.map(p => `${p.c + 0.5},${p.r + 0.5}`).join(" ")}
        fill="none"
        stroke="#ffff00"
        strokeWidth="0.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
};

export default Pikachu;
