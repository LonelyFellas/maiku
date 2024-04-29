/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      textColor: {
        primary: '#5b7cfd',
        text_primary: '#5b7cfd',
        text_secondary: '#1e4dff',
        title: '#2c406c',
      },
      backgroundColor: {
        bg_secondary: '#1e4dff',
        bg_primary: '#d3e3fd',
      },
      borderColor: {
        border_primary: '#5b7cfd',
        border_secondary: '#1e4dff',
        border_info: '#adbeff',
      },
    },
  },
  variants: {
    extend: {
      fill: ['group-hover'],
    },
  },
  plugins: [],
};
