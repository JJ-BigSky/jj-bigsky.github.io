---
name: bigsky-design
description: Apply Big Sky Systems' "engineering paper" design language (bone paper with a drafting dot-grid, near-black ink, one safety-orange accent, Archivo wide headlines, Instrument Serif italic accent words, JetBrains Mono labels, hairlines and corner registration marks, no glows or pills) to anything visual made for Big Sky Systems. Use this whenever the user asks for a page, artifact, landing page, one-pager, proposal, report, dashboard, chart, deck, slides, document, PDF, email template, diagram, badge, or any new section of the site for Big Sky Systems, BSS, bigsky.systems, or SKY-1, even if they never mention design, style, brand, colors, or fonts. Also use it when asked to make something "match the site", "look like Big Sky", or restyle an existing artifact for BSS.
---

# Big Sky Systems — engineering paper

Big Sky Systems is a robotics lab consultancy. Its visual language is an
engineering drawing, not a SaaS landing page: ink on bone paper, hairline
rules, mono annotations, and exactly one accent color used the way a
draftsperson uses red pencil. The live site (https://jj-bigsky.github.io/,
source in this repo) is the reference implementation. When something you make
sits next to it, it should look like it came off the same drafting table.

The owner rejected the default "AI landing page" look explicitly: dark navy,
blue-purple gradients, glowing rounded cards, pill buttons, Inter or Space
Grotesk, emoji icons. Those read as generic. Everything below exists to keep
you away from that and inside a language that reads as credible engineering.

## Start here

