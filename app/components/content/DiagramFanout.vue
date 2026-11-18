<script setup lang="ts">
// One source spread over several branches that meet again at a target:
// the worker, its networks, the FFN.
type Node = { label: string, note?: string }
type Branch = Node & { share?: number }
const props = defineProps<{ from: Node, branches: Branch[], to: Node, caption?: string }>()
</script>

<template>
  <figure class="not-prose my-8">
    <div class="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
      <div class="rounded-md bg-primary/10 px-3 py-2.5 text-center ring-1 ring-primary/60 sm:w-36">
        <span class="block text-sm font-semibold text-primary">{{ props.from.label }}</span>
        <span
          v-if="props.from.note"
          class="mt-0.5 block font-mono text-[11px] text-muted"
        >{{ props.from.note }}</span>
      </div>
      <span
        aria-hidden="true"
        class="self-center font-mono text-dimmed"
      ><span class="sm:hidden">↓</span><span class="hidden sm:inline">→</span></span>
      <ul class="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-1">
        <li
          v-for="b in props.branches"
          :key="b.label"
          class="relative overflow-hidden rounded-md bg-elevated px-3 py-2 ring-1 ring-default"
        >
          <span
            v-if="b.share"
            aria-hidden="true"
            class="absolute inset-y-0 left-0 bg-primary/15"
            :style="{ width: `${b.share}%` }"
          />
          <span class="relative flex items-baseline justify-between gap-2">
            <span class="text-sm font-medium text-highlighted">{{ b.label }}</span>
            <span
              v-if="b.share"
              class="font-mono text-xs text-primary"
            >{{ b.share }}%</span>
          </span>
          <span
            v-if="b.note"
            class="relative block font-mono text-[11px] text-muted"
          >{{ b.note }}</span>
        </li>
      </ul>
      <span
        aria-hidden="true"
        class="self-center font-mono text-dimmed"
      ><span class="sm:hidden">↓</span><span class="hidden sm:inline">→</span></span>
      <div class="rounded-md bg-elevated px-3 py-2.5 text-center ring-1 ring-default sm:w-36">
        <span class="block text-sm font-semibold text-highlighted">{{ props.to.label }}</span>
        <span
          v-if="props.to.note"
          class="mt-0.5 block font-mono text-[11px] text-muted"
        >{{ props.to.note }}</span>
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
