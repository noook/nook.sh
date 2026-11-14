// Renders covers-src/<slug>/index.html to
// public/images/posts/<slug>/cover-{light,dark}.png — 1920 × 1080, deviceScaleFactor 1.
//
//   cd covers-src
//   npm i --no-save playwright && npx playwright install chromium
//   node render.mjs                 # every cover
//   node render.mjs sff-pc-build    # one or more slugs
import { chromium } from 'playwright'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { mkdirSync, readdirSync, existsSync } from 'node:fs'

const here = dirname(fileURLToPath(import.meta.url))
const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(here, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('_') && existsSync(resolve(here, d.name, 'index.html')))
      .map(d => d.name)

const browser = await chromium.launch(process.env.CHROME_CHANNEL ? { channel: process.env.CHROME_CHANNEL } : {})
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })

for (const slug of slugs) {
  const outDir = resolve(here, '../public/images/posts', slug)
  mkdirSync(outDir, { recursive: true })
  for (const theme of ['light', 'dark']) {
    const url = pathToFileURL(resolve(here, slug, 'index.html'))
    url.search = `?theme=${theme}`
    await page.goto(url.href)
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(() => Promise.all([...document.images].map(i => i.decode())))
    const path = resolve(outDir, `cover-${theme}.png`)
    await page.screenshot({ path, clip: { x: 0, y: 0, width: 1920, height: 1080 } })
    console.log(path)
  }
}

await browser.close()
