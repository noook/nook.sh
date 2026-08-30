<script setup lang="ts">
// OG card for the Bluesky/AT Proto post: federated-network concept (a
// highlighted PDS node in a small mesh of independent servers, contrasted
// with a single dashed "centralized oauth" node), rebuilt for the Takumi
// renderer (flexbox + inline styles only - no CSS grid, box-shadow,
// backdrop-filter, or @import'd fonts, no SVG lines - so the mesh here
// is approximated with positioned boxes instead of the browser mockup's
// SVG connector lines).
defineProps<{
  title?: string
}>()

const accent = '#1d7fb9'
const accent2 = '#4fc0e8'
const bg = '#0b0d0e'
const surface = '#131718'
const border = '#262b2c'
const borderStrong = '#34393a'
const ink = '#eef1f0'
const muted = '#7c8688'
const ghost = '#3c4344'

const peers = ['pds.example', 'self-hosted', 'provider.dev', 'social.coop']
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
    <!-- left column: kicker, title, resolution chain -->
    <div
      style="
        display: flex;
        flex-direction: column;
        width: 600px;
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
              background: #1d7fb9;
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
            OPEN SOURCE - AT PROTOCOL
          </div>
        </div>

        <div
          style="
            font-size: 44px;
            font-weight: 700;
            color: #eef1f0;
            line-height: 1.2;
            margin-top: 28px;
            display: flex;
          "
        >
          {{ title || 'Implementing a new kind of authentication' }}
        </div>
      </div>

      <div
        style="
          display: flex;
          flex-direction: column;
          font-family: monospace;
          font-size: 22px;
          color: #7c8688;
          line-height: 1.9;
        "
      >
        <div style="display: flex;">
          <span style="width: 90px;">handle</span>
          <span style="color: #eef1f0;">@user.bsky.social</span>
        </div>
        <div style="display: flex;">
          <span style="width: 90px;">did</span>
          <span style="color: #4fc0e8;">did:plc:z72i7...</span>
        </div>
        <div style="display: flex;">
          <span style="width: 90px;">pds</span>
          <span style="color: #4fc0e8;">bsky.social</span>
        </div>
      </div>
    </div>

    <!-- right column: federated mesh (approximated with boxes, no SVG) -->
    <div
      style="
        display: flex;
        flex-direction: column;
        width: 380px;
        margin-left: 40px;
        justify-content: center;
      "
    >
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #131718;
          border: 2px solid #1d7fb9;
          border-radius: 10px;
          padding: 18px 20px;
          margin-bottom: 16px;
        "
      >
        <div
          style="
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background: #4fc0e8;
            margin-bottom: 8px;
          "
        />
        <div style="font-family: monospace; font-size: 20px; color: #eef1f0; font-weight: 600;">
          bsky.social
        </div>
        <div style="font-family: monospace; font-size: 15px; color: #4fc0e8; margin-top: 4px;">
          your account
        </div>
      </div>

      <div
        v-for="peer in peers"
        :key="peer"
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #171c1d;
          border: 1px solid #34393a;
          border-radius: 8px;
          padding: 12px 18px;
          margin-bottom: 8px;
          font-family: monospace;
          font-size: 17px;
        "
      >
        <span style="color: #7c8688;">{{ peer }}</span>
        <span style="color: #3c4344; font-size: 14px;">independent</span>
      </div>

      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 2px dashed #3c4344;
          border-radius: 8px;
          padding: 12px 18px;
          margin-top: 8px;
          font-family: monospace;
          font-size: 17px;
        "
      >
        <span style="color: #3c4344;">oauth.provider</span>
        <span style="color: #3c4344; font-size: 14px;">single issuer</span>
      </div>
    </div>
  </div>
</template>
