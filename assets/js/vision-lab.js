/* Vision lab: a synthetic bin of parts drawn in ink. Toggle the six stages of a
   perception pipeline, watch latency accumulate, and ruin everything with the
   lighting slider. Illustrative numbers. Nothing is stored or sent; the URL
   carries the state so a setup can be shared. */
(function () {
  const root = document.getElementById("visionLab");
  if (!root) return;
  const $ = (id) => document.getElementById(id);
  const canvas = $("visionCanvas"), ctx = canvas.getContext("2d");
  const K = window.BSS_CALC, S = () => window.BSS_SOUND, M = () => window.BSS_MASCOT;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STAGES = [
    { id: "detect", name: "Detect", ms: 8 }, { id: "segment", name: "Segment", ms: 22 }, { id: "depth", name: "Depth", ms: 14 },
    { id: "pose", name: "Pose", ms: 31 }, { id: "grasp", name: "Grasp", ms: 12 }, { id: "verify", name: "Verify", ms: 9 }
  ];
  const state = { detect: true, segment: false, depth: false, pose: false, grasp: false, verify: false, light: 85, clutter: 35, budget: 100 };
  const q = K.readState();
  STAGES.forEach((s) => { if (q[s.id] != null) state[s.id] = q[s.id] === "1"; });
  if (q.light != null) state.light = Math.max(0, Math.min(100, +q.light || 0));
  if (q.clutter != null) state.clutter = Math.max(0, Math.min(100, +q.clutter || 0));
  if (q.budget != null && [33, 100, 250].includes(+q.budget)) state.budget = +q.budget;

  // ---- the bin: twelve parts, same every time, pulled together by clutter ----
  function rng(seed) { return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
  function layout() {
    const r = rng(20260910), parts = [], c = state.clutter / 100;
    for (let i = 0; i < 12; i++) {
      const hex = r() < .4;
      parts.push({ i, hex, x: .1 + r() * .8, y: .12 + r() * .76, rot: r() * Math.PI, w: .11 + r() * .05, h: .065 + r() * .03, base: .72 + r() * .26, occl: 0, shiny: r() < .25 });
    }
    parts.forEach((p) => { p.x += (.5 - p.x) * c * .62; p.y += (.5 - p.y) * c * .62; });
    for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
      const a = parts[i], b = parts[j], d = Math.hypot((a.x - b.x) * 1.6, a.y - b.y), reach = (a.w + b.w) * .55;
      if (d < reach) a.occl = Math.min(1, a.occl + (1 - d / reach) * .9); // later parts sit on top of earlier ones
    }
    return parts;
  }
  let parts = layout();

  // ---- what the pipeline would report ----
  function analyse() {
    const L = state.light / 100, lit = L * L * (3 - 2 * L);
    const conf = parts.map((p) => p.base * (.3 + .7 * lit) * (1 - .85 * p.occl) * (p.shiny ? .82 : 1));
    const found = conf.map((c) => c >= .5);
    const sigma = .3 + (1 - L) * (1 - L) * 5.6 + (state.clutter / 100) * 1.1;
    const grasp = parts.map((p, i) => found[i] ? conf[i] * (1 - p.occl) * (.55 + .45 * lit) : 0);
    let best = -1; grasp.forEach((g, i) => { if (g > (best < 0 ? 0 : grasp[best])) best = i; });
    let reject = -1; conf.forEach((c, i) => { if (found[i] && (reject < 0 || c < conf[reject])) reject = i; });
    const ms = STAGES.reduce((t, s) => t + (state[s.id] ? s.ms : 0), 0);
    const on = STAGES.filter((s) => state[s.id]).length;
    return { conf, found, n: found.filter(Boolean).length, sigma, grasp, best, reject, ms, on, over: ms > state.budget };
  }

  // ---- drawing, in the site's ink-on-bone idiom ----
  function tok(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function size() {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: r.width, h: r.height };
  }
  let jitterSeed = 0;
  function shape(p, W, H, scale) {
    const cx = p.x * W, cy = p.y * H, w = p.w * W * (scale || 1), h = p.h * W * (scale || 1);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(p.rot);
    ctx.beginPath();
    if (p.hex) { for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k, x = Math.cos(a) * w * .55, y = Math.sin(a) * w * .55; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); }
    else { const rr = Math.min(w, h) * .18; ctx.roundRect(-w / 2, -h / 2, w, h, rr); }
    ctx.restore();
  }
  function draw() {
    const { w: W, h: H } = size();
    const ink = tok("--ink"), surface = tok("--surface"), bg = tok("--bg"), line = tok("--line-strong"), accent = tok("--accent"), muted = tok("--muted"), danger = tok("--danger"), ok = tok("--ok");
    const A = analyse(), L = state.light / 100, dark = 1 - (L * L * (3 - 2 * L));
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = surface; ctx.fillRect(0, 0, W, H);
    // paper grid
    ctx.fillStyle = tok("--grid");
    for (let x = 12; x < W; x += 24) for (let y = 12; y < H; y += 24) ctx.fillRect(x, y, 1.2, 1.2);
    // the bin
    const bx = 24, by = 40, bw = W - 48, bh = H - 64;
    ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.strokeRect(bx + .5, by + .5, bw, bh);
    ctx.fillStyle = muted; ctx.font = "600 10px " + tok("--font-mono"); ctx.textBaseline = "alphabetic";
    ctx.fillText("BIN A  ·  12 PARTS  ·  TOP-DOWN", bx, by - 10);
    ctx.fillText("LIGHT " + state.light + "%", bx + bw - 62, by - 10);
    // lighting: the sheet goes dim before the parts do
    const inkA = .45 + .55 * (1 - dark);
    // parts
    ctx.lineWidth = 1.5;
    parts.forEach((p) => {
      shape(p, W, H);
      ctx.fillStyle = bg; ctx.globalAlpha = 1; ctx.fill();
      ctx.globalAlpha = inkA * (p.occl > .6 ? .55 : 1); ctx.strokeStyle = ink; ctx.stroke();
      if (p.shiny) { ctx.globalAlpha = inkA * .5; ctx.fillStyle = ink; ctx.fillRect(p.x * W - 3, p.y * H - 3, 5, 2); }
      ctx.globalAlpha = 1;
    });
    // low light: the image darkens. Draw it as a wash, the way a bad exposure looks on paper.
    if (dark > .02) { ctx.fillStyle = ink; ctx.globalAlpha = dark * .55; ctx.fillRect(bx, by, bw, bh); ctx.globalAlpha = 1; }
    const jit = (!reduce && L < .6) ? (1 - L) * 6 : 0;
    const j = (k) => jit ? (Math.sin(jitterSeed * 1.7 + k * 3.1) * jit) : 0;
    // depth: contour banding across the bin, noisier as the light goes
    if (state.depth) {
      ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.globalAlpha = .35;
      const noise = .4 + dark * 6;
      for (let band = 0; band < 7; band++) {
        const y0 = by + bh * (.14 + band * .12);
        ctx.beginPath();
        for (let x = bx; x <= bx + bw; x += 6) {
          let y = y0;
          parts.forEach((p) => { const d = Math.hypot((x - p.x * W) / (p.w * W), (y0 - p.y * H) / (p.w * W * .8)); if (d < 1.1) y -= (1.1 - d) * 26; });
          y += Math.sin(x * .11 + band) * noise + (jit ? Math.sin(x * .5 + jitterSeed) * jit * .6 : 0);
          x === bx ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    // segment: hatched masks per instance
    if (state.segment) {
      parts.forEach((p, i) => {
        if (!A.found[i]) return;
        ctx.save(); shape(p, W, H); ctx.clip();
        ctx.strokeStyle = accent; ctx.lineWidth = 1; ctx.globalAlpha = .55;
        const cx = p.x * W, cy = p.y * H, r = p.w * W;
        for (let k = -r * 2; k < r * 2; k += 6) { ctx.beginPath(); ctx.moveTo(cx + k - r, cy - r); ctx.lineTo(cx + k + r, cy + r); ctx.stroke(); }
        ctx.restore();
      });
    }
    // detect: orange hairline boxes with a confidence label; misses are drawn as a faint dashed box
    if (state.detect) {
      parts.forEach((p, i) => {
        const cx = p.x * W + j(i), cy = p.y * H + j(i + 7), w = p.w * W * 1.15, h = Math.max(p.h * W * 1.4, p.w * W * (p.hex ? 1.15 : .8));
        ctx.lineWidth = 1;
        if (A.found[i]) {
          ctx.strokeStyle = accent; ctx.setLineDash([]); ctx.strokeRect(cx - w / 2 + .5, cy - h / 2 + .5, w, h);
          ctx.fillStyle = accent; ctx.font = "600 9px " + tok("--font-mono"); ctx.fillText(A.conf[i].toFixed(2), cx - w / 2, cy - h / 2 - 4);
        } else { ctx.strokeStyle = muted; ctx.setLineDash([2, 4]); ctx.globalAlpha = .6; ctx.strokeRect(cx - w / 2 + .5, cy - h / 2 + .5, w, h); ctx.setLineDash([]); ctx.globalAlpha = 1; }
      });
    }
    // pose: three-axis frame markers, jittering in bad light
    if (state.pose) {
      parts.forEach((p, i) => {
        if (!A.found[i]) return;
        const cx = p.x * W + j(i + 3), cy = p.y * H + j(i + 11), a = p.rot + (jit ? j(i + 5) * .04 : 0), len = 16;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = accent; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len); ctx.stroke();
        ctx.strokeStyle = ink; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - Math.sin(a) * len, cy + Math.cos(a) * len); ctx.stroke();
        ctx.fillStyle = ink; ctx.fillRect(cx - 2, cy - 2, 4, 4);
      });
    }
    // grasp: jaw pairs across each found part, best pick in orange with its score
    if (state.grasp) {
      parts.forEach((p, i) => {
        if (!A.found[i] || A.grasp[i] <= 0) return;
        const cx = p.x * W, cy = p.y * H, a = p.rot + Math.PI / 2, gap = p.h * W * .75, len = 12, best = i === A.best;
        ctx.strokeStyle = best ? accent : ink; ctx.lineWidth = best ? 2.5 : 1.5; ctx.globalAlpha = best ? 1 : .7;
        for (const s of [-1, 1]) {
          const ox = Math.cos(a) * gap * s, oy = Math.sin(a) * gap * s;
          ctx.beginPath(); ctx.moveTo(cx + ox - Math.sin(a) * len, cy + oy + Math.cos(a) * len); ctx.lineTo(cx + ox + Math.sin(a) * len, cy + oy - Math.cos(a) * len); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        if (best) { ctx.fillStyle = accent; ctx.font = "600 9px " + tok("--font-mono"); ctx.fillText("G " + A.grasp[i].toFixed(2), cx + 14, cy + 4); }
      });
    }
    // verify: a second pass that refuses the least certain pick
    if (state.verify && A.reject >= 0) {
      const p = parts[A.reject], cx = p.x * W, cy = p.y * H, r = 11;
      ctx.strokeStyle = danger; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - r, cy - r); ctx.lineTo(cx + r, cy + r); ctx.moveTo(cx + r, cy - r); ctx.lineTo(cx - r, cy + r); ctx.stroke();
      ctx.fillStyle = danger; ctx.font = "600 9px " + tok("--font-mono"); ctx.fillText("REJECT", cx + 15, cy - 8);
      ctx.fillStyle = ok; ctx.fillRect(bx + bw - 66, by + bh - 18, 5, 5); ctx.fillStyle = muted; ctx.fillText("VERIFIED", bx + bw - 56, by + bh - 12);
    }
    // over budget: the frame says so, not just the colour
    if (A.over) {
      ctx.strokeStyle = danger; ctx.lineWidth = 2; ctx.strokeRect(bx + 1, by + 1, bw - 2, bh - 2);
      ctx.fillStyle = danger; ctx.font = "600 10px " + tok("--font-mono"); ctx.fillText("OVER BUDGET  ·  " + (1000 / A.ms).toFixed(1) + " HZ", bx + 8, by + bh - 10);
    }
    return A;
  }

  // ---- readouts, verdicts, and the honest bit ----
  let saidBudget = false, saidDark = false;
  function verdict(A) {
    if (A.over) return "That's not a pipeline, that's a slideshow. Cut a stage, or take it to the embedded page and make something faster.";
    if (state.light < 35) return "You can't fix this with a model. Buy a light. It's the cheapest thing on the invoice and the one people skip.";
    if (A.n < 6) return "Half the bin is invisible. That's a lighting problem or a fixturing problem, and either is cheaper than it sounds.";
    if (!A.on) return "Camera's on, nothing's running. Technically zero latency. Also zero robot.";
    if (A.on === 6) return "Six stages under budget. Either your budget is generous or your parts are easy. Check which, before Tuesday.";
    if (!state.verify && state.grasp) return "Grasping without verifying. Bold. The camera that checks the work is usually worth more than the one that guides it.";
    return "Fine on the bench. Now do it on a cloudy Tuesday, after someone bumps the mount.";
  }
  function update(paint) {
    const A = paint ? draw() : analyse();
    const hz = A.ms ? (1000 / A.ms).toFixed(1) : "—";
    $("vFound").textContent = A.n + "/12"; $("vSigma").textContent = A.sigma.toFixed(1) + " mm"; $("vMs").textContent = A.ms + " ms"; $("vBudget").textContent = state.budget + " ms";
    $("visionHud").classList.toggle("is-over", A.over);
    $("visionMsg").hidden = !A.over;
    $("visionReadout").textContent = A.n + " of 12 parts found · pose σ " + A.sigma.toFixed(1) + " mm · pipeline " + A.ms + " ms of " + state.budget + (A.ms ? " · " + hz + " Hz" : "") + (A.over ? " · over budget" : "");
    $("vVerdict").textContent = verdict(A);
    if (A.over && !saidBudget) { saidBudget = true; M() && M().say("You turned on every stage. So does everyone. That's why the robot runs at four hertz.", { mood: "wow" }); }
    if (state.light < 30 && !saidDark) { saidDark = true; M() && M().say("Two of twelve. The network is fine. The room is dark.", { mood: "flat" }); }
    const st = { light: state.light, clutter: state.clutter, budget: state.budget };
    STAGES.forEach((s) => { st[s.id] = state[s.id] ? 1 : 0; });
    K.writeState(st);
    update.last = A;
  }

  // ---- controls ----
  STAGES.forEach((s) => { const el = $("vs-" + s.id); el.checked = state[s.id]; el.addEventListener("change", () => { state[s.id] = el.checked; if (S()) S().tick(); update(true); }); });
  const lightEl = $("vLight"), clutterEl = $("vClutter");
  lightEl.value = state.light; clutterEl.value = state.clutter;
  K.bindRange(lightEl, (v) => { state.light = v; update(true); });
  K.bindRange(clutterEl, (v) => { state.clutter = v; parts = layout(); update(true); });
  root.querySelectorAll(".seg__btn").forEach((b) => {
    b.classList.toggle("is-active", +b.dataset.budget === state.budget);
    b.addEventListener("click", () => { state.budget = +b.dataset.budget; root.querySelectorAll(".seg__btn").forEach((x) => x.classList.toggle("is-active", x === b)); if (S()) S().click(); update(true); });
  });
  $("vReset").addEventListener("click", () => {
    Object.assign(state, { detect: true, segment: false, depth: false, pose: false, grasp: false, verify: false, light: 85, clutter: 35, budget: 100 });
    STAGES.forEach((s) => { $("vs-" + s.id).checked = state[s.id]; });
    lightEl.value = 85; clutterEl.value = 35; lightEl.dispatchEvent(new Event("input")); clutterEl.dispatchEvent(new Event("input"));
    root.querySelectorAll(".seg__btn").forEach((x) => x.classList.toggle("is-active", +x.dataset.budget === 100));
    parts = layout(); update(true); if (S()) S().remove();
  });
  $("vEmail").addEventListener("click", () => {
    const A = update.last || analyse();
    K.mailto("Perception pipeline setup — " + A.on + " stages, " + A.ms + " ms", [
      "I set up a perception pipeline on your site. Here's the configuration:", "",
      ...STAGES.map((s) => "- " + s.name + ": " + (state[s.id] ? "on (" + s.ms + " ms)" : "off")),
      "", "Lighting: " + state.light + "%", "Clutter: " + state.clutter + "%", "Budget: " + state.budget + " ms",
      "", "Result: " + A.n + " of 12 parts found, pose sigma " + A.sigma.toFixed(1) + " mm, pipeline " + A.ms + " ms" + (A.over ? " (over budget)" : ""),
      "SKY-1 said: " + verdict(A), "", "Link: " + window.location.href, "",
      "My actual parts are: [describe them, including the shiny ones]"
    ]);
  });

  // ---- render loop: only while visible, only when there is something to jitter ----
  let visible = false, raf = 0, lastT = 0;
  function tick(now) {
    raf = 0;
    if (!visible) return;
    if (!reduce && state.light < 60 && now - lastT > 80) { lastT = now; jitterSeed += 1; draw(); }
    raf = requestAnimationFrame(tick);
  }
  function start() { if (!raf && visible) raf = requestAnimationFrame(tick); }
  if ("IntersectionObserver" in window) new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible) { update(true); start(); } }, { threshold: .1 }).observe(root);
  else { visible = true; start(); }
  window.addEventListener("resize", () => { if (visible) update(true); });
  document.addEventListener("bss:theme", () => update(true));
  update(true);

  window.BSS_VISION = { state, analyse, reset: () => $("vReset").click() };
})();