1. For an HTML page or artifact, copy `assets/template.html` and inline
   `assets/tokens.css` into a `<style>` block (single-file deliverables and
   Artifacts can't load local stylesheets). Keep the Google Fonts `<link>`.
2. For a document, deck, spreadsheet, SVG diagram, or email, read
   `references/documents.md` for the font and color mappings.
3. For a component you need that the template lacks (tables, stat rows,
   callouts, badges, forms, nav strip), take the snippet from
   `references/components.md` rather than inventing a new one.
4. Run the checklist at the bottom before you hand anything over.

## Tokens

Paper is the default sheet. Graphite is the alternate for dark contexts.

| Role | Paper | Graphite |
| --- | --- | --- |
| page `--bg` | `#ECE9E2` | `#161616` |
| panel `--surface` | `#F4F2ED` | `#1F1F1F` |
| ink `--ink` (text, borders, primary fill) | `#141414` | `#ECE8E1` |
| muted `--muted` | `#66635E` | `#9B978F` |
| hairline `--line` / strong `--line-strong` | ink at 14% / 34% | bone at 13% / 34% |
| accent `--accent` (the only color) | `#FF4A00` | `#FF5A1F` |
| status `--ok` / `--warn` / `--danger` | `#2F8F5B` / `#C98F00` / `#C62F1B` | lighter variants |
| radius | 2px | 2px |

Fonts, all from Google Fonts with real fallbacks:

- Headings: **Archivo**, weight 800, `font-stretch: 108%` (112% for wordmarks),
  letter-spacing −0.02em, line-height ≈ 1. Section titles uppercase; a hero
  sentence stays sentence case.
- Accent words and subtitles: **Instrument Serif** italic, weight 400. One
  word in a headline, or the one-line subtitle under a section title. Never
  body copy.
- Labels, buttons, captions, table headers, readouts: **JetBrains Mono**,
  0.6–0.72rem, uppercase, letter-spacing 0.1–0.14em.
- Body: Archivo 400 at 15.5px, line-height 1.6.

The Google Fonts URL is in the template. If a context can't load web fonts,
use the mappings in `references/documents.md`.

## The rules that make it read as Big Sky

**Paper, not screen.** The page background is `--bg` with a 24px dot grid
(`radial-gradient(var(--grid) 1px, transparent 1.2px)`). Panels sit on
`--surface` with a 1px `--line-strong` border. No drop shadows, no glows, no
gradients, no blur except the sticky nav's backdrop.

**One accent, used like red pencil.** Orange marks what is live, numbered, or
pointed at: the 28px dash before an eyebrow label, section and item numbers
(`S-01`, `01 // WHAT WE DO`), one italic word in a headline, the active state
of a control, a needle, a target, a status square. Large orange areas are
rare and deliberate (a primary button on hover, the drafting sun). If a
composition has more than one accent color, it is wrong.

**Hairlines and corners.** Structure comes from 1px rules, not from color
fills. Cards and panels get corner registration marks (small L-shaped ticks
in two opposite corners). Sections are separated by a hairline, not by a
background change.

**Mono annotations.** Anything that labels, measures, or instructs is mono
uppercase: eyebrows, captions (`FIG. 01`), telemetry, table headers, form
labels, button text. Numbers that matter are set in Archivo 800 and large.

**Squares, not dots.** Status indicators, list bullets, and toggles use 5–7px
squares in accent or status colors. Radii are 2px everywhere; circles appear
only where a thing is genuinely round (a joint, a gauge, the sun).

**Buttons are rectangles with mono labels.** Primary = ink fill, paper text,
a trailing `→`, orange on hover. Secondary = 1px ink border, transparent.
Small = same at 0.64rem. Links are underlined in the hairline color and turn
orange on hover.

**Numbering and figure captions.** Number sections (`01 // LABEL`) and items
(`S-01`, `Q 4 / 7`). Give interactive or illustrative pieces a caption block
(`FIG. 01`, a bold title, a mono description, a 1px orange left rule). This
is the cheapest way to make a layout feel drafted rather than designed.

**Density.** Comfortable, not airy: section padding 3–5.5rem, grid gaps
1rem, panel padding 1.4rem. Text measures under ~65 characters.

**Copy voice.** Dry, confident, a little funny. Short declaratives.
"Boring is the goal. Boring means it works." SKY-1, the site's robot, is
allowed to be wry; the company voice is calm. No exclamation marks in UI.

## Charts and data

Use the print series palette from the Lab Builder, in this order:
`#FF4A00` orange, `#2C5DD6` cobalt, `#B8860B` ochre, `#8B5E3C` umber,
`#C62F1B` red, `#3F7D4E` green, `#1F8A70` teal, `#5B5B5B` graphite, then
`#4A5A6B` slate, `#2C6E8F` steel, `#6B3F2E` deep umber, `#7A6A1F` dark ochre.
They are `--s1`…`--s12` in the tokens; scripts read `var(--sN)`, never the hex.
Highlight one series in orange and set the rest in ink at reduced opacity
when the story is about one thing. Gridlines are `--line`, axis labels are
mono, no 3D, no gradients, no rounded bar caps. A stat tile is a `.stat` row
(mono label left, Archivo number right), not a colored card. Sparklines are
1.5px ink with an orange end dot.

## Interaction, if the artifact is interactive

Keep the site's habits: hover states change border color to ink or fill with
ink, never scale or glow. Motion is short (150–300ms), easing
`cubic-bezier(.2,.7,.2,1)`, and every animation is disabled under
`prefers-reduced-motion`. Sound is off by default. Custom cursors, mascots,
and easter eggs are welcome when they serve the piece; keep them in the same
ink-and-orange vocabulary.

## Do / don't

Do: hairlines, corner marks, mono uppercase labels, one italic serif word,
numbered sections, big Archivo numerals, square status marks, 2px radii,
paper dot-grid, ink primary buttons with `→`.

Don't: gradients (on anything), glows, drop shadows, pill buttons, rounded
cards over 4px, Inter / Space Grotesk / Roboto / system-ui as a design
choice, emoji as icons, more than one accent hue, rainbow chart palettes,
centered hero with gradient text, dark navy backgrounds, stock illustrations,
purple.

## Before you deliver

- [ ] Background is paper (or graphite) with the dot grid; panels are 1px-bordered surfaces.
- [ ] Exactly one accent hue, and it marks something specific.
- [ ] Headings are Archivo 800 wide; labels are mono uppercase; one serif italic accent at most per view.
- [ ] Sections and figures are numbered or captioned.
- [ ] No shadows, gradients, glows, or radii above 4px.
- [ ] Fonts load (Google Fonts link present) and fallbacks are declared.
- [ ] Reduced-motion respected; text contrast passes on both sheets if both are offered.
- [ ] Place it mentally next to https://jj-bigsky.github.io/ — same drafting table?
