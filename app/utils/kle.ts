// Minimal parser for keyboard-layout-editor (KLE) JSON, the format VIA
// definitions ship under `layouts.keymap`. It covers what our layouts use:
// x/y offsets, w/h sizes, w2/h2/x2/y2 (ISO Enter), rotation (r/rx/ry) and
// the `c` colour, which the layouts reuse as a role hint.

export interface KleKey {
  x: number
  y: number
  w: number
  h: number
  r: number
  rx: number
  ry: number
  c: string
  label: string
  /** Second rectangle of a stepped key (the top of an ISO Enter). */
  ear?: boolean
}

type KleItem = string | Record<string, number | string>

export function parseKle(rows: KleItem[][]): KleKey[] {
  const keys: KleKey[] = []
  let x = 0
  let y = 0
  let r = 0
  let rx = 0
  let ry = 0
  let c = ''
  let next = { w: 1, h: 1, w2: 0, h2: 0, x2: 0, y2: 0 }

  for (const row of rows) {
    for (const item of row) {
      if (typeof item !== 'string') {
        const p = item
        if (p.r != null) r = Number(p.r)
        if (p.rx != null) {
          rx = Number(p.rx)
          x = rx
          y = ry
        }
        if (p.ry != null) {
          ry = Number(p.ry)
          x = rx
          y = ry
        }
        x += Number(p.x ?? 0)
        y += Number(p.y ?? 0)
        if (p.c != null) c = String(p.c)
        next = {
          w: Number(p.w ?? next.w),
          h: Number(p.h ?? next.h),
          w2: Number(p.w2 ?? 0),
          h2: Number(p.h2 ?? 0),
          x2: Number(p.x2 ?? 0),
          y2: Number(p.y2 ?? 0),
        }
        continue
      }

      const base = { r, rx, ry, c, label: item }
      // The ear is pushed first so the main rectangle paints over the overlap.
      if (next.w2 || next.h2 || next.x2 || next.y2) {
        keys.push({ ...base, x: x + next.x2, y: y + next.y2, w: next.w2 || next.w, h: next.h2 || next.h, ear: true })
      }
      keys.push({ ...base, x, y, w: next.w, h: next.h })
      x += next.w
      next = { w: 1, h: 1, w2: 0, h2: 0, x2: 0, y2: 0 }
    }
    y += 1
    x = rx
  }
  return keys
}

/** Bounding box of the keys once rotated, in key units. */
export function kleBounds(keys: KleKey[]) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const k of keys) {
    const a = (k.r * Math.PI) / 180
    const cos = Math.cos(a)
    const sin = Math.sin(a)
    for (const [px, py] of [[k.x, k.y], [k.x + k.w, k.y], [k.x, k.y + k.h], [k.x + k.w, k.y + k.h]] as const) {
      const dx = px - k.rx
      const dy = py - k.ry
      const X = k.rx + dx * cos - dy * sin
      const Y = k.ry + dx * sin + dy * cos
      minX = Math.min(minX, X)
      minY = Math.min(minY, Y)
      maxX = Math.max(maxX, X)
      maxY = Math.max(maxY, Y)
    }
  }
  return { minX, minY, width: maxX - minX, height: maxY - minY }
}
