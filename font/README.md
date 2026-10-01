# Fonts — source archive

Original font files and their licences. **Nothing in this directory is served**
(it sits outside `public/` and outside tsconfig's `include`), so it never
reaches the build output. The site loads web font formats from
`src/assets/` and `node_modules/@fontsource*`.

## Gilroy — Radomir Tinkov

|              |                                                                        |
| ------------ | ---------------------------------------------------------------------- |
| Licence      | `Gilroy-FREE/Radomir Tinkov Free Font EULA .pdf` (v. January 01, 2016) |
| Copyright    | © 2016 Radomir Tinkov. All rights reserved. (`www.tinkov.info`)        |
| Weights held | Light (300), ExtraBold (800) — upright only                            |
| Served as    | `src/assets/fonts/Gilroy-{Light,ExtraBold}.woff2`                      |

The woff2 files in `src/assets/fonts/` are **not** in `Gilroy-FREE/` — they
were generated locally from these OTFs.

The OTFs themselves are intentionally absent from this repository: clause (f),
quoted below, forbids distributing the Font or making it available to any third
party, and a tracked file in a public repo is exactly that. The originals come
from the foundry download and are not redistributed here. The two `.woff2` files
in `src/assets/fonts/` are the only Gilroy formats this project serves, and they
are the only ones that reach the build.

### What the licence allows, and the one constraint that bites

Relevant clauses, quoted verbatim from the PDF:

> Radomir Tinkov grants you a perpetual, worldwide, non-exclusive and
> non-transferrable license to: a) Download, install and use the Font solely
> for your personal and commercial purposes strictly in accordance with the
> terms of this Agreement.

> h) You may generate web font formats from the Font and use the generated
> Font on websites via @font-face.

> e) You may import and alter the bezier outlines of the Font in a drawing
> program.You may not modify the Font or create derivative works based on the
> Font without prior written consent from Radomir Tinkov.

> f) You agree not to, and you will not permit others to modify, sell, rent,
> lease, assign, distribute, adapt or otherwise commercially exploit the Font
> or make the Font available to any third party.

So commercial use and `@font-face` web delivery are both explicitly granted.
Two rules follow for this repo:

1. **Never publish the `.otf`.** Clause (h) covers the _generated web font
   formats_; clause (f) forbids distributing the Font itself. The `.otf` files
   were previously emitted into `.vercel/output/static/assets/`, i.e. publicly
   fetchable from the CDN. They were also dead weight — a woff2-capable
   browser never fetched them. They are now deleted from `src/assets/fonts/`
   and dropped from the `src` lists in `src/styles.css`.
2. **Never subset, rebuild or otherwise derive.** Clause (e). Ship the two
   weights as-issued.

The licence contains no attribution requirement, but keep this file: it is the
only pointer from the shipped fonts to their terms.

### Metrics (measured, not copied from spec sheets)

`unitsPerEm` 1000 · x-height 0.500 · cap-height 0.700 · x/cap 0.714 ·
554 glyphs. Identical across both weights, so the Light/ExtraBold pairing
cannot differ in vertical rhythm. That single-weight-per-style setup is why a
variable replacement needs one file to cover both used weights.
