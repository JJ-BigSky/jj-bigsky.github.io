/* Reality-gap meter: pick a task type, nudge it with what's true of your cell,
   and the needle shows how much of the work simulation can honestly do. A band,
   not a point, and Big Sky's judgment, labelled as such. The URL carries the state. */
(function () {
  const root = document.getElementById("gapMeter");
  if (!root) return;
  const $ = (id) => document.getElementById(id);
  const K = window.BSS_CALC, S = () => window.BSS_SOUND, M = () => window.BSS_MASCOT;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TASKS = [
    { id: "loco", name: "Legged locomotion", band: [75, 90], closes: ["Randomize terrain friction, mass, and motor latency wider than feels reasonable", "Measure the real actuator response and put it in the model, not a default", "Deploy with a recovery controller and log every fall"], wont: "It will not get you the last ten percent of slip on a wet floor. Budget real-world hours on the surfaces you actually have." },
    { id: "pick", name: "Rigid pick & place", band: [65, 85], closes: ["Match the gripper geometry and closing speed to the real one", "Calibrate the simulated camera to the real intrinsics and mount", "Randomize part pose, colour, and lighting, then test on the real bin"], wont: "It will not tell you which of your parts are shiny enough to break depth. Bench-test the sensor on the real parts first." },
    { id: "bin", name: "Bin picking with clutter", band: [45, 65], closes: ["Generate clutter from your real part CAD, not boxes", "Train the grasp ranking in sim, validate it on a real bin every week", "Log every failed pick with the scene that caused it"], wont: "It will not model the tangled ones. Hooked parts and deformable clutter are real-data problems." },
    { id: "assembly", name: "Contact-rich assembly", band: [25, 45], closes: ["Use sim for approach, collision avoidance, and gross motion only", "Identify the real compliance and friction, and stop pretending otherwise", "Collect real demonstrations for the last two centimetres"], wont: "It will not get you insertion. Budget real-world demonstrations for the last two centimetres and expect that to be where the schedule goes." },
    { id: "deform", name: "Deformable handling", band: [15, 35], closes: ["Use sim for camera placement, reach, and cycle planning", "Characterise the material on a bench before anyone models it", "Plan on real data for the manipulation itself"], wont: "It will not model your cable, cloth, or foam well enough to train on. Treat sim as a layout tool here, not a data source." },
    { id: "inspect", name: "Vision-dominant inspection", band: [50, 70], closes: ["Render your parts under your actual lighting geometry, not studio light", "Generate the defects you can't afford to manufacture", "Validate on a held-out real set every time the line changes"], wont: "It will not reproduce the surface finish of your real parts. Synthetic defects help; synthetic surfaces mislead." },
    { id: "nav", name: "Mobile navigation", band: [70, 90], closes: ["Scan the real site and simulate that, not a generic warehouse", "Randomize people, pallets, and lighting; keep the map real", "Test the rare events, blocked aisles and forklifts, where they're free"], wont: "It will not predict what your Wi-Fi does when a forklift passes. Measure the network on site." }
  ];
  const MODS = { shiny: -10, tol: -12, env: -8, sysid: 10 };
  const state = { task: "assembly", shiny: false, tol: false, env: false, sysid: false };
  const q = K.readState();
  if (TASKS.some((t) => t.id === q.task)) state.task = q.task;
  Object.keys(MODS).forEach((k) => { if (q[k] === "1") state[k] = true; });

  function compute() {
    const t = TASKS.find((x) => x.id === state.task);
    const shift = Object.keys(MODS).reduce((s, k) => s + (state[k] ? MODS[k] : 0), 0);
    const lo = Math.max(5, Math.min(95, t.band[0] + shift)), hi = Math.max(5, Math.min(95, t.band[1] + shift));
    return { task: t, lo, hi, mid: Math.round((lo + hi) / 2) };
  }
  const ARC = 251.3;
  function paint(R) {
    // the accent arc is the band: a dash of the band's length, offset to where it starts
    const len = (R.hi - R.lo) / 100 * ARC, start = R.lo / 100 * ARC;
    $("gaugeArc").setAttribute("stroke-dasharray", len + " " + ARC);
    $("gaugeArc").setAttribute("stroke-dashoffset", String(-start));
    $("gaugeNeedle").style.transform = "rotate(" + (-90 + R.mid * 1.8) + "deg)";
    $("gaugeValue").textContent = "~" + R.mid;
  }
  function update() {
    const R = compute(); paint(R);
    $("gmSplit").textContent = "~" + R.mid + "% sim / " + (100 - R.mid) + "% real";
    $("gmCloses").innerHTML = R.task.closes.map((c) => "<li>" + c + "</li>").join("");
    $("gmWont").textContent = R.task.wont;
    $("gmReadout").textContent = R.task.name + " · sim can honestly do about " + R.lo + " to " + R.hi + " percent of the work" + (Object.keys(MODS).some((k) => state[k]) ? " with your modifiers" : "") + " · plan " + R.mid + " sim / " + (100 - R.mid) + " real";
    root.querySelectorAll(".opt").forEach((b) => { b.classList.toggle("is-picked", b.dataset.task === state.task); b.setAttribute("aria-pressed", String(b.dataset.task === state.task)); });
    const st = { task: state.task }; Object.keys(MODS).forEach((k) => { st[k] = state[k] ? 1 : ""; });
    K.writeState(st);
    update.last = R;
  }
  const opts = $("gapOpts");
  TASKS.forEach((t, i) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "opt"; b.dataset.task = t.id; b.dataset.cursor = "PICK";
    b.innerHTML = "<kbd>" + (i + 1) + "</kbd><span>" + t.name + "</span>";
    b.addEventListener("click", () => { state.task = t.id; if (S()) S().click(); update(); M() && M().say(t.wont, { mood: "flat" }); });
    opts.appendChild(b);
  });
  root.addEventListener("keydown", (e) => { const n = +e.key; if (n >= 1 && n <= TASKS.length && !/INPUT|TEXTAREA/.test(e.target.tagName)) { state.task = TASKS[n - 1].id; update(); e.preventDefault(); } });
  Object.keys(MODS).forEach((k) => { const el = $("gm" + k[0].toUpperCase() + k.slice(1)); el.checked = state[k]; el.addEventListener("change", () => { state[k] = el.checked; if (S()) S().tick(); update(); }); });
  $("gmReset").addEventListener("click", () => { Object.assign(state, { task: "assembly", shiny: false, tol: false, env: false, sysid: false }); Object.keys(MODS).forEach((k) => { $("gm" + k[0].toUpperCase() + k.slice(1)).checked = false; }); update(); if (S()) S().remove(); });
  $("gmEmail").addEventListener("click", () => {
    const R = update.last || compute();
    K.mailto("Reality-gap read — " + R.task.name + ", ~" + R.mid + "% sim", [
      "I ran the reality-gap meter on your site:", "", "- Task type: " + R.task.name, "- Modifiers: " + (Object.keys(MODS).filter((k) => state[k]).join(", ") || "none"), "",
      "Sim can honestly do about " + R.lo + " to " + R.hi + " percent. Plan ~" + R.mid + "% sim / " + (100 - R.mid) + "% real.", "",
      "What closes the gap:", ...R.task.closes.map((c) => "- " + c), "", "What sim will not fix: " + R.task.wont, "", "Link: " + window.location.href, "", "Our actual task: [describe it]"
    ]);
  });
  if (reduce) $("gaugeNeedle").style.transition = "none";
  update();
  window.BSS_GAP = { state, compute, reset: () => $("gmReset").click() };
})();
