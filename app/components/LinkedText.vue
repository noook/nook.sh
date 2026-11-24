<script setup lang="ts">
// Plain text with the names from `links` turned into external links
// (first mention of each). Used by data-driven blocks like the experience.
const props = defineProps<{ text: string, links?: { text: string, url: string }[] }>()
const segments = computed(() => linkSegments(props.text, props.links))
</script>

<template>
  <template
    v-for="(s, i) in segments"
    :key="i"
  >
    <a
      v-if="s.url"
      :href="s.url"
      target="_blank"
      rel="noopener"
      class="text-highlighted underline decoration-primary/50 underline-offset-4 transition-colors hover:decoration-primary"
    >{{ s.text }}</a>
    <template v-else>
      {{ s.text }}
    </template>
  </template>
</template>
