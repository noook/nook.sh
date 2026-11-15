<script setup lang="ts">
// Tappable keycaps from the custom Hangul set: each shows its key and its
// legend, the selected one shows what the word means.
const props = defineProps<{
  legends: { key: string, legend: string, meaning: string }[]
}>()

const active = ref(0)
const current = computed(() => props.legends[active.value])
</script>

<template>
  <div class="space-y-2">
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="(l, i) in legends"
        :key="l.key"
        type="button"
        :aria-pressed="active === i"
        class="flex min-h-11 cursor-pointer flex-col items-start rounded-md bg-[#7A1F24] px-2.5 pt-1 pb-2 text-sm font-medium text-[#E9B36A] shadow-[inset_0_-4px_0_rgb(0_0_0/0.28)] outline-offset-2"
        :class="active === i ? 'outline-2 outline-primary' : ''"
        @click="active = i"
      >
        <span class="font-mono text-[9px] text-[#f1d9cc]">{{ l.key }}</span>
        <span lang="ko">{{ l.legend }}</span>
      </button>
    </div>
    <p
      v-if="current"
      class="min-h-10 text-sm"
      aria-live="polite"
    >
      <span lang="ko">{{ current.legend }}</span>: {{ current.meaning }}
    </p>
  </div>
</template>
