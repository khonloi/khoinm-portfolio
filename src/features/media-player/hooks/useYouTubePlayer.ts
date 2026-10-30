import { useState, useRef, useEffect, useCallback } from 'react';

export interface YTPlayer {
  destroy: () => void;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime?: () => number;
  getDuration?: () => number;
  nextVideo?: () => void;
  previousVideo?: () => void;
}

export interface YTPlayerOptions {
  height: string | number;
  width: string | number;
  videoId: string | null;
  playerVars?: Record<string, string | number | boolean>;
  events?: {
    onReady?: (event: { target: { getDuration: () => number } }) => void;
    onStateChange?: (event: { target: { getDuration: () => number }; data: number }) => void;
  };
}

export interface YTNamespace {
  Player: new (elementId: string, options: YTPlayerOptions) => YTPlayer;
  PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface UseYouTubePlayerProps {
  id?: string;
  url?: string | null;
}

export const getYouTubeParams = (url: string | null | undefined) => {
  if (!url) return { videoId: null, playlistId: null };
  try {
    const videoMatch =
      url.match(/[?&]v=([^#&?]+)/) ||
      url.match(/youtu\.be\/([^#&?]+)/) ||
      url.match(/embed\/([^#&?]+)/);
    const listMatch = url.match(/[?&]list=([^#&?]+)/);

    return {
      videoId: videoMatch ? videoMatch[1] : null,
      playlistId: listMatch ? listMatch[1] : null,
    };
  } catch {
    return { videoId: null, playlistId: null };
  }
};

export const useYouTubePlayer = ({ id, url }: UseYouTubePlayerProps) => {
  const [isYoutube, setIsYoutube] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load YouTube IFrame API script once if not loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const initializeYTPlayer = useCallback(
    (videoId: string | null, playlistId: string | null) => {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // ignore
        }
      }

      const onPlayerReady = (event: { target: { getDuration: () => number } }) => {
        setDuration(event.target.getDuration());
      };

      const onPlayerStateChange = (event: { target: { getDuration: () => number }; data: number }) => {
        if (!window.YT) return;
        if (event.data === window.YT.PlayerState.PLAYING) {
          setIsPlaying(true);
          setDuration(event.target.getDuration());
        } else if (
          event.data === window.YT.PlayerState.PAUSED ||
          event.data === window.YT.PlayerState.ENDED
        ) {
          setIsPlaying(false);
        }
      };

      const playerVars: Record<string, string | number | boolean> = {
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        enablejsapi: 1,
        origin: window.location.origin,
      };

      if (playlistId) {
        playerVars.listType = 'playlist';
        playerVars.list = playlistId;
      }

      if (window.YT) {
        ytPlayerRef.current = new window.YT.Player(`yt-player-${id}`, {
          height: '100%',
          width: '100%',
          videoId,
          playerVars,
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      }
    },
    [id]
  );

  // Initialize YT when URL matches YouTube format
  useEffect(() => {
    let checkYT: ReturnType<typeof setInterval> | null = null;
    if (url) {
      const { videoId, playlistId } = getYouTubeParams(url);
      if (videoId || playlistId) {
        setIsYoutube(true);
        checkYT = setInterval(() => {
          if (window.YT && window.YT.Player) {
            if (checkYT) clearInterval(checkYT);
            initializeYTPlayer(videoId, playlistId);
          }
        }, 100);
      } else {
        setIsYoutube(false);
      }
    }

    return () => {
      if (checkYT) clearInterval(checkYT);
    };
  }, [id, url, initializeYTPlayer]);

  // Poll current time while playing
  useEffect(() => {
    if (isYoutube && isPlaying) {
      pollIntervalRef.current = setInterval(() => {
        if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
          setCurrentTime(ytPlayerRef.current.getCurrentTime());
          if (ytPlayerRef.current.getDuration) {
            setDuration(ytPlayerRef.current.getDuration());
          }
        }
      }, 500);
    } else {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [isYoutube, isPlaying]);

  // Teardown on unmount
  useEffect(() => {
    return () => {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // ignore
        }
        ytPlayerRef.current = null;
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (!ytPlayerRef.current) return;
    if (isPlaying) {
      ytPlayerRef.current.pauseVideo();
    } else {
      ytPlayerRef.current.playVideo();
    }
  }, [isPlaying]);

  const stop = useCallback(() => {
    if (ytPlayerRef.current) {
      ytPlayerRef.current.stopVideo();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  const next = useCallback(() => {
    if (ytPlayerRef.current && ytPlayerRef.current.nextVideo) {
      ytPlayerRef.current.nextVideo();
    }
  }, []);

  const prev = useCallback(() => {
    if (ytPlayerRef.current && ytPlayerRef.current.previousVideo) {
      ytPlayerRef.current.previousVideo();
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (ytPlayerRef.current) {
      ytPlayerRef.current.seekTo(time, true);
      setCurrentTime(time);
    }
  }, []);

  const resetPlayer = useCallback(() => {
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.destroy();
      } catch {
        // ignore
      }
      ytPlayerRef.current = null;
    }
    setIsYoutube(false);
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  return {
    isYoutube,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    stop,
    next,
    prev,
    seek,
    resetPlayer,
  };
};
