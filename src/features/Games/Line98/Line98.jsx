import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Line98.css';
import Button from '../../../components/Button';

import moveSound from './sounds/inside-your-computer-error.mp3';
import errorSound from './sounds/inside-your-computer-asterisk.mp3';
import disappearSound from './sounds/robotz-error.mp3';
import appearSound from './sounds/robotz-menu-pop-up.mp3';
import selectSound from './sounds/robotz-default.mp3';



const GRID_SIZE = 9;
const COLORS = [1, 2, 3, 4, 5, 6, 7]; // Red, Green, Blue, Yellow, Pink, Cyan, Orange

const Line98 = () => {
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)));
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selected, setSelected] = useState(null); // [r, c]
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('line98_highScore') || '0'));
  const [previews, setPreviews] = useState([]); // [{color, r, c}, ...]
  const [timer, setTimer] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [movingBall, setMovingBall] = useState(null); // {r, c, color}

  const soundOnRef = useRef(soundOn);
  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  const lastPlayedRef = useRef({});

  const playEffect = useCallback((soundFile) => {
    const now = Date.now();
    // Prevent overlapping of the same sound within 150ms
    if (soundOnRef.current && (!lastPlayedRef.current[soundFile] || now - lastPlayedRef.current[soundFile] > 150)) {
      lastPlayedRef.current[soundFile] = now;
      const audio = new Audio(soundFile);
      audio.play().catch(e => console.warn("Audio play failed:", e));
    }
  }, []);




  const checkLines = useCallback((board, r, c) => {
    const color = board[r][c];
    if (color === 0) return [];


    const directions = [
      [0, 1],  // Horizontal
      [1, 0],  // Vertical
      [1, 1],  // Diagonal \
      [1, -1]  // Diagonal /
    ];

    let allToRemove = new Set();
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
      return Array.from(allToRemove).map(s => s.split(',').map(Number));
    }
    return [];
  }, []);

  const spawnNewBalls = useCallback((currentGrid, currentPreviews) => {
    const nextGrid = currentGrid.map(row => [...row]);
    let actualSpawned = [];

    currentPreviews.forEach(({ color, r, c }) => {
      if (nextGrid[r][c] !== 0) {
        const emptyCells = [];
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

    let toRemove = [];
    actualSpawned.forEach(([r, c]) => {
      const removed = checkLines(nextGrid, r, c);
      toRemove = [...toRemove, ...removed];
    });

    if (toRemove.length > 0) {
      playEffect(disappearSound);
      const uniqueToRemove = Array.from(new Set(toRemove.map(p => p.join(',')))).map(s => s.split(',').map(Number));
      uniqueToRemove.forEach(([r, c]) => {
        nextGrid[r][c] = 0;
      });
      setScore(prev => prev + uniqueToRemove.length * 2);
    } else {
      playEffect(appearSound);
    }


    const remainingEmpty = [];
    nextGrid.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        if (cell === 0) remainingEmpty.push([ri, ci]);
      });
    });

    if (remainingEmpty.length === 0 && actualSpawned.length > 0 && toRemove.length === 0) {
      setIsGameOver(true);
    }

    const nextPreviews = [];
    for (let i = 0; i < 3 && remainingEmpty.length > 0; i++) {
      const idx = Math.floor(Math.random() * remainingEmpty.length);
      const [r, c] = remainingEmpty.splice(idx, 1)[0];
      nextPreviews.push({ color: COLORS[Math.floor(Math.random() * COLORS.length)], r, c });
    }

    setPreviews(nextPreviews);
    return nextGrid;
  }, [checkLines]);

  const initGame = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    const emptyCells = [];
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

    const nextPreviews = [];
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
    let interval;
    if (!isGameOver) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameOver]);


  useEffect(() => {
    initGame();
  }, [initGame]);

  const findPath = useCallback((currentGrid, start, end) => {
    const [sr, sc] = start;
    const [er, ec] = end;
    if (currentGrid[er][ec] !== 0) return null;

    const queue = [[sr, sc, [[sr, sc]]]];
    const visited = new Set([`${sr},${sc}`]);
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    while (queue.length > 0) {
      const [r, c, path] = queue.shift();
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


  const handleCellClick = async (r, c) => {
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
    <div className="line98-container">
      <div className="line98-header">
        <div className="line98-score-value">{score.toString().padStart(3, '0')}</div>
        <div className="line98-timer-display">
          <div className="line98-digital-value">{timer.toString().padStart(3, '0')}</div>
        </div>
        <div className="line98-score-value">{highScore.toString().padStart(3, '0')}</div>
      </div>

      <div className="line98-grid">
        {grid.map((row, ri) => (
          row.map((cell, ci) => {
            const preview = previews.find(p => p.r === ri && p.c === ci);
            const isSelected = selected && selected[0] === ri && selected[1] === ci;
            return (
              <div
                key={`${ri}-${ci}`}
                className={`line98-cell ${isSelected ? 'line98-selected' : ''}`}
                onClick={() => handleCellClick(ri, ci)}
              >
                {grid[ri][ci] !== 0 ? (
                  <div className={`line98-ball line98-ball-${grid[ri][ci]}`} />
                ) : (
                  <>
                    {movingBall && movingBall.r === ri && movingBall.c === ci && (
                      <div className={`line98-ball line98-ball-${movingBall.color}`} />
                    )}
                    {preview && !movingBall && (
                      <div className={`line98-ball line98-ball-${preview.color} line98-ball-ghost`} />
                    )}
                  </>
                )}

              </div>
            );
          })
        ))}
      </div>

      <div className="line98-footer">
        <Button
          className="line98-sound-btn"
          onClick={() => setSoundOn(!soundOn)}
        >
          Sound {soundOn ? 'ON' : 'OFF'}
        </Button>
        <Button onClick={initGame}>Restart</Button>
      </div>

      {isGameOver && (
        <div className="line98-game-over-overlay">
          <div className="line98-game-over-modal">
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
