<script setup lang="ts">
const { data: page } = await useAsyncData('page-about', () => {
  return queryCollection('content').path('/about').first()
})

const experiences = [
  {
    title: 'Freelance Full-Stack Developer',
    period: 'Jan 2024 – Now',
    company: 'Madami · Kayro',
    description: 'Building Madami, a platform supporting French non-profits with Vue/Nuxt and modern web technologies.',
  },
  {
    title: 'Full-Stack Software Engineer',
    period: 'Oct 2023 – Mar 2025',
    company: 'Bouygues Telecom',
    description: 'Developed and maintained web applications using Vue/Nuxt and TypeScript for telecommunications services.',
  },
  {
    title: 'Full-Stack Software Engineer',
    period: 'Jan 2022 – Oct 2023',
    company: 'Beamy.io',
    description: 'Built SaaS platform features with Vue/Nuxt and TypeScript, focusing on clean architecture and maintainability.',
  },
  {
    title: 'Full-Stack Developer',
    period: 'Feb 2019 – Dec 2021',
    company: 'Golem.ai',
    description: 'Developed AI-powered applications using Vue.js and PHP/Symfony, working on natural language processing interfaces.',
  },
  {
    title: 'Lecturer (Vue/Nuxt, Symfony)',
    period: '2021 – Now',
    company: 'HEC · Epitech · IIM · Webschool Factory · ESD',
    description: 'Teaching web development with Vue/Nuxt and Symfony at various institutions in Paris.',
  },
  {
    title: 'Full-stack Software Engineer intern',
    period: 'Jun 2018 — Sept 2018',
    company: 'Zest',
    description: 'Internship focusing on full-stack development with modern web technologies.',
  },
]

const techStack = [
  { name: 'Vue.js', icon: 'simple-icons:vuedotjs' },
  { name: 'Nuxt.js', icon: 'simple-icons:nuxtdotjs' },
  { name: 'TypeScript', icon: 'simple-icons:typescript' },
  { name: 'PHP', icon: 'simple-icons:php' },
  { name: 'Symfony', icon: 'simple-icons:symfony' },
  { name: 'Rust', icon: 'simple-icons:rust' },
  { name: 'Tailwind CSS', icon: 'simple-icons:tailwindcss' },
  { name: 'PostgreSQL', icon: 'simple-icons:postgresql' },
  { name: 'Drizzle ORM', icon: 'simple-icons:drizzle' },
  { name: 'Docker', icon: 'simple-icons:docker' },
  { name: 'Cursor', icon: 'material-icon-theme:cursor' },
  { name: 'Firefox Developer Edition', icon: 'simple-icons:firefoxbrowser' },
  { name: 'Raycast', icon: 'simple-icons:raycast' },
  { name: 'Anytype', icon: 'simple-icons:anytype' },
  { name: 'Signal', icon: 'simple-icons:signal' },
  { name: 'Supabase', icon: 'simple-icons:supabase' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-16">
    <section>
      <h1 class="text-4xl font-bold text-center text-gray-900 dark:text-white mb-10">
        About
      </h1>
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div class="shrink-0">
          <NuxtImg
            src="https://github.com/noook.png"
            alt=""
            class="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-700"
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
      <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Experience
      </h2>
      <ol class="space-y-4">
        <li
          v-for="experience in experiences"
          :key="experience.title"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ experience.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ experience.period }} / {{ experience.company }}
          </p>
        </li>
      </ol>
    </section>

    <section>
      <h2 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Stack
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Tools and technologies I use on a daily basis.
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <UPageCard
          v-for="tech in techStack"
          :key="tech.name"
          spotlight
          class="aspect-square"
          :ui="{ container: 'p-0' }"
        >
          <div class="grid size-full place-items-center text-center gap-2">
            <div class="grid place-items-center">
              <UIcon
                :name="tech.icon"
                class="size-8 text-gray-600 dark:text-gray-400 group-hover:text-primary-500 transition-colors"
              />
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ tech.name }}
            </span>
          </div>
        </UPageCard>
      </div>
    </section>
  </div>
</template>
