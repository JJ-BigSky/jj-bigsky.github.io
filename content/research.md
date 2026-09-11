---
title: Research — Big Sky Systems
description: Every number on the site, rated by how much we trust it, dated by when it was checked, with its sources. Perishable claims age in public.
code: R-01
node: none
eyebrow: Research // the evidence
h1: Every number on this site has a source.
sub: Here they are, rated by how much we trust them and dated by when they go stale.
lede: The site's credibility comes from being right. So the research stays where you can see it: each claim, how sure we are, when it was last checked, where it's used, and what it rests on. The perishable ones age in public.
actions:
  - btn btn--primary | #board | Open the board | OPEN
  - btn | /#contact | Talk to a human | MAIL
placeholder: Ask where a number comes from…
next_h2: Now go check it against your cell.
next_sub: The board is the argument. The bake-off is the proof.
scripts: research
tb:
  - Sheet | R-01
  - Claims | <span id="rClaims">—</span>
  - Overdue | <span id="rOverdue" class="accent">0</span>
  - Checked | Sep 2026
---

  <!-- ===== 01 // How we rate ===== -->
  <section class="section" id="ratings">
    <div class="container">
      <p class="eyebrow mono">01 // How we rate</p>
      <h2 class="section__title">Four grades and a shelf life.<span class="muted">The site's credibility comes from being right. This is how we keep score.</span></h2>
      <div class="legend">
        <div class="plate marks"><b><i class="sq sq--verified"></i>Verified</b><p>From a primary source: a standards body, or a vendor's own spec page.</p></div>
        <div class="plate marks"><b><i class="sq sq--reported"></i>Reported</b><p>Consistent across multiple industry sources, not primary. Stated as reporting, not as fact.</p></div>
        <div class="plate marks"><b><i class="sq sq--directional"></i>Directional</b><p>A widely repeated range. Published as a range, never as a precise figure.</p></div>
        <div class="plate marks"><b><i class="sq sq--position"></i>Position</b><p>Our judgment, labelled as such. Defensible, and yours to disagree with.</p></div>
        <div class="plate marks"><b><i class="decay decay--aging" style="width:22px;height:5px;margin:0;display:inline-block"><i style="width:60%"></i></i>Perishable</b><p>Will be stale within about two quarters. The bar fills from the day we checked it, in public.</p></div>
      </div>
      <div class="cols" style="margin-top:1.6rem">
        <div class="prose">

**The standing rule:** prefer a claim that stays true over one that is precise and perishable. “Fifty to two hundred demonstrations per task, depending on the task” outlives “exactly 2,070 FP4 TFLOPS.” Perishable specifics go in body copy with a date, never in a headline, and never in SKY-1's mouth, because SKY-1's answers are the hardest thing to keep current.

