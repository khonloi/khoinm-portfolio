import type React from 'react';

const audioCache = new Map<string, HTMLAudioElement>();

export interface PlaySoundOptions {
  volume?: number;
  preventDuplicate?: boolean;
  audioRef?: React.MutableRefObject<HTMLAudioElement | null> | { current: HTMLAudioElement | null } | null;
}

/**
 * Play a sound file with caching and fallback support.
 * @param soundType - The name of the sound file (without extension)
 * @param options - Optional configuration
 */
export const playSound = async (soundType: string, options: PlaySoundOptions = {}): Promise<void> => {
  const { volume = 0.7, preventDuplicate = false, audioRef = null } = options;
  const baseUrl = import.meta.env.BASE_URL || '/';

  if (preventDuplicate && audioRef && audioRef.current && !audioRef.current.ended && !audioRef.current.paused) {
    return;
  }

  let audio = audioCache.get(soundType);

  if (!audio) {
    audio = new Audio();
    audio.src = `${baseUrl}sounds/${soundType}.mp3`;
    audioCache.set(soundType, audio);
  }

  // Clone or reset audio to allow overlapping plays or restarts
  try {
    const playAudio = audio.cloneNode() as HTMLAudioElement;
    playAudio.volume = volume;

    if (audioRef) {
      audioRef.current = playAudio;
    }

    // Cleanup memory when finished
    playAudio.addEventListener('ended', () => {
      if (audioRef && audioRef.current === playAudio) {
        audioRef.current = null;
      }
      playAudio.remove();
    }, { once: true });

    const playPromise = playAudio.play();

    if (playPromise !== undefined) {
      await playPromise;
    }
  } catch (error) {
    console.warn(`Failed to play cached sound ${soundType}:`, error);

    // Manual fallback attempt if cache/clone failed
    try {
      const fallbackAudio = new Audio(`/sounds/${soundType}.mp3`);
      fallbackAudio.volume = volume;
      await fallbackAudio.play();
    } catch {
      console.error(`Sound ${soundType} failed all playback attempts`);
    }
  }
};
