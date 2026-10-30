import React, { useState, useEffect } from 'react';

interface BSODProps {
  onClose: () => void;
}

const generateErrorCode = () => {
  const hex = (size: number) => Math.floor(Math.random() * Math.pow(16, size)).toString(16).toUpperCase().padStart(size, '0');
  return `${hex(2)} : ${hex(4)} : ${hex(8)}`;
};

const BSOD: React.FC<BSODProps> = ({ onClose }) => {
  const [stage, setStage] = useState<'black' | 'bsod'>('black'); // 'black' -> 'bsod'
  const [errorCode] = useState(generateErrorCode());

  useEffect(() => {
    // Stage 1: Brief black screen
    const timer = setTimeout(() => {
      setStage('bsod');
    }, 1000); // 1 second black screen

    const handleInteraction = () => {
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleInteraction);
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
          <span className="bg-windows-grey text-[#ad0056] py-0.5 px-3 font-bold text-lg sm:text-xl tracking-wide mb-5">Pane</span>
        </div>

        <div className="[&_p]:leading-relaxed [&_p]:my-4">
          <p>An error has occurred. To continue:</p>

          <p>Press Esc, Enter, or click anywhere to return to Pane.</p>

          <p className="uppercase">Error: {errorCode}</p>

          <div className="flex justify-center mt-5">
            <p>Press Esc or click to continue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BSOD;
