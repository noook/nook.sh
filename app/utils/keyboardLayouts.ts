import { kleBounds, parseKle, type KleKey } from './kle'

// Keyboard drawings for boards without a photo. Each layout is a pair of
// files in app/assets/uses/layouts/:
//   <name>.kle.json     the KLE rows (a VIA definition's `layouts.keymap`
//                       works as is)
//   <name>.config.json  how to read them: roles, legends, fixes
// Once a board has a photo, delete its two files and its `drawing` block.

export type KeyRole = 'alpha' | 'mod' | 'accent' | 'knob'

interface LayoutConfig {
  /** 'label' (default): the whole KLE label. 'matrix': the first line, as VIA writes "row,col". */
  keyId?: 'label' | 'matrix'
  roles?: {
    /** KLE `c` value -> role. */
    byColor?: Record<string, KeyRole>
    /** Key id -> role, wins over the colour. */
    byKey?: Record<string, KeyRole>
    /** A key whose label ends with this is the knob (VIA marks encoders "e0"). */
    knobLabelSuffix?: string
  }
  /** 'label': the label is the legend. An object: key id -> legend. */
  legends?: 'label' | Record<string, string>
  /** Move non-rotated keys of a column (matrix ids) to a fixed x. */
  straighten?: { col: string, rows?: string[], x: number }[]
}

export interface PlateKey extends KleKey {
  role: KeyRole
  legend: string
  /** Balaguères "Giroflée" macro icon, written p1..p4 in the layout: 1 to 4 petals. */
  petals?: 1 | 2 | 3 | 4
}

const files = import.meta.glob<unknown>('../assets/uses/layouts/*.json', { eager: true, import: 'default' })

function layoutFiles(name: string) {
  const rows = files[`../assets/uses/layouts/${name}.kle.json`] as Parameters<typeof parseKle>[0] | undefined
  const config = (files[`../assets/uses/layouts/${name}.config.json`] ?? {}) as LayoutConfig
  if (!rows) throw new Error(`Unknown keyboard layout: ${name}`)
  return { rows, config }
}

export function keyboardPlate(name: string) {
  const { rows, config } = layoutFiles(name)
  const idOf = (k: KleKey) => (config.keyId === 'matrix' ? k.label.split('\n')[0] ?? '' : k.label)

  const raw = parseKle(rows)
  for (const fix of config.straighten ?? []) {
    for (const k of raw) {
      if (k.r !== 0) continue
      const [row, col] = idOf(k).split(',')
      if (col === fix.col && (!fix.rows || fix.rows.includes(row ?? ''))) k.x = fix.x
    }
  }

  const roleOf = (k: KleKey): KeyRole => {
    const { byColor = {}, byKey = {}, knobLabelSuffix } = config.roles ?? {}
    if (knobLabelSuffix && k.label.endsWith(knobLabelSuffix)) return 'knob'
    return byKey[idOf(k)] ?? byColor[k.c] ?? 'alpha'
  }
  const legendOf = (k: KleKey) => {
    if (k.ear || !config.legends) return ''
    return config.legends === 'label' ? k.label : config.legends[idOf(k)] ?? ''
  }

  const bounds = kleBounds(raw)
  const keys: PlateKey[] = raw.map((k) => {
    const legend = legendOf(k)
    const petals = /^p([1-4])$/.exec(legend)
    return {
      ...k,
      x: k.x - bounds.minX,
      y: k.y - bounds.minY,
      rx: k.rx - bounds.minX,
      ry: k.ry - bounds.minY,
      role: roleOf(k),
      legend: petals ? '' : legend,
      petals: petals ? (Number(petals[1]) as 1 | 2 | 3 | 4) : undefined,
    }
  })
  return { keys, width: bounds.width, height: bounds.height }
}
