<script setup lang="ts">
// The logo's two corners on a frame: ㄴ (primary) bottom-left, ㄱ (the same
// corner turned 180°) top-right. Place inside a `relative` parent.
withDefaults(defineProps<{ size?: 'sm' | 'md', inset?: string }>(), { size: 'md', inset: '12px' })
</script>

<template>
  <span
    aria-hidden="true"
    class="pointer-events-none absolute border-primary"
    :class="size === 'sm' ? 'size-2.5 border-l-2 border-b-2' : 'size-4 border-l-[3px] border-b-[3px]'"
    :style="{ left: inset, bottom: inset }"
  />
  <span
    v-if="size === 'md'"
    aria-hidden="true"
    class="pointer-events-none absolute size-4 border-r-[3px] border-t-[3px] border-(--ui-text-highlighted) opacity-85"
    :style="{ right: inset, top: inset }"
  />
</template>
