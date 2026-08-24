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
    },
  },

  plugins: [],
};
