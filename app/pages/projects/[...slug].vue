<script setup lang="ts">
const route = useRoute()

const { data: project } = await useAsyncData(`project-${route.path}`, () => {
  return queryCollection('projects').path(route.path).first()
})

// Drafts 404 in production even via direct URL, but stay reachable on
// Cloudflare preview deploys - see nuxt.config.ts runtimeConfig.showDrafts
// and posts/[...slug].vue for the same pattern, including the stricter
// mock-content 404 rule.
const { public: { showDrafts } } = useRuntimeConfig()
if (!project.value || (project.value.mock && !import.meta.dev) || (project.value.draft && !showDrafts)) {
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

// Shared-element view transitions: see app/pages/blog.vue for the full
// explanation. Keyed by route.path, matching project.path on the listing.
const supportsViewTransitions = import.meta.client && 'startViewTransition' in document
const imageTransitionStyle = supportsViewTransitions
  ? { viewTransitionName: `project-image-${route.path.replace(/\//g, '-')}` }
  : undefined
const titleTransitionStyle = supportsViewTransitions
  ? { viewTransitionName: `project-title-${route.path.replace(/\//g, '-')}` }
  : undefined
</script>

<template>
  <article class="max-w-3xl">
    <!-- Back button -->
    <NuxtLink
      to="/projects"
      class="inline-flex items-center gap-2 text-sm text-muted hover:text-primary-500 mb-8"
    >
      <UIcon name="i-heroicons-arrow-left" />
      Back to Projects
    </NuxtLink>

    <!-- Hero image -->
    <div
      v-if="project.image"
      class="aspect-video rounded-lg overflow-hidden mb-8"
    >
      <NuxtImg
        :src="project.image"
        :alt="project.title"
        class="w-full h-full object-cover"
        :style="imageTransitionStyle"
      />
    </div>

    <!-- Project Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-4">
        <UBadge
          :color="project.type === 'code' ? 'blue' : 'green'"
          variant="subtle"
        >
          {{ project.type === 'code' ? 'Code' : 'IRL' }}
        </UBadge>
        <span
          v-if="!Number.isNaN(new Date(project.date).getTime())"
          class="text-sm text-dimmed"
        >
          {{ new Date(project.date).toLocaleDateString() }}
        </span>
      </div>
      <h1
        class="text-4xl font-bold mb-4"
        :style="titleTransitionStyle"
      >
        {{ project.title }}
      </h1>
      <p class="text-xl text-muted">
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
