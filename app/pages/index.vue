<script setup lang="ts">
// Home and about are one page: content/index.md holds the text (in Neil's
// words), the experience, stack and socials are MDC blocks inside it.
const { data: page } = await useAsyncData('page-index', () => {
  return queryCollection('content').path('/').first()
})

const heading = computed(() => (page.value?.meta?.heading as string | undefined) ?? 'Neil Richter')
const tagline = computed(() => page.value?.meta?.tagline as string | undefined)

// useSiteConfig().url resolves against the actual deployed host at runtime
// (nuxt-site-config reads it from the request on preview/prod Cloudflare
// deploys) - nuxt.config.ts site.url is only the lowest-priority fallback.
// A hardcoded 'https://nook.sh/...' literal here would bypass that
// resolution entirely and always point canonical/OG at production, even
// from a branch preview deploy.
const siteConfig = useSiteConfig()

useHead({
  title: 'Neil Richter',
  titleTemplate: '%s',
  meta: [
    { name: 'description', content: page.value?.description },
  ],
  link: [
    { rel: 'canonical', href: siteConfig.url },
  ],
})
useSeoMeta({
  ogTitle: 'Neil Richter',
  ogDescription: page.value?.description,
})
defineOgImage('Default', { title: 'Neil Richter' })
</script>

<template>
  <div class="max-w-2xl mx-auto pb-12">
    <header class="flex items-center gap-5 pt-4">
      <div class="relative shrink-0 p-2">
        <NuxtImg
          src="https://github.com/noook.png"
          alt=""
          class="size-16 rounded-full object-cover"
        />
        <UsesNookCorners
          size="sm"
          inset="0px"
          opposite
        />
      </div>
      <div>
        <h1 class="text-3xl font-bold text-highlighted">
          {{ heading }}
        </h1>
        <p
          v-if="tagline"
          class="font-mono text-sm text-dimmed"
        >
          {{ tagline }}
        </p>
      </div>
    </header>

    <!-- Text styles only reach the markdown paragraphs (no class), so the MDC blocks
         (experience, stack, socials) keep their own. -->
    <div class="mt-10 text-lg leading-relaxed text-muted [&_p:not([class])]:mb-5 [&_p_strong]:font-semibold [&_p_strong]:text-highlighted [&_p_a]:text-highlighted [&_p_a]:underline [&_p_a]:decoration-primary/50 [&_p_a]:underline-offset-4 [&_p_a:hover]:decoration-primary">
      <ContentRenderer
        v-if="page"
        :value="page"
      />
    </div>
  </div>
</template>
