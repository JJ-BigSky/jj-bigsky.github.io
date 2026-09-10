/* Hero: an engineering-drawing sky. Ink contour ridgelines that bulge under
   the cursor, survey marks that constellate around it, a drafting sun, and a
   crossfade between the paper sheet and the graphite sheet. */
(function () {
  const canvas = document.getElementById("sky");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, dpr = 1, stars = [];
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, inside: false };
  let paper = document.documentElement.dataset.theme === "graphite" ? 0 : 1, target = paper, hoverK = 0;
  let dancing = false, running = true, visible = true;
  let shooting = null, nextShoot = 3 + Math.random() * 5;
  let last = performance.now(), t = 0;

  const PAPER = { bg0: "#ECE9E2", bg1: "#E2DED6", ink: [20, 20, 20], accent: "#FF4A00" };
  const GRAPH = { bg0: "#161616", bg1: "#1B1B1B", ink: [236, 232, 225], accent: "#FF5A1F" };
  const ridges = [];
  for (let i = 0; i < 9; i++) ridges.push({ seed: 1.3 + i * 2.17, amp: .034 + i * .007, freq: 1.5 + i * .27, base: .585 + i * .044, par: .005 + i * .0045, k: i / 8 });

  function hex(c) { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mixHex(a, b, k) { const A = hex(a), B = hex(b); return "rgb(" + Math.round(A[0] + (B[0] - A[0]) * k) + "," + Math.round(A[1] + (B[1] - A[1]) * k) + "," + Math.round(A[2] + (B[2] - A[2]) * k) + ")"; }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let ink = PAPER.ink, accent = PAPER.accent, bg0 = PAPER.bg0, bg1 = PAPER.bg1;
  const inkA = (a) => "rgba(" + ink[0] + "," + ink[1] + "," + ink[2] + "," + a + ")";

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeStars();
  }
  function makeStars() {
    const n = Math.round(clamp(W * H / 6200, 110, 340));
    stars = [];
    for (let i = 0; i < n; i++) {
      const bx = Math.random() * W, by = Math.random() * H * .62;
      stars.push({ bx, by, x: bx, y: by, r: Math.random() < .12 ? 2.2 + Math.random() * 1.4 : .8 + Math.random() * 1.2, ph: Math.random() * 6.283, sp: .5 + Math.random() * 1.6, cross: Math.random() < .3 });
    }
  }
  function ridgeY(r, x, px, bulge) {
    const u = (x + px) / W;
    const n = Math.sin(u * r.freq * 6.283 + r.seed) + .5 * Math.sin(u * r.freq * 2.3 * 6.283 + r.seed * 1.7) + .25 * Math.sin(u * r.freq * 5.1 * 6.283 + r.seed * .3);
    let y = (r.base + r.amp * n / 1.75) * H;
    if (bulge > 0) { const d = (x - mouse.x) / 150; y -= bulge * Math.exp(-d * d) * 26 * (.25 + r.k * .75); }
    return y;
  }

  function draw(dt) {
    t += dt;
    paper += (target - paper) * Math.min(1, dt * 3);
    if (Math.abs(target - paper) < .002) paper = target;
    hoverK += (((mouse.inside || dancing) ? 1 : 0) - hoverK) * Math.min(1, dt * 4);
    mouse.x += (mouse.tx - mouse.x) * (reduce ? 1 : .18);
    mouse.y += (mouse.ty - mouse.y) * (reduce ? 1 : .18);
    ink = [0, 1, 2].map((i) => Math.round(GRAPH.ink[i] + (PAPER.ink[i] - GRAPH.ink[i]) * paper));
    accent = mixHex(GRAPH.accent, PAPER.accent, paper); bg0 = mixHex(GRAPH.bg0, PAPER.bg0, paper); bg1 = mixHex(GRAPH.bg1, PAPER.bg1, paper);

    // sheet
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, bg0); g.addColorStop(1, bg1);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // drafting dot grid
    ctx.fillStyle = inkA(.13);
    for (let y = 12; y < H; y += 24) for (let x = 12; x < W; x += 24) ctx.fillRect(x, y, 1.2, 1.2);

    // drafting sun (paper) / moon (graphite)
    const sx = W * .86, sy = H * .19;
    if (paper > .01) {
      ctx.save(); ctx.globalAlpha = paper;
      ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(sx, sy, 26, 0, 6.283); ctx.fill();
      ctx.strokeStyle = accent; ctx.lineWidth = 1; ctx.setLineDash([2, 5]); ctx.beginPath(); ctx.arc(sx, sy, 44, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = inkA(.5); ctx.beginPath(); ctx.moveTo(sx - 60, sy); ctx.lineTo(sx - 50, sy); ctx.moveTo(sx + 50, sy); ctx.lineTo(sx + 60, sy); ctx.moveTo(sx, sy - 60); ctx.lineTo(sx, sy - 50); ctx.stroke();
      ctx.restore();
    }
    if (paper < .99) {
      ctx.save(); ctx.globalAlpha = 1 - paper;
      ctx.fillStyle = "rgb(" + GRAPH.ink.join(",") + ")"; ctx.beginPath(); ctx.arc(sx, sy, 26, 0, 6.283); ctx.fill();
      ctx.fillStyle = bg0; ctx.beginPath(); ctx.arc(sx - 11, sy - 6, 22, 0, 6.283); ctx.fill();
      ctx.strokeStyle = "rgba(236,232,225,.5)"; ctx.lineWidth = 1; ctx.setLineDash([2, 5]); ctx.beginPath(); ctx.arc(sx, sy, 44, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
    }

    // survey marks
    const near = [], R = 150, cx = W / 2, cy = H * .35;
    ctx.lineWidth = 1;
    for (const s of stars) {
      let gx = s.bx, gy = s.by;
      if (dancing) {
        const dx = s.bx - cx, dy = s.by - cy, a = Math.atan2(dy, dx) + t * .9, d = Math.hypot(dx, dy) * (.85 + .15 * Math.sin(t * 2 + s.ph));
        gx = cx + Math.cos(a) * d; gy = cy + Math.sin(a) * d;
      } else if (mouse.inside) {
        const dx = mouse.x - s.bx, dy = mouse.y - s.by, d = Math.hypot(dx, dy);
        if (d < R) { const k = (1 - d / R) * .35; gx = s.bx + dx * k; gy = s.by + dy * k; }
      }
      s.x += (gx - s.x) * (reduce ? 1 : .12); s.y += (gy - s.y) * (reduce ? 1 : .12);
      const tw = reduce ? .7 : .45 + .35 * Math.sin(t * s.sp + s.ph);
      if (s.cross) {
        ctx.strokeStyle = inkA(tw); ctx.beginPath(); ctx.moveTo(s.x - s.r * 1.6, s.y); ctx.lineTo(s.x + s.r * 1.6, s.y); ctx.moveTo(s.x, s.y - s.r * 1.6); ctx.lineTo(s.x, s.y + s.r * 1.6); ctx.stroke();
      } else {
        ctx.fillStyle = inkA(tw); ctx.beginPath(); ctx.arc(s.x, s.y, s.r * .6, 0, 6.283); ctx.fill();
      }
      if (mouse.inside && Math.hypot(mouse.x - s.x, mouse.y - s.y) < R) near.push(s);
    }
    if (near.length) {
      near.sort((a, b) => Math.hypot(mouse.x - a.x, mouse.y - a.y) - Math.hypot(mouse.x - b.x, mouse.y - b.y));
      const k = near.slice(0, 26);
      ctx.strokeStyle = accent; ctx.lineWidth = .9;
      for (let i = 0; i < k.length; i++) {
        const a = k[i], da = Math.hypot(mouse.x - a.x, mouse.y - a.y);
        ctx.globalAlpha = (1 - da / R) * .75;
        ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(a.x, a.y); ctx.stroke();
        for (let j = i + 1; j < k.length; j++) {
          const b = k[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 80) { ctx.globalAlpha = (1 - d / 80) * .4; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
      }
      ctx.globalAlpha = 1;
    }

    // a streak, now and then
    if (!reduce) {
      nextShoot -= dt;
      if (!shooting && nextShoot <= 0) { shooting = { x: Math.random() * W * .7, y: Math.random() * H * .25, vx: 520 + Math.random() * 300, vy: 180 + Math.random() * 120, life: .9 }; nextShoot = 4 + Math.random() * 7; }
      if (shooting) {
        const s = shooting; s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
        const len = 110, m = Math.hypot(s.vx, s.vy), nx = s.vx / m, ny = s.vy / m;
        const lg = ctx.createLinearGradient(s.x, s.y, s.x - nx * len, s.y - ny * len);
        lg.addColorStop(0, accent); lg.addColorStop(1, "rgba(255,74,0,0)");
        ctx.globalAlpha = Math.min(1, s.life * 2); ctx.strokeStyle = lg; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - nx * len, s.y - ny * len); ctx.stroke(); ctx.globalAlpha = 1;
        if (s.life <= 0 || s.x > W + 200) shooting = null;
      }
    }

    // contour ridgelines, far to near
    const mxn = mouse.inside ? (mouse.x / W - .5) : 0;
    for (const r of ridges) {
      const px = -mxn * W * r.par;
      ctx.beginPath(); ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 5) ctx.lineTo(x, ridgeY(r, x, px, hoverK));
      ctx.lineTo(W, H); ctx.closePath();
      ctx.fillStyle = bg1; ctx.globalAlpha = .34; ctx.fill(); ctx.globalAlpha = 1;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 5) { const y = ridgeY(r, x, px, hoverK); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.strokeStyle = inkA(.22 + .65 * r.k); ctx.lineWidth = .8 + r.k * .9; ctx.stroke();
    }
    // fade into the page
    const pageBg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || bg0;
    const fog = ctx.createLinearGradient(0, H * .82, 0, H);
    fog.addColorStop(0, "rgba(0,0,0,0)"); fog.addColorStop(1, pageBg);
    ctx.fillStyle = fog; ctx.fillRect(0, H * .82, W, H * .18);
  }

  function loop(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (running && visible) draw(dt);
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
    mouse.inside = mouse.ty >= 0 && mouse.ty <= r.height && mouse.tx >= 0 && mouse.tx <= r.width;
  }, { passive: true });
  window.addEventListener("pointerleave", () => { mouse.inside = false; });
  document.addEventListener("visibilitychange", () => { running = !document.hidden; last = performance.now(); });
  if ("IntersectionObserver" in window) new IntersectionObserver((en) => { visible = en[0].isIntersecting; last = performance.now(); }).observe(canvas);

  resize();
  requestAnimationFrame(loop);

  window.BSS_SKY = {
    setDay(b) { target = b ? 1 : 0; },
    setDance(b) { dancing = !!b; },
    get starCount() { return stars.length; }
  };
})();
