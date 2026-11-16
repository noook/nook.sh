<script setup lang="ts">
// Get socials from app config as default
const socials = useAppConfig().socials
const props = withDefaults(defineProps<{ align?: 'center' | 'start' }>(), { align: 'center' })
</script>

<template>
  <div
    class="flex gap-6"
    :class="props.align === 'start' ? 'justify-start' : 'justify-center mt-8'"
  >
    <NuxtLink
      v-for="social in socials"
      :key="social.label"
      :to="social.url"
      :aria-label="`Visit ${social.label}`"
      external
      target="_blank"
      class="text-muted hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
    >
      <UIcon
        :name="social.icon"
        class="w-8 h-8"
      />
      <span class="sr-only">{{ social.label }}</span>
    </NuxtLink>
  </div>
</template>
