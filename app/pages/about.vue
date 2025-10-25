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

const expandedExperience = ref<number | null>(null)

const techStack = [
  'Vue.js', 'Nuxt.js', 'TypeScript', 'JavaScript',
  'PHP', 'Symfony', 'Rust', 'HTML/CSS',
  'Tailwind CSS', 'Git', 'SQL', 'REST APIs',
]
</script>

<template>
  <div class="max-w-3xl">
    <div class="prose prose-lg dark:prose-invert max-w-none mb-12">
      <ContentRenderer
        v-if="page"
        :value="page"
      />
    </div>

    <!-- Experiences Section -->
    <div class="mb-12">
      <h2 class="text-2xl font-bold mb-6">
        Experiences
      </h2>
      <div class="space-y-4">
        <UCard
          v-for="(exp, index) in experiences"
          :key="index"
          class="cursor-pointer hover:shadow-md transition-shadow"
          @click="expandedExperience = expandedExperience === index ? null : index"
        >
          <template #header>
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold text-lg">
                  {{ exp.title }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ exp.period }} · {{ exp.company }}
                </p>
              </div>
              <UIcon
                :name="expandedExperience === index ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                class="text-gray-400"
              />
            </div>
          </template>
          <div
            v-if="expandedExperience === index"
            class="pt-4 border-t"
          >
            <p class="text-gray-700 dark:text-gray-300">
              {{ exp.description }}
            </p>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Tech Stack Section -->
    <div>
      <h2 class="text-2xl font-bold mb-6">
        Stack
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Some of the software and technologies I use on a daily basis
      </p>
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="tech in techStack"
          :key="tech"
          color="primary"
          variant="subtle"
          size="lg"
        >
          {{ tech }}
        </UBadge>
      </div>
    </div>
  </div>
</template>
