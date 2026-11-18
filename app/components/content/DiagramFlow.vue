<script setup lang="ts">
// Boxes joined by arrows: left to right on a wide screen, top to bottom on a
// phone. Written from markdown with YAML props, so the diagram is text that
// follows the site's theme (colour mode and accent colour).
type Step = { label: string, note?: string, accent?: boolean, dashed?: boolean }
const props = defineProps<{ steps: Step[], loop?: string, caption?: string }>()
</script>

<template>
  <figure class="not-prose my-8">
    <ol class="flex flex-col items-stretch gap-1 sm:flex-row sm:items-center sm:gap-0">
      <template
        v-for="(step, i) in props.steps"
        :key="step.label"
      >
        <li
          class="flex-1 rounded-md px-3 py-2.5 text-center"
          :class="step.dashed
            ? 'border border-dashed border-accented'
            : step.accent ? 'bg-primary/10 ring-1 ring-primary/60' : 'bg-elevated ring-1 ring-default'"
        >
          <span
            class="block text-sm font-semibold"
            :class="step.accent ? 'text-primary' : 'text-highlighted'"
          >{{ step.label }}</span>
          <span
            v-if="step.note"
            class="mt-0.5 block font-mono text-[11px] leading-snug text-muted"
          >{{ step.note }}</span>
        </li>
        <li
          v-if="i < props.steps.length - 1"
          aria-hidden="true"
          class="self-center px-1.5 font-mono text-dimmed"
        >
          <span class="sm:hidden">↓</span><span class="hidden sm:inline">→</span>
        </li>
      </template>
    </ol>
    <p
      v-if="props.loop"
      class="mt-2 text-center font-mono text-xs text-primary"
    >
      ↺ {{ props.loop }}
    </p>
    <figcaption
      v-if="props.caption"
      class="mt-3 text-center font-mono text-xs text-muted"
    >
      {{ props.caption }}
    </figcaption>
  </figure>
</template>
