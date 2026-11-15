<script setup lang="ts">
const { data: setup } = await useAsyncData('uses-setup', () =>
  queryCollection('usesSetup').first())
const { data: keyboards } = await useAsyncData('uses-keyboards', () =>
  queryCollection('usesKeyboards').order('order', 'ASC').all())
const { data: switches } = await useAsyncData('uses-switches', () =>
  queryCollection('usesSwitches').order('order', 'ASC').all())

// Data entries are keyed by file name: content/uses/keyboards/tofu-tkl.yml -> 'tofu-tkl'.
const slugOf = (entry: { stem: string }) => entry.stem.split('/').pop() ?? entry.stem
const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, '')

const keyboardNames = computed(() =>
  Object.fromEntries((keyboards.value ?? []).map(k => [slugOf(k), k.name])))

const drawer = computed(() => (switches.value ?? []).map((s) => {
  const now = s.history.at(-1)?.to ?? null
  return { ...s, slug: slugOf(s), now, nowLabel: now ? `in ${keyboardNames.value[now] ?? now}` : 'in the drawer' }
}))

// Swap log: board events plus every switch move, newest first.
const log = computed(() => [
  ...(keyboards.value ?? []).flatMap(k => k.log.map(l => ({ at: l.at, subject: slugOf(k), what: l.what }))),
  ...(switches.value ?? []).flatMap(s => s.history.map(h => ({ at: h.at, subject: slugOf(s), what: `→ ${h.to ?? 'drawer'}` }))),
].sort((a, b) => b.at.localeCompare(a.at)))

const sections = [
  { key: '1', id: 'keyboards', label: 'Keyboards' },
  { key: '2', id: 'switches', label: 'Switches' },
  { key: '3', id: 'desk', label: 'Desk' },
  { key: '4', id: 'computers', label: 'Computers' },
  { key: '5', id: 'software', label: 'Software' },
  { key: '6', id: 'log', label: 'Log' },
]

