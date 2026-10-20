---
title: Simulation & World Models — Big Sky Systems
description: Break it ten thousand times where it's free, then measure how much the simulator lied.
code: W-01
node: 4
eyebrow: Simulation &amp; world models // imagine
h1: Break it ten thousand times where it's free.
sub: Then find out how much the simulator lied to you. That second part is the job.
lede: Simulation stopped being a nice-to-have the moment policies started needing thousands of episodes. What's new is that “simulator” now means three quite different things, and picking the wrong one costs a quarter.
actions:
  - btn btn--primary | #calc | Measure the gap | GAUGE
  - btn | /#contact | Talk to a human | MAIL
placeholder: Ask about sim-to-real, world models, digital twins…
next_h2: Imagined. Now look again.
next_sub: The loop closes where it started: something has to see the part.
scripts: gap-meter
---

  <!-- ===== 01 // Transfer fidelity ===== -->
  <section class="section" id="honest">
    <div class="container">
      <p class="eyebrow mono">01 // Transfer fidelity</p>
      <h2 class="section__title">The gap is real, and it's task-shaped.<span class="muted">Sim transfers beautifully for some things and not at all for others.</span></h2>
      <div class="cols">
        <div class="prose">

**Know what transfers before you build.** Locomotion and rigid pick-and-place transfer well from simulation. Contact-rich assembly, deformable materials, and vacuum grip on dusty surfaces transfer poorly. Spending three months on a photorealistic digital twin for a contact-bottlenecked task solves a rendering problem while ignoring contact mechanics.

**Calibration beats rendering.** A modest physics environment with identified actuator dynamics, calibrated friction, and a paired sim-versus-real benchmark outperforms an uncalibrated photoreal scene every time.

        </div>
        <div>
          <div class="callout" style="margin-bottom:1rem"><span class="sq"></span><b>Bench rule:</b> a photorealistic render does not model seal stiction, cable drag, or a worn vacuum cup. Calibrate contact parameters against the physical cell before scaling episodes.</div>
          <div class="fig mono"><b>Field note</b><a href="/notes/the-simulator-lied.html">The simulator lied to you, and that's fine: reality gap as a measurable, task-shaped quantity →</a></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== 02 // What actually works ===== -->
  <section class="section" id="works">
    <div class="container">
      <p class="eyebrow mono">02 // What actually works</p>
      <h2 class="section__title">Three things are called “world models.” Only one of them is new.<span class="muted">Physics gets the budget. The other two get watched closely.</span></h2>
      <div class="plates">
        <article class="plate marks"><span class="card__num mono">W · 1</span><h3>Physics simulators</h3><p class="serif muted plate__sub">Where most of your budget belongs.</p><p>GPU-parallel rigid and deformable solvers (MuJoCo, Isaac Lab, Newton) stepping thousands of environments at once. Mature, fast, and responsible for nearly every sim-to-real policy running in production today.</p></article>
        <article class="plate marks"><span class="card__num mono">W · 2</span><h3>Video world models</h3><p class="serif muted plate__sub">Visual augmentation, not contact physics.</p><p>Generative models that synthesize plausible video rollouts from text or a seed frame. Useful for visual domain randomization and rare-event synthesis, but predicting pixels does not predict contact forces.</p></article>
        <article class="plate marks"><span class="card__num mono">W · 3</span><h3>Latent world models</h3><p class="serif muted plate__sub">Learned dynamics for planning.</p><p>Models that learn compact state transitions so a policy can plan ahead in latent space. Promising for sample efficiency and counterfactual planning; still early for sub-millimeter industrial manipulation.</p></article>
      </div>
      <div class="cols" style="margin-top:1.6rem">
        <div class="prose">

