<template>
  <div>
    <!-- Three links fit at 360 px, so there is no burger menu: Blog and
         Projects stay one tap away for someone landing from a social link.
         The logo goes home; the theme picker lives in the footer. -->
    <UHeader
      title="Neil Richter"
      to="/"
      :toggle="false"
    >
      <template #title>
        <NookLogo class="h-7 sm:h-9.5 w-auto" />
        <span class="sr-only">Neil Richter</span>
      </template>

      <template #right>
        <nav
          aria-label="Main"
          class="flex items-center gap-4 sm:gap-6 text-sm font-medium"
        >
          <NuxtLink
            v-for="link in headerLinks"
            :key="link.to"
            :to="link.to"
            class="transition-colors"
            :class="isActive(link.to) ? 'text-primary' : 'text-muted hover:text-highlighted'"
            :aria-current="isActive(link.to) ? 'page' : undefined"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
        <UColorModeButton class="-mr-1.5" />
      </template>
    </UHeader>

    <UMain class="flex-1">
      <UContainer class="py-8">
        <slot />
      </UContainer>
    </UMain>

    <UFooter>
      <template #left>
        <div class="flex items-center gap-2 font-mono text-xs text-muted">
          theme
          <ThemePicker />
        </div>
      </template>
      <template #right>
        <p class="font-mono text-xs text-muted">
          © {{ new Date().getFullYear() }} neil richter<span class="mx-1.5 text-dimmed">ㆍ</span>paris
        </p>
      </template>
    </UFooter>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const headerLinks = [
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'Uses', to: '/uses' },
]

// A post belongs to Blog: /posts/* lights the Blog link.
const isActive = (to: string) =>
  route.path.startsWith(to) || (to === '/blog' && route.path.startsWith('/posts'))
</script>
