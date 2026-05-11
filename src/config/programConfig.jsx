import React, { lazy, Suspense } from "react";
import Dialog from "../components/Dialog";

// Import your icons
import gashIcon from "../assets/icons/GASH.ico";
import winApplicationsIcon from "../assets/icons/Microsoft Windows 3 Applications.ico";
import winArrowDownIcon from "../assets/icons/Microsoft Windows 3 Arrow Down.ico";
import winArrowLeftIcon from "../assets/icons/Microsoft Windows 3 Arrow Left.ico";
import winArrowRightIcon from "../assets/icons/Microsoft Windows 3 Arrow Right.ico";
import winArrowUpIcon from "../assets/icons/Microsoft Windows 3 Arrow Up.ico";
import winBarGraphIcon from "../assets/icons/Microsoft Windows 3 Bar Graph.ico";
import winBinderIcon from "../assets/icons/Microsoft Windows 3 Binder.ico";
import winBriefcaseIcon from "../assets/icons/Microsoft Windows 3 Briefcase.ico";
import winCalculatorIcon from "../assets/icons/Microsoft Windows 3 Calculator.ico";
import winCalendarIcon from "../assets/icons/Microsoft Windows 3 Calendar.ico";
import winCameraIcon from "../assets/icons/Microsoft Windows 3 Camera.ico";
import winCardfileIcon from "../assets/icons/Microsoft Windows 3 Cardfile.ico";
import winCassetteIcon from "../assets/icons/Microsoft Windows 3 Cassette.ico";
import winCharacterMapIcon from "../assets/icons/Microsoft Windows 3 Character Map.ico";
import winChatIcon from "../assets/icons/Microsoft Windows 3 Chat.ico";
import winClipbookViewerIcon from "../assets/icons/Microsoft Windows 3 ClipBook Viewer.ico";
import winClipboardViewerIcon from "../assets/icons/Microsoft Windows 3 Clipboard Viewer.ico";
import winClockIcon from "../assets/icons/Microsoft Windows 3 Clock.ico";
import winColorIcon from "../assets/icons/Microsoft Windows 3 Color.ico";
import winCompactDiscIcon from "../assets/icons/Microsoft Windows 3 Compact Disc.ico";
import winComposeIcon from "../assets/icons/Microsoft Windows 3 Compose.ico";
import winCompressionIcon from "../assets/icons/Microsoft Windows 3 Compression.ico";
import winComputerIcon from "../assets/icons/Microsoft Windows 3 Computer.ico";
import winControlPanelIcon from "../assets/icons/Microsoft Windows 3 Control Panel.ico";
import winDllSetupIcon from "../assets/icons/Microsoft Windows 3 DLL Setup.ico";
import winDllIcon from "../assets/icons/Microsoft Windows 3 DLL.ico";
import winDataTransferIcon from "../assets/icons/Microsoft Windows 3 Data Transfer.ico";
import winDesktopIcon from "../assets/icons/Microsoft Windows 3 Desktop.ico";
import winDirectorIcon from "../assets/icons/Microsoft Windows 3 Director.ico";
import winDocumentsIcon from "../assets/icons/Microsoft Windows 3 Documents.ico";
import winDriversIcon from "../assets/icons/Microsoft Windows 3 Drivers.ico";
import winEmailReplyIcon from "../assets/icons/Microsoft Windows 3 E-mail Reply.ico";
import winEducationIcon from "../assets/icons/Microsoft Windows 3 Education.ico";
import winFaxMachineIcon from "../assets/icons/Microsoft Windows 3 Fax Machine.ico";
import winFileManagerIcon from "../assets/icons/Microsoft Windows 3 File Manager.ico";
import winFloppyDisksIcon from "../assets/icons/Microsoft Windows 3 Floppy Disks.ico";
import winFloppyDriveIcon from "../assets/icons/Microsoft Windows 3 Floppy Drive.ico";
import winFolderCookiesIcon from "../assets/icons/Microsoft Windows 3 Folder Cookies.ico";
import winFolderInternetExplorerIcon from "../assets/icons/Microsoft Windows 3 Folder Internet Explorer.ico";
import winFolderLinksysIcon from "../assets/icons/Microsoft Windows 3 Folder Linksys.ico";
import winFolderLinsysIcon from "../assets/icons/Microsoft Windows 3 Folder Linsys.ico";
import winFolderOpenDocumentIcon from "../assets/icons/Microsoft Windows 3 Folder Open Document.ico";
import winFolderOpenIcon from "../assets/icons/Microsoft Windows 3 Folder Open.ico";
import winFolderRefreshIcon from "../assets/icons/Microsoft Windows 3 Folder Refresh.ico";
import winFolderIcon from "../assets/icons/Microsoft Windows 3 Folder.ico";
import winFoxIcon from "../assets/icons/Microsoft Windows 3 Fox.ico";
import winHandPointingLeftIcon from "../assets/icons/Microsoft Windows 3 Hand Pointing Left.ico";
import winHandPointingRightIcon from "../assets/icons/Microsoft Windows 3 Hand Pointing Right.ico";
import winHandIcon from "../assets/icons/Microsoft Windows 3 Hand.ico";
import winInternationalIcon from "../assets/icons/Microsoft Windows 3 International.ico";
import winKeyboardIcon from "../assets/icons/Microsoft Windows 3 Keyboard.ico";
import winKeysIcon from "../assets/icons/Microsoft Windows 3 Keys.ico";
import winLineChartDataIcon from "../assets/icons/Microsoft Windows 3 Line Chart Data.ico";
import winLineGraphIcon from "../assets/icons/Microsoft Windows 3 Line Graph.ico";
import winLocalAreaNetworkIcon from "../assets/icons/Microsoft Windows 3 Local Area Network.ico";
import winLogoIcon from "../assets/icons/Microsoft Windows 3 Logo.ico";
import winMsdosPromptIcon from "../assets/icons/Microsoft Windows 3 MS-DOS Prompt.ico";
import winMailIcon from "../assets/icons/Microsoft Windows 3 Mail.ico";
import winMailboxIcon from "../assets/icons/Microsoft Windows 3 Mailbox.ico";
import winManillaEnvelopeIcon from "../assets/icons/Microsoft Windows 3 Manilla Envelope.ico";
import winMediaPlayerIcon from "../assets/icons/Microsoft Windows 3 Media Player.ico";
import winMinesweeperIcon from "../assets/icons/Microsoft Windows 3 Minesweeper.ico";
import winMonaLisaIcon from "../assets/icons/Microsoft Windows 3 Mona Lisa.ico";
import winMouseIcon from "../assets/icons/Microsoft Windows 3 Mouse.ico";
import winNewspaperIcon from "../assets/icons/Microsoft Windows 3 Newspaper.ico";
import winNotepadIcon from "../assets/icons/Microsoft Windows 3 Notepad.ico";
import winObjectPackagerIcon from "../assets/icons/Microsoft Windows 3 Object Packager.ico";
import winPaintToolsIcon from "../assets/icons/Microsoft Windows 3 Paint Tools.ico";
import winPhoneDialIcon from "../assets/icons/Microsoft Windows 3 Phone Dial.ico";
import winPlannerIcon from "../assets/icons/Microsoft Windows 3 Planner.ico";
import winPortsIcon from "../assets/icons/Microsoft Windows 3 Ports.ico";
import winPostitIcon from "../assets/icons/Microsoft Windows 3 Post-It.ico";
import winPrintManagerIcon from "../assets/icons/Microsoft Windows 3 Print Manager.ico";
import winReadMeIcon from "../assets/icons/Microsoft Windows 3 Read Me.ico";
import winRecorderIcon from "../assets/icons/Microsoft Windows 3 Recorder.ico";
import winRegistryEditIcon from "../assets/icons/Microsoft Windows 3 Registry Edit.ico";
import winRemoteAccessIcon from "../assets/icons/Microsoft Windows 3 Remote Access.ico";
import winReversiIcon from "../assets/icons/Microsoft Windows 3 Reversi.ico";
import winSafeIcon from "../assets/icons/Microsoft Windows 3 Safe.ico";
import winScheduleIcon from "../assets/icons/Microsoft Windows 3 Schedule.ico";
import winServerIcon from "../assets/icons/Microsoft Windows 3 Server.ico";
import winSetupIcon from "../assets/icons/Microsoft Windows 3 Setup.ico";
import winShortcutIcon from "../assets/icons/Microsoft Windows 3 Shortcut.ico";
import winSolitaireIcon from "../assets/icons/Microsoft Windows 3 Solitaire.ico";
import winSoundRecorderIcon from "../assets/icons/Microsoft Windows 3 Sound Recorder.ico";
import winSoundIcon from "../assets/icons/Microsoft Windows 3 Sound.ico";
import winSwissArmyKnifeIcon from "../assets/icons/Microsoft Windows 3 Swiss Army Knife.ico";
import winTerminalIcon from "../assets/icons/Microsoft Windows 3 Terminal.ico";
import winToolsIcon from "../assets/icons/Microsoft Windows 3 Tools.ico";
import winTypewriterIcon from "../assets/icons/Microsoft Windows 3 Typewriter.ico";
import winWasteBasketEmptyIcon from "../assets/icons/Microsoft Windows 3 Waste Basket Empty.ico";
import winWasteBasketFullIcon from "../assets/icons/Microsoft Windows 3 Waste Basket Full.ico";
import winWindowBlankIcon from "../assets/icons/Microsoft Windows 3 Window Blank.ico";
import winWindowExcelIcon from "../assets/icons/Microsoft Windows 3 Window Excel.ico";
import winWindowMsdosIcon from "../assets/icons/Microsoft Windows 3 Window MS-DOS.ico";
import winWindowModemIcon from "../assets/icons/Microsoft Windows 3 Window Modem.ico";
import winWindowWordIcon from "../assets/icons/Microsoft Windows 3 Window Word.ico";
import winWordpadIcon from "../assets/icons/Microsoft Windows 3 Wordpad.ico";
import treeIcon from "../assets/icons/Tree.ico";

