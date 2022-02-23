/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** DEFAULT: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/DEFAULTConfig.stub.js
*/
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      width: {
        44: '11rem',
      },
      zIndex: {
        '-10': -10,
      },
      colors: {
        accent: '#ef5e76',
        white: '#ffffff',
        yellow: '#FFD600',
        link: {
          DEFAULT: '#00B0FF',
          contrast: '#005780',
        },
        black: '#000000',
        lightgray: '#F1F6F8',
        content: {
          lighter: '#78909C',
          DEFAULT: '#37474F',
        },
      },
    },
  },
  variants: {},
  plugins: [],
};
