/* Latency budget builder: one bar is the control period, the pipeline's stages
   stack left to right, and whatever crosses the deadline is drawn as the problem
   it is. Illustrative defaults; the URL carries the state; nothing is sent. */
(function () {
  const root = document.getElementById("latencyCalc");
  if (!root) return;
  const $ = (id) => document.getElementById(id);
  const K = window.BSS_CALC, S = () => window.BSS_SOUND, M = () => window.BSS_MASCOT;
  const STAGES = [
    { id: "cam", name: "Camera exposure + readout", ms: 8 },
    { id: "bus", name: "Transport / driver", ms: 3 },
    { id: "pre", name: "Preprocess (undistort, resize, normalize)", ms: 4 },
    { id: "perc", name: "Perception inference", ms: 25, infer: true },
    { id: "pol", name: "Policy inference", ms: 30, infer: true },
    { id: "post", name: "Postprocess + safety check", ms: 5 },
    { id: "cmd", name: "Command transport to controller", ms: 2 }
  ];
  const RATES = { 100: 10, 30: 33, 10: 100, 1: 1000 };
  const PREC = { fp16: 1, int8: .55, fp4: .38 }; // illustrative scaling of the two inference stages
  const WARN = { int8: "INT8 selected. This is now a different model. Re-run the evaluation suite.", fp4: "FP4 selected. This is now a very different model. Re-run the evaluation suite, then ask whether you believe it." };
  const DEFAULT = () => ({ rate: 10, prec: "fp16", tail: false, on: STAGES.map(() => true), ms: STAGES.map((s) => s.ms) });
  const state = DEFAULT();
  const q = K.readState();
  if (RATES[+q.rate]) state.rate = +q.rate;
  if (PREC[q.prec]) state.prec = q.prec;
  if (q.tail === "1") state.tail = true;
  if (q.ms) { const v = q.ms.split(",").map((x) => Math.max(0, Math.min(2000, +x || 0))); if (v.length === STAGES.length) state.ms = v; }
  if (q.on && q.on.length === STAGES.length) state.on = q.on.split("").map((c) => c === "1");

  function compute() {
    const budget = RATES[state.rate], f = PREC[state.prec], tail = state.tail ? 1.6 : 1;
    const segs = STAGES.map((s, i) => { const mean = state.on[i] ? state.ms[i] * (s.infer ? f : 1) : 0; return { id: s.id, name: s.name, infer: !!s.infer, mean, total: mean * tail, tail: mean * (tail - 1) }; });
    const total = segs.reduce((t, s) => t + s.total, 0);
    return { budget, segs, total, over: total > budget, headroom: budget - total, hz: total ? 1000 / total : Infinity };
  }

  // ---- the bar ----
  const bar = $("lbBar"), ticks = $("lbTicks"), scale = $("lbScale");
  function paint(R) {
    const span = Math.max(R.budget, R.total) * 1.02; // room for the overflow to be visible
    bar.innerHTML = ""; let x = 0;
    R.segs.forEach((s, i) => {
      if (!s.total) return;
      const el = document.createElement("div"); el.className = "budget__seg" + (s.infer ? " budget__seg--infer" : "");
      el.style.left = (x / span * 100) + "%"; el.style.width = (s.total / span * 100) + "%"; el.title = s.name + " · " + s.total.toFixed(1) + " ms";
      if (s.total / span > .09) el.innerHTML = "<span>" + s.name.split(" ")[0] + " " + Math.round(s.total) + "</span>";
      if (s.tail) { const t = document.createElement("i"); t.className = "budget__tail"; t.style.width = (s.tail / s.total * 100) + "%"; el.appendChild(t); }
      bar.appendChild(el); x += s.total;
    });
    if (R.over) { const o = document.createElement("div"); o.className = "budget__overflow"; o.style.left = (R.budget / span * 100) + "%"; o.style.width = ((R.total - R.budget) / span * 100) + "%"; bar.appendChild(o); }
    const d = document.createElement("div"); d.className = "budget__deadline"; d.style.left = "calc(" + (R.budget / span * 100) + "% - 1px)"; bar.appendChild(d);
    ticks.innerHTML = '<span style="left:' + (R.budget / span * 100) + '%">Deadline · ' + R.budget + ' ms ↓</span>';
    scale.innerHTML = "<span>0</span><span>" + Math.round(span) + " ms</span>";
  }

  // ---- the stage list ----
  const list = $("lbStages");
  STAGES.forEach((s, i) => {
    const row = document.createElement("div"); row.className = "budget__row";
    row.innerHTML = '<label class="check"><input type="checkbox" data-i="' + i + '" ' + (state.on[i] ? "checked" : "") + ' aria-label="Include ' + s.name + '" /></label>' +
      '<span class="budget__name">' + s.name + (s.infer ? ' <small class="mono muted">scales with precision</small>' : "") + '</span>' +
      '<label class="budget__ms"><input type="number" min="0" max="2000" step="1" value="' + state.ms[i] + '" data-i="' + i + '" aria-label="' + s.name + ' in milliseconds" /><span class="mono muted">ms</span></label>';
    list.appendChild(row);
  });
  list.addEventListener("change", (e) => {
    const i = +e.target.dataset.i; if (Number.isNaN(i)) return;
    if (e.target.type === "checkbox") { state.on[i] = e.target.checked; if (S()) S().tick(); }
    else state.ms[i] = Math.max(0, Math.min(2000, +e.target.value || 0));
    update();
  });
  list.addEventListener("input", (e) => { if (e.target.type === "number") { const i = +e.target.dataset.i; state.ms[i] = Math.max(0, Math.min(2000, +e.target.value || 0)); update(); } });

  // ---- readouts and verdicts ----
  function verdict(R) {
    const pct = R.headroom / R.budget;
    if (R.over && state.rate === 100) return "Nothing learned runs at a kilohertz and very little runs at a hundred. This is what distillation is for.";
    if (R.over) return "That's not a control loop, that's a strong opinion arriving late. Cut a stage, drop precision and re-validate, or slow the loop down and admit it.";
    if (!R.total) return "Nothing running. Infinite headroom, zero robot. Turn something on.";
    if (pct > .3) return "Comfortable. Suspiciously comfortable. Did you measure this or estimate it?";
    if (pct < .1) return "It fits, on a good day, with nothing else running. Add the p99.9 tail and tell me if you still like it.";
    return state.tail ? "It fits with the tail in. That's the number to put in the document, next to how you measured it." : "It fits. Now show the p99.9 tail and see if it still does.";
  }
  let saidOver = false;
  function update() {
    const R = compute(); paint(R);
    const ro = $("lbReadout"); ro.classList.toggle("is-over", R.over);
    ro.textContent = R.over
      ? "Over by " + K.fmt(R.total - R.budget, 0) + " ms · running at " + R.hz.toFixed(R.hz < 10 ? 1 : 0) + " Hz, whatever the spec sheet says"
      : "Total " + K.fmt(R.total, 0) + " ms · Budget " + R.budget + " ms · Headroom " + K.fmt(R.headroom, 0) + " ms";
    $("lbVerdict").textContent = verdict(R);
    const w = $("lbWarn"); w.hidden = !WARN[state.prec]; w.textContent = WARN[state.prec] || "";
    list.querySelectorAll(".budget__row").forEach((row, i) => row.classList.toggle("is-off", !state.on[i]));
    if (R.over && !saidOver) { saidOver = true; M() && M().say("Over budget. The controller doesn't care why.", { mood: "flat" }); }
    K.writeState({ rate: state.rate, prec: state.prec, tail: state.tail ? 1 : "", ms: state.ms.join(","), on: state.on.map((b) => (b ? "1" : "0")).join("") });
    update.last = R;
  }

  // ---- controls ----
  function seg(id, attr, key, cast) {
    const box = $(id);
    box.querySelectorAll(".seg__btn").forEach((b) => {
      b.classList.toggle("is-active", cast(b.dataset[attr]) === state[key]);
      b.addEventListener("click", () => { state[key] = cast(b.dataset[attr]); box.querySelectorAll(".seg__btn").forEach((x) => x.classList.toggle("is-active", x === b)); if (S()) S().click(); update(); });
    });
  }
  seg("lbRate", "rate", "rate", Number); seg("lbPrec", "prec", "prec", String);
  const tailEl = $("lbTail"); tailEl.checked = state.tail;
  tailEl.addEventListener("change", () => { state.tail = tailEl.checked; if (S()) S().tick(); update(); });
  $("lbReset").addEventListener("click", () => {
    Object.assign(state, DEFAULT());
    list.querySelectorAll('input[type="checkbox"]').forEach((c, i) => { c.checked = state.on[i]; });
    list.querySelectorAll('input[type="number"]').forEach((n, i) => { n.value = state.ms[i]; });
    tailEl.checked = false;
    $("lbRate").querySelectorAll(".seg__btn").forEach((x) => x.classList.toggle("is-active", +x.dataset.rate === 10));
    $("lbPrec").querySelectorAll(".seg__btn").forEach((x) => x.classList.toggle("is-active", x.dataset.prec === "fp16"));
    update(); if (S()) S().remove();
  });
  $("lbEmail").addEventListener("click", () => {
    const R = update.last || compute();
    K.mailto("Latency budget — " + K.fmt(R.total, 0) + " ms of " + R.budget + " ms at " + state.rate + " Hz", [
      "I built a latency budget on your site. Here it is:", "",
      ...R.segs.map((s) => "- " + s.name + ": " + (s.total ? s.total.toFixed(1) + " ms" : "off")),
      "", "Control rate: " + state.rate + " Hz (" + R.budget + " ms period)", "Precision: " + state.prec.toUpperCase(), "p99.9 tail shown: " + (state.tail ? "yes (x1.6)" : "no"),
      "", "Total: " + R.total.toFixed(1) + " ms · " + (R.over ? "over by " + (R.total - R.budget).toFixed(1) + " ms, effective " + R.hz.toFixed(1) + " Hz" : "headroom " + R.headroom.toFixed(1) + " ms"),
      "SKY-1 said: " + verdict(R), "", "Link: " + window.location.href, "",
      "Our actual hardware and model: [describe them]"
    ]);
  });
  update();
  window.BSS_LATENCY = { state, compute, reset: () => $("lbReset").click() };
})();
