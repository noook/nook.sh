# nook — Logo guidelines

## 1. The logo

**Idea:** 눅 (nook, in Hangul) reduced to its two consonants. ㄴ and ㄱ are the same corner turned 180°, nesting into each
other. ㄴ is also, literally, a nook: a sheltered corner. It is the one that carries the colour.

**Construction:** one stroke (28/256), one gap (16/256), only right angles. The ㄱ is the ㄴ rotated 180° around the
centre. The wordmark's letters use the same stroke logic, and its **k** reuses the ㄱ.

| Version | Files |
|---|---|
| Horizontal lockup (primary) | `lockup-horizontal-{light,dark,black,white,indigo}.svg` |
| Stacked lockup | `lockup-stacked-*.svg` |
| Symbol | `symbol-*.svg` |
| Symbol, small cut (≤ 48 px) | `symbol-small-*.svg` — heavier strokes, 2 px gap, snapped to a 16 px grid |
| Wordmark only | `wordmark-*.svg` |
| Web icons | `web/` — `favicon.svg` (switches with light/dark mode), `favicon.ico`, PNGs, `site.webmanifest` |

`light` = for light backgrounds, `dark` = for dark backgrounds.

## 2. Clear space

Keep a clear zone of **two strokes** (2 × the width of the ㄴ's vertical stroke) around the logo on every side. It
scales with the logo.

## 3. Minimum size

| Version | Screen |
|---|---|
| Horizontal lockup | 96 px wide |
| Stacked lockup | 48 px wide |
| Symbol | 16 px — use the **small cut** from 48 px and below |

## 4. Colour

| Name | Role | HEX | RGB |
|---|---|---|---|
| Indigo 500 | ㄴ on light | `#6366F1` | 99 102 241 |
| Indigo 400 | ㄴ on dark | `#818CF8` | 129 140 248 |
| Slate 900 | ㄱ and wordmark on light, tile background | `#0F172A` | 15 23 42 |
| Slate 50 | ㄱ and wordmark on dark | `#F8FAFC` | 248 250 252 |

These are Tailwind's `indigo` and `slate`, the same colours nook.sh uses (`primary: 'indigo'`, `neutral: 'slate'`).
For print, convert from these and check a physical swatch. No CMYK/Pantone match has been verified.

**Colour rules:**
- The **ㄴ is always the indigo piece**. Never swap the colours.
- One-colour versions (black, white, indigo) are fine anywhere two colours aren't possible.
- On photos, use the white or black version on a calm area, or the symbol on its slate tile.

## 5. Typography

The wordmark is custom geometry, not a font, so there is nothing to license. Never retype "nook" in a font in place of the
wordmark. Site text keeps its own type.

## 6. Don'ts

- Don't rotate or mirror the symbol. It looks the same turned 180°, but at 90° or mirrored it becomes a different shape.
- Don't change the gap or the overlap between the two pieces.
- Don't use the large symbol below 48 px. Use the small cut.
- Don't add outlines, shadows, gradients or rounded corners.
- Don't rearrange or resize the parts of a lockup.

## 7. Notes

- Trademark: no clearance search has been done. Run a reverse image search before any commercial use.
- Masters: everything is regenerated from `gen_kit.py` (the geometry lives there, in a few lines).
