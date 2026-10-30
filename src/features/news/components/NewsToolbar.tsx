import React, { memo } from 'react';
import Button from '../../../components/Button';
import treeIcon from '../../../assets/icons/tree.ico';

export interface NewsToolbarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onStop: () => void;
  onRefresh: () => void;
  onGoHome: () => void;
}

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ForwardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const StopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const NewsToolbar = memo<NewsToolbarProps>(({
  canGoBack,
  canGoForward,
  isLoading,
  onGoBack,
  onGoForward,
  onStop,
  onRefresh,
  onGoHome,
}) => {
  return (
    <div className="flex items-center bg-windows-grey border-b-2 border-windows-grey-dark p-2 flex-shrink-0">
      <div className="flex items-center gap-0.5">
        <Button
          variant="control"
          onClick={onGoBack}
          disabled={!canGoBack || isLoading}
          title="Back"
          ariaLabel="Back"
        >
          <BackIcon />
        </Button>
        <Button
          variant="control"
          onClick={onGoForward}
          disabled={!canGoForward || isLoading}
          title="Forward"
          ariaLabel="Forward"
        >
          <ForwardIcon />
        </Button>
        <Button
          variant="control"
          onClick={onStop}
          disabled={!isLoading}
          title="Stop"
          ariaLabel="Stop"
        >
          <StopIcon />
        </Button>
        <Button
          variant="control"
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh"
          ariaLabel="Refresh"
        >
          <RefreshIcon />
        </Button>
        <Button
          variant="control"
          onClick={onGoHome}
          disabled={isLoading}
          title="Home"
          ariaLabel="Home"
        >
          <HomeIcon />
        </Button>
      </div>

      <div className="flex-1" />

      {/* Tree Icon logo box */}
      <div className="flex items-center justify-center w-8 h-8 bg-black border border-windows-grey-dark">
        <img src={treeIcon} alt="" className="w-6 h-6 object-contain" />
      </div>
    </div>
  );
});

NewsToolbar.displayName = 'NewsToolbar';
export default NewsToolbar;

