# Big Sky Systems — site and design system

Static site, no build step, no framework. Source of truth is the private repo
`JJ-BigSky/bigsky-site` (remote `origin`), checked out at `~/Documents/code/bigsky-site`.
Live at https://jj-bigsky.github.io/ via GitHub Pages from the public repo
`JJ-BigSky/jj-bigsky.github.io` (remote `pages`). Preview locally with
`python3 -m http.server 8741`.

## Design language: "engineering paper"

Every visual thing made for Big Sky Systems (pages, artifacts, one-pagers,
proposals, dashboards, charts, decks, documents, diagrams, emails) uses the
`bigsky-design` skill in `.claude/skills/bigsky-design/`. Read its SKILL.md
before making anything visual, even if the request doesn't mention design.

- Tokens: `.claude/skills/bigsky-design/assets/tokens.css` (canonical) and the
  `:root` block at the top of `assets/css/styles.css` (the site). Keep both in sync.
- Starter page: `.claude/skills/bigsky-design/assets/template.html`.
- Components: `.claude/skills/bigsky-design/references/components.md`.
- Non-HTML mappings (docx, pptx, xlsx, svg, email): `.claude/skills/bigsky-design/references/documents.md`.

Short version: bone paper with a dot grid, ink, one safety-orange accent,
Archivo wide headlines, Instrument Serif italic for one accent word, JetBrains
Mono labels, hairlines and corner marks, 2px radii, no gradients, glows, pills,
or Inter. The owner rejected the generic "AI landing page" look; don't drift
back to it.

## Site map

- `index.html` — the home page: hero, the loop (section 01), services in two
  groups, playground, lab builder, method, diagnostic, contact.
- `vision/`, `embedded/`, `physical-ai/`, `cloud/`, `world-models/` — the
  five domain pages (honest version → what works → an instrument → services →
  next). `notes/` — Field Notes index and six essays in the article template.
- `assets/img/og/` — one 1200×630 OG image per page. `sitemap.xml`,
  canonicals and JSON-LD carry the live origin `https://jj-bigsky.github.io`;
  on the domain move, sed that host across `*.html`, `notes/*.html`, and
  `sitemap.xml`.
- `assets/css/styles.css` — the shared sheet and the tokens (`:root`).
  `assets/css/pages.css` — everything V1 added: page hero, loop line, plates,
  the loop diagram, the instruments.
- `assets/js/config.js` — email, lab time zone (Eastern), boot, reticle, optional assistant endpoint.
- `assets/js/sky.js` hero contour sky · `mascot.js` SKY-1 · `arm.js` IK arm ·
  `builder.js` lab builder · `quiz.js` gauge · `assistant.js` scripted chat
  (knows the five stations; `data-page` on `<body>` picks the greeting) ·
  `loop.js` the part that rides the loop · `calc-kit.js` shared calculator
  helpers · `vision-lab.js` perception lab · `calc-latency.js` latency budget
  builder · `calc-demos.js` demonstration budget · `calc-data.js` robot data
  math · `gap-meter.js` reality-gap meter · `main.js` wiring.
- `404.html`, `robots.txt`, `netlify.toml`, `vercel.json`, `.nojekyll`.

Domain pages carry the home page's chrome byte for byte (nav, footer, sprite,
SKY-1). When the chrome changes on `index.html`, change it on all five. Paths
are root-absolute (`/assets/...`), so the site expects a domain apex.

## Working here

- Verify visually before pushing: render with headless Chrome or open the preview; check both sheets (paper and graphite) and a phone width.
- `git push origin main` saves work (private). `git push pages main` deploys the live site (public). Custom domain steps are in README.md.
