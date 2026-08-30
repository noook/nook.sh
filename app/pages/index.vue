<script setup lang="ts">
const { data: page } = await useAsyncData('page-index', () => {
  return queryCollection('content').path('/').first()
})

// useSiteConfig().url resolves against the actual deployed host at runtime
// (nuxt-site-config reads it from the request on preview/prod Cloudflare
// deploys) - nuxt.config.ts site.url is only the lowest-priority fallback.
// A hardcoded 'https://nook.sh/...' literal here would bypass that
// resolution entirely and always point canonical/OG at production, even
// from a branch preview deploy.
const siteConfig = useSiteConfig()

useHead({
  title: 'Home',
  meta: [
    { name: 'description', content: 'Neil Richter — software engineer. Open source, TypeScript, and building things.' },
  ],
  link: [
    { rel: 'canonical', href: siteConfig.url },
  ],
})
useSeoMeta({
  ogTitle: 'Neil Richter',
  ogDescription: 'Software engineer. Open source, TypeScript, and building things.',
})
defineOgImage('Default', { title: 'Neil Richter' })
</script>

<template>
  <div>
    <div class="prose prose-lg dark:prose-invert max-w-none">
      <ContentRenderer
        v-if="page"
        :value="page"
      />
    </div>
    <div class="flex justify-center">
      <UButton
        to="/about"
        size="xl"
        variant="ghost"
        trailing-icon="lucide:arrow-right"
        color="primary"
        label="About"
      />
    </div>
  </div>
</template>
