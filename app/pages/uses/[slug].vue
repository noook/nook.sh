<script setup lang="ts">
// One keyboard from /uses: the board, its full keycap set, its parts and
// which switches have been in it over time.
const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: keyboards } = await useAsyncData('uses-keyboards', () =>
  queryCollection('usesKeyboards').order('order', 'ASC').all())
const { data: switches } = await useAsyncData('uses-switches', () =>
  queryCollection('usesSwitches').order('order', 'ASC').all())

const slugOf = (entry: { stem: string }) => entry.stem.split('/').pop() ?? entry.stem
const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, '')

const index = computed(() => (keyboards.value ?? []).findIndex(k => slugOf(k) === slug.value))
const board = computed(() => keyboards.value?.[index.value])
if (!board.value) {
  throw createError({ statusCode: 404, statusMessage: 'Keyboard not found', fatal: true })
}

const previous = computed(() => {
  const list = keyboards.value ?? []
  return list.length > 1 ? list[(index.value - 1 + list.length) % list.length] : undefined
})
const next = computed(() => {
  const list = keyboards.value ?? []
  return list.length > 1 ? list[(index.value + 1) % list.length] : undefined
})

// Every period a switch set spent in this board, newest first.
const switchHistory = computed(() => (switches.value ?? []).flatMap(s =>
  s.history.flatMap((h, i) => h.to === slug.value
    ? [{ name: s.name, type: s.type, photo: s.photo, from: h.at, until: s.history[i + 1]?.at ?? null }]
    : []),
).sort((a, b) => b.from.localeCompare(a.from)))

