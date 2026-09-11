"""Stamp the domain pages and field notes from the home page's chrome plus the copy in content/.

A dev utility, not a build step: the generated HTML is committed and the site runs
without this. Run it from the repo root after editing anything under content/ or the
chrome on index.html:

    python3 tools/stamp-pages.py all          # every page and note
    python3 tools/stamp-pages.py vision notes # or just some

content/<slug>.md holds a page: front matter (title, description, hero copy, actions)
and the body, written in Markdown with the section wrappers left as plain HTML lines.
content/notes/<slug>.md holds an essay the same way. See content/README.md."""
import pathlib, sys, html, re
HOST = "https://jj-bigsky.github.io"  # live origin; on the domain move, sed this and sitemap.xml
ROOT = pathlib.Path(".").resolve()
HERE = pathlib.Path(__file__).resolve().parent
HOME = (ROOT / "index.html").read_text()
def between(s, a, b):
    i = s.index(a); j = s.index(b, i) + len(b); return s[i:j]
FONTS = between(HOME, '  <link rel="preconnect" href="https://fonts.googleapis.com" />', 'display=swap" rel="stylesheet" />\n')
RETICLE = between(HOME, '<!-- ===== Cursor reticle (desktop, fine pointer only) ===== -->', '</div>\n')
SPRITE = between(HOME, '<!-- ===== SVG sprite ===== -->', '</svg>\n')
HEADER = between(HOME, '<!-- ===== Nav ===== -->', '</header>\n').replace('href="#top"', 'href="/"').replace('href="#', 'href="/#')
FOOTER = between(HOME, '<footer class="footer">', '</footer>\n')
MASCOT = between(HOME, '<!-- ===== SKY-1 mascot + assistant ===== -->', '<button class="totop" id="toTop" type="button" aria-label="Back to top" hidden>↑</button>\n')
HOME_PLACEHOLDER = 'placeholder="Ask about services, timelines, ROS 2, safety…"'
assert HOME_PLACEHOLDER in MASCOT

