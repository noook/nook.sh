<template>
  <div>
    <UHeader
      title="Neil Richter"
      to="/"
    >
      <UNavigationMenu :items="headerLinks" />

      <template #right>
        <ThemePicker />
        <UColorModeButton />
      </template>
    </UHeader>

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
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const headerLinks = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/',
    active: route.path === '/',
  },
  {
    label: 'About',
    to: '/about',
    active: route.path === '/about',
  },
  {
    label: 'Projects',
    to: '/projects',
    active: route.path.startsWith('/projects'),
  },
  {
    label: 'Blog',
    to: '/blog',
    active: route.path === '/blog',
  },
])
</script>
