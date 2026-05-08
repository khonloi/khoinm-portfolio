import { useState, useCallback, useRef } from 'react';
import emailjs from '@emailjs/browser';
import dingSound from '../features/Message/ding.mp3';
import chordSound from '../features/Message/chord.mp3';

// Validation constants
const VALIDATION_RULES = {
  name: {
    min: 2,
    max: 50,
    errorMessages: {
      tooShort: 'Name must be at least 2 characters long.',
      tooLong: 'Name must not exceed 50 characters.',
    },
  },
  email: {
    max: 100,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessages: {
      invalid: 'Please enter a valid email address.',
      tooLong: 'Email must not exceed 100 characters.',
    },
  },
  message: {
    min: 10,
    max: 500,
    errorMessages: {
      tooShort: 'Message must be at least 10 characters long.',
      tooLong: 'Message must not exceed 500 characters.',
    },
  },
};

const playSound = (soundFile) => {
  const sound = new Audio(soundFile);
  return sound.play().catch((error) => {
    console.error('Error playing sound:', error);
  });
};

// Validation function extractor
const validateField = (fieldName, value) => {
  const rules = VALIDATION_RULES[fieldName];
  if (!rules) return '';

  if (fieldName === 'name' || fieldName === 'message') {
    if (value.length < rules.min) {
      return rules.errorMessages.tooShort;
    }
    if (value.length > rules.max) {
      return rules.errorMessages.tooLong;
    }
  }

  if (fieldName === 'email') {
    if (!rules.pattern.test(value)) {
      return rules.errorMessages.invalid;
    }
    if (value.length > rules.max) {
      return rules.errorMessages.tooLong;
    }
  }

  return '';
};

export const useMessageForm = () => {
  const formRef = useRef();
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);

  // Validate all fields
  const validateForm = useCallback((formData) => {
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message),
    };

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.message;
  }, []);

  // Send email function
  const sendEmail = useCallback(
    async (e) => {
      e.preventDefault();

      if (!formRef.current) return;

      const formData = {
        name: formRef.current.user_name.value,
        email: formRef.current.user_email.value,
        message: formRef.current.message.value,
      };

      // Reset errors
      setErrors({ name: '', email: '', message: '' });

      // Validate form
      if (!validateForm(formData)) {
        await playSound(chordSound);
        return;
      }

      setIsSending(true);

      try {
        const emailData = {
          ...formData,
          user_email: formData.email,
          to_email: import.meta.env.VITE_EMAILJS_TO_EMAIL,
          time: new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
          }),
        };

        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          emailData,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        setStatus('Message sent successfully!');
        formRef.current.reset();
        await playSound(dingSound);
      } catch (error) {
        setStatus(`Failed to send message: ${error.text || error.message}`);
        await playSound(chordSound);
      } finally {
        setIsSending(false);
      }
    },
    [validateForm]
  );

  // Clear messages after timeout - returns cleanup function
  const clearMessages = useCallback(() => {
    const hasMessages = status || errors.name || errors.email || errors.message;
    if (!hasMessages) return undefined;
    
    const timer = setTimeout(() => {
      setStatus('');
      setErrors({ name: '', email: '', message: '' });
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [status, errors]);

  return {
    formRef,
    status,
    errors,
    isSending,
    sendEmail,
    clearMessages,
  };
};

