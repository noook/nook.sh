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

  // Deploy target: Cloudflare Workers (unified Workers+static-assets, the
  // current default Cloudflare recommends for new projects - not classic
  // "Pages"). @nuxt/content auto-detects any `cloudflare*` preset and
  // switches its database to Cloudflare D1 (binding name `DB`) regardless
  // of which cloudflare preset is used - no manual database config needed,
  // see node_modules/@nuxt/content/dist/module.mjs setupNitro().
  nitro: {
    preset: 'cloudflare-module',
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