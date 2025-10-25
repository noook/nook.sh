<template>
  <div>
    <UHeader
      title="Neil Richter"
      to="/"
      :links="headerLinks"
    />

    <UMain class="flex-1">
      <UContainer class="py-8">
        <slot />
      </UContainer>
    </UMain>

    <UFooter>
      <template #default>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          © 2025, Neil Richter - All rights reserved.
        </p>
      </template>
    </UFooter>
  </div>
</template>

<script setup lang="ts">
const headerLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
]
</script>
