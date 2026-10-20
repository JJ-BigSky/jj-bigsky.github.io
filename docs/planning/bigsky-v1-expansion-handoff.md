# Big Sky Systems — V1 Content Expansion Handoff

**For:** the site agent building on `jj-bigsky.github.io`
**Written:** 2026-09-10 · **Revised:** 2026-09-10 after reading the repository
**Status:** Plan + draft copy. No files changed. Nothing deployed. Nothing pushed.
**Repo read at:** `jj-bigsky/jj-bigsky.github.io` · `main` @ `a761f20`
**Scope:** Expand V0 (one page, six sections) into V1 (home + five domain pages + field notes) covering cloud computing, embedded AI, physical AI, world models, and visual intelligence for robotics.

---

## How to use this document

Read §0, §1 and §2 before touching anything. §0 lists what changed after I read the actual repository. §1 is what already exists so you don't have to re-derive it. §2 is the argument for the shape of V1 — if you disagree with it, say so before building, because everything after §3 assumes it.

**Before any visual work, read `.claude/skills/bigsky-design/SKILL.md` in the repo.** `CLAUDE.md` requires it and it outranks this document on every question of design.

§3–§8 are build specs. Draft copy is marked `DRAFT COPY` and is written in the site's voice — use it directly, edit freely, but don't flatten the voice into normal marketing English. That voice is the product.

§9 is the research appendix: every factual claim in the draft copy, with a source and a confidence rating. **Check the ones marked ROTS before publishing.** Some of them will be stale within two quarters.

§10 is the build sequence and the QA gate.

---

# 0. Corrections after reading the repo

The first draft of this plan was written from the *live site* only. I have since read the actual repository (`jj-bigsky/jj-bigsky.github.io`, `main` @ `a761f20`). Several assumptions were wrong. If you read the earlier version, these are the deltas:

| # | First draft said | Actually |
|---|---|---|
| 1 | Design system reproduced here | **There is a mandated `bigsky-design` skill** at `.claude/skills/bigsky-design/`, and `CLAUDE.md` requires reading its `SKILL.md` before making anything visual. It is canonical; §1.2 now defers to it. |
| 2 | Subdirectory pages use `../assets/...` | **The established convention is root-absolute `/assets/...`** — `404.html` already does this. Simpler, and portable across all four candidate hosts. |
| 3 | `robots.txt` is new | **It exists.** Needs one `Sitemap:` line added, not creating. |
| 4 | Deploy target is GitHub Pages → CloudFront | **`netlify.toml` and `vercel.json` also exist**, so three or four hosts are in play. Affects the trailing-slash question (§7.2). |
| 5 | "Audit `main.js` for null derefs" | Vague. **§7.3 now names the exact seven failure sites with line numbers**, and separates "include this element" from "guard this block." |
| 6 | New Lab Builder modules in purple/plum | **The design skill explicitly forbids purple** and treats module colors as a print series. §3.5 is corrected, and the fix also resolves a real palette drift between `tokens.css` and `styles.css`. |
| 7 | Six open questions for JJ | **Now decided** — see §10. Only one still needs a human. |

Also newly known and folded in below: `404.html` and `.nojekyll` exist; local preview is `python3 -m http.server 8741`; the design skill mandates figure captions, corner registration marks, square bullets, and a trailing `→` on primary buttons, none of which the first draft specified.

---

# 1. What V0 actually is

## 1.1 Inventory

Static site, no build step, no framework, no package manager, no dependencies except Google Fonts. Served from GitHub Pages.

```
index.html                 451 lines   Single page, six sections
assets/css/styles.css       38 KB      One stylesheet, all of it
assets/js/config.js        659 B       window.BSS_CONFIG — company, email, toggles
assets/js/sound.js         2.2 KB      WebAudio bleeps, off by default
assets/js/sky.js           9.8 KB      Hero contour-line canvas
assets/js/mascot.js        7.0 KB      SKY-1 robot: eye tracking, moods, speech bubble
assets/js/arm.js            15 KB      2-link IK arm on canvas: follow/teach/draw
assets/js/builder.js        12 KB      8×6 lab-floor grid, 8 modules, live tallies
assets/js/quiz.js          6.8 KB      7-question readiness diagnostic + SVG gauge
assets/js/assistant.js      15 KB      SKY-1 chat, scripted intent matcher
assets/js/main.js           13 KB      Boot, theme, nav, reveal, tilt, forms, easter eggs
assets/img/favicon.svg
```

Scripts are plain IIFEs loaded in order at the end of `<body>`, each guarding on the presence of its root element (`if (!floor || !palette) return;`). **This pattern is what makes multi-page work easy** — a script that finds no root element does nothing. You can keep loading all of them everywhere, or split per page. Recommendation in §7.3.

## 1.2 Design system — "engineering paper"

> **Read `.claude/skills/bigsky-design/SKILL.md` before you make anything visual.** `CLAUDE.md` requires it, and it is the canonical source — not this document. What follows is orientation and the few things the skill doesn't cover. Where they disagree, **the skill wins.**

The skill also ships things you should use rather than rebuild:

- `assets/template.html` — starter page
- `assets/tokens.css` — **canonical tokens**, to be kept in sync with the `:root` block in `assets/css/styles.css`
- `references/components.md` — ready snippets for: eyebrow + title + serif subtitle, hero sentence with one italic accent word, **figure caption**, buttons, toggle, **card with corner marks**, **square-marker bullet list**, spec table, stat rows, SKY-1 callout, badge/status, form field, nav strip, graphite sheet, brand mark
- `references/documents.md` — non-HTML mappings (docx, pptx, xlsx, svg, email)

**Five rules from the skill that this plan's new components must obey, and that the first draft missed:**

1. **Figure captions.** Anything illustrative or interactive gets a caption block: `FIG. 0N`, a bold title, a mono description, a 1px orange left rule. **All five calculators and the loop diagram need one.** The skill calls this "the cheapest way to make a layout feel drafted rather than designed" — and it's what makes a calculator read as an instrument instead of a widget.
2. **Corner registration marks** on cards and panels — L-shaped ticks in two opposite corners.
3. **Squares, not dots** for status indicators, list bullets, and toggles: 5–7px, accent or status color. Circles only where a thing is genuinely round.
4. **Primary buttons carry a trailing `→`**, ink fill with paper text, orange on hover. Secondary is a 1px ink border on transparent.
5. **Motion is 150–300ms on `cubic-bezier(.2,.7,.2,1)`**, and hover never scales or glows — it changes border color or fills with ink.

Plus two hard prohibitions worth repeating because the new pages are exactly where they'd creep back in: **no gradients, glows, shadows, pills, radii above 4px, more than one accent hue, or purple** — and **no exclamation marks in UI copy.**

Two themes, toggled via `data-theme` on `<html>`: `paper` (default) and `graphite`. Tokens mirrored here for convenience — `tokens.css` is canonical:

| Token | Paper | Graphite |
|---|---|---|
| `--bg` | `#ECE9E2` | `#161616` |
| `--bg-2` | `#E3DFD7` | `#1B1B1B` |
| `--surface` | `#F4F2ED` | `#1F1F1F` |
| `--surface-2` | `#E9E6DF` | `#262626` |
| `--ink` | `#141414` | `#ECE8E1` |
| `--muted` | `#66635E` | `#9B978F` |
| `--muted-2` | `#9E9A93` | `#5F5C56` |
| `--line` | `rgba(20,20,20,.14)` | `rgba(236,232,225,.13)` |
| `--line-strong` | `rgba(20,20,20,.34)` | `rgba(236,232,225,.34)` |
| `--grid` | `rgba(20,20,20,.11)` | `rgba(236,232,225,.09)` |
| `--accent` | `#FF4A00` | `#FF5A1F` |
| `--ok` | `#2F8F5B` | `#4CB37A` |
| `--warn` | `#C98F00` | `#E0B23A` |
| `--danger` | `#C62F1B` | `#E0533C` |

Type: **Archivo** (variable, `font-stretch` used as a design axis — headings sit at 104–108%), **Instrument Serif** (italic only, used for the subtitle under every h2), **JetBrains Mono** (all labels, eyebrows, buttons, HUD readouts — `.7rem`, `.1em` tracking, uppercase).

`--radius: 2px`. Effectively square. Don't round things.

Body has a dot-grid background: `radial-gradient(var(--grid) 1px, transparent 1.2px)` at `24px 24px`. Every new page inherits this automatically. Don't paint over it with opaque full-bleed panels.

**Colors used for lab-builder modules only** (these are deliberately outside the two-theme palette, one per module type): `#FF4A00` cell, `#2C5DD6` AMR, `#B8860B` vision, `#8B5E3C` conveyor, `#C62F1B` fence, `#3F7D4E` bench, `#1F8A70` charging, `#5B5B5B` rack. New modules need new colors in this family — muted, desaturated, one step off primary.

## 1.3 Component inventory — what you can reuse

Everything here already exists and is themed. Build new sections out of these before inventing anything.

**Layout:** `.container` (min(1160px, 92vw)), `.section` (hairline top border, clamped vertical padding), `.section__title` (uppercase h2 + `<span class="muted">` italic-serif subtitle), `.eyebrow.mono` (numbered kicker with an orange 28px rule before it), `.marks` (corner registration marks).

**Content:** `.cards` + `.card.tilt` (3D-tilt flip card, front/back faces, `.card__num` mono label, "You get" list on the back), `.stat` / `.stat--wide`, `.muted`, `.small`, `.mono`, `.led` / `.led--warn` (pulsing status dot).

**Controls:** `.btn` (+ `--primary`, `--ghost`, `--small`, `--link`), `.seg` / `.seg__btn` (segmented mode switch), `.check`, `.range`, `.opt` (quiz option with `<kbd>` numeral), `.chip`, `.tog`, `.icon-btn`, `.pal` (palette button with icon + name + `<small>` tag).

**Behavior:** `.reveal` (IntersectionObserver adds `.in`, staggered 80ms by index mod 3 — **just add the class, `main.js` picks it up automatically**), `.tilt`, `.typed`, `.toast`, `data-cursor="LABEL"` (sets the reticle label on hover — use short uppercase verbs).

**JS globals available on every page:**

| Global | Use |
|---|---|
| `window.BSS_CONFIG` | company, email, `labTimeZone`, `boot`, `reticle`, `assistantEndpoint` |
| `window.BSS_TOAST(msg)` | bottom toast, 2.4s |
| `window.BSS_SOUND` | `.tick() .click() .success() .speak(n)`, `.enabled` |
| `window.BSS_MASCOT` | `.say(text, {mood, priority})`, `.mood()`, `.excite()` |
| `window.BSS_ARM`, `BSS_BUILDER`, `BSS_CHAT`, `BSS_SKY`, `BSS_DANCE` | per-feature handles |

**SVG sprite:** `#i-cell #i-amr #i-eye #i-belt #i-fence #i-bench #i-plug #i-rack`, in a zero-size `<svg>` at the top of `<body>`. Referenced as `<svg><use href="#i-eye"/></svg>`. New modules need new symbols added to this block — same 24×24 viewBox, `stroke-width: 1.8`, `fill="none"`, `stroke="currentColor"`, round caps and joins. Keep them at that weight; they're drafting glyphs, not icons.

## 1.4 Voice — the rules, derived from the existing copy

This matters more than anything else in this document. The site's credibility comes entirely from sounding like an engineer who has been burned.

- **Short declarative sentences.** Technical nouns used correctly and without ceremony.
- **The joke goes at the end of the paragraph, never inside the claim.** "Sign-off package for your insurer and your sleep." "A team that doesn't need us anymore." "Someone to blame (kindly) when it slips."
- **Self-deprecating about the industry, never about the work.** SKY-1 is allowed to be self-deprecating about itself: *"I'm charmingly limited."*
- **The thesis is "boring is the goal. Boring means it works."** Every new page should be recognizably an argument for that.
- **Honest disclaimers, stated plainly, with a joke attached.** "Numbers are illustrative and rounded with enthusiasm. Real estimates come from a real conversation."
- **Deliverables come in fours.** Every "You get" list on the site is exactly four concrete items. Keep it.
- **Second person, direct.** "Your parts. Your people. Your lab."
- **Never:** leverage, solutions, cutting-edge, revolutionize, seamless, unlock, empower, game-changing, journey, "AI-powered." The site currently mocks this register — *"the meeting where someone says 'just use AI'"* — so using it would be self-refuting.
- **Numbers are specific or absent.** "Two weeks." "Two to four months." "One to three quarters." Never "rapid" or "industry-leading."
- **Standards named exactly.** ISO 10218, ISO/TS 15066, ANSI/RIA R15.06. This is a trust signal; keep doing it and extend it (see §9.4 — the 2025 revision changes what you should cite).

