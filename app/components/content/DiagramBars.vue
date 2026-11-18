<script setup lang="ts">
// A small bar chart in HTML, so it follows the theme and stays readable on a
// phone. A y axis with round ticks gives the scale; hovering, tapping or
// focusing a column shows its exact value in a tooltip. Only every
// `labelEvery`-th label is printed under the axis.
type Bar = { label: string, value: number, highlight?: boolean }
type Mark = { at: string, text: string }
const props = withDefaults(defineProps<{
  title?: string
  unit?: string
  bars: Bar[]
  marks?: Mark[]
  labelEvery?: number
  // Appended to a bar's label in its tooltip: "7" + " Nov", "07:30" + " UTC".
  labelSuffix?: string
  caption?: string
}>(), { title: undefined, unit: '', marks: () => [], labelEvery: 1, labelSuffix: '', caption: undefined })

const fmt = new Intl.NumberFormat('en-GB')
const compact = new Intl.NumberFormat('en-GB', { notation: 'compact' })
const withUnit = (v: number) => `${fmt.format(v)}${props.unit ? ` ${props.unit}` : ''}`
const markAt = (label: string) => props.marks.find(m => m.at === label)

// Round ticks: a step of 1, 2 or 5 × 10^n, about four of them, and the axis
// top on the first tick at or above the highest bar.
const ticks = computed(() => {
  const max = Math.max(...props.bars.map(b => b.value), 1)
  const raw = max / 4
  const pow = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 5, 10].map(m => m * pow).find(s => s >= raw) ?? raw
  const top = Math.ceil(max / step) * step
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step)
})
const top = computed(() => ticks.value.at(-1) ?? 1)

const active = ref<number | null>(null)
const activeBar = computed(() => (active.value === null ? null : props.bars[active.value]))
// Above a short bar, inside the plot from the top of a tall one, so the
// tooltip never covers the title.
const tipPosition = (value: number) => {
  const h = Math.max((value / top.value) * 100, 1)
  return h > 55
    ? { top: `calc(${100 - h}% + 0.375rem)` }
    : { bottom: `calc(${h}% + 0.375rem)` }
}
// Keep the tooltip inside the chart at both ends.
const tipAlign = (i: number) => {
  const pos = (i + 0.5) / props.bars.length
  return pos < 0.15 ? 'left-0' : pos > 0.85 ? 'right-0' : 'left-1/2 -translate-x-1/2'
}
</script>

<template>
  <figure class="not-prose my-8 rounded-lg ring ring-default p-4 sm:p-5">
    <p
      v-if="props.title"
      class="mb-4 font-mono text-xs uppercase tracking-wider text-muted"
    >
      {{ props.title }}
    </p>
    <div class="grid grid-cols-[auto_1fr] gap-x-2">
      <!-- y axis -->
      <div
        aria-hidden="true"
        class="relative h-44 font-mono text-[10px] text-dimmed tabular-nums"
      >
        <span
          v-for="t in ticks"
          :key="t"
          class="absolute right-0 block translate-y-1/2 text-right leading-none"
          :style="{ bottom: `${(t / top) * 100}%` }"
        >{{ compact.format(t) }}</span>
        <!-- reserves the width of the widest tick label -->
        <span class="invisible block">{{ compact.format(top) }}</span>
      </div>

      <!-- plot -->
      <div
        class="relative h-44 border-b border-default"
        @pointerleave="active = null"
      >
        <span
          v-for="t in ticks.slice(1)"
          :key="t"
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-0 border-t border-dashed border-default"
          :style="{ bottom: `${(t / top) * 100}%` }"
        />
        <div
          class="relative flex h-full items-end gap-[2px] sm:gap-1"
          role="list"
          :aria-label="props.title"
        >
          <div
            v-for="(b, i) in props.bars"
            :key="b.label"
            role="listitem"
            tabindex="0"
            class="relative flex h-full flex-1 cursor-default items-end outline-none"
            :aria-label="`${b.label}${props.labelSuffix}: ${withUnit(b.value)}`"
            @pointerenter="active = i"
            @click="active = i"
            @focus="active = i"
            @blur="active = null"
          >
            <span
              v-if="markAt(b.label)"
              aria-hidden="true"
              class="absolute inset-y-0 -left-px border-l border-dashed border-primary"
            />
            <span
              aria-hidden="true"
              class="w-full rounded-t-sm transition-colors"
              :class="b.highlight ? 'bg-primary' : active === i ? 'bg-primary/60' : 'bg-accented'"
              :style="{ height: `${Math.max((b.value / top) * 100, 1)}%` }"
            />
            <span
              v-if="active === i && activeBar"
              aria-hidden="true"
              class="pointer-events-none absolute z-10 w-max max-w-56 rounded-md bg-inverted px-2 py-1 font-mono text-[11px] leading-tight text-inverted shadow-md"
              :class="tipAlign(i)"
              :style="tipPosition(b.value)"
            >
              <span class="block opacity-70">{{ b.label }}{{ props.labelSuffix }}</span>
              <span class="block font-medium">{{ withUnit(b.value) }}</span>
              <span
                v-if="markAt(b.label)"
                class="block opacity-70"
              >┆ {{ markAt(b.label)!.text }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- x labels, under the plot column -->
      <div aria-hidden="true" />
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
