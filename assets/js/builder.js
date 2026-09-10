/* Lab Builder: click-to-place modules on an 8x6 floor. Live tallies and
   SKY-1's opinions about your layout. */
(function () {
  const floor = document.getElementById("floor");
  const palette = document.getElementById("palette");
  if (!floor || !palette) return;
  const $ = (id) => document.getElementById(id);
  const S = () => window.BSS_SOUND, M = () => window.BSS_MASCOT;
  const COLS = 8, ROWS = 6;

  const MODS = [
    { id: "cell", name: "Robot cell", icon: "i-cell", area: 9, kw: 6, cost: [60, 180], color: "#FF4A00", tag: "6-axis arm + controller" },
    { id: "amr", name: "AMR dock", icon: "i-amr", area: 6, kw: 1.5, cost: [25, 90], color: "#2C5DD6", tag: "mobile robot + station" },
    { id: "vision", name: "Vision station", icon: "i-eye", area: 4, kw: .8, cost: [15, 60], color: "#B8860B", tag: "cameras + lighting" },
    { id: "belt", name: "Conveyor", icon: "i-belt", area: 5, kw: 1.2, cost: [8, 30], color: "#8B5E3C", tag: "per segment" },
    { id: "fence", name: "Safety fence", icon: "i-fence", area: 2, kw: 0, cost: [3, 10], color: "#C62F1B", tag: "guarding + interlock" },
    { id: "bench", name: "Workbench", icon: "i-bench", area: 4, kw: .5, cost: [2, 8], color: "#3F7D4E", tag: "humans need tables" },
    { id: "plug", name: "Charging bay", icon: "i-plug", area: 3, kw: 3, cost: [5, 20], color: "#1F8A70", tag: "for the AMRs" },
    { id: "rack", name: "Server rack", icon: "i-rack", area: 2, kw: 4, cost: [10, 50], color: "#5B5B5B", tag: "compute + network" }
  ];
  const byId = Object.fromEntries(MODS.map((m) => [m.id, m]));
  const grid = new Array(COLS * ROWS).fill(null);
  let active = "cell";
  let lastNote = "";
  const tiles = [];

  // ---- palette ----
  MODS.forEach((m) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "pal" + (m.id === active ? " is-active" : ""); b.dataset.id = m.id; b.dataset.cursor = "PICK";
    b.innerHTML = '<svg><use href="#' + m.icon + '"/></svg><span>' + m.name + "<small>" + m.tag + "</small></span>";
    b.addEventListener("click", () => setActive(m.id));
    palette.appendChild(b);
  });
  const erase = document.createElement("button");
  erase.type = "button"; erase.className = "pal pal--erase"; erase.dataset.id = "erase"; erase.dataset.cursor = "ERASE";
  erase.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 20h16M6 16l8-8 4 4-6 6H6l-2-2 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Erase<small>or right-click a tile</small></span>';
  erase.addEventListener("click", () => setActive("erase"));
  palette.appendChild(erase);
  function setActive(id) { active = id; palette.querySelectorAll(".pal").forEach((b) => b.classList.toggle("is-active", b.dataset.id === id)); if (S()) S().tick(); }

  // ---- floor ----
  for (let i = 0; i < COLS * ROWS; i++) {
    const t = document.createElement("button");
    t.type = "button"; t.className = "tile"; t.setAttribute("role", "gridcell"); t.dataset.i = i; t.dataset.cursor = "PLACE";
    t.innerHTML = "<svg><use href=\"#i-cell\"/></svg>";
    t.addEventListener("click", () => place(i, active === "erase" ? null : (grid[i] === active ? null : active)));
    t.addEventListener("contextmenu", (e) => { e.preventDefault(); place(i, null); });
    floor.appendChild(t); tiles.push(t);
  }
  function label(i) { const r = Math.floor(i / COLS) + 1, c = (i % COLS) + 1; return "Row " + r + ", column " + c + ": " + (grid[i] ? byId[grid[i]].name : "empty"); }

  function place(i, id, silent) {
    const had = grid[i];
    grid[i] = id;
    const t = tiles[i];
    if (id) {
      const m = byId[id];
      t.querySelector("use").setAttribute("href", "#" + m.icon);
      t.style.setProperty("--mod", m.color);
      t.classList.add("has-mod");
      t.classList.remove("is-pop"); void t.offsetWidth; t.classList.add("is-pop");
      if (!silent && S()) S().place();
    } else {
      t.classList.remove("has-mod");
      if (had && !silent && S()) S().remove();
    }
    t.setAttribute("aria-label", label(i));
    if (!silent) recompute();
  }

  // ---- analysis ----
  function neighbors(i) {
    const r = Math.floor(i / COLS), c = i % COLS, out = [];
    if (r > 0) out.push(grid[i - COLS]); if (r < ROWS - 1) out.push(grid[i + COLS]);
    if (c > 0) out.push(grid[i - 1]); if (c < COLS - 1) out.push(grid[i + 1]);
    return out;
  }
  function pos(i) { return "(" + (Math.floor(i / COLS) + 1) + "," + ((i % COLS) + 1) + ")"; }

  function recompute() {
    const placed = grid.map((id, i) => ({ id, i })).filter((x) => x.id);
    const count = (id) => placed.filter((x) => x.id === id).length;
    let area = 0, kw = 0, lo = 0, hi = 0;
    placed.forEach(({ id }) => { const m = byId[id]; area += m.area; kw += m.kw; lo += m.cost[0]; hi += m.cost[1]; });
    tiles.forEach((t) => t.classList.remove("is-warn"));

    const warnings = [];
    let guarded = 0, cells = 0;
    placed.forEach(({ id, i }) => {
      const n = neighbors(i);
      if (id === "cell") {
        cells++;
        const fences = n.filter((x) => x === "fence").length, vision = n.some((x) => x === "vision");
        if (fences >= 2 || (fences >= 1 && vision)) guarded++;
        else { tiles[i].classList.add("is-warn"); warnings.push({ p: 1, t: "Uncaged robot at " + pos(i) + ". Bold. Give it two fence tiles, or one fence plus a vision station and call it a cobot." }); }
      }
      if (id === "belt" && !n.some((x) => x === "cell" || x === "belt" || x === "amr")) { tiles[i].classList.add("is-warn"); warnings.push({ p: 3, t: "A conveyor to nowhere at " + pos(i) + ". Very poetic. Put a robot cell next to it." }); }
      if (id === "vision" && !n.some((x) => x === "cell" || x === "belt" || x === "amr")) { tiles[i].classList.add("is-warn"); warnings.push({ p: 4, t: "That camera at " + pos(i) + " is looking at a wall. Give it something to see." }); }
    });
    if (count("amr") && !count("plug")) warnings.push({ p: 2, t: "Your AMRs have nowhere to charge. They'll be dead by lunch. Add a charging bay." });
    if (placed.length >= 4 && !count("rack")) warnings.push({ p: 5, t: "Where does the compute live? Add a server rack before someone runs ROS on a laptop under a desk." });
    if (placed.length >= 3 && !count("bench")) warnings.push({ p: 6, t: "No workbench. Where do the humans put the coffee?" });
    if (kw > 32) warnings.push({ p: 7, t: Math.round(kw) + " kW on one floor. Call an electrician before you call us." });
    if (count("fence") > 0 && cells === 0) warnings.push({ p: 8, t: "Fences with nothing inside. It's a very safe empty rectangle." });
    warnings.sort((a, b) => a.p - b.p);

    // stats
    setStat("sArea", area + " m²");
    setStat("sPower", (Math.round(kw * 10) / 10) + " kW");
    setStat("sBudget", placed.length ? money(lo) + " – " + money(hi) : "—");
    let safety = "—", safetyColor = "";
    if (cells) {
      const ratio = guarded / cells;
      safety = ratio === 1 ? "A · caged" : ratio >= .5 ? "B · mostly" : "C · yikes";
      safetyColor = ratio === 1 ? "var(--ok)" : ratio >= .5 ? "var(--sun)" : "var(--sunset)";
    } else if (placed.length) { safety = "n/a · no robots"; }
    setStat("sSafety", safety); $("sSafety").style.color = safetyColor;

    let note;
    if (!placed.length) note = "Place something and I'll start judging. Kindly.";
    else if (warnings.length) note = warnings[0].t + (warnings.length > 1 ? " (+" + (warnings.length - 1) + " more)" : "");
    else if (placed.length < 4) note = "Good start. Robots like company: add a conveyor or a vision station.";
    else note = ["Honestly? This is a nice lab. Email it to a human.", "No notes. I'm as surprised as you are.", "Guarded, powered, and somewhere to put the coffee. Ship it."][placed.length % 3];
    $("sNotes").textContent = note;
    if (note !== lastNote && placed.length) { lastNote = note; clearTimeout(recompute._t); recompute._t = setTimeout(() => { M() && M().say(note, { mood: warnings.length ? "flat" : "happy" }); }, 700); }
    recompute.current = { placed, area, kw, lo, hi, safety, warnings, note };
  }
  function money(k) { return k >= 1000 ? "$" + (Math.round(k / 100) / 10) + "M" : "$" + k + "k"; }
  function setStat(id, v) { const el = $(id); if (el.textContent !== v) { el.textContent = v; el.classList.remove("is-bump"); void el.offsetWidth; el.classList.add("is-bump"); } }

  // ---- actions ----
  const TEMPLATES = [
    [[1, 1, "fence"], [1, 2, "fence"], [1, 3, "fence"], [2, 1, "fence"], [2, 2, "cell"], [2, 3, "belt"], [2, 4, "belt"], [2, 5, "cell"], [2, 6, "fence"], [3, 1, "fence"], [3, 2, "fence"], [3, 3, "vision"], [3, 5, "fence"], [3, 6, "fence"], [1, 5, "fence"], [1, 6, "fence"], [5, 1, "bench"], [5, 2, "bench"], [5, 7, "rack"], [4, 7, "amr"], [5, 6, "plug"]],
    [[2, 3, "fence"], [2, 4, "cell"], [2, 5, "fence"], [3, 4, "vision"], [1, 4, "fence"], [4, 4, "belt"], [5, 4, "belt"], [6, 4, "amr"], [6, 6, "plug"], [1, 1, "rack"], [6, 1, "bench"], [6, 2, "bench"], [3, 7, "amr"], [2, 7, "plug"]],
    [[1, 2, "fence"], [1, 3, "fence"], [1, 4, "fence"], [1, 5, "fence"], [2, 2, "cell"], [2, 3, "belt"], [2, 4, "cell"], [2, 5, "belt"], [3, 2, "fence"], [3, 3, "vision"], [3, 4, "fence"], [3, 5, "fence"], [2, 1, "fence"], [2, 6, "fence"], [5, 3, "bench"], [5, 5, "rack"], [4, 8, "amr"], [5, 8, "plug"], [6, 8, "amr"], [6, 7, "plug"]]
  ];
  let tIdx = Math.floor(Math.random() * TEMPLATES.length);
  $("floorRandom").addEventListener("click", () => {
    grid.fill(null); tiles.forEach((t, i) => place(i, null, true));
    const tpl = TEMPLATES[tIdx++ % TEMPLATES.length];
    const flip = Math.random() < .5;
    tpl.forEach(([r, c, id], k) => { const cc = flip ? COLS + 1 - c : c; const i = (r - 1) * COLS + (cc - 1); setTimeout(() => place(i, id, true), k * 35); });
    setTimeout(() => { recompute(); if (S()) S().success(); }, tpl.length * 35 + 50);
    lastNote = "";
  });
  $("floorClear").addEventListener("click", () => { grid.fill(null); tiles.forEach((t, i) => place(i, null, true)); lastNote = ""; recompute(); if (S()) S().remove(); M() && M().say("Clean slate. Very brave.", { mood: "smirk" }); });
  $("floorExport").addEventListener("click", () => {
    const c = recompute.current || {};
    if (!c.placed || !c.placed.length) { M() && M().say("Place a few modules first. I can't email an empty floor. Well, I can, but it's weird.", { mood: "flat" }); if (S()) S().error(); return; }
    const cfg = window.BSS_CONFIG || {};
    const counts = {}; c.placed.forEach(({ id }) => { counts[id] = (counts[id] || 0) + 1; });
    const map = []; for (let r = 0; r < ROWS; r++) { let row = ""; for (let cc = 0; cc < COLS; cc++) { const id = grid[r * COLS + cc]; row += id ? id[0].toUpperCase() : "."; row += " "; } map.push(row.trim()); }
    const body = ["Hi Big Sky Systems,", "", "I sketched a lab on your site. Here's the plan:", "",
      ...Object.entries(counts).map(([id, n]) => "- " + n + " x " + byId[id].name),
      "", "Footprint: ~" + c.area + " m²", "Power: ~" + (Math.round(c.kw * 10) / 10) + " kW", "Budget band: " + money(c.lo) + " – " + money(c.hi), "Safety: " + c.safety,
      "", "Floor map (C=cell A=amr V=vision B=belt F=fence W=bench P=plug R=rack):", ...map, "",
      c.warnings.length ? "SKY-1 flagged: " + c.warnings.map((w) => w.t).join(" ") : "SKY-1 had no notes.", "", "Can we talk about it?", ""].join("\n");
    window.location.href = "mailto:" + (cfg.email || "jj@bigsky.systems") + "?subject=" + encodeURIComponent("Lab plan from the Big Sky Systems site") + "&body=" + encodeURIComponent(body);
    window.BSS_TOAST && window.BSS_TOAST("Opening your mail app with the plan…");
    if (S()) S().success();
  });

  window.BSS_BUILDER = { summary: () => recompute.current, place, MODS };
  recompute();
})();
