---
title: On-Robot Autonomy — Big Sky Systems
description: Autonomy is a latency budget with a power budget stapled to it. Compute selection, optimization, and real-time architecture.
code: E-01
node: 1
eyebrow: On-robot autonomy // decide
h1: Ten milliseconds is not a lot of milliseconds.
sub: Everything interesting about on-robot AI is a fight over a very small number.
lede: A model that answers in two seconds is a chatbot. A model that answers inside your control period is a controller. The engineering between those two sentences is most of what we do on this page.
actions:
  - btn btn--primary | #lab | Build a budget | BUILD
  - btn | /#contact | Talk to a human | MAIL
placeholder: Ask about latency, Jetson-class compute, quantization, RT kernels…
next_h2: Decided. Now move.
next_sub: The policy answered in time. The cell is where it has to be right.
scripts: calc-latency
---

  <!-- ===== 01 // The honest version ===== -->
  <section class="section" id="honest">
    <div class="container">
      <p class="eyebrow mono">01 // The honest version</p>
      <h2 class="section__title">Your average latency is a lie.<span class="muted">The number that breaks robots is p99.9.</span></h2>
      <div class="cols">
        <div class="prose">

Every inference benchmark you will be shown is a mean. Robots are broken by tails. A perception stack that runs in 20 ms on average and 140 ms once every few thousand frames will pass every test you write and then put a gripper through a fixture on the second shift.

Measure the tail. Budget for the tail. Design the fallback for the tail. If the policy can't answer in time, the correct behaviour is a defined, safe, boring one (hold position, re-approach, ask a human), and that behaviour has to be proven, not assumed.

The second lie is thermal. Every compute module has a headline TOPS number and a power range, and the headline number assumes cooling you do not have inside a sealed arm on a summer afternoon. Size for the sustained clock, not the datasheet.

        </div>
        <div class="callout"><span class="sq"></span><b>SKY-1 says:</b> measure the tail, budget for the tail, design the fallback for the tail. I'd embroider it on something if I had hands.</div>
      </div>
    </div>
  </section>

  <!-- ===== 02 // What actually works ===== -->
  <section class="section" id="works">
    <div class="container">
      <p class="eyebrow mono">02 // What actually works</p>
      <h2 class="section__title">The budget, stage by stage.<span class="muted">Sense, preprocess, infer, postprocess, actuate. Everything has to fit.</span></h2>
      <div class="spec-wrap">
        <table class="spec">
          <thead><tr><th>Control rate</th><th>Period</th><th>What fits</th></tr></thead>
          <tbody>
            <tr><td class="n">1000 Hz</td><td class="mono muted">1 ms</td><td>Joint servo loop. Nothing learned runs here. Ever.</td></tr>
            <tr><td class="n">100 Hz</td><td class="mono muted">10 ms</td><td>Reactive control, force response, small distilled policies.</td></tr>
            <tr><td class="n">30 Hz</td><td class="mono muted">33 ms</td><td>Visuomotor policies, most manipulation control loops.</td></tr>
            <tr><td class="n">10 Hz</td><td class="mono muted">100 ms</td><td>Perception-heavy planning, VLA-class policies, re-grasp decisions.</td></tr>
            <tr><td class="n">&lt; 1 Hz</td><td class="mono muted">&gt; 1 s</td><td>Task planning, language reasoning, anything that can wait.</td></tr>
          </tbody>
        </table>
      </div>
      <div class="cols" style="margin-top:1.6rem">
        <div class="prose">
          <div class="fig mono" style="margin-bottom:1.2rem"><b>Fig. 01</b>Control rates and what fits inside them. Standard practice, not a citation.</div>

The architecture follows from that table and not from a vendor's block diagram. Anything inside the control loop runs on the robot. Anything that can tolerate a second of delay and a lost network can go to the cloud. There is no third category, and “we'll just put it in the cloud and it'll be fine” is how you learn what your Wi-Fi does when a forklift passes.

### Making it fit

Quantization is the biggest lever and the most abused one. Dropping precision routinely buys large speedups, and it *changes the model's behaviour*. Not “slightly reduces accuracy” in the abstract. It changes which grasps it picks, on which parts, under which lighting.

So the rule is simple and non-negotiable: **the quantized model is a different model, and it gets the full evaluation suite.** Every time. If that sounds expensive, note that it's exactly why the evaluation harness on the Physical AI page is the deliverable and the model is a detail.

### Determinism

A GPU in the loop makes “real-time” a spectrum, and the difference between soft and hard real-time is the difference between “usually on time” and “provably on time.” Most of what closes that gap is boring configuration, done once and documented:

