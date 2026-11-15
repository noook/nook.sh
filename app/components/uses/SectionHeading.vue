<script setup lang="ts">
defineProps<{
  jamo?: 'ㄱ' | 'ㄴ' | 'ㄷ' | 'ㄹ' | 'ㅁ' | 'ㅂ'
  index?: string
  title: string
  description?: string
  small?: boolean
}>()
</script>

<template>
  <div class="mb-6">
    <span
      v-if="jamo"
      class="mb-2 flex items-center gap-2 font-mono text-xs tracking-wider text-muted"
    >
      <UsesJamoMark :jamo="jamo" />
      {{ index }}
    </span>
    <h2
      class="font-bold text-highlighted"
      :class="small ? 'text-2xl' : 'text-3xl'"
    >
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="mt-4 text-muted"
    >
      {{ description }}
    </p>
  </div>
</template>
