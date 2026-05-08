/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'windows-grey': '#c0c0c0',
        'windows-white': '#ffffff',
        'windows-black': '#000000',
        'windows-grey-dark': '#808080',
        'windows-grey-light': '#dfdfdf',
        'windows-grey-shade-1': '#e0e0e0',
        'windows-blue': '#0575d8',
        'windows-blue-bright': '#316ac5',
        'windows-yellow': '#f9f1a5',
        'windows-teal': '#3a9cc6',
        'windows-purple': '#b26b93',
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
