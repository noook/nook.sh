<script setup lang="ts">
import type { LightboxImage } from '~/components/ImageLightbox.vue'

// Several light/dark screenshots in one row (see ThemedImage.vue for one).
// Phone screenshots sit side by side from `sm` up, where two of them fit at a
// readable width, and stack on a phone.
type Shot = { light: string, dark: string, alt: string, caption?: string }
const props = withDefaults(defineProps<{
  images: Shot[]
  caption?: string
}>(), { caption: undefined })

// Opens the version matching the colour mode full size: see ImageLightbox.vue.
const colorMode = useColorMode()
const enlarged = ref<LightboxImage | null>(null)
function enlarge(img: Shot) {
  enlarged.value = { src: colorMode.value === 'dark' ? img.dark : img.light, alt: img.alt }
}
</script>

<template>
  <figure class="not-prose my-8">
    <div class="grid gap-6 sm:grid-cols-2">
      <div
        v-for="img in props.images"
        :key="img.light"
        class="mx-auto w-full max-w-[300px]"
      >
        <button
          type="button"
          class="block w-full cursor-zoom-in overflow-hidden rounded-xl ring ring-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :aria-label="`Enlarge: ${img.alt}`"
          @click="enlarge(img)"
        >
          <NuxtImg
            :src="img.light"
            :alt="img.alt"
            class="block w-full dark:hidden"
            loading="lazy"
          />
          <NuxtImg
            :src="img.dark"
            :alt="img.alt"
            class="hidden w-full dark:block"
            loading="lazy"
          />
        </button>
        <p
          v-if="img.caption"
          class="mt-3 text-center font-mono text-xs text-muted"
        >
          {{ img.caption }}
        </p>
      </div>
    </div>
    <ImageLightbox v-model="enlarged" />
    <figcaption
      v-if="props.caption"
      class="mt-3 text-center font-mono text-xs text-muted"
    >
      {{ props.caption }}
    </figcaption>
  </figure>
</template>
