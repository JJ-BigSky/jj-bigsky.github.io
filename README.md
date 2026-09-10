# Big Sky Systems — website

**Live:** https://jj-bigsky.github.io/ (GitHub Pages, served from the `main` branch of `JJ-BigSky/jj-bigsky.github.io`). Push to `main` and it redeploys in about a minute.

A single-folder static site for a robotics lab consultancy. No build step, no
framework, no backend. Open `index.html` or drop the folder on any static host.

## What's in it

| Piece | Where | What it does |
| --- | --- | --- |
| Hero sky | `assets/js/sky.js` | Ink contour ridgelines that bulge under the cursor, survey marks that constellate around it, streaks, a drafting sun. Crossfades between the paper and graphite sheets. |
| SKY-1 mascot | `assets/js/mascot.js` | Eyes track the cursor, it blinks, it comments once per section, idle chatter, moods. |
| Robot arm | `assets/js/arm.js` | 3-link planar arm solved with FABRIK inverse kinematics. Follow / Teach (record + replay waypoints) / Draw modes, reach envelope, trail, joint readouts. |
| Lab Builder | `assets/js/builder.js` | Click-to-place modules on an 8×6 floor. Live footprint, power, budget band, safety grade, and SKY-1 warnings. "Email this plan" composes a mailto. |
| Conveyor method | `main.js` → `updateBelt()` | Scroll-driven belt; the "YOUR LAB" part moves station to station. |
| Readiness quiz | `assets/js/quiz.js` | 7 questions, analog gauge with an overshooting needle, tiered results, mailto summary. |
| SKY-1 chat | `assets/js/assistant.js` | Scripted intent matcher that runs in the browser. Optional hook for a real AI backend (see below). |
| Extras | `main.js` | Boot sequence, vision-system cursor reticle, paper/graphite sheets, optional sound FX, Konami code / type `robot` / click the logo 5× for dance mode. |

Everything respects `prefers-reduced-motion`, works on touch, and degrades to
plain content if JavaScript is off.

## Design system

The look is called "engineering paper" and it is meant to be reused. Everything
needed to make another page, one-pager, dashboard, deck, or document in the
same language lives in `.claude/skills/bigsky-design/`:

- `SKILL.md` — the rules, tokens, and a pre-delivery checklist (Claude Code
  loads this automatically for anything visual in this repo; `CLAUDE.md` points to it).
- `assets/tokens.css` — canonical CSS variables and base components; inline it into single-file deliverables.
- `assets/template.html` — a starter page (open it next to `tokens.css`).
- `references/components.md` — copy-paste snippets for buttons, cards, tables, stat rows, callouts, nav.
- `references/documents.md` — color and font mappings for Word, PowerPoint, Excel, SVG, and email.

In Claude Code, ask for anything for Big Sky Systems and the skill applies; you
can also invoke it directly with `/bigsky-design`. To use it outside this repo,
save the packaged `bigsky-design.skill` to your profile.

## Edit the basics

`assets/js/config.js`:

```js
window.BSS_CONFIG = {
  company: "Big Sky Systems",
  email: "jj@bigsky.systems",
  labTimeZone: "America/New_York", // hero "LAB TIME" clock
  boot: true,                      // 1.5s boot overlay on first visit
  reticle: true,                   // custom cursor on desktop
  assistantEndpoint: ""            // see "Give SKY-1 a real brain"
};
```

Copy lives in `index.html` (services, method stations, contact). SKY-1's
scripted answers live in the `KB` array in `assets/js/assistant.js`; its
section one-liners are in `LINES` in `assets/js/mascot.js`.

Colors and fonts are CSS variables at the top of `assets/css/styles.css`.
Paper is the default sheet; the `[data-theme="graphite"]` block is the other one. Type is Archivo (wide grotesque), Instrument Serif italic for accent words, and JetBrains Mono for labels, all from Google Fonts.

## Preview locally

```bash
python3 -m http.server 8741
```

Then open http://localhost:8741. (Opening `index.html` directly also works,
but Google Fonts and the service-worker-free setup behave identically either way.)

## Host it

Any static host works. Upload the folder contents; `index.html` is the entry.

**Netlify (fastest):** drag the folder onto https://app.netlify.com/drop.
`netlify.toml` is already included (cache headers, no build).

**GitHub Pages:**
```bash
git init && git add -A && git commit -m "Big Sky Systems site"
gh repo create bigsky-site --public --source=. --push
gh api -X POST repos/{owner}/bigsky-site/pages -f build_type=legacy -f "source[branch]=main" -f "source[path]=/"
```
`.nojekyll` is included so nothing gets mangled.

**Vercel:** `npx vercel` in this folder. `vercel.json` is included.

**Cloudflare Pages:** create a project, upload the folder, no build command.

**AWS S3 + CloudFront:** upload to a bucket with static website hosting,
index document `index.html`, error document `404.html`, put CloudFront in
front for HTTPS. Set `Cache-Control` on `assets/*` if you like.

**Custom domain (bigsky.systems) on GitHub Pages:**
1. Add a file named `CNAME` containing `bigsky.systems` to the repo root and push.
2. At your DNS provider, add A records for the apex `@` pointing to
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`,
   and a CNAME for `www` pointing to `jj-bigsky.github.io`.
3. In the repo Settings, Pages, confirm the domain and tick "Enforce HTTPS"
   once the certificate is issued (usually within an hour).

Everything is relative-path, so it also works at a subpath if you ever move it.

## Give SKY-1 a real brain (optional)

By default SKY-1 is a scripted matcher and never touches the network. To make
it a real assistant, stand up a tiny endpoint you control (Cloudflare Worker,
Lambda, Vercel function, anything) that holds your API key server-side and
speaks this contract:

```
POST {assistantEndpoint}
Content-Type: application/json
{ "message": "string", "history": [{ "role": "user" | "assistant", "content": "string" }] }

200 OK
{ "reply": "string", "chips": ["optional", "quick replies"] }
```

Set `assistantEndpoint` in `config.js`. Put the site's facts (services,
process, timelines, the email) in your system prompt. Never ship an API key in
this folder; the browser can't keep secrets.

## Files

```
index.html          the site
404.html            quirky not-found page
assets/css/         styles.css
assets/js/          config, sound, sky, mascot, arm, builder, quiz, assistant, main
assets/img/         favicon.svg
netlify.toml        Netlify config (optional)
vercel.json         Vercel config (optional)
robots.txt, .nojekyll
```

Made under a very big sky.
