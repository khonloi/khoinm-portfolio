import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Line98.module.css';
import Button from '../../../components/Button';
import { playSound } from '../../../data/sounds';
import {
  GRID_SIZE,
  checkLines,
  findPath,
  createInitialBoard,
  spawnBalls,
  type PreviewBall,
  type MovingBall,
} from './line98Engine';

import moveSound from './sounds/inside-your-computer-error.mp3';
import errorSound from './sounds/inside-your-computer-asterisk.mp3';
import disappearSound from './sounds/robotz-error.mp3';
import appearSound from './sounds/robotz-menu-pop-up.mp3';
import selectSound from './sounds/robotz-default.mp3';

const Line98: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(() =>
    Array(GRID_SIZE)
      .fill(0)
      .map(() => Array(GRID_SIZE).fill(0))
  );
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selected, setSelected] = useState<[number, number] | null>(null); // [r, c]
  const [highScore, setHighScore] = useState(() =>
    parseInt(localStorage.getItem('line98_highScore') || '0', 10)
  );
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
    if (
      soundOnRef.current &&
      (!lastPlayedRef.current[soundFile] ||
        now - lastPlayedRef.current[soundFile] > 150)
    ) {
      lastPlayedRef.current[soundFile] = now;
      playSound(soundFile).catch((e) => console.warn('Audio play failed:', e));
    }
  }, []);

  const spawnNewBalls = useCallback(
    (currentGrid: number[][], currentPreviews: PreviewBall[]): number[][] => {
      const {
        nextGrid,
        cleared,
        nextPreviews,
        isGameOver: over,
      } = spawnBalls(currentGrid, currentPreviews);

      if (cleared.length > 0) {
        playEffect(disappearSound);
        setScore((prev) => prev + cleared.length * 2);
      } else {
        playEffect(appearSound);
      }

      if (over) {
        setIsGameOver(true);
      }

      setPreviews(nextPreviews);
      return nextGrid;
    },
    [playEffect]
  );

  const initGame = useCallback(() => {
    const { grid: newGrid, previews: nextPreviews } = createInitialBoard();
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
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameOver]);

  useEffect(() => {
    initGame();
  }, [initGame]);

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
        const tempGrid = grid.map((row) => [...row]);
        tempGrid[sr][sc] = 0;
        setGrid(tempGrid);
        setSelected(null);

        // Animate trace
        playEffect(moveSound);
        for (let i = 0; i < path.length; i++) {
          const [pr, pc] = path[i];
          setMovingBall({ r: pr, c: pc, color });
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        setMovingBall(null);
        const finalGrid = tempGrid.map((row) => [...row]);
        finalGrid[r][c] = color;

        const removed = checkLines(finalGrid, r, c);
        if (removed.length > 0) {
          playEffect(disappearSound);
          removed.forEach(([rr, rc]) => {
            finalGrid[rr][rc] = 0;
          });
          setScore((prev) => prev + removed.length * 2);
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
        <div className={styles.scoreValue}>
          {score.toString().padStart(3, '0')}
        </div>
        <div className={styles.timerDisplay}>
          <div className={styles.digitalValue}>
            {timer.toString().padStart(3, '0')}
          </div>
        </div>
        <div className={styles.scoreValue}>
          {highScore.toString().padStart(3, '0')}
        </div>
      </div>

      <div className={styles.grid}>
        {grid.map((row, ri) =>
          row.map((cell, ci) => {
            const preview = previews.find((p) => p.r === ri && p.c === ci);
            const isSelected =
              selected && selected[0] === ri && selected[1] === ci;
            return (
              <div
                key={`${ri}-${ci}`}
                className={`${styles.cell} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleCellClick(ri, ci)}
              >
                {grid[ri][ci] !== 0 ? (
                  <div
                    className={`${styles.ball} ${styles[`ball${grid[ri][ci]}`]}`}
                  />
                ) : (
                  <>
                    {movingBall &&
                      movingBall.r === ri &&
                      movingBall.c === ci && (
                        <div
                          className={`${styles.ball} ${styles[`ball${movingBall.color}`]}`}
                        />
                      )}
                    {preview && !movingBall && (
                      <div
                        className={`${styles.ball} ${styles[`ball${preview.color}`]} ${styles.ballGhost}`}
                      />
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
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
