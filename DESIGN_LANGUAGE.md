# Big Sky Systems — Design Language & Editorial Manual

**Revision:** `REV 2026.05 // SHEET: PAPER & GRAPHITE`  
**Scope:** Primary web properties (`bigskysystems.ai`), technical field notes, interactive instruments, and OpenGraph plates.

---

## 1. Core Philosophy: *Engineering Paper*

Big Sky Systems is an applied robotics, edge AI, and physical-systems engineering lab. The visual identity rejects standard AI-startup tropes—no neon gradients, glassmorphism, floating 3D blobs, dark-mode cyber aesthetics, pill buttons, or stock photography of humanoid hands.

Instead, the site is designed as an **interactive technical drawing and drafting table**:
1. **Surface as Medium:** The background is warm bone drafting paper (`--bg: #ECE9E2`) ruled with a `24px` dot grid (`--grid`) and structural hairlines (`--line`, `--line-strong`).
2. **One Accent Used Like Red Pencil:** Safety orange (`--accent: #FF4A00`) marks only what is live, numbered, or pointed at: the `28px` dash before an eyebrow label, station numbers (`S-01`, `01 // WHAT WE DO`), a single italic word in a headline, an active control state, a datum needle, or a status square.
3. **Drafting Chrome:** Sections are framed with CAD titleblocks (`.titleblock`), numbered stations (`S-01` to `S-06`), corner registration marks (`.corners`), and monospaced figure callouts (`FIG. 02 // SIX-STAGE PERCEPTION`).
4. **Working Instruments Over Marketing Copy:** Every engineering domain is paired with a live, deterministic browser instrument (latency budget calculators, demonstration-scaling estimators, sim-to-real sensitivity meters, and an indexed literature evidence board). Visitors manipulate parameters directly rather than reading vague capability claims.
5. **Two Sheets, One Vocabulary:** The site supports two physical sheet modes toggled via `[data-theme]` on `<html>`:
   - **Paper (Default):** Bone drafting paper (`#ECE9E2`), near-black ink (`#141414`), and safety-orange signal accents (`#FF4A00`).
   - **Graphite (Dark):** Dark graphite stock (`#161616`), bone ink (`#ECE8E1`), and warm orange signal accents (`#FF5A1F`).

---

## 2. Color System & Tokens

