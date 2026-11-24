export type TextSegment = { text: string, url?: string }

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Splits plain text so the names in `links` can be rendered as links.
// Only the first mention of each name is linked; longer names win
// ("Nuxt UI" before "Nuxt").
export function linkSegments(text: string, list: { text: string, url: string }[] = []): TextSegment[] {
  const links = Object.fromEntries(list.map(l => [l.text, l.url]))
  const names = Object.keys(links).sort((a, b) => b.length - a.length)
  if (!names.length) return [{ text }]

  const pattern = new RegExp(`(?<![\\w@/])(${names.map(escape).join('|')})(?![\\w/])`, 'g')
  const seen = new Set<string>()
  const segments: TextSegment[] = []
  let last = 0
  for (const match of text.matchAll(pattern)) {
    const name = match[0]
    if (seen.has(name)) continue
    seen.add(name)
    if (match.index > last) segments.push({ text: text.slice(last, match.index) })
    segments.push({ text: name, url: links[name] })
    last = match.index + name.length
  }
  if (last < text.length) segments.push({ text: text.slice(last) })
  return segments
}
