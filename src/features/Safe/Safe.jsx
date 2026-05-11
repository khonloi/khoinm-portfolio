import React, { useState } from 'react';
import Dialog from '../../components/Dialog';
import winSafeIcon from '../../assets/icons/Microsoft Windows 3 Safe.ico';
import Input from '../../components/Input';

const Safe = ({ onClose }) => {
  const [password, setPassword] = useState('');

  const secretPassword = import.meta.env.VITE_EASTER_EGG_PASSWORD;
  const easterEggUrl = import.meta.env.VITE_EASTER_EGG_URL;

  const handleUnlock = () => {
    if (password === secretPassword) {
      window.open(easterEggUrl, "_blank", "noopener,noreferrer");
      onClose();
    } else {
      alert("Incorrect password");
    }
  };

  const messageContent = (
    <div className="flex flex-col gap-2 font-main text-black text-lg">
      <div>Please enter the password to unlock the safe:</div>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-[200px] h-8 px-2 font-roboto text-sm"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleUnlock();
        }}
      />
    </div>
  );

  return (
    <Dialog
      isVisible={true}
      title="Safe"
      message={messageContent}
      showIcon={false}
      buttons={[
        { label: 'Unlock', onClick: handleUnlock },
        { label: 'Cancel', onClick: onClose }
      ]}
      onClose={onClose}
    />
  );
};

export default Safe;
