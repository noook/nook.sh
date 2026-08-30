<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(`post-${route.path}`, () => {
  return queryCollection('posts').path(route.path).first()
})

// Drafts 404 in production even via direct URL, but stay reachable on
// Cloudflare preview deploys - see nuxt.config.ts runtimeConfig.showDrafts
// and blog.vue for the listing-side filter. Mock posts 404 everywhere
// except local `nuxt dev`, including preview deploys - stricter than
// drafts, since mock content is fake example data, not something in
// progress toward being real.
const { public: { showDrafts } } = useRuntimeConfig()
if (!post.value || (post.value.mock && !import.meta.dev) || (post.value.draft && !showDrafts)) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

useHead({
  title: post.value.title,
  // Post titles already read as a complete sentence/headline on their own
  // ("Fixing a type lie in ...") - appending the global " — Neil Richter"
  // site suffix (see nuxt.config.ts app.head.titleTemplate) pushes long
  // post titles past Google's ~60 char search-snippet guidance for no
  // real benefit here. Other pages (Blog, About, home) keep the suffix -
  // their titles are short generic labels that need the brand context.
  titleTemplate: '%s',
  meta: [
    { name: 'description', content: post.value.description },
  ],
  link: [
    { rel: 'canonical', href: `${useSiteConfig().url.replace(/\/$/, '')}${route.path}` },
  ],
})
useSeoMeta({
  ogTitle: post.value.title,
  ogDescription: post.value.description,
})
// Per-post custom OG card for the Spotify SDK type-lie post; everything
// else still gets the generic Default card. Swap/extend this to a
// frontmatter-driven lookup if more posts get bespoke OG art later.
if (route.path === '/posts/spotify-sdk-search-types') {
  defineOgImage('TypeCard', { title: post.value.title })
}
else {
  defineOgImage('Default', { title: post.value.title })
}

// Shared-element view transitions: see app/composables/useViewTransitionName.ts
// for the full explanation. Same name (keyed by route.path, matching
// post.path there) on the hero image/title here as on the listing card
// makes the browser morph between them on navigation instead of
// cross-fading the whole page.
const { transitionStyle } = useViewTransitionName()
const imageTransitionStyle = computed(() => transitionStyle('post-image', route.path))
const titleTransitionStyle = computed(() => transitionStyle('post-title', route.path))
</script>

<template>
  <article class="max-w-3xl mx-auto">
    <!-- Back button -->
    <NuxtLink
      to="/blog"
      class="inline-flex items-center gap-2 text-sm text-muted hover:text-primary-500 mb-8"
    >
      <UIcon name="i-heroicons-arrow-left" />
      Back to Blog
    </NuxtLink>

    <!-- Hero image -->
    <div
      v-if="post.image"
      class="aspect-video rounded-lg overflow-hidden mb-8 relative"
    >
      <NuxtImg
        :src="post.image"
        :alt="post.title"
        class="w-full h-full object-cover dark:hidden"
        :style="imageTransitionStyle"
      />
      <NuxtImg
        v-if="post.imageDark"
        :src="post.imageDark"
        :alt="post.title"
        class="w-full h-full object-cover hidden dark:block"
        :style="imageTransitionStyle"
      />
    </div>

    <!-- Post Header -->
    <div class="mb-8">
      <div
        v-if="!Number.isNaN(new Date(post.date).getTime())"
        class="mb-4"
      >
        <span class="text-sm text-dimmed">
          {{ new Date(post.date).toLocaleDateString() }}
        </span>
      </div>
      <h1
        class="text-4xl font-bold mb-4"
        :style="titleTransitionStyle"
      >
        {{ post.title }}
      </h1>
      <p class="text-xl text-muted">
        {{ post.description }}
      </p>
    </div>

    <!-- Tags -->
    <div class="flex gap-2 mb-12">
      <UBadge
        v-for="tag in post.tags"
        :key="tag"
        variant="outline"
      >
        {{ tag }}
      </UBadge>
    </div>

    <!-- Post Content -->
    <div class="prose prose-lg dark:prose-invert max-w-none">
      <ContentRenderer :value="post" />
    </div>
  </article>
</template>