export const ICON_MAP = {
  winBriefcaseIcon,
  winCalculatorIcon,
  winCalendarIcon,
  winCameraIcon,
  winCardfileIcon,
  winCassetteIcon,
  winCompactDiscIcon,
  winClockIcon,
  winCompressionIcon,
  winComputerIcon,
  winDllIcon,
  winDocumentsIcon,
  winFaxMachineIcon,
  winFileManagerIcon,
  winFolderInternetExplorerIcon,
  winFolderIcon,
  winFolderLinksysIcon,
  winFoxIcon,
  gashIcon,
  winInternationalIcon,
  treeIcon,
  winMediaPlayerIcon,
  winMonaLisaIcon,
  winNewspaperIcon,
  winPostitIcon,
  winBinderIcon,
  winFolderOpenDocumentIcon,
  winPaintToolsIcon,
  winClipbookViewerIcon,
  winSoundRecorderIcon,
  winReversiIcon,
  winSafeIcon,
  winScheduleIcon,
  winSetupIcon,
  winApplicationsIcon,
  winArrowDownIcon,
  winArrowLeftIcon,
  winArrowRightIcon,
  winArrowUpIcon,
  winBarGraphIcon,
  winCharacterMapIcon,
  winChatIcon,
  winClipboardViewerIcon,
  winColorIcon,
  winComposeIcon,
  winControlPanelIcon,
  winDataTransferIcon,
  winDesktopIcon,
  winDirectorIcon,
  winDllSetupIcon,
  winDriversIcon,
  winEducationIcon,
  winEmailReplyIcon,
  winFloppyDisksIcon,
  winFloppyDriveIcon,
  winFolderCookiesIcon,
  winFolderLinsysIcon,
  winFolderOpenIcon,
  winFolderRefreshIcon,
  winHandIcon,
  winHandPointingLeftIcon,
  winHandPointingRightIcon,
  winKeyboardIcon,
  winKeysIcon,
  winLineChartDataIcon,
  winLineGraphIcon,
  winLocalAreaNetworkIcon,
  winLogoIcon,
  winMailIcon,
  winMailboxIcon,
  winManillaEnvelopeIcon,
  winMinesweeperIcon,
  winMouseIcon,
  winMsdosPromptIcon,
  winNotepadIcon,
  winObjectPackagerIcon,
  winPhoneDialIcon,
  winPlannerIcon,
  winPortsIcon,
  winPrintManagerIcon,
  winReadMeIcon,
  winRecorderIcon,
  winRegistryEditIcon,
  winRemoteAccessIcon,
  winServerIcon,
  winShortcutIcon,
  winSolitaireIcon,
  winSoundIcon,
  winSwissArmyKnifeIcon,
  winTerminalIcon,
  winToolsIcon,
  winTypewriterIcon,
  winWasteBasketEmptyIcon,
  winWasteBasketFullIcon,
  winWindowBlankIcon,
  winWindowExcelIcon,
  winWindowModemIcon,
  winWindowMsdosIcon,
  winWindowWordIcon,
  winWordpadIcon,
};

