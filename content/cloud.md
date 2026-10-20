---
title: Robot Data & Cloud — Big Sky Systems
description: On-robot ring buffers, MCAP ingest, reproducible episode datasets, training infrastructure, and staged fleet rollout.
code: C-01
node: 3
eyebrow: Robot data &amp; cloud // capture
h1: Every hour a robot runs, it writes the next dataset.
sub: Only if your ring buffers, schemas, and ingest pipelines are built to keep it.
lede: Every shift your robots run, they generate the sensor logs and edge cases that make next quarter's policy better than this quarter's. Almost nobody is set up to buffer, index, or query them. This is the least glamorous station in the loop and the one that decides whether the rest improves over time.
actions:
  - btn btn--primary | #calc | Do the multiplication | COUNT
  - btn | /#contact | Talk to a human | MAIL
placeholder: Ask about storage, datasets, MCAP, fleet rollout…
next_h2: Captured. Now imagine.
next_sub: Logs are only useful if something learns from them.
scripts: calc-data
---

  <!-- ===== 01 // Bitrate & retention ===== -->
  <section class="section" id="honest">
    <div class="container">
      <p class="eyebrow mono">01 // Bitrate &amp; retention</p>
      <h2 class="section__title">Do the multiplication before you buy the robots.<span class="muted">It's a small sum and it changes the plan.</span></h2>
      <div class="cols">
        <div class="prose">

Four 1080p cameras at 30 fps across six robots running two shifts is a facilities, network, and storage bill. Teams that discover that bitrate when the NAS fills up respond by deleting raw logs—turning off the data flywheel they built the fleet to feed.

**Keep the raw.** Tiered to cold storage and compressed, so you can re-derive datasets when your action space or labeling scheme changes.

**Record provenance on every episode.** Robot ID, policy checkpoint, gripper, camera extrinsics, and shift. Without calibration and controller metadata, a trajectory cannot be trained on.

**Set retention rules on day one.** Triggered ring buffers keep high-rate sensor streams around faults, interventions, and out-of-distribution grasps while summarizing routine cycles.

        </div>
        <div>
          <div class="callout" style="margin-bottom:1rem"><span class="sq"></span><b>Cost reality:</b> GPU training hours are a fraction of your budget. The real cost sits in demonstration collection, episode curation, and storage egress.</div>
          <div class="fig mono"><b>Field note</b><a href="/notes/keep-the-raw.html">Keep the raw: three data decisions made in week one that decide whether you have a flywheel or a NAS →</a></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== 02 // What actually works ===== -->
  <section class="section" id="works">
    <div class="container">
      <p class="eyebrow mono">02 // What actually works</p>
      <h2 class="section__title">Two ecosystems, one conversion tax.<span class="muted">Operational logging and learning datasets are not the same thing.</span></h2>
      <div class="cols">
        <div class="prose">

**MCAP to episode datasets.** On the robot, the operational format is MCAP in rosbag2: heterogeneous, multi-schema, timestamped streams built for fault replay. On the training side, tooling expects clean episode datasets (LeRobot, RLDS). Build a deterministic, versioned conversion pipeline early so any training set can be regenerated from raw logs.

**Training compute vs. fleet rollout.** A parameter-efficient fine-tune of a generalist policy on a few hundred episodes runs overnight on a single rented GPU; full fine-tunes across eight cards take a day or two. The engineering work that matters is staged deployment: versioned policy artifacts, a canary cell, automated rollback when cycle metrics degrade, and on-edge privacy redaction before camera frames leave the plant.

        </div>
        <div class="callout"><span class="sq"></span><b>Rollout rule:</b> versioned artifacts, canary cell, agreed cycle metric, and one-command rollback. If you cannot roll back in under a minute, you are not ready to roll out.</div>
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
            <label class="check"><input type="checkbox" id="cLogs" checked disabled /> <span>Proprioception &amp; logs</span><small class="mono">small · always on · ~250 MB/hr</small></label>
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
          <p class="mono muted small" id="cReadout" aria-live="polite" hidden></p>
          <div class="lab__actions" style="margin-top:1rem">
            <button class="btn btn--small" id="cEmail" type="button" data-cursor="SEND">Email me this estimate</button>
            <button class="btn btn--small btn--ghost" id="cReset" type="button">Reset</button>
          </div>
          <p class="muted small" style="margin-top:1rem">First-order bitrate and list-price cloud storage estimate. State stays in the URL.</p>
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
            <div class="card__face card__back"><h4>You get</h4><ul><li>MCAP in, episode datasets out, the same way every time</li><li>Versioned so any training set regenerates from raw</li><li>QC that drops the bad episodes before they train</li><li>A catalog your team can actually search</li></ul></div>
          </div>
        </article>
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">C-03</span><h3>Training infrastructure</h3><p>Set up so your team runs it, in your account, with cost visibility and no lock-in to us.</p><span class="card__hint mono">Tap to flip</span></div>
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
