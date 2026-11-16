<script setup lang="ts">
// Section label on the home page: a jamo marker drawn with the logo's
// stroke, then a short lowercase label in mono. Used from content/index.md.
defineProps<{ jamo: 'ㄱ' | 'ㄴ' | 'ㄷ' | 'ㄹ' | 'ㅁ' | 'ㅂ' }>()
</script>

<template>
  <h2 class="mt-16 mb-6 flex items-center gap-2 font-mono text-sm font-normal text-dimmed">
    <UsesJamoMark :jamo="jamo" />
    <slot mdc-unwrap="p" />
  </h2>
</template>