// ← and → move between boards, like on the keyboard itself.
onKeyStroke(['ArrowLeft', 'ArrowRight'], (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
  if ((e.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable]')) return
  const target = e.key === 'ArrowLeft' ? previous.value : next.value
  if (target) navigateTo(`/uses/${slugOf(target)}`)
})

const title = computed(() => `${board.value?.name} — Uses`)
useHead({
  title,
  meta: [{ name: 'description', content: board.value?.line }],
  link: [{ rel: 'canonical', href: `${useSiteConfig().url.replace(/\/$/, '')}/uses/${slug.value}` }],
})
useSeoMeta({ ogTitle: () => `${board.value?.name} — Neil Richter`, ogDescription: board.value?.line })
defineOgImage('Default', { title: `${board.value?.name} — Neil Richter` })
</script>

<template>
  <div
    v-if="board"
    class="max-w-4xl mx-auto space-y-12"
  >
    <nav
      aria-label="Breadcrumb"
      class="flex flex-wrap items-center gap-2 font-mono text-xs text-muted"
    >
      <ULink
        to="/uses"
        class="hover:text-primary"
      >uses</ULink>
      <span aria-hidden="true">/</span>
      <ULink
        to="/uses#keyboards"
        class="hover:text-primary"
      >keyboards</ULink>
      <span aria-hidden="true">/</span>
      <span class="text-highlighted">{{ slug }}</span>
    </nav>

    <!-- Head -->
    <section class="space-y-4">
      <span class="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
        <UsesJamoMark jamo="ㄱ" />
        Keyboard · {{ board.edition }}
      </span>
      <div class="flex flex-wrap items-center gap-3">
        <h1 class="text-4xl font-bold text-highlighted">
          {{ board.name }}
        </h1>
        <UBadge
          v-if="board.status === 'in-use'"
          color="primary"
          variant="soft"
          :label="`in use · ${board.place}`"
        />
        <UBadge
          v-else
          color="neutral"
          variant="outline"
          label="on the shelf"
        />
      </div>
      <p class="max-w-2xl text-lg text-muted">
        {{ board.line }}
      </p>
      <div class="flex flex-wrap gap-1.5">
        <UBadge
          v-for="chip in board.chips"
          :key="chip"
          variant="outline"
          size="sm"
          :label="chip"
        />
      </div>
    </section>

    <!-- Board -->
    <section
      class="relative flex items-center justify-center overflow-hidden rounded-lg bg-elevated/50 ring ring-default"
      :class="board.photo ? '' : 'px-6 pt-12 pb-10'"
    >
      <NuxtImg
        v-if="board.photo"
        :src="board.photo.src"
        :alt="board.photo.alt"
        class="block h-auto w-full"
      />
      <template v-else-if="board.drawing">
        <UsesKeyboardPlate
          :layout="board.drawing.layout"
          :case="board.drawing.case"
          :colors="board.drawing.colors"
          :legends="board.drawing.legends"
          :font="board.drawing.font"
          :low-profile="board.drawing.lowProfile"
          :glossy="board.drawing.glossy"
          :alt="board.drawing.alt"
        />
        <span class="absolute right-4 bottom-3 font-mono text-[11px] text-muted">drawn from its layout and colorway · photo to come</span>
      </template>
      <UsesNookCorners inset="16px" />
    </section>

    <!-- Keycaps -->
    <section
      v-if="board.keycaps"
      id="keycaps"
      class="scroll-mt-24 space-y-4"
    >
      <h2 class="text-2xl font-bold text-highlighted">
        {{ board.keycaps.title }}
      </h2>
      <p class="max-w-2xl text-muted">
        {{ board.keycaps.text }} All {{ board.keycaps.legends.length }} of them, tap one.
      </p>
      <div class="rounded-lg bg-elevated p-4">
        <UsesHangulLegends :legends="board.keycaps.legends" />
      </div>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
      <!-- Parts -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-highlighted">
          Parts
        </h2>
        <dl class="text-sm">
          <div
            v-for="s in board.specs"
            :key="s.label"
            class="flex gap-3 border-b border-default py-2"
          >
            <dt class="min-w-24 pt-0.5 font-mono text-xs text-muted">
              {{ s.label }}
            </dt>
            <dd>{{ s.value }}</dd>
          </div>
          <div
            v-if="board.url"
            class="flex gap-3 border-b border-default py-2"
          >
            <dt class="min-w-24 pt-0.5 font-mono text-xs text-muted">
              Link
            </dt>
            <dd>
              <ULink
                :to="board.url"
                target="_blank"
                class="text-primary"
              >{{ hostOf(board.url) }} ↗</ULink>
            </dd>
          </div>
        </dl>
      </section>

      <!-- Switch history -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-highlighted">
          Switches over time
        </h2>
        <ol
          v-if="switchHistory.length"
          class="space-y-2"
        >
          <li
            v-for="h in switchHistory"
            :key="`${h.name}-${h.from}`"
            class="flex items-center gap-3 rounded-lg p-2 ring ring-default"
          >
            <span class="relative size-12 shrink-0 overflow-hidden rounded-md bg-elevated/50">
              <NuxtImg
                v-if="h.photo"
                :src="h.photo.src"
                alt=""
                width="96"
                height="96"
                class="size-full object-cover"
              />
            </span>
            <span class="flex min-w-0 flex-col leading-snug">
              <span class="text-sm font-medium text-highlighted">{{ h.name }}</span>
              <span class="font-mono text-xs text-muted">{{ h.type }} · {{ h.from }} → {{ h.until ?? 'now' }}</span>
            </span>
            <UBadge
              v-if="!h.until"
              class="ml-auto shrink-0"
              color="primary"
              variant="soft"
              size="sm"
              label="now"
            />
          </li>
        </ol>
        <p
          v-else
          class="text-sm text-muted"
        >
          No switch swaps recorded: it still runs the switches it came with.
        </p>
        <ul
          v-if="board.log.length"
          class="space-y-1 pt-2 font-mono text-xs text-muted"
        >
          <li
            v-for="l in board.log"
            :key="`${l.at}-${l.what}`"
          >
            {{ l.at }} · {{ l.what }}
          </li>
        </ul>
      </section>
    </div>

    <!-- Previous / next -->
    <nav
      aria-label="Other keyboards"
      class="flex flex-wrap justify-between gap-4 border-t border-default pt-6"
    >
      <UButton
        v-if="previous"
        :to="`/uses/${slugOf(previous)}`"
        color="neutral"
        variant="ghost"
        class="min-h-11"
      >
        <UKbd value="←" />
        <span class="flex flex-col items-start leading-tight">
          <span class="text-xs text-muted">Previous</span>
          {{ previous.name }}
        </span>
      </UButton>
      <UButton
        v-if="next"
        :to="`/uses/${slugOf(next)}`"
        color="neutral"
        variant="ghost"
        class="ml-auto min-h-11"
      >
        <span class="flex flex-col items-end leading-tight">
          <span class="text-xs text-muted">Next</span>
          {{ next.name }}
        </span>
        <UKbd value="→" />
      </UButton>
    </nav>
  </div>
</template>
