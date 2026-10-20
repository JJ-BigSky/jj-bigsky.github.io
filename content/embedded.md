---
title: On-Robot Autonomy — Big Sky Systems
description: Real-time on-robot inference within strict control-loop and thermal budgets. Compute selection, model quantization, and RT Linux architecture.
code: E-01
node: 1
eyebrow: On-robot autonomy // decide
h1: Ten milliseconds is not a lot of milliseconds.
sub: Compute sizing, model quantization, RT Linux kernels, and deterministic fallbacks that hold their deadline under load.
lede: On-robot inference has to finish inside the control period every cycle, at sustained thermal equilibrium, without starving the servo loop. We benchmark embedded compute, quantize policies with full closed-loop re-validation, and lock down the real-time stack.
actions:
  - btn btn--primary | #offer | See deliverables | WORK
  - btn | #lab | Build a latency budget | BUILD
  - btn | /#contact | Talk to a human | MAIL
placeholder: Ask about latency, Jetson-class compute, quantization, RT kernels…
next_h2: Decided. Now move.
next_sub: The policy answered in time. The cell is where it has to be right.
scripts: calc-latency
---

  <!-- ===== 01 // What we deliver ===== -->
  <section class="section" id="offer">
    <div class="container">
      <p class="eyebrow mono">01 // What we deliver</p>
      <h2 class="section__title">Four ways we make it answer in time.<span class="muted">Sustained thermal benchmarks, quantized runtimes, RT Linux, and fault-injected fallbacks.</span></h2>
      <div class="cards cards--4">
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">E-01 // SILICON &amp; THERMALS</span><h3>Compute selection</h3><p>Sized against a measured p99.9 latency and thermal budget inside a 45 °C sealed enclosure, not a datasheet TOPS peak.</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>Candidate modules benchmarked with your model under thermal load</li><li>Sustained-clock measurements vs. throttling thresholds</li><li>Enclosure thermal plan: conduction, airflow, and power budget</li><li>Hardware BOM recommendation with lifecycle and supply notes</li></ul></div>
          </div>
        </article>
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">E-02 // TENSORRT &amp; QUANTIZATION</span><h3>Model optimization</h3><p>Quantization (INT8/FP8/FP4), layer fusion, distillation, and compiled runtimes—re-validated on your closed-loop task benchmark.</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>Compiled TensorRT / ONNX Runtime pipeline that builds from script</li><li>Distilled or quantized policy variants matched to your control rate</li><li>Full closed-loop evaluation suite run on every precision drop</li><li>Side-by-side latency vs. task-success trade-off table</li></ul></div>
          </div>
        </article>
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">E-03 // HARD REAL-TIME STACK</span><h3>Real-time architecture</h3><p>PREEMPT_RT kernel, CPU core isolation, IRQ pinning, and ROS 2 DDS/QoS profiles with a measured p99.9 jitter report.</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>RT-patched Linux image with isolated servo and inference cores</li><li>Pinned camera/NIC interrupts and locked memory (<code>mlockall</code>)</li><li>Documented ROS 2 DDS and QoS configuration tuned to the loop</li><li>Measured 24-hour p99.9 latency and jitter report under load</li></ul></div>
          </div>
        </article>
        <article class="card">
          <div class="card__inner">
            <div class="card__face card__front"><span class="card__num mono">E-04 // SAFE RECOVERY</span><h3>Degradation design</h3><p>Deterministic controller behavior when a policy frame is late or uncertain, proven under fault injection.</p></div>
            <div class="card__face card__back"><h4>Deliverables</h4><ul><li>Deterministic late-frame state machine (hold, re-approach, handoff)</li><li>Out-of-distribution and confidence thresholds tested on hardware</li><li>Fault-injection test pass (dropped camera frames, GPU stall, net loss)</li><li>Safety-file evidence package for your compliance review</li></ul></div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- ===== 02 // Architecture & control rates ===== -->
  <section class="section" id="works">
    <div class="container">
      <p class="eyebrow mono">02 // Control-rate architecture</p>
      <h2 class="section__title">What fits inside each control period.<span class="muted">Average latency is a marketing number. Robots crash on the p99.9 tail.</span></h2>
      <div class="spec-wrap">
        <table class="spec">
          <thead><tr><th>Control rate</th><th>Period</th><th>What fits on the robot</th></tr></thead>
          <tbody>
            <tr><td class="n">1000 Hz</td><td class="mono muted">1 ms</td><td>Joint servo and torque loop. Classical control only—nothing learned runs here.</td></tr>
            <tr><td class="n">100 Hz</td><td class="mono muted">10 ms</td><td>Reactive force/impedance control and small distilled MLP/diffusion heads.</td></tr>
            <tr><td class="n">30 Hz</td><td class="mono muted">33 ms</td><td>Compiled visuomotor policies and standard manipulation control loops.</td></tr>
            <tr><td class="n">10 Hz</td><td class="mono muted">100 ms</td><td>Multi-camera 3D perception, VLA action chunking, and re-grasp planning.</td></tr>
            <tr><td class="n">&lt; 1 Hz</td><td class="mono muted">&gt; 1 s</td><td>High-level task planning and language reasoning (safe to run off-robot).</td></tr>
          </tbody>
        </table>
      </div>
      <div class="cols" style="margin-top:1.6rem">
        <div class="prose">
          <p><strong>A quantized model is a different policy.</strong> Dropping precision from FP16 to INT8 or FP4 buys 2×–4× speedups, but alters decision boundaries on edge-case grasps. Every quantized build must pass the full closed-loop evaluation harness before touching the line.</p>
        </div>
        <div class="callout"><span class="sq"></span><b>Design rule:</b> benchmark p99.9 latency under sustained 45 °C enclosure load, and verify the late-frame fallback under fault injection.</div>
      </div>
    </div>
  </section>

  <!-- ===== 03 // Latency budget builder (the instrument) ===== -->
  <section class="section" id="lab">
    <div class="container">
      <p class="eyebrow mono">03 // Interactive latency calculator</p>
      <h2 class="section__title">Build your control-loop budget.<span class="muted">Select your control rate, precision, and p99.9 tail multiplier to see what fits before the deadline.</span></h2>
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
          <div class="fig mono" style="margin-top:1.1rem"><b>Fig. 01</b>Latency budget, drawn to scale. Hatched = p99.9 tail. Red hatch = past the deadline.</div>
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
          <p class="muted small">Illustrative stage costs and precision multipliers. Nothing is stored or sent.</p>
        </div>
      </div>
    </div>
  </section>
