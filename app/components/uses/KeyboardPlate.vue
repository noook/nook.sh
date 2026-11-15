<script setup lang="ts">
// Draws a keyboard from its KLE layout and a colourway, for boards that
// don't have a photo yet. Sizes are expressed in `--u` (one key unit),
// derived from the container width, so the drawing scales with its card.
import type { CSSProperties } from 'vue'

const props = defineProps<{
  layout: string
  case: string
  colors: Record<string, { cap: string, legend?: string }>
  legends?: boolean
  font?: string
  lowProfile?: boolean
  glossy?: boolean
  alt: string
}>()

const plate = computed(() => keyboardPlate(props.layout))

const PETALS = [
  { left: 0, top: 0, borderRadius: '50% 50% 0 50%' },
  { right: 0, top: 0, borderRadius: '50% 50% 50% 0' },
  { right: 0, bottom: 0, borderRadius: '0 50% 50% 50%' },
  { left: 0, bottom: 0, borderRadius: '50% 0 50% 50%' },
]

function u(n: number) {
  return `calc(var(--u) * ${Number(n.toFixed(4))})`
}

const keys = computed(() => plate.value.keys.map((k) => {
  const colour = props.colors[k.role] ?? props.colors.alpha ?? { cap: '#ccc' }
  const knob = k.role === 'knob'
  const legend = props.legends === false ? '' : k.legend
  const outer: CSSProperties = {
    left: u(k.x),
    top: u(k.y),
    width: u(k.w),
    height: u(k.h),
    padding: knob ? u(0.12) : u(0.06),
    ...(k.r ? { transformOrigin: `${u(k.rx - k.x)} ${u(k.ry - k.y)}`, transform: `rotate(${k.r}deg)` } : {}),
  }
  const depth = props.lowProfile ? 0.06 : 0.12
  const face: CSSProperties = {
    background: colour.cap,
    color: colour.legend ?? 'transparent',
    borderRadius: knob ? '50%' : u(0.14),
    boxShadow: knob
      ? 'inset 0 -2px 0 rgb(0 0 0 / .35), 0 0 0 2px rgb(0 0 0 / .25)'
      : `inset 0 ${u(-depth)} 0 rgb(0 0 0 / .2), inset 0 0 0 1px rgb(0 0 0 / .06)${props.glossy ? ', inset 0 1px 0 rgb(255 255 255 / .45)' : ''}`,
    fontFamily: props.font,
    fontSize: u(legend.length > 2 ? 0.24 : 0.4),
    padding: `${u(0.12)} ${u(0.16)}`,
    whiteSpace: legend.includes(' ') ? 'normal' : 'nowrap',
    lineHeight: legend.includes(' ') ? 1.1 : 1,
    alignItems: k.petals ? 'center' : 'flex-start',
    justifyContent: k.petals ? 'center' : 'flex-start',
  }
  const petals = k.petals
    ? PETALS.slice(0, k.petals).map(p => ({ ...p, border: `max(1px, ${u(0.06)}) solid ${colour.legend ?? 'currentColor'}` }))
    : []
  return { outer, face, legend, petals }
}))
</script>

<template>
  <div class="@container w-full">
    <div
      role="img"
      :aria-label="alt"
      class="mx-auto w-fit"
      :style="{
        '--u': `calc(86cqw / ${plate.width.toFixed(3)})`,
        'background': props.case,
        'padding': u(0.45),
        'borderRadius': u(0.5),
        'boxShadow': '0 16px 28px -16px rgb(0 0 0 / .6), inset 0 1px 0 rgb(255 255 255 / .08)',
      }"
    >
      <div
        class="relative"
        :style="{ width: u(plate.width), height: u(plate.height) }"
      >
        <span
          v-for="(k, i) in keys"
          :key="i"
          class="absolute block box-border"
          :style="k.outer"
        >
          <span
            class="flex size-full box-border overflow-hidden font-medium"
            :style="k.face"
          >
            {{ k.legend }}
            <span
              v-if="k.petals.length"
              class="relative block shrink-0"
              :style="{ width: u(0.5), height: u(0.5) }"
            >
              <span
                v-for="(p, j) in k.petals"
                :key="j"
                class="absolute block box-border"
                :style="{ ...p, width: u(0.25), height: u(0.25) }"
              />
            </span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
