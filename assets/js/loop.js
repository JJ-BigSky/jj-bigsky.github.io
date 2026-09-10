/* The loop: an orange part travels the closed path on the home page, one lap
   every twelve seconds. Hover or focus a station and it comes to you and waits.
   Static at PERCEIVE under reduced motion. Idle while scrolled out of view. */
(function () {
  const svg = document.getElementById("loopSvg");
  if (!svg) return;
  const path = document.getElementById("loopPath"), dot = document.getElementById("loopDot");
  const nodes = Array.from(document.querySelectorAll(".loop__node"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const L = path.getTotalLength(), N = nodes.length, LAP = 12000;
  let t = 0, target = null, last = 0, visible = false, raf = 0;

  function place(u) {
    const p = path.getPointAtLength((((u % 1) + 1) % 1) * L);
    dot.setAttribute("transform", "translate(" + p.x.toFixed(1) + " " + p.y.toFixed(1) + ")");
  }
  place(0);
  if (reduce) return;

  nodes.forEach((n, i) => {
    const on = () => { target = i / N; }, off = () => { target = null; };
    n.addEventListener("pointerenter", on); n.addEventListener("pointerleave", off);
    n.addEventListener("focus", on); n.addEventListener("blur", off);
  });

  function frame(now) {
    const dt = Math.min(64, now - (last || now)); last = now;
    if (target === null) t = (t + dt / LAP) % 1;
    else { let d = target - t; d -= Math.round(d); t += d * (1 - Math.exp(-dt / 140)); }
    place(t);
    raf = visible ? requestAnimationFrame(frame) : 0;
  }
  function start() { if (!raf && visible) { last = 0; raf = requestAnimationFrame(frame); } }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; start(); }, { threshold: .05 }).observe(svg);
  } else { visible = true; start(); }
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") start(); });

  window.BSS_LOOP = { goto: (i) => { target = (i % N) / N; }, release: () => { target = null; } };
})();
