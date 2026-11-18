<script setup lang="ts">
// A screenshot with a light and a dark version: the one matching the colour
// mode is shown. Phone screenshots are capped so they don't fill the page.
const props = withDefaults(defineProps<{
  light: string
  dark: string
  alt: string
  caption?: string
  phone?: boolean
}>(), { phone: false, caption: undefined })
</script>

<template>
  <figure class="not-prose my-8">
    <div
      class="mx-auto overflow-hidden rounded-xl ring ring-default"
      :class="props.phone ? 'max-w-[300px]' : ''"
    >
      <NuxtImg
        :src="props.light"
        :alt="props.alt"
        class="block w-full dark:hidden"
        loading="lazy"
      />
      <NuxtImg
        :src="props.dark"
        :alt="props.alt"
        class="hidden w-full dark:block"
        loading="lazy"
      />
    </div>
    <figcaption
      v-if="props.caption"
      class="mt-3 text-center font-mono text-xs text-muted"
    >
      {{ props.caption }}
    </figcaption>
  </figure>
</template>
