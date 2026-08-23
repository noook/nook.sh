<script setup lang="ts">
const { data: page } = await useAsyncData('page-projects', () => {
  return queryCollection('content').path('/projects').first()
})

// Fetch projects from content collection. Same preview-visible draft filter
// as blog.vue - see nuxt.config.ts runtimeConfig.showDrafts. Mock projects
// (mock: true) are local-dev-only in every environment, including preview
// deploys - see blog.vue for the full reasoning.
const { public: { showDrafts } } = useRuntimeConfig()
const { data: projects } = await useAsyncData('projects', () => {
  const query = queryCollection('projects')
  if (import.meta.dev) return query.all()
  return showDrafts
    ? query.where('mock', '=', false).all()
    : query.where('draft', '=', false).where('mock', '=', false).all()
})

useHead({
  title: 'Projects',
  link: [
    { rel: 'canonical', href: 'https://nook.sh/projects' },
  ],
})
defineOgImage('Default', { title: 'Projects — Neil Richter' })

// Shared-element view transitions: see app/composables/useViewTransitionName.ts
// for the full explanation. Keyed by project.path so each card gets a
// unique name.
const { transitionStyle } = useViewTransitionName()
function imageTransitionName(path: string) {
  return transitionStyle('project-image', path)
}
function titleTransitionName(path: string) {
  return transitionStyle('project-title', path)
}
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

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink
        v-for="project in projects"
        :key="project.path"
        :to="project.path"
        class="block"
      >
        <UCard
          class="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
          :ui="{ body: 'p-4 sm:p-4', header: 'p-0 sm:p-0' }"
        >
          <template #header>
            <div class="relative">
              <div
                v-if="project.image"
                class="aspect-video overflow-hidden"
              >
                <NuxtImg
                  :src="project.image"
                  :alt="project.title"
                  class="w-full h-full object-cover"
                  :style="imageTransitionName(project.path)"
                />
              </div>
              <div
                v-else
                class="aspect-video flex items-center justify-center bg-elevated"
              >
                <UIcon
                  :name="project.type === 'code' ? 'lucide:code-2' : 'lucide:map-pin'"
                  class="size-10 text-dimmed"
                />
              </div>
              <UBadge
                :color="project.type === 'code' ? 'blue' : 'green'"
                variant="subtle"
                class="absolute top-3 right-3"
              >
                {{ project.type === 'code' ? 'Code' : 'IRL' }}
              </UBadge>
            </div>
          </template>

          <div>
            <h3
              class="text-xl font-semibold mb-2 hover:text-primary-500"
              :style="titleTransitionName(project.path)"
            >
              {{ project.title }}
            </h3>
            <p class="text-muted mb-4">
              {{ project.description }}
            </p>

            <div class="flex items-center justify-between">
              <div class="flex gap-2 flex-wrap">
                <UBadge
                  v-for="tag in project.tags"
                  :key="tag"
                  variant="outline"
                  size="sm"
                >
                  {{ tag }}
                </UBadge>
              </div>
              <span
                v-if="!Number.isNaN(new Date(project.date).getTime())"
                class="text-sm text-dimmed"
              >
                {{ new Date(project.date).getFullYear() }}
              </span>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>

    <div
      v-if="!projects || projects.length === 0"
      class="py-16"
    >
      <UCard class="max-w-2xl mx-auto text-center">
        <template #header>
          <h3 class="text-xl font-semibold">
            Nothing to show here yet
          </h3>
        </template>
        <p class="text-muted">
          I'm planning to share both development projects and IRL projects soon.
        </p>
        <ul class="mt-4 text-muted space-y-1">
          <li>• Web apps, libraries, experiments</li>
          <li>• Motorcycling roadtrips</li>
          <li>• Mechanical keyboards collection</li>
          <li>• Sport updates and more</li>
        </ul>
        <template #footer>
          <span class="text-sm text-dimmed">Check back later — work in progress.</span>
        </template>
      </UCard>
    </div>
  </div>
</template>
