---
title: Visual Intelligence — Big Sky Systems
description: Perception is where robotics projects die quietly. Sensors, lighting, pose, grasping, and what actually breaks them.
code: V-01
node: 0
eyebrow: Visual intelligence // perceive
h1: The robot can't do anything it can't see.
sub: And it can see beautifully until Tuesday, when the sun comes through the loading door.
lede: Vision is the highest-payoff and highest-variance system in a robot cell. Foundation models have made the first four stages of the pipeline much easier than they were three years ago. The last two stages, and the physical environment around all six, are where the year goes.
actions:
  - btn btn--primary | #lab | Run the pipeline | RUN
  - btn | /#contact | Talk to a human | MAIL
placeholder: Ask about cameras, lighting, pose, calibration…
next_h2: The loop doesn't stop here.
next_sub: Seeing the part is station one. Something has to decide what to do about it.
scripts: vision-lab
---

  <!-- ===== 01 // The honest version ===== -->
  <section class="section" id="honest">
    <div class="container">
      <p class="eyebrow mono">01 // The honest version</p>
      <h2 class="section__title">Nothing on this list is a model problem.<span class="muted">Every one of them has ended a pilot.</span></h2>
      <div class="cols">
        <div class="prose">

**Specular and transparent parts.** Polished steel and clear plastic break depth sensing in ways that no amount of fine-tuning fixes. The answer is usually a different sensor or a different light, not a different network.

**Clutter and occlusion.** A part that's 90% visible is a solved problem. A part that's 30% visible under three other parts is a research topic with a delivery date attached.

**Lighting drift.** Morning light, afternoon light, someone replaces a failed fixture with a slightly bluer one, and your pose estimates walk. Controlled lighting is the cheapest reliability upgrade in the building and it is skipped constantly.

**Calibration drift.** Hand-eye calibration is not a one-time ceremony. Somebody bumps the camera mount, and a system that was accurate to half a millimetre is now confidently wrong.

**The last two percent of pose error.** Ninety-eight percent is a great demo and a daily crash. The gap between them is fixturing, verification, and knowing when to refuse.

        </div>
        <div class="callout"><span class="sq"></span><b>SKY-1 says:</b> ask me what breaks vision and I'll recite this list. I learned it the way everyone does, at 2 a.m., from a robot that was very sure about the wrong part.</div>
      </div>
    </div>
  </section>

  <!-- ===== 02 // What actually works ===== -->
  <section class="section" id="works">
    <div class="container">
      <p class="eyebrow mono">02 // What actually works</p>
      <h2 class="section__title">Six stages, and what changed.<span class="muted">Four of them got much easier. Two of them didn't.</span></h2>
      <ol class="stages" aria-label="The six stages of a perception pipeline">
        <li class="stages__item marks"><span class="stages__num mono">01</span><h3>Detect</h3><p>Largely solved zero-shot. Open-vocabulary detectors find your part without you training anything.</p><span class="badge"><i class="sq sq--ok"></i>Got easier</span></li>
        <li class="stages__item marks"><span class="stages__num mono">02</span><h3>Segment</h3><p>Largely solved zero-shot. Promptable segmentation gives clean masks on parts it has never seen.</p><span class="badge"><i class="sq sq--ok"></i>Got easier</span></li>
        <li class="stages__item marks"><span class="stages__num mono">03</span><h3>Depth</h3><p>Monocular depth foundation models are startlingly good and still not metrology. Know which one you need.</p><span class="badge"><i class="sq sq--ok"></i>Got easier</span></li>
        <li class="stages__item marks"><span class="stages__num mono">04</span><h3>Pose</h3><p>Zero-shot 6-DoF from a CAD model or a few reference views now works in cluttered bins. This is the big recent change.</p><span class="badge"><i class="sq sq--ok"></i>Got easier</span></li>
        <li class="stages__item marks"><span class="stages__num mono">05</span><h3>Grasp</h3><p>Still hard. Geometry proposes; the gripper, the surface, and the physics dispose.</p><span class="badge"><i class="sq sq--warn"></i>Still hard</span></li>
        <li class="stages__item marks"><span class="stages__num mono">06</span><h3>Verify</h3><p>Still skipped. The camera that checks the robot's work is often worth more than the one that guides it.</p><span class="badge"><i class="sq sq--warn"></i>Still skipped</span></li>
      </ol>
      <div class="cols" style="margin-top:1.6rem">
        <div class="prose">
          <div class="fig mono" style="margin-bottom:1.2rem"><b>Fig. 01</b>The pipeline, in order. Typical industrial parts, as of September 2026.</div>

The practical consequence: in 2026 you should be training far fewer custom models than you were in 2023, and spending the savings on lighting, fixturing, calibration discipline, and verification. That's a less exciting sentence than “we fine-tuned a foundation model,” and it's where the reliability comes from.

### Which sensor, when

