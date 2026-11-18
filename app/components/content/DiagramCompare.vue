<script setup lang="ts">
// Two ways of doing the same thing, side by side (stacked on a phone).
type Side = { title: string, steps: string[], accent?: boolean }
const props = defineProps<{ left: Side, right: Side, caption?: string }>()
</script>

<template>
  <figure class="not-prose my-8">
    <div class="grid gap-3 sm:grid-cols-2">
      <div
        v-for="side in [props.left, props.right]"
        :key="side.title"
        class="rounded-lg p-4"
        :class="side.accent ? 'bg-primary/10 ring-1 ring-primary/60' : 'bg-elevated ring-1 ring-default'"
      >
        <p
          class="mb-3 flex items-baseline justify-between font-mono text-xs uppercase tracking-wider"
          :class="side.accent ? 'text-primary' : 'text-muted'"
        >
          <span>{{ side.title }}</span>
          <span>{{ side.steps.length }} {{ side.steps.length > 1 ? 'steps' : 'step' }}</span>
        </p>
        <ol class="space-y-2">
          <li
            v-for="(step, i) in side.steps"
            :key="i"
            class="grid grid-cols-[1.25rem_1fr] gap-2 text-sm text-default"
          >
            <span class="font-mono text-xs leading-5 text-dimmed">{{ i + 1 }}</span>
            <span>{{ step }}</span>
          </li>
        </ol>
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
