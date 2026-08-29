# Photographs for the "Hair System Benefits" section

Both are installed. Paths are declared once in `hairBenefitsData.media` in
`src/site.ts`.

| File | Used in | Size | Source |
| --- | --- | --- | --- |
| `card.png` | the blue teaser card, full bleed | 1600×832, RGBA | `Images/Hair System Benefits.png` (2240×1166, 2.20 MB) |
| `sheet.png` | the expanded sheet, right column | 1100×1090, RGBA | `Images/Hair System Benefits overlay.png` (1962×1944, 1.96 MB) |

Both are transparent cut-outs, and both were resized on install — together they
came to 4.2 MB as supplied and ship at 2.0 MB.

## Two things to know before editing either file

**`card.png` carries its own annotation.** The dashed hairline ellipse, the
curved arrow and the circular scalp inset with its white ring are all baked into
the picture. The component deliberately draws none of them. An earlier version
drew all three in CSS and SVG, when the photograph had not been supplied; those
were deleted the moment this file arrived, because keeping them would have put a
second ellipse on top of the first. If this file is ever replaced with a plain
portrait, the marks have to come back with it.

**Its left third is transparent on purpose.** That empty space is what the card's
headline column sits in, so the CSS does not reserve room for the copy — it just
lets the picture bleed edge to edge. A replacement that fills the full frame will
put the man behind the headline.

`Photo` in `src/components/HairBenefits.tsx` falls back to a labelled dashed
frame if either file is missing, so a rename shows a readable placeholder rather
than a broken-image glyph.
