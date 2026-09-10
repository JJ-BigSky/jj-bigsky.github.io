/* Hero sky: stars that constellate around your cursor, shooting stars,
   parallax ridgelines, and a night <-> day crossfade tied to the theme. */
(function () {
  const canvas = document.getElementById("sky");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, dpr = 1;
  let stars = [], clouds = [];
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, inside: false };
  let dayness = document.documentElement.dataset.theme === "day" ? 1 : 0;
  let targetDay = dayness;
  let dancing = false, running = true, visible = true;
  let shooting = null, nextShoot = 2 + Math.random() * 4;
  let last = performance.now(), t = 0;

  const ridges = [
    { seed: 1.3, amp: .06, freq: 2.1, base: .68, night: "#0f1a36", day: "#bcd6ee", par: .012 },
    { seed: 4.7, amp: .08, freq: 3.2, base: .77, night: "#0a1226", day: "#8fb3d6", par: .024 },
    { seed: 9.1, amp: .07, freq: 4.0, base: .86, night: "#04070f", day: "#5b84ad", par: .04 }
  ];
  const NIGHT_TOP = "#05080f", NIGHT_BOT = "#101c3f", DAY_TOP = "#5fb2f5", DAY_BOT = "#e6f2ff";
  const STAR_COLORS = ["#ffffff", "#e8eefc", "#cfe8ff", "#7dd3fc", "#ffd9a0"];

  function hex(c) { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mix(a, b, k) {
    const A = hex(a), B = hex(b);
    return "rgb(" + Math.round(A[0] + (B[0] - A[0]) * k) + "," + Math.round(A[1] + (B[1] - A[1]) * k) + "," + Math.round(A[2] + (B[2] - A[2]) * k) + ")";
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeStars(); makeClouds();
  }

  function makeStars() {
    const n = Math.round(clamp(W * H / 5200, 140, 460));
    stars = [];
    for (let i = 0; i < n; i++) {
      const bx = Math.random() * W, by = Math.random() * H * .78;
      stars.push({ bx, by, x: bx, y: by, r: Math.random() < .08 ? 1.6 + Math.random() * 1.2 : .5 + Math.random() * 1.1,
        ph: Math.random() * 6.283, sp: .6 + Math.random() * 1.8, c: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)] });
    }
  }
  function makeClouds() {
    clouds = [];
    for (let i = 0; i < 7; i++) clouds.push({ x: Math.random() * 1.2 - .1, y: .08 + Math.random() * .38, s: .5 + Math.random() * .7, v: .004 + Math.random() * .008 });
  }

  function ridgeY(r, x, px) {
    const u = (x + px) / W;
    const n = Math.sin(u * r.freq * 6.283 + r.seed) + .5 * Math.sin(u * r.freq * 2.3 * 6.283 + r.seed * 1.7) + .25 * Math.sin(u * r.freq * 5.1 * 6.283 + r.seed * .3);
    return (r.base + r.amp * n / 1.75) * H;
  }

  function draw(dt) {
    t += dt;
    dayness += (targetDay - dayness) * Math.min(1, dt * 2.5);
    if (Math.abs(targetDay - dayness) < .002) dayness = targetDay;
    mouse.x += (mouse.tx - mouse.x) * (reduce ? 1 : .18);
    mouse.y += (mouse.ty - mouse.y) * (reduce ? 1 : .18);

    // sky
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, mix(NIGHT_TOP, DAY_TOP, dayness));
    g.addColorStop(1, mix(NIGHT_BOT, DAY_BOT, dayness));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // sun & moon
    const sunY = H * (0.95 - 0.78 * dayness), sunX = W * .8;
    if (dayness > 0.01) {
      ctx.save(); ctx.globalAlpha = dayness;
      const sg = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 180);
      sg.addColorStop(0, "rgba(255,220,120,.9)"); sg.addColorStop(1, "rgba(255,220,120,0)");
      ctx.fillStyle = sg; ctx.fillRect(sunX - 180, sunY - 180, 360, 360);
      ctx.fillStyle = "#fde68a"; ctx.beginPath(); ctx.arc(sunX, sunY, 34, 0, 6.283); ctx.fill();
      ctx.restore();
    }
    if (dayness < 0.99) {
      const mx = W * .82, my = H * .2;
      ctx.save(); ctx.globalAlpha = 1 - dayness;
      const mg = ctx.createRadialGradient(mx, my, 20, mx, my, 120);
      mg.addColorStop(0, "rgba(200,220,255,.25)"); mg.addColorStop(1, "rgba(200,220,255,0)");
      ctx.fillStyle = mg; ctx.fillRect(mx - 120, my - 120, 240, 240);
      ctx.fillStyle = "#e8eefc"; ctx.beginPath(); ctx.arc(mx, my, 26, 0, 6.283); ctx.fill();
      ctx.fillStyle = mix(NIGHT_TOP, DAY_TOP, dayness); ctx.beginPath(); ctx.arc(mx - 12, my - 6, 22, 0, 6.283); ctx.fill();
      ctx.restore();
    }

    // stars
    const starAlpha = 1 - dayness;
    const near = [];
    const R = 150, cx = W / 2, cy = H * .38;
    if (starAlpha > .01) {
      for (const s of stars) {
        let gx = s.bx, gy = s.by;
        if (dancing) {
          const dx = s.bx - cx, dy = s.by - cy, a = Math.atan2(dy, dx) + t * .9, d = Math.hypot(dx, dy) * (0.85 + .15 * Math.sin(t * 2 + s.ph));
          gx = cx + Math.cos(a) * d; gy = cy + Math.sin(a) * d;
        } else if (mouse.inside) {
          const dx = mouse.x - s.bx, dy = mouse.y - s.by, d = Math.hypot(dx, dy);
          if (d < R) { const k = (1 - d / R) * .35; gx = s.bx + dx * k; gy = s.by + dy * k; }
        }
        s.x += (gx - s.x) * (reduce ? 1 : .12); s.y += (gy - s.y) * (reduce ? 1 : .12);
        const tw = reduce ? .85 : .55 + .45 * Math.sin(t * s.sp + s.ph);
        ctx.globalAlpha = starAlpha * tw;
        ctx.fillStyle = s.c;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
        if (mouse.inside && Math.hypot(mouse.x - s.x, mouse.y - s.y) < R) near.push(s);
      }
      // constellation lines near the cursor
      if (near.length) {
        near.sort((a, b) => Math.hypot(mouse.x - a.x, mouse.y - a.y) - Math.hypot(mouse.x - b.x, mouse.y - b.y));
        const k = near.slice(0, 28);
        ctx.lineWidth = 1;
        for (let i = 0; i < k.length; i++) {
          const a = k[i];
          const da = Math.hypot(mouse.x - a.x, mouse.y - a.y);
          ctx.globalAlpha = starAlpha * (1 - da / R) * .55;
          ctx.strokeStyle = "#7dd3fc";
          ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(a.x, a.y); ctx.stroke();
          for (let j = i + 1; j < k.length; j++) {
            const b = k[j], d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 80) { ctx.globalAlpha = starAlpha * (1 - d / 80) * .35; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
          }
        }
      }
      ctx.globalAlpha = 1;

      // shooting star
      if (!reduce) {
        nextShoot -= dt;
        if (!shooting && nextShoot <= 0) {
          shooting = { x: Math.random() * W * .7, y: Math.random() * H * .25, vx: 520 + Math.random() * 300, vy: 180 + Math.random() * 120, life: .9 };
          nextShoot = 3 + Math.random() * 6;
        }
        if (shooting) {
          const s = shooting; s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
          const len = 120, nx = s.vx / Math.hypot(s.vx, s.vy), ny = s.vy / Math.hypot(s.vx, s.vy);
          const lg = ctx.createLinearGradient(s.x, s.y, s.x - nx * len, s.y - ny * len);
          lg.addColorStop(0, "rgba(255,255,255," + (.9 * starAlpha * Math.min(1, s.life * 2)) + ")"); lg.addColorStop(1, "rgba(255,255,255,0)");
          ctx.strokeStyle = lg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - nx * len, s.y - ny * len); ctx.stroke();
          if (s.life <= 0 || s.x > W + 200) shooting = null;
        }
      }
    }

    // clouds (day)
    if (dayness > .02) {
      ctx.save(); ctx.globalAlpha = dayness * .8; ctx.fillStyle = "#ffffff";
      for (const c of clouds) {
        if (!reduce) c.x += c.v * dt; if (c.x > 1.2) c.x = -.25;
        const x = c.x * W, y = c.y * H, s = c.s * 40;
        ctx.beginPath();
        ctx.arc(x, y, s, 0, 6.283); ctx.arc(x + s * 1.1, y - s * .4, s * 1.2, 0, 6.283); ctx.arc(x + s * 2.3, y, s * .95, 0, 6.283); ctx.arc(x + s * 1.2, y + s * .35, s * .9, 0, 6.283);
        ctx.fill();
      }
      ctx.restore();
    }

    // ridges with parallax
    const mxn = mouse.inside ? (mouse.x / W - .5) : 0;
    for (const r of ridges) {
      const px = mxn * W * r.par * -1;
      ctx.fillStyle = mix(r.night, r.day, dayness);
      ctx.beginPath(); ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 6) ctx.lineTo(x, ridgeY(r, x, px));
      ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
    }
    // valley fog blends into the page background
    const fog = ctx.createLinearGradient(0, H * .8, 0, H);
    const pageBg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#070b16";
    fog.addColorStop(0, "rgba(0,0,0,0)"); fog.addColorStop(1, pageBg);
    ctx.fillStyle = fog; ctx.fillRect(0, H * .8, W, H * .2);
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
    setDay(b) { targetDay = b ? 1 : 0; },
    setDance(b) { dancing = !!b; },
    get starCount() { return stars.length; }
  };
})();