// A keyboard page you can drive from the keyboard: 1-6 jump to a section.
onKeyStroke(sections.map(s => s.key), (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return
  const target = e.target as HTMLElement | null
  if (target?.closest('input, textarea, select, [contenteditable]')) return
  const section = sections.find(s => s.key === e.key)
  document.getElementById(section!.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})

const activeLegend = ref(0)
// Desk: items with x/y get a numbered dot on the photo, the rest are listed apart.
const pictured = computed(() => (setup.value?.desk.items ?? [])
  .filter(d => d.x != null && d.y != null)
  .map((d, i) => ({ ...d, n: i + 1 })))
const offPhoto = computed(() => (setup.value?.desk.items ?? []).filter(d => d.x == null || d.y == null))
const activeDeskItem = ref(4)

useHead({
  title: 'Uses',
  meta: [
    { name: 'description', content: 'The keyboards, switches, desk, computers and software Neil Richter uses every day.' },
  ],
  link: [
    { rel: 'canonical', href: `${useSiteConfig().url.replace(/\/$/, '')}/uses` },
  ],
})
useSeoMeta({
  ogTitle: 'Uses — Neil Richter',
  ogDescription: 'The keyboards, switches, desk, computers and software I use every day.',
})
defineOgImage('Default', { title: 'Uses — Neil Richter' })
</script>

<template>
  <div
    v-if="setup"
    class="max-w-4xl mx-auto space-y-16"
  >
    <!-- Page head -->
    <section class="space-y-4 pt-2">
      <span class="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
        <svg
          aria-hidden="true"
          viewBox="36 36 144 88"
          class="h-[9px] w-3.5 fill-primary"
        ><path d="M40 40H68V92H176V120H40Z" /></svg>
        Uses · updated {{ setup.updated }}
      </span>
      <h1 class="text-4xl font-bold text-highlighted">
        Uses
      </h1>
      <p class="max-w-2xl text-lg text-muted">
        {{ setup.intro }}
      </p>
      <nav
        aria-label="Sections"
        class="flex flex-wrap gap-2 pt-2"
      >
        <UButton
          v-for="s in sections"
          :key="s.id"
          :to="`#${s.id}`"
          color="neutral"
          variant="outline"
          class="min-h-11"
        >
          {{ s.label }}
          <UKbd :value="s.key" />
        </UButton>
      </nav>
    </section>

    <!-- Keyboards -->
    <section
      id="keyboards"
      class="scroll-mt-24"
    >
      <UsesSectionHeading
        jamo="ㄱ"
        index="01"
        title="Keyboards"
        description="Four boards, three in use. No photo yet? The card draws the board from its layout file and its colorway."
      />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UCard
          v-for="k in keyboards"
          :key="k.stem"
          :ui="{ root: 'flex flex-col overflow-hidden', header: 'p-0 sm:p-0', body: 'p-4 sm:p-4 flex flex-1 flex-col gap-3' }"
        >
          <template #header>
            <div class="relative aspect-video flex items-center justify-center overflow-hidden bg-elevated/50">
              <NuxtImg
                v-if="k.photo"
                :src="k.photo.src"
                :alt="k.photo.alt"
                class="absolute inset-0 size-full object-cover"
              />
              <template v-else-if="k.drawing">
                <UsesKeyboardPlate
                  :layout="k.drawing.layout"
                  :case="k.drawing.case"
                  :colors="k.drawing.colors"
                  :legends="k.drawing.legends"
                  :font="k.drawing.font"
                  :low-profile="k.drawing.lowProfile"
                  :glossy="k.drawing.glossy"
                  :alt="k.drawing.alt"
                />
                <span class="absolute right-3 bottom-2.5 font-mono text-[11px] text-muted">drawing · photo to come</span>
              </template>
              <UsesNookCorners />
            </div>
          </template>

          <div class="flex items-start justify-between gap-3">
            <h3 class="text-xl font-semibold text-highlighted">
              {{ k.name }}
            </h3>
            <UBadge
              v-if="k.status === 'in-use'"
              color="primary"
              variant="soft"
              :label="`in use · ${k.place}`"
            />
            <UBadge
              v-else
              color="neutral"
              variant="outline"
              label="on the shelf"
            />
          </div>
          <span class="-mt-2 font-mono text-xs text-muted">{{ k.edition }}</span>
          <p class="text-muted">
            {{ k.line }}
          </p>

          <div
            v-if="k.keycaps"
            class="rounded-md bg-elevated p-3 space-y-2"
          >
            <span class="block font-mono text-[11px] uppercase tracking-wider text-muted">Keycaps · {{ k.keycaps.title }}</span>
            <p class="text-sm">
              {{ k.keycaps.text }} Tap one.
            </p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="(l, i) in k.keycaps.legends"
                :key="l.key"
                type="button"
                :aria-pressed="activeLegend === i"
                class="flex min-h-11 cursor-pointer flex-col items-start rounded-md bg-[#7A1F24] px-2.5 pt-1 pb-2 text-sm font-medium text-[#E9B36A] shadow-[inset_0_-4px_0_rgb(0_0_0/0.28)] outline-offset-2"
                :class="activeLegend === i ? 'outline-2 outline-primary' : ''"
                @click="activeLegend = i"
              >
                <span class="font-mono text-[9px] text-[#f1d9cc]">{{ l.key }}</span>
                {{ l.legend }}
              </button>
            </div>
            <p
              class="min-h-10 text-sm"
              aria-live="polite"
            >
              <span lang="ko">{{ k.keycaps.legends[activeLegend]?.legend }}</span>: {{ k.keycaps.legends[activeLegend]?.meaning }}
            </p>
          </div>

          <div class="flex flex-wrap gap-1.5">
            <UBadge
              v-for="chip in k.chips"
              :key="chip"
              variant="outline"
              size="sm"
              :label="chip"
            />
          </div>

          <details class="group mt-auto border-t border-default pt-2.5">
            <summary class="flex min-h-8 cursor-pointer list-none items-center gap-1.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
              <UIcon
                name="i-lucide-chevron-down"
                class="size-4 transition-transform group-open:rotate-180"
              />
              Specs
            </summary>
            <dl class="mt-1.5 space-y-1 text-sm">
              <div
                v-for="s in k.specs"
                :key="s.label"
                class="flex gap-3"
              >
                <dt class="min-w-23 font-mono text-xs leading-5 text-muted">
                  {{ s.label }}
                </dt>
                <dd>{{ s.value }}</dd>
              </div>
              <div
                v-if="k.url"
                class="flex gap-3"
              >
                <dt class="min-w-23 font-mono text-xs leading-5 text-muted">
                  Link
                </dt>
                <dd>
                  <ULink
                    :to="k.url"
                    target="_blank"
                    class="text-primary"
                  >{{ hostOf(k.url) }}</ULink>
                </dd>
              </div>
            </dl>
          </details>
        </UCard>
      </div>
    </section>

    <!-- Switches -->
    <section
      id="switches"
      class="scroll-mt-24"
    >
      <UsesSectionHeading
        jamo="ㄴ"
        index="02"
        title="Switch drawer"
        description="Every set I own, boxed ones included. Photos are mine (coming), the link goes to the shop I bought them from."
      />
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <article
          v-for="s in drawer"
          :key="s.slug"
          class="flex flex-col overflow-hidden rounded-lg bg-default ring ring-default"
        >
          <div class="relative flex aspect-square flex-col items-center justify-center gap-1.5 border-b border-default bg-elevated/50 text-muted">
            <NuxtImg
              v-if="s.photo"
              :src="s.photo.src"
              :alt="s.photo.alt"
              class="absolute inset-0 size-full object-cover"
            />
            <template v-else>
              <span
                aria-hidden="true"
                class="absolute inset-2.5 rounded-md border-[1.5px] border-dashed border-accented"
              />
              <UIcon
                name="i-lucide-camera"
                class="size-5"
              />
              <span class="px-4 text-center font-mono text-[10px]">photo slot · {{ s.slug }}.jpg</span>
            </template>
            <UsesNookCorners
              size="sm"
              inset="18px"
            />
          </div>
          <div class="flex grow flex-col gap-1.5 p-3">
            <div>
              <h3 class="text-[15px] font-semibold leading-tight text-highlighted">
                {{ s.name }}
              </h3>
              <span class="font-mono text-[11px] text-muted">{{ s.type }}</span>
            </div>
            <p class="grow text-[13px] leading-snug text-muted">
              {{ s.feel || s.note }}
            </p>
            <UBadge
              class="self-start"
              size="sm"
              :color="s.now ? 'primary' : 'neutral'"
              :variant="s.now ? 'soft' : 'outline'"
              :label="s.nowLabel"
            />
            <UButton
              :to="s.shop.url"
              target="_blank"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-external-link"
              block
              class="mt-0.5 min-h-11 justify-between"
              :aria-label="`Shop page for ${s.name} on ${s.shop.name}`"
            >
              <span class="flex flex-col items-start leading-tight">
                <span class="text-[10px] font-normal text-muted">Shop page</span>
                {{ s.shop.name }}
              </span>
            </UButton>
          </div>
        </article>
      </div>
      <p class="mt-4 text-sm text-muted">
        The NuPhy Air75 V3 runs NuPhy's own low-profile Nano switches, made by Gateron: Brown on the modifiers, Blush on the alphas.
      </p>
    </section>

    <!-- Desk -->
    <section
      id="desk"
      class="scroll-mt-24"
    >
      <UsesSectionHeading
        jamo="ㄷ"
        index="03"
        title="Desk"
        description="Hover a dot or a name."
      />
      <div class="relative overflow-hidden rounded-lg ring ring-default">
        <NuxtImg
          :src="setup.desk.photo.src"
          :alt="setup.desk.photo.alt"
          class="block h-auto w-full"
        />
        <button
          v-for="d in pictured"
          :key="d.name"
          type="button"
          :aria-label="d.name"
          class="absolute flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center"
          :style="{ left: `${d.x}%`, top: `${d.y}%` }"
          @mouseenter="activeDeskItem = d.n"
          @focus="activeDeskItem = d.n"
          @click="activeDeskItem = d.n"
        >
          <span
            class="flex size-6.5 items-center justify-center rounded-full font-mono text-xs font-medium shadow-[0_0_0_3px_rgb(15_23_43/0.35)]"
            :class="activeDeskItem === d.n ? 'bg-primary text-inverted' : 'bg-white/90 text-slate-900'"
          >{{ d.n }}</span>
          <span
            v-if="activeDeskItem === d.n"
            aria-hidden="true"
            class="pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-default/90 px-2 py-1 text-xs font-medium text-highlighted shadow-sm ring ring-default backdrop-blur"
            :class="(d.x ?? 0) > 70 ? 'right-full mr-0.5' : 'left-full ml-0.5'"
          >{{ d.name }}</span>
        </button>
      </div>

      <ol class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1">
        <li
          v-for="d in pictured"
          :key="d.name"
          class="flex gap-3 rounded-md px-2.5 py-2"
          :class="activeDeskItem === d.n ? 'bg-elevated' : ''"
          @mouseenter="activeDeskItem = d.n"
        >
          <span class="w-4 shrink-0 pt-0.5 font-mono text-xs text-muted">{{ d.n }}</span>
          <div class="flex flex-col leading-snug">
            <span class="text-sm font-medium text-highlighted">{{ d.name }}</span>
            <span class="text-[13px] text-muted">{{ d.note }}</span>
          </div>
        </li>
      </ol>

      <div
        v-if="offPhoto.length"
        class="mt-4 border-t border-default pt-4"
      >
        <span class="mb-2 block font-mono text-[11px] uppercase tracking-wider text-muted">Not in the picture</span>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          <li
            v-for="d in offPhoto"
            :key="d.name"
            class="flex gap-3 px-2.5 text-sm leading-snug"
          >
            <span
              aria-hidden="true"
              class="mt-1 size-2 shrink-0 border-b-2 border-l-2 border-primary"
            />
            <span><span class="font-medium text-highlighted">{{ d.name }}</span> <span class="text-muted">· {{ d.note }}</span></span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Computers -->
    <section
      id="computers"
      class="scroll-mt-24"
    >
      <UsesSectionHeading
        jamo="ㄹ"
        index="04"
        title="Computers"
      />
      <article class="flex flex-wrap overflow-hidden rounded-lg ring ring-default">
        <div class="relative min-h-95 flex-[1_1_260px]">
          <NuxtImg
            :src="setup.pc.photo.src"
            :alt="setup.pc.photo.alt"
            class="absolute inset-0 size-full object-cover"
          />
          <UsesNookCorners />
        </div>
        <div class="flex min-w-0 flex-[999_1_420px] flex-col gap-3.5 p-6">
          <span class="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
            <span class="size-2 bg-[#b4b8ff]" />Hardware · small form factor
          </span>
          <h3 class="text-2xl font-semibold text-highlighted">
            {{ setup.pc.name }} <span class="font-normal text-muted">· {{ setup.pc.summary }}</span>
          </h3>
          <dl class="text-sm">
            <div
              v-for="p in setup.pc.parts"
              :key="p.label"
              class="flex gap-3 border-b border-default py-1.5"
            >
              <dt class="min-w-26 pt-0.5 font-mono text-xs text-muted">
                {{ p.label }}
              </dt>
              <dd>{{ p.value }}</dd>
            </div>
          </dl>
          <UButton
            :to="setup.pc.post"
            variant="ghost"
            color="primary"
            size="lg"
            trailing-icon="i-lucide-arrow-right"
            label="Read the build story"
            class="-ml-2.5 self-start"
          />
        </div>
      </article>
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          v-for="m in setup.machines"
          :key="m.name"
          class="flex flex-col gap-1 rounded-lg p-4 ring ring-default"
        >
          <span class="font-mono text-[11px] uppercase tracking-wider text-muted">{{ m.kind }}</span>
          <span class="font-semibold text-highlighted">{{ m.name }}</span>
          <span class="text-sm text-muted">{{ m.note }}</span>
          <ULink
            v-if="m.link"
            :to="m.link.url"
            target="_blank"
            class="mt-1 text-sm font-medium text-primary"
          >
            {{ m.link.label }} ↗
          </ULink>
        </div>
      </div>
    </section>

    <!-- Software -->
    <section
      id="software"
      class="scroll-mt-24"
    >
      <UsesSectionHeading
        jamo="ㅁ"
        index="05"
        title="Software"
        description="The eight I'd reinstall first, and why."
      />
      <div class="grid grid-cols-1 md:grid-cols-2 items-start gap-3">
        <div
          v-for="s in setup.software"
          :key="s.name"
          class="flex flex-col gap-3 rounded-lg p-3.5 ring ring-default"
        >
          <div class="flex items-start gap-3.5">
            <span class="grid size-10 shrink-0 place-items-center rounded-md bg-elevated">
              <UIcon
                :name="s.icon"
                class="size-5.5 text-muted"
              />
            </span>
            <div class="flex flex-col gap-0.5">
              <span class="font-semibold text-highlighted">{{ s.name }}</span>
              <span class="text-sm text-muted">{{ s.line }}</span>
            </div>
          </div>
          <details
            v-if="s.config"
            class="group border-t border-default pt-2"
          >
            <summary class="flex min-h-8 cursor-pointer list-none items-center gap-1.5 font-mono text-xs [&::-webkit-details-marker]:hidden">
              <UIcon
                name="i-lucide-chevron-down"
                class="size-3.5 transition-transform group-open:rotate-180"
              />
              {{ s.config.path }}
            </summary>
            <pre class="mt-2 overflow-x-auto rounded-md bg-muted p-3 font-mono text-[11.5px] leading-relaxed ring ring-default ring-inset">{{ s.config.body }}</pre>
          </details>
        </div>
      </div>
    </section>

    <!-- Off the desk -->
    <section>
      <UsesSectionHeading
        title="Off the desk"
        description="Three small kits: what gets me around, what makes music, what's in my bag."
        small
      />
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          v-for="kit in setup.kits"
          :key="kit.title"
          class="flex flex-col rounded-lg ring ring-default"
        >
          <div class="flex items-center gap-2.5 border-b border-default px-3.5 py-3">
            <span
              aria-hidden="true"
              class="size-2.5 border-b-2 border-l-2 border-primary"
            />
            <span class="font-semibold text-highlighted">{{ kit.title }}</span>
          </div>
          <ul class="px-3.5 pt-1.5 pb-3">
            <li
              v-for="item in kit.items"
              :key="item.name"
              class="flex flex-col border-b border-dashed border-default py-1.5 leading-snug last:border-b-0"
            >
              <span class="text-sm">{{ item.name }}</span>
              <span class="font-mono text-[11px] text-muted">{{ item.note }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Swap log -->
    <section
      id="log"
      class="scroll-mt-24"
    >
      <UsesSectionHeading
        jamo="ㅂ"
        index="06"
        title="Swap log"
        description="Generated from each part's history, newest first."
      />
      <ol class="ml-2 border-l-2 border-accented">
        <li
          v-for="(l, i) in log"
          :key="i"
          class="relative flex flex-wrap items-baseline gap-x-4 gap-y-1 py-2.5 pl-7 font-mono text-[13px]"
        >
          <span
            aria-hidden="true"
            class="absolute -left-0.5 top-1.5 size-4 border-b-2 border-l-2 border-primary"
          />
          <span class="w-16 text-muted">{{ l.at }}</span>
          <span class="min-w-40 font-medium text-highlighted">{{ l.subject }}</span>
          <span class="text-muted">{{ l.what }}</span>
        </li>
      </ol>
    </section>
  </div>
</template>
