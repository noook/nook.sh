import { Configuration } from '@nuxt/types/config';
import getAge from './hooks/age';

const description = `Hello !

My name is Neil Richter and I'm a ${getAge()} years old Full-stack Developer based in Paris. I describe myself as a curious person who loves coding, and the web platform. Currently, I am working at a company called Beamy as Fullstack Typescript Developer.
`;

const config: Configuration = {
  server: {
    host: '0.0.0.0',
    port: 5678,
  },
  /*
  ** Headers of the page
  */
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    title: 'Neil Richter | Front-End Engineer',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: description },
      { name: 'theme-color', content: '#ef5e76' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://nook.sh/' },
      { property: 'og:title', content: 'Neil Richter | Front-End Engineer' },
      { property: 'og:description', content: description },
      { property: 'og:image', content: 'https://i.nook.sh/pp-banner.jpg' },

      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:url', content: 'https://nook.sh' },
      { property: 'twitter:title', content: 'Neil Richter | Front-End Engineer' },
      { property: 'twitter:description', content: description },
      { property: 'twitter:image', content: 'https://i.nook.sh/pp-banner.jpg' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/global.css',
    '~/assets/css/tailwind.css',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/fontawesome',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/composition-api/module',
    '@nuxt/postcss8',
    '@nuxtjs/fontawesome',
    'nuxt-typed-vuex',
    ['@nuxtjs/google-analytics', {
      id: 'UA-166494693-1',
    }],
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
  ],
  typescript: {
    typeCheck: true,
    ignoreNotFoundWarnings: true,
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  build: {
    transpile: [
      /typed-vuex/,
    ],
    extractCSS: true,
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },

  fontawesome: {
    component: 'fa',
  },
};

export default config;
