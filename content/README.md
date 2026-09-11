# Editing the copy

Everything a reader sees on the domain pages and the field notes lives here, as
Markdown. Edit the words, run the stamper, commit the HTML it writes.

```
content/
  vision.md  embedded.md  physical-ai.md  cloud.md  world-models.md  research.md
  notes/<slug>.md          one file per field note
```

## A page file

Front matter, then the body.

```
---
title: Visual Intelligence — Big Sky Systems      browser tab and search result
description: One sentence, under 155 characters.  search result and link previews
code: V-01                                        the sheet number in the title block
node: 0                                           0 perceive · 1 decide · 3 capture · 4 imagine · none for hub pages
eyebrow: Visual intelligence // perceive
h1: The robot can't do anything it can't see.
sub: The italic line under the headline.
lede: The paragraph under that.
actions:
  - btn btn--primary | #lab | Run the pipeline | RUN      class | href | label | cursor word
  - btn | /#contact | Talk to a human | MAIL
placeholder: What SKY-1's input box suggests on this page…
next_h2: Heading of the last section.
next_sub: Its italic line.
scripts: vision-lab                               the page's own script, if it has one
---
```

The body is Markdown: paragraphs, `### headings`, `- lists`, `| tables |`,
`**bold**`, `*italic*`, `[links](/vision/)`. The section wrappers, callouts,
cards, and instruments are plain HTML lines between the paragraphs; leave them
where they are and edit the words inside them. A blank line separates blocks.
Write `&` as `&`; the stamper escapes it.

## A note file

```
---
n: 01                       order on the index
title: Your average latency is a lie.
standfirst: One or two sentences under the title.
date: September 2026
station: Decide             which station it belongs to
page: /embedded/            the page it links back to
page_name: On-robot autonomy
---

Body in Markdown. `## Headings` for sections.
```

## Then

```
python3 tools/stamp-pages.py all
```

That rewrites the HTML for every page and note from the home page's chrome plus
these files. Look at it locally (`python3 -m http.server 8741`), commit the
Markdown and the HTML together, and push.

Not here: the home page copy (edit `index.html` directly), SKY-1's answers
(the `KB` array in `assets/js/assistant.js`), the evidence board's claims
(`CLAIMS` in `assets/js/research.js`), and each calculator's verdict lines
(their own files under `assets/js/`).
