<script setup lang="ts">
const route = useRoute()

const { data: project } = await useAsyncData(`project-${route.path}`, () => {
  return queryCollection('projects').path(route.path).first()
})

// Drafts 404 in production even via direct URL, but stay reachable on
// Cloudflare preview deploys - see nuxt.config.ts runtimeConfig.showDrafts
// and posts/[...slug].vue for the same pattern, including the stricter
// mock-content 404 rule.
const { public: { showDrafts } } = useRuntimeConfig()
if (!project.value || (project.value.mock && !import.meta.dev) || (project.value.draft && !showDrafts)) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

useHead({
  title: project.value.title,
  meta: [
    { name: 'description', content: project.value.description },
  ],
  link: [
    { rel: 'canonical', href: `${useSiteConfig().url.replace(/\/$/, '')}${route.path}` },
  ],
})
useSeoMeta({
  ogTitle: project.value.title,
  ogDescription: project.value.description,
})
defineOgImage('Default', { title: project.value.title })

// Posts that point to this project with `project: <slug>` in their frontmatter.
const slug = route.path.split('/').pop() ?? ''
const { data: relatedPosts } = await useAsyncData(`project-posts-${route.path}`, () => {
  let query = queryCollection('posts').where('project', '=', slug).order('date', 'DESC')
  if (!showDrafts) query = query.where('draft', '=', false)
  if (!import.meta.dev) query = query.where('mock', '=', false)
  return query.all()
})

const startedAt = computed(() => {
  const d = new Date(project.value!.date)
  return Number.isNaN(d.getTime())
    ? null
    : new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }).format(d).toLowerCase()
})

// Shared-element view transitions: see app/composables/useViewTransitionName.ts
// for the full explanation. Keyed by route.path, matching project.path on
// the listing.
const { transitionStyle } = useViewTransitionName()
const imageTransitionStyle = computed(() => transitionStyle('project-image', route.path))
const titleTransitionStyle = computed(() => transitionStyle('project-title', route.path))
</script>

<template>
  <article class="max-w-3xl mx-auto">
    <!-- Back button -->
    <NuxtLink
      to="/projects"
      class="inline-flex items-center gap-2 text-sm text-muted hover:text-primary-500 mb-8"
    >
      <UIcon name="i-heroicons-arrow-left" />
      Back to Projects
    </NuxtLink>

    <!-- Hero image -->
    <div
      v-if="project.image"
      class="aspect-video rounded-lg overflow-hidden mb-8"
    >
      <NuxtImg
        :src="project.image"
        :alt="project.title"
        class="w-full h-full object-cover"
        :style="imageTransitionStyle"
      />
    </div>

    <!-- Project Header -->
    <div class="mb-8">
      <p class="mb-4 font-mono text-xs text-muted">
        {{ project.type === 'code' ? 'code' : 'irl' }}<template v-if="startedAt">
          <span class="mx-1.5 text-dimmed">ㆍ</span>since {{ startedAt }}
        </template><template v-if="project.status">
          <span class="mx-1.5 text-dimmed">ㆍ</span>{{ project.status }}
        </template>
      </p>
      <h1
        class="text-4xl font-bold mb-4"
        :style="titleTransitionStyle"
      >
        {{ project.title }}
      </h1>
      <p class="text-xl text-muted">
        {{ project.description }}
      </p>
    </div>

    <!-- Tags -->
    <div class="flex gap-2 mb-12">
      <UBadge
        v-for="tag in project.tags"
        :key="tag"
        variant="outline"
      >
        {{ tag }}
      </UBadge>
    </div>

    <!-- Versions, oldest first -->
    <section
      v-if="project.versions.length"
      class="mb-14"
    >
      <h2 class="mb-6 flex items-center gap-2 font-mono text-sm text-dimmed">
        <UsesJamoMark jamo="ㄱ" /> versions
      </h2>
      <ol class="relative space-y-8 border-l border-default pl-6">
        <li
          v-for="v in project.versions"
          :key="v.name"
          class="relative grid gap-4 sm:grid-cols-[1fr_9rem]"
        >
          <span
            aria-hidden="true"
            class="absolute -left-[29px] top-2 size-2.5 rounded-full bg-default ring-2 ring-primary"
          />
          <div>
            <h3 class="text-lg font-semibold text-highlighted">
              {{ v.name }}
            </h3>
            <p
              v-if="v.at"
              class="font-mono text-xs text-dimmed"
            >
              {{ v.at }}
            </p>
            <p class="mt-1 text-muted">
              {{ v.line }}
            </p>
          </div>
          <NuxtImg
            v-if="v.image"
            :src="v.image"
            :alt="v.imageAlt ?? v.name"
            class="aspect-[4/3] w-full rounded-md object-cover sm:w-36"
            loading="lazy"
          />
        </li>
      </ol>
    </section>

    <!-- Project Content -->
    <div class="prose prose-lg dark:prose-invert max-w-none">
      <ContentRenderer :value="project" />
    </div>

    <!-- Writing about it -->
    <section
      v-if="relatedPosts?.length"
      class="mt-14"
    >
      <h2 class="mb-4 flex items-center gap-2 font-mono text-sm text-dimmed">
        <UsesJamoMark jamo="ㄴ" /> writing about it
      </h2>
      <NuxtLink
        v-for="post in relatedPosts"
        :key="post.path"
        :to="post.path"
        class="group mb-3 block rounded-md border border-default p-4 hover:border-primary/50"
      >
        <span class="font-mono text-xs text-dimmed">{{ post.date }}</span>
        <span class="mt-1 block font-semibold text-highlighted group-hover:text-primary">{{ post.title }}</span>
        <span class="mt-1 block text-sm text-muted">{{ post.description }}</span>
      </NuxtLink>
    </section>
  </article>
</template>
