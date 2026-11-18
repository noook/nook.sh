<script setup lang="ts">
// A picture opened full size: no chrome, no padding, just the image over a
// dark overlay. Esc, a click outside or a click on the image closes it.
// Bind it with v-model to the picture to show, or null.
export type LightboxImage = { src: string, alt: string, title?: string }
const image = defineModel<LightboxImage | null>({ default: null })

const open = computed({
  get: () => image.value !== null,
  set: (value) => {
    if (!value) image.value = null
  },
})
</script>

<template>
  <UModal
    v-model:open="open"
    :title="image?.title ?? image?.alt"
    :description="image?.alt"
    :close="false"
    :ui="{
      overlay: 'bg-black/80',
      content: 'w-auto max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] bg-transparent divide-y-0 rounded-md ring-0 shadow-2xl',
    }"
  >
    <template #content>
      <img
        v-if="image"
        :src="image.src"
        :alt="image.alt"
        class="block h-auto max-h-[calc(100dvh-2rem)] w-auto max-w-[calc(100vw-2rem)] cursor-zoom-out object-contain sm:max-h-[calc(100dvh-4rem)]"
        @click="image = null"
      >
    </template>
  </UModal>
</template>
