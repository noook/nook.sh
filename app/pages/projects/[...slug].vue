<script setup lang="ts">
const route = useRoute()

const { data: project } = await useAsyncData(`project-${route.path}`, () => {
  return queryCollection('projects').path(route.path).first()
})

// Drafts 404 in production even via direct URL - see posts/[...slug].vue
// for why import.meta.dev makes this dev-only, not just listing-hidden.
if (!project.value || (project.value.draft && !import.meta.dev)) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

useHead({
  title: project.value.title,
  meta: [
    { name: 'description', content: project.value.description },
  ],
  link: [
    { rel: 'canonical', href: `https://nook.sh${route.path}` },
  ],
})
defineOgImage('Default', { title: project.value.title })
</script>

<template>
  <article class="max-w-3xl">
    <!-- Back button -->
    <NuxtLink
      to="/projects"
      class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 mb-8"
    >
      <UIcon name="i-heroicons-arrow-left" />
      Back to Projects
    </NuxtLink>

    <!-- Project Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-4">
        <UBadge
          :color="project.type === 'code' ? 'blue' : 'green'"
          variant="subtle"
        >
          {{ project.type === 'code' ? 'Code' : 'IRL' }}
        </UBadge>
        <span class="text-sm text-gray-500">
          {{ new Date(project.date).toLocaleDateString() }}
        </span>
      </div>
      <h1 class="text-4xl font-bold mb-4">
        {{ project.title }}
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        {{ project.description }}
      </p>
    </div>

    <!-- Tags -->
    <div class="flex gap-2 mb-12">
      <UBadge
        v-for="tag in project.tags"
        :key="tag"
        variant="outline"
      >
        {{ tag }}
      </UBadge>
    </div>

    <!-- Project Content -->
    <div class="prose prose-lg dark:prose-invert max-w-none">
      <ContentRenderer :value="project" />
    </div>
  </article>
</template>