One more, and it's the important one for V1: **the site is already honest about AI.** SKY-1's existing answer is *"Yes, carefully. We integrate vision and learned policies where they earn their place, with evals and fallbacks, and we're honest when a fixture and a limit switch would beat a neural net."* That sentence is the seed of the entire V1 expansion. Everything you build should be downstream of it.

## 1.5 Constraints that are non-negotiable

1. **No build step.** No npm, no bundler, no framework. Hand-written HTML/CSS/JS. This is a deliberate character choice for a consultancy that sells engineering judgment.
2. **Root-absolute asset paths (`/assets/...`).** This is already the site's convention — `404.html` uses it. It survives the planned move to Route 53 + CloudFront (see `~/Desktop/domain-migration-squarespace-to-aws.md`) and works identically on GitHub Pages, Netlify, and Vercel, because all four serve from a domain apex. **Do not use `../assets/...` on subdirectory pages** — it's fragile and inconsistent with what's already there. The only thing that must never appear is a path hard-coded to the `jj-bigsky.github.io` origin.
3. **No server.** No forms that POST anywhere. The contact pattern is `mailto:` composition, on purpose, and it's stated as a feature: *"No forms that go nowhere."* Every new CTA follows that pattern.
4. **No tracking, no analytics, no third-party scripts** without asking JJ first. SKY-1's pitch is literally *"no cloud, no tracking, nothing leaves this page."* Adding a tracker would make the site a liar.
5. **Both themes, always.** Never define a color outside the token system. Check every new component in paper *and* graphite.
6. **Reduced motion parity.** Every animation in V0 checks `prefers-reduced-motion`. New interactives must too, and must remain fully usable with motion off.
7. **Keyboard accessible.** The quiz supports number keys, cards are `tabindex="0"`, everything focusable shows `2px solid var(--accent)` at 3px offset. Hold that line — new calculators must be operable without a mouse.

---

# 2. Strategy for V1

## 2.1 The problem with the brief

The five requested topics — cloud computing, embedded AI, physical AI, world models, visual intelligence — are the five most hype-saturated phrases in robotics right now. Bolting five buzzword sections onto a site whose entire credibility rests on "boring is the goal" would subtract value even while adding words.

So the expansion cannot be five new topics. It has to be **one argument with five parts.**

## 2.2 The argument

V0 says: *we make the physical lab boring.* Layout, robots, safety, ROS 2, training. Atoms.

V1 says: *the lab is now a data system with a floor plan, and we make all of it boring.* The robot is no longer the product — the loop is. A lab that ships in 2026 has to run a cycle:

> a robot **perceives** → an on-board policy **decides** → the cell **acts** → the fleet **captures** what happened → simulation and world models **imagine** the next version → back to perceive.

Those five verbs are exactly the five requested topics:

| Verb | Topic | Page |
|---|---|---|
| Perceive | Visual intelligence for robotics | `/vision/` |
| Decide | Embedded AI / on-robot autonomy | `/embedded/` |
| Act | The lab itself — existing V0 services | `#services` |
| Capture | Cloud computing & robot data | `/cloud/` |
| Imagine | World models & simulation | `/world-models/` |

Plus one page that sits across all of them and is the actual commercial offer: **Physical AI** (`/physical-ai/`) — how you decide whether a learned policy is the right answer at all, and what it costs when it is.

## 2.3 The design payoff

V0 already has a five-station conveyor for the delivery method: *"Five stations. One belt."* The technical stack is also five stations — but it's a **closed loop**, not a line. That contrast is the centerpiece of V1 and it writes its own copy:

> **The belt has an end. The loop doesn't.**

Build the loop as an inline SVG on the home page (spec in §3.3), visually rhyming with the method belt, with each node linking to its page.

## 2.4 What changes about the offer

V0 sells six services, all of them about getting steel installed correctly. V1 adds a second family of four about getting intelligence installed correctly. Keep the original headline and add a counterpart:

> **Six ways we make your lab boring.** *Boring is the goal. Boring means it works.*
> **Four ways we make it think.** *Thinking is harder. Boring still wins.*

That preserves the best line on the site instead of overwriting it.

## 2.5 V0 gave you toys. V1 gives you instruments.

The single strongest thing about V0 is that it lets you *do* something: drive an arm, build a floor plan, get a score. V1 must not degrade into five pages of prose.

Each new page carries one interactive piece, and all five are the same genre: **an honest calculator that talks you out of things.** That is a genuinely differentiated content strategy for a robotics consultancy, because almost every competitor's site is optimistic by construction. Big Sky's is not:

- Physical AI → **Demonstration budget calculator.** How many teleop demos your task list actually needs, and what that costs in operator-weeks.
- Embedded → **Latency budget builder.** Fill your control period with pipeline stages and watch it overflow.
- Cloud → **Robot data math.** Fleet × sensors × hours → TB/month, storage cost, and how long until it's a problem.
- World models → **Reality-gap meter.** Per task type, how much of the work sim can honestly do.
- Vision → **Perception pipeline.** Toggle stages on a real scene; watch latency accumulate and lighting ruin everything.

Every one of them ends the same way the Lab Builder does: illustrative numbers, an honest disclaimer, a SKY-1 opinion, and an "email this result" CTA that composes a `mailto:` with the inputs filled in. **These are the lead magnets.** They're the reason to build V1 at all.

## 2.6 Explicit non-goals

- No case studies, client names, logos, or testimonials that don't exist. Don't invent social proof.
- No vendor logo wall. Vendor-neutrality is a stated selling point (*"bake-offs, not brochures"*); a logo wall contradicts it.
- No pricing table. V0's pricing answer — fixed-fee discovery, scoped builds, monthly retainer — is deliberately conversational. Keep it that way.
- No blog CMS, no comments, no newsletter signup that needs a backend.
- Don't put perishable hardware specs in headlines. They belong in body copy with a "checked" date. See §9.
- Don't grow the home page past ~2× its current length. Long-scroll is a V0 strength; a 10,000-word home page is not.

---

# 3. Home page changes

## 3.1 Section renumbering

The expansion inserts The Loop as the new lead section, because it establishes the worldview the rest of the page sells against.

| Current | V1 | Section |
|---|---|---|
| — | `01 // The loop` | **NEW** — closed-loop stack diagram |
| `01 // What we do` | `02 // What we do` | Services, extended to two groups |
| `02 // Playground` | `03 // Playground` | unchanged |
| `03 // Lab builder` | `04 // Lab builder` | new modules added |
| `04 // The Big Sky method` | `05 // The Big Sky method` | unchanged |
| `05 // Lab readiness diagnostic` | `06 // Lab readiness diagnostic` | unchanged |
| `06 // Talk to a human` | `07 // Talk to a human` | unchanged |

Six eyebrow strings to edit. Nothing else moves.

*(Alternative if you'd rather not renumber: append The Loop as `07` before contact. Weaker — it buries the new thesis at the bottom. Only do this if renumbering causes problems I can't see from here.)*

## 3.2 Hero

Keep the headline exactly as it is. `We build robotics labs that actually ship.` with the typed `ship.` — it's the best line on the site and it still covers the expanded offer.

Extend the lede to signal the new scope:

> **DRAFT COPY — hero lede**
> Big Sky Systems is a robotics lab consultancy. We take you from an empty bay to a humming cell — layout, robots, ROS 2, safety, and the humans who run it — and then from a humming cell to a system that learns: perception, on-robot autonomy, simulation, and the data loop behind both.

Add a fourth hero action pointing at the loop:

```html
<a class="btn btn--link" href="#loop" data-cursor="TRACE">See the loop</a>
```

Consider adding one telemetry field to the existing strip for flavour continuity: `Loop <b id="tLoop">closed</b>`.

## 3.3 NEW SECTION — `01 // The loop`

This is the centerpiece. Build it as inline SVG in the engineering-paper idiom — hairlines, mono labels, one orange accent — visually rhyming with the method belt below it.

> **DRAFT COPY — section title**
> ## A robot lab is a loop, not a shelf.
> *The belt has an end. The loop doesn't.*

> **DRAFT COPY — body**
> You can buy a robot in an afternoon. What takes a year is the loop around it: something has to see the part, something has to decide what to do about it in under ten milliseconds, something has to move, something has to record what happened, and something has to use that recording to make next week better.
>
> Most labs are excellent at one station and quietly missing three. That's why the demo works and the deployment doesn't.
>
> We build the whole loop, and we're specific about which parts of it your project doesn't need yet.

**Diagram spec:**

- Inline `<svg viewBox="0 0 900 460">`, `aria-hidden="true"`, with a real `<ul>` of the five nodes rendered alongside for screen readers and no-JS (visually hidden or styled as a legend — your call, but the links must exist in the DOM as text).
- Five nodes on a rounded-rect or ellipse path, in loop order: **PERCEIVE → DECIDE → ACT → CAPTURE → IMAGINE →** back to PERCEIVE.
- Each node: a square hairline plate (`stroke: var(--line-strong)`, `fill: var(--surface)`, 2px radius), a mono label, a one-line description below in `--muted`, and the existing sprite icon where one fits (`#i-eye` for PERCEIVE, `#i-rack` for CAPTURE, `#i-cell` for ACT).
- Each node is a link:

| Node | Label | Sub-label | Links to |
|---|---|---|---|
| PERCEIVE | Visual intelligence | Cameras, depth, pose, and what breaks them | `vision/` |
| DECIDE | On-robot autonomy | The policy, the silicon, the latency budget | `embedded/` |
| ACT | The cell | Arms, tooling, safety, the physical lab | `#services` |
| CAPTURE | Robot data & cloud | Logs, datasets, training, fleet rollout | `cloud/` |
| IMAGINE | Simulation & world models | Test it a million times before it touches steel | `world-models/` |

- Connecting path: dashed hairline, `stroke-dasharray: 1.5 4` (matches `.brand-orbit` in the logo — deliberate rhyme).
- Animation: one small orange square travels the path continuously, ~12s per lap, using `offset-path`/`offset-distance` or an `animateMotion`. On hover of a node, the traveller eases to that node and pauses. **Under `prefers-reduced-motion`, the traveller is static at PERCEIVE and no transition runs.**
- Hover/focus a node: plate fills `var(--accent)`, label goes `var(--on-accent)`, sub-label brightens. Keyboard focus must produce the identical state.
- Below the diagram, a single mono line, centred:
  > `Physical AI is what happens when the loop closes. →` linking to `physical-ai/`

**Mobile:** below ~720px, drop the SVG loop and render the five nodes as a vertical stack of hairline plates with a dashed connector down the left edge and a return arrow at the bottom. Don't try to shrink the ellipse.

## 3.4 Services — extend to two groups

