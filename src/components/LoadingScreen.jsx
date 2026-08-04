import { useState, useEffect, useRef, useMemo } from "react";
import LayeredBox from "./LayeredBox";
import { getCursorStyle } from "../data/cursors";
import startupCard from "../assets/images/startup-card-1.webp";
import kaisonLogo from "../assets/images/KAISON.svg";

// Static configuration and utility functions
const BOOT_LINES = [
  "  EmailJS ...............  4.4.1  ",
  "  PortableText ........... 6.0.3  ",
  "  Sanity Client .......... 7.21.0 ",
  "  React .................. 19.1.0 ",
  "  React DOM .............. 19.1.0 ",
  "  React Markdown ......... 10.1.0 ",
  "  Remark GFM ............. 4.0.1  ",
  "",
  "Starting Pane 3.1 ... ",
];


const BOOT_DELAYS = [850, 650, 1200, 750, 900, 550, 1000, 600, 800];

const getPlatformInfo = () => ({
  cpuLine: "IMS 8386P4 CPU at 100MHz",
});

// Stage constants for better readability
const LOADING_STAGES = {
  LOGO: 1,
  LOGO_TO_BOOT_TRANSITION: 2,
  BOOT_SEQUENCE: 3,
  FINAL_TRANSITION: 4,
  CARD_DISPLAY: 5,
};

const SHUTDOWN_STAGES = {
  CARD_DISPLAY: 1,
  TRANSITION: 2,
  TERMINAL: 3,
};