**Your CAD is not a simulation asset.** Stepping a mechanical assembly at speed requires mesh decimation, convex decomposition, calibrated inertia tensors, and non-default contact materials. For existing cells, we often combine CAD collision geometry with 3D Gaussian splatting from cell photographs—capturing the cable trays and guarding that never made it into CAD.

        </div>
        <div class="callout"><span class="sq"></span><b>Solver choice:</b> pick between MuJoCo, Isaac Lab, Gazebo, and Newton based on the contact regime you have to transfer, then measure sim-to-real correlation on every policy checkpoint.</div>
      </div>
    </div>
  </section>

  <!-- ===== 03 // Reality-gap meter ===== -->
  <section class="section" id="calc">
    <div class="container">
      <p class="eyebrow mono">03 // Reality-gap meter</p>
      <h2 class="section__title">How much of this transfers from simulation?<span class="muted">A band, not a point. Our read of the published evidence and the physics.</span></h2>
      <div class="gap" id="gapMeter">
        <div class="quiz__panel gap__panel">
          <div class="quiz__progress mono">Task type</div>
          <div class="quiz__opts" id="gapOpts" role="group" aria-label="Task type"></div>
          <div class="gap__mods" role="group" aria-label="Modifiers">
            <label class="check"><input type="checkbox" id="gmShiny" /> <span>Parts are shiny or transparent</span></label>
            <label class="check"><input type="checkbox" id="gmTol" /> <span>Tolerances under 0.5 mm</span></label>
            <label class="check"><input type="checkbox" id="gmEnv" /> <span>Environment changes between runs</span></label>
            <label class="check"><input type="checkbox" id="gmSysid" /> <span>You already have a validated system-identification pass</span></label>
          </div>
        </div>
        <div class="gap__result">
          <div class="gauge" aria-live="polite">
            <svg viewBox="0 0 200 120" class="gauge__svg" aria-hidden="true">
              <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--line-strong)" stroke-width="10"/>
              <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--accent)" stroke-width="10" stroke-dasharray="0 251.3" stroke-dashoffset="0" id="gaugeArc"/>
              <g stroke="var(--ink)" stroke-width="1.5">
                <path d="M20 100 L28 100"/><path d="M31.7 60 L38.6 64"/><path d="M60 31.7 L64 38.6"/><path d="M100 20 L100 28"/><path d="M140 31.7 L136 38.6"/><path d="M168.3 60 L161.4 64"/><path d="M180 100 L172 100"/>
              </g>
              <g id="gaugeNeedle" style="transform-origin:100px 100px">
                <path d="M100 100 L100 30" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="square"/>
                <rect x="95" y="95" width="10" height="10" fill="var(--ink)"/>
              </g>
              <text x="16" y="118" class="gauge__tick">0</text>
              <text x="170" y="118" class="gauge__tick">100</text>
            </svg>
            <div class="gauge__value"><b id="gaugeValue">—</b><span class="mono">% sim can do</span></div>
          </div>
          <div class="stats gap__stats">
            <div class="stat"><span class="mono">Recommended split</span><b id="gmSplit">—</b></div>
            <div class="stat stat--wide"><span class="mono">What closes the gap</span><ul class="list" id="gmCloses"></ul></div>
            <div class="stat stat--wide"><span class="mono">What sim will not fix</span><p id="gmWont">—</p></div>
          </div>
          <p class="mono muted small" id="gmReadout" aria-live="polite" hidden></p>
          <div class="lab__actions" style="margin-top:1rem">
            <button class="btn btn--small" id="gmEmail" type="button" data-cursor="SEND">Email me this read</button>
            <button class="btn btn--small btn--ghost" id="gmReset" type="button">Reset</button>
          </div>
          <p class="muted small" style="margin-top:1rem">Transfer bands reflect published benchmarks and contact mechanics as of September 2026. State stays in the URL.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== 04 // What we do ===== -->
  <section class="section" id="offer">
    <div class="container">
      <p class="eyebrow mono">04 // What we do</p>
      <h2 class="section__title">Four things, measured against the real cell.<span class="muted">A modest simulator you have calibrated and measured beats a photorealistic one you take on faith.</span></h2>
      <div class="cards cards--4">
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">W-01</span><h3>Sim environment build</h3><p>From your CAD or scanned from your actual cell, with an asset pipeline that survives the next revision.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>Collision-ready assets from CAD or a splat of the real cell</li><li>An asset pipeline that re-runs when the design changes</li><li>Engine choice justified by what has to transfer</li><li>Masses, inertias, and materials that aren't defaults</li></ul></div>
          </div>
        </article>
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">W-02</span><h3>Randomization &amp; sys-ID</h3><p>A documented plan for what varies in training and a measured match between simulated and real dynamics.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>Domain-randomization plan with ranges and reasons</li><li>System-identification pass on the real actuators and contacts</li><li>A written match between sim and real dynamics, with error bars</li><li>The list of things we couldn't match, so nobody pretends</li></ul></div>
          </div>
        </article>
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">W-03</span><h3>Sim-to-real harness</h3><p>The same task, scored the same way, in both places, tracked over time, so “the gap” is a number and not a feeling.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>Identical task definitions and scoring in sim and on the cell</li><li>A transfer number per task, tracked across versions</li><li>Alerts when the gap widens after a change</li><li>A reason to trust the simulator, written down</li></ul></div>
          </div>
        </article>
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">W-04</span><h3>Rare-event coverage</h3><p>The failure cases you can't safely stage on a real line, generated and tested where they're free.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>A scenario catalog built from your incident log and failure modes</li><li>Rare events generated in sim, tested on every policy</li><li>Coverage metrics, so “we tested it” means something</li><li>The short list to stage for real, with a safety plan</li></ul></div>
          </div>
        </article>
      </div>
    </div>
  </section>
