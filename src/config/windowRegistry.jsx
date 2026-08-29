
import React, { lazy } from "react";
import Dialog from "../components/Dialog";
import { ICON_MAP } from './iconImports';

const { winPostitIcon } = ICON_MAP;

// Lazy load components for better performance
const About = lazy(() => import("../features/about/About"));
const Welcome = lazy(() => import("../features/welcome/Welcome"));
const Message = lazy(() => import("../features/message/Message"));
const MediaPlayer = lazy(() => import("../features/media-player/MediaPlayer"));
const Line98 = lazy(() => import("../features/games/line98/Line98"));
const Safe = lazy(() => import("../features/safe/Safe"));
const News = lazy(() => import("../features/news/News"));
const MatrixRain = lazy(() => import("../features/matrix-rain/MatrixRain"));
const FragileWorld = lazy(() => import("../features/fragile-world/FragileWorld"));
const Notebook = lazy(() => import("../features/notebook/Notebook"));
const PhotoViewer = lazy(() => import("../features/photo-viewer/PhotoViewer"));
const Standby = lazy(() => import("../features/standby/Standby"));



// Window content registry for better maintainability and performance
const windowContentRegistry = {
  about: About,
  welcome: Welcome,
  message: Message,
  media: MediaPlayer,
  line98: Line98,
  safe: Safe,
  internet: News,
  matrix: MatrixRain,
  fragile: FragileWorld,
  notebook: Notebook,
  passwords: Notebook,
  diary: Notebook,
  secret_plan: Notebook,
  brdssn: Notebook,
  photoviewer: PhotoViewer,
  me_fancy: PhotoViewer,
  cat_meme: PhotoViewer,
  birthday_pic: PhotoViewer,
  fur1: PhotoViewer,
  fur2: PhotoViewer,
  vacation_media: MediaPlayer,
  birthday_media: MediaPlayer,
  furvid: MediaPlayer,
  muvid1: MediaPlayer,
  terminator: MediaPlayer,
  muvid2: MediaPlayer,
  furvid_2: MediaPlayer,
  song1: MediaPlayer,
  song2: MediaPlayer,
  muvid3: MediaPlayer,
  mv_clip1: MediaPlayer,
  mv_clip2: MediaPlayer,
  mv_clip3: MediaPlayer,
  cddrive: MediaPlayer,
  pixelart1: PhotoViewer,
  pixelart2: PhotoViewer,
  pixelart3: PhotoViewer,
  standby: Standby,
};

// Window content renderer function - optimized with registry lookup
export const renderWindowContent = (windowId, windowTitle, onClose, icon, onTriggerBSOD, winData = {}) => {
  // If filetype is provided, override the component mapping
  let Component = windowContentRegistry[windowId];

  if (winData.filetype === 'txt') Component = windowContentRegistry['notebook'];
  if (winData.filetype === 'img') Component = windowContentRegistry['photoviewer'];
  if (winData.filetype === 'vid') Component = windowContentRegistry['media'];

  if (Component) {
    return <Component onClose={onClose} id={windowId} {...winData} />;
  }

  // If the program is not implemented, there is a chance to BSOD
  const BSOD_CHANCE = 0.25;
  if (onTriggerBSOD && Math.random() < BSOD_CHANCE) {
    onTriggerBSOD();
    onClose();
    return null;
  }

  return (
    <Dialog
      isVisible={true}
      title={windowTitle}
      message="This program is currently being updated."
      icon={icon || winPostitIcon}
      buttons={[{ label: "OK", onClick: onClose }]}
      onClose={onClose}
    />
  );
};

