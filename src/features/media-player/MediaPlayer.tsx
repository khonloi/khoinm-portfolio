import React, { useCallback, memo } from "react";
import Button from "../../components/Button";
import treeIcon from "../../assets/icons/tree.ico";
import { useYouTubePlayer } from "./hooks/useYouTubePlayer";
import { useNativeMedia } from "./hooks/useNativeMedia";

import playIcon from "../../assets/icons/music/play.svg";
import pauseIcon from "../../assets/icons/music/pause.svg";
import stopIcon from "../../assets/icons/music/stop.svg";
import prevIcon from "../../assets/icons/music/prev.svg";
import nextIcon from "../../assets/icons/music/next.svg";
import ejectIcon from "../../assets/icons/music/eject.svg";

export interface MediaPlayerProps {
  id?: string;
  fileContent?: string | null;
  crop43?: boolean;
}

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const MediaPlayer = memo<MediaPlayerProps>(({ id, fileContent, crop43 }) => {
  const yt = useYouTubePlayer({ id, url: fileContent });
  const native = useNativeMedia({ initialSrc: fileContent });

  const isYoutube = yt.isYoutube;
  const isPlaying = isYoutube ? yt.isPlaying : native.isPlaying;
  const currentTime = isYoutube ? yt.currentTime : native.currentTime;
  const duration = isYoutube ? yt.duration : native.duration;
  const mediaSrc = isYoutube ? fileContent : native.mediaSrc;

  const togglePlay = useCallback(() => {
    if (isYoutube) {
      yt.togglePlay();
    } else {
      native.togglePlay();
    }
  }, [isYoutube, yt, native]);

  const stopMedia = useCallback(() => {
    if (isYoutube) {
      yt.stop();
    } else {
      native.stop();
    }
  }, [isYoutube, yt, native]);

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(e.target.value);
      if (isYoutube) {
        yt.seek(time);
      } else {
        native.seek(time);
      }
    },
    [isYoutube, yt, native]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      native.handleFileChange(e, () => {
        yt.resetPlayer();
      });
    },
    [native, yt]
  );

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
            crop43
              ? "absolute w-[133.33%] h-full top-0 left-[-16.66%]"
              : "w-full h-full"
          }
        />
      );
    }

    return (
      <video
        ref={native.mediaRef}
        src={mediaSrc}
        onTimeUpdate={native.handleTimeUpdate}
        onLoadedMetadata={native.handleLoadedMetadata}
        onClick={togglePlay}
        className={`w-full h-full ${crop43 ? "object-cover" : "object-contain"}`}
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
              onClick={yt.prev}
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
              onClick={yt.next}
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
              onClick={native.handleImport}
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
              aria-label="Seek slider"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="win-range-slider"
            />

            <div className="flex items-center gap-2 font-bold text-windows-black whitespace-nowrap font-number shrink-0 justify-end text-md tabular-nums">
              <span className="text-right w-[4.5ch] inline-block">{formatTime(currentTime)}</span>
              <span className="shrink-0">/</span>
              <span className="text-left w-[4.5ch] inline-block">{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <input
          type="file"
          ref={native.fileInputRef}
          onChange={handleFileChange}
          accept="video/*,audio/*"
          aria-label="Upload media file"
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
});

MediaPlayer.displayName = "MediaPlayer";
export default MediaPlayer;
