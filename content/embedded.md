---
title: On-Robot Autonomy — Big Sky Systems
description: Real-time on-robot inference within strict control-loop and thermal budgets. Compute selection, model quantization, and RT Linux architecture.
code: E-01
node: 1
eyebrow: On-robot autonomy // decide
h1: Ten milliseconds is not a lot of milliseconds.
sub: Everything interesting about on-robot AI is a fight over a very small number.
lede: On-robot inference has to finish inside the control period every cycle, at sustained thermal load, without starving the real-time servo thread. We size compute, quantize policies, and configure the real-time stack so the loop holds its deadline.
actions:
  - btn btn--primary | #lab | Build a budget | BUILD
  - btn | /#contact | Talk to a human | MAIL
placeholder: Ask about latency, Jetson-class compute, quantization, RT kernels…
next_h2: Decided. Now move.
next_sub: The policy answered in time. The cell is where it has to be right.
scripts: calc-latency
---

  <!-- ===== 01 // Tail latency & thermals ===== -->
  <section class="section" id="honest">
    <div class="container">
      <p class="eyebrow mono">01 // Tail latency &amp; thermals</p>
      <h2 class="section__title">Your average latency is a lie.<span class="muted">The number that breaks robots is p99.9.</span></h2>
      <div class="cols">
        <div class="prose">

**Design for the p99.9 tail.** A perception or policy stack that runs in 20 ms on average and 140 ms once every few thousand frames will pass bench tests and put a gripper through a fixture in production. If the policy misses its deadline, the controller must execute a deterministic fallback (hold position, re-approach, or hand off to an operator) proven under fault injection.

**Size for sustained thermal load.** Datasheet TOPS numbers assume open-bench airflow you do not have inside a sealed IP65 enclosure at 45 °C ambient. Benchmark your actual model at sustained thermal equilibrium before picking the compute module.

        </div>
        <div class="callout"><span class="sq"></span><b>Design rule:</b> measure the p99.9 tail under sustained thermal load, budget your control period around that figure, and verify the late-frame fallback on the bench.</div>
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
          <div class="fig mono" style="margin-bottom:1.1rem"><b>Fig. 01</b>Anything inside the control loop runs on the robot. Anything that can tolerate a 1 s delay and a dropped network can go to the cloud.</div>

### Quantization &amp; OS determinism

Dropping precision (FP16 → INT8 / FP4) buys major speedups, but it changes which grasps a policy picks under marginal lighting. **A quantized model is a new model and gets the full closed-loop evaluation suite.**

Closing the gap between “usually on time” and “provably on time” requires explicit system configuration: an RT-patched kernel, isolated CPU cores for the servo thread, pinned camera IRQs, tuned ROS 2 DDS/QoS profiles, and locked memory (<code>mlockall</code>) at startup.

        </div>
        <div class="callout"><span class="sq"></span><b>Distillation over hope.</b> Nothing learned runs at 1 kHz and very little runs at 100 Hz. When the loop is fast, distill a small policy from the foundation model and lock the OS thread around it.</div>
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
          <p class="muted small">Illustrative stage costs and precision multipliers. State stays in the URL.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== 04 // What we do ===== -->
  <section class="section" id="offer">
    <div class="container">
      <p class="eyebrow mono">04 // What we do</p>
      <h2 class="section__title">Four ways we make it answer in time.<span class="muted">Sustained thermal benchmarks, quantized runtimes, RT Linux, and fault-injected fallbacks.</span></h2>
      <div class="cards cards--4">
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">E-01</span><h3>Compute selection</h3><p>Sized against a measured latency and thermal budget, not a datasheet TOPS peak, including sustained clock behavior at 45 °C enclosure ambient.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>Candidate modules benchmarked with your model, under load, in the enclosure</li><li>Sustained-clock numbers, not datasheet peaks</li><li>Thermal plan: airflow, throttling behavior, and enclosure heat dissipation</li><li>A shortlist with the power budget written on it</li></ul></div>
          </div>
        </article>
        <article class="card tilt" tabindex="0" data-cursor="FLIP">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">E-02</span><h3>Model optimization</h3><p>Quantization, layer fusion, distillation, and compiled runtimes, each verified against your full closed-loop evaluation suite.</p><span class="card__hint mono">Tap to flip</span></div>
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
            <div class="card__face card__front"><span class="card__num mono">E-04</span><h3>Degradation design</h3><p>Defined behavior when the policy is late or uncertain, validated to the same standard as the e-stop.</p><span class="card__hint mono">Tap to flip</span></div>
            <div class="card__face card__back"><h4>You get</h4><ul><li>A late-answer policy: hold, re-approach, or ask a human</li><li>Uncertainty thresholds that trigger it, tested on purpose</li><li>Fault injection: dropped frames, a stalled GPU, an unplugged network</li><li>Evidence that the fallback holds up, written for the safety file</li></ul></div>
          </div>
        </article>
      </div>
    </div>
  </section>
