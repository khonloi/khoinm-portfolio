import { useState, useCallback, useRef } from 'react';
import emailjs from '@emailjs/browser';
import dingSound from './ding.mp3';
import chordSound from './chord.mp3';

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

export interface MessageFormData {
  name: string;
  email: string;
  message: string;
}

export interface MessageFormElement extends HTMLFormElement {
  user_name: HTMLInputElement;
  user_email: HTMLInputElement;
  message: HTMLTextAreaElement;
}

const playSound = (soundFile: string) => {
  const sound = new Audio(soundFile);
  return sound.play().catch((error) => {
    console.error('Error playing sound:', error);
  });
};

// Validation function extractor
const validateField = (fieldName: 'name' | 'email' | 'message', value: string) => {
  const rules = VALIDATION_RULES[fieldName];
  if (!rules) return '';

  let validationValue = value;
  if (fieldName === 'message') {
    // Strip HTML tags for length validation so formatting doesn't eat the limit
    validationValue = value.replace(/<[^>]*>/g, '');
  }

  if (fieldName === 'name' || fieldName === 'message') {
    const textRule = VALIDATION_RULES[fieldName];
    if (validationValue.length < textRule.min) {
      return textRule.errorMessages.tooShort;
    }
    if (validationValue.length > textRule.max) {
      return textRule.errorMessages.tooLong;
    }
  }

  if (fieldName === 'email') {
    const pattern = VALIDATION_RULES.email.pattern;
    const max = VALIDATION_RULES.email.max;
    if (!pattern.test(value)) {
      return VALIDATION_RULES.email.errorMessages.invalid;
    }
    if (value.length > max) {
      return VALIDATION_RULES.email.errorMessages.tooLong;
    }
  }

  return '';
};

export const useMessageForm = () => {
  const formRef = useRef<MessageFormElement | null>(null);
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);

  // Validate all fields
  const validateForm = useCallback((formData: MessageFormData) => {
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
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formRef.current) return;

      const formData: MessageFormData = {
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
      } catch (error: any) {
        setStatus(`Failed to send message: ${error?.text || error?.message || String(error)}`);
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

