import { useState, useCallback, useRef } from 'react';
import type { ZoomAnimation, TriggerZoomAnimationOptions, Rect } from '../../types';

/**
 * Hook to manage classic MacOS ZoomRect opening, closing, minimizing, and restoring animations.
 */
export const useZoomAnimationManager = () => {
  const [zoomAnimations, setZoomAnimations] = useState<ZoomAnimation[]>([]);
  const animationCallbacksRef = useRef<Map<string, () => void>>(new Map());

  const triggerZoomAnimation = useCallback(({
    id = Math.random().toString(36).substring(2, 9),
    fromRect,
    toRect,
    type = 'open',
    duration = 220,
    steps = 5,
    onComplete,
  }: TriggerZoomAnimationOptions) => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onComplete?.();
      return id;
    }

    const defaultOrigin: Rect = {
      x: typeof window !== 'undefined' ? window.innerWidth / 2 - 40 : 100,
      y: typeof window !== 'undefined' ? window.innerHeight / 2 - 48 : 100,
      width: 80,
      height: 96,
    };

    const defaultTarget: Rect = {
      x: typeof window !== 'undefined' ? (window.innerWidth - 400) / 2 : 100,
      y: typeof window !== 'undefined' ? (window.innerHeight - 300) / 2 : 100,
      width: 400,
      height: 300,
    };

    const finalFrom = fromRect || defaultOrigin;
    const finalTo = toRect || defaultTarget;

    if (onComplete) {
      animationCallbacksRef.current.set(id, onComplete);
    }

    const newAnim: ZoomAnimation = {
      id,
      fromRect: finalFrom,
      toRect: finalTo,
      type,
      duration,
      steps,
      startTime: performance.now(),
    };

    setZoomAnimations((prev) => {
      // Replace any existing animation with the same ID
      const filtered = prev.filter((a) => a.id !== id);
      return [...filtered, newAnim];
    });

    return id;
  }, []);

  const handleAnimationComplete = useCallback((id: string) => {
    const cb = animationCallbacksRef.current.get(id);
    if (cb) {
      cb();
      animationCallbacksRef.current.delete(id);
    }
    setZoomAnimations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const cancelZoomAnimation = useCallback((id: string) => {
    animationCallbacksRef.current.delete(id);
    setZoomAnimations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    zoomAnimations,
    triggerZoomAnimation,
    handleAnimationComplete,
    cancelZoomAnimation,
  };
};

