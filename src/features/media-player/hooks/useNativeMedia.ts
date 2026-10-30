import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseNativeMediaProps {
  initialSrc?: string | null;
  onImportTrigger?: () => void;
}

export const useNativeMedia = ({ initialSrc }: UseNativeMediaProps = {}) => {
  const [mediaSrc, setMediaSrc] = useState<string | null>(initialSrc || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const mediaRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync initialSrc when prop changes
  useEffect(() => {
    if (initialSrc) {
      setMediaSrc(initialSrc);
    }
  }, [initialSrc]);

  // Cleanup blob URL on unmount or URL replacement
  useEffect(() => {
    return () => {
      if (mediaSrc && mediaSrc.startsWith('blob:')) {
        URL.revokeObjectURL(mediaSrc);
      }
    };
  }, [mediaSrc]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, onFileImported?: () => void) => {
      const file = e.target.files?.[0];
      if (file) {
        if (mediaSrc && mediaSrc.startsWith('blob:')) {
          URL.revokeObjectURL(mediaSrc);
        }
        const url = URL.createObjectURL(file);
        setMediaSrc(url);
        setIsPlaying(false);
        setCurrentTime(0);
        onFileImported?.();
      }
    },
    [mediaSrc]
  );

  const togglePlay = useCallback(() => {
    if (!mediaRef.current) return;
    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const stop = useCallback(() => {
    if (mediaRef.current) {
      mediaRef.current.pause();
      mediaRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  return {
    mediaSrc,
    setMediaSrc,
    isPlaying,
    currentTime,
    duration,
    mediaRef,
    fileInputRef,
    handleImport,
    handleFileChange,
    togglePlay,
    stop,
    seek,
    handleTimeUpdate,
    handleLoadedMetadata,
  };
};

