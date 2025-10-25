<script setup lang="ts">
const { data: page } = await useAsyncData('page-blog', () => {
  return queryCollection('content').where({ path: '/blog' }).first()
})

// Fetch posts from content collection
const { data: posts } = await useAsyncData('posts', () => {
  return queryCollection('posts').all()
})
</script>

<template>
  <div class="max-w-3xl">
    <!-- Page Header -->
    <div class="prose prose-lg dark:prose-invert max-w-none mb-12">
      <ContentRenderer v-if="page" :value="page" />
    </div>

    <!-- Blog Posts List -->
    <div class="space-y-6">
      <UCard
        v-for="post in posts"
        :key="post.path"
        class="hover:shadow-lg transition-shadow cursor-pointer"
      >
        <template #header>
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <NuxtLink :to="post.path">
                <h3 class="text-xl font-semibold mb-2 hover:text-primary-500">
                  {{ post.title }}
                </h3>
              </NuxtLink>
              <p class="text-sm text-gray-500">
                {{ new Date(post.date).toLocaleDateString() }}
              </p>
            </div>
          </div>
        </template>

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
      </UCard>

      <div v-if="!posts || posts.length === 0" class="text-center py-12 text-gray-500">
        <p>No blog posts yet. Check back soon!</p>
      </div>
    </div>
  </div>
</template>
