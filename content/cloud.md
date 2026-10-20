---
title: Robot Data & Cloud — Big Sky Systems
description: On-robot ring buffers, MCAP ingest, reproducible episode datasets, training infrastructure, and staged fleet rollout.
code: C-01
node: 3
eyebrow: Robot data &amp; cloud // capture
h1: Every hour a robot runs, it writes the next dataset.
sub: On-robot ring buffers, MCAP-to-episode ETL pipelines, training workflows, and canary fleet rollouts in your own account.
lede: Every shift your robots run, they generate the edge cases and failure traces that make next quarter's policy better than this quarter's. We build the buffering, provenance schemas, dataset pipelines, and rollback infrastructure in your own cloud or on-prem rack—with zero vendor lock-in.
actions:
  - btn btn--primary | #offer | See deliverables | WORK
  - btn | #calc | Size your storage | COUNT
  - btn | /#contact | Talk to a human | MAIL
placeholder: Ask about storage, datasets, MCAP, fleet rollout…
next_h2: Captured. Now imagine.
next_sub: Logs are only useful if something learns from them.
scripts: calc-data
---

  <!-- ===== 01 // What we deliver ===== -->
  <section class="section" id="offer">
    <div class="container">
      <p class="eyebrow mono">01 // What we deliver</p>
      <h2 class="section__title">Four data &amp; fleet engagements, deployed in your account.<span class="muted">Your cloud, your storage buckets, your runbooks. No recurring platform lock-in to us.</span></h2>
      <div class="cards cards--4">
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">C-01 // EDGE BUFFERING &amp; INGEST</span><h3>Capture architecture</h3><p>Triggered on-robot ring buffers, provenance schemas, and an upload pipeline sized to your plant's actual bitrate and Wi-Fi.</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>ROS 2 MCAP capture schema with full calibration &amp; policy provenance</li><li>On-robot ring buffer that survives network drops and triggers on faults</li><li>Edge privacy redaction (face/badge blurring) before frames leave site</li><li>Day-one hot/warm/cold retention and storage tiering policy</li></ul></div>
          </div>
        </article>
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">C-02 // MCAP TO EPISODES</span><h3>Dataset pipeline</h3><p>Deterministic, versioned ETL from raw operational rosbag2/MCAP logs into training-ready episode datasets (LeRobot, RLDS).</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>Deterministic MCAP → LeRobot / RLDS episode conversion pipeline</li><li>Dataset versioning so any training set regenerates from raw logs</li><li>Automated episode QC filter (drops stalls, e-stops, corrupt sync)</li><li>Searchable episode catalog indexed by task, part, and failure mode</li></ul></div>
          </div>
        </article>
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">C-03 // TRAINING &amp; EVAL</span><h3>Training infrastructure</h3><p>Scripted fine-tuning and evaluation workflows inside your cloud account or on-prem GPU rack, with per-run cost visibility.</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>One-command training jobs on your cloud or on-prem GPUs</li><li>Automated post-training evaluation pass on every candidate checkpoint</li><li>Per-experiment GPU &amp; storage cost tracking before bills spike</li><li>Complete runbooks so your engineers run training without us</li></ul></div>
          </div>
        </article>
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">C-04 // CANARY DEPLOYMENT</span><h3>Fleet rollout</h3><p>Signed policy artifacts, staged canary cells, metric-triggered rollback, and fleet telemetry that pages before the line stops.</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>Versioned, OCI-packaged policy artifacts with one-command rollback</li><li>Canary cell rollout gated on agreed cycle-time and intervention metrics</li><li>Per-robot calibration and configuration state that survives re-imaging</li><li>Grafana/Foxglove observability dashboards and drift alerts</li></ul></div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- ===== 02 // Architecture & data rules ===== -->
  <section class="section" id="works">
    <div class="container">
      <p class="eyebrow mono">02 // Architecture &amp; retention rules</p>
      <h2 class="section__title">Two ecosystems, one conversion pipeline.<span class="muted">Operational diagnostics and policy-training datasets require different formats—and a deterministic bridge between them.</span></h2>

| Layer | Standard format | What it's built for | What breaks without it |
|---|---|---|---|
| **On-robot operational log** | `rosbag2` / **MCAP** | Asynchronous, multi-rate sensor streams, TF trees, and fault replay. | You can't diagnose why a cell faulted at 2:14 a.m. |
| **Provenance manifest** | **JSON / Parquet** | Robot ID, camera extrinsics, gripper TCP, policy SHA, operator ID. | Recorded trajectories are unusable after the next calibration. |
| **Training dataset** | **LeRobot / RLDS** | Time-aligned `(observation, action, reward)` episodes for GPU dataloaders. | Training scripts stall on raw bag parsing and mismatched timestamps. |

      <div class="cols" style="margin-top:1.6rem">
        <div class="prose">
          <p><strong>Keep the raw, tier it cold, and budget for data over compute.</strong> Fine-tuning a generalist policy on a few hundred episodes runs overnight on a single rented GPU ($2–$4/hr). The real line items are storage, egress, and episode curation—which is why retention rules and triggered ring buffers belong in week one.</p>
        </div>
        <div class="callout"><span class="sq"></span><b>Rollout rule:</b> versioned artifacts, canary cell, agreed cycle metric, and one-command rollback. If you cannot roll back in under a minute, you are not ready to roll out.</div>
      </div>
    </div>
  </section>

  <!-- ===== 03 // Robot data math ===== -->
  <section class="section" id="calc">
    <div class="container">
      <p class="eyebrow mono">03 // Interactive storage &amp; cost calculator</p>
      <h2 class="section__title">Size your fleet data footprint.<span class="muted">Multiply robots, cameras, and shift hours into monthly terabytes, cloud storage cost, and when your array fills up.</span></h2>
      <div class="calc" id="dataCalc">
        <div class="calc__inputs plate">
          <div class="fig mono" style="margin-bottom:1rem"><b>Fig. 01</b>The default models a 6-robot pilot with four 1080p cameras per cell.</div>
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
