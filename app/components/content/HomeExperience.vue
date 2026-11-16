<script setup lang="ts">
// Every role from content/experience.yml, in full: company first, then the
// role and period in mono, then what was done there.
const { data } = await useAsyncData('experience', () => queryCollection('experience').first())
const experiences = computed(() => data.value?.items ?? [])
</script>

<template>
  <ol class="relative space-y-8 border-l border-default pl-6 text-base">
    <li
      v-for="e in experiences"
      :key="`${e.company}-${e.period}`"
      class="relative"
    >
      <span
        aria-hidden="true"
        class="absolute -left-[29px] top-2 size-2.5 rounded-full bg-default ring-2 ring-primary"
      />
      <h3 class="text-lg font-semibold text-highlighted">
        {{ e.company }}
      </h3>
      <p class="font-mono text-xs text-dimmed">
        {{ e.title }}<span class="mx-1.5">ㆍ</span>{{ e.period }}<template v-if="e.ended">
          <span class="mx-1.5">ㆍ</span>{{ e.ended }}
        </template>
      </p>
      <p
        v-if="e.description"
        class="mt-2"
      >
        {{ e.description }}
      </p>
    </li>
  </ol>
</template>