- RT-patched kernel, with the latency actually measured under load
- CPU core isolation and affinity, so the control thread never waits for a browser tab
- IRQ pinning, so the camera driver's interrupts land where you put them
- ROS 2 DDS and QoS configuration that matches the loop, and is written down
- Memory locking and a startup that has already paged everything in

        </div>
        <div>
          <div class="callout" style="margin-bottom:1rem"><span class="sq"></span><b>Two categories.</b> On the robot: anything inside the control loop. In the cloud: anything that can wait a second and survive a dropped network. If a thing doesn't fit either description, it isn't designed yet.</div>
          <div class="callout"><span class="sq"></span><b>Distillation, not hope.</b> Nothing learned runs at a kilohertz and very little runs at a hundred hertz. If the loop is fast, the policy is small, and the big model's job is to teach it.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== 03 // Latency budget builder (the instrument) ===== -->
  <section class="section" id="lab">
    <div class="container">
      <p class="eyebrow mono">03 // Latency budget builder</p>
      <h2 class="section__title">Fill the period. Watch it overflow.<span class="muted">One bar is your control period. Everything you turn on has to fit before the deadline.</span></h2>
      <div class="budget" id="latencyCalc">
        <div class="budget__panel">
          <div class="budget__head">
            <span class="mono muted">Control period</span>
            <span class="budget__readout" id="lbReadout" aria-live="polite">—</span>
          </div>
          <div class="budget__ticks mono" id="lbTicks" aria-hidden="true"></div>
          <div class="budget__bar" id="lbBar" aria-hidden="true"></div>
          <div class="budget__scale mono" id="lbScale" aria-hidden="true"></div>
          <p class="budget__warn mono" id="lbWarn" hidden></p>
          <div class="budget__stages" id="lbStages" role="group" aria-label="Pipeline stages and their cost in milliseconds"></div>
          <div class="fig mono" style="margin-top:1.1rem"><b>Fig. 02</b>Latency budget, drawn to scale. Hatched = p99.9 tail. Red hatch = past the deadline.</div>
        </div>
        <div class="lab__controls">
          <span class="mono muted">Control rate</span>
          <div class="seg" role="group" aria-label="Control rate" id="lbRate">
            <button class="seg__btn" data-rate="100" type="button">100 Hz</button>
            <button class="seg__btn" data-rate="30" type="button">30 Hz</button>
            <button class="seg__btn is-active" data-rate="10" type="button">10 Hz</button>
            <button class="seg__btn" data-rate="1" type="button">1 Hz</button>
          </div>
          <span class="mono muted">Precision</span>
          <div class="seg" role="group" aria-label="Inference precision" id="lbPrec">
            <button class="seg__btn is-active" data-prec="fp16" type="button">FP16</button>
            <button class="seg__btn" data-prec="int8" type="button">INT8</button>
            <button class="seg__btn" data-prec="fp4" type="button">FP4</button>
          </div>
          <label class="check"><input type="checkbox" id="lbTail" /> <span>Show p99.9</span><small class="mono">tails ×1.6</small></label>
          <div class="stat stat--wide"><span class="mono">SKY-1 says</span><p id="lbVerdict">—</p></div>
          <div class="lab__actions">
            <button class="btn btn--small" id="lbEmail" type="button" data-cursor="SEND">Email this budget</button>
            <button class="btn btn--small btn--ghost" id="lbReset" type="button">Reset</button>
          </div>
          <p class="muted small">Stage costs are illustrative defaults from typical embedded pipelines, not measurements of your system. The precision factors are illustrative too. The only latency number that matters is the one you measured on your hardware, with your model, under load, at the ninety-ninth-point-nine percentile. Nothing here is stored or sent.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== 04 // What we do ===== -->
  <section class="section" id="offer">
    <div class="container">
      <p class="eyebrow mono">04 // What we do</p>
      <h2 class="section__title">Four ways we make it answer in time.<span class="muted">A controller, not a suggestion.</span></h2>
      <div class="cards cards--4">
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">E-01</span><h3>Compute selection</h3><p>Sized against a measured latency and thermal budget, not a TOPS number, including the boring question of what it does at 45°C.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>Candidate modules benchmarked with your model, under load, in the enclosure</li><li>Sustained-clock numbers, not datasheet peaks</li><li>Thermal plan: airflow, throttling behaviour, and the summer afternoon</li><li>A shortlist with the power budget written on it</li></ul></div>
          </div>
        </article>
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">E-02</span><h3>Model optimization</h3><p>Quantization, fusion, distillation, and compiled runtimes, each followed by a full re-evaluation rather than a vibe.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>Quantization and kernel fusion with the speedup measured, not quoted</li><li>Distilled or pruned variants for the loop rate you actually need</li><li>Compiled runtime pipeline that rebuilds from a script</li><li>The full evaluation suite re-run on every variant. Every time.</li></ul></div>
          </div>
        </article>
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">E-03</span><h3>Real-time architecture</h3><p>RT kernel, core isolation, IRQ affinity, ROS 2 QoS profiles, and a measured p99.9 you can put in a document.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>RT-patched kernel, isolated cores, pinned interrupts</li><li>ROS 2 DDS and QoS profiles tuned to the loop, and documented</li><li>Memory locking and a startup that doesn't page</li><li>A p99.9 latency figure, measured under load, in writing</li></ul></div>
          </div>
        </article>
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">E-04</span><h3>Degradation design</h3><p>Defined behaviour when the policy is late or uncertain, validated to the same standard as the e-stop.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>A late-answer policy: hold, re-approach, or ask a human</li><li>Uncertainty thresholds that trigger it, tested on purpose</li><li>Fault injection: dropped frames, a stalled GPU, an unplugged network</li><li>Evidence that the fallback holds up, written for the safety file</li></ul></div>
          </div>
        </article>
      </div>
    </div>
  </section>
