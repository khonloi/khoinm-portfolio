import { useState, useEffect, useRef } from 'react';
import { playSound } from '../data/sounds';
import { desktopItems } from '../config/programConfig';
import startupCard from "../assets/images/startup-card-1.png";
import monitorMoonIcon from "../assets/icons/Microsoft Windows 3 Post-It.ico";
import keyGrayIcon from "../assets/icons/Microsoft Windows 3 Keys.ico";

export const useStartup = ({
  isLoading,
  isDelaying,
  isShuttingDown,
  handleItemDoubleClick,
}) => {
  const [hasBooted, setHasBooted] = useState(false);
  const [idleSeconds, setIdleSeconds] = useState(0);

  // Helper to find all programs with startup defined
  const getAllStartups = (items) => {
    let results = [];
    items.forEach((item) => {
      if (item.startup !== undefined) results.push(item);
      if (item.contents) {
        results = [...results, ...getAllStartups(item.contents)];
      }
    });
    return results;
  };

  const startupPrograms = getAllStartups(desktopItems);

  // Preload assets immediately on hook initialization
  useEffect(() => {
    const imagesToPreload = [startupCard, monitorMoonIcon, keyGrayIcon];
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Handle immediate startup (startup: true)
  useEffect(() => {
    if (!isLoading && !isDelaying && !hasBooted && !isShuttingDown) {
      const runImmediateStartups = async () => {
        try {
          await playSound('startup');
        } catch (error) {
          console.warn('Startup sound failed:', error);
        }

        const immediateStartups = startupPrograms.filter(item => item.startup === true);
        for (const item of immediateStartups) {
          handleItemDoubleClick(item.id, item.label, { skipTracking: true });
        }
        setHasBooted(true);
      };
      runImmediateStartups();
    }
  }, [isLoading, isDelaying, hasBooted, isShuttingDown, handleItemDoubleClick, startupPrograms]);

  // Track idle time
  useEffect(() => {
    if (isLoading || isDelaying || isShuttingDown || !hasBooted) return;

    const resetIdle = () => setIdleSeconds(0);
    
    // Initial reset when booted
    resetIdle();

    const interval = setInterval(() => {
      setIdleSeconds(prev => prev + 1);
    }, 1000);

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('mousedown', resetIdle);
    window.addEventListener('touchstart', resetIdle);

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('mousedown', resetIdle);
      window.removeEventListener('touchstart', resetIdle);
      clearInterval(interval);
    };
  }, [isLoading, isDelaying, isShuttingDown, hasBooted]);

  // Trigger programs on idle threshold
  useEffect(() => {
    startupPrograms.forEach(item => {
      if (typeof item.startup === 'number' && idleSeconds === item.startup) {
        handleItemDoubleClick(item.id, item.label, { skipTracking: true });
      }
    });
  }, [idleSeconds, startupPrograms, handleItemDoubleClick]);

  return { hasStarted: hasBooted };
};
