<script setup lang="ts">
// 16 tiles so the grid fills evenly: 2 rows of 8 on desktop, 4 of 4 on a phone.
const stack = [
  { name: 'TypeScript', icon: 'simple-icons:typescript' },
  { name: 'Node.js', icon: 'simple-icons:nodedotjs' },
  { name: 'NestJS', icon: 'simple-icons:nestjs' },
  { name: 'PHP', icon: 'simple-icons:php' },
  { name: 'Symfony', icon: 'simple-icons:symfony' },
  { name: 'PostgreSQL', icon: 'simple-icons:postgresql' },
  { name: 'Drizzle', icon: 'simple-icons:drizzle' },
  { name: 'Supabase', icon: 'simple-icons:supabase' },
  { name: 'Vue', icon: 'simple-icons:vuedotjs' },
  { name: 'Nuxt', icon: 'simple-icons:nuxtdotjs' },
  { name: 'Tailwind', icon: 'simple-icons:tailwindcss' },
  { name: 'Docker', icon: 'simple-icons:docker' },
  { name: 'Cloudflare', icon: 'simple-icons:cloudflare' },
  { name: 'Kotlin', icon: 'simple-icons:kotlin' },
  { name: 'Compose', icon: 'simple-icons:jetpackcompose' },
  { name: 'Rust', icon: 'simple-icons:rust' },
]
</script>

<template>
  <div class="grid grid-cols-4 sm:grid-cols-8 gap-2">
    <UPageCard
      v-for="tech in stack"
      :key="tech.name"
      spotlight
      class="aspect-[4/3] sm:aspect-square"
      :ui="{ container: 'p-0 sm:p-0 lg:p-0' }"
    >
      <div class="grid size-full place-items-center content-center gap-1.5 text-center">
        <UIcon
          :name="tech.icon"
          class="size-5 text-muted group-hover:text-primary-500 transition-colors"
        />
        <span class="text-[11px] font-medium text-highlighted">{{ tech.name }}</span>
      </div>
    </UPageCard>
  </div>
</template>
