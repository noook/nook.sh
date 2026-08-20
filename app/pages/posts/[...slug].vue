<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(`post-${route.path}`, () => {
  return queryCollection('posts').path(route.path).first()
})

// Drafts 404 in production even via direct URL - import.meta.dev is a
// Nuxt build-time constant, false in every production build regardless
// of who requests the URL. See blog.vue for the listing-side filter.
if (!post.value || (post.value.draft && !import.meta.dev)) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

useHead({
  title: post.value.title,
  meta: [
    { name: 'description', content: post.value.description },
  ],
  link: [
    { rel: 'canonical', href: `https://nook.sh${route.path}` },
  ],
})
defineOgImage('Default', { title: post.value.title })
</script>

<template>
  <article class="max-w-3xl">
    <!-- Back button -->
    <NuxtLink
      to="/blog"
      class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 mb-8"
    >
      <UIcon name="i-heroicons-arrow-left" />
      Back to Blog
    </NuxtLink>

    <!-- Post Header -->
    <div class="mb-8">
      <div class="mb-4">
        <span class="text-sm text-gray-500">
          {{ new Date(post.date).toLocaleDateString() }}
        </span>
      </div>
      <h1 class="text-4xl font-bold mb-4">
        {{ post.title }}
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">
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
