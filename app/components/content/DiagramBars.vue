<script setup lang="ts">
// A small bar chart in HTML, so it follows the theme and stays readable on a
// phone. Each bar keeps its exact value in a tooltip and for screen readers;
// only every `labelEvery`-th label is printed under the axis.
type Bar = { label: string, value: number, highlight?: boolean }
type Mark = { at: string, text: string }
const props = withDefaults(defineProps<{
  title?: string
  unit?: string
  bars: Bar[]
  marks?: Mark[]
  labelEvery?: number
  caption?: string
}>(), { title: undefined, unit: '', marks: () => [], labelEvery: 1, caption: undefined })

const max = computed(() => Math.max(...props.bars.map(b => b.value)))
const fmt = new Intl.NumberFormat('en-GB')
const withUnit = (v: number) => `${fmt.format(v)}${props.unit ? ` ${props.unit}` : ''}`
const markAt = (label: string) => props.marks.find(m => m.at === label)
</script>

<template>
  <figure class="not-prose my-8 rounded-lg ring ring-default p-4 sm:p-5">
    <p
      v-if="props.title"
      class="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 font-mono text-xs uppercase tracking-wider text-muted"
    >
      <span>{{ props.title }}</span>
      <span class="normal-case tracking-normal text-dimmed">max {{ withUnit(max) }}</span>
    </p>
    <div
      class="flex h-44 items-end gap-[2px] border-b border-default sm:gap-1"
      role="img"
      :aria-label="props.title"
    >
      <div
        v-for="b in props.bars"
        :key="b.label"
        class="group relative flex h-full flex-1 items-end"
        :title="`${b.label}: ${withUnit(b.value)}`"
      >
        <span
          v-if="markAt(b.label)"
          aria-hidden="true"
          class="absolute inset-y-0 -left-px border-l border-dashed border-primary"
        />
        <span
          class="w-full rounded-t-sm transition-colors"
          :class="b.highlight ? 'bg-primary' : 'bg-accented group-hover:bg-primary/60'"
          :style="{ height: `${Math.max((b.value / max) * 100, 1)}%` }"
        />
        <span class="sr-only">{{ b.label }}: {{ withUnit(b.value) }}</span>
      </div>
    </div>
    <div
      aria-hidden="true"
      class="mt-1.5 flex gap-[2px] sm:gap-1"
    >
      <span
        v-for="(b, i) in props.bars"
        :key="b.label"
        class="w-0 flex-1 overflow-visible whitespace-nowrap font-mono text-[10px] text-dimmed"
      >{{ i % props.labelEvery === 0 ? b.label : '' }}</span>
    </div>
    <ul
      v-if="props.marks.length"
      class="mt-3 space-y-1"
    >
      <li
        v-for="m in props.marks"
        :key="m.at"
        class="font-mono text-[11px] text-primary"
      >
        ┆ {{ m.at }}ㆍ{{ m.text }}
      </li>
    </ul>
    <figcaption
      v-if="props.caption"
      class="mt-3 font-mono text-xs text-muted"
    >
      {{ props.caption }}
    </figcaption>
  </figure>
</template>
