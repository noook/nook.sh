// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@vueuse/nuxt',
  ],

  devtools: { enabled: true },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',

  vite: {
    optimizeDeps: {
      include: ['tailwindcss/colors'],
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})