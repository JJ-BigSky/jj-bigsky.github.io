"""Stamp the domain pages and field notes from the home page's chrome plus per-page bodies.

A dev utility, not a build step: the generated HTML is committed and the site runs
without this. Run it from the repo root after changing the chrome on index.html or a
body under tools/pages/:

    python3 tools/stamp-pages.py vision embedded physical-ai cloud world-models notes

Bodies: tools/pages/<slug>.body.html (sections between the hero and Next) and
tools/pages/notes/<slug>.body.html (the essay). Page metadata lives in PAGES and NOTES below."""
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

NODES = [
    dict(slug="vision", verb="Perceive", title="Visual intelligence", sub="Cameras, depth, pose, and what breaks them", href="/vision/", hint="Vision"),
    dict(slug="embedded", verb="Decide", title="On-robot autonomy", sub="The policy, the silicon, the latency budget", href="/embedded/", hint="Embedded"),
    dict(slug="act", verb="Act", title="The cell", sub="Arms, tooling, safety, the physical lab", href="/#services", hint="The lab"),
    dict(slug="cloud", verb="Capture", title="Robot data &amp; cloud", sub="Logs, datasets, training, fleet rollout", href="/cloud/", hint="Data &amp; cloud"),
    dict(slug="world-models", verb="Imagine", title="Simulation &amp; world models", sub="Test it a million times before it touches steel", href="/world-models/", hint="World models"),
]
HUB = dict(slug="physical-ai", verb="The hub", title="Physical AI", sub="What happens when the loop closes. How you decide whether a learned policy is the right answer at all, and what it costs when it is.", href="/physical-ai/", hint="Physical AI")
LOOP_HOME = dict(slug="loop", verb="The loop", title="All five stations", sub="A robot lab is a loop, not a shelf. The belt has an end. The loop doesn't.", href="/#loop", hint="The loop")

PAGES = {}
def page(**k): PAGES[k["slug"]] = k

page(slug="vision", code="V-01", node=0,
     title="Visual Intelligence — Big Sky Systems",
     description="Perception is where robotics projects die quietly. Sensors, lighting, pose, grasping, and what actually breaks them.",
     eyebrow="Visual intelligence // perceive",
     h1="The robot can't do anything it can't see.",
     sub="And it can see beautifully until Tuesday, when the sun comes through the loading door.",
     lede="Vision is the highest-leverage and highest-variance system in a robot cell. Foundation models have quietly made the first four stages of the pipeline much easier than they were three years ago. The last two stages, and the physical environment around all six, are where the year goes.",
     actions=[("btn btn--primary", "#lab", "Run the pipeline", "RUN"), ("btn", "/#contact", "Talk to a human", "MAIL")],
     placeholder="Ask about cameras, lighting, pose, calibration…",
     next_h2="The loop doesn't stop here.", next_sub="Seeing the part is station one. Something has to decide what to do about it.",
     scripts=["vision-lab"])
page(slug="embedded", code="E-01", node=1,
     title="On-Robot Autonomy — Big Sky Systems",
     description="Autonomy is a latency budget with a power budget stapled to it. Compute selection, optimization, and real-time architecture.",
     eyebrow="On-robot autonomy // decide",
     h1="Ten milliseconds is not a lot of milliseconds.",
     sub="Everything interesting about on-robot AI is a fight over a very small number.",
     lede="A model that answers in two seconds is a chatbot. A model that answers inside your control period is a controller. The engineering between those two sentences is most of what we do on this page.",
     actions=[("btn btn--primary", "#lab", "Build a budget", "BUILD"), ("btn", "/#contact", "Talk to a human", "MAIL")],
     placeholder="Ask about latency, Jetson-class compute, quantization, RT kernels…",
     next_h2="Decided. Now move.", next_sub="The policy answered in time. The cell is where it has to be right.",
     scripts=["calc-latency"])
page(slug="physical-ai", code="P-01", node=None,
     title="Physical AI — Big Sky Systems",
     description="Learned policies are real and early. We work in the gap: demonstrations, evaluation, and the cost nobody demos.",
     eyebrow="Physical AI // the hub",
     h1="Physical AI, minus the demo reel.",
     sub="Everything here is real. Almost none of it is ready in the way people think it is.",
     lede="Physical AI is the part of the field where a model stops answering questions and starts moving mass. It's the most interesting thing to happen to robotics in thirty years, and it is being sold about four years ahead of where it actually is. We work in the gap between those two facts.",
     actions=[("btn btn--primary", "#calc", "Run the budget", "COUNT"), ("btn", "/#contact", "Talk to a human", "MAIL")],
     placeholder="Ask how many demos, or whether you need AI at all…",
     next_h2="Pick a station.", next_sub="The hub is the argument. The stations are the work.",
     scripts=["calc-demos"])
