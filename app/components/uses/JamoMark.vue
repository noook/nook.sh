<script setup lang="ts">
// Section markers: Korean documents number items ㄱ, ㄴ, ㄷ… instead of
// 1, 2, 3. Drawn with the logo's logic (one square stroke, right angles),
// not typed, so they read as part of the brand rather than as text.
const props = defineProps<{ jamo: 'ㄱ' | 'ㄴ' | 'ㄷ' | 'ㄹ' | 'ㅁ' | 'ㅂ' }>()

const PATHS: Record<typeof props.jamo, string> = {
  ㄱ: 'M0 0H120V120H96V24H0Z',
  ㄴ: 'M0 0H24V96H120V120H0Z',
  ㄷ: 'M0 0H120V24H24V96H120V120H0Z',
  ㄹ: 'M0 0H120V72H24V96H120V120H0V48H96V24H0Z',
  ㅁ: 'M0 0H120V120H0Z M24 24V96H96V24Z',
  ㅂ: 'M0 0H24V48H96V0H120V120H0Z M24 72V96H96V72Z',
}
</script>

<template>
  <svg
    aria-hidden="true"
    viewBox="0 0 120 120"
    class="size-[11px] fill-primary"
  >
    <path
      fill-rule="evenodd"
      :d="PATHS[props.jamo]"
    />
  </svg>
</template>
