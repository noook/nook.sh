<script setup lang="ts">
// A picture opened full size: no chrome, no padding, just the image over a
// dark overlay. Esc, a click outside or a click on the image closes it.
// Bind it with v-model to the picture to show, or null.
//
// `preview` is the copy already shown on the page (so already loaded): it
// appears at once, sized like the full picture, and the full file fades in
// over it when it has loaded. Call preloadImage(src) on the thumbnail's
// hover, focus or touch to get a head start.
export type LightboxImage = { src: string, alt: string, title?: string, preview?: string }
const image = defineModel<LightboxImage | null>({ default: null })

const open = computed({
  get: () => image.value !== null,
  set: (value) => {
    if (!value) image.value = null
  },
})

const loaded = ref(false)
watch(() => image.value?.src, () => {
  loaded.value = false
})
const fullImg = useTemplateRef<HTMLImageElement>('full')
// A cached image can finish loading before Vue attaches @load.
watch(fullImg, (el) => {
  if (el?.complete && el.naturalWidth) loaded.value = true
})

const box = 'block h-auto max-h-[calc(100dvh-2rem)] w-auto max-w-[calc(100vw-2rem)] object-contain sm:max-h-[calc(100dvh-4rem)]'
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
      <div
        v-if="image"
        class="relative cursor-zoom-out"
        @click="image = null"
      >
        <img
          v-if="image.preview && image.preview !== image.src"
          :src="image.preview"
          alt=""
          aria-hidden="true"
          :class="box"
        >
        <img
          ref="full"
          :src="image.src"
          :alt="image.alt"
          :class="image.preview && image.preview !== image.src
            ? ['absolute inset-0 h-full w-full object-contain transition-opacity duration-200', loaded ? 'opacity-100' : 'opacity-0']
            : box"
          @load="loaded = true"
        >
      </div>
    </template>
  </UModal>
</template>
