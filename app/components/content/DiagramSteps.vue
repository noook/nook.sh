<script setup lang="ts">
// A path through a system, one numbered step per line, with who acts on it
// in mono. Reads the same on a phone and on a wide screen.
type Step = { actor: string, text: string, note?: string }
const props = defineProps<{ title?: string, steps: Step[], caption?: string }>()
</script>

<template>
  <figure class="not-prose my-8 rounded-lg ring ring-default p-4 sm:p-5">
    <p
      v-if="props.title"
      class="mb-4 font-mono text-xs uppercase tracking-wider text-muted"
    >
      {{ props.title }}
    </p>
    <ol class="space-y-3">
      <li
        v-for="(step, i) in props.steps"
        :key="i"
        class="grid grid-cols-[1.5rem_1fr] gap-x-3 sm:grid-cols-[1.5rem_7.5rem_1fr]"
      >
        <span class="font-mono text-xs leading-6 text-dimmed">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="font-mono text-xs leading-6 text-primary">{{ step.actor }}</span>
        <span class="col-start-2 text-sm leading-6 text-default sm:col-start-3 sm:row-start-1">
          {{ step.text }}
          <span
            v-if="step.note"
            class="block font-mono text-[11px] leading-5 text-muted"
          >{{ step.note }}</span>
        </span>
      </li>
    </ol>
    <figcaption
      v-if="props.caption"
      class="mt-4 font-mono text-xs text-muted"
    >
      {{ props.caption }}
    </figcaption>
  </figure>
</template>
