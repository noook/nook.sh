// Renders covers-src/<slug>/index.html to
// public/images/posts/<slug>/cover-{light,dark}.png — 1920 × 1080, deviceScaleFactor 1.
// A cover can write elsewhere with <meta name="cover-out" content="projects/<slug>">
// (relative to public/images). With <meta name="cover-shots" content="a,b">, the
// folder's shot.html is also rendered as shot-<a>-{light,dark}.jpg, 1600 × 900.
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

const meta = name => page.evaluate(n => document.querySelector(`meta[name="${n}"]`)?.content ?? null, name)

for (const slug of slugs) {
  await page.goto(pathToFileURL(resolve(here, slug, 'index.html')).href)
  const outDir = resolve(here, '../public/images', (await meta('cover-out')) ?? `posts/${slug}`)
  const shots = (await meta('cover-shots'))?.split(',').map(s => s.trim()).filter(Boolean) ?? []
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
  if (shots.length) {
    await page.setViewportSize({ width: 1600, height: 900 })
    for (const shot of shots) {
      for (const theme of ['light', 'dark']) {
        const url = pathToFileURL(resolve(here, slug, 'shot.html'))
        url.search = `?img=${shot}&theme=${theme}`
        await page.goto(url.href)
        await page.evaluate(() => Promise.all([...document.images].map(i => i.decode())))
        const path = resolve(outDir, `shot-${shot}-${theme}.jpg`)
        await page.screenshot({ path, type: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: 1600, height: 900 } })
        console.log(path)
      }
    }
    await page.setViewportSize({ width: 1920, height: 1080 })
  }
}

await browser.close()
