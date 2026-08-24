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
