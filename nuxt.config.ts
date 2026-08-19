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

  // Deploy target: Cloudflare Pages.
  // @nuxt/content auto-detects this preset and switches its database
  // to Cloudflare D1 (binding name `DB`) - no manual database config needed,
  // see node_modules/@nuxt/content/dist/module.mjs setupNitro() for the
  // Cloudflare preset it applies automatically.
  nitro: {
    preset: 'cloudflare-pages',
  },

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