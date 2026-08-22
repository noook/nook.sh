<!--
  Both @nuxtjs/mdc (installed as a dependency of nuxt-content-twoslash) and
  @nuxt/ui register a global `ProsePre` component under the same name.
  @nuxtjs/mdc's version is a bare, unstyled `<pre>` (no background, margin,
  padding, or overflow handling); @nuxt/ui's is properly themed (background,
  rounded corners, padding, responsive `overflow-x-auto` so long lines
  scroll inside the code block instead of blowing out the page width on
  mobile).

  @nuxt/content's moduleDependencies() forces @nuxtjs/mdc to register its
  prose components (components.prose: true), and that can't be turned off
  from nuxt.config.ts - @nuxt/kit's `overrides` mechanism always wins over
  user config for module-to-module dependency options (see
  node_modules/@nuxt/kit/dist/index.mjs, defu(overrides, userConfig,
  defaults)). Nuxt's component *registration* order is first-registered-wins
  on a name collision at equal priority, and @nuxtjs/mdc's install runs
  before @nuxt/ui's in this project's module order, so its bare component
  was winning.

  User-project components (anything in app/components/) always register at
  priority 10, which beats every module's default priority-0 registration
  regardless of load order - that's the actual override mechanism, not a
  config flag. This file exists solely to force resolution to @nuxt/ui's
  real, themed component.
-->
<script setup lang="ts">
import UProsePre from '@nuxt/ui/components/prose/Pre.vue'
</script>

<template>
  <UProsePre v-bind="$attrs">
    <slot />
  </UProsePre>
</template>
