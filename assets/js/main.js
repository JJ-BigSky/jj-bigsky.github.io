/* Wiring: boot, theme, sound, nav, reticle, reveal, telemetry, conveyor,
   tilt cards, contact form, dance mode, easter eggs. */
(function () {
  const $ = (id) => document.getElementById(id);
  const cfg = window.BSS_CONFIG || {};
  const S = () => window.BSS_SOUND, M = () => window.BSS_MASCOT;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = document.documentElement;

  // ---- toast ----
  const toast = document.createElement("div"); toast.className = "toast"; document.body.appendChild(toast);
  let toastT;
  window.BSS_TOAST = (msg) => { toast.textContent = msg; toast.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove("is-on"), 2400); };

  // ---- theme ----
  const themeBtn = $("themeToggle");
  function applyTheme(t, silent) {
    html.dataset.theme = t;
    const tl = $("themeLabel"); if (tl) tl.textContent = t;
    themeBtn.setAttribute("aria-pressed", String(t === "graphite"));
    document.querySelector('meta[name="theme-color"]').setAttribute("content", t === "paper" ? "#ECE9E2" : "#161616");
    window.BSS_SKY && window.BSS_SKY.setDay(t === "paper");
    document.dispatchEvent(new CustomEvent("bss:theme", { detail: t }));
    try { localStorage.setItem("bss.theme", t); } catch (e) {}
    if (!silent && S()) S().click();
  }
  let saved = null; try { saved = localStorage.getItem("bss.theme"); } catch (e) {}
  applyTheme(saved === "graphite" ? "graphite" : "paper", true);
  themeBtn.addEventListener("click", () => {
    const next = html.dataset.theme === "paper" ? "graphite" : "paper";
    applyTheme(next);
    if (!applyTheme.said) { applyTheme.said = true; M() && M().say(next === "paper" ? "Paper. Bright, but a good bright." : "Graphite. My screen thanks you.", { mood: "smirk" }); }
  });

  // ---- sound ----
  const soundBtn = $("soundToggle");
  function syncSound() { soundBtn.setAttribute("aria-pressed", S().enabled ? "true" : "false"); const sl = $("soundLabel"); if (sl) sl.textContent = S().enabled ? "Snd on" : "Snd off"; }
  syncSound();
  soundBtn.addEventListener("click", () => { S().enabled = !S().enabled; syncSound(); window.BSS_TOAST(S().enabled ? "Beeps on. SKY-1 can now bleep." : "Beeps off."); });
  document.addEventListener("click", (e) => { if (e.target.closest && e.target.closest(".btn, .chip, .pal") && S()) S().tick(); }, true);

  // ---- boot ----
  const boot = $("boot");
  function finishBoot() { boot.classList.add("is-done"); setTimeout(() => { boot.hidden = true; }, 600); if (!finishBoot.done) { finishBoot.done = true; setTimeout(() => M() && M().say("Hi. I'm SKY-1. I live here. Hover the stars, they like attention.", { mood: "happy" }), 900); } }
  let seen = false; try { seen = sessionStorage.getItem("bss.booted") === "1"; } catch (e) {}
  if (!cfg.boot || reduce || seen) { boot.hidden = true; setTimeout(() => M() && M().say("Welcome back. The stars are where you left them.", {}), 1200); }
  else {
    try { sessionStorage.setItem("bss.booted", "1"); } catch (e) {}
    const lines = [["mounting robot arm", "ok"], ["calibrating joints", "ok"], ["counting stars", String(window.BSS_SKY ? window.BSS_SKY.starCount : 300)], ["waking SKY-1", "ok"], ["brewing coffee", "skipped", true], ["opening the sky", "ok"]];
    const log = $("bootLog"), bar = $("bootBar");
    lines.forEach((l, i) => setTimeout(() => {
      const li = document.createElement("li"); li.innerHTML = "<span>> " + l[0] + "…</span><b" + (l[2] ? ' class="warn"' : "") + ">" + l[1] + "</b>"; log.appendChild(li);
      bar.style.width = Math.round((i + 1) / lines.length * 100) + "%"; if (S()) S().tick();
    }, 140 + i * 190));
    setTimeout(finishBoot, 140 + lines.length * 190 + 350);
    $("bootSkip").addEventListener("click", finishBoot);
  }

  // ---- nav ----
  const burger = $("navBurger"), links = $("navLinks");
  burger.addEventListener("click", () => { const open = links.classList.toggle("is-open"); burger.setAttribute("aria-expanded", String(open)); });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { links.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }));
  const sections = ["services", "playground", "builder", "method", "diagnostic", "contact"].map((id) => $(id)).filter(Boolean);
  const toTop = $("toTop");
  function onScroll() {
    const y = window.scrollY + 140;
    let cur = null; sections.forEach((s) => { if (s.offsetTop <= y) cur = s.id; });
    links.querySelectorAll("a").forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + cur));
    toTop.hidden = window.scrollY < 600;
    updateBelt();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));

  // ---- reveal ----
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
    document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + "ms"; io.observe(el); });
  } else document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));

  // ---- typed headline ----
  const typed = $("typed");
  if (typed && !reduce) {
    const words = ["ship.", "shi— ship.", "work.", "stay boring.", "pass audit.", "ship."];
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

  // ---- telemetry ----
  const t0 = Date.now();
  const tStars = $("tStars"), tTime = $("tTime"), tCursor = $("tCursor"), tCoffee = $("tCoffee"), tUptime = $("tUptime");
  let moved = 0;
  window.addEventListener("pointermove", () => { moved++; }, { passive: true });
  setInterval(() => {
    if (window.BSS_SKY) tStars.textContent = window.BSS_SKY.starCount.toLocaleString();
    try { tTime.textContent = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: cfg.labTimeZone || "America/Denver" }).format(new Date()); } catch (e) { tTime.textContent = new Date().toLocaleTimeString(); }
    tCursor.textContent = moved > 3 ? "TRACKING" : "SEARCHING"; moved = 0;
    const up = Math.round((Date.now() - t0) / 1000); tUptime.textContent = up < 60 ? up + "s" : Math.floor(up / 60) + "m " + (up % 60) + "s";
    tCoffee.textContent = Math.max(12, 87 - Math.floor(up / 45)) + "%";
  }, 1000);

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
      const t = e.target.closest && e.target.closest("[data-cursor], a, button, .tile, .opt, .card, input, textarea, select, label");
      if (t) { ret.classList.add("is-hover"); retLabel.textContent = t.dataset.cursor || (t.matches("input,textarea,select,label") ? "TYPE" : t.matches("a") ? "GO" : "PRESS"); }
      else ret.classList.remove("is-hover");
    }, { passive: true });
    (function follow() { rx += (tx - rx) * .35; ry += (ty - ry) * .35; ret.style.transform = "translate(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px)"; requestAnimationFrame(follow); })();
    document.addEventListener("pointerleave", () => { ret.style.opacity = "0"; });
    document.addEventListener("pointerenter", () => { ret.style.opacity = ""; });
  }

  // ---- 3D tilt + flip cards ----
  document.querySelectorAll(".card").forEach((card) => {
    const flip = () => { card.classList.toggle("is-flipped"); if (S()) S().click(); };
    card.addEventListener("click", flip);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
    if (fine && !reduce) {
      card.addEventListener("pointermove", (e) => { const r = card.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; card.style.transform = "rotateX(" + (-y * 8).toFixed(2) + "deg) rotateY(" + (x * 10).toFixed(2) + "deg)"; });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    }
  });

  // ---- conveyor belt driven by scroll ----
  const beltWrap = $("beltWrap"), part = $("beltPart"), stations = Array.from(document.querySelectorAll(".station"));
  let lastStation = -1;
  function updateBelt() {
    if (!beltWrap) return;
    const r = beltWrap.getBoundingClientRect(), vh = window.innerHeight;
    let p = (vh * .9 - r.top) / (vh * .9 + r.height * .6);
    p = Math.max(0, Math.min(1, p));
    const pct = 8 + p * 84;
    part.style.setProperty("--p", pct.toFixed(2));
    const idx = Math.min(4, Math.floor(p * 5));
    stations.forEach((s, i) => { s.classList.toggle("is-active", i === idx); s.classList.toggle("is-done", i < idx); });
    if (idx !== lastStation) { lastStation = idx; if (S()) S().tick(); }
  }
  // ---- contact ----
  $("copyEmail").addEventListener("click", async () => {
    const email = cfg.email || "jj@bigsky.systems";
    try { await navigator.clipboard.writeText(email); window.BSS_TOAST("Copied " + email); if (S()) S().success(); }
    catch (e) { window.BSS_TOAST("Select and copy: " + email); }
  });
  $("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target), name = f.get("name") || "", org = f.get("org") || "", msg = f.get("msg") || "", budget = f.get("budget") || "";
    const subject = "Robotics lab inquiry" + (org ? " — " + org : "");
    const body = ["Hi Big Sky Systems,", "", msg || "[what we're building]", "", "Budget band: " + (budget || "n/a"), "", "— " + (name || "[name]") + (org ? ", " + org : ""), ""].join("\n");
    window.location.href = "mailto:" + (cfg.email || "jj@bigsky.systems") + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    window.BSS_TOAST("Opening your mail app…"); if (S()) S().success();
    M() && M().say("Off it goes. Well, off it goes once you press send in your mail app. I can't do that part.", { mood: "wow" });
  });
  $("year").textContent = new Date().getFullYear();

  // ---- dance mode + Konami ----
  let danceT = null;
  window.BSS_DANCE = function (on) {
    const turnOn = on === undefined ? !document.body.classList.contains("is-dancing") : !!on;
    document.body.classList.toggle("is-dancing", turnOn);
    window.BSS_ARM && window.BSS_ARM.dance(turnOn);
    window.BSS_SKY && window.BSS_SKY.setDance(turnOn);
    clearTimeout(danceT);
    if (turnOn) { if (S()) S().dance(); M() && M().say("DANCE PROTOCOL ENGAGED.", { mood: "wow", priority: true, ms: 2500 }); danceT = setTimeout(() => window.BSS_DANCE(false), 7000); }
  };
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let kpos = 0;
  document.addEventListener("keydown", (e) => { kpos = e.key === KONAMI[kpos] ? kpos + 1 : (e.key === KONAMI[0] ? 1 : 0); if (kpos === KONAMI.length) { kpos = 0; window.BSS_DANCE(true); } });
  // type "robot" anywhere outside inputs
  let buf = "";
  document.addEventListener("keypress", (e) => { if (/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName)) return; buf = (buf + e.key).slice(-5); if (buf === "robot") { buf = ""; M() && M().say("You typed 'robot'. I felt that.", { mood: "wow", priority: true }); M() && M().excite(); } });

  // brand click x5 = dance
  let brandClicks = 0, brandT;
  document.querySelector(".nav__brand").addEventListener("click", () => { brandClicks++; clearTimeout(brandT); brandT = setTimeout(() => { brandClicks = 0; }, 1500); if (brandClicks >= 5) { brandClicks = 0; window.BSS_DANCE(true); } });

  onScroll();
})();
