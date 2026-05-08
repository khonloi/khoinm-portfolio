import React, { lazy, Suspense } from "react";
import Dialog from "../components/Dialog";

// Import your icons
import logoIcon from "../assets/icons/Tree.ico";
import cardIcon from "../assets/icons/Microsoft Windows 3 Cardfile.ico";
import folderIcon from "../assets/icons/Microsoft Windows 3 Folder.ico";
import notebookIcon from "../assets/icons/Microsoft Windows 3 Binder.ico";
import calculatorIcon from "../assets/icons/Microsoft Windows 3 Calculator.ico";
import calendarIcon from "../assets/icons/Microsoft Windows 3 Calendar.ico";
import clockIcon from "../assets/icons/Microsoft Windows 3 Clock.ico";
import monaLisaIcon from "../assets/icons/Microsoft Windows 3 Mona Lisa.ico";
import mediaIcon from "../assets/icons/Microsoft Windows 3 Media Player.ico";
import newsIcon from "../assets/icons/Microsoft Windows 3 Newspaper.ico";
import internetIcon from "../assets/icons/Microsoft Windows 3 International.ico";
import cameraIcon from "../assets/icons/Microsoft Windows 3 Camera.ico";
import paintIcon from "../assets/icons/Microsoft Windows 3 Paint Tools.ico";
import briefcaseIcon from "../assets/icons/Microsoft Windows 3 Briefcase.ico";
import computerIcon from "../assets/icons/Microsoft Windows 3 Computer.ico";
import faxIcon from "../assets/icons/Microsoft Windows 3 Fax Machine.ico";
import docIcon from "../assets/icons/Microsoft Windows 3 Documents.ico";
import noteIcon from "../assets/icons/Microsoft Windows 3 Post-It.ico";
import cassetteIcon from "../assets/icons/Microsoft Windows 3 Cassette.ico";
import plannerIcon from "../assets/icons/Microsoft Windows 3 ClipBook Viewer.ico";
import compressorIcon from "../assets/icons/Microsoft Windows 3 Compression.ico";
import safeIcon from "../assets/icons/Microsoft Windows 3 Safe.ico";
import schedulerIcon from "../assets/icons/Microsoft Windows 3 Schedule.ico";
import recorderIcon from "../assets/icons/Microsoft Windows 3 Sound Recorder.ico";
import fileManagerIcon from "../assets/icons/Microsoft Windows 3 File Manager.ico";
import openDocIcon from "../assets/icons/Microsoft Windows 3 Folder Open Document.ico";
import dllIcon from "../assets/icons/Microsoft Windows 3 DLL.ico";
import setupIcon from "../assets/icons/Microsoft Windows 3 Setup.ico";
import folderLinksysIcon from "../assets/icons/Microsoft Windows 3 Folder Linksys.ico";
import folderIEIcon from "../assets/icons/Microsoft Windows 3 Folder Internet Explorer.ico";
import foxIcon from "../assets/icons/Microsoft Windows 3 Fox.ico";
import reversiIcon from "../assets/icons/Microsoft Windows 3 Reversi.ico";
import cdDriveIcon from "../assets/icons/Microsoft Windows 3 Compact Disc.ico";

export const ICON_MAP = {
  logoIcon,
  cardIcon,
  folderIcon,
  notebookIcon,
  calculatorIcon,
  calendarIcon,
  clockIcon,
  monaLisaIcon,
  mediaIcon,
  newsIcon,
  internetIcon,
  cameraIcon,
  paintIcon,
  briefcaseIcon,
  computerIcon,
  faxIcon,
  docIcon,
  noteIcon,
  cassetteIcon,
  plannerIcon,
  compressorIcon,
  safeIcon,
  schedulerIcon,
  recorderIcon,
  fileManagerIcon,
  openDocIcon,
  dllIcon,
  setupIcon,
  folderLinksysIcon,
  folderIEIcon,
  foxIcon,
  reversiIcon,
  cdDriveIcon,
};

// External web icons
const discordIcon = "https://preview.redd.it/discords-logo-v0-w1oj8uddc3671.png?auto=webp&s=1634c801affc83a90b787ad0d75c55496fbf6ded";
const facebookIcon = "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg";
const githubIcon = "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg";
const telegramIcon = "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg";
const zaloIcon = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1024px-Icon_of_Zalo.svg.png";
const gashIcon = "https://gash-frontend.vercel.app/assets/favicon-DWQAxs3C.ico";
const kuizuIcon = "https://kuizu-fe.vercel.app/vite.svg";

