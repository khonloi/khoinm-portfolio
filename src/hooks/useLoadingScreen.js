// src/hooks/useLoadingScreen.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { getCursorStyle } from '../data/cursors';
import { playSound } from '../data/sounds';

export const useLoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDelaying, setIsDelaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuBarVisible, setMenuBarVisible] = useState(false);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const bootSequenceTimerRef = useRef(null);

  // Skip loading function
  const skipLoading = useCallback(() => {
    // Clear all timers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (bootSequenceTimerRef.current) {
      clearTimeout(bootSequenceTimerRef.current);
      bootSequenceTimerRef.current = null;
    }
    
    // Immediately show desktop
    setIsLoading(false);
    setIsDelaying(false);
    setMenuBarVisible(true);
    
    // Restore cursor when skipping
    document.body.style.cursor = getCursorStyle('arrow');
    
    // Play startup sound
    playSound('logon', { preventDuplicate: true, audioRef });
  }, [audioRef]);

  // Loading screen and startup sound effect
  useEffect(() => {
    // Boot sequence takes ~21.4 seconds (logo + black screen + memory test + boot lines + transition), so delay the progress bar start
    const bootSequenceDelay = 22000; 

    
    // Start the progress bar after the boot sequence
    bootSequenceTimerRef.current = setTimeout(() => {
      // Define target duration for loading (5-7 seconds)
      const targetDuration = Math.floor(Math.random() * 2000) + 5000; // 5000-7000ms
      let soundPlayed = false;
      let lastProgress = 0;
      let startTime = Date.now();

      // Create inconsistent progress updates
      intervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const elapsedPercentage = Math.min(100, (elapsedTime / targetDuration) * 100);
        
        // Create inconsistent jumps in progress
        const randomJump = Math.random();
        let newProgress;
        
        if (randomJump < 0.7) {
          // 70% chance: small increment (0-3%)
          newProgress = lastProgress + Math.random() * 3;
        } else if (randomJump < 0.9) {
          // 20% chance: medium increment (3-8%)
          newProgress = lastProgress + 3 + Math.random() * 5;
        } else {
          // 10% chance: large increment (8-15%)
          newProgress = lastProgress + 8 + Math.random() * 7;
        }
        
        // Ensure progress doesn't exceed what it should be based on elapsed time
        newProgress = Math.min(newProgress, elapsedPercentage);
        
        // Occasionally stall (no progress)
        if (Math.random() < 0.15 && newProgress < 90) {
          newProgress = lastProgress;
        }
        
        // Cap at 100%
        newProgress = Math.min(100, newProgress);
        lastProgress = newProgress;
        
        setProgress(newProgress);
        
        // Check if loading is complete
        if (newProgress >= 100) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          // Start the delay phase after loading completes
          setTimeout(() => {
            setIsLoading(false);
            setIsDelaying(true);
            
            // Play sound when loading completes (only if not already played)
            if (!soundPlayed) {
              playSound('logon', { preventDuplicate: true, audioRef });
              soundPlayed = true;
            }
            
            // After 2 seconds delay, show desktop
            setTimeout(() => {
              setIsDelaying(false);
              
              // Restore cursor when loading sequence is completely done
              document.body.style.cursor = getCursorStyle('arrow');
              
              // Add a delay before showing the menu bar
              setTimeout(() => {
                setMenuBarVisible(true);
              }); 
            }, 2000);
          }, 500);
        }
      }, 100); // Update every 100ms for smoother animation
    }, bootSequenceDelay);

    // Effect for loading cursor
    if (isDelaying) {
      document.body.classList.add('loading');
    } else {
      document.body.classList.remove('loading');
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (bootSequenceTimerRef.current) {
        clearTimeout(bootSequenceTimerRef.current);
        bootSequenceTimerRef.current = null;
      }
      if (audioRef.current) {
        // Remove any event listeners
        audioRef.current.onended = null;
        audioRef.current.oncanplaythrough = null;
        audioRef.current.onerror = null;
        
        // Pause and release the audio
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      
      // Ensure loading class is removed
      document.body.classList.remove('loading');
    };
  }, []);

  return {
    isLoading,
    isDelaying,
    progress,
    menuBarVisible,
    skipLoading
  };
}; 