page(slug="cloud", code="C-01", node=3,
     title="Robot Data & Cloud — Big Sky Systems",
     description="Your fleet is a data business with a floor plan. Capture, datasets, training infrastructure, and fleet rollout.",
     eyebrow="Robot data &amp; cloud // capture",
     h1="Your fleet is a data business with a floor plan.",
     sub="The robots are the sensors. The loop is the product.",
     lede="Every hour your robots run, they generate the only thing that makes next quarter's policy better than this quarter's. Almost nobody is set up to keep it, find it, or use it. This is the least glamorous page on this site and it's the one that decides whether the rest works.",
     actions=[("btn btn--primary", "#calc", "Do the multiplication", "COUNT"), ("btn", "/#contact", "Talk to a human", "MAIL")],
     placeholder="Ask about storage, datasets, MCAP, fleet rollout…",
     next_h2="Captured. Now imagine.", next_sub="Logs are only useful if something learns from them.",
     scripts=["calc-data"])
page(slug="world-models", code="W-01", node=4,
     title="Simulation & World Models — Big Sky Systems",
     description="Break it ten thousand times where it's free, then measure how much the simulator lied.",
     eyebrow="Simulation &amp; world models // imagine",
     h1="Break it ten thousand times where it's free.",
     sub="Then find out how much the simulator lied to you. That second part is the job.",
     lede="Simulation stopped being a nice-to-have the moment policies started needing thousands of episodes. What's new is that “simulator” now means three quite different things, and picking the wrong one costs a quarter.",
     actions=[("btn btn--primary", "#calc", "Measure the gap", "GAUGE"), ("btn", "/#contact", "Talk to a human", "MAIL")],
     placeholder="Ask about sim-to-real, world models, digital twins…",
     next_h2="Imagined. Now look again.", next_sub="The loop closes where it started: something has to see the part.",
     scripts=["gap-meter"])

def loopline(node):
    items = []
    for i, n in enumerate(NODES):
        if i == node: items.append('        <li class="is-here" aria-current="page"><i aria-hidden="true"></i>%s</li>' % n["verb"])
        else: items.append('        <li><a href="%s" data-cursor="GO">%s</a></li>' % (n["href"], n["verb"]))
    items.append('        <li class="loopline__end" aria-hidden="true"></li>')
    items.append('        <li class="loopline__label" aria-hidden="true">%s</li>' % ("The loop // 5 nodes" if node is not None else "The loop // all five"))
    return "\n".join(items)

def plate(n, label, cursor, ink=False):
    return '''        <a class="next__plate%s marks reveal" href="%s" data-cursor="%s">
          <span class="card__num mono">%s</span>
          <h3>%s</h3>
          <p>%s</p>
          <span class="card__hint mono">%s</span>
        </a>''' % (" next__plate--hub" if ink else "", n["href"], cursor, label, n["title"], n["sub"], n["hint"])

def next_strip(node):
    if node is None:
        return "\n".join([plate(NODES[4], "← Previous · Imagine", "BACK"), plate(LOOP_HOME, "The loop · All five", "TRACE", ink=True), plate(NODES[0], "Start here · Perceive", "NEXT")])
    prev, nxt = NODES[(node - 1) % 5], NODES[(node + 1) % 5]
    return "\n".join([plate(prev, "← Previous · " + prev["verb"], "BACK"), plate(HUB, "The hub · All five", "HUB", ink=True), plate(nxt, "Next · " + nxt["verb"], "NEXT")])

def build(slug):
    P = PAGES[slug]
    body = (HERE / "pages" / (slug + ".body.html")).read_text()
    n_sections = body.count('<section class="section"')
    next_num = "%02d" % (n_sections + 1)
    node = P["node"]
    tb_node = ('<dd class="accent">%s</dd>' % NODES[node]["verb"]) if node is not None else '<dd class="accent">All five</dd>'
    tb_loop = ("%02d / 05" % (node + 1)) if node is not None else "Hub"
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
        <p class="eyebrow mono reveal"><span class="led"></span> %(eyebrow)s</p>
        <h1 class="reveal">%(h1)s</h1>
        <p class="page-hero__sub reveal">%(sub)s</p>
        <p class="page-hero__lede reveal">%(lede)s</p>
        <div class="hero__actions reveal">
