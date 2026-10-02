import React, { useState } from 'react';
import Dialog from '../../components/Dialog';

import Input from '../../components/Input';

export interface SafeProps {
  onClose?: () => void;
}

const Safe: React.FC<SafeProps> = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const secretPassword = import.meta.env.VITE_EASTER_EGG_PASSWORD;
  const easterEggUrl = import.meta.env.VITE_EASTER_EGG_URL;

  const handleUnlock = () => {
    if (password === secretPassword) {
      window.open(easterEggUrl, "_blank", "noopener,noreferrer");
      onClose?.();
    } else {
      setErrorMessage("Incorrect password. Try again.");
      setPassword('');
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
      {errorMessage && (
        <div className="text-red-600 text-sm mt-1">{errorMessage}</div>
      )}
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
        { label: 'Cancel', onClick: () => onClose?.() }
      ]}
      onClose={onClose}
    />
  );
};

export default Safe;
