/* Demonstration budget: how many teleoperated demonstrations a task list needs,
   what that costs in operator-weeks, and whether simulation is worth it at this
   size. Illustrative numbers; the URL carries the state; nothing is sent. */
(function () {
  const root = document.getElementById("demoCalc");
  if (!root) return;
  const $ = (id) => document.getElementById(id);
  const K = window.BSS_CALC, S = () => window.BSS_SOUND, M = () => window.BSS_MASCOT;
  const FAMILY = { rigid: { cut: .6, label: "−60% real demos" }, contact: { cut: .45, label: "−45% real demos" }, deform: { cut: .35, label: "−35% real demos" } };
  const ENG_RATE = [120, 180]; // $/hr band for the sim build, illustrative
  const DEF = () => ({ tasks: 8, variants: 3, demos: 100, minutes: 4, take: 70, ops: 2, rate: 45, family: "rigid", sim: false, evals: true });
  const state = DEF();
  const q = K.readState();
  ["tasks", "variants", "demos", "minutes", "take", "ops", "rate"].forEach((k) => { if (q[k] != null && !Number.isNaN(+q[k])) state[k] = +q[k]; });
  if (FAMILY[q.family]) state.family = q.family;
  if (q.sim === "1") state.sim = true;
  if (q.evals === "0") state.evals = false;

  function compute() {
    const attempts = state.tasks * state.variants * state.demos / (state.take / 100);
    const cut = state.sim ? FAMILY[state.family].cut : 0;
    const real = attempts * (1 - cut);
    const evalEp = state.evals ? real * .15 * 4 : 0;
    const total = real + evalEp;
    const hours = total * state.minutes / 60;
    const weeks = hours / (state.ops * 30);
    const cost = hours * state.rate;
    const simWeeks = state.sim ? Math.max(3, Math.min(8, Math.round(3 + state.tasks / 8))) : 0;
    const simCost = state.sim ? [simWeeks * 40 * ENG_RATE[0], simWeeks * 40 * ENG_RATE[1]] : [0, 0];
    const saved = state.sim ? attempts * cut * state.minutes / 60 * state.rate : 0; // operator dollars the sim saves
    return { attempts, real, evalEp, total, hours, weeks, cost, simWeeks, simCost, saved, cut };
  }
  function verdict(R) {
    const n = R.total;
    if (state.sim && R.saved < R.simCost[0]) return "At this size the simulator costs more than the demonstrations it saves. That's not an argument against sim. It's an argument for a bigger task list before you build one.";
    if (n < 500) return "That's a real project with a real number. Two operators, a few weeks. Start here, not with twenty tasks.";
    if (n < 2000) return "Now you have a staffing plan, not a science project. This is the size where the data pipeline stops being optional.";
    if (n < 6000) return "That's most of a year of somebody's life in a teleop rig. Worth asking which eight of those tasks actually pay for themselves.";
    return "I've seen this number kill programs. Not because it's impossible, because nobody budgeted for it and it showed up in month five. Cut the task list or build the sim pipeline. Preferably both.";
  }
  let said = false;
  function update() {
    const R = compute();
    $("oDemos").textContent = K.fmt(R.total, 0);
    $("oHours").textContent = K.fmt(R.hours, 0);
    $("oWeeks").textContent = R.weeks < 1 ? "< 1" : K.fmt(R.weeks, R.weeks < 10 ? 1 : 0);
    $("oCost").textContent = K.bandPct(R.cost, .3, K.money);
    $("oEvalRow").hidden = !state.evals; $("oEval").textContent = K.fmt(R.evalEp, 0);
    $("oSimRow").hidden = !state.sim; $("oSim").textContent = state.sim ? R.simWeeks + " wks · " + K.band(R.simCost[0], R.simCost[1], K.money) : "—";
    $("oVerdict").textContent = verdict(R);
    $("dSimNote").textContent = FAMILY[state.family].label + ", +sim build";
    $("dReadout").textContent = K.fmt(R.total, 0) + " demonstrations · " + K.fmt(R.hours, 0) + " teleop hours · " + (R.weeks < 1 ? "under a week" : K.fmt(R.weeks, 1) + " weeks") + " with " + state.ops + " operator" + (state.ops > 1 ? "s" : "") + " · " + K.bandPct(R.cost, .3, K.money) + (state.sim ? " · sim saves " + K.money(R.saved) + " of operator time for a " + K.band(R.simCost[0], R.simCost[1], K.money) + " build" : "");
    if (R.total > 6000 && !said) { said = true; M() && M().say("That number has killed programs. Month five, usually.", { mood: "flat" }); }
    K.writeState({ tasks: state.tasks, variants: state.variants, demos: state.demos, minutes: state.minutes, take: state.take, ops: state.ops, rate: state.rate, family: state.family, sim: state.sim ? 1 : "", evals: state.evals ? "" : 0 });
    update.last = R;
  }

  // ---- controls ----
  const ranges = { dTasks: "tasks", dVariants: "variants", dDemos: "demos", dMinutes: "minutes", dTake: "take", dOps: "ops" };
  Object.keys(ranges).forEach((id) => { const el = $(id), k = ranges[id]; el.value = state[k]; K.bindRange(el, (v) => { state[k] = v; update(); }, k === "take" ? (v) => v + "%" : null); });
  const rate = $("dRate"); rate.value = state.rate;
  rate.addEventListener("input", () => { state.rate = Math.max(10, Math.min(500, +rate.value || 0)); update(); });
  $("dFamily").querySelectorAll(".seg__btn").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.family === state.family);
    b.addEventListener("click", () => { state.family = b.dataset.family; $("dFamily").querySelectorAll(".seg__btn").forEach((x) => x.classList.toggle("is-active", x === b)); if (S()) S().click(); update(); });
  });
  const sim = $("dSim"), evals = $("dEval"); sim.checked = state.sim; evals.checked = state.evals;
  sim.addEventListener("change", () => { state.sim = sim.checked; if (S()) S().tick(); update(); });
  evals.addEventListener("change", () => { state.evals = evals.checked; if (S()) S().tick(); update(); });
  $("dReset").addEventListener("click", () => {
    Object.assign(state, DEF());
    Object.keys(ranges).forEach((id) => { $(id).value = state[ranges[id]]; $(id).dispatchEvent(new Event("input")); });
    rate.value = state.rate; sim.checked = false; evals.checked = true;
    $("dFamily").querySelectorAll(".seg__btn").forEach((x) => x.classList.toggle("is-active", x.dataset.family === "rigid"));
    update(); if (S()) S().remove();
  });
  $("dEmail").addEventListener("click", () => {
    const R = update.last || compute();
    K.mailto("Physical AI demonstration budget — " + state.tasks + " tasks", [
      "I ran the demonstration budget on your site. Here's what it said:", "",
      "- Distinct tasks: " + state.tasks, "- Variants per task: " + state.variants, "- Demos per variant: " + state.demos, "- Minutes per demo: " + state.minutes,
      "- Usable-take rate: " + state.take + "%", "- Operators: " + state.ops + " at $" + state.rate + "/hr loaded", "- Task family: " + state.family, "- Simulation: " + (state.sim ? "yes" : "no") + " · Evaluation passes: " + (state.evals ? "yes" : "no"), "",
      "Demonstrations: " + Math.round(R.total) + (state.evals ? " (including " + Math.round(R.evalEp) + " evaluation episodes)" : ""),
      "Teleop hours: " + Math.round(R.hours), "Calendar weeks: " + R.weeks.toFixed(1), "Operator cost: " + K.bandPct(R.cost, .3, K.money),
      state.sim ? "Sim build: " + R.simWeeks + " weeks, " + K.band(R.simCost[0], R.simCost[1], K.money) + " (saves " + K.money(R.saved) + " of operator time)" : null,
      "SKY-1 said: " + verdict(R), "", "Link: " + window.location.href, "", "The tasks are: [describe them]"
    ]);
  });
  update();
  window.BSS_DEMOS = { state, compute, reset: () => $("dReset").click() };
})();
