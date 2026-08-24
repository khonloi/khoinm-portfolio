import { ICON_MAP } from './iconImports';
const {
  winBriefcaseIcon, winCalculatorIcon, winCalendarIcon, winClockIcon,
  winCompressionIcon, winComputerIcon, winDocumentsIcon, winFileManagerIcon,
  winFolderInternetExplorerIcon, winFolderIcon, winFolderLinksysIcon,
  winInternationalIcon, treeIcon, winMediaPlayerIcon, winMonaLisaIcon,
  winNewspaperIcon, winPostitIcon, winBinderIcon, winFolderOpenDocumentIcon,
  winPaintToolsIcon, winClipbookViewerIcon, winSoundRecorderIcon,
  winReversiIcon, winSafeIcon, winScheduleIcon, winFaxMachineIcon,
  winCompactDiscIcon
} = ICON_MAP;

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
