<script setup lang="ts">
// The PC's parts list, read from content/uses/setup.yml so /uses and the
// project page never disagree.
const { data: setup } = await useAsyncData('uses-setup-parts', () => queryCollection('usesSetup').first())
</script>

<template>
  <dl
    v-if="setup"
    class="not-prose text-base"
  >
    <div
      v-for="p in setup.pc.parts"
      :key="p.label"
      class="flex gap-3 border-b border-default py-2"
    >
      <dt class="min-w-28 pt-0.5 font-mono text-xs text-muted">
        {{ p.label }}
      </dt>
      <dd>{{ p.value }}</dd>
    </div>
  </dl>
</template>
