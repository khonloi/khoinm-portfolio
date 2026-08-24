import React, { useEffect, useState, memo } from 'react';

// Smooth cubic ease-out curve for natural deceleration across steps
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * ZoomRectOverlay Component
 * Renders authentic Classic MacOS QuickDraw style expanding and collapsing wireframe rectangles
 * with slightly jagged stepped frame progression matching exact source and destination bounds.
 */
const ZoomRectOverlay = memo(({ animations = [], onAnimationComplete }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (animations.length === 0) return;

    let animationFrameId;

    const renderLoop = (now) => {
      let hasActive = false;

      animations.forEach((anim) => {
        const elapsed = now - anim.startTime;
        if (elapsed >= anim.duration) {
          onAnimationComplete?.(anim.id);
        } else {
          hasActive = true;
        }
      });

      if (hasActive) {
        setTick((prev) => (prev + 1) % 100000);
        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [animations, onAnimationComplete]);

  if (animations.length === 0) return null;

  const now = performance.now();

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none">
      {animations.map((anim) => {
        const elapsed = Math.max(0, now - anim.startTime);
        const linearT = Math.min(1, elapsed / anim.duration);

        // Discrete stepped intervals (7 steps: 0 to 6)
        const totalSteps = anim.steps || 7;
        const currentStepIndex = Math.min(
          totalSteps - 1,
          Math.floor(linearT * totalSteps)
        );

        // Render current stepped frame + 1 trailing stepped frame
        const frameIndices = [currentStepIndex];
        if (currentStepIndex > 0) {
          frameIndices.push(currentStepIndex - 1);
        }

        const opacities = [1, 0.55];

        const frames = frameIndices.map((stepIdx, i) => {
          // Normalize stepIdx from 0 to totalSteps - 1 onto exactly [0, 1]
          const stepRatio = totalSteps > 1 ? stepIdx / (totalSteps - 1) : 1;
          const p = easeOutCubic(stepRatio);

          const x = Math.round(
            anim.fromRect.x + (anim.toRect.x - anim.fromRect.x) * p
          );
          const y = Math.round(
            anim.fromRect.y + (anim.toRect.y - anim.fromRect.y) * p
          );
          const width = Math.round(
            anim.fromRect.width + (anim.toRect.width - anim.fromRect.width) * p
          );
          const height = Math.round(
            anim.fromRect.height + (anim.toRect.height - anim.fromRect.height) * p
          );

          return {
            stepIdx,
            style: {
              position: 'fixed',
              left: `${x}px`,
              top: `${y}px`,
              width: `${Math.max(10, width)}px`,
              height: `${Math.max(10, height)}px`,
              opacity: opacities[i],
            },
          };
        });

        return (
          <React.Fragment key={anim.id}>
            {frames.map((frame) => (
              <div
                key={`${anim.id}-${frame.stepIdx}`}
                className="mac-zoom-rect border-4 border-windows-grey-dark"
                style={frame.style}
              />
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
});

ZoomRectOverlay.displayName = 'ZoomRectOverlay';

export default ZoomRectOverlay;
