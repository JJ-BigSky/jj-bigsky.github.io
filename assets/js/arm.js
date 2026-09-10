/* Robot arm playground: 3-link planar arm solved with FABRIK inverse kinematics.
   Modes: follow the cursor, teach waypoints and replay, or paint with the gripper.
   Drawn as an engineering figure: ink links, paper joints, orange for anything live. */
(function () {
  const canvas = document.getElementById("armCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const $ = (id) => document.getElementById(id);
  const hud = { j1: $("j1"), j2: $("j2"), j3: $("j3"), mode: $("armModeLabel"), hint: $("armHint"), count: $("teachCount") };
  const S = () => window.BSS_SOUND, M = () => window.BSS_MASCOT;

  let W = 0, H = 0, dpr = 1;
  let lens = [1, 1, 1], reach = 1;
  const base = { x: 0, y: 0 };
  let p = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
  const goal = { x: 0, y: 0 }, target = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0, inside: false, down: false };
  let mode = "follow", speed = 6, envelope = true, trailOn = false;
  let grip = 0, gripTarget = 0;
  let waypoints = [], playing = false, playIdx = 0, dwell = 0;
  let trail = [], strokes = [], curStroke = null;
  let dancing = false, danceT = 0, idleT = Math.random() * 10;
  let last = performance.now(), running = true, visible = true, hudTick = 0;
  let c = {};
  const once = {};

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    const v = (n, f) => (cs.getPropertyValue(n).trim() || f);
    c = { ink: v("--ink", "#141414"), bg: v("--bg", "#ECE9E2"), surface: v("--surface", "#F4F2ED"), surface2: v("--surface-2", "#E9E6DF"), muted: v("--muted", "#66635E"), line: v("--line-strong", "rgba(20,20,20,.34)"), accent: v("--accent", "#FF4A00") };
  }
  readColors();
  document.addEventListener("bss:theme", readColors);

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    base.x = W / 2; base.y = H - 46;
    const L = Math.min(W * .5, H * .78);
    lens = [L * .42, L * .34, L * .2]; reach = lens[0] + lens[1] + lens[2];
    p = [{ x: base.x, y: base.y }, { x: base.x - lens[0] * .3, y: base.y - lens[0] * .95 }, { x: base.x + lens[1] * .7, y: base.y - lens[0] * .95 - lens[1] * .7 }, { x: base.x + lens[1] * .7 + lens[2], y: base.y - lens[0] * .95 - lens[1] * .7 }];
    goal.x = target.x = p[3].x; goal.y = target.y = p[3].y;
  }

  function clampGoal(x, y) {
    const maxY = base.y - 14;
    y = Math.min(y, maxY);
    let dx = x - base.x, dy = y - base.y, d = Math.hypot(dx, dy) || 1;
    const maxR = reach * .985, minR = lens[2] * .8;
    if (d > maxR) { x = base.x + dx / d * maxR; y = base.y + dy / d * maxR; }
    if (d < minR) { x = base.x + dx / d * minR; y = base.y + dy / d * minR; }
    return { x, y: Math.min(y, maxY) };
  }

  function solve(tx, ty) {
    for (let it = 0; it < 12; it++) {
      p[3] = { x: tx, y: ty };
      for (let i = 2; i >= 0; i--) {
        const dx = p[i].x - p[i + 1].x, dy = p[i].y - p[i + 1].y, d = Math.hypot(dx, dy) || 1;
        p[i] = { x: p[i + 1].x + dx / d * lens[i], y: p[i + 1].y + dy / d * lens[i] };
      }
      p[0] = { x: base.x, y: base.y };
      for (let i = 0; i < 3; i++) {
        const dx = p[i + 1].x - p[i].x, dy = p[i + 1].y - p[i].y, d = Math.hypot(dx, dy) || 1;
        p[i + 1] = { x: p[i].x + dx / d * lens[i], y: p[i].y + dy / d * lens[i] };
        if (p[i + 1].y > base.y - 8) p[i + 1].y = base.y - 8;
      }
      if (Math.hypot(p[3].x - tx, p[3].y - ty) < .3) break;
    }
  }

  function angleOf(a, b) { return Math.atan2(b.y - a.y, b.x - a.x); }
  function norm(a) { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; }
  function setGoalFromPointer() { const g = clampGoal(pointer.x, pointer.y); goal.x = g.x; goal.y = g.y; }

  function update(dt) {
    if (dancing) {
      danceT += dt;
      const g = clampGoal(base.x + Math.sin(danceT * 3.1) * reach * .55, base.y - reach * .5 + Math.sin(danceT * 6.2) * reach * .3);
      goal.x = g.x; goal.y = g.y; gripTarget = (Math.sin(danceT * 8) > 0) ? 1 : 0;
    } else if (playing && waypoints.length) {
      const wp = waypoints[playIdx];
      goal.x = wp.x; goal.y = wp.y;
      if (Math.hypot(target.x - wp.x, target.y - wp.y) < 2.5) {
        dwell += dt; gripTarget = dwell > .08 ? (playIdx % 2 ? 0 : 1) : gripTarget;
        if (dwell > .45) { dwell = 0; playIdx = (playIdx + 1) % waypoints.length; if (S()) S().tick(); }
      }
    } else if (pointer.inside) {
      setGoalFromPointer();
    } else {
      idleT += dt * .6;
      const g = clampGoal(base.x + Math.sin(idleT * .7) * reach * .45, base.y - reach * .55 + Math.cos(idleT * 1.1) * reach * .22);
      goal.x = g.x; goal.y = g.y;
    }
    const k = reduce ? 1 : Math.min(1, dt * (1.5 + speed * 1.1));
    target.x += (goal.x - target.x) * k; target.y += (goal.y - target.y) * k;
    grip += (gripTarget - grip) * Math.min(1, dt * 14);
    solve(target.x, target.y);

    if (trailOn) { trail.push({ x: p[3].x, y: p[3].y }); if (trail.length > 420) trail.shift(); }
    if (mode === "draw" && pointer.down && curStroke) { const l = curStroke[curStroke.length - 1]; if (!l || Math.hypot(l.x - p[3].x, l.y - p[3].y) > 1.5) curStroke.push({ x: p[3].x, y: p[3].y }); }

    if ((hudTick += dt) > .1) {
      hudTick = 0;
      const a1 = angleOf(p[0], p[1]), a2 = angleOf(p[1], p[2]), a3 = angleOf(p[2], p[3]);
      hud.j1.textContent = Math.round(-a1 * 180 / Math.PI) + "°";
      hud.j2.textContent = Math.round(-norm(a2 - a1) * 180 / Math.PI) + "°";
      hud.j3.textContent = Math.round(-norm(a3 - a2) * 180 / Math.PI) + "°";
    }
  }

  function line(a, b, w, color) { ctx.lineCap = "round"; ctx.lineWidth = w; ctx.strokeStyle = color; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // drafting grid
    ctx.strokeStyle = c.line; ctx.lineWidth = 1; ctx.globalAlpha = .35;
    for (let x = (base.x % 40); x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = (base.y % 40); y > 0; y -= 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.globalAlpha = 1;
    // floor
    ctx.strokeStyle = c.ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, base.y + 14); ctx.lineTo(W, base.y + 14); ctx.stroke();
    ctx.strokeStyle = c.line; ctx.lineWidth = 1;
    for (let x = 6; x < W; x += 14) { ctx.beginPath(); ctx.moveTo(x, base.y + 14); ctx.lineTo(x - 6, base.y + 22); ctx.stroke(); }
    // reach envelope
    if (envelope) {
      ctx.save(); ctx.setLineDash([5, 7]); ctx.strokeStyle = c.muted; ctx.globalAlpha = .55; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(base.x, base.y, reach * .985, Math.PI, 2 * Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(base.x, base.y, lens[2] * .8, Math.PI, 2 * Math.PI); ctx.stroke();
      ctx.restore();
    }
    // paint strokes
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    strokes.concat(curStroke ? [curStroke] : []).forEach((s) => {
      if (s.length < 2) return; ctx.strokeStyle = c.accent; ctx.lineWidth = 4; ctx.globalAlpha = .95;
      ctx.beginPath(); ctx.moveTo(s[0].x, s[0].y); for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x, s[i].y); ctx.stroke();
    });
    ctx.globalAlpha = 1;
    // motion trail
    if (trail.length > 1) {
      for (let i = 1; i < trail.length; i++) {
        ctx.globalAlpha = (i / trail.length) * .8; ctx.strokeStyle = c.accent; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(trail[i - 1].x, trail[i - 1].y); ctx.lineTo(trail[i].x, trail[i].y); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    // waypoints
    if (waypoints.length) {
      ctx.save(); ctx.setLineDash([3, 6]); ctx.strokeStyle = c.ink; ctx.globalAlpha = .5; ctx.lineWidth = 1;
      ctx.beginPath(); waypoints.forEach((w, i) => i ? ctx.lineTo(w.x, w.y) : ctx.moveTo(w.x, w.y)); if (waypoints.length > 2) ctx.closePath(); ctx.stroke(); ctx.restore();
      waypoints.forEach((w, i) => {
        const active = playing && i === playIdx;
        ctx.fillStyle = active ? c.accent : c.ink; ctx.beginPath(); ctx.arc(w.x, w.y, active ? 9 : 7.5, 0, 6.283); ctx.fill();
        ctx.fillStyle = c.bg; ctx.font = "600 9px JetBrains Mono, monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(i + 1), w.x, w.y + .5);
      });
    }
    // pedestal
    ctx.fillStyle = c.surface2; ctx.strokeStyle = c.ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.rect(base.x - 44, base.y - 6, 88, 20); ctx.fill(); ctx.stroke();
    ctx.fillStyle = c.accent; ctx.fillRect(base.x - 30, base.y + 10, 60, 3);
    // links: ink bar with a machined centerline
    const widths = [20, 15, 11];
    for (let i = 0; i < 3; i++) { line(p[i], p[i + 1], widths[i], c.ink); line(p[i], p[i + 1], 1.5, c.bg); }
    // joints
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = c.bg; ctx.strokeStyle = c.ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(p[i].x, p[i].y, [12, 9, 7][i], 0, 6.283); ctx.fill(); ctx.stroke();
      ctx.fillStyle = c.accent; ctx.beginPath(); ctx.arc(p[i].x, p[i].y, 2.2, 0, 6.283); ctx.fill();
    }
    // gripper
    const a = angleOf(p[2], p[3]), open = (1 - grip) * .55 + .12;
    ctx.save(); ctx.translate(p[3].x, p[3].y); ctx.rotate(a);
    ctx.fillStyle = c.bg; ctx.strokeStyle = c.ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, 6.283); ctx.fill(); ctx.stroke();
    [1, -1].forEach((s) => {
      ctx.save(); ctx.rotate(s * open);
      ctx.strokeStyle = grip > .5 ? c.accent : c.ink; ctx.lineWidth = 3.5; ctx.lineCap = "square";
      ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(18, 0); ctx.lineTo(24, s * -4); ctx.stroke(); ctx.restore();
    });
    ctx.restore();
    // target reticle
    if (pointer.inside || playing || dancing) {
      ctx.save(); ctx.translate(goal.x, goal.y); ctx.strokeStyle = c.accent; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, 6.283); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(-6, 0); ctx.moveTo(6, 0); ctx.lineTo(16, 0); ctx.moveTo(0, -16); ctx.lineTo(0, -6); ctx.moveTo(0, 6); ctx.lineTo(0, 16); ctx.stroke();
      ctx.restore();
    }
  }

  function loop(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (running && visible) { update(dt); draw(); }
    requestAnimationFrame(loop);
  }

  function toLocal(e) { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  canvas.addEventListener("pointermove", (e) => { const l = toLocal(e); pointer.x = l.x; pointer.y = l.y; pointer.inside = true; }, { passive: true });
  canvas.addEventListener("pointerleave", () => { pointer.inside = false; pointer.down = false; if (mode === "follow") gripTarget = 0; endStroke(); });
  canvas.addEventListener("pointerdown", (e) => {
    const l = toLocal(e); pointer.x = l.x; pointer.y = l.y; pointer.inside = true; pointer.down = true;
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
    if (mode === "follow") { gripTarget = 1; if (S()) S().grab(); if (!once.grab) { once.grab = true; M() && M().say("Careful. That's a very expensive imaginary gripper.", { mood: "o" }); } }
    else if (mode === "teach") { if (playing) stopPlay(); const g = clampGoal(l.x, l.y); waypoints.push(g); updateCount(); if (S()) S().place(); if (waypoints.length === 3 && !once.wp) { once.wp = true; M() && M().say("Look at you, programming robots. Press play.", { mood: "smirk" }); } }
    else if (mode === "draw") { curStroke = []; if (S()) S().tick(); }
  });
  canvas.addEventListener("pointerup", () => { pointer.down = false; if (mode === "follow") gripTarget = 0; endStroke(); });
  canvas.addEventListener("dblclick", () => { if (mode === "draw") { strokes = []; curStroke = null; if (S()) S().remove(); } });
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  function endStroke() { if (curStroke && curStroke.length > 1) strokes.push(curStroke); curStroke = null; if (strokes.length > 40) strokes.shift(); }

  const HINTS = coarse
    ? { follow: "Drag to move. Hold to grip.", teach: "Tap to record waypoints, then Play.", draw: "Drag to paint. Double-tap to clear." }
    : { follow: "Move your cursor. Click and hold to close the gripper.", teach: "Jog with the cursor. Click to record a waypoint, then press Play.", draw: "Hold to paint with the gripper. Double-click to clear." };
  function setMode(m) {
    mode = m; hud.mode.textContent = m; hud.hint.textContent = HINTS[m];
    document.querySelectorAll(".seg__btn").forEach((b) => b.classList.toggle("is-active", b.dataset.mode === m));
    $("teachControls").hidden = m !== "teach";
    if (m !== "teach") stopPlay();
    gripTarget = 0; if (S()) S().click();
  }
  document.querySelectorAll(".seg__btn").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  function updateCount() { hud.count.textContent = waypoints.length + " waypoint" + (waypoints.length === 1 ? "" : "s"); }
  function stopPlay() { playing = false; $("teachPlay").textContent = "▶ Play path"; gripTarget = 0; }
  $("teachPlay").addEventListener("click", () => {
    if (playing) return stopPlay();
    if (waypoints.length < 2) { M() && M().say("I need at least two waypoints. Even I can't loop through one point.", { mood: "flat" }); if (S()) S().error(); return; }
    playing = true; playIdx = 0; dwell = 0; $("teachPlay").textContent = "■ Stop"; if (S()) S().success();
  });
  $("teachClear").addEventListener("click", () => { waypoints = []; stopPlay(); updateCount(); if (S()) S().remove(); });
  $("armEnvelope").addEventListener("change", (e) => { envelope = e.target.checked; });
  $("armTrail").addEventListener("change", (e) => { trailOn = e.target.checked; if (!trailOn) trail = []; });
  $("armSpeed").addEventListener("input", (e) => { speed = +e.target.value; });
  $("armDance").addEventListener("click", () => { window.BSS_DANCE && window.BSS_DANCE(); });

  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas); else window.addEventListener("resize", resize);
  if ("IntersectionObserver" in window) new IntersectionObserver((en) => { visible = en[0].isIntersecting; last = performance.now(); }).observe(canvas);
  document.addEventListener("visibilitychange", () => { running = !document.hidden; last = performance.now(); });

  resize(); updateCount(); setMode("follow");
  requestAnimationFrame(loop);

  window.BSS_ARM = { dance(on) { dancing = !!on; if (!on) gripTarget = 0; }, setMode };
})();
