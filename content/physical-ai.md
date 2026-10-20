---
title: Physical AI — Big Sky Systems
description: Practical Physical AI engineering: task triage, teleoperation rigs, demonstration collection, closed-loop policy evaluation, and ISO 10218:2025 safety interlocks.
code: P-01
node: none
eyebrow: Physical AI // the hub
h1: Physical AI, minus the demo reel.
sub: Task triage, teleoperation rigs, closed-loop policy evaluation, and safety-rated interlocks.
lede: Learned policies are the biggest shift in robotics in thirty years, and they are routinely sold four years ahead of factory reality. We help you pick the tasks where a learned policy beats a mechanical fixture, size the demonstration budget, and build the evaluation and safety harness that gets it onto the line.
actions:
  - btn btn--primary | #offer | See deliverables | WORK
  - btn | #calc | Estimate demo cost | COUNT
  - btn | /#contact | Talk to a human | MAIL
placeholder: Ask how many demos, or whether you need AI at all…
next_h2: Pick a station.
next_sub: The hub is the argument. The stations are the work.
scripts: calc-demos
---

  <!-- ===== 01 // What we deliver ===== -->
  <section class="section" id="offer">
    <div class="container">
      <p class="eyebrow mono">01 // What we deliver</p>
      <h2 class="section__title">Four engagements when a learned policy is right.<span class="muted">And an honest mechanical fixture recommendation when it isn't.</span></h2>
      <div class="cards cards--4">
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">P-01 // FEASIBILITY &amp; ROI</span><h3>Task triage</h3><p>We score your candidate tasks on part variation, contact complexity, cycle time, and demonstration cost before you commit a year.</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>Every candidate task scored on variation, tolerance, and payback</li><li>The fixture-first list: tasks cheaper to solve with hard automation</li><li>The learned-policy shortlist with a demonstration &amp; compute budget</li><li>Architecture recommendation (VLA fine-tune, diffusion policy, or classical)</li></ul></div>
          </div>
        </article>
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">P-02 // COLLECTION &amp; QC</span><h3>Data &amp; teleop rigs</h3><p>Leader-follower or VR teleoperation rigs, operator collection protocols, and automated per-episode quality control.</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>Teleop rig matched to your manipulator and gripper kinematics</li><li>Operator collection protocol with usable-take rate tracking</li><li>Automated per-episode QC that rejects stalls and bad trajectories</li><li>Versioned LeRobot / RLDS episode schema with full provenance</li></ul></div>
          </div>
        </article>
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">P-03 // BAKE-OFFS &amp; BENCHMARKS</span><h3>Evaluation harness</h3><p>Closed-loop bench testing with confidence intervals, out-of-distribution probes, and model-agnostic bake-offs.</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>Statistically powered success-rate benchmarks on your real parts</li><li>Out-of-distribution test pass (lighting shifts, novel poses, distractors)</li><li>Automated regression suite for new checkpoints and quantized builds</li><li>Head-to-head bake-off across open-weight and vendor policies</li></ul></div>
          </div>
        </article>
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">P-04 // SAFETY ARCHITECTURE</span><h3>Fallbacks &amp; interlocks</h3><p>Deterministic hardware safety envelopes and recovery states around learned policies, aligned with ISO 10218:2025 and EU 2023/1230.</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>Hardware-rated safety envelope independent of neural network weights</li><li>Policy uncertainty thresholds and deterministic recovery states</li><li>Compliance mapping for ISO 10218:2025 and EU Machinery Reg 2023/1230</li><li>Safety validation test report ready for your assessor</li></ul></div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- ===== 02 // Decision guide ===== -->
  <section class="section" id="works">
    <div class="container">
      <p class="eyebrow mono">02 // Triage &amp; field numbers</p>
      <h2 class="section__title">Where a learned policy earns its place.<span class="muted">And where a mechanical fixture and a limit switch still win.</span></h2>

