---
title: Robot Data & Cloud — Big Sky Systems
description: Your fleet is a data business with a floor plan. Capture, datasets, training infrastructure, and fleet rollout.
code: C-01
node: 3
eyebrow: Robot data &amp; cloud // capture
h1: Your fleet is a data business with a floor plan.
sub: The robots are the sensors. The loop is the product.
lede: Every hour your robots run, they generate the only thing that makes next quarter's policy better than this quarter's. Almost nobody is set up to keep it, find it, or use it. This is the least glamorous page on this site and it's the one that decides whether the rest works.
actions:
  - btn btn--primary | #calc | Do the multiplication | COUNT
  - btn | /#contact | Talk to a human | MAIL
placeholder: Ask about storage, datasets, MCAP, fleet rollout…
next_h2: Captured. Now imagine.
next_sub: Logs are only useful if something learns from them.
scripts: calc-data
---

  <!-- ===== 01 // The honest version ===== -->
  <section class="section" id="honest">
    <div class="container">
      <p class="eyebrow mono">01 // The honest version</p>
      <h2 class="section__title">Do the multiplication before you buy the robots.<span class="muted">It's a small sum and it changes the plan.</span></h2>
      <div class="cols">
        <div class="prose">

Four cameras at 1080p and 30 frames a second, running two shifts, across six robots, is not a rounding error. It's a facilities decision, a network decision, and a recurring bill. Teams routinely reach that number by accident, discover it in month four, and respond by deleting the data, which is to say by turning off the loop that was the entire point.

The projects that go wrong here go wrong the same way. Three rules that prevent it:

**Keep the raw.** Compressed, tiered to cold storage, but keep it. You will want to re-derive datasets with a labelling scheme you haven't invented yet.

**Record provenance, not just data.** Which robot, which policy version, which gripper, which calibration, which shift. A trajectory without its context is a video.

**Decide retention on day one.** Not because storage is expensive, but because “everything forever” is not a policy and it will be made for you, badly, in a hurry, by whoever gets the bill.

        </div>
        <div>
          <div class="callout" style="margin-bottom:1rem"><span class="sq"></span><b>SKY-1 says:</b> training compute is the cheap part. Nobody believes me. The expensive part is the demonstrations and the people who clean them.</div>
          <div class="fig mono"><b>Field note</b><a href="/notes/keep-the-raw.html">Keep the raw: three data decisions made in week one that decide whether you have a flywheel or a NAS →</a></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== 02 // What actually works ===== -->
  <section class="section" id="works">
    <div class="container">
      <p class="eyebrow mono">02 // What actually works</p>
      <h2 class="section__title">Two ecosystems, one conversion tax.<span class="muted">Operational logging and learning datasets are not the same thing, and the seam between them is a real cost.</span></h2>
      <div class="cols">
        <div class="prose">

On the robot, the operational format is MCAP in rosbag2, the default in modern ROS 2: a self-describing container that handles heterogeneous, multi-schema, timestamped streams. It's the thing you replay when something went wrong at 3 a.m.

On the training side, the tooling has converged on episode-oriented dataset formats built around demonstrations (LeRobot-style datasets, RLDS), with cross-embodiment collections like Open X-Embodiment published in them and tooling that assumes them.

These are different shapes for good reasons, and the conversion between them is a pipeline you own forever. Design it early, make it deterministic, version it, and make it possible to regenerate every training set from raw. Teams that skip this end up with datasets nobody can reproduce and a model nobody can explain.

### Training is the cheap part. Nobody believes this.

          <p class="serif muted" style="font-size:1.15rem;margin-top:-.3rem">Fine-tuning is a rounding error next to collecting the data and proving the result.</p>

Renting serious GPUs is a couple of dollars an hour per card. A parameter-efficient fine-tune of a generalist policy on a few hundred episodes runs overnight on a single card. A full fine-tune across eight cards is a day or two. In money, that's a rounding error against a robotics program.

The costs that actually hurt are the ones on the [Physical AI page](/physical-ai/): thousands of teleoperated demonstrations, the operators who perform them, the engineers who clean them, and the evaluation infrastructure that tells you whether any of it worked. Compute is the line item everyone budgets for and the one that matters least.

Which is the good news, mostly. It means the expensive part is something you can be strategic about instead of something you rent.

### Shipping a policy is a deployment, not a file copy.

          <p class="serif muted" style="font-size:1.15rem;margin-top:-.3rem">Treat it like software, because it is software that can move a two-kilo part at speed.</p>

