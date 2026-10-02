import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Line98.module.css';
import Button from '../../../components/Button';

import moveSound from './sounds/inside-your-computer-error.mp3';
import errorSound from './sounds/inside-your-computer-asterisk.mp3';
import disappearSound from './sounds/robotz-error.mp3';
import appearSound from './sounds/robotz-menu-pop-up.mp3';
import selectSound from './sounds/robotz-default.mp3';



interface PreviewBall {
  color: number;
  r: number;
  c: number;
}

interface MovingBall {
  r: number;
  c: number;
  color: number;
}

const GRID_SIZE = 9;
const COLORS = [1, 2, 3, 4, 5, 6, 7]; // Red, Green, Blue, Yellow, Pink, Cyan, Orange

const Line98: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(() =>
    Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0))
  );
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selected, setSelected] = useState<[number, number] | null>(null); // [r, c]
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('line98_highScore') || '0', 10));
  const [previews, setPreviews] = useState<PreviewBall[]>([]); // [{color, r, c}, ...]
  const [timer, setTimer] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [movingBall, setMovingBall] = useState<MovingBall | null>(null); // {r, c, color}

  const soundOnRef = useRef(soundOn);
  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  const lastPlayedRef = useRef<Record<string, number>>({});

  const playEffect = useCallback((soundFile: string) => {
    const now = Date.now();
    // Prevent overlapping of the same sound within 150ms
    if (soundOnRef.current && (!lastPlayedRef.current[soundFile] || now - lastPlayedRef.current[soundFile] > 150)) {
      lastPlayedRef.current[soundFile] = now;
      const audio = new Audio(soundFile);
      audio.play().catch(e => console.warn("Audio play failed:", e));
    }
  }, []);




  const checkLines = useCallback((board: number[][], r: number, c: number): [number, number][] => {
    const color = board[r][c];
    if (color === 0) return [];


    const directions = [
      [0, 1],  // Horizontal
      [1, 0],  // Vertical
      [1, 1],  // Diagonal \
      [1, -1]  // Diagonal /
    ];

    let allToRemove = new Set<string>();
    allToRemove.add(`${r},${c}`);

    directions.forEach(([dr, dc]) => {
      let line = [`${r},${c}`];

      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && board[nr][nc] === color) {
        line.push(`${nr},${nc}`);
        nr += dr;
        nc += dc;
      }

      nr = r - dr; nc = c - dc;
      while (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && board[nr][nc] === color) {
        line.push(`${nr},${nc}`);
        nr -= dr;
        nc -= dc;
      }

      if (line.length >= 5) {
        line.forEach(pos => allToRemove.add(pos));
      }
    });

    if (allToRemove.size >= 5) {
      return Array.from(allToRemove).map(s => {
        const [nr, nc] = s.split(',').map(Number);
        return [nr, nc] as [number, number];
      });
    }
    return [];
  }, []);

  const spawnNewBalls = useCallback((currentGrid: number[][], currentPreviews: PreviewBall[]): number[][] => {
    const nextGrid = currentGrid.map(row => [...row]);
    let actualSpawned: [number, number][] = [];

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

    if (toRemove.length > 0) {
      playEffect(disappearSound);
      const uniqueToRemove = Array.from(new Set(toRemove.map(p => p.join(',')))).map(s => {
        const [ur, uc] = s.split(',').map(Number);
        return [ur, uc] as [number, number];
      });
      uniqueToRemove.forEach(([r, c]) => {
        nextGrid[r][c] = 0;
      });
      setScore(prev => prev + uniqueToRemove.length * 2);
    } else {
      playEffect(appearSound);
    }


    const remainingEmpty: [number, number][] = [];
    nextGrid.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        if (cell === 0) remainingEmpty.push([ri, ci]);
      });
    });

    if (remainingEmpty.length === 0 && actualSpawned.length > 0 && toRemove.length === 0) {
      setIsGameOver(true);
    }

    const nextPreviews: PreviewBall[] = [];
    for (let i = 0; i < 3 && remainingEmpty.length > 0; i++) {
      const idx = Math.floor(Math.random() * remainingEmpty.length);
      const [r, c] = remainingEmpty.splice(idx, 1)[0];
      nextPreviews.push({ color: COLORS[Math.floor(Math.random() * COLORS.length)], r, c });
    }

    setPreviews(nextPreviews);
    return nextGrid;
  }, [checkLines, playEffect]);

  const initGame = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
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

    setGrid(newGrid);
    setPreviews(nextPreviews);
    setScore(0);
    setIsGameOver(false);
    setSelected(null);
    setTimer(0);
    playEffect(appearSound);
  }, [playEffect]);


  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (!isGameOver) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameOver]);


  useEffect(() => {
    initGame();
  }, [initGame]);

  const findPath = useCallback((currentGrid: number[][], start: [number, number], end: [number, number]): [number, number][] | null => {
    const [sr, sc] = start;
    const [er, ec] = end;
    if (currentGrid[er][ec] !== 0) return null;

    const queue: [number, number, [number, number][]][] = [[sr, sc, [[sr, sc]]]];
    const visited = new Set([`${sr},${sc}`]);
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      const [r, c, path] = item;
      if (r === er && c === ec) return path;

      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE &&
          currentGrid[nr][nc] === 0 && !visited.has(`${nr},${nc}`)) {
          visited.add(`${nr},${nc}`);
          queue.push([nr, nc, [...path, [nr, nc]]]);
        }
      }
    }
    return null;
  }, []);

  const handleCellClick = async (r: number, c: number) => {
    if (isGameOver || movingBall) return;

    if (grid[r][c] !== 0) {
      setSelected([r, c]);
      playEffect(selectSound);
    } else if (selected) {
      const path = findPath(grid, selected, [r, c]);

      if (path) {
        const [sr, sc] = selected;
        const color = grid[sr][sc];

        // Remove from start
        const tempGrid = grid.map(row => [...row]);
        tempGrid[sr][sc] = 0;
        setGrid(tempGrid);
        setSelected(null);

        // Animate trace
        playEffect(moveSound);
        for (let i = 0; i < path.length; i++) {
          const [pr, pc] = path[i];
          setMovingBall({ r: pr, c: pc, color });
          await new Promise(resolve => setTimeout(resolve, 50));
        }


        setMovingBall(null);
        const finalGrid = tempGrid.map(row => [...row]);
        finalGrid[r][c] = color;

        const removed = checkLines(finalGrid, r, c);
        if (removed.length > 0) {
          playEffect(disappearSound);
          removed.forEach(([rr, rc]) => {
            finalGrid[rr][rc] = 0;
          });
          setScore(prev => prev + removed.length * 2);
          setGrid(finalGrid);
        } else {
          const spawnedGrid = spawnNewBalls(finalGrid, previews);
          setGrid(spawnedGrid);
        }
      } else {
        playEffect(errorSound);
      }
    }
  };


  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('line98_highScore', score.toString());
    }
  }, [score, highScore]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.scoreValue}>{score.toString().padStart(3, '0')}</div>
        <div className={styles.timerDisplay}>
          <div className={styles.digitalValue}>{timer.toString().padStart(3, '0')}</div>
        </div>
        <div className={styles.scoreValue}>{highScore.toString().padStart(3, '0')}</div>
      </div>

      <div className={styles.grid}>
        {grid.map((row, ri) => (
          row.map((cell, ci) => {
            const preview = previews.find(p => p.r === ri && p.c === ci);
            const isSelected = selected && selected[0] === ri && selected[1] === ci;
            return (
              <div
                key={`${ri}-${ci}`}
                className={`${styles.cell} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleCellClick(ri, ci)}
              >
                {grid[ri][ci] !== 0 ? (
                  <div className={`${styles.ball} ${styles[`ball${grid[ri][ci]}`]}`} />
                ) : (
                  <>
                    {movingBall && movingBall.r === ri && movingBall.c === ci && (
                      <div className={`${styles.ball} ${styles[`ball${movingBall.color}`]}`} />
                    )}
                    {preview && !movingBall && (
                      <div className={`${styles.ball} ${styles[`ball${preview.color}`]} ${styles.ballGhost}`} />
                    )}
                  </>
                )}

              </div>
            );
          })
        ))}
      </div>

      <div className={styles.footer}>
        <Button
          className={styles.soundBtn}
          onClick={() => setSoundOn(!soundOn)}
        >
          Sound {soundOn ? 'ON' : 'OFF'}
        </Button>
        <Button onClick={initGame}>Restart</Button>
      </div>

      {isGameOver && (
        <div className={styles.gameOverOverlay}>
          <div className={styles.gameOverModal}>
            <h2>Game Over</h2>
            <p>Score: {score}</p>
            <Button onClick={initGame}>New Game</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Line98;
