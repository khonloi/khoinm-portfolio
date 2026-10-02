import { useContext } from 'react';
import { DesktopContext } from './DesktopContext';

export const useDesktopContext = () => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktopContext must be used within a DesktopProvider');
  }
  return context;
};

export default useDesktopContext;