Versioned artifacts, staged rollout, a canary robot, automatic rollback on a metric you agreed on in advance, per-robot configuration that survives a re-image, and observability that tells you a cell is degrading before the operator does.

Note for people planning around old documentation: the managed cloud-robotics services of the last generation have largely been withdrawn, and the current pattern is edge agents plus your own orchestration, or a fleet platform chosen on its own merits. We're vendor-neutral here for the same reason we are about arms.

### Governance

Every frame from a workplace camera has people in the background of it. Decide who can see feeds, how long they're kept, how they're deleted, and what gets blurred before it leaves the site, in week one, not after someone asks. Where the data trains a policy, that intersects with the compliance overlay: in the EU, the AI Act and GDPR sit alongside the machinery rules. This is a flag, not a legal page; we'll help you write the policy and point you at the people who sign it.

        </div>
        <div>
          <div class="callout" style="margin-bottom:1rem"><span class="sq"></span><b>The conversion tax, paid once.</b> Raw logs in, training-ready episodes out, deterministic and versioned, so every dataset can be regenerated from the raw when the labelling scheme changes. It will change.</div>
          <div class="callout" style="margin-bottom:1rem"><span class="sq"></span><b>A rollout is a deployment.</b> Canary robot, agreed metric, automatic rollback. If you can't roll back in a minute, you can't roll out.</div>
          <div class="fig mono"><b>Fig. 01</b>Prices and formats named here are stable as of September 2026. The numbers below are not; that's what the calculator is for.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== 03 // Robot data math ===== -->
  <section class="section" id="calc">
    <div class="container">
      <p class="eyebrow mono">03 // Robot data math</p>
      <h2 class="section__title">Fleet, times sensors, times hours.<span class="muted">Into terabytes a month, what it costs, and the date it becomes a problem.</span></h2>
      <div class="calc" id="dataCalc">
        <div class="calc__inputs plate">
          <div class="fig mono" style="margin-bottom:1rem"><b>Fig. 02</b>Robot data math. The default is a modest pilot. Watch what four cameras do to it.</div>
          <div class="calc__grid">
            <label class="range"><span class="mono">Robots in fleet</span><input type="range" id="cRobots" min="1" max="50" value="6" data-out="cRobotsOut" /><output id="cRobotsOut" class="mono">6</output></label>
            <label class="range"><span class="mono">Cameras per robot</span><input type="range" id="cCams" min="1" max="8" value="4" data-out="cCamsOut" /><output id="cCamsOut" class="mono">4</output></label>
            <label class="range"><span class="mono">Operating hours per day</span><input type="range" id="cHours" min="1" max="24" value="16" data-out="cHoursOut" /><output id="cHoursOut" class="mono">16</output></label>
            <label class="range"><span class="mono">Days per month</span><input type="range" id="cDays" min="1" max="31" value="22" data-out="cDaysOut" /><output id="cDaysOut" class="mono">22</output></label>
            <label class="range"><span class="mono">Hot tier (fast, expensive)</span><input type="range" id="cHot" min="0" max="100" value="10" data-out="cHotOut" /><output id="cHotOut" class="mono">10%</output></label>
            <label class="range"><span class="mono">Warm tier (the rest goes cold)</span><input type="range" id="cWarm" min="0" max="100" value="30" data-out="cWarmOut" /><output id="cWarmOut" class="mono">30%</output></label>
            <label class="calc__num"><span class="mono">“It's a problem at”, TB stored</span><input type="number" id="cLimit" min="1" max="100000" step="10" value="100" /></label>
          </div>
          <div class="calc__segs">
            <div><span class="mono muted">Resolution</span><div class="seg" role="group" aria-label="Resolution" id="cRes"><button class="seg__btn" data-v="720" type="button">720p</button><button class="seg__btn is-active" data-v="1080" type="button">1080p</button><button class="seg__btn" data-v="2160" type="button">4K</button></div></div>
            <div><span class="mono muted">Frame rate</span><div class="seg" role="group" aria-label="Frame rate" id="cFps"><button class="seg__btn" data-v="10" type="button">10</button><button class="seg__btn is-active" data-v="30" type="button">30</button><button class="seg__btn" data-v="60" type="button">60</button></div></div>
            <div><span class="mono muted">Compression</span><div class="seg" role="group" aria-label="Compression" id="cCodec"><button class="seg__btn" data-v="raw" type="button">Raw</button><button class="seg__btn" data-v="lossless" type="button">Lossless</button><button class="seg__btn is-active" data-v="h265" type="button">H.265</button></div></div>
            <div><span class="mono muted">Retention</span><div class="seg" role="group" aria-label="Retention" id="cRet"><button class="seg__btn" data-v="1" type="button">1 mo</button><button class="seg__btn" data-v="3" type="button">3</button><button class="seg__btn is-active" data-v="12" type="button">12</button><button class="seg__btn" data-v="36" type="button">36</button></div></div>
          </div>
          <div class="calc__toggles">
            <label class="check"><input type="checkbox" id="cDepth" /> <span>Include depth streams</span><small class="mono">+40%</small></label>
            <label class="check"><input type="checkbox" id="cLogs" checked disabled /> <span>Proprioception &amp; logs</span><small class="mono">small · always on · shown for honesty</small></label>
          </div>
        </div>
        <div class="calc__outputs">
          <div class="stats">
            <div class="stat"><span class="mono">Per robot-hour</span><b id="cO1">—</b></div>
            <div class="stat"><span class="mono">Per day</span><b id="cO2">—</b></div>
            <div class="stat"><span class="mono">Per month</span><b id="cO3">—</b></div>
            <div class="stat"><span class="mono">Stored at retention</span><b id="cO4">—</b></div>
            <div class="stat"><span class="mono">Storage, per month</span><b id="cO5">—</b></div>
            <div class="stat"><span class="mono">Egress, if you move it once</span><b id="cO6">—</b></div>
            <div class="stat"><span class="mono">A problem by</span><b id="cO7">—</b></div>
            <div class="stat stat--wide"><span class="mono">SKY-1 says</span><p id="cVerdict" aria-live="polite">—</p></div>
          </div>
          <p class="mono muted small" id="cReadout" aria-live="polite" style="margin:.8rem 0 0"></p>
          <div class="lab__actions" style="margin-top:1rem">
            <button class="btn btn--small" id="cEmail" type="button" data-cursor="SEND">Email me this estimate</button>
            <button class="btn btn--small btn--ghost" id="cReset" type="button">Reset</button>
          </div>
          <p class="muted small" style="margin-top:1rem">Bitrates are illustrative and depend heavily on scene content, encoder settings, and how much your parts move. Cloud storage and egress prices vary by provider, region, and how good you are at negotiating; the bands here are list-price-shaped, not quotes. Numbers are rounded with enthusiasm. Nothing here is stored or sent.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== 04 // What we do ===== -->
  <section class="section" id="offer">
    <div class="container">
      <p class="eyebrow mono">04 // What we do</p>
      <h2 class="section__title">Four things, in your account, that your team can run.<span class="muted">No lock-in to us. That's the point.</span></h2>
      <div class="cards cards--4">
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">C-01</span><h3>Capture architecture</h3><p>Schema, provenance, on-robot buffering, and an ingest path sized to your actual bitrate and your actual network.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>Capture schema with provenance on every record</li><li>On-robot buffering that survives the Wi-Fi dropping</li><li>Ingest path sized from the multiplication, not a guess</li><li>Retention and tiering policy, decided on day one</li></ul></div>
          </div>
        </article>
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">C-02</span><h3>Dataset pipeline</h3><p>Deterministic, versioned, reproducible conversion from raw logs to training-ready episodes.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>MCAP in, episode datasets out, the same way every time</li><li>Versioned so any training set regenerates from raw</li><li>QC that drops the bad episodes before they train</li><li>A catalogue your team can actually search</li></ul></div>
          </div>
        </article>
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">C-03</span><h3>Training &amp; evaluation infrastructure</h3><p>Set up so your team runs it, in your account, with cost visibility and no lock-in to us.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>Training jobs in your cloud account or on your rack, scripted</li><li>Evaluation that runs on every candidate, automatically</li><li>Cost visibility per experiment, before the bill</li><li>Runbooks, so nobody needs us to press the button</li></ul></div>
          </div>
        </article>
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">C-04</span><h3>Fleet rollout</h3><p>Versioned policies, staged canaries, metric-triggered rollback, and observability that pages someone before the line stops.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>Versioned policy artifacts with a rollback that works</li><li>Canary robot and an agreed metric that decides</li><li>Per-robot configuration that survives a re-image</li><li>Dashboards and alerts that page before the operator notices</li></ul></div>
          </div>
        </article>
      </div>
    </div>
  </section>
