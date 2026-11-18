<script setup lang="ts">
// Several light/dark screenshots in one row (see ThemedImage.vue for one).
// Phone screenshots sit side by side from `sm` up, where two of them fit at a
// readable width, and stack on a phone.
type Shot = { light: string, dark: string, alt: string, caption?: string }
const props = withDefaults(defineProps<{
  images: Shot[]
  caption?: string
}>(), { caption: undefined })
</script>

<template>
  <figure class="not-prose my-8">
    <div class="grid gap-6 sm:grid-cols-2">
      <div
        v-for="img in props.images"
        :key="img.light"
        class="mx-auto w-full max-w-[300px]"
      >
        <div class="overflow-hidden rounded-xl ring ring-default">
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
        </div>
        <p
          v-if="img.caption"
          class="mt-3 text-center font-mono text-xs text-muted"
        >
          {{ img.caption }}
        </p>
      </div>
    </div>
    <figcaption
      v-if="props.caption"
      class="mt-3 text-center font-mono text-xs text-muted"
    >
      {{ props.caption }}
    </figcaption>
  </figure>
</template>
