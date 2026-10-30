import type { Rect, TriggerZoomAnimationOptions, ZoomAnimation } from '../../types';

export interface RunWindowZoomOptions {
  id: string;
  fromRect?: Rect | null;
  toRect?: Rect | null;
  type: ZoomAnimation['type'];
  duration?: number;
  steps?: number;
  onComplete: () => void;
}

/**
 * Standardized helper to execute zoom animation or immediately complete if animation is unavailable.
 */
export const runWindowZoom = (
  triggerZoomAnimation?: ((options: TriggerZoomAnimationOptions) => string) | null,
  options: RunWindowZoomOptions = {} as RunWindowZoomOptions
): void => {
  if (triggerZoomAnimation && (options.fromRect || options.toRect)) {
    triggerZoomAnimation({
      id: options.id,
      fromRect: options.fromRect,
      toRect: options.toRect,
      type: options.type,
      duration: options.duration ?? 220,
      steps: options.steps ?? 7,
      onComplete: options.onComplete,
    });
  } else {
    options.onComplete();
  }
};

