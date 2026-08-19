#!/usr/bin/env node
// Generates wrangler.jsonc from wrangler.jsonc.example, substituting the
// real D1 database_id from an environment variable. This keeps the
// database_id out of git while still letting Nitro's cloudflare-pages
// preset and `wrangler pages dev/deploy` find a real wrangler.jsonc.
//
// Usage:
//   CF_D1_DATABASE_ID=<uuid> node scripts/generate-wrangler-config.mjs
//
// Run automatically as a "prebuild" step (see package.json) for local
// builds. On Cloudflare Pages' git integration, set CF_D1_DATABASE_ID as
// a project environment variable in the dashboard (Settings > Environment
// variables) - it does not need to be a "secret", it's not sensitive, this
// is purely to keep infra resource ids out of the public repo.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const templatePath = join(root, 'wrangler.jsonc.example')
const outputPath = join(root, 'wrangler.jsonc')

const databaseId = process.env.CF_D1_DATABASE_ID

if (!databaseId) {
  if (existsSync(outputPath)) {
    console.log('[wrangler-config] CF_D1_DATABASE_ID not set, keeping existing wrangler.jsonc as-is.')
    process.exit(0)
  }
  console.warn(
    '[wrangler-config] CF_D1_DATABASE_ID is not set and no wrangler.jsonc exists yet.\n'
    + '  Local dev/build against the Cloudflare preset will fail to find the D1 binding.\n'
    + '  Set CF_D1_DATABASE_ID (see README Deployment section) or create wrangler.jsonc manually.',
  )
  process.exit(0)
}

const template = readFileSync(templatePath, 'utf-8')
const output = template.replaceAll('__CF_D1_DATABASE_ID__', databaseId)
writeFileSync(outputPath, output)
console.log(`[wrangler-config] wrote wrangler.jsonc with database_id from CF_D1_DATABASE_ID.`)