All colors are defined as CSS custom properties in [`assets/css/styles.css`](file:///Users/jj/Desktop/Code/bigsky-site/assets/css/styles.css) (and mirrored in [`.claude/skills/bigsky-design/assets/tokens.css`](file:///Users/jj/Desktop/Code/bigsky-site/.claude/skills/bigsky-design/assets/tokens.css)). Never introduce hardcoded hex values in component styles when a token exists.

### 2.1 Structural Tokens (Paper vs. Graphite)

| Token | Paper Sheet (`:root`) | Graphite Sheet (`[data-theme="graphite"]`) | Role & Usage |
| :--- | :--- | :--- | :--- |
| `--bg` | `#ECE9E2` | `#161616` | Primary page background stock |
| `--bg-2` | `#E3DFD7` | `#1B1B1B` | Secondary recessed page background |
| `--surface` | `#F4F2ED` | `#1F1F1F` | Elevated card surface, inputs, instrument panels |
| `--surface-2` | `#E9E6DF` | `#262626` | Secondary panel fill, code blocks, active table headers, slider tracks |
| `--ink` / `--text` | `#141414` | `#ECE8E1` | Primary body copy, headings, primary borders, primary SVG strokes |
| `--muted` | `#66635E` | `#9B978F` | Secondary prose, descriptions, unselected controls |
| `--muted-2` | `#9E9A93` | `#5F5C56` | Captions, metadata, axis labels, disabled states |
| `--line` | `rgba(20,20,20,.14)` | `rgba(236,232,225,.13)` | Standard `1px solid` structural hairlines and internal dividers |
| `--line-strong` | `rgba(20,20,20,.34)` | `rgba(236,232,225,.34)` | Emphasized panel borders, interactive card frames, spec table rules |
| `--grid` | `rgba(20,20,20,.11)` | `rgba(236,232,225,.09)` | `24px` radial dot-grid background (`radial-gradient(var(--grid) 1px, transparent 1.2px)`) |
| `--accent` | `#FF4A00` | `#FF5A1F` | **Primary Signal (Safety Orange):** CTAs, active states, warnings, datum needles |
| `--on-accent` | `#FFFFFF` | `#FFFFFF` | Text/icons rendered on top of `--accent` fills |
| `--ok` | `#2F8F5B` | `#4CB37A` | Nominal status, within-budget indicators, live telemetry square |
| `--warn` | `#C98F00` | `#E0B23A` | Marginal budget warning, medium-risk indicators |
| `--danger` | `#C62F1B` | `#E0533C` | Hard deadline overrun, fault, out-of-spec indicator |
| `--radius` | `2px` | `2px` | Universal corner radius (no pill buttons or rounded cards above `4px`) |

### 2.2 The 12-Color Print Series (`--s1` … `--s12`)

Used for multi-stage pipeline bars (Lab Builder modules, Latency Budget Builder), station badges, and charts. Scripts reference `var(--sN)` rather than raw hex values.

| Token | Hex | Swatch Name | Typical Assignment |
| :--- | :--- | :--- | :--- |
| `--s1` | `#FF4A00` | Safety Orange | Primary highlight series / policy inference |
| `--s2` | `#2C5DD6` | Cobalt | Cloud sync / fleet indexing / secondary trace |
| `--s3` | `#B8860B` | Ochre | Sensor exposure / camera capture |
| `--s4` | `#8B5E3C` | Umber | Mechanical fixtures / physical compliance |
| `--s5` | `#C62F1B` | Red | Fault / deadline overrun / safety stop |
| `--s6` | `#3F7D4E` | Green | Nominal margin / verification pass |
| `--s7` | `#1F8A70` | Teal | Transport / serialization / DDS |
| `--s8` | `#5B5B5B` | Graphite | Baseline overhead / idle |
| `--s9` | `#4A5A6B` | Slate | Pre-processing / ISP / rectification |
| `--s10` | `#2C6E8F` | Steel | World model / state estimation |
| `--s11` | `#6B3F2E` | Deep Umber | Actuation / CAN / EtherCAT bus |
| `--s12` | `#7A6A1F` | Dark Ochre | Auxiliary telemetry / logging |

---

## 3. Typography

The typographic hierarchy uses three Google Fonts loaded in `<head>` with strict role separation.

### 3.1 Font Stack

1. **Headings & Body Sans (`--font-head`, `--font-body`):** `"Archivo", "Helvetica Neue", Arial, sans-serif`
   - Headings use weight `800` with wide variable stretch (`font-stretch: 108%`, and `112%` for wordmarks), tight tracking (`-0.02em`), and compact line height (`0.98` to `1.04`).
   - Section titles (`h2`) are set in `UPPERCASE`; hero and article headlines stay in sentence case.
   - Body copy uses Archivo `400` at `15.5px` (`~0.97rem`), `line-height: 1.6`, constrained to comfortable reading measures (`< 65ch`).
2. **Editorial Counterpoint (`--font-serif`):** `"Instrument Serif", "Times New Roman", Georgia, serif`
   - Used *exclusively in italic* (`weight 400`) for a single accent word in a headline (`<em>`), a `.serif` subhead under a section title, or pull-quotes.
   - Never set body paragraphs in `--font-serif`.
3. **Technical & Tabular Mono (`--font-mono`):** `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
   - Used for all eyebrows, station numbers, figure captions (`FIG. 01`), buttons, table headers, form labels, and calculator readouts (`0.6rem – 0.72rem`, `UPPERCASE`, `letter-spacing: 0.10em – 0.14em`).
   - Always pair numerical readouts with `font-variant-numeric: tabular-nums` so live sliders never cause horizontal layout jitter.

### 3.2 Type Scale & Core Selectors

| Element / Class | Font Token | Size | Weight / Stretch | Tracking / Style |
| :--- | :--- | :--- | :--- | :--- |
| `.hero__title` | `--font-head` | `clamp(2.35rem, 5.1vw, 4.5rem)` | `800` / `108%` | `-0.025em`, `line-height: 0.98`, sentence case |
| `.page-hero__title` | `--font-head` | `clamp(2.1rem, 4.4vw, 3.8rem)` | `800` / `108%` | `-0.02em`, `line-height: 1.0`, sentence case |
| `.section-head__title` | `--font-head` | `clamp(1.7rem, 3.2vw, 2.75rem)` | `800` / `108%` | `-0.02em`, `line-height: 1.0`, `UPPERCASE` |
| `.eyebrow` | `--font-mono` | `0.72rem` | `500` | `+0.14em`, `UPPERCASE`, `28px` orange leading rule |
| Body (`p`, `.prose`) | `--font-body` | `0.97rem – 1.02rem` | `400` | `0`, `line-height: 1.65` |
| `.figcap` / Table Headers | `--font-mono` | `0.64rem – 0.70rem` | `600` | `+0.12em`, `UPPERCASE` |

---

## 4. Spatial Grid, Layout & Drafting Chrome

### 4.1 Container & Page Rhythm
- **Max Container Width:** `1280px` centered with `padding: 0 clamp(1.1rem, 3.5vw, 2.5rem)`.
- **Background Dot Grid:** `body::before` renders a fixed `24px × 24px` radial dot grid (`var(--grid)`).
- **Hairline Separation:** Sections are separated by `1px solid var(--line-strong)` rules, never by background color bands or drop shadows.
- **Squares, Not Dots:** Status indicators, list bullets, and toggles use `5px–7px` squares in `--accent` or status colors (`--ok`, `--warn`, `--danger`). Circles appear only where an object is physically round (a joint, a gauge, the drafting sun).

### 4.2 Titleblocks & Section Headers
Every major section opens with a two-part drafted header:
1. **`.titleblock`:** A multi-cell monospaced metadata strip (`S-01 // CAPABILITIES`, `DWG: BS-CAP-006`, `SCALE: FULL · 6 DOMAINS`) bordered by hairlines. Collapses cleanly on viewports `< 760px`.
2. **`.section-head`:** A two-column grid pairing `.section-head__title` on the left with a concise `.section-head__lede` on the right.

### 4.3 Corner Registration Marks (`.corners`)
Interactive frames, cards, and calculator shells use `.corners` (`::before` and `::after` pseudo-elements, plus an optional inner `<i>`) to render `8px–10px` L-shaped crosshair ticks in opposite corners.

### 4.4 The Six-Station Loop Bar (`.loopline`)
Every domain page (`vision`, `embedded`, `physical-ai`, `cloud`, `world-models`) and the `research` hub renders a persistent horizontal station navigator underneath the sticky top nav:
- Displays all 6 stations (`01 VISION` through `05 WORLD MODELS`) plus the central hub (`★ RESEARCH`).
- Highlights the current page with `[aria-current="page"]` (`background: var(--ink); color: var(--bg)`).
- Ends with a return link (`↶ THE LOOP`) back to the homepage loop schematic.

---

## 5. Interactive Instruments & Component Anatomy

Every domain page follows a strict 5-section blueprint stamped via [`tools/stamp-pages.py`](file:///Users/jj/Desktop/Code/bigsky-site/tools/stamp-pages.py):
- `01 // Reality check` — Engineering premise, two-column prose + `.spec` boundary table.
- `02 // Architecture` — Pipeline stages, system diagrams, or failure-mode anatomy.
- `03 // Interactive Instrument` — Live client-side calculator or laboratory widget.
- `04 // What we deliver` — Three concrete engagement artifacts (`.W-card` grid) + link to relevant Field Notes.
- `05 // Next` — `.next-station` footer card routing to the next station in the loop.

### 5.1 Calculator Kit (`calc-kit.js` + `.calc` / `.budget` / `.gap`)
- **Zero External Dependencies:** All calculators run in vanilla ES6 IIFEs (`assets/js/calc-*.js`, `vision-lab.js`, `gap-meter.js`, `research.js`).
- **Preset Bar (`.calc__presets`):** Every calculator provides 3–5 real-world hardware/workload presets (e.g., *200 Hz Force-Control Arm*, *30 Hz Mobile Manipulator*, *Warehouse AMR*) so visitors can inspect realistic operating regimes in one click before dragging sliders.
- **Readout Tiles (`.stat`):** Monospaced label (`.stat__k`), large Archivo 800 tabular numeral (`.stat__v`), and concise physical interpretation (`.stat__sub`). Status states shift border/text color via `.stat--ok`, `.stat--warn`, or `.stat--bad`.

### 5.2 Evidence Board (`/research/`)
- Renders a 6-station × 3-tier (`Verified in deployment`, `Measured in bench / sim`, `Open problem`) matrix of robotics engineering claims backed by primary literature and Big Sky field notes.
- Selecting any claim populates the adjacent Evidence Dossier (`#evDetail`) with full citations, BibTeX export, and direct links to the relevant station instrument.

### 5.3 SKY-1 Mascot & Lab Assistant (`mascot.js` + `assistant.js`)
- **SKY-1** is an articulated robot character rendered in SVG at the bottom-right corner (`.mascot`), paired with a slide-over drawer (`#chat`).
- **Non-Intrusive Layout:** The mascot speech bubble (`.bubble`) stacks vertically *above* the mascot button (`flex-direction: column-reverse` / top-anchored) and auto-dismisses cleanly so it never overlaps right-column calculator sliders, table readouts, or footer links.
- **No Fake LLM Theater:** SKY-1 is a deterministic client-side router over Big Sky's engineering notes and calculators, plus a structured intake sequence that compiles a `mailto:` brief. It states plainly that it is a rule-based script, not a cloud LLM.

---

## 6. Editorial Voice & Copy Guide ("Unclaudified" House Style)

Big Sky Systems sounds like a **principal robotics engineer writing a design review or post-mortem**—dry, specific, quantitative, and grounded in physical hardware.

### 6.1 Core Voice Principles
1. **Lead with Physical Quantities:** Prefer numbers, bus names, and failure mechanics over metaphors. Say *"PCIe DMA transfer + TensorRT FP16 graph execution takes 6.4 ms on Orin NX"* instead of *"The model thinks fast enough to keep up with reality."*
2. **Respect the Reader's Background:** Assume the reader has stood next to an E-stop button, read a cumulative distribution function, or debugged a timestamp offset. Do not over-explain basic terms, and do not lecture.
3. **Standard US English:** Use consistent US spelling across all prose, tables, and code comments (`behavior`, `characterized`, `labeled`, `labeling`, `catalog`, `color`, `millimeter`, `centimeters`, `defense`, `flavored`, `quantization`, `optimization`).
4. **No Exclamation Marks in UI:** Keep headings, buttons, and status readouts calm and declarative.

### 6.2 Banned Rhetorical Tics (The "Anti-Claude" Checklist)
When authoring or editing copy in `content/*.md`, `index.html`, `tools/stamp-pages.py`, or `assets/js/*.js`, **never** use the following LLM stylistic habits:

- **NO "X is not Y, it's Z" / "X wearing a trench coat" / "X with Y stapled to it" aphorisms:**
  - *Banned:* *"Autonomy is a latency problem wearing a trench coat."*
  - *Banned:* *"Autonomy is a latency budget with a power budget stapled to it."*
  - *Banned:* *"That's not a control loop, that's a strong opinion arriving late."*
  - *Banned:* *"That's not a pipeline, that's a slideshow."*
  - *Banned:* *"Your fleet is a data business with a floor plan."*
  - *Banned:* *"A robot lab is a loop, not a shelf. The belt has an end. The loop doesn't."*
  - *Use instead:* Direct technical statements about control period deadlines, thermal limits, frame rates, and fleet data indexing.
- **NO Meta-Commentary About "Sentences", "Words", or "Phrases":**
  - *Banned:* *"The engineering between those two sentences is most of what we do on this page."*
  - *Banned:* *"This is the sentence everyone learns in month two."*
  - *Banned:* *"Both of those sentences are the point."*
  - *Banned:* *"It's a small phrase. Do the multiplication."*
  - *Use instead:* State the engineering tradeoff directly without congratulating the sentence itself.
- **NO Performative "Honest / Honestly" Branding:**
  - *Banned:* Section headers titled `01 // The honest version`, or repeating *"honestly characterized"*, *"honest answer"*, *"honest cost"*, *"one very honest needle"*, *"in operator-weeks, the honest unit"*.
  - *Use instead:* If an assessment is accurate, present the numbers. Use section titles like `01 // Field conditions` or `01 // In practice`.
- **NO Performative "Kindly", "With Love", or Overused "Boring":**
  - *Banned:* *"Place something and I'll start judging. Kindly."* / *"I say this with love."* / *"Numbers are rounded with enthusiasm."* / repeating *"Boring is the goal"* on every page.
  - *Use instead:* Dry, direct instrument notes: *"First-order scaling estimates; benchmark against your target hardware."*
- **NO Repetitive Calendar/Clock Clichés:**
  - Avoid leaning on *"on a cloudy Tuesday"*, *"at 2 a.m."*, *"in month five"*, or *"on the second shift"* as a substitute for explaining the actual physical disturbance (e.g., sodium-vapor bay lighting, 15 °C ambient swings, belt stretch, or anodized part batches).

---

## 7. Build & Verification Workflow

There is no bundler or Node build pipeline. The site serves directly as static HTML/CSS/JS.

1. **Edit Shared Chrome or Homepage:** Modify [`index.html`](file:///Users/jj/Desktop/Code/bigsky-site/index.html), [`assets/css/styles.css`](file:///Users/jj/Desktop/Code/bigsky-site/assets/css/styles.css), or [`assets/css/pages.css`](file:///Users/jj/Desktop/Code/bigsky-site/assets/css/pages.css).
2. **Edit Domain Pages or Field Notes:** Modify Markdown sources in [`content/`](file:///Users/jj/Desktop/Code/bigsky-site/content/) and [`content/notes/`](file:///Users/jj/Desktop/Code/bigsky-site/content/notes/), or page metadata in [`tools/stamp-pages.py`](file:///Users/jj/Desktop/Code/bigsky-site/tools/stamp-pages.py).
3. **Stamp All Static Pages:**
   ```bash
   python3 tools/stamp-pages.py all
   ```
4. **Render OpenGraph Plates (when page titles or subtitles change):**
   ```bash
   bash tools/og/render.sh
   ```
5. **Local Preview:**
   ```bash
   python3 -m http.server 8765
   ```
