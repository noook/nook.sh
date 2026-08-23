export default defineAppConfig({
  theme: {
    radius: 0.25,
    blackAsPrimary: false,
  },
  ui: {
    colors: {
      primary: 'indigo',
      neutral: 'slate',
    },
    prose: {
      // Inline `code` in @nuxt/ui's default theme uses a real 1px border,
      // which adds to the element's box height (20px text-sm line-height +
      // 4px py-0.5 padding + 2px border = 26px) and makes any prose line
      // containing inline code taller than a plain-text line (24px, from
      // Tailwind's text-base/leading-normal). That mismatch is what causes
      // the visible line-height jump between paragraphs with and without
      // inline code on blog posts.
      // Swapping the border for an inset ring (box-shadow) keeps the same
      // visual outline without adding to layout height: 20px + 4px = 24px,
      // exactly matching the surrounding paragraph's line-height.
      code: {
        variants: {
          color: {
            neutral: 'border-0 ring ring-inset ring-muted text-highlighted bg-muted',
          },
        },
      },
    },
  },
  socials: [
    {
      label: 'GitHub',
      icon: 'mdi:github',
      url: 'https://github.com/noook',
    },
    {
      label: 'Bluesky',
      icon: 'carbon:logo-bluesky',
      url: 'https://bsky.app/profile/nook.sh',
    },
    {
      label: 'Instagram',
      icon: 'mdi:instagram',
      url: 'https://www.instagram.com/neil_rcht/',
    },
    {
      label: 'LinkedIn',
      icon: 'mdi:linkedin',
      url: 'https://www.linkedin.com/in/neilrichter/',
    },
    {
      label: 'Twitter / X',
      icon: 'mdi:twitter',
      url: 'https://twitter.com/_nooooook',
    },
    {
      label: 'Spotify',
      icon: 'mdi:spotify',
      url: 'https://open.spotify.com/user/frumyk',
    },
  ],
})
