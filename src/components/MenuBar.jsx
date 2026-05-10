import React, { useState, useEffect } from "react";
import Dialog from "./Dialog";
import monitorMoonIcon from "../assets/icons/Microsoft Windows 3 Post-It.ico";
import keyGrayIcon from "../assets/icons/Microsoft Windows 3 Keys.ico";

const shutdownMessage = "Do you want to exit your session?";

const formatTime = (date) => {
  // Use 24-hour time format
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDate = (date) => {
  // Format as "Day Month" with ordinal suffix (e.g., "6th August")
  const day = date.getDate();
  const month = date.toLocaleDateString(undefined, { month: "long" });

  return `${day} ${month}`;
};

const MenuBar = ({ visible = true, onShutdown }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showShutdownDialog, setShowShutdownDialog] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const handleShutdownClick = () => {
    setShowShutdownDialog(true);
  };

  const handleCloseShutdownDialog = () => {
    setShowShutdownDialog(false);
  };

  return (
    <>
      <div className={`fixed top-0 left-0 flex h-9 w-full bg-windows-grey border-b-2 border-windows-white ${!visible ? "hidden" : ""}`}>
        <div className="flex flex-1 items-center justify-start">
          {/* Left side menu items could go here */}
        </div>
        <div className="flex">
          <div className="flex min-w-[180px] items-center justify-center gap-2 whitespace-nowrap text-windows-black" title="Current date and time">
            {formatDate(currentTime)} 1996 &nbsp; {formatTime(currentTime)}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <button
            className="flex h-[26px] w-[26px] cursor-pointer items-center justify-center border-none bg-transparent m-0 mr-2 p-0 font-bold text-windows-black select-none"
            title="Power"
            onClick={handleShutdownClick}
          >
            <img src={keyGrayIcon} alt="Power Icon" className="h-6 object-contain" />
          </button>
        </div>
      </div>
      <Dialog
        id="shutdown-dialog"
        isVisible={showShutdownDialog}
        title="Exit Session"
        message={shutdownMessage}
        icon={monitorMoonIcon}
        onClose={handleCloseShutdownDialog}
        buttons={[
          {
            label: "Yes",
            onClick: () => {
              handleCloseShutdownDialog();
              onShutdown?.();
            },
          },
          {
            label: "No",
            onClick: handleCloseShutdownDialog,
          },
        ]}
      />
    </>
  );
};

export default MenuBar;