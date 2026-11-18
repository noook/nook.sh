import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'

// /uses: one YAML file per keyboard and per switch set, plus one file for
// the rest of the setup. Months are 'YYYY-MM' strings so they sort as text.
const month = z.string().regex(/^\d{4}-\d{2}$/)
const slug = z.string().regex(/^[a-z0-9-]+$/)
const photo = z.object({ src: z.string(), alt: z.string(), credit: z.string().optional() })
const labelled = z.object({ name: z.string(), note: z.string().default('') })

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
    }),
    posts: defineCollection({
      type: 'page',
      source: 'posts/**/*.md',
      // Schema includes every custom frontmatter field the templates read
      // (blog.vue, posts/[...slug].vue) - zod strips unlisted keys by
      // default, so a partial schema would silently drop date/tags.
      schema: z.object({
        date: z.string(),
        tags: z.array(z.string()).default([]),
        // Cover image shown on the /blog listing card - optional, cards
        // fall back to a themed placeholder (see blog.vue) when unset so
        // the grid still looks intentional before real photos exist.
        // `image` is the light-mode (or single/theme-agnostic) cover;
        // `imageDark` is an optional dark-mode variant shown instead via
        // Tailwind's `dark:` class toggle (see blog.vue / posts/[...slug].vue)
        // - only relevant when a design genuinely needs different art per
        // theme rather than one image that already reads fine in both.
        image: z.string().optional(),
        imageDark: z.string().optional(),
        // Draft posts are excluded from listings and the sitemap always;
        // whether they 404 on direct URL access depends on environment -
        // see nuxt.config.ts runtimeConfig.showDrafts (visible in local
        // `nuxt dev` and on Cloudflare preview deploys, hidden only on the
        // real production build) and app/pages/blog.vue /
        // app/pages/posts/[...slug].vue for where that flag is consumed.
        draft: z.boolean().default(false),
        // Mock/example posts - filled-in fake content for local dev only
        // (testing layout, cover images, view transitions, etc against
        // something more realistic than an empty draft template). Unlike
        // `draft`, mock content is dev-only in every sense: never visible
        // on a Cloudflare preview deploy, not just hidden on production -
        // see app/pages/blog.vue / posts/[...slug].vue for the
        // import.meta.dev gate.
        mock: z.boolean().default(false),
        // sitemap filter always excludes drafts and mock content, in every
        // environment including preview deploys - neither should ever be
        // *advertised* to crawlers even when directly reachable for review.
        // This is deliberately unconditional, independent of
        // runtimeConfig.showDrafts / import.meta.dev.
        // Slug of the project this post is about (content/projects/<slug>.md).
        // The project page lists every post that points to it.
        project: z.string().optional(),
        sitemap: defineSitemapSchema({
          name: 'posts',
          filter: entry => !entry.draft && !entry.mock,
          z,
        }),
      }),
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**/*.md',
      schema: z.object({
        date: z.string(),
        tags: z.array(z.string()).default([]),
        type: z.enum(['code', 'irl']).default('code'),
        image: z.string().optional(),
        imageDark: z.string().optional(),
        draft: z.boolean().default(false),
        mock: z.boolean().default(false),
        // Short state shown in mono under the title: "v4 ㆍ in use", "live", "shut down".
        status: z.string().optional(),
        // A project that changes over time keeps its steps here, oldest first.
        versions: z.array(z.object({
          name: z.string(),
          at: z.string().optional(),
          line: z.string(),
          image: z.string().optional(),
          imageAlt: z.string().optional(),
        })).default([]),
        sitemap: defineSitemapSchema({
          name: 'projects',
          filter: entry => !entry.draft && !entry.mock,
          z,
        }),
      }),
    }),
    experience: defineCollection({
      type: 'data',
      source: 'experience.yml',
      // @nuxt/content's data collections do not support a bare YAML array
      // at the document root (it silently wraps it into a `body` field
      // instead, which broke rendering - the schema below expecting a
      // top-level array never actually matched the parsed data). Wrapping
      // the list under an `items` key is the supported shape.
      schema: z.object({
        items: z.array(z.object({
          title: z.string(),
          period: z.string(),
          company: z.string(),
          description: z.string(),
          // Set when the company or product no longer exists ("shut down").
          ended: z.string().optional(),
        })),
      }),
    }),
    usesKeyboards: defineCollection({
      type: 'data',
      source: 'uses/keyboards/*.yml',
      schema: z.object({
        order: z.number(),
        name: z.string(),
        edition: z.string(),
        status: z.enum(['in-use', 'shelf']),
        place: z.enum(['home', 'work']).optional(),
        line: z.string(),
        chips: z.array(z.string()).default([]),
        url: z.string().url().optional(),
        // A real photo wins. Without one, the card draws the board from
        // its KLE layout (app/utils/keyboardLayouts.ts) and this colorway.
        photo: photo.optional(),
        // More photos of the board, shown under the main one on its page.
        photos: z.array(photo).default([]),
        drawing: z.object({
          // File stem in app/assets/uses/layouts/ (<layout>.kle.json + <layout>.config.json).
          layout: z.string(),
          case: z.string(),
          // Keys get a role from the layout (alpha, mod, accent, knob);
          // each role maps to a cap colour and an optional legend colour.
          colors: z.record(z.string(), z.object({ cap: z.string(), legend: z.string().optional() })),
          legends: z.boolean().default(true),
          font: z.string().optional(),
          lowProfile: z.boolean().default(false),
          glossy: z.boolean().default(false),
          alt: z.string(),
        }).optional(),
        keycaps: z.object({
          title: z.string(),
          text: z.string(),
          legends: z.array(z.object({ key: z.string(), legend: z.string(), meaning: z.string() })).default([]),
          // Keys shown on the /uses card (by `key`); the board's own page shows all of them.
          featured: z.array(z.string()).default([]),
        }).optional(),
        specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
        // Board events for the swap log. Switch moves come from the
        // switch sets' own history.
        log: z.array(z.object({ at: month, what: z.string() })).default([]),
      }),
    }),
    usesSwitches: defineCollection({
      type: 'data',
      source: 'uses/switches/*.yml',
      schema: z.object({
        order: z.number(),
        name: z.string(),
        type: z.enum(['linear', 'tactile', 'silent tactile', 'clicky']),
        feel: z.string().default(''),
        note: z.string().optional(),
        // The card keeps an empty slot until there is one. Set `credit`
        // when the photo isn't mine (shop product shots).
        photo: photo.optional(),
        // Free-text location for a board that isn't on this page; wins
        // over the history.
        where: z.string().optional(),
        shop: z.object({ name: z.string(), url: z.string().url() }),
        // Purchase month, or the board it came with (stock switches).
        bought: month.optional(),
        stockWith: z.string().optional(),
        // `to` is a keyboard file stem, 'drawer' (or null) when boxed, or
        // any slug for a board that isn't on this page (pair it with
        // `where`). The last entry is where the set is now; no history
        // means the drawer.
        history: z.array(z.object({ at: month, to: slug.nullable() })).default([]),
      }),
    }),
    usesSetup: defineCollection({
      type: 'data',
      source: 'uses/setup.yml',
      schema: z.object({
        intro: z.string(),
        updated: z.string(),
        desk: z.object({
          photo,
          // x/y are percentages on the photo; items without them are
          // listed but get no dot.
          items: z.array(labelled.extend({ x: z.number().optional(), y: z.number().optional() })),
        }),
        pc: z.object({
          name: z.string(),
          summary: z.string(),
          photo,
          post: z.string(),
          // The project page, when the build has one: the Computers card links there first.
          project: z.string().optional(),
          parts: z.array(z.object({ label: z.string(), value: z.string() })),
        }),
        machines: z.array(z.object({
          kind: z.string(),
          name: z.string(),
          note: z.string(),
          link: z.object({ label: z.string(), url: z.string() }).optional(),
        })),
        software: z.array(z.object({
          name: z.string(),
          icon: z.string(),
          line: z.string(),
          config: z.object({ path: z.string(), body: z.string() }).optional(),
        })),
        kits: z.array(z.object({ title: z.string(), items: z.array(labelled) })),
      }),
    }),
  },
})
