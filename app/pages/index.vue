<script setup lang="ts">
const { data: page } = await useAsyncData('page-index', () => {
  return queryCollection('content').path('/').first()
})

useHead({
  title: 'Home',
  link: [
    { rel: 'canonical', href: 'https://nook.sh/' },
  ],
})
defineOgImage('Default', { title: 'Neil Richter' })
</script>

<template>
  <div>
    <div class="prose prose-lg dark:prose-invert max-w-none">
      <ContentRenderer
        v-if="page"
        :value="page"
      />
    </div>
    <div class="flex justify-center">
      <UButton
        to="/about"
        size="xl"
        variant="ghost"
        trailing-icon="lucide:arrow-right"
        color="primary"
        label="About"
      />
    </div>
  </div>
</template>