| A learned policy is probably right | A fixture is probably right |
|---|---|
| High part variation you can't fixture away | Same part, same pose, every cycle |
| Contact-rich assembly with tolerance for feel | Position-repeatable moves inside 0.1 mm |
| Deformables: cloth, cable, foam, food | Rigid parts arriving on a known datum |
| Long tail of variants that would need 40 programs | Four variants and a tool changer |
| You already have a data pipeline and evaluation | You have neither, and a deadline |

      <div class="plates" style="margin-top:1.4rem">
        <article class="plate marks"><span class="card__num mono">50 – 200 DEMOS / TASK</span><h3>Demonstration cost</h3><p>Imitation-learning policies need 50–200 clean teleoperated episodes per task variant. A 20-task cell means 1,000–4,000 episodes plus QC.</p></article>
        <article class="plate marks"><span class="card__num mono">95% – 99% UPTIME</span><h3>The production gap</h3><p>Factory lines expect shift-long reliability. Closing the gap between an 85% demo reel and a 99% cell is fixturing, verification, and recovery logic.</p></article>
        <article class="plate marks"><span class="card__num mono">ISO 10218:2025 &amp; EU 2023/1230</span><h3>AI in safety functions</h3><p>Keep learned policies inside a deterministic, hardware-rated safety envelope so model updates don't trigger high-risk recertification.</p></article>
      </div>
    </div>
  </section>

  <!-- ===== 03 // Demonstration budget calculator ===== -->
  <section class="section" id="calc">
    <div class="container">
      <p class="eyebrow mono">03 // Interactive demonstration calculator</p>
      <h2 class="section__title">Estimate your demonstration budget.<span class="muted">Size the teleop hours, calendar weeks, and operator budget before starting collection.</span></h2>
      <div class="calc" id="demoCalc">
        <div class="calc__inputs plate">
          <div class="fig mono" style="margin-bottom:1rem"><b>Fig. 01</b>Adjust task count, variants, and usable take rate to size your collection campaign.</div>
          <div class="calc__grid">
            <label class="range"><span class="mono">Distinct tasks</span><input type="range" id="dTasks" min="1" max="40" value="8" data-out="dTasksOut" /><output id="dTasksOut" class="mono">8</output></label>
            <label class="range"><span class="mono">Variants per task</span><input type="range" id="dVariants" min="1" max="10" value="3" data-out="dVariantsOut" /><output id="dVariantsOut" class="mono">3</output></label>
            <label class="range"><span class="mono">Demos per variant</span><input type="range" id="dDemos" min="50" max="200" step="5" value="100" data-out="dDemosOut" /><output id="dDemosOut" class="mono">100</output></label>
            <label class="range"><span class="mono">Minutes per demo</span><input type="range" id="dMinutes" min="1" max="15" value="4" data-out="dMinutesOut" /><output id="dMinutesOut" class="mono">4</output></label>
            <label class="range"><span class="mono">Usable-take rate</span><input type="range" id="dTake" min="50" max="95" value="70" data-out="dTakeOut" /><output id="dTakeOut" class="mono">70%</output></label>
            <label class="range"><span class="mono">Operators</span><input type="range" id="dOps" min="1" max="10" value="2" data-out="dOpsOut" /><output id="dOpsOut" class="mono">2</output></label>
            <label class="calc__num"><span class="mono">Loaded operator cost, $/hr</span><input type="number" id="dRate" min="10" max="500" step="5" value="45" /></label>
          </div>
          <span class="mono muted" style="display:block;margin:1rem 0 .4rem">Task family</span>
          <div class="seg" role="group" aria-label="Task family" id="dFamily">
            <button class="seg__btn is-active" data-family="rigid" type="button">Rigid pick</button>
            <button class="seg__btn" data-family="contact" type="button">Contact-rich</button>
            <button class="seg__btn" data-family="deform" type="button">Deformables</button>
          </div>
          <div class="calc__toggles">
            <label class="check"><input type="checkbox" id="dSim" /> <span>Augment with simulation</span><small class="mono" id="dSimNote">−60% real demos, +sim build</small></label>
            <label class="check"><input type="checkbox" id="dEval" checked /> <span>Include evaluation passes</span><small class="mono">15% held out × 4 iterations</small></label>
          </div>
        </div>
        <div class="calc__outputs">
          <div class="stats">
            <div class="stat"><span class="mono">Demonstrations</span><b id="oDemos">—</b></div>
            <div class="stat"><span class="mono">Teleop hours</span><b id="oHours">—</b></div>
            <div class="stat"><span class="mono">Calendar weeks</span><b id="oWeeks">—</b></div>
            <div class="stat"><span class="mono">Operator cost</span><b id="oCost">—</b></div>
            <div class="stat" id="oEvalRow"><span class="mono">Evaluation episodes</span><b id="oEval">—</b></div>
            <div class="stat" id="oSimRow" hidden><span class="mono">Sim build</span><b id="oSim">—</b></div>
            <div class="stat stat--wide"><span class="mono">SKY-1 says</span><p id="oVerdict" aria-live="polite">—</p></div>
          </div>
          <p class="mono muted small" id="dReadout" aria-live="polite" hidden></p>
          <div class="lab__actions" style="margin-top:1rem">
            <button class="btn btn--small" id="dEmail" type="button" data-cursor="SEND">Email me this estimate</button>
            <button class="btn btn--small btn--ghost" id="dReset" type="button">Reset</button>
          </div>
          <p class="muted small" style="margin-top:1rem">First-order scaling estimate assuming 30 productive teleop hours/week per operator. State stays in the URL.</p>
        </div>
      </div>
    </div>
  </section>
