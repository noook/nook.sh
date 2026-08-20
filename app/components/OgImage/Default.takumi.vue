<script setup lang="ts">
// Minimal OG card: name, page title, subtle theme-colored accent.
// Sober/elegant per the portfolio's positioning brief - no illustration,
// just typography and the site's existing indigo/slate palette.
defineProps<{
  title?: string
}>()
</script>

<template>
  <div
    style="
      width: 1200px;
      height: 630px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 80px;
      background: #0f172a;
      font-family: 'Inter', sans-serif;
    "
  >
    <div
      style="
        width: 56px;
        height: 6px;
        background: #6366f1;
        border-radius: 3px;
      "
    />

    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div
        style="
          font-size: 56px;
          font-weight: 700;
          color: #f8fafc;
          line-height: 1.15;
        "
      >
        {{ title || 'Neil Richter' }}
      </div>
      <div
        style="
          font-size: 28px;
          color: #94a3b8;
        "
      >
        nook.sh
      </div>
    </div>
  </div>
</template>