So some things we know are deliberately not on the pages: part numbers, hourly GPU prices, roadmap dates. They're on the board below, marked perishable, so you can see what we chose not to print and why.

        </div>
        <div class="callout"><span class="sq"></span><b>SKY-1 says:</b> ask me “where does this number come from” on any page and I'll point at the plate. If the bar has gone red, ask a human for the current version before you quote it.</div>
      </div>
    </div>
  </section>

  <!-- ===== 02 // The evidence board ===== -->
  <section class="section" id="board">
    <div class="container">
      <p class="eyebrow mono">02 // The evidence board</p>
      <h2 class="section__title">Every claim, by station and by grade.<span class="muted">Open a plate for its sources, where it's used, and how long it has left.</span></h2>
      <div class="evidence" id="evidenceBoard">
        <div>
          <div class="evidence__controls">
            <div class="seg" role="group" aria-label="Station" id="boardStations">
              <button class="seg__btn is-active" data-station="all" type="button">All</button>
              <button class="seg__btn" data-station="perceive" type="button">Perceive</button>
              <button class="seg__btn" data-station="decide" type="button">Decide</button>
              <button class="seg__btn" data-station="act" type="button">Act</button>
              <button class="seg__btn" data-station="capture" type="button">Capture</button>
              <button class="seg__btn" data-station="imagine" type="button">Imagine</button>
              <button class="seg__btn" data-station="hub" type="button">Hub</button>
            </div>
            <input class="evidence__search" type="search" id="boardSearch" placeholder="Search claims and sources…" aria-label="Search claims and sources" />
          </div>
          <div class="evidence__filters" role="group" aria-label="Grades">
            <label class="check"><input type="checkbox" id="rate-verified" checked /> <span><i class="sq sq--verified"></i>Verified</span></label>
            <label class="check"><input type="checkbox" id="rate-reported" checked /> <span><i class="sq sq--reported"></i>Reported</span></label>
            <label class="check"><input type="checkbox" id="rate-directional" checked /> <span><i class="sq sq--directional"></i>Directional</span></label>
            <label class="check"><input type="checkbox" id="rate-position" checked /> <span><i class="sq sq--position"></i>Position</span></label>
            <label class="check"><input type="checkbox" id="rate-perishable" /> <span>Perishable only</span></label>
          </div>
          <div class="board" id="boardGrid" role="group" aria-label="Claims by station and grade"></div>
          <p class="evidence__count mono muted" id="boardCount" aria-live="polite">—</p>
          <div class="figure" style="margin-top:1rem;grid-template-columns:1fr">
            <div class="fig mono"><b>Fig. 01</b>The evidence board. Stations across, grades down. A filled square is a source we checked; a hollow one is a position we hold.</div>
          </div>
        </div>
        <div>
          <div class="plate marks evidence__detail" id="boardDetail" aria-live="polite"></div>
          <div class="lab__actions" style="margin-top:1rem">
            <button class="btn btn--small" id="boardEmail" type="button" data-cursor="SEND">Email me this list</button>
            <button class="btn btn--small btn--ghost" id="boardReset" type="button">Reset</button>
          </div>
          <p class="muted small" style="margin-top:1rem">Ratings are ours. Sources are theirs. Perishable claims age on this page from the day we last checked them; if a bar has gone red, ask us for the current version before you quote it. The link in your address bar carries your filters and the open claim. Nothing here is stored or sent.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== 03 // Dated events ===== -->
  <section class="section" id="dates">
    <div class="container">
      <p class="eyebrow mono">03 // Dated events</p>
      <h2 class="section__title">The dates that move the plan.<span class="muted">Standards, regulations, and the day we last checked. Today is wherever today is.</span></h2>
      <div class="figure">
        <div class="stage" style="min-height:0;padding:1.2rem .6rem .6rem;display:block">
          <svg class="timeline" id="evidenceTimeline" viewBox="0 0 900 210" aria-hidden="true"></svg>
        </div>
        <div class="fig mono"><b>Fig. 02</b>Dated events, 2023 to 2028. The orange mark is today, computed when the page loads. It will keep moving after we stop.</div>
      </div>
      <ol class="events" id="timelineList"></ol>
      <p class="mono muted small" id="timelineReadout" aria-live="polite" style="margin-top:.8rem"></p>
      <div class="cols" style="margin-top:1.2rem">
        <div class="prose">

Two of these dates are why the safety work on this site connects to the AI work: the 2025 revision of ISO 10218, and the EU Machinery Regulation applying from 20 January 2027. The [field note](/notes/ai-in-a-safety-function.html) is the descriptive version; the [fallbacks and interlocks](/physical-ai/#offer) service is what we do about it.

        </div>
        <div class="callout"><span class="sq"></span><b>Descriptive, not advice.</b> Dates are what the sources say. Your notified body, assessor, or counsel has the last word on your machine.</div>
      </div>
    </div>
  </section>

  <!-- ===== 04 // What we do with it ===== -->
  <section class="section" id="offer">
    <div class="container">
      <p class="eyebrow mono">04 // What we do with it</p>
      <h2 class="section__title">We read the papers so the site stays right.<span class="muted">And so the bake-off is against what's current, not last year's.</span></h2>
      <div class="cols">
        <ul class="list prose">
          <li><strong>Every engagement starts from this board.</strong> The claims that matter to your task get re-checked before we quote a number, and the perishable ones get a date.</li>
          <li><strong>Bake-offs, not brochures.</strong> Candidate models, sensors, and simulators are evaluated on your parts and your bench, against what the literature says they should do.</li>
          <li><strong>You get the sources.</strong> Every recommendation in a deliverable cites what it rests on, graded the same way, so your team can argue with it.</li>
          <li><strong>When the board goes red, we tell you.</strong> A perishable claim past its shelf life is a reason to call, not a reason to trust the page.</li>
        </ul>
        <div class="callout"><span class="sq"></span><b>Research current as of September 2026.</b> Ask us for the current version. It moves, and that's the point of writing the date down.</div>
      </div>
    </div>
  </section>
