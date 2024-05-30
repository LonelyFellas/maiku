/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
    },
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
      fontSize: {
        '12sm': '12px',
      },
    },
    fontFamily: {
      helvetica: ['Helvetica', 'Arial', 'sans-serif'],
      sc: ['PingFang SC', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
    },
  },
  variants: {
    extend: {
      fill: ['group-hover'],
    },
  },
  plugins: [],
};