# ---------- a small Markdown: paragraphs, ###/## headings, - lists, | tables, **bold**, *italic*, [text](url).
# Any block whose first line starts with "<" passes through as HTML, so layout wrappers and
# instruments live alongside the prose untouched. Bare "&" is escaped; entities are left alone.
def md_inline(t):
    t = re.sub(r"&(?![a-zA-Z#0-9]+;)", "&amp;", t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<em>\1</em>", t)
    t = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", r'<a href="\2">\1</a>', t)
    return t
def md_render(text):
    out = []
    for block in re.split(r"\n\s*\n", text.strip("\n")):
        lines = block.split("\n"); first = lines[0].lstrip()
        if not first: continue
        if first.startswith("<"): out.append(block); continue
        if first.startswith("### "): out.append("<h3>" + md_inline(first[4:].strip()) + "</h3>"); continue
        if first.startswith("## "): out.append("<h2>" + md_inline(first[3:].strip()) + "</h2>"); continue
        if first.startswith("- "):
            out.append('<ul class="list">\n' + "\n".join("  <li>" + md_inline(l.lstrip()[2:].strip()) + "</li>" for l in lines if l.strip()) + "\n</ul>"); continue
        if first.startswith("|"):
            rows = [[c.strip() for c in l.strip().strip("|").split("|")] for l in lines if l.strip() and not re.match(r"^\s*\|?\s*:?-{2,}", l)]
            head, body = rows[0], rows[1:]
            out.append('<div class="spec-wrap">\n<table class="spec">\n<thead><tr>' + "".join("<th>" + md_inline(c) + "</th>" for c in head) + "</tr></thead>\n<tbody>\n" +
                       "\n".join("<tr>" + "".join("<td>" + md_inline(c) + "</td>" for c in r) + "</tr>" for r in body) + "\n</tbody>\n</table>\n</div>"); continue
        out.append("<p>" + md_inline(" ".join(l.strip() for l in lines)) + "</p>")
    return "\n\n".join(out) + "\n"
def parse_front(text):
    """--- key: value ... --- with 'key:' + '  - item' lists. Returns (meta, body)."""
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", text, re.S)
    if not m: return {}, text
    meta, key = {}, None
    for line in m.group(1).split("\n"):
        if re.match(r"^\s+-\s", line) and key: meta[key].append(line.strip()[2:].strip()); continue
        mm = re.match(r"^([A-Za-z_][\w-]*):\s*(.*)$", line)
        if mm:
            key, val = mm.group(1), mm.group(2).strip()
            meta[key] = [] if val == "" else val
    return meta, m.group(2)
def load_page(slug):
    meta, body = parse_front((ROOT / "content" / (slug + ".md")).read_text())
    P = dict(slug=slug, code=meta.get("code", ""), title=meta["title"], description=meta["description"], eyebrow=meta["eyebrow"], h1=meta["h1"], sub=meta["sub"], lede=meta["lede"],
             placeholder=meta.get("placeholder", "Ask about this page…"), next_h2=meta["next_h2"], next_sub=meta["next_sub"])
    P["node"] = None if meta.get("node", "none") in ("none", "", None) else int(meta["node"])
    P["actions"] = [tuple(x.strip() for x in a.split("|")) for a in meta.get("actions", [])]
    P["scripts"] = [x.strip() for x in meta.get("scripts", "").split(",") if x.strip()] if isinstance(meta.get("scripts", ""), str) else meta["scripts"]
    if meta.get("tb"): P["tb"] = [tuple(x.strip() for x in t.split("|", 1)) for t in meta["tb"]]
    return P, md_render(body)

NODES = [
    dict(slug="vision", verb="Perceive", title="Visual intelligence", sub="Cameras, depth, pose, and what breaks them", href="/vision/", hint="Vision"),
    dict(slug="embedded", verb="Decide", title="On-robot autonomy", sub="The policy, the silicon, the latency budget", href="/embedded/", hint="Embedded"),
    dict(slug="act", verb="Act", title="The cell", sub="Arms, tooling, safety, the physical lab", href="/#services", hint="The lab"),
    dict(slug="cloud", verb="Capture", title="Robot data &amp; cloud", sub="Logs, datasets, training, fleet rollout", href="/cloud/", hint="Data &amp; cloud"),
    dict(slug="world-models", verb="Imagine", title="Simulation &amp; world models", sub="Test it a million times before it touches steel", href="/world-models/", hint="World models"),
]
HUB = dict(slug="physical-ai", verb="The hub", title="Physical AI", sub="What happens when the loop closes. How you decide whether a learned policy is the right answer at all, and what it costs when it is.", href="/physical-ai/", hint="Physical AI")
LOOP_HOME = dict(slug="loop", verb="The loop", title="All five stations", sub="A robot lab is a loop, not a shelf. The belt has an end. The loop doesn't.", href="/#loop", hint="The loop")


def loopline(node):
    items = []
    for i, n in enumerate(NODES):
        if i == node: items.append('        <li class="is-here" aria-current="page"><i aria-hidden="true"></i>%s</li>' % n["verb"])
        else: items.append('        <li><a href="%s" data-cursor="GO">%s</a></li>' % (n["href"], n["verb"]))
    items.append('        <li class="loopline__end" aria-hidden="true"></li>')
    items.append('        <li class="loopline__label" aria-hidden="true">%s</li>' % ("The loop // 5 nodes" if node is not None else "The loop // all five"))
    return "\n".join(items)

def plate(n, label, cursor, ink=False):
    return '''        <a class="next__plate%s marks" href="%s" data-cursor="%s">
          <span class="card__num mono">%s</span>
          <h3>%s</h3>
          <p>%s</p>
          <span class="card__hint mono">%s</span>
        </a>''' % (" next__plate--hub" if ink else "", n["href"], cursor, label, n["title"], n["sub"], n["hint"])

NOTES_PLATE = dict(slug="notes", verb="Notes", title="Field notes", sub="The long versions of the arguments, dated, and honest about what doesn't work.", href="/notes/", hint="Field notes")
def next_strip(node, slug=None):
    if slug == "research":
        return "\n".join([plate(HUB, "← The hub · Physical AI", "BACK"), plate(LOOP_HOME, "The loop · All five", "TRACE", ink=True), plate(NOTES_PLATE, "Next · The long versions", "NEXT")])
    if node is None:
        return "\n".join([plate(NODES[4], "← Previous · Imagine", "BACK"), plate(LOOP_HOME, "The loop · All five", "TRACE", ink=True), plate(NODES[0], "Start here · Perceive", "NEXT")])
    prev, nxt = NODES[(node - 1) % 5], NODES[(node + 1) % 5]
    return "\n".join([plate(prev, "← Previous · " + prev["verb"], "BACK"), plate(HUB, "The hub · All five", "HUB", ink=True), plate(nxt, "Next · " + nxt["verb"], "NEXT")])

def build(slug):
    P, body = load_page(slug)
    n_sections = body.count('<section class="section"')
    next_num = "%02d" % (n_sections + 1)
    node = P["node"]
    tb_node = ('<dd class="accent">%s</dd>' % NODES[node]["verb"]) if node is not None else '<dd class="accent">All five</dd>'
    tb_loop = ("%02d / 05" % (node + 1)) if node is not None else "Hub"
    station = ["perceive", "decide", "act", "capture", "imagine"][node] if node is not None else "hub"
    tb_rows = P.get("tb") or [("Sheet", P["code"]), ("Node", tb_node), ("Loop", tb_loop), ("Checked", '<a href="/research/?station=%s">Sep 2026</a>' % station)]
    tb_html = "\n".join("          <dt>%s</dt>%s" % (dt, dd if dd.startswith("<dd") else "<dd>%s</dd>" % dd) for dt, dd in tb_rows)
    actions = "\n".join('          <a class="%s" href="%s" data-cursor="%s">%s</a>' % (cls, href, cur, label) for cls, href, label, cur in P["actions"])
    scripts = "\n".join('<script src="/assets/js/%s.js"></script>' % s for s in ["config", "sound", "mascot", "assistant", "calc-kit"] + P["scripts"] + ["main"])
    out = '''<!doctype html>
<html lang="en" data-theme="paper">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>%(title)s</title>
  <meta name="description" content="%(description)s" />
  <meta name="theme-color" content="#ECE9E2" />
  <meta property="og:title" content="%(title)s" />
  <meta property="og:description" content="%(description)s" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="%(canon)s" />
  <meta property="og:image" content="%(og)s" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="%(canon)s" />
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml" />
%(fonts)s  <link rel="stylesheet" href="/assets/css/styles.css" />
  <link rel="stylesheet" href="/assets/css/pages.css" />
</head>
<body data-page="%(slug)s">

%(reticle)s
%(sprite)s
%(header)s
<main id="top">

  <!-- ===== Page hero ===== -->
  <section class="page-hero" id="hero">
    <div class="container page-hero__grid">
      <div class="page-hero__text">
        <p class="eyebrow mono"><span class="led"></span> %(eyebrow)s</p>
        <h1>%(h1)s</h1>
        <p class="page-hero__sub">%(sub)s</p>
        <p class="page-hero__lede">%(lede)s</p>
        <div class="hero__actions">
%(actions)s
          <button class="btn btn--link" id="heroAsk" type="button" data-cursor="TALK">Ask SKY-1</button>
        </div>
      </div>
      <aside class="titleblock marks" aria-label="Sheet information">
        <dl>
%(tb_html)s
        </dl>
      </aside>
    </div>
    <div class="container">
      <ol class="loopline" aria-label="Where this page sits in the loop">
%(loopline)s
      </ol>
    </div>
  </section>

%(body)s
  <!-- ===== %(next_num)s // Next: loop navigation + the one contact section ===== -->
  <section class="section" id="next">
    <div class="container">
      <p class="eyebrow mono">%(next_num)s // Next</p>
      <h2 class="section__title">%(next_h2)s<span class="muted">%(next_sub)s</span></h2>
      <div class="next">
%(next_strip)s
      </div>
      <div class="plate marks cta">
        <div>
          <h3>Tell us about your lab.</h3>
          <p>One contact page for the whole site, and it composes an email in your own mail app, addressed to a person. No forms that go nowhere.</p>
        </div>
        <div class="hero__actions">
          <a class="btn btn--primary" href="/#contact" data-cursor="MAIL">Talk to a human</a>
          <button class="btn btn--link" type="button" data-cursor="TALK" onclick="window.BSS_CHAT &amp;&amp; window.BSS_CHAT.open()">Or ask SKY-1</button>
        </div>
      </div>
    </div>
  </section>

</main>

%(footer)s
%(mascot)s
<button class="totop" id="toTop" type="button" aria-label="Back to top" hidden>↑</button>

%(scripts)s
</body>
</html>
''' % dict(P, canon=HOST + "/" + slug + "/", og=HOST + "/assets/img/og/" + slug + ".png", fonts=FONTS, reticle=RETICLE, sprite=SPRITE, header=HEADER, footer=FOOTER,
           mascot=MASCOT.replace(HOME_PLACEHOLDER, 'placeholder="%s"' % P["placeholder"]),
           actions=actions, tb_html=tb_html, loopline=loopline(node), body=body,
           next_num=next_num, next_strip=next_strip(node, slug), scripts=scripts)
    d = ROOT / slug; d.mkdir(exist_ok=True)
    (d / "index.html").write_text(out)
    print("wrote", slug + "/index.html", len(out), "bytes,", n_sections + 1, "sections")


NOTES_DESC = "Working notes on robotics, physical AI, and the parts of both that don't demo well."

def chrome(title, description, page, body_main, placeholder, canon, og):
    scripts = "\n".join('<script src="/assets/js/%s.js"></script>' % s for s in ["config", "sound", "mascot", "assistant", "main"])
    return """<!doctype html>
<html lang="en" data-theme="paper">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>%(title)s</title>
  <meta name="description" content="%(description)s" />
  <meta name="theme-color" content="#ECE9E2" />
  <meta property="og:title" content="%(title)s" />
  <meta property="og:description" content="%(description)s" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="%(canon)s" />
  <meta property="og:image" content="%(og)s" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="%(canon)s" />
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml" />
%(fonts)s  <link rel="stylesheet" href="/assets/css/styles.css" />
  <link rel="stylesheet" href="/assets/css/pages.css" />
</head>
<body data-page="%(page)s">

%(reticle)s
%(sprite)s
%(header)s
<main id="top">
%(main)s
</main>

%(footer)s
%(mascot)s
<button class="totop" id="toTop" type="button" aria-label="Back to top" hidden>↑</button>

%(scripts)s
</body>
</html>
""" % dict(title=title, description=description, page=page, canon=canon, og=og, fonts=FONTS, reticle=RETICLE, sprite=SPRITE, header=HEADER, footer=FOOTER, mascot=MASCOT.replace(HOME_PLACEHOLDER, 'placeholder="%s"' % placeholder), main=body_main, scripts=scripts)

def load_notes():
    notes = []
    for f in sorted((ROOT / "content" / "notes").glob("*.md")):
        meta, body = parse_front(f.read_text())
        notes.append(dict(meta, slug=f.stem, body=md_render(body)))
    return sorted(notes, key=lambda n: n["n"])
NOTES = load_notes()

def build_note(note):
    body = note["body"]
    words = len(re.sub(r"<[^>]+>", " ", body).split()); mins = max(3, round(words / 220))
    i = NOTES.index(note); prev = NOTES[i - 1] if i else None; nxt = NOTES[i + 1] if i + 1 < len(NOTES) else None
    main = """
  <article class="note">
    <div class="note__wrap">
      <p class="eyebrow mono">Field note %(n)s // %(station)s</p>
      <h1>%(title)s</h1>
      <p class="page-hero__sub">%(standfirst)s</p>
      <p class="note__meta mono muted">Big Sky Systems · %(date)s · %(mins)s min · from <a href="%(page)s">%(page_name)s</a></p>
      <hr class="rule" />
      <div class="prose note__body">
%(body)s
      </div>
      <hr class="rule" />
      <nav class="note__foot mono" aria-label="Around this note">
        %(prev)s
        <a href="/notes/">All notes</a>
        <a href="%(page)s">Back to %(page_name)s</a>
        <a href="/#contact">Talk to a human</a>
        %(next)s
      </nav>
    </div>
  </article>
""" % dict(note, mins=mins, body=body,
           prev=('<a href="/notes/%s.html">← %s</a>' % (prev["slug"], prev["title"])) if prev else "",
           next=('<a href="/notes/%s.html">%s →</a>' % (nxt["slug"], nxt["title"])) if nxt else "")
    out = chrome(note["title"].rstrip(".") + " — Big Sky Systems", note["standfirst"].replace('"', "&quot;"), "notes", main, "Ask about this note, or the page it came from…", HOST + "/notes/" + note["slug"] + ".html", HOST + "/assets/img/og/notes.png")
    (ROOT / "notes" / (note["slug"] + ".html")).write_text(out); print("wrote notes/%s.html (%d words)" % (note["slug"], words))

def build_notes_index():
    items = "\n".join("""        <li class="notes__item">
          <span class="notes__num mono">%(n)s</span>
          <div>
            <h2><a href="/notes/%(slug)s.html">%(title)s</a></h2>
            <p>%(standfirst)s</p>
            <p class="mono muted small">%(date)s · %(station)s · <a href="%(page)s">%(page_name)s</a></p>
          </div>
        </li>""" % n for n in NOTES)
    main = """
  <section class="page-hero" id="hero">
    <div class="container page-hero__grid">
      <div class="page-hero__text">
        <p class="eyebrow mono"><span class="led"></span> Field notes // the long versions</p>
        <h1>Field notes.</h1>
        <p class="page-hero__sub">%(desc)s</p>
        <p class="page-hero__lede">Each note is an argument one of the pages makes in short, made in full. They're dated, because the field moves, and they're honest about what doesn't work, because that's the part you're paying for.</p>
      </div>
      <aside class="titleblock marks" aria-label="Sheet information">
        <dl>
          <dt>Sheet</dt><dd>N-01</dd>
          <dt>Notes</dt><dd class="accent">%(count)d</dd>
          <dt>Cadence</dt><dd>When ready</dd>
          <dt>Checked</dt><dd>Sep 2026</dd>
        </dl>
      </aside>
    </div>
  </section>
  <section class="section" id="list">
    <div class="container">
      <ol class="notes">
%(items)s
      </ol>
    </div>
  </section>
""" % dict(desc=NOTES_DESC, count=len(NOTES), items=items)
    out = chrome("Field Notes — Big Sky Systems", NOTES_DESC, "notes", main, "Ask which note to read first…", HOST + "/notes/", HOST + "/assets/img/og/notes.png")
    (ROOT / "notes" / "index.html").write_text(out); print("wrote notes/index.html")

if __name__ == "__main__":
    targets = sys.argv[1:]
    if targets == ["all"]: targets = [f.stem for f in sorted((ROOT / "content").glob("*.md")) if f.read_text().startswith("---")] + ["notes"]
    for slug in targets:
        if slug == "notes": build_notes_index(); [build_note(n) for n in NOTES]
        else: build(slug)
