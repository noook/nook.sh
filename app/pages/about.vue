<script setup lang="ts">
const { data: page } = await useAsyncData('page-about', () => {
  return queryCollection('content').path('/about').first()
})

const { data: experienceData } = await useAsyncData('experience', () => {
  return queryCollection('experience').first()
})
const experiences = computed(() => experienceData.value?.items ?? [])

// Engineering stack: languages, frameworks, infra actually used to build things.
// Backend/systems-leaning entries first, per positioning decision (see plan doc).
// Sourced against ~/work/resume-gen/content.json to keep this in sync with
// what's actually claimed elsewhere - NestJS/Node.js were missing here
// despite being the real stack behind the Madami build.
const engineeringStack = [
  { name: 'NestJS', icon: 'simple-icons:nestjs' },
  { name: 'Node.js', icon: 'simple-icons:nodedotjs' },
  { name: 'PostgreSQL', icon: 'simple-icons:postgresql' },
  { name: 'Symfony', icon: 'simple-icons:symfony' },
  { name: 'PHP', icon: 'simple-icons:php' },
  { name: 'Rust', icon: 'simple-icons:rust' },
  { name: 'Docker', icon: 'simple-icons:docker' },
  { name: 'Drizzle ORM', icon: 'simple-icons:drizzle' },
  { name: 'TypeScript', icon: 'simple-icons:typescript' },
  { name: 'Nuxt.js', icon: 'simple-icons:nuxtdotjs' },
  { name: 'Vue.js', icon: 'simple-icons:vuedotjs' },
  { name: 'Tailwind CSS', icon: 'simple-icons:tailwindcss' },
  { name: 'Supabase', icon: 'simple-icons:supabase' },
  { name: 'Kotlin', icon: 'simple-icons:kotlin' },
  { name: 'Jetpack Compose', icon: 'simple-icons:jetpackcompose' },
]

// Personal tools: day-to-day setup, not a skills claim.
const personalTools = [
  { name: 'Cursor', icon: 'simple-icons:cursor' },
  { name: 'Claude Code', icon: 'simple-icons:claude' },
  { name: 'Firefox Developer Edition', icon: 'simple-icons:firefoxbrowser' },
  { name: 'Raycast', icon: 'simple-icons:raycast' },
  { name: 'Obsidian', icon: 'simple-icons:obsidian' },
  { name: 'Anytype', icon: 'simple-icons:anytype' },
  { name: 'Hermes', icon: 'material-symbols:smart-toy-outline' },
  { name: 'Proton Mail', icon: 'simple-icons:protonmail' },
  { name: 'Tailscale', icon: 'simple-icons:tailscale' },
  { name: 'Signal', icon: 'simple-icons:signal' },
  { name: 'opencode', icon: 'simple-icons:opencode' },
  { name: 'Bitwarden', icon: 'simple-icons:bitwarden' },
]

useHead({
  title: 'About',
  meta: [
    { name: 'description', content: 'Software engineer building open source, TypeScript tools, and side projects.' },
  ],
  link: [
    { rel: 'canonical', href: `${useSiteConfig().url}/about` },
  ],
})
useSeoMeta({
  ogTitle: 'About — Neil Richter',
  ogDescription: 'Software engineer building open source, TypeScript tools, and side projects.',
})
defineOgImage('Default', { title: 'About — Neil Richter' })
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-16">
    <section>
      <h1 class="text-4xl font-bold text-center text-highlighted mb-10">
        About
      </h1>
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div class="shrink-0">
          <NuxtImg
            src="https://github.com/noook.png"
            alt=""
            class="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover ring-4 ring-muted"
          />
        </div>

        <div class="flex-1">
          <div class="prose prose-lg dark:prose-invert max-w-none [&_p]:mb-4">
            <ContentRenderer
              v-if="page"
              :value="page"
            />
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="text-3xl font-bold mb-8 text-highlighted">
        Experience
      </h2>
      <ol class="space-y-4">
        <li
          v-for="experience in experiences"
          :key="experience.title"
        >
          <h3 class="text-lg font-semibold text-highlighted">
            {{ experience.title }}
          </h3>
          <p class="text-muted">
            {{ experience.period }} / {{ experience.company }}
          </p>
        </li>
      </ol>
    </section>

    <section>
      <h2 class="text-3xl font-bold mb-4 text-highlighted">
        Stack
      </h2>
      <p class="text-muted mb-6">
        Tools and technologies I use to build things.
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <UPageCard
          v-for="tech in engineeringStack"
          :key="tech.name"
          spotlight
          class="aspect-square"
          :ui="{ container: 'p-0' }"
        >
          <div class="grid size-full place-items-center text-center gap-2">
            <div class="grid place-items-center">
              <UIcon
                :name="tech.icon"
                class="size-8 text-muted group-hover:text-primary-500 transition-colors"
              />
            </div>
            <span class="text-sm font-medium text-highlighted">
              {{ tech.name }}
            </span>
          </div>
        </UPageCard>
      </div>
    </section>

    <section>
      <h2 class="text-2xl font-bold mb-4 text-highlighted">
        Daily setup
      </h2>
      <p class="text-muted mb-6">
        Apps and tools I run day to day — not a skills list, just what's on my machine.
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <UPageCard
          v-for="tool in personalTools"
          :key="tool.name"
          spotlight
          class="aspect-square"
          :ui="{ container: 'p-0' }"
        >
          <div class="grid size-full place-items-center text-center gap-2">
            <div class="grid place-items-center">
              <UIcon
                :name="tool.icon"
                class="size-8 text-muted group-hover:text-primary-500 transition-colors"
              />
            </div>
            <span class="text-sm font-medium text-highlighted">
              {{ tool.name }}
            </span>
          </div>
        </UPageCard>
      </div>
    </section>
  </div>
</template>
