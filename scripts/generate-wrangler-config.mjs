#!/usr/bin/env node
// Generates wrangler.jsonc from wrangler.jsonc.example, substituting the
// real D1 database_id for the current build. This keeps both database ids
// out of the template that ships in git-tracked example form, while still
// letting Nitro's cloudflare-module preset and `wrangler deploy` find a
// real wrangler.jsonc every build.
//
// Which database gets used is picked automatically from
// WORKERS_CI_DEFAULT_BRANCH, the same Cloudflare Workers Builds env var
// nuxt.config.ts reads for runtimeConfig.public.showDrafts - "true" means
// this build is the production branch, anything else (including unset,
// e.g. local dev) means a preview build:
//   - production branch build -> PRODUCTION_D1_DATABASE_ID
//   - preview build (any other branch, local dev)
//     -> PREVIEW_D1_DATABASE_ID
//
// Deliberately two SEPARATE databases, not one shared id read from an env
// var: @nuxt/content syncs its D1 content index from the markdown checked
// out in the current build, and previews build from PR branches that can
// contain unpublished/in-progress content. A shared database means a
// preview build's content sync can overwrite the index production reads
// from live, transiently serving unreleased content on the real domain
// until production's next deploy re-syncs it back. Separate databases
// make that impossible - a preview build can only ever touch the preview
// database. Neither id is a secret (no credential lets you do anything
// with it beyond querying content that's public once merged anyway), see
// README's Deployment section - only kept out of the template for tidiness
// and because trying to source this from a Cloudflare Workers Builds
// dashboard env var proved unreliable in practice (the build step never
// observed CF_D1_DATABASE_ID despite it being set correctly there).

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const templatePath = join(root, 'wrangler.jsonc.example')
const outputPath = join(root, 'wrangler.jsonc')

const PRODUCTION_D1_DATABASE_ID = '8192bc2d-6882-4113-9968-7f0276ac4864'
const PREVIEW_D1_DATABASE_ID = '7ce96675-78ae-427b-91c8-66f84fad9d29'

const isProductionBranch = process.env.WORKERS_CI_DEFAULT_BRANCH === 'true'
const databaseId = isProductionBranch ? PRODUCTION_D1_DATABASE_ID : PREVIEW_D1_DATABASE_ID

const template = readFileSync(templatePath, 'utf-8')
const output = template.replaceAll('__D1_DATABASE_ID__', databaseId)
writeFileSync(outputPath, output)
console.log(
  `[wrangler-config] wrote wrangler.jsonc using the ${isProductionBranch ? 'PRODUCTION' : 'PREVIEW'} D1 database.`,
)
