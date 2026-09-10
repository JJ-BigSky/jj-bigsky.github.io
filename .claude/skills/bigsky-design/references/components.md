# Components

Copy these; don't redesign them. All classes come from `../assets/tokens.css`.

## Eyebrow + section title + serif subtitle

```html
<p class="eyebrow mono">02 // What you get</p>
<h2>Three deliverables.<span class="sub">All of them boring on purpose.</span></h2>
```
The eyebrow's orange dash is drawn by CSS. Number sections in order; the
number is part of the language, not decoration.

## Hero sentence with one italic accent word

```html
<h1>We build robotics labs that actually <span class="serif accent">ship.</span></h1>
```
One serif word per headline. If nothing deserves the italic, use none.

## Figure caption (for anything illustrative or interactive)

```html
<div class="fig mono"><b>Fig. 02</b>Reach envelope, plan view. Dashed = collaborative zone.</div>
```

## Buttons

```html
<a class="btn btn--primary" href="#">Book the sprint</a>   <!-- ink fill, → suffix -->
<a class="btn" href="#">See the plan</a>                   <!-- 1px ink border -->
<button class="btn btn--small btn--ghost">Clear</button>   <!-- quiet -->
<a class="btn btn--link" href="#">Meet SKY-1</a>           <!-- underlined text -->
```
Labels are short mono uppercase verbs. Never a pill, never a gradient.

## Toggle (state shown by a square, not a color wash)

```html
<button class="tog" aria-pressed="false"><i></i><span>Snd off</span></button>
```

## Card with corner marks

```html
<article class="panel marks">
  <span class="card__num mono">S-01</span>
  <h3>Lab Design &amp; Buildout</h3>
  <p class="muted">From empty bay to humming cell.</p>
</article>
```
Add `panel--ink` for the one emphasized card in a set (ink fill, paper text).
Use at most one ink card per row; two reads as a mistake.

## Bullet list (square markers)

```html
<ul class="list"><li>Floor plan with reach envelopes</li><li>Utility schedule</li></ul>
```

## Spec table

```html
<table class="spec">
  <thead><tr><th>Module</th><th>Tag</th><th class="n">kW</th></tr></thead>
  <tbody><tr><td>Robot cell</td><td class="mono muted">6-axis + controller</td><td class="n">6.0</td></tr></tbody>
</table>
```
Header row underlined in ink; body rows in hairline; numbers right-aligned in
Archivo 800 (`class="n"`).

## Stat rows (instead of KPI cards)

```html
<div class="stats">
  <div class="stat"><span>Footprint</span><b>73 m²</b></div>
  <div class="stat"><span>Power</span><b>24.7 kW</b></div>
</div>
```

## Callout / note from SKY-1

```html
<div class="callout"><span class="sq"></span><b>SKY-1 says:</b> uncaged robot at (2,3). Bold.</div>
```

## Badge / status

```html
<span class="badge"><i class="sq sq--ok"></i>Nominal</span>
<span class="badge badge--ink">Draft</span>
```

## Form field

```html
<label class="field">Organization<input type="text" placeholder="Lovelace Labs" /></label>
```

## Nav strip

```html
<header class="nav">
  <a class="brand" href="/">Big Sky <b>Systems</b></a>
  <nav class="nav__links"><a href="#a">Scope</a><a href="#b">Plan</a></nav>
  <a class="btn btn--small" href="mailto:build@bigsky.systems">Talk to us</a>
</header>
```

## Graphite sheet

Set `data-theme="graphite"` on `<html>`. Everything re-tokens itself. Offer a
toggle only when the artifact is a full page; documents and one-pagers pick
one sheet and stay there (paper unless the context is a dark room).

## Brand mark (inline SVG, ink, 28px)

```html
<svg viewBox="0 0 40 40" width="28" height="28" aria-hidden="true">
  <rect x="1" y="1" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" stroke-width=".8" stroke-dasharray="1.5 4"/>
  <path d="M6 31 L15 16 L21 24 L26 19 L34 31" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  <rect x="26" y="7" width="6" height="6" fill="var(--accent)"/>
</svg>
```
