// Starts downloading an image so it is already in the HTTP cache when it's
// shown, for example the full-size file behind a thumbnail on hover, focus
// or touch. Each URL is requested once per page load.
const requested = new Set<string>()

export function preloadImage(src: string | undefined) {
  if (!src || !import.meta.client || requested.has(src)) return
  requested.add(src)
  const img = new Image()
  img.decoding = 'async'
  img.src = src
}

// Preloads a few images once the page is idle, unless the visitor asked to
// save data or is on a slow connection. For the full-size files of a page
// that only has a handful of them.
export function preloadImagesWhenIdle(srcs: (string | undefined)[]) {
  if (!import.meta.client) return
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean, effectiveType?: string } }).connection
  if (connection?.saveData || (connection?.effectiveType && connection.effectiveType !== '4g')) return
  const run = () => srcs.forEach(preloadImage)
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 })
  else setTimeout(run, 2000)
}