Keep all six existing cards untouched. Add a second `.cards` grid below the first, with its own `.section__title`-style heading (use an `h3` with the same treatment so it doesn't compete with the section h2).

> **DRAFT COPY — group headings**
> **Six ways we make your lab boring.** *Boring is the goal. Boring means it works.* ← existing, unchanged
> **Four ways we make it think.** *Thinking is harder. Boring still wins.*

Four new flip cards, same markup as `S-01`…`S-06`, four items in every "You get" list:

---

**S-07 — Perception Systems**
*Front:* Cameras, lighting, depth, and pose. The part of your robot that fails on a cloudy Tuesday and nobody knows why.
*You get:*
- Sensor and lighting selection with a bench test on your parts
- Hand-eye and intrinsic calibration, plus drift monitoring
- Detection, segmentation, depth, and 6-DoF pose pipeline
- Failure taxonomy: what breaks it, and what it does when it breaks

**S-08 — On-Robot Autonomy**
*Front:* Policies that run on the robot, inside the control loop, on a power budget. Autonomy is a latency problem wearing a trench coat.
*You get:*
- Compute selection sized to a real latency and thermal budget
- Model optimization: quantization, fusion, and honest re-validation
- Real-time architecture — RT kernel, CPU isolation, ROS 2 QoS
- p99.9 latency measurement, because averages don't crash robots

**S-09 — Simulation & World Models**
*Front:* Test it ten thousand times before it touches steel. Then measure how much the simulator lied.
*You get:*
- Sim environment built from your CAD, or scanned from your cell
- Domain randomization and system-identification plan
- Sim-versus-real measurement harness, per task, with numbers
- Asset pipeline that survives contact with your CAD department

**S-10 — Robot Data & Cloud Platform**
*Front:* Your fleet is a data business with a floor plan. Storage is cheap right up until the day it isn't.
*You get:*
- Capture schema and retention plan sized to your actual bitrate
- Dataset pipeline from raw logs to training-ready episodes
- Training and evaluation infrastructure that someone else can run
- Staged policy rollout with canaries and a rollback that works

---

Each new card's back should end with a link to its page: `<a href="vision/">The long version →</a>` etc. Add a `.card__link` style if the flip-card back doesn't already accommodate a link cleanly.

## 3.5 Lab Builder — new modules

Add four modules to `MODS` in `builder.js`, plus matching sprite symbols. This is the cheapest high-impact change on the home page: it makes the builder reflect the expanded worldview without any new UI.

**Palette first — this needs fixing before the modules go in.** The design skill treats the eight module colors as a *print series*, and `tokens.css` already defines them as `--s1`…`--s8`. Two problems: (a) all eight are taken by the eight existing modules, and (b) `builder.js` hard-codes the hex values while `tokens.css` holds the variables, and `styles.css` has neither — a real drift that `CLAUDE.md` says to fix ("keep both in sync").

So do this in order:

1. Add the `--s1`…`--s8` series block to the `:root` in `styles.css` so it matches `tokens.css`.
2. Extend the series with four new entries in the same ink family — **not purple, not a second accent hue** — in both `tokens.css` and `styles.css`:
   `--s9: #4A5A6B` slate · `--s10: #2C6E8F` steel · `--s11: #6B3F2E` deep umber · `--s12: #7A6A1F` dark ochre
3. Refactor `builder.js` to read `var(--sN)` instead of literal hex. This is a small change that removes the drift permanently and makes the modules theme-aware.

Then add the modules:

```js
{ id: "teleop", name: "Teleop station", icon: "i-teleop", area: 4, kw: 1.0, cost: [12, 45],  series: 9,  tag: "where demos come from" },
{ id: "ingest", name: "Data ingest",    icon: "i-ingest", area: 2, kw: 2.0, cost: [8, 35],   series: 10, tag: "logs in, datasets out" },
{ id: "gpu",    name: "Training node",  icon: "i-gpu",    area: 3, kw: 8.0, cost: [30, 140], series: 11, tag: "local GPUs or a cloud link" },
{ id: "cam",    name: "Camera rig",     icon: "i-cam",    area: 2, kw: .4,  cost: [6, 28],   series: 12, tag: "lighting is the real upgrade" },
```

Note the power draw on `gpu` (8 kW) — it should visibly move the kW tally, because that's the actual lesson. A training node is a facilities problem, not an IT problem.

**New SKY-1 builder opinions to add to the notes logic:**
- Placed `gpu` but no `plug`/power headroom → *"Eight kilowatts of training node. Have you told facilities, or is this a surprise for them?"*
- Placed `cell` + `cam` but no `teleop` → *"You can see the part and you can move the arm. Nothing here collects the demonstrations that teach it. Add a teleop station or plan on writing the policy by hand."*
- Placed `teleop` but no `ingest` → *"Demos with nowhere to go. That's a very expensive way to make video."*
- Placed `gpu` but no `ingest` → *"Training node, no data pipeline. That's a space heater with excellent specs."*
- Four or more `cell` and no `rack` → *"Four cells and no compute. Where do you think the perception is running?"*

Those lines are the tone target for everything in V1.

## 3.6 Nav

Seven top-level items is already at the limit; V1 adds six pages. Restructure to five items plus the CTA:

```
Work        → #services        (home services, both groups)
The Loop    → #loop            (home, and the gateway to the five pages)
Lab         → #playground      (groups the interactive toys: playground, builder, diagnostic)
Method      → #method
Notes       → notes/
Talk to us  → #contact          (.nav__cta, unchanged)
```

On the five domain pages, nav items that point at home-page anchors need the `../` prefix (`../#services`). Keep `Talk to us` pointing at `../#contact` — do not build a second contact section per page; one contact section, linked from everywhere.

**Optional, only if it stays simple:** a hover/focus dropdown under "The Loop" listing the five pages. If it costs more than ~30 lines of CSS and a focus-trap-free keyboard implementation, skip it and let the loop diagram be the navigation. The diagram is better navigation than a menu anyway.

## 3.7 Footer

Add a link column for the five pages and Field Notes. Keep the LED strip and the *"Made under a very big sky"* line — add two LEDs so the strip reflects the new stack:

```
● arm   ● sky   ● sky-1   ● loop   ◐ coffee
```

---

# 4. The five domain pages

## 4.0 Shared page template

Every domain page uses the same skeleton. Build the template once, then fill it five times.

```
/<slug>/index.html
  ├─ <head>            page-specific title, description, OG tags (§7.1)
  ├─ SVG sprite block  (duplicated — see note below)
  ├─ header.nav        duplicated from index.html, with ../ prefixes
  ├─ main
  │   ├─ .page-hero    eyebrow, h1, lede, one-line "where this sits in the loop"
  │   ├─ 01 // The honest version   ← the reality-check section. Always first.
  │   ├─ 02 // What actually works  ← the technical substance
  │   ├─ 03 // <Interactive>        ← the calculator
  │   ├─ 04 // What we do           ← services + a four-item "You get"
  │   └─ 05 // Next                 ← loop-nav strip + CTA to ../#contact
  ├─ footer            duplicated
  └─ scripts           shared + one page-specific module
```

**Section order is deliberate.** The reality check comes *before* the pitch on every page. That sequencing is the whole brand: you earn the right to sell by first saying what doesn't work.

**On duplicating header/footer/sprite:** with no build step, six pages means six copies of ~60 lines of chrome. That's acceptable and it's the right call — it keeps the site dependency-free and works with JS disabled. Do **not** reach for a JS-injected `<header>`; it costs you the nav in view-source, hurts SEO, and flashes on load. If drift becomes annoying later, a 30-line Node script that stamps partials into the six files is the escape hatch — but don't build it as part of V1.

**New shared page-hero CSS:** `.page-hero` should be a lighter-weight cousin of `.hero` — no canvas, no telemetry strip, same eyebrow/h1/lede rhythm, with a `.page-hero__loop` mono line showing the node's position: `PERCEIVE · decide · act · capture · imagine` with the current node in `--accent` and the rest in `--muted-2`. Each of the other four is a link. That gives every page a persistent map of where you are, for the price of one line of markup.

**New shared "Next" strip:** at the bottom of every domain page, before the CTA — three plates: previous node, `physical-ai/`, next node. Reuse `.card` styling without the flip.

---

## 4.1 `/physical-ai/` — Physical AI

**Nav label:** Physical AI · **Loop position:** across all five nodes (this is the hub page)

**Thesis:** Learned policies are real and getting better fast. The bottleneck is not the model — it's demonstrations, evaluation, and the distance between a policy that works 90% of the time and one you'd let run unattended.

> **DRAFT COPY — page hero**
> # Physical AI, minus the demo reel.
> *Everything here is real. Almost none of it is ready in the way people think it is.*
>
> Physical AI is the part of the field where a model stops answering questions and starts moving mass. It's the most interesting thing to happen to robotics in thirty years, and it is being sold about four years ahead of where it actually is. We work in the gap between those two facts.

### 01 // The honest version

> **DRAFT COPY**
> ## Three numbers before you commit.
> *We'd rather lose the project than lose the year.*
>
> **Fifty to two hundred.** That's roughly how many teleoperated demonstrations current imitation-learning approaches need per task. A cell with twenty distinct tasks lands somewhere between one and four thousand demonstrations. Someone has to perform every one of them, and someone has to throw out the bad ones.
>
> **Ninety-five to ninety-nine percent.** That's the uptime a production line expects. Many of the platforms in the humanoid demo videos run thirty to ninety minutes before they need a charge or a human. Both numbers are true at once, and the distance between them is the entire job.
>
> **2026 is a validation year.** Real deployments exist — tote moves, line-side delivery, kitting, machine tending, inspection — and they're narrow, supervised, and hard-won. Broad factory-scale adoption reads like a 2030s story. Anyone promising otherwise is selling you a slide.
>
> None of this means don't start. It means start on the task that survives contact with those numbers, and build the data and evaluation machinery first, because that's the part nobody demos.

Numbers here are from §9.1. Add a `.small.muted` line under the section: `Figures reflect published industry reporting as of September 2026. Ask us for the current version — they move.`

### 02 // What actually works

> **DRAFT COPY**
> ## Where a learned policy earns its place.
> *And where a fixture and a limit switch still win.*

Two-column comparison (build with `.cards` at 2-up, or a simple hairline table — table is more on-brand):

| A learned policy is probably right | A fixture is probably right |
|---|---|
| High part variation you can't fixture away | Same part, same pose, every cycle |
| Contact-rich assembly with tolerance for feel | Position-repeatable moves inside 0.1 mm |
| Deformables — cloth, cable, foam, food | Rigid parts arriving on a known datum |
| Long tail of variants that would need 40 programs | Four variants and a tool changer |
| You already have a data pipeline and evaluation | You have neither, and a deadline |

> **DRAFT COPY — closing line for the section**
> That right-hand column isn't a consolation prize. It's most of manufacturing, it's cheaper, and it doesn't need a GPU. We'll tell you when you're in it.

Then the model landscape, written as orientation rather than endorsement — vendor-neutral, matching the site's existing "bake-offs, not brochures" stance:

> **DRAFT COPY**
> ## We run bake-offs on models too.
> *Same rule as robots. Your parts, your bench, your numbers.*
>
> The generalist policy space moves monthly: flow-matching VLAs, open-weight generalist models trained on cross-embodiment data, diffusion policies, and vendor stacks that ship with the hardware. We hold opinions and we don't hold loyalties. What we care about is how a candidate does on your task, on your bench, measured the same way twice.
>
> The evaluation is the deliverable. The model is a detail that will be obsolete by the time your cell is commissioned, and your evaluation harness will still be there.

### 03 // Demonstration budget calculator ← THE INTERACTIVE

**File:** `assets/js/calc-demos.js` · **Root element guard:** `#demoCalc`

The most commercially valuable thing in V1. It tells a prospect the true cost of the thing they're excited about, in a form they can email to their CFO.

**Inputs** (reuse `.range`, `.check`, `.seg`, and `<select>` styling):

| Control | Range | Default |
|---|---|---|
| Distinct tasks | 1–40 slider | 8 |
| Variants per task (part types, poses, bins) | 1–10 slider | 3 |
| Demos per variant | 50–200 slider | 100 |
| Minutes per demonstration | 1–15 slider | 4 |
| Usable-take rate | 50–95% slider | 70 |
| Operators | 1–10 slider | 2 |
| Loaded operator cost | $/hr number, default 45 | |
| ☐ Augment with simulation | toggle | off |
| ☐ Include evaluation passes | toggle | on |

**Outputs** (`.stat` blocks, big mono numbers):
- Total demonstrations needed (`tasks × variants × demos ÷ takeRate`)
- Teleop hours (`demos × minutes ÷ 60`)
- Calendar weeks (`hours ÷ (operators × 30 productive hrs/wk)`) — use 30, not 40, and say why in the disclaimer
- Operator cost band (± 30%, displayed as a range, never a point estimate)
- Evaluation passes: when on, add 15% of demo count as held-out eval episodes and a re-run per policy iteration (assume 4 iterations)
- **Verdict** — a `.stat--wide` SKY-1 line keyed to the result

**The sim toggle is the honest bit.** When enabled, reduce required real demos by 35–60% depending on task type — *and simultaneously show a new cost line*: sim environment build, 3–8 weeks of engineering. Net effect at small task counts: sim is not worth it. At large task counts: it obviously is. **The calculator should let people discover that themselves.** That's the whole pitch for `/world-models/` and it lands far better as arithmetic than as a claim.

**SKY-1 verdicts, keyed to total demos:**
- `< 500`: *"That's a real project with a real number. Two operators, a few weeks. Start here, not with twenty tasks."*
- `500–2,000`: *"Now you have a staffing plan, not a science project. This is the size where the data pipeline stops being optional."*
- `2,000–6,000`: *"That's most of a year of somebody's life in a teleop rig. Worth asking which eight of those tasks actually pay for themselves."*
- `> 6,000`: *"I've seen this number kill programs. Not because it's impossible — because nobody budgeted for it and it showed up in month five. Cut the task list or build the sim pipeline. Preferably both."*

**Footer of the calculator** — the site's established disclaimer register:
> Numbers are illustrative and rounded with enthusiasm. Demonstration counts vary enormously by task, gripper, and how forgiving your tolerances are. Thirty productive hours a week per operator, not forty, because teleop is tiring and people have meetings. Real estimates come from a real conversation.

**CTA:** `Email me this estimate` → composes `mailto:` with every input and output in the body, subject `Physical AI demonstration budget — [N] tasks`. Same pattern as the existing `floorExport` handler in `builder.js` — copy that function.

### 04 // What we do

Four services, each with a four-item "You get":

1. **Task triage** — Which of your tasks deserve a learned policy, ranked by payback and risk. Usually the answer is "three of them, and not the one you're excited about."
2. **Data strategy & teleop** — Rig design, demonstration protocols, operator training, per-episode QC, and a schema you won't have to migrate in six months.
3. **Policy evaluation harness** — Success rate with confidence intervals, out-of-distribution probes, a standing regression suite, and a red-team task list.
4. **Fallbacks & interlocks** — What the cell does when the policy is uncertain, and how that path is proven to the same standard as the rest of your safety architecture.

Service 4 is the bridge to the existing safety offer and to §9.4 — the AI-in-safety-function regulatory story is a genuine differentiator. Cross-link it to `#services` S-04.

---

## 4.2 `/vision/` — Visual Intelligence

**Loop position:** PERCEIVE

**Thesis:** Perception is where robotics projects die quietly — not because the model is wrong, but because the lighting changed.

> **DRAFT COPY — page hero**
> # The robot can't do anything it can't see.
> *And it can see beautifully until Tuesday, when the sun comes through the loading door.*
>
> Vision is the highest-leverage and highest-variance system in a robot cell. Foundation models have quietly made the first four stages of the pipeline much easier than they were three years ago. The last two stages, and the physical environment around all six, are where the year goes.

### 01 // The honest version

> **DRAFT COPY**
> ## Nothing on this list is a model problem.
> *Every one of them has ended a pilot.*
>
> **Specular and transparent parts.** Polished steel and clear plastic break depth sensing in ways that no amount of fine-tuning fixes. The answer is usually a different sensor or a different light, not a different network.
>
> **Clutter and occlusion.** A part that's 90% visible is a solved problem. A part that's 30% visible under three other parts is a research topic with a delivery date attached.
>
> **Lighting drift.** Morning light, afternoon light, someone replaces a failed fixture with a slightly bluer one, and your pose estimates walk. Controlled lighting is the cheapest reliability upgrade in the building and it is skipped constantly.
>
> **Calibration drift.** Hand-eye calibration is not a one-time ceremony. Somebody bumps the camera mount, and a system that was accurate to half a millimetre is now confidently wrong.
>
> **The last two percent of pose error.** Ninety-eight percent is a great demo and a daily crash. The gap between them is fixturing, verification, and knowing when to refuse.

### 02 // What actually works

> **DRAFT COPY**
> ## Six stages, and what changed.
> *Four of them got much easier. Two of them didn't.*

Render as a horizontal six-stage diagram (hairline plates, mono labels, arrows — same visual family as the loop), each with a one-line note:

| Stage | Status |
|---|---|
| **Detect** | Largely solved zero-shot. Open-vocabulary detectors find your part without you training anything. |
| **Segment** | Largely solved zero-shot. Promptable segmentation gives clean masks on parts it has never seen. |
| **Depth** | Monocular depth foundation models are startlingly good and still not metrology. Know which one you need. |
| **Pose** | Zero-shot 6-DoF from a CAD model or a few reference views now works in cluttered bins. This is the big recent change. |
| **Grasp** | Still hard. Geometry proposes; the gripper, the surface, and the physics dispose. |
| **Verify** | Still skipped. The camera that checks the robot's work is often worth more than the one that guides it. |

> **DRAFT COPY — closing**
> The practical consequence: in 2026 you should be training far fewer custom models than you were in 2023, and spending the savings on lighting, fixturing, calibration discipline, and verification. That's a less exciting sentence than "we fine-tuned a foundation model," and it's where the reliability comes from.

Then a short subsection on sensor selection — 2D vs. stereo vs. structured light vs. time-of-flight vs. line-scan, with a one-line "pick this when" for each. Keep it to a hairline table; it's a genuinely useful reference and it's the kind of thing people bookmark.

### 03 // Perception pipeline ← THE INTERACTIVE

**File:** `assets/js/vision-lab.js` · **Root element guard:** `#visionLab`

The most visually striking piece in V1, and the natural companion to the arm playground.

**Stage:** a `<canvas>` showing a synthetic top-down bin of parts — a dozen rounded rectangles and hex shapes at varied rotations and overlaps, drawn in the site's ink-on-bone idiom. No photos; draw it. Photos would break the drafting-sheet aesthetic and the theme system.

**Controls** — a `.seg`-style stack of stage toggles, each adding an overlay *and* a latency cost:

| Toggle | Overlay drawn | Cost |
|---|---|---|
| Detect | Orange hairline boxes + mono confidence labels | 8 ms |
| Segment | Hatched masks, per-instance | 22 ms |
| Depth | Contour banding across the bin (reuse the hero's contour idiom — nice internal rhyme) | 14 ms |
| Pose | 3-axis frame markers on each part | 31 ms |
| Grasp | Gripper jaw pairs with a scored ranking | 12 ms |
| Verify | A second pass marking one part as a rejected pick | 9 ms |

**Two sliders that ruin everything, on purpose:**
- **Lighting** (0–100): as it drops, detections start dropping out, confidences fall, depth banding gets noisy, and pose markers jitter. At the low end, show a mono readout: `2 of 12 parts found · pose σ 4.1 mm`.
- **Clutter** (0–100): more overlap, occlusion, and failed grasps.

**Live readout** (`.arm__hud` styling — reuse it directly): `Found 11/12 · Pose σ 0.4 mm · Pipeline 87 ms · Budget 100 ms`. When accumulated stage cost exceeds the selected budget, the readout goes `--danger` and a mono line appears: `Over budget. Something has to go, or something has to get faster.`

That over-budget moment is the handoff into `/embedded/`. Put the link right there.

**Mascot integration:** on first over-budget event, `BSS_MASCOT.say("You turned on every stage. So does everyone. That's why the robot runs at four hertz.", {mood:"wow"})`.

**Reduced motion:** no jitter animation; state changes apply instantly. Everything must be operable via checkboxes and sliders with the keyboard.

### 04 // What we do

1. **Sensor & lighting selection** — Bench test on your actual parts, including the shiny one you were hoping we wouldn't ask about.
2. **Calibration & drift monitoring** — Hand-eye and intrinsics, plus an automated check that tells you when it's moved before the crash does.
3. **Perception pipeline build** — Detect → segment → depth → pose → grasp → verify, with per-stage latency budgets and a documented failure taxonomy.
4. **Verification systems** — Independent inspection of the robot's own work, with reject handling that doesn't stop the line.

---

## 4.3 `/embedded/` — On-Robot Autonomy

**Loop position:** DECIDE

**Thesis:** Autonomy is a latency budget with a power budget stapled to it. If it doesn't close the loop in time, it isn't control — it's a suggestion.

> **DRAFT COPY — page hero**
> # Ten milliseconds is not a lot of milliseconds.
> *Everything interesting about on-robot AI is a fight over a very small number.*
>
> A model that answers in two seconds is a chatbot. A model that answers inside your control period is a controller. The engineering between those two sentences is most of what we do on this page.

### 01 // The honest version

> **DRAFT COPY**
> ## Your average latency is a lie.
> *The number that breaks robots is p99.9.*
>
> Every inference benchmark you will be shown is a mean. Robots are broken by tails. A perception stack that runs in 20 ms on average and 140 ms once every few thousand frames will pass every test you write and then put a gripper through a fixture on the second shift.
>
> Measure the tail. Budget for the tail. Design the fallback for the tail. If the policy can't answer in time, the correct behaviour is a defined, safe, boring one — hold position, re-approach, ask a human — and that behaviour has to be proven, not assumed.
>
> The second lie is thermal. Every compute module has a headline TOPS number and a power range, and the headline number assumes cooling you do not have inside a sealed arm on a summer afternoon. Size for the sustained clock, not the datasheet.

### 02 // What actually works

> **DRAFT COPY**
> ## The budget, stage by stage.
> *Sense, preprocess, infer, postprocess, actuate. Everything has to fit.*

A worked example table — this is the reference content people come back for:

| Control rate | Period | What fits |
|---|---|---|
| 1000 Hz | 1 ms | Joint servo loop. Nothing learned runs here. Ever. |
| 100 Hz | 10 ms | Reactive control, force response, small distilled policies |
| 30 Hz | 33 ms | Visuomotor policies, most manipulation control loops |
| 10 Hz | 100 ms | Perception-heavy planning, VLA-class policies, re-grasp decisions |
| < 1 Hz | > 1 s | Task planning, language reasoning, anything that can wait |

> **DRAFT COPY**
> The architecture follows from that table and not from a vendor's block diagram. Anything inside the control loop runs on the robot. Anything that can tolerate a second of delay and a lost network can go to the cloud. There is no third category, and "we'll just put it in the cloud and it'll be fine" is how you learn what your Wi-Fi does when a forklift passes.

Subsection on **making it fit** — quantization, kernel fusion, distillation, compiled runtimes — with the discipline attached:

> **DRAFT COPY**
> Quantization is the biggest lever and the most abused one. Dropping precision routinely buys large speedups, and it *changes the model's behaviour*. Not "slightly reduces accuracy" in the abstract — changes which grasps it picks, on which parts, under which lighting.
>
> So the rule is simple and non-negotiable: **the quantized model is a different model, and it gets the full evaluation suite.** Every time. If that sounds expensive, note that it's exactly why the evaluation harness on the Physical AI page is the deliverable and the model is a detail.

Subsection on **determinism**: RT-patched kernel, CPU core isolation and affinity, IRQ pinning, ROS 2 DDS and QoS configuration, memory locking, and the difference between soft and hard real-time in a system that has a GPU in it.

### 03 // Latency budget builder ← THE INTERACTIVE

**File:** `assets/js/calc-latency.js` · **Root element guard:** `#latencyCalc`

Visually the most on-brand piece in V1: a budget bar is literally a drafting measurement.

**Layout:** one horizontal bar representing the control period, with a hard deadline line. Stages stack left to right as coloured segments with mono labels. Over-budget overflow renders past the deadline line in `--danger` with a hatched fill.

**Controls:**
- Control rate: `.seg` — 100 Hz / 30 Hz / 10 Hz / 1 Hz (sets the bar's full width)
- Stage list, each addable/removable with an editable ms value:

| Stage | Default |
|---|---|
| Camera exposure + readout | 8 ms |
| Transport / driver | 3 ms |
| Preprocess (undistort, resize, normalize) | 4 ms |
| Perception inference | 25 ms |
| Policy inference | 30 ms |
| Postprocess + safety check | 5 ms |
| Command transport to controller | 2 ms |

- Precision: `.seg` — FP16 / INT8 / FP4. Switching scales the two inference stages by a factor and **fires a warning line**: `INT8 selected. This is now a different model. Re-run the evaluation suite.`
- ☐ Show p99.9 — adds a translucent tail extension to each segment (1.6× default) and recomputes. Most configurations that pass on the mean fail here. **That's the lesson of the whole page and it should be a satisfying, slightly alarming click.**

**Readout:** `Total 77 ms · Budget 100 ms · Headroom 23 ms` → in `--ok`; over budget flips to `--danger` with `Over by 41 ms. You are running at 14 Hz, whatever the spec sheet says.`

**SKY-1 verdicts:**
- Under budget with >30% headroom: *"Comfortable. Suspiciously comfortable. Did you measure this or estimate it?"*
- Under budget with <10% headroom: *"It fits, on a good day, with nothing else running. Add the p99.9 tail and tell me if you still like it."*
- Over budget: *"That's not a control loop, that's a strong opinion arriving late. Cut a stage, drop precision and re-validate, or slow the loop down and admit it."*
- Over budget at 100 Hz specifically: *"Nothing learned runs at a kilohertz and very little runs at a hundred. This is what distillation is for."*

**Disclaimer:** *Stage costs are illustrative defaults from typical embedded pipelines, not measurements of your system. The only latency number that matters is the one you measured on your hardware, with your model, under load, at the ninety-ninth-point-nine percentile.*

### 04 // What we do

1. **Compute selection** — Sized against a measured latency and thermal budget, not a TOPS number, including the boring question of what it does at 45°C.
2. **Model optimization** — Quantization, fusion, distillation, and compiled runtimes, each followed by a full re-evaluation rather than a vibe.
3. **Real-time architecture** — RT kernel, core isolation, IRQ affinity, ROS 2 QoS profiles, and a measured p99.9 you can put in a document.
4. **Degradation design** — Defined behaviour when the policy is late or uncertain, validated to the same standard as the e-stop.

---

## 4.4 `/world-models/` — Simulation & World Models

**Loop position:** IMAGINE

**Thesis:** Don't learn on the robot what you could have learned in a simulator, and don't trust a simulator you haven't measured against the robot.

> **DRAFT COPY — page hero**
> # Break it ten thousand times where it's free.
> *Then find out how much the simulator lied to you. That second part is the job.*
>
> Simulation stopped being a nice-to-have the moment policies started needing thousands of episodes. What's new is that "simulator" now means three quite different things, and picking the wrong one costs a quarter.

### 01 // The honest version

> **DRAFT COPY**
> ## The gap is real, and it's task-shaped.
> *Sim transfers beautifully for some things and not at all for others. The difference is predictable.*
>
> Locomotion transfers well. Rigid pick-and-place transfers well. Contact-rich assembly transfers badly. Deformables transfer badly and expensively. Anything that depends on surface friction, compliance, or the exact behaviour of a suction cup on a slightly dusty part transfers about as well as a weather forecast.
>
> This is knowable *before* you build the environment, and it should determine how much you build. A team that spends three months on a photoreal digital twin to train a task that was always going to need real contact data has not made a mistake of execution. They made a mistake of triage, in week one, for free.
>
> The measurement discipline matters more than the fidelity. A modest simulator you have honestly characterised against the real cell is worth more than a beautiful one you trust.

### 02 // What actually works

> **DRAFT COPY**
> ## Three things are called "world models." Only one of them is new.

Three hairline plates, side by side:

**1 · Physics simulators** — *Classical, and getting much faster.*
GPU-parallel rigid-body simulation running thousands of environments at once. This is where locomotion and most manipulation policies are actually trained today. The notable recent development is open, GPU-accelerated, differentiable physics with multiple solvers under one roof — including deformables, signed-distance-field collision, and validated policy transfer between engines. Mature, boring in the good way, and where most of your budget should go.

**2 · Video world models** — *New, genuinely impressive, not yet a training environment for your cell.*
Models that generate consistent, interactive environments from text or an image, navigable in real time. Enormously promising for data augmentation, rare-event generation, and scenario coverage. Not a substitute for physics when your policy's success depends on contact forces, because a model that predicts plausible pixels is not predicting your friction coefficient.

**3 · Latent world models** — *The planning-flavoured branch.*
Models that learn compact dynamics and let a policy plan by imagining forward in latent space. This is the line of work that offers what pure behaviour-cloning can't — counterfactual reasoning, long-horizon planning, and better data efficiency out of distribution. Early in industrial practice. Worth watching closely and not worth betting a delivery date on.

> **DRAFT COPY — closing**
> Our position, stated plainly so you can disagree with it: physics simulation is where your budget goes today, learned world models are where your data augmentation goes next, and anyone telling you the third category is production-ready for contact-rich manipulation is describing a roadmap, not a product.

Subsection — **the asset pipeline**, which is where sim projects actually die:

> **DRAFT COPY**
> ## Your CAD is not a simulation asset.
> *This is the sentence everyone learns in month two.*
>
> Getting from a mechanical assembly to something a physics engine can run at speed means decimation, convex decomposition, collision geometry, joint definition, mass and inertia that aren't defaults, and materials that mean something. Doing it once is a project. Doing it every time the design changes is a pipeline, and the pipeline is the deliverable.
>
> The other route in is photographic. Reconstruct the real cell from a few dozen images, get a photorealistic scene in minutes, then convert it to collision-ready geometry for the physics engine. It's the fastest way to simulate an environment that already exists — and it captures the cable tray that isn't in anybody's CAD.

### 03 // Reality-gap meter ← THE INTERACTIVE

**File:** `assets/js/gap-meter.js` · **Root element guard:** `#gapMeter`

Smaller than the other three interactives, and it should be — this page's weight is in the writing. **Reuse the existing `.gauge` SVG component from the diagnostic wholesale.**

**Input:** pick a task type (`.opt` list, same styling as the quiz):
Legged locomotion · Rigid pick & place · Bin picking with clutter · Contact-rich assembly · Deformable handling · Vision-dominant inspection · Mobile navigation

**Modifiers** (checkboxes, each nudges the needle):
- ☐ Parts are shiny or transparent
- ☐ Tolerances under 0.5 mm
- ☐ Environment changes between runs
- ☐ You already have a validated system-identification pass

**Output:** the needle shows an honest "how much of this can sim do" band (a band, not a point — draw the arc as a range), plus:
- A recommended split: `~80% sim / 20% real` etc.
- A "what closes the gap" list of three concrete actions for that task type
- A "what sim will not fix" line — always present, always specific

Example for contact-rich assembly:
> **~35% sim / 65% real.** Sim gets you approach, collision avoidance, and gross motion. It will not get you insertion. Budget real-world demonstrations for the last two centimetres and expect that to be where the schedule goes.

### 04 // What we do

1. **Sim environment build** — From your CAD or scanned from your actual cell, with an asset pipeline that survives the next revision.
2. **Randomization & system ID** — A documented plan for what varies in training and a measured match between simulated and real dynamics.
3. **Sim-versus-real harness** — The same task, scored the same way, in both places, tracked over time, so "the gap" is a number and not a feeling.
4. **Scenario & rare-event coverage** — The failure cases you can't safely stage on a real line, generated and tested where they're free.

---

## 4.5 `/cloud/` — Robot Data & Cloud

**Loop position:** CAPTURE

**Thesis:** A robot lab is a data business with a floor plan. Most teams discover their data architecture after they've filled a NAS.

> **DRAFT COPY — page hero**
> # Your fleet is a data business with a floor plan.
> *The robots are the sensors. The loop is the product.*
>
> Every hour your robots run, they generate the only thing that makes next quarter's policy better than this quarter's. Almost nobody is set up to keep it, find it, or use it. This is the least glamorous page on this site and it's the one that decides whether the rest works.

### 01 // The honest version

> **DRAFT COPY**
> ## Do the multiplication before you buy the robots.
> *It's a small sum and it changes the plan.*
>
> Four cameras at 1080p and 30 frames a second, running two shifts, across six robots, is not a rounding error. It's a facilities decision, a network decision, and a recurring bill. Teams routinely reach that number by accident, discover it in month four, and respond by deleting the data — which is to say, by turning off the loop that was the entire point.
>
> The projects that go wrong here go wrong the same way. Three rules that prevent it:
>
> **Keep the raw.** Compressed, tiered to cold storage, but keep it. You will want to re-derive datasets with a labelling scheme you haven't invented yet.
>
> **Record provenance, not just data.** Which robot, which policy version, which gripper, which calibration, which shift. A trajectory without its context is a video.
>
> **Decide retention on day one.** Not because storage is expensive, but because "everything forever" is not a policy and it will be made for you, badly, in a hurry, by whoever gets the bill.

### 02 // What actually works

**Formats and the conversion tax:**

> **DRAFT COPY**
> ## Two ecosystems, one conversion tax.
> *Operational logging and learning datasets are not the same thing, and the seam between them is a real cost.*
>
> On the robot, the operational format is a self-describing container that handles heterogeneous, multi-schema, timestamped streams and is the default in modern ROS 2 — the thing you replay when something went wrong at 3 a.m.
>
> On the training side, the learning ecosystem has converged on episode-oriented dataset formats built around demonstrations, with cross-embodiment collections published in them and tooling that assumes them.
>
> These are different shapes for good reasons, and the conversion between them is a pipeline you own forever. Design it early, make it deterministic, version it, and make it possible to regenerate every training set from raw. Teams that skip this end up with datasets nobody can reproduce and a model nobody can explain.

**Training economics — the reframe:**

> **DRAFT COPY**
> ## Training is the cheap part. Nobody believes this.
> *Fine-tuning is a rounding error next to collecting the data and proving the result.*
>
> Renting serious GPUs is a couple of dollars an hour per card. A parameter-efficient fine-tune of a generalist policy on a few hundred episodes runs overnight on a single card. A full fine-tune across eight cards is a day or two. In money, that's a rounding error against a robotics program.
>
> The costs that actually hurt are the ones on the Physical AI page: thousands of teleoperated demonstrations, the operators who perform them, the engineers who clean them, and the evaluation infrastructure that tells you whether any of it worked. Compute is the line item everyone budgets for and the one that matters least.
>
> Which is the good news, mostly. It means the expensive part is something you can be strategic about instead of something you rent.

**Fleet operations:**

> **DRAFT COPY**
> ## Shipping a policy is a deployment, not a file copy.
> *Treat it like software, because it is software that can move a two-kilo part at speed.*
>
> Versioned artifacts, staged rollout, a canary robot, automatic rollback on a metric you agreed on in advance, per-robot configuration that survives a re-image, and observability that tells you a cell is degrading before the operator does.
>
> Note for people planning around old documentation: the managed cloud-robotics services of the last generation have largely been withdrawn, and the current pattern is edge agents plus your own orchestration, or a fleet platform chosen on its own merits. We're vendor-neutral here for the same reason we are about arms.

**Governance:** who can see camera feeds from a workplace, retention and deletion, PII in the background of every frame, and how that intersects with the compliance overlay in §9.4. Keep it to four or five sentences — it's a flag, not a legal page.

### 03 // Robot data math ← THE INTERACTIVE

**File:** `assets/js/calc-data.js` · **Root element guard:** `#dataCalc`

**Inputs:**
- Robots in fleet: 1–50
- Cameras per robot: 1–8
- Resolution: `.seg` — 720p / 1080p / 4K
- Frame rate: 10 / 30 / 60
- Compression: `.seg` — Raw / Lossless / H.265
- Operating hours per day: 1–24
- Days per month: 1–31
- ☐ Include depth streams (adds ~40%)
- ☐ Include proprioception & logs (small, always on, shown for honesty)
- Retention: 1 / 3 / 12 / 36 months
- Hot / warm / cold tiering split (three-handle slider or three number inputs summing to 100)

**Outputs:**
- GB per robot-hour
- TB per day, TB per month
- Steady-state stored volume at the chosen retention
- Monthly storage cost band, tiered
- Egress cost if you move it once
- **"How long until this is a problem"** — months until the stored volume crosses a threshold you set (default 100 TB), expressed as a date

**SKY-1 verdicts:**
- `< 1 TB/mo`: *"Comfortable. Keep everything, keep it raw, and enjoy this while it lasts."*
- `1–20 TB/mo`: *"Normal for a real pilot. Tier it now, while it's a design decision and not an incident."*
- `20–100 TB/mo`: *"That's a platform, not a folder. Somebody needs to own this, and it shouldn't be the person who owns the robots."*
- `> 100 TB/mo`: *"At this rate the interesting question isn't storage cost, it's whether you can find anything. Curation beats capacity."*

**Disclaimer:** *Bitrates are illustrative and depend heavily on scene content, encoder settings, and how much your parts move. Cloud storage and egress prices vary by provider, region, and how good you are at negotiating. Numbers here are rounded with enthusiasm.*

### 04 // What we do

1. **Capture architecture** — Schema, provenance, on-robot buffering, and an ingest path sized to your actual bitrate and your actual network.
2. **Dataset pipeline** — Deterministic, versioned, reproducible conversion from raw logs to training-ready episodes.
3. **Training & evaluation infrastructure** — Set up so your team runs it, in your account, with cost visibility and no lock-in to us.
4. **Fleet rollout** — Versioned policies, staged canaries, metric-triggered rollback, and observability that pages someone before the line stops.

---

# 5. Field Notes — `/notes/`

A consultancy claiming expertise in five hyped domains needs visible thinking. This is also the only part of V1 that keeps producing value after launch.

**Build:** an index page (`notes/index.html`) listing entries, and one file per entry (`notes/<slug>.html`). No CMS, no feed generator, no dates-in-filenames scheme. A hairline list with title, one-line standfirst, and date is enough.

**Article template:** `.container` at a narrower measure (~68ch), the same eyebrow/h1/serif-subtitle rhythm, generous hairline rules between sections, mono figure captions. No sidebar, no share buttons, no related-posts widget.

**Seed titles** — each is a thesis already argued somewhere in §4, expanded to 800–1,500 words. Write two before launch, not six. A notes index with two good essays reads better than one with six thin ones.

1. **"Your average latency is a lie."** The p99.9 argument, with a worked example of a pipeline that passes every test and breaks on the second shift.
2. **"Fifty to two hundred."** What imitation learning actually costs per task, and how to pick the three tasks worth it.
3. **"The simulator lied to you, and that's fine."** Reality gap as a measurable, task-shaped, budgetable quantity rather than a disappointment.
4. **"Keep the raw."** Three data decisions made in week one that determine whether you have a flywheel or a NAS.
5. **"A fixture and a limit switch."** In defence of not using AI, from people who do use it.
6. **"AI in a safety function."** What the 2025 robot-safety revision and the 2027 EU machinery rules mean if your policy is learned. ← this one is the most commercially valuable; see §9.4.

**Cross-linking:** every domain page links to the note that expands its argument; every note links back to its page and to `../#contact`. That's the whole internal-linking strategy.

---

# 6. SKY-1 updates

SKY-1 is the site's connective tissue and it currently knows nothing about any of this. Updating the knowledge base is **not optional** — a mascot that says "I'm a scripted robot with a narrow but enthusiastic brain" when asked about world models on the world models page is a bug the user will notice immediately.

## 6.1 New KB intents

Add to the `KB` array in `assistant.js`. Same shape: `{ k: [...keywords], a: "answer", chips: [...] }`. Keep answers to 3–5 lines with `\n•` bullets, exactly as the existing entries do.

| Keywords (abbreviated) | Answer covers |
|---|---|
| `physical ai`, `embodied`, `humanoid`, `generalist policy`, `vla`, `foundation model for robots` | The honest version: real, moving fast, bottlenecked on demos and evaluation. Links to `physical-ai/`. |
| `world model`, `simulation`, `sim to real`, `reality gap`, `isaac`, `mujoco`, `digital twin`, `synthetic data` | Three families, physics gets the budget today. Links to `world-models/`. |
| `embedded`, `edge`, `on-robot`, `jetson`, `latency`, `real time`, `quantization`, `inference`, `tensorrt`, `compute` | Latency budget framing, p99.9, quantization needs re-validation. Links to `embedded/`. |
| `cloud`, `data`, `dataset`, `storage`, `fleet`, `training`, `gpu`, `mlops`, `rollout`, `logs` | Fleet is a data business, keep the raw, training is the cheap part. Links to `cloud/`. |
| `vision`, `camera`, `perception`, `pose`, `grasp`, `bin picking`, `depth`, `lighting`, `calibration`, `segmentation` | Six stages, four got easier, lighting and calibration still end pilots. Links to `vision/`. |
| `how many demos`, `demonstrations`, `teleop`, `data collection`, `imitation learning` | Points at the demo calculator directly with a `__GOTO:` handler. |
| `is ai ready`, `should we use ai`, `do we need ai`, `hype`, `worth it` | The triage answer. This is the highest-value intent on the site — write it carefully. |

## 6.2 Extend the existing AI intent

The current answer is already the right idea and should now point somewhere:

> **DRAFT COPY — revised `ai` intent**
> Yes, carefully. We integrate vision and learned policies where they earn their place, with evals and fallbacks, and we're honest when a fixture and a limit switch would beat a neural net. I say this as a neural-net-adjacent entity.
>
> There's a whole loop behind that answer now: perception, on-robot autonomy, simulation, and the data platform underneath. Ask me about any of them, or I can show you the honest cost of the demonstrations first.

New chips: `["Show me the loop", "How many demos?", "Is AI ready for us?"]`

## 6.3 New special handlers

Extend `special()` alongside `__EMAIL__` / `__JOKE__` / `__DANCE__` / `__THEME__` / `__GOTO:id__`:

- `__NAV:path__` — navigate to another page (the existing `__GOTO:` only scrolls to an in-page anchor; on the domain pages it needs a cross-page sibling). Handle the `../` prefix correctly from subdirectories.
- `__CALC:name__` — scroll to a calculator on the current page, or navigate to it if you're elsewhere.

## 6.4 Page-aware greeting

`assistant.js` should vary its opener by page. One line, derived from `document.body.dataset.page` (add `data-page="vision"` etc. to each `<body>`):

- vision: *"You're on the perception page. Ask me what breaks it — that list is more useful than the list of what works."*
- embedded: *"Latency page. My honest advice: measure the tail, not the mean."*
- world-models: *"Simulation page. I have opinions about which third of your task list belongs in here."*
- cloud: *"Data page. Least glamorous, most decisive. Ask me the multiplication."*
- physical-ai: *"The hub. Everything here is real and most of it is early. Want the honest cost first?"*

## 6.5 New jokes

The `JOKES` array should gain a few in-domain ones, same dryness:

- *"I asked the world model to imagine a cup of coffee. It imagined seven, all slightly wrong, at 24 frames a second."*
- *"We quantized the policy to INT8 and it got 40% faster and 6% weirder. That's the trade, written honestly."*
- *"My latency budget has a hole in it. It's shaped exactly like a vision transformer."*
- *"The digital twin is doing great. The physical one has a loose cable."*

---

# 7. Cross-cutting technical spec

## 7.1 Head, meta, and SEO

Every page needs its own title, description, and OG tags. Titles follow `<Page> — Big Sky Systems`. Descriptions are one sentence, written in voice, under 155 characters.

| Path | `<title>` | Description |
|---|---|---|
| `/` | Big Sky Systems — Robotics Lab Consulting | *(unchanged)* |
| `/physical-ai/` | Physical AI — Big Sky Systems | Learned policies are real and early. We work in the gap: demonstrations, evaluation, and the cost nobody demos. |
| `/vision/` | Visual Intelligence — Big Sky Systems | Perception is where robotics projects die quietly. Sensors, lighting, pose, grasping, and what actually breaks them. |
| `/embedded/` | On-Robot Autonomy — Big Sky Systems | Autonomy is a latency budget with a power budget stapled to it. Compute selection, optimization, and real-time architecture. |
| `/world-models/` | Simulation & World Models — Big Sky Systems | Break it ten thousand times where it's free, then measure how much the simulator lied. |
| `/cloud/` | Robot Data & Cloud — Big Sky Systems | Your fleet is a data business with a floor plan. Capture, datasets, training infrastructure, and fleet rollout. |
| `/notes/` | Field Notes — Big Sky Systems | Working notes on robotics, physical AI, and the parts of both that don't demo well. |

Also add across the site:
- `<link rel="canonical">` on every page
- A hand-written `sitemap.xml` at root (nine URLs at V1 scope: home, five domain pages, notes index, two notes — a static list, not worth generating)
- `robots.txt` **already exists** and allows everything — add one `Sitemap: https://<host>/sitemap.xml` line, don't recreate the file
- `og:image` — **currently missing entirely.** Make one 1200×630 SVG-rendered-to-PNG per page in the engineering-paper style: bone background, dot grid, the brand mark, the page title in Archivo, one orange element. This is a real gap in V0 worth closing in V1; every link shared to Slack or LinkedIn is currently a grey box.
- `JSON-LD` `ProfessionalService` on the home page: name, description, email, `areaServed`, `knowsAbout` listing the domains. Modest, accurate, no fake review markup.

## 7.2 URL and file layout

```
/index.html
/physical-ai/index.html
/vision/index.html
/embedded/index.html
/world-models/index.html
/cloud/index.html
/notes/index.html
/notes/<slug>.html
/assets/css/styles.css          ← shared, extended
/assets/css/pages.css           ← NEW: page-hero, loop diagram, calculators, notes
/assets/js/...                  ← shared, extended
/assets/img/og/<page>.png       ← NEW
/sitemap.xml                    ← NEW
/robots.txt                     ← EXISTS, add a Sitemap: line
/404.html, /.nojekyll           ← EXIST, no change
/netlify.toml, /vercel.json     ← EXIST, no change
```

**Paths:** root-absolute everywhere — `/assets/css/styles.css`, `/assets/js/main.js` — matching what `404.html` already does. Home anchors from a subdirectory are `/#services`, not `../#services`. Getting this uniform removes the single most likely class of bug in this build.

**Trailing-slash directory URLs** (`/vision/` → `/vision/index.html`) resolve natively on **GitHub Pages** and on **Netlify**; **Vercel** is already configured with `"cleanUrls": true` in `vercel.json`. **CloudFront is the exception** — it only applies a default root object at the distribution root, so `/vision/` returns an error unless you attach a CloudFront Function or Lambda@Edge that appends `index.html` to directory requests. Since three of the four hosts are already provisioned in this repo, build for the directory-URL shape and treat the CloudFront function as a migration task. Worth telling JJ now, because it's a five-line function written up front versus six broken URLs discovered after a DNS cutover.

## 7.3 CSS and JS loading

**CSS:** keep `styles.css` as the shared system and add `pages.css` for everything new. Two files, both loaded everywhere. Don't split per-page — the total is small and a second request beats a maintenance problem. Any new *token* goes in `tokens.css` **and** the `:root` of `styles.css` (see §3.5).

**JS:** the existing IIFE-with-root-guard pattern means shared scripts are safe to load everywhere. So:

- Load on every page: `config, sound, mascot, assistant, main`
- Load on home only: `sky, arm, builder, quiz`
- Load per domain page: its one calculator module

### `main.js` — the exact fix

`main.js` is one IIFE with no internal error boundaries, so **the first unguarded null dereference kills every line after it** — including dance mode, the Konami handler, and the card flip wiring. This is the highest-risk item in the build. Here is the precise inventory, so you don't have to hunt.

**Already safe** (guarded or `querySelectorAll`-based): the typed headline (`if (typed && !reduce)`), the cursor reticle (`&& ret`), the conveyor belt (`if (!beltWrap) return;`), and everything driven by `.card` / `.reveal` / `.station`.

**Group 1 — chrome the new pages must simply include.** No code change; just make sure the duplicated header/footer carries these, or `main.js` dies immediately:

| Element | Used at | Why |
|---|---|---|
| `<meta name="theme-color">` | line 21 | `applyTheme` calls `.setAttribute` on it unconditionally. `404.html` omits it — but `404.html` also doesn't load `main.js`. Your new pages do. |
| `#themeToggle` | 20, 29 | theme button |
| `#soundToggle` | 36, 39 | sound button |
| `#navBurger`, `#navLinks` | 60, 61, 68 | mobile nav |
| `#toTop` | 70, 73 | back-to-top button — belongs on every page anyway |
| `#year` | 172 | footer year |

**Group 2 — home-only blocks that need real guards.** Four edits:

| Lines | Block | Guard |
|---|---|---|
| 43–57 | Boot overlay — `boot.classList`, `boot.hidden`, `log.appendChild`, `bar.style`, `$("bootSkip").addEventListener` | wrap the whole boot section in `if (boot) { … }` |
| 100–110 | **Telemetry `setInterval`** — `tStars/tTime/tCursor/tUptime/tCoffee` | `if (tUptime) { setInterval(…) }` |
| 158 | `$("copyEmail").addEventListener` | `const ce = $("copyEmail"); if (ce) …` |
| 163 | `$("contactForm").addEventListener` | `const cf = $("contactForm"); if (cf) …` |

**The telemetry one is the nastiest and the easiest to miss.** It throws *inside a one-second interval*, so it doesn't break page load — it just floods the console with a fresh `TypeError` every second, forever. A quick "looks fine" check will pass it. Fix it explicitly and verify with a clean console.

**Verification:** the fastest honest test is to load a page that has the nav and footer but none of the home-only markup, and confirm the console is silent for at least ten seconds *and* that dance mode still fires (proving execution reached the bottom of the file). `python3 -m http.server 8741`, per `CLAUDE.md`.

`sky.js` (hero canvas) is home-only, so the domain pages have no canvas background. That's correct — the domain pages should be quieter than the home page.

## 7.4 Calculator module conventions

All four calculators share enough structure to justify a small shared helper, `assets/js/calc-kit.js`:

```js
window.BSS_CALC = {
  fmt(n, unit),                  // consistent number formatting + rounding
  band(n, pct),                  // "$12k – $22k" range formatting, never point estimates
  bindRange(el, onChange),       // range input + live mono readout
  verdict(rules, value),         // pick a SKY-1 line from a threshold table
  mailto(subject, fields),       // compose the email export, mirrors builder.js floorExport
  debounce(fn, ms)
};
```

**Rules for every calculator:**
- Ranges, not point estimates, wherever money or time is output.
- Every calculator has a visible disclaimer in the established register.
- Every calculator has an "email me this" that composes a `mailto:` with all inputs and outputs.
- Every calculator has a SKY-1 verdict that is willing to be discouraging.
- State is in the URL query string so results are shareable and JJ can send someone a pre-filled link. This is cheap (`URLSearchParams`) and disproportionately useful in a sales conversation.
- Fully keyboard operable; every slider has a paired number input or visible value.
- No results are stored, sent, or logged. Say so.

## 7.5 Accessibility

- Every canvas gets a text-equivalent summary in the DOM that updates with state (`aria-live="polite"`, `.mono.muted` readout). The vision lab's readout does double duty here.
- Every calculator is operable and legible with `prefers-reduced-motion: reduce`.
- Colour is never the only signal: over-budget states get an icon or a word, not just `--danger`.
- Check `--muted-2` on `--surface` in both themes for the small mono labels in the new components — it's the one token pair in V0 that gets close to the contrast floor, and the calculators use a lot of small mono text.
- Loop diagram: the five links must exist as real, focusable, labelled anchors, not SVG shapes with click handlers.
- Heading order per page: one `h1`, section `h2`s, card `h3`s. Don't skip levels for styling.

## 7.6 Performance budget

V0 is roughly 146 KB of hand-written assets plus fonts. Hold the line:

- Any single page ≤ 250 KB of own assets, excluding fonts.
- No new web fonts. Three families is already generous.
- No images that could be SVG. The only raster files in V1 should be the OG images.
- Canvas work throttled to `requestAnimationFrame` and paused via `IntersectionObserver` when off-screen — **the vision lab in particular must not run its render loop while scrolled past.**
- Fonts already use `display=swap`. Keep it.

---

# 8. Build sequence

Ship in phases. Each phase leaves the site deployable and better than before. **Do not build all five pages before deploying any of them.**

### Phase 0 — Groundwork *(no visible change)*
1. Audit and guard `main.js` for use on pages without home-only elements (§7.3). Test by loading it on a blank page.
2. Create `assets/css/pages.css` and `assets/js/calc-kit.js`.
3. Build `/vision/index.html` as the template skeleton — chrome, page-hero, loop strip, next strip — with placeholder body copy.
4. Verify: paths, both themes, mobile, keyboard, no console errors.

**Gate: the skeleton page must be indistinguishable in quality from the home page before any content goes in.**

### Phase 1 — The Loop *(home page)*
5. Build the loop SVG section, renumber the eyebrows, extend the hero lede, add the fourth hero action.
6. Point all five loop nodes at their future URLs. Four will 404 until Phase 2 — either build the four pages as stubs first, or hold this phase until Phase 2 lands. **Prefer stubs**: a stub with a real hero and "the long version is being written" in voice is better than a 404 and lets you deploy incrementally.
7. Add the four new service cards.

### Phase 2 — Pages, one at a time
Build in this order — it's ordered by how much each page stands on its own and how much new machinery it needs:

8. **`/vision/`** — most visual, template already exists, and the vision lab is the best demo of the new set.
9. **`/embedded/`** — latency builder is the simplest calculator and the most on-brand visual.
10. **`/physical-ai/`** — the commercial hub; needs the other two to link to.
11. **`/cloud/`** — straightforward arithmetic, heavy on writing.
12. **`/world-models/`** — reuses the existing gauge, so least new code; heaviest writing.

Deploy after each. Each page = its own commit or PR.

### Phase 3 — Connective tissue
13. SKY-1 KB expansion, page-aware greetings, new special handlers, new jokes.
14. Lab Builder: four new modules, four new sprite symbols, new opinion rules.
15. Nav restructure and footer link column.

### Phase 4 — Notes and polish
16. `/notes/` index plus the first two essays.
17. OG images, sitemap, robots.txt, canonicals, JSON-LD.
18. Full QA pass (§8.1).

### 8.1 Definition of done

Per page:
- [ ] Renders correctly in **paper and graphite**, at 360px, 768px, 1440px
- [ ] Zero console errors and zero 404s, including from subdirectory depth
- [ ] Fully usable with `prefers-reduced-motion: reduce`
- [ ] Fully operable by keyboard; visible focus everywhere; logical tab order
- [ ] Every canvas/interactive has a live text equivalent
- [ ] Title, description, canonical, OG tags, OG image present
- [ ] Nav and footer identical to every other page (diff them)
- [ ] SKY-1 answers at least three questions about this page's topic without falling back to "I didn't catch that"
- [ ] Every calculator: shareable URL state, mailto export, visible disclaimer, a discouraging verdict path that can actually fire
- [ ] Every factual claim traceable to §9, and every ROTS-flagged claim re-checked against its source
- [ ] **`bigsky-design` checklist passed** — run the list at the bottom of `SKILL.md`, not just this one
- [ ] Figure caption block (`FIG. 0N`) on every interactive and on the loop diagram
- [ ] Corner registration marks on panels; square bullets and status marks, not dots
- [ ] Exactly one accent hue on the page, and it marks something specific
- [ ] No gradients, glows, shadows, pills, radii above 4px, or purple anywhere
- [ ] No exclamation marks in UI copy
- [ ] Primary buttons carry the trailing `→`; motion is 150–300ms on `cubic-bezier(.2,.7,.2,1)`
- [ ] `tokens.css` and the `:root` of `styles.css` still agree
- [ ] Read the page out loud. If any sentence sounds like a vendor wrote it, delete it.

Site-wide:
- [ ] Home page hasn't regressed — arm, builder, quiz, boot, dance mode, easter eggs all still work
- [ ] Total site weight still sane; no new dependencies; no build step introduced
- [ ] No tracking, no analytics, no third-party requests beyond Google Fonts
- [ ] Trailing-slash directory URLs work on the deploy target (§7.2)

---

# 9. Research appendix — the factual basis

Every number in the draft copy traces to this section. **Ratings:**

- **VERIFIED** — from a primary source (a standards body, a vendor's own spec page)
- **REPORTED** — consistent across multiple industry sources, not primary
- **DIRECTIONAL** — a widely-repeated range. Publish as a range, never as a precise figure.
- **ROTS** — will be stale within about two quarters. Re-check before publishing and put a "checked" date next to it on the page.

All research conducted **2026-09-10**.

**Standing editorial rule:** the site's credibility comes from being right. Prefer a claim that stays true (*"fifty to two hundred demonstrations per task, depending on the task"*) over one that's precise and perishable (*"exactly 2,070 FP4 TFLOPS"*). Put perishable specifics in body copy with a date, never in a headline, and never in SKY-1's mouth — SKY-1's answers are the hardest thing to keep current.

## 9.1 Physical AI — the demo gap

| Claim | Rating | Notes |
|---|---|---|
| Imitation learning needs ~50–200 teleoperated demonstrations per task | DIRECTIONAL | Widely reported industry range. A 20-task facility → 1,000–4,000 demos. Publish as a range with "depending on task" attached. |
| Production lines expect 95–99% uptime; many humanoid platforms run 30–90 minutes between charge or intervention | REPORTED, ROTS | The uptime expectation is stable; the runtime figure improves every cycle. Re-check before publishing. |
| Current lithium-ion limits humanoids to roughly 1–4 hours of active use | REPORTED, ROTS | Same caveat. |
| 2026 is a "validation year" — real but narrow deployments; broad factory-scale adoption reads as a 2030s market | REPORTED | Consistent across industry analysis. Safe to state as an assessment ("reads like", "our read is"), not as fact. |
| Real deployments cluster in tote movement, line-side delivery, kitting, parts loading, inspection, machine tending | REPORTED | Named programs exist at several automotive and logistics sites. **Do not name specific companies or customers on the site** — it implies a relationship Big Sky doesn't have. |
| Generalist policy landscape: flow-matching VLAs, open-weight cross-embodiment models, diffusion policies, vendor stacks | REPORTED, ROTS | **Deliberately written without model names in the draft copy.** That's a feature — it stays true and it reinforces vendor-neutrality. Resist the urge to name-drop. |

Sources: [State of humanoid robotics 2026](https://roboticsandautomationnews.com/2026/02/07/the-state-of-humanoid-robotics-from-research-labs-to-real-world-potential/98732/) · [Humanoid robots 2026 tracker](https://robobrief.tech/blog/humanoid-robots-2026/) · [Humanoid robotics challenges 2026](https://blog.robozaps.com/b/challenges-in-humanoid-robotics) · [A Survey on VLA Models for Embodied AI](https://arxiv.org/pdf/2405.14093) · [Embodied AI data collection: teleoperation guide 2026](https://www.evsint.com/embodied-ai-data-collection-teleoperation-sim-to-real-2026/)

## 9.2 Embedded AI — silicon and latency

| Claim | Rating | Notes |
|---|---|---|
| Jetson AGX Thor **T5000**: 2,070 FP4 TFLOPS (sparse), 2560-core Blackwell GPU, 14-core Arm Neoverse-V3AE, 128 GB LPDDR5X, 273 GB/s, 40–130 W | VERIFIED, ROTS | From NVIDIA's own product page. |
| Jetson **T4000**: 1,200 FP4 TFLOPS (sparse), 1536-core Blackwell, 12-core CPU, 64 GB, 273 GB/s, 40–70 W | VERIFIED, ROTS | Same source. |
| Further Jetson Thor modules (T3000/T2000) slated for Q1 2027 | REPORTED, ROTS | Roadmap item. **Don't publish roadmap dates on a consultancy site** — you inherit the vendor's slip. |
| Quantization delivers large latency reductions (single-digit multiples typical on embedded targets) | REPORTED | Specific published figures vary wildly by model and platform. **Publish as "routinely buys large speedups", not a multiplier.** |
| Sub-10 ms inference is achievable on embedded targets with a compiled runtime and reduced precision; control loops run 10–100 Hz | REPORTED | The 10/33/100/1000 Hz table in §4.3 is standard engineering practice, not a citation-dependent claim. Safe. |
| Quantization changes model behaviour and requires re-evaluation | **Editorial position, and correct** | State it as Big Sky's position. It's defensible, differentiating, and true. |
| p99.9 matters more than mean latency | **Editorial position, and correct** | Same. This is the best single argument on the embedded page — it's real engineering judgment that vendors never volunteer. |

Sources: [NVIDIA Jetson Thor product page](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/) · [Introducing NVIDIA Jetson Thor](https://developer.nvidia.com/blog/introducing-nvidia-jetson-thor-the-ultimate-platform-for-physical-ai/) · [Jetson Thor now available](https://nvidianews.nvidia.com/news/nvidia-blackwell-powered-jetson-thor-now-available-accelerating-the-age-of-general-robotics) · [Accelerate AI inference for edge and robotics](https://www.edge-ai-vision.com/2026/01/accelerate-ai-inference-for-edge-and-robotics-with-nvidia-jetson-t4000-and-nvidia-jetpack-7-1/) · [Efficient Foundation Models for Real-Time Embodied AI (CoRL 2026 workshop)](https://efficient-embodied-ai.github.io/)

## 9.3 World models & simulation

| Claim | Rating | Notes |
|---|---|---|
| Three distinct families: physics simulators, video world models, latent/planner world models | REPORTED | This taxonomy is well-supported and is the most useful thing on the page. It's also unusually clear-headed for public marketing copy — that's the value. |
| Newton: open-source GPU-accelerated, differentiable physics engine; NVIDIA + Google DeepMind + Disney Research; Linux Foundation-managed; built on Warp and OpenUSD; 1.0 released at GTC 2026; multiple solvers incl. MuJoCo Warp; SDF collision; deformables | REPORTED, ROTS | Well-corroborated. Draft copy deliberately describes it without naming it — keeps the page true for longer. Name it in a Field Note instead, where a date stamp is natural. |
| Genie-class video world models: real-time interactive environments, ~24 fps, 720p, consistency over minutes | REPORTED, ROTS | Improves rapidly. Describe the capability class, not the numbers. |
| Latent world models (Dreamer/JEPA lineage) offer counterfactual reasoning, long-horizon planning, better OOD data efficiency vs. pure behaviour cloning | REPORTED | Fair characterisation of the research position. Draft copy correctly hedges it as "early in industrial practice". |
| 3D Gaussian splatting produces digital twins from sparse images in minutes, convertible to collision-ready geometry for physics engines | REPORTED | Strong recent literature. Genuinely practical and a real differentiator — most consultancies aren't offering this yet. |
| Sim-to-real transfer quality is task-shaped: locomotion and rigid pick transfer well; contact-rich assembly and deformables transfer poorly | **Editorial position, well-supported** | The reality-gap meter's numbers are Big Sky's judgment. **Label them as such** — "our read of the published evidence and the physics" — not as published research. See §10.3. |

Sources: [Isaac Lab: A GPU-Accelerated Simulation Framework](https://arxiv.org/pdf/2511.04831) · [Newton Physics Integration — Isaac Lab docs](https://isaac-sim.github.io/IsaacLab/main/source/experimental-features/newton-physics-integration/index.html) · [NVIDIA Newton 1.0](https://medium.com/the-ai-entrepreneurs/nvidia-newton-1-0-open-source-physics-engine-for-robotics-sim-to-real-e9be3a857f6a) · [The State of Simulation for Physical AI](https://huggingface.co/blog/nvidia/state-of-simulation-for-physical-ai) · [From World Models to World Action Models: a tutorial for robotics](https://arxiv.org/pdf/2607.00836) · [A high-fidelity digital twin for robotic manipulation based on 3DGS](https://arxiv.org/abs/2601.03200) · [3D Gaussian Splatting in Robotics: a survey](https://arxiv.org/pdf/2410.12262) · [Genie (world model) — Wikipedia](https://en.wikipedia.org/wiki/Genie_%28world_model%29)

## 9.4 Safety & compliance — the most valuable finding

**This is the highest-value item in the whole research pass, and it's also a correction to the live site.**

`index.html` and SKY-1 both currently cite **ISO 10218** generically alongside ISO/TS 15066 and ANSI/RIA R15.06. ISO 10218 was substantially revised in 2025.

| Claim | Rating | Notes |
|---|---|---|
| **ISO 10218-1:2025** and **ISO 10218-2:2025** published, superseding the 2011 editions | VERIFIED | Part 1 = industrial robots; Part 2 = robot applications and cells. Prepared by ISO/TC 299 with CEN/TC 310. |
| The revision makes functional safety requirements explicit rather than implied | REPORTED | Consistent across standards-body commentary. |
| Conflicting national standards to be withdrawn by **March 2027** | REPORTED | Real transition deadline — genuinely useful to a client. |
| **EU Machinery Regulation (EU) 2023/1230 applies from 20 January 2027**, replacing Machinery Directive 2006/42/EC | VERIFIED | Hard date. |
| The Regulation introduces specific provisions for machinery incorporating AI/ML, and **machinery where an AI system performs a safety function is treated as high-risk under Annex I** | REPORTED | **This is the commercial hook.** If a learned policy participates in a safety function, the compliance path changes. |
| An AI-driven robot in the EU sits at the intersection of the AI Act, the Machinery Regulation, and GDPR | REPORTED | Three-framework framing is well-supported. |

**Why this matters more than anything else in this document:** it connects V0's existing, credible safety practice directly to V1's new AI content, in a way that is specific, dated, actionable, and almost entirely absent from competitors' marketing. It is also a legitimate reason for a prospect to call *this quarter* rather than next year.

**Actions:**

1. Update the live site's S-04 card and SKY-1's `safety` intent to cite **ISO 10218-1:2025 / ISO 10218-2:2025**. Do this even if nothing else in V1 ships — it's a two-line edit, and the current citation reads as out of date to exactly the person you want to impress. The precise changes:

   **`index.html` line 171** — inside the S-04 card front:
   > before: `Risk assessments, ISO 10218 / ISO/TS 15066 / ANSI RIA R15.06, e-stop circuits that actually stop things.`
   > after: `Risk assessments, ISO 10218-1:2025 / -2:2025, ISO/TS 15066, ANSI/RIA R15.06, e-stop circuits that actually stop things.`

   *(Note the existing copy reads "ANSI RIA" without the slash; `assistant.js` has it correctly as "ANSI/RIA". Fix the HTML to match while you're in there.)*

   **`assets/js/assistant.js` line 22** — the `safety` intent. Change the trailing sentence:
   > before: `Standards we work against: ISO 10218, ISO/TS 15066, ANSI/RIA R15.06.`
   > after: `Standards we work against: ISO 10218-1:2025 and -2:2025 (the 2011 editions were superseded), ISO/TS 15066, ANSI/RIA R15.06.`

   And add `10218-1`, `10218-2`, `2025`, `machinery regulation`, `eu ai act` to that intent's `k` keyword array so the new terms actually match.
2. Add "AI in a safety function" as service item 4 on `/physical-ai/` (already specced in §4.1).
3. Write Field Note #6.
4. Add a dated line: *Standards position current as of September 2026.*

**Caveat to hand to JJ:** this is regulatory content on a consultancy site. Keep it descriptive ("here is what changes and when"), never prescriptive ("you are compliant if…"), and add a plain line that it isn't legal or certification advice. Worth a look from whoever handles Big Sky's contracts before publishing.

Sources: [ISO 10218-1:2025 (ISO)](https://www.iso.org/standard/73933.html) · [Updated ISO 10218 FAQ — A3](https://www.automate.org/robotics/blogs/updated-iso-10218-faq) · [ISO 10218 receives major overhaul — The Robot Report](https://www.therobotreport.com/iso-10218-industrial-robot-safety-standard-receives-major-overhaul/) · [ANSI Blog on ISO 10218-1:2025](https://blog.ansi.org/ansi/iso-10218-1-2025-robots-and-robotic-devices-safety/) · [Guide to the 2027 EU Machinery Regulation — Nemko](https://digital.nemko.com/regulations/eu-machinery-regulation) · [Smart robots, dual regulations — Bird & Bird](https://www.twobirds.com/en/insights/2026/smart-robots,-dual-regulations-navigating-the-ai-act-and-machinery-compliance) · [Navigating the legal maze — Timelex](https://www.timelex.eu/en/blog/navigating-legal-maze-ai-autonomous-robots-and-eus-regulatory-overhaul)

## 9.5 Cloud, data, and training economics

| Claim | Rating | Notes |
|---|---|---|
| **MCAP** is the default rosbag2 storage format from ROS 2 Iron (May 2023) onward; handles heterogeneous multi-schema timestamped streams | VERIFIED | Safe to state plainly. Draft copy describes it without naming it; naming it is fine and probably better on this page — it's stable, and it signals competence to a ROS audience. |
| Learning-side datasets converge on episode-oriented formats (LeRobot-style, RLDS); Open X-Embodiment published in them; conversion tooling exists between formats | REPORTED | The "conversion tax" framing is Big Sky's, and it's accurate and useful. |
| H100 on-demand ≈ $2.00–2.50/hr; broader market $1.49–6.98/hr by provider; B200 ≈ $3.99–5.50/hr | REPORTED, **ROTS HARD** | GPU pricing moves fast. **Publish as "a couple of dollars an hour per card" and skip exact figures** — the draft copy already does this deliberately. If you want precision, put it in a dated Field Note. |
| Parameter-efficient fine-tune of a generalist policy on a few hundred episodes: overnight on one high-end card. Full fine-tune on 8 cards: 24–48 h | REPORTED, ROTS | Directionally solid. Keep it qualitative. |
| **Training compute is small relative to data collection and evaluation** | **Editorial position, well-supported** | The single most useful reframe on the cloud page. Follows arithmetically from §9.1 — thousands of demonstrations at operator wages dwarfs a few hundred GPU-hours. Safe and strong. |
| Managed cloud-robotics services of the previous generation have largely been withdrawn; current pattern is edge agents + own orchestration, or a third-party fleet platform | REPORTED | AWS RoboMaker's deployment features were removed in 2022 and the service wound down. **Draft copy deliberately avoids naming it** — no reason to pick a fight with a vendor, and the point stands generically. |

Sources: [MCAP as the ROS 2 default bag format — Foxglove](https://foxglove.dev/blog/mcap-as-the-ros2-default-bag-format) · [ROS 2 support for recording directly to MCAP — ROS Discourse](https://discourse.openrobotics.org/t/new-ros-2-support-for-recording-data-directly-to-mcap-files/27735) · [LeRobot: an open-source library for end-to-end robot learning](https://arxiv.org/pdf/2602.22818) · [Visualizing Open X-Embodiment in Foxglove](https://foxglove.dev/blog/visualizing-open-x-embodiment-dataset-in-foxglove) · [AWS RoboMaker support policy](https://docs.aws.amazon.com/robomaker/latest/dg/chapter-support-policy.html) · [H100 GPU cost in 2026 — CloudZero](https://www.cloudzero.com/blog/h100-gpu-cost/) · [Scaling VLA model training on a budget](https://www.roboticscenter.ai/blog/scaling-vla-training-on-a-budget) · [Teleoperation data collection as a service](https://www.dataxpower.com/blog/teleoperation-data-collection-service)

## 9.6 Visual intelligence

| Claim | Rating | Notes |
|---|---|---|
| Detection and segmentation are largely solved zero-shot by current foundation models for typical industrial parts | REPORTED | Fair. Keep "for typical industrial parts" — it's the honest qualifier. |
| Monocular depth foundation models are strong but are not metrology | **Editorial position, and correct** | Important distinction, frequently ignored. |
| Zero-shot 6-DoF pose estimation from CAD or reference views now works in cluttered industrial bins | REPORTED | Genuinely the biggest recent change in industrial vision. Active literature through 2026. |
| Grasping and verification remain the hard stages | **Editorial position, well-supported** | |
| Specularity, transparency, clutter, lighting drift, and calibration drift are the dominant real-world failure modes | **Editorial position, and correct** | Practitioner consensus. The most useful list on the page. |
| Practical consequence: train fewer custom models than you did in 2023; spend the savings on lighting, fixturing, calibration and verification | **Editorial position** | This is the thesis of the vision page and it's excellent. It's also checkable against a prospect's own experience, which is what makes it land. |

Sources: [SAM-6D: SAM meets zero-shot 6D object pose estimation](https://arxiv.org/pdf/2311.15707) · [Accurate and efficient zero-shot 6D pose estimation with frozen foundation models](https://arxiv.org/pdf/2506.09784) · [SDT-6D: sparse depth-transformer for industrial multi-view bin picking](https://arxiv.org/pdf/2512.08430) · [Pickalo: 6D pose estimation for low-cost industrial bin picking](https://arxiv.org/html/2604.04690) · [Best computer vision models in 2026 — Roboflow](https://blog.roboflow.com/best-computer-vision-models/) · [Merging outcomes of SAM applied to RGB and depth — NIST](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=957706)

---

# 10. Decisions

The first draft left six open questions. Five are now decided — they had defensible defaults and leaving them open would have blocked the build for no reason. **One still needs a human.**

### 10.1 Scope of V1 — DECIDED
Ship **Phase 0 + Phase 1 + `/vision/` + `/embedded/`** as V1.0, with the other three pages as voice-correct stubs behind the loop diagram. Then reassess. Rationale: the calculators are the untested bet in this plan. Two of them, live, tell you whether the format lands before you build five. The phase sequence in §8 already supports this and needs no change.

### 10.2 Regulatory content — NEEDS A HUMAN
This is the one thing I won't decide. §9.4 is the strongest commercial hook in the plan and the only content carrying any liability.

**Split it:**
- **Ship now, no review needed:** the ISO 10218:2025 *citation correction* in §9.4 action 1. It's a factual update to a standard reference the site already makes. Leaving it wrong is worse than changing it.
- **Hold for review:** the "AI in a safety function" Field Note and any page copy describing what the EU Machinery Regulation requires of a client. Descriptive framing only, plus a plain line that it isn't legal or certification advice — and JJ should have whoever handles Big Sky's contracts read it before it goes up.

### 10.3 "We've seen" / "projects we've run" — DECIDED
**Default to positions, not claims.** Unless JJ confirms the engagements exist, rewrite these three places so the site never implies experience it can't name:

| Where | Change to |
|---|---|
| §4.4, reality gap: *"A team that spends three months…"* | Already generic — keep as written. |
| §4.5, fleet ops: *"most of the projects we've seen go wrong here"* | → *"the projects that go wrong here go wrong the same way"* |
| §9.3 note, reality-gap meter: *"our read, from projects we've run"* | → *"our read of the published evidence and the physics"* |

The voice survives this completely — it reads as judgment rather than anecdote, which is arguably stronger. And inventing experience is the one thing that would actually damage this site.

### 10.4 Named vendors — DECIDED
**Name open standards and tools freely in page copy. Keep silicon part numbers and specific model names in dated Field Notes.**

- **Name in page copy:** ROS 2, MCAP, rosbag2, LeRobot, RLDS, Open X-Embodiment, MuJoCo, Isaac Sim / Isaac Lab, Newton, Gazebo, 3D Gaussian splatting, TensorRT, ISO/ANSI standards. These are stable, they're the search terms a technical buyer uses, and naming them signals competence without picking a side.
- **Keep out of page copy:** Jetson module part numbers and their TFLOPS figures, named VLA models, GPU hourly prices. All ROTS (§9). They belong in a Field Note where a date stamp is natural and a stale number reads as history rather than error.

This gets the SEO surface without the decay, and it's consistent with the site's existing vendor-neutral stance.

### 10.5 Field Notes cadence — DECIDED
**Ship two essays. Don't promise more on the index.** No "posted monthly," no empty categories, no RSS badge. If a third arrives, it arrives. An index of two good notes reads as considered; an index of two under a promise of more reads as abandoned.

### 10.6 Domain timing — DECIDED
**Build and launch on `jj-bigsky.github.io` now.** Root-absolute paths (§1.5, §7.2) make the whole site portable to any of the four hosts already configured in this repo. The only migration-specific work is the CloudFront directory-URL function, and that's cheaper to write once up front than to debug after a DNS cutover. Don't hold V1 for the domain.

---

# 11. One-paragraph summary for the site agent

Big Sky Systems V0 is a hand-built, no-dependency, single-page site with a strong "engineering paper" design system — codified in the repo's own `bigsky-design` skill, which you must read first and which outranks this document on design — and a voice built on sober, funny honesty. V1 keeps every bit of that and extends the argument one layer up: a robotics lab is a closed loop — perceive, decide, act, capture, imagine — and Big Sky makes all five stations boring. Build a loop diagram on the home page as the new lead section, add four service cards, then build five domain pages behind those loop nodes, each following the same template: **the honest version first, the substance second, an interactive calculator third, the offer fourth.** The five calculators are the point of the whole exercise — they are honest instruments that talk people out of expensive mistakes, and they are the lead magnets. Don't introduce a build step, don't add tracking, don't name perishable specifics in headlines, don't invent case studies, and don't let a single sentence sound like a vendor wrote it.

---

*Handoff prepared 2026-09-10. Research current as of that date; see §9 for what decays.*
