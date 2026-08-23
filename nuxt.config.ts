// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    // Must precede @nuxt/content: injects the Shiki twoslash transformer
    // that @nuxt/content's MDC renderer picks up for ```ts twoslash fences.
    'nuxt-content-twoslash',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-og-image',
  ],

  devtools: { enabled: true },

  app: {
    head: {
      titleTemplate: '%s — Neil Richter',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
    // Native browser View Transitions API (progressive enhancement - a
    // no-op on browsers without document.startViewTransition, and Nuxt
    // itself skips it automatically when the user has
    // prefers-reduced-motion set). Cross-fades page content on route
    // change; per-element shared transitions (card image -> hero image)
    // are opt-in via view-transition-name in CSS, see
    // app/assets/css/main.css.
    viewTransition: true,
  },

  css: ['~/assets/css/main.css'],

  // Canonical origin - used by @nuxtjs/sitemap, @nuxtjs/robots (sitemap
  // reference), and nuxt-og-image (absolute OG image URLs) to build
  // absolute URLs. www.nook.sh redirects to this apex at the app level
  // (server/middleware/www-redirect.ts), so this is the one true origin.
  site: {
    url: 'https://nook.sh',
  },

  // Baked at build time (not a runtime env read - Cloudflare Workers Builds
  // only exposes these vars to the build step, not to the deployed Worker's
  // runtime). WORKERS_CI_DEFAULT_BRANCH is Cloudflare's own signal for
  // "this build is the production branch" ("true") vs a preview build for
  // any other branch ("false") - see
  // https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#environment-variables
  //
  // Deliberately safe-by-default: showDrafts is true ONLY when Cloudflare
  // explicitly tells us this is a known Workers Builds preview build
  // (WORKERS_CI_DEFAULT_BRANCH === 'false'). Every other case - including
  // unset - defaults to hidden. This var is only ever set when the build
  // runs through Workers Builds' git integration; any build/deploy outside
  // that path (a manual `wrangler deploy` from a laptop, a CI job that
  // isn't Workers Builds, etc.) never has it set at all, and an unset var
  // must NOT be treated the same as a known preview build - that previously
  // let a real production deploy through this path serve every draft and
  // mock post/project live on nook.sh (checked against `!== 'true'`, which
  // defaults to *visible*). Local `nuxt dev` doesn't depend on this flag at
  // all - see the separate `import.meta.dev` bypass in
  // app/pages/{blog,posts/[...slug],projects/index,projects/[...slug]}.vue,
  // which already shows everything (including mocks) unconditionally.
  // See content.config.ts for the always-on sitemap exclusion.
  runtimeConfig: {
    public: {
      showDrafts: process.env.WORKERS_CI_DEFAULT_BRANCH === 'false',
    },
  },

  // app.viewTransition above only sets the *runtime* enabled flag - the
  // client plugin that actually calls document.startViewTransition on
  // navigation is only registered at build time when this experimental
  // flag is also set (confirmed by reading Nuxt's own module registration
  // logic, node_modules/nuxt/dist/index.mjs: `if
  // (nuxt.options.experimental.viewTransition) addPlugin(...)`). Both are
  // required together, app.viewTransition alone is a silent no-op.
  experimental: {
    viewTransition: true,
  },
  compatibilityDate: '2025-07-15',

  // Deploy target: Cloudflare Workers (unified Workers+static-assets, the
  // current default Cloudflare recommends for new projects - not classic
  // "Pages"). @nuxt/content auto-detects any `cloudflare*` preset and
  // switches its database to Cloudflare D1 (binding name `DB`) regardless
  // of which cloudflare preset is used - no manual database config needed,
  // see node_modules/@nuxt/content/dist/module.mjs setupNitro().
  nitro: {
    preset: 'cloudflare-module',
  },

  vite: {
    optimizeDeps: {
      include: ['tailwindcss/colors'],
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },

  // @nuxt/icon's "server" provider (the default whenever ssr is on - see
  // node_modules/@nuxt/icon .../module.mjs, provider = ssr && !static ?
  // 'server' : 'iconify') has a real bug: its runtime plugin points
  // Iconify's fetcher at useRequestFetch().native, which is ofetch's raw,
  // un-wrapped global fetch (see node_modules/ofetch dist/shared/ofetch...
  // .mjs: `$fetch.native = (...args) => fetch(...args)`) - no baseURL
  // resolution at all. The plugin then builds a *relative* resource URL
  // (`/api/_nuxt_icon`), and Node's native fetch cannot resolve a relative
  // URL during SSR - confirmed directly: `fetch('/api/_nuxt_icon/...')`
  // throws `TypeError: Failed to parse URL`. @nuxt/icon's loadIcon()
  // silently swallows that as the `[Icon] failed to load icon X` ssr:warn.
  // This hits every icon that isn't pre-bundled at build time - which by
  // default is only @nuxt/ui's ~43 built-in UI icons (chevrons, arrows,
  // etc.), not any custom icon= usage in app code (ThemePicker's
  // i-lucide-swatch-book, the socials list's mdi:*/carbon:* icons).
  // `clientBundle.scan: true` has Nuxt Icon compile every icon actually
  // referenced into the build-time bundle - the same mechanism the 43 UI
  // icons already use - so those icons are registered before the
  // component ever needs to fall back to the broken runtime fetch path.
  // See also the @iconify-json/mdi and @iconify-json/carbon
  // devDependencies added alongside this (without them scan can still
  // resolve icons over the network at *build* time, but local packages
  // make that resolution offline-safe and match how lucide is already
  // handled).
  //
  // Default scan globs are `**/*.{vue,jsx,tsx,md,mdc,mdx,yml,yaml}` - no
  // `.ts`, so icon strings living in plain TypeScript files (the socials
  // list's mdi:*/carbon:* icons in app/app.config.ts) are invisible to
  // the scanner and still hit the broken runtime path even with scan on.
  // Adding `ts` picks those up too.
  icon: {
    clientBundle: {
      scan: {
        globInclude: ['**/*.{vue,jsx,tsx,ts,md,mdc,mdx,yml,yaml}'],
      },
    },
  },

  // robots.txt is now generated by @nuxtjs/robots (replaces the old
  // static public/robots.txt) - allow everything, module auto-references
  // the sitemap.
  robots: {
    disallow: [],
  },

  // nuxt-content-twoslash defaults includeNuxtTypes to true, which prepends
  // a `/// <reference path=".../.nuxt/nuxt.d.ts" />` to every `ts twoslash`
  // block so samples can use Nuxt auto-imports/composables. That reference
  // path isn't resolving in this project (file-not-found error 6053 from
  // twoslash itself), and once that reference fails the TS compiler context
  // twoslash builds breaks badly enough that even plain lib.es5 globals
  // (`Pick`, `Required`) stop resolving - not a real types-availability
  // problem, an artifact of the broken reference injection. None of the
  // current twoslash content (content/posts/spotify-sdk-search-types.md)
  // uses Nuxt composables/auto-imports - it's self-contained TypeScript -
  // so turning this off avoids the broken injection entirely. Revisit if a
  // future twoslash sample needs real Nuxt types.
  //
  // Separately (and this was the actual root cause of Pick/Required not
  // resolving, confirmed by reproducing directly against twoslash-vue's
  // createTwoslasher outside Nuxt entirely): the module's own default
  // compilerOptions passes `lib: ['esnext', 'dom']` - short-form lib
  // names. TypeScript's compiler API only expands those short names when
  // parsing a real tsconfig.json; passed directly as a compilerOptions
  // object (as twoslash does here) they're not resolved, so no lib -
  // including lib.es5.d.ts, hence `Pick`/`Required` etc. going missing -
  // ever gets loaded. Full filenames (`lib.esnext.d.ts`, `lib.dom.d.ts`)
  // work correctly and are what this overrides to.
  twoslash: {
    includeNuxtTypes: false,
    compilerOptions: {
      lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'],
    },
  },
})
