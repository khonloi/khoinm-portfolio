// Import cursor files as assets
import defaultArrow from '../assets/cursors/default_arrow.cur?url';
import defaultLink from '../assets/cursors/default_link.cur?url';
import defaultWait from '../assets/cursors/default_wait.cur?url';
import defaultBusy from '../assets/cursors/default_busy.cur?url';

// Export cursor URLs
export const cursors = {
  arrow: defaultArrow,
  link: defaultLink,
  wait: defaultWait,
  busy: defaultBusy,
};

// Set CSS custom properties for cursors
export const setCursorVariables = () => {
  const root = document.documentElement;
  root.style.setProperty('--cursor-arrow', `url(${defaultArrow}), auto`);
  root.style.setProperty('--cursor-link', `url(${defaultLink}), pointer`);
  root.style.setProperty('--cursor-wait', `url(${defaultWait}), wait`);
  root.style.setProperty('--cursor-busy', `url(${defaultBusy}), wait`);

  // Kick off preloading immediately
  preloadCursors();
};

// Preload cursor files to prevent flickers
export const preloadCursors = () => {
  Object.values(cursors).forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

// Get cursor style value
export const getCursorStyle = (type = 'arrow') => {
  return cursors[type]
    ? `url(${cursors[type]}), ${type === 'link' ? 'pointer' : type === 'wait' || type === 'busy' ? 'wait' : 'auto'}`
    : 'auto';
};
