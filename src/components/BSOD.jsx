import React, { useState, useEffect, useCallback, useRef } from 'react';

const generateErrorCode = () => {
  const hex = (size) => Math.floor(Math.random() * Math.pow(16, size)).toString(16).toUpperCase().padStart(size, '0');
  return `${hex(2)} : ${hex(4)} : ${hex(8)}`;
};

const BSOD = ({ onClose }) => {
  const [stage, setStage] = useState('black'); // 'black' -> 'bsod'
  const [errorCode] = useState(generateErrorCode());
  const lastTapRef = useRef(0);

  useEffect(() => {
    // Stage 1: Brief black screen
    const timer = setTimeout(() => {
      setStage('bsod');
    }, 1000); // 1 second black screen

    const handleInteraction = () => {
      const now = Date.now();
      const isDoubleTap = now - lastTapRef.current < 600;
      lastTapRef.current = now;

      if (isDoubleTap) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleInteraction);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [onClose]);

  if (stage === 'black') {
    return <div className="fixed w-screen h-dvh z-[999999] flex items-center justify-center font-terminal cursor-none bg-windows-black" />;
  }

  return (
    <div className="fixed w-screen h-dvh z-[999999] flex items-center justify-center font-terminal cursor-none bg-[#ad0056] text-white p-8 text-base sm:text-xl">
      <div className="w-full max-w-[43rem]">
        <div className="flex justify-center">
          <span className="bg-windows-grey text-[#ad0056] py-0.5 px-3 font-bold text-lg sm:text-xl tracking-wide mb-5">Haiyami</span>
        </div>

        <div className="[&_p]:leading-relaxed [&_p]:my-4">
          <p>An error has occurred. To continue:</p>

          <p>Press Esc or double-tap to return to Haiyami, or</p>

          <p>
            Press CTRL+R or Reset button to restart your browser.
          </p>

          <p> If you do this, you will lose any unsaved information in all open applications.</p>

          <p className="uppercase">Error: {errorCode}</p>

          <div className="flex justify-center mt-5">
            <p>Press Esc or double-tap to continue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BSOD;
