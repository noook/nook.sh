<script setup lang="ts">
// OG card for the Spotify SDK type-lie post: same "solid vs ghost field"
// concept as the blog-card cover, but rebuilt for the Takumi renderer
// (flexbox + inline styles only - no CSS grid, box-shadow, backdrop-filter,
// or @import'd fonts; those don't exist in a non-browser renderer). Dashed
// borders and generic sans/monospace family fallbacks are the safe subset
// that Takumi (satori-style) actually supports.
defineProps<{
  title?: string
}>()

const accent = '#1DB954'
const bg = '#0b0d0e'
const surface = '#131718'
const border = '#262b2c'
const borderStrong = '#34393a'
const ink = '#eef1f0'
const muted = '#7c8688'
const ghost = '#3c4344'

const realFields = [
  { key: 'tracks', type: 'Page<Track>' },
  { key: 'artists', type: 'Page<Artist>' },
]
const ghostFields = [
  { key: 'albums', type: 'Page<SimplifiedAlbum>' },
  { key: 'playlists', type: 'Page<PlaylistBase>' },
  { key: 'shows', type: 'Page<SimplifiedShow>' },
]
</script>

<template>
  <div
    style="
      width: 1200px;
      height: 630px;
      display: flex;
      background: #0b0d0e;
      font-family: sans-serif;
      padding: 72px;
      position: relative;
    "
  >
    <!-- left column: kicker, title, code line -->
    <div
      style="
        display: flex;
        flex-direction: column;
        width: 620px;
        justify-content: space-between;
      "
    >
      <div style="display: flex; flex-direction: column;">
        <div style="display: flex; align-items: center;">
          <div
            style="
              width: 9px;
              height: 9px;
              border-radius: 5px;
              background: #1DB954;
              margin-right: 10px;
            "
          />
          <div
            style="
              font-size: 18px;
              color: #7c8688;
              font-family: monospace;
              letter-spacing: 1px;
            "
          >
            OPEN SOURCE - TYPESCRIPT
          </div>
        </div>

        <div
          style="
            font-size: 46px;
            font-weight: 700;
            color: #eef1f0;
            line-height: 1.2;
            margin-top: 28px;
            display: flex;
          "
        >
          {{ title || "Fixing a type lie in Spotify's official TypeScript SDK" }}
        </div>
      </div>

      <div
        style="
          display: flex;
          flex-direction: column;
          font-family: monospace;
          font-size: 22px;
          color: #7c8688;
          line-height: 1.7;
        "
      >
        <div style="display: flex;">
          <span style="color: #eef1f0;">search(q,&nbsp;</span>
          <span style="color: #1DB954;">['track',&nbsp;'artist']</span>
          <span style="color: #eef1f0;">)</span>
        </div>
        <div style="display: flex; margin-top: 20px;">
          the types promised more than the API delivers
        </div>
      </div>
    </div>

    <!-- right column: the "SearchResults" card -->
    <div
      style="
        display: flex;
        flex-direction: column;
        width: 420px;
        margin-left: 40px;
        background: #131718;
        border: 1px solid #34393a;
        border-radius: 12px;
        padding: 28px;
      "
    >
      <div
        style="
          font-family: monospace;
          font-size: 18px;
          color: #7c8688;
          margin-bottom: 20px;
          display: flex;
        "
      >
        SearchResults
      </div>

      <div
        v-for="f in realFields"
        :key="f.key"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #171c1d;
          border: 1px solid #34393a;
          border-radius: 8px;
          padding: 14px 16px;
          margin-bottom: 10px;
          font-family: monospace;
          font-size: 19px;
        "
      >
        <div style="display: flex;">
          <span style="color: #eef1f0; margin-right: 10px;">{{ f.key }}</span>
          <span style="color: #1DB954;">{{ f.type }}</span>
        </div>
        <div
          style="
            width: 20px;
            height: 20px;
            border-radius: 10px;
            border: 2px solid #1DB954;
            color: #1DB954;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          OK
        </div>
      </div>

      <div
        v-for="f in ghostFields"
        :key="f.key"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 2px dashed #3c4344;
          border-radius: 8px;
          padding: 14px 16px;
          margin-bottom: 10px;
          font-family: monospace;
          font-size: 19px;
        "
      >
        <div style="display: flex;">
          <span style="color: #3c4344; margin-right: 10px;">{{ f.key }}</span>
          <span style="color: #3c4344;">{{ f.type }}</span>
        </div>
        <div
          style="
            width: 20px;
            height: 20px;
            border-radius: 10px;
            border: 2px dashed #3c4344;
            color: #3c4344;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          ?
        </div>
      </div>
    </div>
  </div>
</template>
