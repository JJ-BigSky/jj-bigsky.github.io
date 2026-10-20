---
title: Research — Big Sky Systems
description: Field evidence, benchmarks, and primary sources across the five stations of the robotics loop.
code: R-01
node: none
eyebrow: Research // benchmarks & primary sources
h1: Field evidence and primary sources.
sub: What holds up across the five stations of the loop, with the papers, standards, and specs behind every number.
lede: Every technical claim and benchmark on this site is tracked here by loop station, graded by source type, and linked directly to the primary specification, standard, or paper.
actions:
  - btn btn--primary | #board | Browse the claims | OPEN
  - btn | /#contact | Talk to a human | MAIL
placeholder: Ask where a number comes from…
next_h2: Now go check it against your cell.
next_sub: Literature sets the baseline. The bench test on your parts decides the build.
scripts: research
tb:
  - Sheet | R-01
  - Claims | <span id="rClaims">—</span>
  - Overdue | <span id="rOverdue" class="accent">0</span>
  - Checked | Sep 2026
---

  <!-- ===== 01 // The evidence board ===== -->
  <section class="section" id="board">
    <div class="container">
      <p class="eyebrow mono">01 // The evidence board</p>
      <h2 class="section__title">Every claim, by station and source.<span class="muted">Filter by loop station, source grade, or keyword. Primary sources and site pages are linked on each card.</span></h2>
      <div class="evidence" id="evidenceBoard">
        <div class="evidence__bar plate">
          <div class="evidence__controls">
            <div class="seg" role="group" aria-label="Station" id="boardStations">
              <button class="seg__btn is-active" data-station="all" type="button">All</button>
              <button class="seg__btn" data-station="perceive" type="button">Perceive</button>
              <button class="seg__btn" data-station="decide" type="button">Decide</button>
              <button class="seg__btn" data-station="act" type="button">Act</button>
              <button class="seg__btn" data-station="capture" type="button">Capture</button>
              <button class="seg__btn" data-station="imagine" type="button">Imagine</button>
              <button class="seg__btn" data-station="hub" type="button">Physical AI</button>
            </div>
            <input class="evidence__search" type="search" id="boardSearch" placeholder="Search claims, standards, or sources…" aria-label="Search claims and sources" />
            <div class="evidence__actions">
              <button class="btn btn--small btn--ghost" id="boardReset" type="button">Reset</button>
              <button class="btn btn--small" id="boardEmail" type="button" data-cursor="SEND">Email filtered list</button>
            </div>
          </div>
          <div class="evidence__filters" role="group" aria-label="Source grades">
            <label class="check" title="From a primary source: a standards body or vendor specification"><input type="checkbox" id="rate-verified" checked /> <span><i class="sq sq--verified"></i><b>Verified</b> <small class="muted">(primary spec / standard)</small></span></label>
            <label class="check" title="Consistent across multiple peer-reviewed papers or industry benchmarks"><input type="checkbox" id="rate-reported" checked /> <span><i class="sq sq--reported"></i><b>Reported</b> <small class="muted">(literature / benchmark)</small></span></label>
            <label class="check" title="Published order-of-magnitude range across tasks"><input type="checkbox" id="rate-directional" checked /> <span><i class="sq sq--directional"></i><b>Directional</b> <small class="muted">(published range)</small></span></label>
            <label class="check" title="Big Sky engineering judgment from field deployments"><input type="checkbox" id="rate-position" checked /> <span><i class="sq sq--position"></i><b>Position</b> <small class="muted">(field judgment)</small></span></label>
            <label class="check" title="Claims tied to fast-moving compute or model releases, re-verified every two quarters"><input type="checkbox" id="rate-perishable" /> <span><b>Time-sensitive only</b> <small class="muted">(2-quarter shelf life)</small></span></label>
            <span class="evidence__count mono muted" id="boardCount" aria-live="polite">—</span>
          </div>
        </div>
        <div class="claims-grid" id="boardGrid" role="region" aria-label="Claims and sources"></div>
      </div>
    </div>
  </section>

  <!-- ===== 02 // Standards & milestones ===== -->
  <section class="section" id="dates">
    <div class="container">
      <p class="eyebrow mono">02 // Standards &amp; milestones</p>
      <h2 class="section__title">The dates that move the plan.<span class="muted">Safety standard revisions, regulatory enforcement dates, and verification checkpoints across the loop.</span></h2>
      <div class="figure">
        <div class="stage" style="min-height:0;padding:1.2rem .6rem .6rem;display:block">
          <svg class="timeline" id="evidenceTimeline" viewBox="0 0 900 210" aria-hidden="true"></svg>
        </div>
        <div class="fig mono"><b>Fig. 01</b>Standards and compliance timeline, 2023 to 2028. The orange mark tracks today's date.</div>
      </div>
      <ol class="events" id="timelineList"></ol>
      <div class="cols" style="margin-top:1.4rem">
        <div class="prose">

Two of these milestones directly govern how learned policies are deployed on physical cells: the **2025 revision of ISO 10218** and the **EU Machinery Regulation (EU) 2023/1230** taking effect on **20 January 2027**. Read the [AI in a safety function field note](/notes/ai-in-a-safety-function.html) for the regulatory breakdown, or see [Fallbacks and interlocks](/physical-ai/#offer) for how we architect the safety envelope.

        </div>
        <div class="callout"><span class="sq"></span><b>Compliance note:</b> Dates reflect published standards and regulatory texts as of September 2026. Your notified body, NRTL, or legal counsel has final authority over machine sign-off.</div>
      </div>
    </div>
  </section>
