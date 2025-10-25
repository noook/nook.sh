<script setup lang="ts">
const { data: page } = await useAsyncData('page-index', () => {
  return queryCollection('content').path('/').first()
})
</script>

<template>
  <div class="max-w-3xl">
    <!-- Hero Section -->
    <div class="prose prose-lg dark:prose-invert max-w-none">
      <ContentRenderer
        v-if="page"
        :value="page"
      />
    </div>

    <!-- CTA Buttons -->
    <div class="flex gap-4 mt-8">
      <UButton
        to="/about"
        size="lg"
        variant="solid"
      >
        About
      </UButton>
      <UButton
        to="/projects"
        size="lg"
        variant="outline"
      >
        View Projects
      </UButton>
    </div>
  </div>
</template>