%(actions)s
          <button class="btn btn--link" id="heroAsk" type="button" data-cursor="TALK">Ask SKY-1</button>
        </div>
      </div>
      <aside class="titleblock marks reveal" aria-label="Sheet information">
        <dl>
          <dt>Sheet</dt><dd>%(code)s</dd>
          <dt>Node</dt>%(tb_node)s
          <dt>Loop</dt><dd>%(tb_loop)s</dd>
          <dt>Checked</dt><dd>Sep 2026</dd>
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
      <p class="eyebrow mono reveal">%(next_num)s // Next</p>
      <h2 class="section__title reveal">%(next_h2)s<span class="muted">%(next_sub)s</span></h2>
      <div class="next">
%(next_strip)s
      </div>
      <div class="plate marks cta reveal">
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
           actions=actions, tb_node=tb_node, tb_loop=tb_loop, loopline=loopline(node), body=body,
           next_num=next_num, next_strip=next_strip(node), scripts=scripts)
    d = ROOT / slug; d.mkdir(exist_ok=True)
    (d / "index.html").write_text(out)
    print("wrote", slug + "/index.html", len(out), "bytes,", n_sections + 1, "sections")


NOTES = [
    dict(slug="your-average-latency-is-a-lie", n="01", station="Decide", page="/embedded/", page_name="On-robot autonomy", title="Your average latency is a lie.", standfirst="The p99.9 argument, with a worked example of a pipeline that passes every test and breaks on the second shift.", date="September 2026"),
    dict(slug="fifty-to-two-hundred", n="02", station="The hub", page="/physical-ai/", page_name="Physical AI", title="Fifty to two hundred.", standfirst="What imitation learning actually costs per task, and how to pick the three tasks worth it.", date="September 2026"),
    dict(slug="the-simulator-lied", n="03", station="Imagine", page="/world-models/", page_name="Simulation & world models", title="The simulator lied to you, and that's fine.", standfirst="Reality gap as a measurable, task-shaped, budgetable quantity rather than a disappointment.", date="September 2026"),
    dict(slug="keep-the-raw", n="04", station="Capture", page="/cloud/", page_name="Robot data & cloud", title="Keep the raw.", standfirst="Three data decisions made in week one that determine whether you have a flywheel or a NAS.", date="September 2026"),
    dict(slug="a-fixture-and-a-limit-switch", n="05", station="Act", page="/#services", page_name="The lab", title="A fixture and a limit switch.", standfirst="In defence of not using AI, from people who do use it.", date="September 2026"),
    dict(slug="ai-in-a-safety-function", n="06", station="Act · Decide", page="/physical-ai/", page_name="Physical AI", title="AI in a safety function.", standfirst="What the 2025 robot-safety revision and the 2027 EU machinery rules mean if your policy is learned. Descriptive, dated, and not legal advice.", date="September 2026"),
]
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

def build_note(note):
    body = (HERE / "pages" / "notes" / (note["slug"] + ".body.html")).read_text()
    words = len(re.sub(r"<[^>]+>", " ", body).split()); mins = max(3, round(words / 220))
    i = NOTES.index(note); prev = NOTES[i - 1] if i else None; nxt = NOTES[i + 1] if i + 1 < len(NOTES) else None
    main = """
  <article class="note">
    <div class="note__wrap">
      <p class="eyebrow mono reveal">Field note %(n)s // %(station)s</p>
      <h1 class="reveal">%(title)s</h1>
      <p class="page-hero__sub reveal">%(standfirst)s</p>
      <p class="note__meta mono muted reveal">Big Sky Systems · %(date)s · %(mins)s min · from <a href="%(page)s">%(page_name)s</a></p>
      <hr class="rule" />
      <div class="prose note__body reveal">
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
    items = "\n".join("""        <li class="notes__item reveal">
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
        <p class="eyebrow mono reveal"><span class="led"></span> Field notes // the long versions</p>
        <h1 class="reveal">Field notes.</h1>
        <p class="page-hero__sub reveal">%(desc)s</p>
        <p class="page-hero__lede reveal">Each note is an argument one of the pages makes in short, made in full. They're dated, because the field moves, and they're honest about what doesn't work, because that's the part you're paying for.</p>
      </div>
      <aside class="titleblock marks reveal" aria-label="Sheet information">
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

for slug in sys.argv[1:]:
    if slug == "notes": build_notes_index(); [build_note(n) for n in NOTES]
    else: build(slug)
