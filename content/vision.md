---
title: Visual Intelligence — Big Sky Systems
description: Industrial robot perception engineering: sensor and lighting bench tests, hand-eye calibration monitoring, ROS 2 6-DoF pose pipelines, and post-grasp verification.
code: V-01
node: 0
eyebrow: Visual intelligence // perceive
h1: The robot can't do anything it can't see.
sub: Optics, controlled lighting, 6-DoF pose pipelines, and post-grasp verification engineered for the shop floor.
lede: Foundation models have made object detection and segmentation much easier than they were three years ago. Where industrial perception still fails is specular parts, ambient light swings, bumped camera mounts, and grasp verification. We engineer the full six-stage perception stack around your actual parts.
actions:
  - btn btn--primary | #offer | See deliverables | WORK
  - btn | #lab | Scope your pipeline | RUN
  - btn | /#contact | Talk to a human | MAIL
placeholder: Ask about cameras, lighting, pose, calibration…
next_h2: The loop doesn't stop here.
next_sub: Seeing the part is station one. Something has to decide what to do about it.
scripts: vision-lab
---

  <!-- ===== 01 // What we deliver ===== -->
  <section class="section" id="offer">
    <div class="container">
      <p class="eyebrow mono">01 // What we deliver</p>
      <h2 class="section__title">Four ways we make the robot see.<span class="muted">Hire us for a single bench test or the full commissioned ROS 2 perception pipeline.</span></h2>
      <div class="cards cards--4">
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">V-01 // OPTICS &amp; ILLUMINATION</span><h3>Sensor &amp; lighting design</h3><p>Bench test on your actual production parts, including the shiny or transparent ones that break off-the-shelf depth cameras.</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>Bench test report on your real parts, shiny ones included</li><li>Scored camera shortlist (2D, stereo, structured light, ToF, line-scan)</li><li>Lighting geometry, wavelength, strobing, and shrouding spec</li><li>Go/no-go recommendation before anyone signs a camera PO</li></ul></div>
          </div>
        </article>
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">V-02 // GEOMETRY &amp; DRIFT</span><h3>Calibration monitoring</h3><p>Repeatable hand-eye and intrinsic calibration, plus an automated check that flags a bumped mount before a crash does.</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>Hand-eye and intrinsic calibration procedure your techs can run</li><li>Shop-hardened fiducial targets and mounting fixtures</li><li>Automated per-shift drift check that alerts on mount movement</li><li>Recalibration runbook with quantitative pass/fail tolerances</li></ul></div>
          </div>
        </article>
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">V-03 // ROS 2 PIPELINE</span><h3>Perception pipeline build</h3><p>Detect → segment → depth → pose → grasp → verify, wired into ROS 2 with measured per-stage p99.9 latency budgets.</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>Six modular stages in ROS 2, each benchmarked at p99.9</li><li>Zero-shot or CAD-based 6-DoF pose estimation for cluttered bins</li><li>Documented failure taxonomy and safe reject/re-try states</li><li>Labeled regression dataset built from your production parts</li></ul></div>
          </div>
        </article>
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">V-04 // QUALITY &amp; RECOVERY</span><h3>Verification systems</h3><p>Independent inspection of the robot's grasp and placement so the cell catches slips and mis-picks without stopping the line.</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>Secondary verification camera checking grasp pose and placement</li><li>Automated re-grasp or reject-chute routing on failed picks</li><li>Drift and confidence telemetry that pages before quality drops</li><li>Timestamped inspection audit trail for your QA team</li></ul></div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- ===== 02 // Architecture & sensor selection ===== -->
  <section class="section" id="works">
    <div class="container">
      <p class="eyebrow mono">02 // Architecture &amp; sensor guide</p>
      <h2 class="section__title">Six stages, and which camera fits.<span class="muted">Four stages got much easier with foundation models. Grasp physics and verification still win or lose the cell.</span></h2>
      <ol class="stages" aria-label="The six stages of a perception pipeline">
        <li class="stages__item marks"><span class="stages__num mono">01</span><h3>Detect</h3><p>Largely solved zero-shot. Open-vocabulary detectors find your part without custom training.</p><span class="badge"><i class="sq sq--ok"></i>Got easier</span></li>
        <li class="stages__item marks"><span class="stages__num mono">02</span><h3>Segment</h3><p>Largely solved zero-shot. Promptable segmentation gives clean masks on unseen parts.</p><span class="badge"><i class="sq sq--ok"></i>Got easier</span></li>
        <li class="stages__item marks"><span class="stages__num mono">03</span><h3>Depth</h3><p>Monocular foundation models are strong, but metrology still requires active stereo or structured light.</p><span class="badge"><i class="sq sq--ok"></i>Got easier</span></li>
        <li class="stages__item marks"><span class="stages__num mono">04</span><h3>Pose</h3><p>Zero-shot 6-DoF from CAD or reference views now works reliably in cluttered bins.</p><span class="badge"><i class="sq sq--ok"></i>Got easier</span></li>
        <li class="stages__item marks"><span class="stages__num mono">05</span><h3>Grasp</h3><p>Still hard. Geometry proposes; gripper compliance, friction, and part physics dispose.</p><span class="badge"><i class="sq sq--warn"></i>Still hard</span></li>
        <li class="stages__item marks"><span class="stages__num mono">06</span><h3>Verify</h3><p>Still skipped. The camera that checks the robot's work is worth more than the one that guides it.</p><span class="badge"><i class="sq sq--warn"></i>Still skipped</span></li>
      </ol>
      <div class="fig mono" style="margin:1.4rem 0 .8rem"><b>Fig. 01 // Sensor selection matrix</b>Match the sensor to your surface finish, working distance, and cycle-time budget before writing software.</div>
      <div class="spec-wrap">
        <table class="spec">
          <thead><tr><th>Sensor</th><th>Pick this when</th><th>Watch out for</th></tr></thead>
          <tbody>
            <tr><td><strong>2D camera</strong></td><td>Presence, in-plane orientation, reading marks, checking the robot's work against a known datum.</td><td class="muted">No depth. Anything that needs height, tilt, or a stack.</td></tr>
            <tr><td><strong>Active / passive stereo</strong></td><td>General-purpose depth on textured parts at modest accuracy. Fast, rugged, forgiving.</td><td class="muted">Specular steel, clear plastic, or repetitive geometry.</td></tr>
            <tr><td><strong>Structured light</strong></td><td>Sub-millimeter 3D depth on static or slow scenes: bin picking, high-precision inspection.</td><td class="muted">Direct sunlight from bay doors, shiny parts, motion blur.</td></tr>
            <tr><td><strong>Time-of-flight (ToF)</strong></td><td>Fast, longer-range depth for AMR navigation, palletizing, and coarse picking.</td><td class="muted">Multi-path errors near bin corners; millimeter accuracy, not tenths.</td></tr>
            <tr><td><strong>Line-scan</strong></td><td>Continuous high-speed inspection of moving webs, extrusions, and conveyors.</td><td class="muted">Requires constant motion and hardware encoder synchronization.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ===== 03 // Perception pipeline (the instrument) ===== -->
  <section class="section" id="lab">
    <div class="container">
      <p class="eyebrow mono">03 // Interactive pipeline scoping</p>
      <h2 class="section__title">Scope your perception pipeline.<span class="muted">Toggle stages, degrade the lighting, and watch latency and pose error accumulate against your cycle budget.</span></h2>
      <div class="lab" id="visionLab">
        <div class="lab__stage stage" data-cursor="LOOK">
          <canvas id="visionCanvas" aria-hidden="true"></canvas>
          <div class="stage__hud mono" id="visionHud" aria-hidden="true"><span>Found <b id="vFound">—</b></span><span>Pose σ <b id="vSigma">—</b></span><span>Pipeline <b id="vMs">—</b></span><span>Budget <b id="vBudget">100 ms</b></span></div>
          <p class="stage__msg mono" id="visionMsg" hidden>Over budget. Something has to go, or something has to get faster. <a href="/embedded/">On-robot autonomy →</a></p>
          <p class="mono muted small stage__readout" id="visionReadout" aria-live="polite">Loading the bin…</p>
        </div>
        <div class="lab__controls">
          <div class="fig mono"><b>Fig. 02</b>Toggle stages and lighting to model your cell, then email the configuration to start a scoping call.</div>
          <div class="lab__toggles" role="group" aria-label="Pipeline stages">
            <label class="check"><input type="checkbox" id="vs-detect" checked /> <span>Detect</span><small class="mono">8 ms</small></label>
            <label class="check"><input type="checkbox" id="vs-segment" /> <span>Segment</span><small class="mono">22 ms</small></label>
            <label class="check"><input type="checkbox" id="vs-depth" /> <span>Depth</span><small class="mono">14 ms</small></label>
            <label class="check"><input type="checkbox" id="vs-pose" /> <span>Pose</span><small class="mono">31 ms</small></label>
            <label class="check"><input type="checkbox" id="vs-grasp" /> <span>Grasp</span><small class="mono">12 ms</small></label>
            <label class="check"><input type="checkbox" id="vs-verify" /> <span>Verify</span><small class="mono">9 ms</small></label>
          </div>
          <label class="range"><span class="mono">Lighting</span><input type="range" id="vLight" min="0" max="100" value="85" data-out="vLightOut" /><output id="vLightOut" class="mono">85</output></label>
          <label class="range"><span class="mono">Clutter</span><input type="range" id="vClutter" min="0" max="100" value="35" data-out="vClutterOut" /><output id="vClutterOut" class="mono">35</output></label>
          <div class="seg" role="group" aria-label="Latency budget">
            <button class="seg__btn" data-budget="33" type="button">33 ms · 30 Hz</button>
            <button class="seg__btn is-active" data-budget="100" type="button">100 ms · 10 Hz</button>
            <button class="seg__btn" data-budget="250" type="button">250 ms · 4 Hz</button>
          </div>
          <div class="stat stat--wide"><span class="mono">SKY-1 says</span><p id="vVerdict">Camera's on. Turn things on and see what it costs.</p></div>
          <div class="lab__actions">
            <button class="btn btn--small" id="vEmail" type="button" data-cursor="SEND">Email this setup</button>
            <button class="btn btn--small btn--ghost" id="vReset" type="button">Reset</button>
          </div>
          <p class="muted small">Illustrative embedded stage costs. Nothing is stored or sent.</p>
        </div>
      </div>
    </div>
  </section>
