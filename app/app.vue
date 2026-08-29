<script setup lang="ts">
import colors from 'tailwindcss/colors'

const colorMode = useColorMode()
const appConfig = useAppConfig()

const color = computed(() => colorMode.value === 'dark' ? (colors as any)[appConfig.ui.colors.neutral][900] : 'white')
const radius = computed(() => `:root { --ui-radius: ${appConfig.theme.radius}rem; }`)
const blackAsPrimary = computed(() => appConfig.theme.blackAsPrimary ? `:root { --ui-primary: black; } .dark { --ui-primary: white; }` : ':root {}')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [
    // { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
  ],
  style: [
    { innerHTML: radius, id: 'nuxt-ui-radius', tagPriority: -2 },
    { innerHTML: blackAsPrimary, id: 'nuxt-ui-black-as-primary', tagPriority: -2 },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

// Site-wide OG/Twitter defaults - individual pages only need to set
// ogTitle/ogDescription when they differ from the page <title>/description
// (useSeoMeta falls back to title/description automatically otherwise).
// og:site_name is what Discord/Slack/etc show above the link title -
// without it the card looks anonymous/unbranded. Twitter card type must
// be set explicitly too, it's not inferred from og:image alone.
useSeoMeta({
  ogSiteName: 'Neil Richter',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator
      color="var(--ui-primary)"
      :height="2"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
