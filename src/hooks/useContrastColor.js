// src/hooks/useContrastColor.js
import { useState, useEffect, useRef } from 'react';

// Function to calculate relative luminance
const getRelativeLuminance = (r, g, b) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Function to calculate contrast ratio
const getContrastRatio = (luminance1, luminance2) => {
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05);
};

// Function to get background color of an element
const getBackgroundColor = (element) => {
  if (!element) return null;
  
  const style = window.getComputedStyle(element);
  let backgroundColor = style.backgroundColor;
  
  // If background is transparent, check parent elements
  if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      const parentStyle = window.getComputedStyle(parent);
      const parentBg = parentStyle.backgroundColor;
      if (parentBg !== 'rgba(0, 0, 0, 0)' && parentBg !== 'transparent') {
        backgroundColor = parentBg;
        break;
      }
      parent = parent.parentElement;
    }
  }
  
  return backgroundColor;
};

// Function to parse RGB values from CSS color
const parseRGB = (colorString) => {
  if (!colorString) return null;
  
  // Handle rgba format
  const rgbaMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1]),
      g: parseInt(rgbaMatch[2]),
      b: parseInt(rgbaMatch[3])
    };
  }
  
  // Handle hex format
  const hexMatch = colorString.match(/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/);
  if (hexMatch) {
    return {
      r: parseInt(hexMatch[1], 16),
      g: parseInt(hexMatch[2], 16),
      b: parseInt(hexMatch[3], 16)
    };
  }
  
  return null;
};

// Function to determine best text color
const determineTextColor = (backgroundColor) => {
  const rgb = parseRGB(backgroundColor);
  if (!rgb) return 'var(--windows-white)'; // Default fallback
  
  const bgLuminance = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
  
  // Calculate contrast ratios with white and black text
  const whiteLuminance = getRelativeLuminance(255, 255, 255);
  const blackLuminance = getRelativeLuminance(0, 0, 0);
  
  const whiteContrast = getContrastRatio(bgLuminance, whiteLuminance);
  const blackContrast = getContrastRatio(bgLuminance, blackLuminance);
  
  // Use the color with better contrast ratio
  // WCAG AA standard requires contrast ratio of at least 4.5:1 for normal text
  if (whiteContrast >= blackContrast && whiteContrast >= 4.5) {
    return 'var(--windows-white)';
  } else if (blackContrast >= 4.5) {
    return 'var(--windows-black)';
  } else {
    // If neither meets the standard, use the one with better contrast
    return whiteContrast >= blackContrast ? 'var(--windows-white)' : 'var(--windows-black)';
  }
};

export const useContrastColor = (elementRef) => {
  const [textColor, setTextColor] = useState('var(--windows-white)');
  const observerRef = useRef(null);

  useEffect(() => {
    if (!elementRef?.current) return;

    const updateTextColor = () => {
      const backgroundColor = getBackgroundColor(elementRef.current);
      const newTextColor = determineTextColor(backgroundColor);
      setTextColor(newTextColor);
    };

    // Initial check
    updateTextColor();

    // Set up observer to watch for style changes
    if (window.ResizeObserver) {
      observerRef.current = new ResizeObserver(() => {
        updateTextColor();
      });
      observerRef.current.observe(elementRef.current);
    }

    // Also listen for window resize and scroll events
    const handleResize = () => {
      setTimeout(updateTextColor, 100); // Small delay to ensure styles are updated
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateTextColor);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateTextColor);
    };
  }, [elementRef]);

  return textColor;
}; 