There is no best camera. There is the right one for your part, your cycle time, and your lighting, and the wrong one is usually the one that came with the robot.

        </div>
        <div class="callout"><span class="sq"></span><b>Bookmark this.</b> The table below is the one people come back for. The rule underneath it is simpler: bench-test the sensor on your actual parts, shiny ones included, before anyone signs a purchase order.</div>
      </div>
      <div class="spec-wrap" style="margin-top:1.2rem">
        <table class="spec">
          <thead><tr><th>Sensor</th><th>Pick this when</th><th>Watch out for</th></tr></thead>
          <tbody>
            <tr><td><strong>2D camera</strong></td><td>Presence, in-plane orientation, reading marks, checking the robot's work against a known datum.</td><td class="muted">No depth. Anything that needs height, tilt, or a stack.</td></tr>
            <tr><td><strong>Stereo</strong></td><td>General-purpose depth on textured parts at modest accuracy. Cheap, fast, forgiving.</td><td class="muted">Textureless, specular, or repetitive surfaces confuse the matcher.</td></tr>
            <tr><td><strong>Structured light</strong></td><td>Sub-millimetre depth on static or slow scenes: bin picking, inspection that borders on metrology.</td><td class="muted">Ambient light, shiny or transparent parts, motion blur.</td></tr>
            <tr><td><strong>Time-of-flight</strong></td><td>Fast, longer-range depth for navigation, safety zones, and coarse picking.</td><td class="muted">Multi-path errors near corners. Millimetres of accuracy, not tenths.</td></tr>
            <tr><td><strong>Line-scan</strong></td><td>Continuous inspection of moving webs, extrusions, and conveyors.</td><td class="muted">Needs constant motion and rock-steady encoder sync.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ===== 03 // Perception pipeline (the instrument) ===== -->
  <section class="section" id="lab">
    <div class="container">
      <p class="eyebrow mono">03 // Perception pipeline</p>
      <h2 class="section__title">Turn on every stage. Then ruin the lighting.<span class="muted">A synthetic bin of parts, drawn in ink. Toggle stages, watch latency accumulate.</span></h2>
      <div class="lab" id="visionLab">
        <div class="lab__stage stage" data-cursor="LOOK">
          <canvas id="visionCanvas" aria-hidden="true"></canvas>
          <div class="stage__hud mono" id="visionHud" aria-hidden="true"><span>Found <b id="vFound">—</b></span><span>Pose σ <b id="vSigma">—</b></span><span>Pipeline <b id="vMs">—</b></span><span>Budget <b id="vBudget">100 ms</b></span></div>
          <p class="stage__msg mono" id="visionMsg" hidden>Over budget. Something has to go, or something has to get faster. <a href="/embedded/">On-robot autonomy →</a></p>
          <p class="mono muted small stage__readout" id="visionReadout" aria-live="polite">Loading the bin…</p>
        </div>
        <div class="lab__controls">
          <div class="fig mono"><b>Fig. 02</b>Perception pipeline, interactive. Each stage adds an overlay and a cost.</div>
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
          <p class="muted small">Stage costs are illustrative defaults from typical embedded pipelines, not measurements of your system. Nothing you set here is stored, sent, or logged. The link in your address bar is the only copy.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== 04 // What we do ===== -->
  <section class="section" id="offer">
    <div class="container">
      <p class="eyebrow mono">04 // What we do</p>
      <h2 class="section__title">Four ways we make the robot see.<span class="muted">Boring is still the goal. A camera that works on Tuesday is boring.</span></h2>
      <div class="cards cards--4">
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">V-01</span><h3>Sensor &amp; lighting selection</h3><p>Bench test on your actual parts, including the shiny one you were hoping we wouldn't ask about.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>Bench test on your real parts, shiny ones included</li><li>Sensor shortlist with the trade-offs written down</li><li>Lighting design: geometry, wavelength, and the enclosure nobody budgeted</li><li>A go/no-go before anyone buys a camera</li></ul></div>
          </div>
        </article>
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">V-02</span><h3>Calibration &amp; drift monitoring</h3><p>Hand-eye and intrinsics, plus an automated check that tells you when it's moved before the crash does.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>Hand-eye and intrinsic procedure your technicians can repeat</li><li>Fixtures and targets that survive the shop floor</li><li>Automated drift check that flags a bumped mount</li><li>Recalibration runbook with pass/fail numbers</li></ul></div>
          </div>
        </article>
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">V-03</span><h3>Perception pipeline build</h3><p>Detect → segment → depth → pose → grasp → verify, with per-stage latency budgets and a documented failure taxonomy.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>Six stages wired into ROS 2, each one optional</li><li>Per-stage latency budget, measured at p99.9</li><li>Failure taxonomy: what breaks it, what it does when it breaks</li><li>Evaluation set from your parts, with a regression suite</li></ul></div>
          </div>
        </article>
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">V-04</span><h3>Verification systems</h3><p>Independent inspection of the robot's own work, with reject handling that doesn't stop the line.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>A second camera that checks the first one's work</li><li>Reject handling that doesn't stop the line</li><li>Metrics that page a human before the customer does</li><li>The audit trail your quality team will ask for anyway</li></ul></div>
          </div>
        </article>
      </div>
    </div>
  </section>
