<script setup lang="ts">
// Every role from content/experience.yml, newest first, on a UTimeline:
// company, then the role and period in mono, then what was done there.
// The current role is the timeline's active item (primary dot), the
// rest stay neutral. Names listed under `links` become links.
const { data } = await useAsyncData('experience', () => queryCollection('experience').first())

const items = computed(() => (data.value?.items ?? []).map(e => ({
  ...e,
  value: `${e.company}-${e.period}`,
})))
</script>

<template>
  <UTimeline
    :items="items"
    :default-value="items[0]?.value"
    size="3xs"
    class="text-base"
    :ui="{
      // The dot's center sits on the company line (text-lg, 28px line):
      // no wrapper offset, a 6px drop on the 16px dot.
      wrapper: 'mt-0 pb-9',
      indicator: 'mt-1.5 bg-default ring-2 ring-inset ring-accented group-data-[state=active]:ring-primary',
      separator: 'bg-accented',
    }"
  >
    <template #wrapper="{ item }">
      <h3 class="text-lg font-semibold text-highlighted">
        <LinkedText
          :text="item.company"
          :links="item.links"
        />
      </h3>
      <p class="font-mono text-xs text-dimmed">
        {{ item.title }}<span class="mx-1.5">ㆍ</span>{{ item.period }}<template v-if="item.ended">
          <span class="mx-1.5">ㆍ</span>{{ item.ended }}
        </template>
      </p>
      <p
        v-if="item.description"
        class="mt-2 text-muted"
      >
        <LinkedText
          :text="item.description"
          :links="item.links"
        />
      </p>
    </template>
  </UTimeline>
</template>
