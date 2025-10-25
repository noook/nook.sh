<script setup lang="ts">
const { data: page } = await useAsyncData('page-projects', () => {
  return queryCollection('content').path('/projects').first()
})

// Fetch projects from content collection
const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects').all()
})
</script>

<template>
  <div class="max-w-5xl">
    <!-- Page Header -->
    <div class="prose prose-lg dark:prose-invert max-w-none mb-12">
      <ContentRenderer
        v-if="page"
        :value="page"
      />
    </div>

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UCard
        v-for="project in projects"
        :key="project.path"
        class="hover:shadow-lg transition-shadow cursor-pointer"
      >
        <template #header>
          <div class="flex items-start justify-between">
            <NuxtLink :to="project.path">
              <h3 class="text-xl font-semibold hover:text-primary-500">
                {{ project.title }}
              </h3>
            </NuxtLink>
            <UBadge
              :color="project.type === 'code' ? 'blue' : 'green'"
              variant="subtle"
            >
              {{ project.type === 'code' ? 'Code' : 'IRL' }}
            </UBadge>
          </div>
        </template>

        <p class="text-gray-600 dark:text-gray-400 mb-4">
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
          <span class="text-sm text-gray-500">
            {{ new Date(project.date).getFullYear() }}
          </span>
        </div>
      </UCard>
    </div>

    <div
      v-if="!projects || projects.length === 0"
      class="text-center py-12 text-gray-500"
    >
      <p>No projects yet. Check back soon!</p>
    </div>
  </div>
</template>
