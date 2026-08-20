<script setup lang="ts">
const { data: page } = await useAsyncData('page-blog', () => {
  return queryCollection('content').path('/blog').first()
})

// Fetch posts from content collection. Drafts (draft: true in frontmatter)
// only show in dev - import.meta.dev is a Nuxt build-time constant baked
// to `false` in production, so this filter can never expose a draft once
// deployed, regardless of anyone knowing the URL.
const { data: posts } = await useAsyncData('posts', () => {
  const query = queryCollection('posts')
  return import.meta.dev ? query.all() : query.where('draft', '=', false).all()
})

useHead({
  title: 'Blog',
  link: [
    { rel: 'canonical', href: 'https://nook.sh/blog' },
  ],
})
defineOgImage('Default', { title: 'Blog — Neil Richter' })
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Page Header -->
    <div class="prose prose-lg dark:prose-invert max-w-none mb-12">
      <ContentRenderer
        v-if="page"
        :value="page"
      />
    </div>

    <!-- Blog Posts List -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <NuxtLink
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        class="block"
      >
        <UCard
          class="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
          :ui="{ body: 'p-4 sm:p-4', header: 'p-0 sm:p-0' }"
        >
          <template #header>
            <div
              v-if="post.image"
              class="aspect-video overflow-hidden"
            >
              <NuxtImg
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="aspect-video flex items-center justify-center bg-gray-100 dark:bg-gray-800"
            >
              <UIcon
                name="lucide:file-text"
                class="size-10 text-gray-400 dark:text-gray-600"
              />
            </div>
          </template>

          <div class="flex-1">
            <h3 class="text-xl font-semibold mb-2 hover:text-primary-500">
              {{ post.title }}
            </h3>
            <p class="text-sm text-gray-500 mb-3">
              {{ new Date(post.date).toLocaleDateString() }}
            </p>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{ post.description }}
            </p>

            <div class="flex gap-2">
              <UBadge
                v-for="tag in post.tags"
                :key="tag"
                variant="outline"
                size="sm"
              >
                {{ tag }}
              </UBadge>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <div
        v-if="!posts || posts.length === 0"
        class="py-16 col-span-full"
      >
        <UCard class="max-w-2xl mx-auto text-center">
          <template #header>
            <h3 class="text-xl font-semibold">
              Nothing published yet
            </h3>
          </template>
          <p class="text-gray-600 dark:text-gray-400">
            I’m gathering thoughts I want to develop into longer posts.
          </p>
          <ul class="mt-4 text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Ideas and notes</li>
            <li>• Returns on experience from projects</li>
            <li>• Short write-ups that may become articles</li>
          </ul>
          <template #footer>
            <span class="text-sm text-gray-500">Stay tuned — drafts in progress.</span>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>
