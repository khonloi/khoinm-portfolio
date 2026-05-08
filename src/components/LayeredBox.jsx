import React, { memo, useMemo } from 'react';

/**
 * Parses a hex color string (#rrggbb or #rgb) into { r, g, b }.
 */
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

/**
 * Converts { r, g, b } to a #rrggbb string.
 */
function rgbToHex({ r, g, b }) {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
  );
}

/**
 * Blends `color` toward `target` by `amount` (0–1).
 */
function blendColor(color, target, amount) {
  const c = hexToRgb(color);
  const t = hexToRgb(target);
  return rgbToHex({
    r: c.r + (t.r - c.r) * amount,
    g: c.g + (t.g - c.g) * amount,
    b: c.b + (t.b - c.b) * amount,
  });
}

/**
 * Returns the perceived luminance (0–1) of a hex color.
 */
function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * LayeredBox — a div that mirrors the Button 3-layer Windows 95 bevel system.
 *
 * Props:
 *   bgColor       — the box's own background color (hex, e.g. "#c0c0c0")
 *   parentBgColor — the parent container's background color (hex); used to derive
 *                   the outer box-shadow outline so it blends naturally.
 *   variant       — "outward" (default) raised/protruding bevel:
 *                     Layer 1 top-left = highlight, Layer 2 bottom-right = shadow.
 *                   "inward" sunken/recessed bevel:
 *                     Layer 1 top-left = shadow, Layer 2 bottom-right = highlight.
 *   className     — extra class names applied to the outer element
 *   style         — extra inline styles on the outer element
 *   children      — content rendered inside the box
 *
 * Layer mapping (same as Button):
 *   box-shadow    → outer 2px solid border (derived from parentBgColor)
 *   Layer 1       → border-top + border-left  (highlight outward / shadow inward)
 *   Layer 2       → border-bottom + border-right (shadow outward / highlight inward) [absolute]
 *   Layer 3       → content wrapper
 */
const LayeredBox = memo(({
  bgColor = '#c0c0c0',
  parentBgColor,
  variant = 'outward',
  className = '',
  style = {},
  children,
  ...props
}) => {
  const { outlineColor, highlightColor, shadowColor } = useMemo(() => {
    const lum = luminance(bgColor);
    const isDark = lum < 0.4;

    // Highlight (top-left): user wants #ffffff on #c0c0c0
    // amount = 1.0 ensures we can reach pure white if needed
    const highlight = blendColor(bgColor, '#ffffff', 1.0);

    // Shadow (bottom-right): user wants #808080 on #c0c0c0
    // 1 - (128/192) = 1/3 (approx 0.333). We use a slightly higher blend to ensure depth.
    const shadow = blendColor(bgColor, '#000000', 0.334);

    // Outline: use parentBgColor if provided, else derive from bgColor
    let outline;
    if (parentBgColor) {
      const pLum = luminance(parentBgColor);
      outline = pLum < 0.4
        ? blendColor(parentBgColor, '#ffffff', 0.1)
        : blendColor(parentBgColor, '#000000', 0.85); // 0.85 toward black from white = #262626
    } else {
      outline = isDark
        ? blendColor(bgColor, '#000000', 0.6)
        : blendColor(bgColor, '#000000', 0.85);
    }

    // Inward (sunken): swap the positions of highlight and shadow
    const isInward = variant === 'inward';

    return {
      outlineColor: outline,
      highlightColor: isInward ? shadow : highlight,
      shadowColor: isInward ? highlight : shadow,
    };
  }, [bgColor, parentBgColor, variant]);

  const inlineVars = {
    backgroundColor: bgColor,
    '--layered-box-bg': bgColor,
    '--layered-box-outline': variant === 'inward' ? 'transparent' : outlineColor,
    '--layered-box-highlight': highlightColor,
    '--layered-box-shadow': shadowColor,
    ...style,
  };

  return (
    <div
      className={`relative block bg-[var(--layered-box-bg,var(--windows-grey))] shadow-[0_0_0_2px_var(--layered-box-outline,#000000)] ${variant === 'outward' ? 'm-0.5' : ''} ${className}`}
      style={inlineVars}
      {...props}
    >
      {/* Layer 1 — top/left highlight border */}
      <div className="layered-box-layer-1 border-l-2 border-t-2 border-[color:var(--layered-box-highlight,var(--windows-white))] pr-0.5 pb-0.5 w-full h-full z-[1]">
        {/* Layer 3 — content */}
        <div className={`layered-box-layer-3 w-full h-full z-[3] ${variant === 'inward' ? 'border-2 border-[color:var(--windows-black,#000000)]' : ''}`}>
          {children}
        </div>
      </div>
      {/* Layer 2 — bottom/right border (absolute overlay) */}
      <div className="absolute inset-0 pointer-events-none border-r-2 border-b-2 border-[color:var(--layered-box-shadow,var(--windows-grey-dark))] z-[2]" />
    </div>
  );
});

LayeredBox.displayName = 'LayeredBox';

export default LayeredBox;
