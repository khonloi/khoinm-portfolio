import React, { useState, useRef, useCallback, memo, useEffect } from "react";
import Button from "../../components/Button";
import treeIcon from "../../assets/icons/Tree.ico";
import { mediaFiles } from "../../data/media/content";
import { desktopItems } from "../../config/programConfig";

import playIcon from "../../assets/icons/music/play.svg";
import pauseIcon from "../../assets/icons/music/pause.svg";
import stopIcon from "../../assets/icons/music/stop.svg";
import prevIcon from "../../assets/icons/music/prev.svg";
import nextIcon from "../../assets/icons/music/next.svg";
import ejectIcon from "../../assets/icons/music/eject.svg";

const MediaPlayer = memo(({ id, fileContent }) => {
  const [mediaSrc, setMediaSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isYoutube, setIsYoutube] = useState(false);
  const mediaRef = useRef(null);
  const fileInputRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => { }, [id]); // Placeholder for logic below

  // Find program config
  const isCropped = (() => {
    const findItem = (items) => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.contents) {
          const found = findItem(item.contents);
          if (found) return found;
        }
      }
      return null;
    };
    const item = findItem(desktopItems);
    return item?.crop43;
  })();

  const getYouTubeParams = (url) => {
    if (!url) return { videoId: null, playlistId: null };
    try {
      // Handle the various YouTube URL formats
      const videoMatch = url.match(/[?&]v=([^#&?]+)/) || url.match(/youtu\.be\/([^#&?]+)/) || url.match(/embed\/([^#&?]+)/);
      const listMatch = url.match(/[?&]list=([^#&?]+)/);

      return {
        videoId: videoMatch ? videoMatch[1] : null,
        playlistId: listMatch ? listMatch[1] : null
      };
    } catch (e) {
      return { videoId: null, playlistId: null };
    }
  };

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const initializeYTPlayer = useCallback(
    (videoId, playlistId) => {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.destroy();
      }

      const onPlayerReady = (event) => {
        setDuration(event.target.getDuration());
      };

      const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
          setIsPlaying(true);
          // Update duration when track transitions in a playlist
          setDuration(event.target.getDuration());
        } else if (
          event.data === window.YT.PlayerState.PAUSED ||
          event.data === window.YT.PlayerState.ENDED
        ) {
          setIsPlaying(false);
        }
      };

      const playerVars = {
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        enablejsapi: 1,
        origin: window.location.origin,
      };

      if (playlistId) {
        playerVars.listType = "playlist";
        playerVars.list = playlistId;
      }

      ytPlayerRef.current = new window.YT.Player(`yt-player-${id}`, {
        height: "100%",
        width: "100%",
        videoId: videoId,
        playerVars,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    },
    [id]
  );

  useEffect(() => {
    const src = fileContent || (id && mediaFiles[id]);
    if (src) {
      const { videoId, playlistId } = getYouTubeParams(src);
      setMediaSrc(src);

      if (videoId || playlistId) {
        setIsYoutube(true);
        const checkYT = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkYT);
            initializeYTPlayer(videoId, playlistId);
          }
        }, 100);
      } else {
        setIsYoutube(false);
      }
    }
  }, [id, fileContent, initializeYTPlayer]);

  useEffect(() => {
    if (isYoutube && isPlaying) {
      pollIntervalRef.current = setInterval(() => {
        if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
          setCurrentTime(ytPlayerRef.current.getCurrentTime());
          // Sync duration for playlists as it changes between videos
          if (ytPlayerRef.current.getDuration) {
            setDuration(ytPlayerRef.current.getDuration());
          }
        }
      }, 500);
    } else {
      clearInterval(pollIntervalRef.current);
    }
    return () => clearInterval(pollIntervalRef.current);
  }, [isYoutube, isPlaying]);

  useEffect(() => {
    return () => {
      if (mediaSrc && mediaSrc.startsWith("blob:")) {
        URL.revokeObjectURL(mediaSrc);
      }
      if (ytPlayerRef.current) {
        ytPlayerRef.current.destroy();
      }
      clearInterval(pollIntervalRef.current);
    };
  }, [mediaSrc]);

  const handleImport = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaSrc(url);
      setIsYoutube(false);
      setIsPlaying(false);
      setCurrentTime(0);
      if (ytPlayerRef.current) {
        ytPlayerRef.current.destroy();
        ytPlayerRef.current = null;
      }
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isYoutube) {
      if (ytPlayerRef.current) {
        if (isPlaying) {
          ytPlayerRef.current.pauseVideo();
        } else {
          ytPlayerRef.current.playVideo();
        }
      }
      return;
    }

    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, isYoutube]);

  const stopMedia = useCallback(() => {
    if (isYoutube) {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.stopVideo();
        setIsPlaying(false);
        setCurrentTime(0);
      }
      return;
    }
    if (mediaRef.current) {
      mediaRef.current.pause();
      mediaRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [isYoutube]);

  const nextVideo = useCallback(() => {
    if (isYoutube && ytPlayerRef.current && ytPlayerRef.current.nextVideo) {
      ytPlayerRef.current.nextVideo();
    }
  }, [isYoutube]);

  const prevVideo = useCallback(() => {
    if (isYoutube && ytPlayerRef.current && ytPlayerRef.current.previousVideo) {
      ytPlayerRef.current.previousVideo();
    }
  }, [isYoutube]);

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

  const handleSeek = useCallback(
    (e) => {
      const time = parseFloat(e.target.value);
      if (isYoutube) {
        if (ytPlayerRef.current) {
          ytPlayerRef.current.seekTo(time, true);
          setCurrentTime(time);
        }
        return;
      }
      if (mediaRef.current) {
        mediaRef.current.currentTime = time;
        setCurrentTime(time);
      }
    },
    [isYoutube]
  );

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const renderDisplay = () => {
    if (!mediaSrc) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={treeIcon}
            alt="Default"
            className="w-[64px] h-[64px] image-pixelated"
          />
        </div>
      );
    }

    if (isYoutube) {
      return (
        <div
          id={`yt-player-${id}`}
          className={
            isCropped
              ? "absolute w-[133.33%] h-full top-0 left-[-16.66%]"
              : "w-full h-full"
          }
        ></div>
      );
    }

    return (
      <video
        ref={mediaRef}
        src={mediaSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        className={`w-full h-full ${isCropped ? "object-cover" : "object-contain"
          }`}
      />
    );
  };

  return (
    <div className="flex flex-col w-[36rem] max-w-full max-h-full bg-windows-grey p-0 [.maximized_&]:w-full [.maximized_&]:h-full">
      <div className="w-full aspect-[4/3] flex items-center justify-center bg-windows-black overflow-hidden relative [.maximized_&]:flex-1 [.maximized_&]:aspect-auto">
        <div className="w-full h-full max-w-full max-h-full flex items-center justify-center">
          {renderDisplay()}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-shrink-0 border-t-2 border-windows-white">
        <div className="flex flex-col-reverse md:flex-row items-center w-full gap-4 m-[2px]">
          {/* Controls */}
          <div className="flex gap-4 md:gap-[2px] flex-wrap justify-center md:justify-start">
            <Button
              variant="control"
              onClick={prevVideo}
              title="Previous"
              disabled={!isYoutube}
              className="w-10 h-10 md:w-8 md:h-8"
            >
              <img
                src={prevIcon}
                alt=""
                className="w-8 h-8 md:w-6 md:h-6 image-pixelated"
              />
            </Button>
            <Button
              variant="control"
              onClick={togglePlay}
              title={isPlaying ? "Pause" : "Play"}
              className="w-10 h-10 md:w-8 md:h-8"
            >
              <img
                src={isPlaying ? pauseIcon : playIcon}
                alt=""
                className="w-8 h-8 md:w-6 md:h-6 image-pixelated"
              />
            </Button>
            <Button
              variant="control"
              onClick={stopMedia}
              title="Stop"
              className="w-10 h-10 md:w-8 md:h-8"
            >
              <img
                src={stopIcon}
                alt=""
                className="w-8 h-8 md:w-6 md:h-6 image-pixelated"
              />
            </Button>
            <Button
              variant="control"
              onClick={nextVideo}
              title="Next"
              disabled={!isYoutube}
              className="w-10 h-10 md:w-8 md:h-8"
            >
              <img
                src={nextIcon}
                alt=""
                className="w-8 h-8 md:w-6 md:h-6 image-pixelated"
              />
            </Button>
            <Button
              variant="control"
              onClick={handleImport}
              title="Import"
              className="w-10 h-10 md:w-8 md:h-8"
            >
              <img
                src={ejectIcon}
                alt=""
                className="w-8 h-8 md:w-6 md:h-6 image-pixelated"
              />
            </Button>
          </div>

          {/* Seek and Timer Group */}
          <div className="flex items-center flex-1 w-full gap-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-8 cursor-pointer appearance-none bg-windows-grey
                                    [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:h-[14px] [&::-webkit-slider-runnable-track]:cursor-pointer [&::-webkit-slider-runnable-track]:bg-windows-grey [&::-webkit-slider-runnable-track]:border-[2px] [&::-webkit-slider-runnable-track]:border-inset [&::-webkit-slider-runnable-track]:border-windows-grey-dark
                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[28px] [&::-webkit-slider-thumb]:w-[12px] [&::-webkit-slider-thumb]:bg-windows-grey [&::-webkit-slider-thumb]:border-r-[2px] [&::-webkit-slider-thumb]:border-b-[2px] [&::-webkit-slider-thumb]:border-windows-grey-dark [&::-webkit-slider-thumb]:border-l-[2px] [&::-webkit-slider-thumb]:border-t-[2px] [&::-webkit-slider-thumb]:border-l-windows-white [&::-webkit-slider-thumb]:border-t-windows-white [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_black] [&::-webkit-slider-thumb]:mt-[-9px] [&::-webkit-slider-thumb]:cursor-pointer
                                    [&::-moz-range-track]:w-full [&::-moz-range-track]:h-[14px] [&::-moz-range-track]:cursor-pointer [&::-moz-range-track]:bg-windows-grey [&::-moz-range-track]:border-[1px] [&::-moz-range-track]:border-inset [&::-moz-range-track]:border-windows-grey-dark
                                    [&::-moz-range-thumb]:h-[28px] [&::-moz-range-thumb]:w-[12px] [&::-moz-range-thumb]:bg-windows-grey [&::-moz-range-thumb]:border-r-[2px] [&::-moz-range-thumb]:border-b-[2px] [&::-moz-range-thumb]:border-windows-grey-dark [&::-moz-range-thumb]:border-l-[2px] [&::-moz-range-thumb]:border-t-[2px] [&::-moz-range-thumb]:border-l-windows-white [&::-moz-range-thumb]:border-t-windows-white [&::-moz-range-thumb]:shadow-[0_0_0_1px_black] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-none"
            />

            <div className="flex items-center gap-2 font-bold text-windows-black whitespace-nowrap font-number shrink-0 justify-end text-md">
              <span className="text-right">{formatTime(currentTime)}</span>
              <span className="shrink-0">/</span>
              <span className="text-left">{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="video/*,audio/*"
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
});

MediaPlayer.displayName = "MediaPlayer";

export default MediaPlayer;
