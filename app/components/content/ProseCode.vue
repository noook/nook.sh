<!-- See ProsePre.vue in this same directory for why this override exists. -->
<script setup lang="ts">
import UProseCode from '@nuxt/ui/components/prose/Code.vue'
</script>

<template>
  <UProseCode v-bind="$attrs">
    <slot />
  </UProseCode>
</template>