const LoadingScreen = ({
  mode = "loading",
  progress: initialProgress = 0,
  onSkip,
}) => {
  const [stage, setStage] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [showRestartMessage, setShowRestartMessage] = useState(false);

  const lastTapRef = useRef(0);
  const timeoutsRef = useRef([]);

  const addTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  // Image preloading, global cursor management, and safe area buffer visibility
  useEffect(() => {
    const img = new Image();
    img.onload = img.onerror = () => setImageLoaded(true);
    img.src = startupCard;

    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = "none";

    return () => {
      document.body.style.cursor = originalCursor || getCursorStyle("arrow");
      document.documentElement.classList.remove("boot-screen-active");
      clearTimeouts();
    };
  }, []);



  // Sequence sequences handler
  useEffect(() => {
    clearTimeouts();
    setStage(1);
    setShowRestartMessage(false);

    if (mode === "loading") {
      const { cpuLine } = getPlatformInfo();
      setDisplayedLines([
        "V8 JavaScript Engine v12.4 - An Energy Star Ally",
        "Copyright (C) 1984-2026 Kaison Computer Co, LTD",
        "",
        "Version 67VNRU0D",
        "", cpuLine,
      ]);


      const interval = setInterval(() => setShowCursor(c => !c), 150);

      const sequence = async () => {
        // Logo screen stage (1)
        await new Promise(r => addTimeout(r, 3000));

        // Brief black screen transition (2)
        setStage(LOADING_STAGES.LOGO_TO_BOOT_TRANSITION);

        await new Promise(r => addTimeout(r, 500));

        setStage(LOADING_STAGES.BOOT_SEQUENCE);

        // Memory Test Animation
        const targetMem = 32767;
        const duration = 3000; // 3 seconds
        const startTime = Date.now();

        const memLineIndex = 6; // Index after cpuLine

        setDisplayedLines(prev => [...prev, "Memory Test: 0 KB"]);

        while (true) {
          const elapsed = Date.now() - startTime;
          const currentMem = Math.min(targetMem, Math.floor((elapsed / duration) * targetMem));

          setDisplayedLines(prev => {
            const next = [...prev];
            next[memLineIndex] = `Memory Test: ${currentMem} KB `;
            return next;
          });

          if (elapsed >= duration) break;
          await new Promise(r => addTimeout(r, 40)); // ~25fps update
        }

        setDisplayedLines(prev => {
          const next = [...prev];
          next[memLineIndex] = `Memory Test: ${targetMem} KB OK `;
          return next;
        });

        await new Promise(r => addTimeout(r, 800));
        setDisplayedLines(prev => [...prev, "", "Running dependency verification "]);
        await new Promise(r => addTimeout(r, 1000));



        // Boot line sequence
        for (let i = 0; i < BOOT_LINES.length; i++) {
          await new Promise(r => addTimeout(r, BOOT_DELAYS[i]));
          setDisplayedLines(prev => [...prev, BOOT_LINES[i]]);

          // Add [OK] with a small delay for lines that aren't empty or the final starting message
          // Add [OK] with a small delay for lines that aren't empty or the final starting message
          if (BOOT_LINES[i].trim() && i < 7) {
            await new Promise(r => addTimeout(r, 400));
            setDisplayedLines(prev => {
              const next = [...prev];
              next[next.length - 1] = next[next.length - 1] + "[OK] ";
              return next;
            });
          }

          // Play beep when "Starting Pane 3.1" is displayed (last line)
          if (i === BOOT_LINES.length - 1) {
            const beep = new Audio("/sounds/beep.wav");
            beep.play().catch(e => console.warn("Beep failed:", e));
          }
        }

        await new Promise(r => addTimeout(r, 2500));
        setStage(LOADING_STAGES.FINAL_TRANSITION);
        await new Promise(r => addTimeout(r, 1500));
        setStage(LOADING_STAGES.CARD_DISPLAY);
      };


      sequence();
      return () => {
        clearInterval(interval);
        clearTimeouts();
      }
    } else {
      // Shutdown sequence
      setDisplayedLines(["You can now close this browser tab "]);
      addTimeout(() => {
        setStage(SHUTDOWN_STAGES.TRANSITION);
        addTimeout(() => {
          setStage(SHUTDOWN_STAGES.TERMINAL);
          addTimeout(() => setShowRestartMessage(true), 1000);
        }, 1500);
      }, 10000);
    }
  }, [mode]);

  // Event handlers
  useEffect(() => {
    const onKey = (e) => {
      if (mode === "loading" && e.key === "Escape") onSkip?.();
      if (mode === "shutdown" && e.key === "Enter" && stage === SHUTDOWN_STAGES.TERMINAL) window.location.reload();
    };
    const onTouch = () => {
      const now = Date.now();
      const isDoubleTap = now - lastTapRef.current < 600;
      lastTapRef.current = now;

      if (!isDoubleTap) return;

      if (mode === "loading") {
        onSkip?.();
      } else if (mode === "shutdown" && stage === SHUTDOWN_STAGES.TERMINAL) {
        window.location.reload();
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouch);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouch);
    };
  }, [mode, onSkip, stage]);

  // Derived state for rendering
  const isLogoUI = useMemo(() => mode === "loading" && stage === LOADING_STAGES.LOGO, [mode, stage]);
  const isBootUI = useMemo(() => (mode === "loading" && stage === LOADING_STAGES.BOOT_SEQUENCE) || (mode === "shutdown" && stage === SHUTDOWN_STAGES.TERMINAL), [mode, stage]);
  const isTransitionUI = useMemo(() => mode === "loading" && stage === LOADING_STAGES.LOGO_TO_BOOT_TRANSITION, [mode, stage]);
  const isTerminalUI = useMemo(() => isLogoUI || isBootUI || isTransitionUI, [isLogoUI, isBootUI, isTransitionUI]);
  const isCardUI = useMemo(() => (mode === "loading" && stage === LOADING_STAGES.CARD_DISPLAY) || (mode === "shutdown" && stage === SHUTDOWN_STAGES.CARD_DISPLAY), [mode, stage]);

  // Manage mobile safe area buffer visibility class based on UI stage
  useEffect(() => {
    // Include the boot/logo UI, transitions, and the black screen shown while the card image loads
    const shouldBeBlack = isTerminalUI ||
      stage === LOADING_STAGES.FINAL_TRANSITION ||
      (mode === "shutdown" && stage === SHUTDOWN_STAGES.TRANSITION) ||
      (isCardUI && !imageLoaded);

    if (shouldBeBlack) {
      document.documentElement.classList.add("boot-screen-active");
    } else {
      document.documentElement.classList.remove("boot-screen-active");
    }
  }, [isTerminalUI, stage, isCardUI, imageLoaded, mode]);

  const statusText = mode === "loading" ? "Starting up" : "Shutting down";
  const displayedProgress = stage < LOADING_STAGES.CARD_DISPLAY ? 0 : initialProgress;

  if ((mode === "loading" && stage === LOADING_STAGES.FINAL_TRANSITION) ||
    (mode === "shutdown" && stage === SHUTDOWN_STAGES.TRANSITION) ||
    (mode === "loading" && isCardUI && !imageLoaded)) {
    return <div className="fixed top-0 left-0 flex items-center justify-center h-[calc(100dvh-var(--safe-bottom-buffer,0px))] w-screen overflow-hidden z-[9999] cursor-none bg-black p-2.5 sm:p-4"><div className="text-white w-full h-full whitespace-pre-wrap text-xl leading-snug font-bold relative" /></div>;
  }

  return (
    <div className={`fixed top-0 left-0 flex items-center justify-center h-[calc(100dvh-var(--safe-bottom-buffer,0px))] w-screen overflow-hidden z-[9999] cursor-none ${isTerminalUI ? 'bg-black p-2.5 sm:p-4' : ''}`}>
      {isTerminalUI ? (
        <div className="text-white w-full h-full whitespace-pre-wrap sm:text-xl sm:leading-relaxed font-bold relative">
          {isLogoUI && (
            <div className="w-full h-full flex justify-center items-center relative">
              <div className="max-w-[80%] flex justify-center items-center">
                <img src={kaisonLogo} alt="KAISON" className="w-full max-w-[600px] h-auto" />
              </div>
            </div>
          )}

          {isBootUI && (
            displayedLines.map((line, i) => (
              <div key={i} className="font-terminal font-medium min-h-[1em] text-base mb-1 sm:text-xl sm:mb-0">
                {line}
                {i === displayedLines.length - 1 && mode === "loading" && (
                  <span className={`${showCursor ? "opacity-100 font-bold" : "opacity-0"}`}>_</span>
                )}
              </div>
            ))
          )}

          {mode === "loading" && stage <= LOADING_STAGES.BOOT_SEQUENCE && (
            <div className="font-terminal font-medium min-h-[1em] text-base sm:text-xl absolute bottom-0 m-0">Press ESC or double-tap to skip the boot screen</div>
          )}

          {showRestartMessage && (
            <div className="font-terminal font-medium min-h-[1em] text-base mb-1 sm:text-xl sm:mb-0 absolute bottom-0 m-0">Press Enter or double-tap to restart</div>
          )}
        </div>
      ) : (
        <div className="bg-windows-black p-[2px] w-[350px] h-[250px] trim-window-corners">
          <div className="h-full relative bg-windows-grey trim-corners">
            <div className="h-full flex flex-col border-t-2 border-l-2 border-windows-white p-1 pr-1.5 pb-1.5 z-10">
              <div className="h-full flex flex-col border-2 border-windows-black bg-white overflow-hidden">
                <div className="flex-1 overflow-hidden">
                  <img src={startupCard} alt="" className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex flex-row items-center justify-center gap-4 h-[70px] shrink-0">
                  <p className="m-0 text-lg text-windows-black whitespace-nowrap shrink-0">{statusText}</p>
                  {mode === "loading" && (
                    <LayeredBox
                      variant="inward"
                      bgColor="#ffffff"
                      parentBgColor="#ffffff"
                      className="w-[10.5rem] h-[22px] shrink-0"
                    >
                      <div className="h-full bg-windows-teal" style={{ width: `${displayedProgress}%` }} />
                    </LayeredBox>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none border-r-2 border-b-2 border-windows-grey-dark z-20" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
