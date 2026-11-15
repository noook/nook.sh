import athena from '~/assets/uses/layouts/athena-1800.kle.json'
import nuphy from '~/assets/uses/layouts/nuphy-air75-v3.kle.json'
import q10 from '~/assets/uses/layouts/q10-max.kle.json'
import { kleBounds, parseKle, type KleKey } from './kle'

export type KeyRole = 'alpha' | 'mod' | 'accent' | 'knob'

export interface PlateKey extends KleKey {
  role: KeyRole
  /** Text legend, or empty. */
  legend: string
  /** Balaguères "Giroflée" macro icon: 1 to 4 petals. */
  petals?: 1 | 2 | 3 | 4
}

interface LayoutDef {
  rows: unknown[][]
  role: (k: KleKey) => KeyRole
  legend?: (k: KleKey) => string
  fix?: (k: KleKey) => void
}

// The Q10 Max layout is Keychron's VIA definition, untouched. VIA marks
// keys by matrix position ("row,col") and colours them #ccc / #aaa / #777.
const q10Matrix = (k: KleKey) => k.label.split('\n')[0] ?? ''

const q10Legends: Record<string, string> = {
  '0,1': 'esc', '0,2': 'F1', '0,3': 'F2', '0,4': 'F3', '0,5': 'F4', '0,6': 'F5', '0,7': 'F6', '0,8': 'F7', '0,9': 'F8', '0,10': 'F9', '0,11': 'F10', '0,12': 'F11', '0,13': 'F12', '0,14': 'ins', '0,15': 'del',
  '1,0': 'M1', '1,1': '`', '1,2': '1', '1,3': '2', '1,4': '3', '1,5': '4', '1,6': '5', '1,7': '6', '1,8': '7', '1,9': '8', '1,10': '9', '1,11': '0', '1,12': '-', '1,13': '=', '1,14': 'bksp', '1,15': 'pgup',
  '2,0': 'M2', '2,1': 'tab', '2,2': 'Q', '2,3': 'W', '2,4': 'E', '2,5': 'R', '2,6': 'T', '2,7': 'Y', '2,8': 'U', '2,9': 'I', '2,10': 'O', '2,11': 'P', '2,12': '[', '2,13': ']', '2,14': '\\', '2,15': 'pgdn',
  '3,0': 'M3', '3,1': 'caps', '3,2': 'A', '3,3': 'S', '3,4': 'D', '3,5': 'F', '3,6': 'G', '3,8': 'H', '3,9': 'J', '3,10': 'K', '3,11': 'L', '3,12': ';', '3,13': '\'', '3,14': 'enter', '3,15': 'home',
  '4,0': 'M4', '4,1': 'shift', '4,3': 'Z', '4,4': 'X', '4,5': 'C', '4,6': 'V', '4,7': 'B', '4,8': 'B', '4,9': 'N', '4,10': 'M', '4,11': ',', '4,12': '.', '4,13': '/', '4,14': 'shift', '4,15': '↑',
  '5,0': 'M5', '5,1': 'ctrl', '5,2': 'opt', '5,3': 'cmd', '5,7': 'fn', '5,9': 'cmd', '5,10': 'fn', '5,13': '←', '5,14': '↓', '5,15': '→',
}

// Stock colourway as seen on my board, where it differs from VIA's colours.
const q10RoleOverrides: Record<string, KeyRole> = {
  '1,0': 'mod', '2,0': 'mod', '3,0': 'mod', '4,0': 'mod', '5,0': 'mod',
  '0,2': 'alpha', '0,3': 'alpha', '0,4': 'alpha', '0,5': 'alpha',
  '0,10': 'alpha', '0,11': 'alpha', '0,12': 'alpha', '0,13': 'alpha',
  '5,4': 'mod', '5,8': 'mod',
}

const fromLetter = (k: KleKey): KeyRole =>
  k.c === 'k' ? 'knob' : k.c === 'm' ? 'mod' : k.c === 'acc' ? 'accent' : 'alpha'

const layouts: Record<string, LayoutDef> = {
  'athena-1800': {
    rows: athena as unknown[][],
    role: fromLetter,
    legend: k => k.label,
  },
  'nuphy-air75-v3': {
    rows: nuphy as unknown[][],
    role: fromLetter,
  },
  'q10-max': {
    rows: q10 as unknown[][],
    role(k) {
      const id = q10Matrix(k)
      if (k.label.endsWith('e0')) return 'knob'
      return q10RoleOverrides[id] ?? ({ '#aaaaaa': 'mod', '#777777': 'accent' } as Record<string, KeyRole>)[k.c] ?? 'alpha'
    },
    legend: k => q10Legends[q10Matrix(k)] ?? '',
    // VIA staggers the outer columns to suggest the angle. On the board the
    // macro column and the right-hand column (ins/del, pgup, pgdn, home)
    // are straight.
    fix(k) {
      if (k.r !== 0) return
      const [row, col] = q10Matrix(k).split(',')
      if (col === '0') k.x = 0
      if (col === '15' && ['0', '1', '2', '3'].includes(row ?? '')) k.x = 18.65
    },
  },
}

export function keyboardPlate(name: string) {
  const def = layouts[name]
  if (!def) throw new Error(`Unknown keyboard layout: ${name}`)
  const raw = parseKle(def.rows as Parameters<typeof parseKle>[0])
  raw.forEach(k => def.fix?.(k))
  const bounds = kleBounds(raw)
  const keys: PlateKey[] = raw.map((k) => {
    const legend = k.ear ? '' : (def.legend?.(k) ?? '')
    const petals = /^p([1-4])$/.exec(legend)
    return {
      ...k,
      x: k.x - bounds.minX,
      y: k.y - bounds.minY,
      rx: k.rx - bounds.minX,
      ry: k.ry - bounds.minY,
      role: def.role(k),
      legend: petals ? '' : legend,
      petals: petals ? (Number(petals[1]) as 1 | 2 | 3 | 4) : undefined,
    }
  })
  return { keys, width: bounds.width, height: bounds.height }
}
