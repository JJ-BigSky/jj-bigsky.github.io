/* Site wiring: theme toggle, navigation, reticle, typed hero headline,
   conveyor scroll progress, and contact form. */
(function () {
  const $ = (id) => document.getElementById(id);
  const cfg = window.BSS_CONFIG || {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = document.documentElement;

  // ---- toast ----
  const toast = document.createElement("div"); toast.className = "toast"; document.body.appendChild(toast);
  let toastT;
  window.BSS_TOAST = (msg) => { toast.textContent = msg; toast.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove("is-on"), 2400); };

  // ---- theme ----
  const themeBtn = $("themeToggle");
  function applyTheme(t) {
    html.dataset.theme = t;
    const tl = $("themeLabel"); if (tl) tl.textContent = t;
    if (themeBtn) themeBtn.setAttribute("aria-pressed", String(t === "graphite"));
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", t === "paper" ? "#ECE9E2" : "#161616");
    window.BSS_SKY && window.BSS_SKY.setDay(t === "paper");
    document.dispatchEvent(new CustomEvent("bss:theme", { detail: t }));
    try { localStorage.setItem("bss.theme", t); } catch (e) {}
  }
  let saved = null; try { saved = localStorage.getItem("bss.theme"); } catch (e) {}
  applyTheme(saved === "graphite" ? "graphite" : "paper");
  if (themeBtn) themeBtn.addEventListener("click", () => {
    applyTheme(html.dataset.theme === "paper" ? "graphite" : "paper");
  });

  // ---- nav ----
  const burger = $("navBurger"), links = $("navLinks");
  if (burger && links) {
    burger.addEventListener("click", () => { const open = links.classList.toggle("is-open"); burger.setAttribute("aria-expanded", String(open)); });
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { links.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }));
  }
  const sections = ["loop", "services", "method", "builder", "contact"].map((id) => $(id)).filter(Boolean);
  const toTop = $("toTop");
  function onScroll() {
    const y = window.scrollY + 140;
    let cur = null; sections.forEach((s) => { if (s.offsetTop <= y) cur = s.id; });
    if (links) links.querySelectorAll("a").forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + cur));
    if (toTop) toTop.hidden = window.scrollY < 600;
    updateBelt();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));

  // ---- typed headline ----
  const typed = $("typed");
  if (typed && !reduce) {
    const words = ["ship.", "work.", "hold tolerance.", "pass audit.", "ship."];
    let wi = 0;
    function typeWord(word, done) {
      let i = 0; typed.textContent = "";
      const iv = setInterval(() => { i++; typed.textContent = word.slice(0, i); if (i >= word.length) { clearInterval(iv); done(); } }, 70);
    }
    function eraseWord(done) {
      const iv = setInterval(() => { typed.textContent = typed.textContent.slice(0, -1); if (!typed.textContent.length) { clearInterval(iv); done(); } }, 40);
    }
    function cycle() {
      wi = (wi + 1) % words.length;
      setTimeout(() => eraseWord(() => typeWord(words[wi], () => { if (wi !== 0 && wi !== words.length - 1) cycle(); else setTimeout(cycle, 6000); })), 2600);
    }
    setTimeout(cycle, 3500);
  }

  // ---- cursor reticle ----
  const ret = $("reticle"), retLabel = $("reticleLabel");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (cfg.reticle !== false && fine && !reduce && ret) {
    html.classList.add("has-reticle");
    let rx = -100, ry = -100, tx = -100, ty = -100;
    window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    window.addEventListener("pointerdown", () => ret.classList.add("is-down"));
    window.addEventListener("pointerup", () => ret.classList.remove("is-down"));
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest && e.target.closest("[data-cursor], a, button, .tile, .opt, input, textarea, select, label");
      if (t) { ret.classList.add("is-hover"); retLabel.textContent = t.dataset.cursor || (t.matches("input,textarea,select,label") ? "TYPE" : t.matches("a") ? "GO" : "PRESS"); }
      else ret.classList.remove("is-hover");
    }, { passive: true });
    (function follow() { rx += (tx - rx) * .35; ry += (ty - ry) * .35; ret.style.transform = "translate(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px)"; requestAnimationFrame(follow); })();
    document.addEventListener("pointerleave", () => { ret.style.opacity = "0"; });
    document.addEventListener("pointerenter", () => { ret.style.opacity = ""; });
  }

  // ---- service spec cards: ensure links are always keyboard-accessible ----
  document.querySelectorAll(".card").forEach((card) => {
    card.removeAttribute("tabindex");
    if (card.dataset.cursor === "FLIP") delete card.dataset.cursor;
    card.querySelectorAll(".card__back a").forEach((a) => { a.removeAttribute("tabindex"); });
  });

  // ---- conveyor belt driven by scroll ----
  const beltWrap = $("beltWrap"), part = $("beltPart"), stations = Array.from(document.querySelectorAll(".station"));
  function updateBelt() {
    if (!beltWrap || !part) return;
    const r = beltWrap.getBoundingClientRect(), vh = window.innerHeight;
    let p = (vh * .9 - r.top) / (vh * .9 + r.height * .6);
    p = Math.max(0, Math.min(1, p));
    const pct = 8 + p * 84;
    part.style.setProperty("--p", pct.toFixed(2));
    const idx = Math.min(4, Math.floor(p * 5));
    stations.forEach((s, i) => { s.classList.toggle("is-active", i === idx); s.classList.toggle("is-done", i < idx); });
  }

  // ---- contact ----
  const ce = $("copyEmail"); if (ce) ce.addEventListener("click", async () => {
    const email = cfg.email || "build@bigsky.systems";
    try { await navigator.clipboard.writeText(email); window.BSS_TOAST("Copied " + email); }
    catch (e) { window.BSS_TOAST("Select and copy: " + email); }
  });
  const cf = $("contactForm"); if (cf) cf.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target), name = f.get("name") || "", org = f.get("org") || "", msg = f.get("msg") || "", budget = f.get("budget") || "";
    const subject = "Robotics lab inquiry" + (org ? " — " + org : "");
    const body = ["Hi Big Sky Systems,", "", msg || "[what we're building]", "", "Budget band: " + (budget || "n/a"), "", "— " + (name || "[name]") + (org ? ", " + org : ""), ""].join("\n");
    window.location.href = "mailto:" + (cfg.email || "build@bigsky.systems") + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    window.BSS_TOAST("Opening your mail app…");
  });
  if ($("year")) $("year").textContent = new Date().getFullYear();

  onScroll();
})();