// Unified desktop items configuration
export const desktopItems = [
  {
    id: "about",
    label: "My Information",
    iconSrc: winComputerIcon,
    type: "icon",
    isMaximizable: false,
    position: "left",
  },
  {
    id: "certificates",
    label: "My Certificates",
    iconSrc: winFolderOpenDocumentIcon,
    type: "folder",
    position: "left",
    contents: [
      { id: "loading_certs", label: "Loading CMS data", iconSrc: winDocumentsIcon, type: "icon" }
    ],
  },
  {
    id: "projects",
    label: "My Projects",
    iconSrc: winBriefcaseIcon,
    type: "folder",
    position: "left",
    contents: [
      { id: "loading_projects", label: "Loading CMS data", iconSrc: treeIcon, type: "icon" }
    ],
  },
  {
    id: "message",
    label: "Message Me",
    iconSrc: winFaxMachineIcon,
    type: "icon",
    isMaximizable: false,
    position: "left",
  },
  {
    id: "internet",
    label: "News",
    iconSrc: winNewspaperIcon,
    type: "icon",
    isMaximizable: true,
    position: "left",
  },
  {
    id: "welcome",
    label: "Welcome to Pane",
    iconSrc: winPostitIcon,
    type: "icon",
    isMaximizable: false,
    startup: true,
    position: "left",
  },
  {
    id: "onlineAccounts",
    label: "Online Accounts",
    iconSrc: winFolderInternetExplorerIcon,
    type: "folder",
    position: "right",
    contents: [
      { id: "loading_accounts", label: "Loading CMS data", iconSrc: winBriefcaseIcon, type: "icon" }
    ],
  },
  {
    id: "programs",
    label: "Programs",
    iconSrc: winFolderLinksysIcon,
    type: "folder",
    position: "right",
    contents: [
      {
        id: "calculator",
        label: "Calculator",
        iconSrc: winCalculatorIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "calendar",
        label: "Calendar",
        iconSrc: winCalendarIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "camera",
        label: "Camera",
        iconSrc: winCameraIcon,
        type: "icon",
        isMaximizable: false,
        isMaximized: true,
      },
      {
        id: "clock",
        label: "Clock",
        iconSrc: winClockIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "compressor",
        label: "Compressor",
        iconSrc: winCompressionIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "fileManager",
        label: "File Manager",
        iconSrc: winFileManagerIcon,
        type: "icon",
        isMaximizable: true,
      },
      {
        id: "internet",
        label: "Internet",
        iconSrc: winInternationalIcon,
        type: "icon",
        isMaximizable: true,
      },
      {
        id: "notebook",
        label: "Notebook",
        iconSrc: winBinderIcon,
        type: "icon",
        isMaximizable: true,
      },
      {
        id: "photoviewer",
        label: "Photo",
        iconSrc: winMonaLisaIcon,
        type: "icon",
        isMaximizable: true,
      },
      {
        id: "paint",
        label: "Paint",
        iconSrc: winPaintToolsIcon,
        type: "icon",
        isMaximizable: true,
        isFullScreen: true,
      },
      {
        id: "planner",
        label: "Planner",
        iconSrc: winClipbookViewerIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "recorder",
        label: "Recorder",
        iconSrc: winSoundRecorderIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "safe",
        label: "Safe",
        iconSrc: winSafeIcon,
        type: "icon",
        isMaximizable: false,
        isDialog: true,
      },
      {
        id: "scheduler",
        label: "Scheduler",
        iconSrc: winScheduleIcon,
        type: "icon",
        isMaximizable: false,
      },
      {
        id: "media",
        label: "Media Player",
        iconSrc: winMediaPlayerIcon,
        type: "icon",
        isMaximizable: true,
      },
    ],
  },
  {
    id: "games",
    label: "Games",
    iconSrc: winFolderIcon,
    type: "folder",
    position: "right",
    contents: [
      {
        id: "line98",
        label: "Line 98",
        type: "icon",
        iconSrc: winReversiIcon,
        isMaximizable: false,
      },
    ],
  },
  {
    id: "stuff",
    label: "Random Stuff",
    iconSrc: winFolderIcon,
    type: "folder",
    position: "right",
    contents: [
      { id: "loading_stuff", label: "Loading CMS data", iconSrc: winFolderIcon, type: "icon" }
    ],
  },
  {
    id: "cddrive",
    label: "CD Drive",
    iconSrc: winCompactDiscIcon,
    type: "icon",
    filetype: "vid",
    fileContent: "https://www.youtube.com/watch?v=JlFFdhXYwxo&list=PLAGMKTzSFy3v-qvn9juYtbU08SagyosLp",
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
const Standby = lazy(() => import("../features/Standby/Standby"));



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

