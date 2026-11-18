<script setup lang="ts">
import type { LightboxImage } from '~/components/ImageLightbox.vue'

// A screenshot with a light and a dark version: the one matching the colour
// mode is shown. Phone screenshots are capped so they don't fill the page.
const props = withDefaults(defineProps<{
  light: string
  dark: string
  alt: string
  caption?: string
  phone?: boolean
}>(), { phone: false, caption: undefined })

// Opens the version matching the colour mode full size: see ImageLightbox.vue.
const colorMode = useColorMode()
const enlarged = ref<LightboxImage | null>(null)
function enlarge() {
  const src = colorMode.value === 'dark' ? props.dark : props.light
  enlarged.value = { src, alt: props.alt }
}
</script>

<template>
  <figure class="not-prose my-8">
    <button
      type="button"
      class="mx-auto block w-full cursor-zoom-in overflow-hidden rounded-xl ring ring-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      :class="props.phone ? 'max-w-[300px]' : ''"
      :aria-label="`Enlarge: ${props.alt}`"
      @click="enlarge"
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
    </button>
    <ImageLightbox v-model="enlarged" />
    <figcaption
      v-if="props.caption"
      class="mt-3 text-center font-mono text-xs text-muted"
    >
      {{ props.caption }}
    </figcaption>
  </figure>
</template>
