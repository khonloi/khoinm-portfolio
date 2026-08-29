import React, { useMemo } from "react";
import Dialog from "../../components/Dialog";

const MESSAGES = [
  "Who will dry your eyes\nWhen it falls apart?",
  "What makes this fragile world go 'round?",
  "Were you ever lost?",
  "It will take a while\nTo make you smile",
  "Somewhere in these eyes\nI'm on your side",
  "You wide-eyed girls\nYou get it right",
  "Was she ever found?",
];

const FragileWorld = ({ onClose }) => {
  const randomMessage = useMemo(() => {
    return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  }, []);

  return (
    <Dialog
      isVisible={true}
      title="FRAGILEWORLD"
      showOverlay={false}
      message={
        <div className="whitespace-pre-line text-center leading-relaxed font-main flex items-center justify-center">
          {randomMessage}
        </div>
      }
      showIcon={false}
      buttons={[{ label: "...", onClick: onClose }]}
      onClose={onClose}
    />
  );
};

export default FragileWorld;