// Unified desktop items configuration
export const desktopItems = [
  {
    id: "about",
    label: "My Information",
    iconSrc: computerIcon,
    type: "icon",
    isMaximizable: false,
    position: "left",
  },
  {
    id: "certificates",
    label: "My Certificates",
    iconSrc: openDocIcon,
    type: "folder",
    position: "left",
    contents: [
      { id: "loading_certs", label: "Loading CMS data...", iconSrc: docIcon, type: "icon" }
    ],
  },
  {
    id: "projects",
    label: "My Projects",
    iconSrc: briefcaseIcon,
    type: "folder",
    position: "left",
    contents: [
      { id: "loading_projects", label: "Loading CMS data...", iconSrc: logoIcon, type: "icon" }
    ],
  },
  {
    id: "message",
    label: "Message Me",
    iconSrc: faxIcon,
    type: "icon",
    isMaximizable: false,
    position: "left",
  },
  {
    id: "internet",
    label: "News",
    iconSrc: newsIcon,
    type: "icon",
    isMaximizable: true,
    position: "left",
  },
  {
    id: "welcome",
    label: "Welcome to Hayami",
    iconSrc: noteIcon,
    type: "icon",
    isMaximizable: false,
    startup: true,
    position: "left",
  },
  {
    id: "onlineAccounts",
    label: "Online Accounts",
    iconSrc: folderIEIcon,
    type: "folder",
    position: "right",
    contents: [
      { id: "loading_accounts", label: "Loading CMS data...", iconSrc: briefcaseIcon, type: "icon" }
    ],
  },
  {
    id: "programs",
    label: "Programs",
    iconSrc: folderLinksysIcon,
    type: "folder",
    position: "right",
    contents: [
      {
        id: "calculator",
        label: "Calculator",
        iconSrc: calculatorIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "calendar",
        label: "Calendar",
        iconSrc: calendarIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "camera",
        label: "Camera",
        iconSrc: cameraIcon,
        type: "icon",
        isMaximizable: false,
        isMaximized: true,
      },
      {
        id: "clock",
        label: "Clock",
        iconSrc: clockIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "compressor",
        label: "Compressor",
        iconSrc: compressorIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "fileManager",
        label: "File Manager",
        iconSrc: fileManagerIcon,
        type: "icon",
        isMaximizable: true,
      },
      {
        id: "internet",
        label: "Internet",
        iconSrc: internetIcon,
        type: "icon",
        isMaximizable: true,
      },
      {
        id: "notebook",
        label: "Notebook",
        iconSrc: notebookIcon,
        type: "icon",
        isMaximizable: true,
      },
      {
        id: "photoviewer",
        label: "Photo",
        iconSrc: monaLisaIcon,
        type: "icon",
        isMaximizable: true,
      },
      {
        id: "paint",
        label: "Paint",
        iconSrc: paintIcon,
        type: "icon",
        isMaximizable: true,
        isFullScreen: true,
      },
      {
        id: "planner",
        label: "Planner",
        iconSrc: plannerIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "recorder",
        label: "Recorder",
        iconSrc: recorderIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "safe",
        label: "Safe",
        iconSrc: safeIcon,
        type: "icon",
        isMaximizable: false,
        isDialog: true,
      },
      {
        id: "scheduler",
        label: "Scheduler",
        iconSrc: schedulerIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "media",
        label: "Media Player",
        iconSrc: mediaIcon,
        type: "icon",
        isMaximizable: true,
      },
    ],
  },
  {
    id: "games",
    label: "Games",
    iconSrc: folderIcon,
    type: "folder",
    position: "right",
    contents: [
      {
        id: "line98",
        label: "Line 98",
        type: "icon",
        iconSrc: reversiIcon,
        isMaximizable: false,
      },
    ],
  },
  {
    id: "stuff",
    label: "Random Stuff",
    iconSrc: folderIcon,
    type: "folder",
    position: "right",
    contents: [
      { id: "loading_stuff", label: "Loading CMS data...", iconSrc: folderIcon, type: "icon" }
    ],
  },
  {
    id: "cddrive",
    label: "CD Drive",
    iconSrc: cdDriveIcon,
    type: "icon",
    isMaximizable: true,
    position: "right",
  },
];


// Lazy load components for better performance
const About = lazy(() => import("../features/About/About"));
const Welcome = lazy(() => import("../features/Welcome/Welcome"));
const Message = lazy(() => import("../features/Message/Message"));
const MediaPlayer = lazy(() => import("../features/MediaPlayer/MediaPlayer"));
const Line98 = lazy(() => import("../features/Games/Line98/Line98"));
const Pikachu = lazy(() => import("../features/Games/Pikachu/Pikachu"));
const MazeTest = lazy(() => import("../features/Games/MazeTest/MazeTest"));
const Camera = lazy(() => import("../features/Camera/Camera"));
const Safe = lazy(() => import("../features/Safe/Safe"));
const News = lazy(() => import("../features/News/News"));
const MatrixRain = lazy(() => import("../features/MatrixRain/MatrixRain"));
const FragileWorld = lazy(() => import("../features/FragileWorld/FragileWorld"));
const Notebook = lazy(() => import("../features/Notebook/Notebook"));
const PhotoViewer = lazy(() => import("../features/PhotoViewer/PhotoViewer"));


// Window content registry for better maintainability and performance
const windowContentRegistry = {
  about: About,
  welcome: Welcome,
  message: Message,
  media: MediaPlayer,
  line98: Line98,
  pikachu: Pikachu,
  mazetest: MazeTest,
  camera: Camera,
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
};

// Window content renderer function - optimized with registry lookup
export const renderWindowContent = (windowId, windowTitle, onClose, icon, onTriggerBSOD, winData = {}) => {
  // If filetype is provided, override the component mapping
  let Component = windowContentRegistry[windowId];

  if (winData.filetype === 'txt') Component = windowContentRegistry['notebook'];
  if (winData.filetype === 'img') Component = windowContentRegistry['photoviewer'];
  if (winData.filetype === 'vid') Component = windowContentRegistry['media'];

  if (Component) {
    return <Component onClose={onClose} id={windowId} fileContent={winData.fileContent} />;
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
      icon={icon || noteIcon}
      buttons={[{ label: "OK", onClick: onClose }]}
      onClose={onClose}
    />
  );
};

