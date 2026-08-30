<script setup lang="ts">
// Renders a single PR/issue comment as a quoted "card" inside prose content,
// used via MDC in content/**/*.md:
//
//   ::pr-quote{author="atinux" handle="atinux" avatar="https://github.com/atinux.png" role="Maintainer" date="Nov 14, 2024" href="https://github.com/..."}
//   Quoted comment body, rendered as markdown (code fences etc. work).
//   ::
//
// `mine` flips the layout/accent for the post author's own PR comments, so a
// back-and-forth reads visually distinct from the maintainer's replies
// (like a two-party chat log) without needing two separate components.
const props = withDefaults(defineProps<{
  author: string
  handle?: string
  avatar?: string
  role?: string
  date?: string
  href?: string
  mine?: boolean
}>(), {
  handle: undefined,
  avatar: undefined,
  role: undefined,
  date: undefined,
  href: undefined,
  mine: false,
})

const initials = computed(() => props.author
  .split(/\s+/)
  .map(w => w[0])
  .join('')
  .slice(0, 2)
  .toUpperCase())
</script>

<template>
  <figure
    class="not-prose my-6 rounded-lg border overflow-hidden"
    :class="mine
      ? 'border-primary-500/30 bg-primary-500/5'
      : 'border-default bg-elevated/50'"
  >
    <figcaption class="flex items-center gap-3 px-4 pt-4">
      <UAvatar
        v-if="avatar"
        :src="avatar"
        :alt="author"
        size="sm"
      />
      <span
        v-else
        class="flex size-8 items-center justify-center rounded-full bg-primary-500/20 text-xs font-semibold text-primary-500"
      >
        {{ initials }}
      </span>

      <div class="flex flex-col leading-tight">
        <component
          :is="href ? 'a' : 'span'"
          :href="href"
          :target="href ? '_blank' : undefined"
          :rel="href ? 'noopener noreferrer' : undefined"
          class="text-sm font-medium"
          :class="href ? 'hover:text-primary-500 hover:underline' : ''"
        >
          {{ author }}
          <span
            v-if="handle"
            class="text-dimmed font-normal"
          >@{{ handle }}</span>
        </component>
        <span class="text-xs text-dimmed">
          <template v-if="role">{{ role }}</template>
          <template v-if="role && date"> · </template>
          <template v-if="date">{{ date }}</template>
        </span>
      </div>

      <UIcon
        v-if="href"
        name="i-simple-icons-github"
        class="ml-auto size-4 text-dimmed shrink-0"
      />
    </figcaption>

    <blockquote class="px-4 pb-4 pt-2 text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <slot />
    </blockquote>
  </figure>
</template>
