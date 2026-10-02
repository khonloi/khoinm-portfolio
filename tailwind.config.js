/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'windows-grey': 'var(--windows-grey)',
        'windows-white': 'var(--windows-white)',
        'windows-black': 'var(--windows-black)',
        'windows-grey-dark': 'var(--windows-grey-dark)',
        'windows-grey-light': 'var(--windows-grey-light)',
        'windows-grey-shade-1': 'var(--windows-grey-shade-1)',
        'windows-blue': 'var(--windows-blue)',
        'windows-blue-bright': 'var(--windows-blue-bright)',
        'windows-yellow': 'var(--windows-yellow)',
        'windows-teal': 'var(--windows-teal)',
        'windows-purple': 'var(--windows-purple)',
      },
      fontFamily: {
        main: ['W95FA', 'MS Sans Serif', 'Tahoma', 'sans-serif'],
        button: ['Pixel Operator', 'MS Sans Serif', 'Tahoma', 'sans-serif'],
        terminal: ['Modern DOS', 'MS Sans Serif', 'Tahoma', 'sans-serif'],
        number: ['BlockCraft', 'MS Sans Serif', 'Tahoma', 'sans-serif'],
      },
      keyframes: {
        'flash-label': {
          '0%, 49.9%': { color: '#000000', backgroundColor: '#f9f1a5' },
          '50%, 100%': { color: '#ffffff', backgroundColor: 'transparent' },
        },
      },
      animation: {
        flash: 'flash-label 0.125s steps(1) infinite',
      },
      cursor: {
        'win-arrow': 'var(--cursor-arrow)',
        'win-link': 'var(--cursor-link)',
        'win-wait': 'var(--cursor-wait)',
        'win-busy': 'var(--cursor-busy)',
      },
      boxShadow: {
        'win-outset': 'inset 1.5px 1.5px var(--windows-white), inset -1.5px -1.5px var(--windows-grey-dark)',
        'win-inset': 'inset 1.5px 1.5px var(--windows-grey-dark), inset -1.5px -1.5px var(--windows-white)',
        'win-window': 'inset 1px 1px var(--windows-white), inset -1px -1px var(--windows-grey-dark), inset 2px 2px var(--windows-grey-light), inset -2px -2px var(--windows-black)',
      },
      zIndex: {
        window: '1000',
        taskbar: '10000',
        modal: '90000',
        zoom: '99999',
        overlay: '100000',
        'mobile-buffer': '100001',
      },
    },
  },

  plugins: [],
};
