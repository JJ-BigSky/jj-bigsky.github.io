# Beyond HTML: documents, decks, spreadsheets, diagrams, email

The language translates as long as the three habits survive: one accent used
like red pencil, hairlines instead of fills, mono uppercase for anything that
labels or measures.

## Colors (hex, for any tool)

| Role | Hex |
| --- | --- |
| Paper background | `ECE9E2` |
| Panel | `F4F2ED` |
| Ink (text, rules, primary fills) | `141414` |
| Muted text | `66635E` |
| Hairline | `D6D3CC` (ink at 14% on paper, pre-blended) |
| Strong line | `A6A39C` |
| Accent | `FF4A00` |
| OK / Warn / Danger | `2F8F5B` / `C98F00` / `C62F1B` |
| Series 1–8 | `FF4A00` `2C5DD6` `B8860B` `8B5E3C` `C62F1B` `3F7D4E` `1F8A70` `5B5B5B` |

## Fonts when web fonts aren't available (Word, PowerPoint, PDF tools)

| Role | First choice | If not installed |
| --- | --- | --- |
| Headings | Archivo Black / Archivo ExtraBold | Arial Black, then Helvetica Bold |
| Body | Archivo Regular | Arial / Helvetica |
| Accent italic | Instrument Serif Italic | Georgia Italic |
| Labels, captions, tables | JetBrains Mono | Menlo, Consolas, Courier New |

Headings uppercase for section titles, sentence case for a document title.
Never letter-space body text; do letter-space mono labels (+10%).

## Word / PDF documents (docx, pdf skills)

- Page background stays white in print contexts; the paper tint is for screens. Use paper `ECE9E2` only for shaded panels.
- Title block: mono eyebrow (`01 // PROPOSAL`) with a short orange rule above it, then the title in heavy heading font, then a one-line italic serif subtitle in muted.
- Section headings numbered (`02 // SCOPE`) in mono, then the heading. A hairline `D6D3CC` under each heading.
- Tables: header row text mono uppercase muted, header underline ink 1pt, body rows hairline 0.5pt, numbers right-aligned bold.
- Callouts: left border 3pt accent, no fill, or fill panel `F4F2ED`.
- Bullets: square glyph (▪) in accent.
- Footer: mono, `BIG SKY SYSTEMS // ROBOTICS LAB CONSULTING · jj@bigsky.systems · page n`.

## Slides (pptx skill)

- Background `ECE9E2`, no gradients, no templates with swooshes.
- One idea per slide. Title slide: eyebrow, big heading with one italic accent word, a `FIG.` caption bottom-right.
- Section divider: huge Archivo numeral (`02`) in ink at 30% opacity behind the title.
- Charts: series palette above, hairline gridlines, mono axis labels, no 3D, no data-label clutter; highlight the one series that matters in accent and set the others in `5B5B5B`.
- Photos: none unless real. Diagrams: ink line art with one accent path.
- Footer strip: hairline with mono page number and `BIG SKY SYSTEMS`.

## Spreadsheets (xlsx skill)

- Header row: ink fill `141414`, paper text, mono-style font (Consolas/Menlo) 9pt uppercase.
- Body: Arial/Archivo 10pt, hairline borders `D6D3CC`, numbers right-aligned, totals row bold with a 1pt ink top border.
- Conditional formatting uses `2F8F5B` / `C98F00` / `C62F1B` fills at 15% tint, never traffic-light red/green saturated fills.
- Accent `FF4A00` only for the single input cell or the headline number.

## SVG diagrams

- Line art: ink 1–1.5px strokes, `stroke-linecap: square`, no fills except panel `F4F2ED` behind labeled boxes.
- Labels in mono uppercase 10–11px, muted; the one thing the diagram is about in accent.
- Corner marks on the drawing frame; a `FIG. n` caption with a 1px accent left rule.
- Arrows: 1.2px lines with a small filled triangle, never curved swoops.

## Email / plain text

- Mono-friendly structure: `01 // SUBJECT` style headers, `//` separators, square bullets (▪).
- Sign-off: `— Big Sky Systems // jj@bigsky.systems`.
- Keep it dry and short; the voice is calm and confident, SKY-1 may add one wry line at most.
