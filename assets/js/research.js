/* The evidence board: every number on the site, rated by how much we trust it,
   dated by when it was checked, with its sources and where it's used. Perishable
   claims age in public: the decay bar fills from the checked date over two
   quarters and flags itself when it's overdue. Nothing here is stored or sent. */
(function () {
  const root = document.getElementById("evidenceBoard");
  if (!root) return;
  const $ = (id) => document.getElementById(id);
  const K = window.BSS_CALC, S = () => window.BSS_SOUND, M = () => window.BSS_MASCOT;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SHELF_DAYS = 180; // "about two quarters"
  const STATIONS = [
    { id: "perceive", name: "Perceive", page: "/vision/", pageName: "Vision" },
    { id: "decide", name: "Decide", page: "/embedded/", pageName: "Embedded" },
    { id: "act", name: "Act", page: "/#services", pageName: "The lab" },
    { id: "capture", name: "Capture", page: "/cloud/", pageName: "Data & cloud" },
    { id: "imagine", name: "Imagine", page: "/world-models/", pageName: "World models" },
    { id: "hub", name: "Physical AI", page: "/physical-ai/", pageName: "Physical AI" }
  ];
  const RATINGS = {
    verified: { name: "Verified", def: "From a primary source: a standards body, or a vendor's own spec page." },
    reported: { name: "Reported", def: "Consistent across multiple industry sources, not primary." },
    directional: { name: "Directional", def: "A widely repeated range. Published as a range, never as a precise figure." },
    position: { name: "Position", def: "Big Sky's editorial judgment, labelled as such. Defensible, and yours to disagree with." }
  };
  const C = "2026-09-10";
  const CLAIMS = [
    // ---- perceive ----
    { id: "zero-shot-detect", s: "perceive", r: "reported", checked: C, claim: "Detection and segmentation are largely solved zero-shot by current foundation models for typical industrial parts.", note: "Keep the qualifier. Typical parts, not the shiny one.", used: ["/vision/"], src: [["Best computer vision models in 2026 — Roboflow", "https://blog.roboflow.com/best-computer-vision-models/"], ["Merging outcomes of SAM applied to RGB and depth — NIST", "https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=957706"]] },
    { id: "mono-depth", s: "perceive", r: "position", checked: C, claim: "Monocular depth foundation models are strong and still not metrology.", note: "Important distinction, frequently ignored.", used: ["/vision/"], src: [["Best computer vision models in 2026 — Roboflow", "https://blog.roboflow.com/best-computer-vision-models/"]] },
    { id: "pose-6dof", s: "perceive", r: "reported", checked: C, claim: "Zero-shot 6-DoF pose estimation from a CAD model or a few reference views now works in cluttered industrial bins.", note: "The biggest recent change in industrial vision. Active literature through 2026.", used: ["/vision/"], src: [["SAM-6D: SAM meets zero-shot 6D object pose estimation", "https://arxiv.org/pdf/2311.15707"], ["Accurate and efficient zero-shot 6D pose estimation with frozen foundation models", "https://arxiv.org/pdf/2506.09784"], ["SDT-6D: sparse depth-transformer for industrial multi-view bin picking", "https://arxiv.org/pdf/2512.08430"], ["Pickalo: 6D pose estimation for low-cost industrial bin picking", "https://arxiv.org/html/2604.04690"]] },
    { id: "grasp-verify-hard", s: "perceive", r: "position", checked: C, claim: "Grasping and verification remain the hard stages of the pipeline.", note: "Well supported by practitioner experience; still a judgment.", used: ["/vision/"], src: [["SDT-6D: sparse depth-transformer for industrial multi-view bin picking", "https://arxiv.org/pdf/2512.08430"]] },
    { id: "failure-modes", s: "perceive", r: "position", checked: C, claim: "Specularity, transparency, clutter, lighting drift, and calibration drift are the dominant real-world failure modes.", note: "Practitioner consensus. The most useful list on the vision page.", used: ["/vision/"], src: [["Merging outcomes of SAM applied to RGB and depth — NIST", "https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=957706"]] },
    { id: "fewer-custom-models", s: "perceive", r: "position", checked: C, claim: "In 2026 you should be training far fewer custom vision models than in 2023, and spending the savings on lighting, fixturing, calibration, and verification.", note: "The thesis of the vision page. Checkable against your own experience.", used: ["/vision/"], src: [["Best computer vision models in 2026 — Roboflow", "https://blog.roboflow.com/best-computer-vision-models/"]] },
    // ---- decide ----
    { id: "control-rates", s: "decide", r: "reported", checked: C, claim: "Sub-10 ms inference is achievable on embedded targets with a compiled runtime and reduced precision; control loops run at 10 to 100 Hz.", note: "The rate table is standard engineering practice, not a citation-dependent claim.", used: ["/embedded/"], src: [["Efficient Foundation Models for Real-Time Embodied AI (CoRL 2026 workshop)", "https://efficient-embodied-ai.github.io/"], ["Accelerate AI inference for edge and robotics — Edge AI and Vision Alliance", "https://www.edge-ai-vision.com/2026/01/accelerate-ai-inference-for-edge-and-robotics-with-nvidia-jetson-t4000-and-nvidia-jetpack-7-1/"]] },
    { id: "quant-speedup", s: "decide", r: "reported", checked: C, claim: "Quantization routinely buys large latency reductions on embedded targets.", note: "Published multipliers vary wildly by model and platform. Published as 'large', never as a number.", used: ["/embedded/"], src: [["Accelerate AI inference for edge and robotics — Edge AI and Vision Alliance", "https://www.edge-ai-vision.com/2026/01/accelerate-ai-inference-for-edge-and-robotics-with-nvidia-jetson-t4000-and-nvidia-jetpack-7-1/"]] },
    { id: "quant-different-model", s: "decide", r: "position", checked: C, claim: "A quantized model is a different model and gets the full evaluation suite. Every time.", note: "Big Sky's position. Defensible, differentiating, and true.", used: ["/embedded/", "/notes/your-average-latency-is-a-lie.html"], src: [["Efficient Foundation Models for Real-Time Embodied AI (CoRL 2026 workshop)", "https://efficient-embodied-ai.github.io/"]] },
    { id: "p999", s: "decide", r: "position", checked: C, claim: "The latency number that breaks robots is p99.9, not the mean.", note: "Real engineering judgment that vendors never volunteer.", used: ["/embedded/", "/notes/your-average-latency-is-a-lie.html"], src: [["Efficient Foundation Models for Real-Time Embodied AI (CoRL 2026 workshop)", "https://efficient-embodied-ai.github.io/"]] },
    { id: "jetson-thor", s: "decide", r: "verified", rots: true, checked: C, claim: "Current flagship embedded modules ship in the low thousands of sparse FP4 TFLOPS with a 40 to 130 W power range; the headline number assumes cooling you may not have.", note: "From the vendor's own product page. Part numbers and TFLOPS figures are deliberately kept off the pages: they're stale within two quarters.", used: ["/embedded/"], src: [["NVIDIA Jetson Thor product page", "https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/"], ["Introducing NVIDIA Jetson Thor", "https://developer.nvidia.com/blog/introducing-nvidia-jetson-thor-the-ultimate-platform-for-physical-ai/"], ["Jetson Thor now available", "https://nvidianews.nvidia.com/news/nvidia-blackwell-powered-jetson-thor-now-available-accelerating-the-age-of-general-robotics"]] },
    // ---- act (safety) ----
    { id: "iso-10218-2025", s: "act", r: "verified", checked: C, claim: "ISO 10218-1:2025 and ISO 10218-2:2025 are published and supersede the 2011 editions.", note: "Part 1: industrial robots. Part 2: robot applications and cells. Prepared by ISO/TC 299 with CEN/TC 310.", used: ["/#services", "/physical-ai/", "/notes/ai-in-a-safety-function.html"], src: [["ISO 10218-1:2025", "https://www.iso.org/standard/73933.html"], ["Updated ISO 10218 FAQ — A3", "https://www.automate.org/robotics/blogs/updated-iso-10218-faq"], ["ISO 10218 receives major overhaul — The Robot Report", "https://www.therobotreport.com/iso-10218-industrial-robot-safety-standard-receives-major-overhaul/"], ["ISO 10218-1:2025 — ANSI blog", "https://blog.ansi.org/ansi/iso-10218-1-2025-robots-and-robotic-devices-safety/"]] },
    { id: "iso-functional-safety", s: "act", r: "reported", checked: C, claim: "The 2025 revision makes functional-safety requirements explicit rather than implied.", note: "Consistent across standards-body commentary.", used: ["/notes/ai-in-a-safety-function.html"], src: [["Updated ISO 10218 FAQ — A3", "https://www.automate.org/robotics/blogs/updated-iso-10218-faq"], ["ISO 10218 receives major overhaul — The Robot Report", "https://www.therobotreport.com/iso-10218-industrial-robot-safety-standard-receives-major-overhaul/"]] },
    { id: "national-withdrawal", s: "act", r: "reported", checked: C, claim: "Conflicting national standards are to be withdrawn by March 2027.", note: "A real transition deadline. Useful to a client.", used: ["/physical-ai/", "/notes/ai-in-a-safety-function.html"], src: [["Updated ISO 10218 FAQ — A3", "https://www.automate.org/robotics/blogs/updated-iso-10218-faq"]] },
    { id: "eu-mr-2027", s: "act", r: "verified", checked: C, claim: "The EU Machinery Regulation (EU) 2023/1230 applies from 20 January 2027, replacing Machinery Directive 2006/42/EC.", note: "Hard date.", used: ["/physical-ai/", "/notes/ai-in-a-safety-function.html"], src: [["Guide to the 2027 EU Machinery Regulation — Nemko", "https://digital.nemko.com/regulations/eu-machinery-regulation"]] },
    { id: "eu-mr-ai-highrisk", s: "act", r: "reported", checked: C, claim: "Under the Regulation, machinery where an AI system performs a safety function is treated as high-risk under Annex I.", note: "The commercial hook. Descriptive on the site, never prescriptive.", used: ["/physical-ai/", "/notes/ai-in-a-safety-function.html"], src: [["Smart robots, dual regulations — Bird & Bird", "https://www.twobirds.com/en/insights/2026/smart-robots,-dual-regulations-navigating-the-ai-act-and-machinery-compliance"], ["Navigating the legal maze — Timelex", "https://www.timelex.eu/en/blog/navigating-legal-maze-ai-autonomous-robots-and-eus-regulatory-overhaul"]] },
    { id: "three-frameworks", s: "act", r: "reported", checked: C, claim: "An AI-driven robot in the EU sits at the intersection of the AI Act, the Machinery Regulation, and GDPR.", note: "Well-supported framing.", used: ["/cloud/", "/notes/ai-in-a-safety-function.html"], src: [["Smart robots, dual regulations — Bird & Bird", "https://www.twobirds.com/en/insights/2026/smart-robots,-dual-regulations-navigating-the-ai-act-and-machinery-compliance"], ["Navigating the legal maze — Timelex", "https://www.timelex.eu/en/blog/navigating-legal-maze-ai-autonomous-robots-and-eus-regulatory-overhaul"]] },
    // ---- capture ----
    { id: "mcap-default", s: "capture", r: "verified", checked: C, claim: "MCAP is the default rosbag2 storage format from ROS 2 Iron (May 2023) onward.", note: "Stable; safe to name on the page.", used: ["/cloud/", "/notes/keep-the-raw.html"], src: [["MCAP as the ROS 2 default bag format — Foxglove", "https://foxglove.dev/blog/mcap-as-the-ros2-default-bag-format"], ["ROS 2 support for recording directly to MCAP — ROS Discourse", "https://discourse.openrobotics.org/t/new-ros-2-support-for-recording-data-directly-to-mcap-files/27735"]] },
    { id: "episode-formats", s: "capture", r: "reported", checked: C, claim: "Learning-side datasets have converged on episode-oriented formats (LeRobot-style, RLDS); Open X-Embodiment is published in them and conversion tooling exists.", note: "The 'conversion tax' framing is Big Sky's.", used: ["/cloud/"], src: [["LeRobot: an open-source library for end-to-end robot learning", "https://arxiv.org/pdf/2602.22818"], ["Visualizing Open X-Embodiment in Foxglove", "https://foxglove.dev/blog/visualizing-open-x-embodiment-dataset-in-foxglove"]] },
    { id: "gpu-prices", s: "capture", r: "reported", rots: true, checked: C, claim: "Renting serious GPUs costs a couple of dollars an hour per card.", note: "Exact hourly figures move monthly and are deliberately not published; the page says 'a couple of dollars'.", used: ["/cloud/"], src: [["H100 GPU cost in 2026 — CloudZero", "https://www.cloudzero.com/blog/h100-gpu-cost/"]] },
    { id: "finetune-time", s: "capture", r: "reported", rots: true, checked: C, claim: "A parameter-efficient fine-tune of a generalist policy on a few hundred episodes runs overnight on one high-end card; a full fine-tune on eight cards is a day or two.", note: "Directionally solid. Kept qualitative.", used: ["/cloud/", "/notes/keep-the-raw.html"], src: [["Scaling VLA model training on a budget", "https://www.roboticscenter.ai/blog/scaling-vla-training-on-a-budget"]] },
    { id: "training-cheap", s: "capture", r: "position", checked: C, claim: "Training compute is small relative to data collection and evaluation.", note: "Follows arithmetically from the demonstration numbers.", used: ["/cloud/", "/physical-ai/", "/notes/keep-the-raw.html"], src: [["Teleoperation data collection as a service", "https://www.dataxpower.com/blog/teleoperation-data-collection-service"], ["H100 GPU cost in 2026 — CloudZero", "https://www.cloudzero.com/blog/h100-gpu-cost/"]] },
    { id: "managed-robotics-withdrawn", s: "capture", r: "reported", checked: C, claim: "The managed cloud-robotics services of the previous generation have largely been withdrawn; the current pattern is edge agents plus your own orchestration, or a fleet platform chosen on its merits.", note: "The page keeps it generic on purpose.", used: ["/cloud/"], src: [["AWS RoboMaker support policy", "https://docs.aws.amazon.com/robomaker/latest/dg/chapter-support-policy.html"]] },
    // ---- imagine ----
    { id: "three-families", s: "imagine", r: "reported", checked: C, claim: "Three distinct families get called 'world models': physics simulators, video world models, and latent or planner world models.", note: "The most useful thing on the page.", used: ["/world-models/"], src: [["The State of Simulation for Physical AI — Hugging Face", "https://huggingface.co/blog/nvidia/state-of-simulation-for-physical-ai"], ["From World Models to World Action Models: a tutorial for robotics", "https://arxiv.org/pdf/2607.00836"]] },
    { id: "newton", s: "imagine", r: "reported", rots: true, checked: C, claim: "An open-source, GPU-accelerated, differentiable physics engine with multiple solvers (including MuJoCo Warp), SDF collision, and deformables reached 1.0 in 2026 under Linux Foundation governance.", note: "Newton. Named in the notes, described without the name on the page so it stays true longer.", used: ["/world-models/"], src: [["Newton physics integration — Isaac Lab docs", "https://isaac-sim.github.io/IsaacLab/main/source/experimental-features/newton-physics-integration/index.html"], ["NVIDIA Newton 1.0", "https://medium.com/the-ai-entrepreneurs/nvidia-newton-1-0-open-source-physics-engine-for-robotics-sim-to-real-e9be3a857f6a"], ["Isaac Lab: a GPU-accelerated simulation framework", "https://arxiv.org/pdf/2511.04831"]] },
    { id: "video-world-models", s: "imagine", r: "reported", rots: true, checked: C, claim: "Video world models generate consistent, interactive environments navigable in real time and hold consistency over minutes.", note: "Improves rapidly. The page describes the capability class, not the frame rate.", used: ["/world-models/"], src: [["Genie (world model) — Wikipedia", "https://en.wikipedia.org/wiki/Genie_%28world_model%29"], ["The State of Simulation for Physical AI — Hugging Face", "https://huggingface.co/blog/nvidia/state-of-simulation-for-physical-ai"]] },
    { id: "latent-world-models", s: "imagine", r: "reported", checked: C, claim: "Latent world models offer counterfactual reasoning, long-horizon planning, and better out-of-distribution data efficiency than pure behaviour cloning, and are early in industrial practice.", note: "Fair characterisation of the research position.", used: ["/world-models/"], src: [["From World Models to World Action Models: a tutorial for robotics", "https://arxiv.org/pdf/2607.00836"]] },
    { id: "gaussian-splat", s: "imagine", r: "reported", checked: C, claim: "3D Gaussian splatting produces digital twins from sparse images in minutes, convertible to collision-ready geometry for physics engines.", note: "Genuinely practical.", used: ["/world-models/"], src: [["A high-fidelity digital twin for robotic manipulation based on 3DGS", "https://arxiv.org/abs/2601.03200"], ["3D Gaussian Splatting in Robotics: a survey", "https://arxiv.org/pdf/2410.12262"]] },
    { id: "gap-task-shaped", s: "imagine", r: "position", checked: C, claim: "Sim-to-real transfer quality is task-shaped: locomotion and rigid picking transfer well, contact-rich assembly and deformables transfer poorly.", note: "The reality-gap meter's bands are this judgment, labelled as such.", used: ["/world-models/", "/notes/the-simulator-lied.html"], src: [["The State of Simulation for Physical AI — Hugging Face", "https://huggingface.co/blog/nvidia/state-of-simulation-for-physical-ai"], ["Isaac Lab: a GPU-accelerated simulation framework", "https://arxiv.org/pdf/2511.04831"]] },
    // ---- hub ----
    { id: "demos-per-task", s: "hub", r: "directional", checked: C, claim: "Imitation learning needs roughly fifty to two hundred teleoperated demonstrations per task, depending on the task.", note: "A twenty-task facility lands at one to four thousand. Always a range.", used: ["/physical-ai/", "/notes/fifty-to-two-hundred.html"], src: [["A Survey on Vision-Language-Action Models for Embodied AI", "https://arxiv.org/pdf/2405.14093"], ["Embodied AI data collection: teleoperation guide 2026", "https://www.evsint.com/embodied-ai-data-collection-teleoperation-sim-to-real-2026/"]] },
    { id: "uptime-vs-runtime", s: "hub", r: "reported", rots: true, checked: C, claim: "Production lines expect 95 to 99 percent uptime; most humanoid platforms still need a charge or a human well before a shift ends.", note: "The uptime expectation is stable; the runtime figure improves every cycle. Re-checked 2026-09-10: 1.5 to 5 hours per charge, no platform completes an 8-hour shift.", used: ["/physical-ai/"], src: [["Humanoid robot battery reality: spec sheets vs deployment — RobotWale", "https://www.robotwale.com/article/humanoid-robot-battery-runtime-reality-check"], ["The humanoid robot bottleneck is the battery — Technologies.org", "https://technologies.org/the-humanoid-robot-bottleneck-is-the-battery-why-two-kilowatt-hours-caps-the-whole-industry/"], ["The state of humanoid robotics 2026 — Robotics & Automation News", "https://roboticsandautomationnews.com/2026/02/07/the-state-of-humanoid-robotics-from-research-labs-to-real-world-potential/98732/"]] },
    { id: "validation-year", s: "hub", r: "reported", checked: C, claim: "2026 reads like a validation year: real but narrow, supervised deployments; broad factory-scale adoption reads like a 2030s story.", note: "Stated as an assessment, not a fact.", used: ["/physical-ai/"], src: [["Humanoid robots 2026 tracker — RoboBrief", "https://robobrief.tech/blog/humanoid-robots-2026/"], ["Humanoid robotics challenges 2026 — Robozaps", "https://blog.robozaps.com/b/challenges-in-humanoid-robotics"]] },
    { id: "deployment-clusters", s: "hub", r: "reported", checked: C, claim: "Real deployments cluster in tote movement, line-side delivery, kitting, parts loading, inspection, and machine tending.", note: "Named programs exist at automotive and logistics sites. No companies are named on the site: it would imply a relationship.", used: ["/physical-ai/"], src: [["The state of humanoid robotics 2026 — Robotics & Automation News", "https://roboticsandautomationnews.com/2026/02/07/the-state-of-humanoid-robotics-from-research-labs-to-real-world-potential/98732/"]] },
    { id: "generalist-landscape", s: "hub", r: "reported", rots: true, checked: C, claim: "The generalist policy landscape is flow-matching VLAs, open-weight cross-embodiment models, diffusion policies, and vendor stacks that ship with the hardware.", note: "Written without model names on purpose. That's a feature.", used: ["/physical-ai/"], src: [["A Survey on Vision-Language-Action Models for Embodied AI", "https://arxiv.org/pdf/2405.14093"]] }
  ];
  const EVENTS = [
    { d: "2023-05-01", label: "MCAP becomes the rosbag2 default (ROS 2 Iron)", s: "capture" },
    { d: "2025-06-01", label: "ISO 10218-1:2025 and -2:2025 published", s: "act" },
    { d: "2026-03-01", label: "An open GPU physics engine reaches 1.0 (GTC 2026)", s: "imagine" },
    { d: C, label: "This research checked", s: "hub", checked: true },
    { d: "2027-01-20", label: "EU Machinery Regulation applies", s: "act" },
    { d: "2027-03-01", label: "Conflicting national robot-safety standards withdrawn", s: "act" }
  ];

  // ---- state ----
  const state = { station: "all", ratings: { verified: true, reported: true, directional: true, position: true }, perishable: false, q: "", sel: null };
  const q = K.readState();
  if (STATIONS.some((s) => s.id === q.station)) state.station = q.station;
  if (q.rating && RATINGS[q.rating]) Object.keys(state.ratings).forEach((k) => { state.ratings[k] = k === q.rating; });
  if (q.perishable === "1") state.perishable = true;
  if (q.q) state.q = String(q.q).slice(0, 60);
  if (q.claim && CLAIMS.some((c) => c.id === q.claim)) state.sel = q.claim;

  const TODAY = new Date();
  function ageDays(iso) { return Math.max(0, Math.round((TODAY - new Date(iso + "T00:00:00")) / 86400000)); }
  function decay(c) { if (!c.rots) return null; const a = ageDays(c.checked); return { days: a, frac: Math.min(1, a / SHELF_DAYS), state: a > SHELF_DAYS ? "overdue" : a > SHELF_DAYS / 2 ? "aging" : "fresh" }; }
  function fmtDate(iso) { return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  function visible(c) {
    if (state.station !== "all" && c.s !== state.station) return false;
    if (!state.ratings[c.r]) return false;
    if (state.perishable && !c.rots) return false;
    if (state.q) { const h = (c.claim + " " + c.note + " " + c.src.map((x) => x[0]).join(" ")).toLowerCase(); if (!h.includes(state.q.toLowerCase())) return false; }
    return true;
  }

  // ---- the board: stations across, ratings down ----
  const board = $("boardGrid");
  function renderBoard() {
    const shown = CLAIMS.filter(visible);
    let html = '<div class="board__corner mono">Rating \\ station</div>';
    STATIONS.forEach((s) => { html += '<div class="board__col mono' + (state.station === s.id ? " is-active" : "") + '">' + s.name + '</div>'; });
    Object.keys(RATINGS).forEach((r) => {
      html += '<div class="board__row mono"><i class="sq sq--' + r + '"></i>' + RATINGS[r].name + '</div>';
      STATIONS.forEach((s) => {
        const cell = shown.filter((c) => c.s === s.id && c.r === r);
        html += '<div class="board__cell' + (cell.length ? "" : " is-empty") + '">' + cell.map((c) => {
          const d = decay(c);
          return '<button type="button" class="claim' + (state.sel === c.id ? " is-sel" : "") + '" data-id="' + c.id + '" data-cursor="OPEN" aria-pressed="' + (state.sel === c.id) + '">' +
            '<i class="sq sq--' + c.r + '"></i><span>' + short(c.claim) + '<small class="claim__station">' + s.name + '</small></span>' +
            (d ? '<b class="decay decay--' + d.state + '" title="Perishable: ' + d.days + ' days since checked"><i style="width:' + Math.round(d.frac * 100) + '%"></i></b>' : "") + '</button>';
        }).join("") + '</div>';
      });
    });
    board.innerHTML = html;
    board.querySelectorAll(".claim").forEach((b) => b.addEventListener("click", () => { select(b.dataset.id); if (S()) S().click(); }));
    const n = { total: shown.length, rots: shown.filter((c) => c.rots).length, overdue: shown.filter((c) => { const d = decay(c); return d && d.state === "overdue"; }).length };
    Object.keys(RATINGS).forEach((r) => { n[r] = shown.filter((c) => c.r === r).length; });
    $("boardCount").textContent = n.total + " of " + CLAIMS.length + " claims · " + n.verified + " verified · " + n.reported + " reported · " + n.directional + " directional · " + n.position + " positions · " + n.rots + " perishable" + (n.overdue ? " · " + n.overdue + " overdue for a re-check" : "");
    $("rOverdue").textContent = String(CLAIMS.filter((c) => { const d = decay(c); return d && d.state === "overdue"; }).length);
    return shown;
  }
  function short(t) { const w = t.split(" "); return w.length > 9 ? w.slice(0, 9).join(" ") + "…" : t; }

  // ---- the detail plate ----
  const detail = $("boardDetail");
  function select(id) {
    state.sel = state.sel === id ? null : id;
    renderBoard(); renderDetail(); save();
    if (state.sel && window.innerWidth < 1000) detail.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
  }
  function renderDetail() {
    const c = CLAIMS.find((x) => x.id === state.sel);
    if (!c) { detail.innerHTML = '<span class="card__num mono">Evidence</span><h3>Pick a claim.</h3><p class="muted">Every plate on the board is a claim the site makes. Open one for its rating, its sources, where it\'s used, and how long it has left before we re-check it.</p>'; return; }
    const s = STATIONS.find((x) => x.id === c.s), d = decay(c);
    detail.innerHTML = '<span class="card__num mono">' + s.name + ' · ' + RATINGS[c.r].name + (c.rots ? " · perishable" : "") + '</span>' +
      '<h3>' + c.claim + '</h3>' +
      '<p class="muted detail__note">' + c.note + '</p>' +
      '<dl class="detail__meta mono">' +
      '<dt>Rating</dt><dd><i class="sq sq--' + c.r + '"></i>' + RATINGS[c.r].name + ' — ' + RATINGS[c.r].def + '</dd>' +
      '<dt>Checked</dt><dd>' + fmtDate(c.checked) + ' · ' + ageDays(c.checked) + ' days ago</dd>' +
      (d ? '<dt>Shelf life</dt><dd><b class="decay decay--' + d.state + ' decay--wide"><i style="width:' + Math.round(d.frac * 100) + '%"></i></b>' + (d.state === "overdue" ? "Overdue. Ask us for the current version." : d.state === "aging" ? "Aging. Treat the specifics as last quarter's." : "Fresh. About two quarters before we re-check.") + '</dd>' : "") +
      '<dt>Used on</dt><dd>' + c.used.map((u) => '<a href="' + u + '">' + u + '</a>').join(" · ") + '</dd>' +
      '</dl>' +
      '<span class="mono muted detail__label">Sources</span><ul class="list detail__src">' + c.src.map((x) => '<li><a href="' + x[1] + '" rel="noopener">' + x[0] + '</a></li>').join("") + '</ul>';
  }

  // ---- the timeline: dated events, and a today mark that moves on its own ----
  function renderTimeline() {
    const svg = $("evidenceTimeline"); if (!svg) return;
    const t0 = new Date("2023-01-01T00:00:00"), t1 = new Date("2028-01-01T00:00:00");
    const X = (d) => 60 + (new Date(d + "T00:00:00") - t0) / (t1 - t0) * 780;
    let html = '<line x1="60" y1="120" x2="840" y2="120" stroke="var(--line-strong)" stroke-width="1"/>';
    for (let y = 2023; y <= 2028; y++) { const x = X(y + "-01-01"); html += '<line x1="' + x + '" y1="114" x2="' + x + '" y2="126" stroke="var(--ink)" stroke-width="1"/><text x="' + x + '" y="146" text-anchor="middle">' + y + '</text>'; }
    EVENTS.forEach((e, i) => {
      const x = X(e.d), up = i % 2 === 0, y = up ? 62 : 178, ty = up ? 50 : 196;
      html += '<line x1="' + x + '" y1="120" x2="' + x + '" y2="' + y + '" stroke="var(--line-strong)" stroke-width="1" stroke-dasharray="2 3"/>';
      html += e.checked ? '<rect x="' + (x - 4) + '" y="' + (y - 4) + '" width="8" height="8" fill="var(--accent)"/>' : '<rect x="' + (x - 3.5) + '" y="' + (y - 3.5) + '" width="7" height="7" fill="none" stroke="var(--ink)" stroke-width="1.5"/>';
      html += '<text x="' + x + '" y="' + ty + '" text-anchor="' + (x > 700 ? "end" : x < 200 ? "start" : "middle") + '"' + (e.checked ? ' fill="var(--accent)"' : "") + '>' + e.label + '</text>';
    });
    const xt = X(TODAY.toISOString().slice(0, 10));
    html += '<line x1="' + xt + '" y1="100" x2="' + xt + '" y2="140" stroke="var(--accent)" stroke-width="1.5"/><text x="' + xt + '" y="96" text-anchor="middle" fill="var(--accent)">Today</text>';
    svg.innerHTML = html;
    $("timelineReadout").textContent = EVENTS.map((e) => fmtDate(e.d) + ": " + e.label).join(" · ") + " · today is " + fmtDate(TODAY.toISOString().slice(0, 10));
  }

  // ---- controls ----
  function save() {
    const on = Object.keys(state.ratings).filter((k) => state.ratings[k]);
    K.writeState({ station: state.station === "all" ? "" : state.station, rating: on.length === 1 ? on[0] : "", perishable: state.perishable ? 1 : "", q: state.q, claim: state.sel || "" });
  }
  const seg = $("boardStations");
  seg.querySelectorAll(".seg__btn").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.station === state.station);
    b.addEventListener("click", () => { state.station = b.dataset.station; seg.querySelectorAll(".seg__btn").forEach((x) => x.classList.toggle("is-active", x === b)); if (S()) S().click(); renderBoard(); save(); });
  });
  Object.keys(RATINGS).forEach((r) => { const el = $("rate-" + r); el.checked = state.ratings[r]; el.addEventListener("change", () => { state.ratings[r] = el.checked; if (S()) S().tick(); renderBoard(); save(); }); });
  const per = $("rate-perishable"); per.checked = state.perishable; per.addEventListener("change", () => { state.perishable = per.checked; if (S()) S().tick(); renderBoard(); save(); });
  const search = $("boardSearch"); search.value = state.q;
  search.addEventListener("input", K.debounce(() => { state.q = search.value.trim().slice(0, 60); renderBoard(); save(); }, 120));
  $("boardReset").addEventListener("click", () => {
    Object.assign(state, { station: "all", ratings: { verified: true, reported: true, directional: true, position: true }, perishable: false, q: "", sel: null });
    seg.querySelectorAll(".seg__btn").forEach((x) => x.classList.toggle("is-active", x.dataset.station === "all"));
    Object.keys(RATINGS).forEach((r) => { $("rate-" + r).checked = true; }); per.checked = false; search.value = "";
    renderBoard(); renderDetail(); save(); if (S()) S().remove();
  });
  $("boardEmail").addEventListener("click", () => {
    const shown = CLAIMS.filter(visible);
    K.mailto("The evidence behind the Big Sky Systems site — " + shown.length + " claims", [
      "I pulled these claims and sources from your research page:", "",
      ...shown.map((c) => "- [" + RATINGS[c.r].name + (c.rots ? ", perishable" : "") + "] " + c.claim + "\n  Sources: " + c.src.map((x) => x[1]).join(" ; ")),
      "", "Filters: " + (state.station === "all" ? "all stations" : state.station) + (state.perishable ? ", perishable only" : "") + (state.q ? ", search '" + state.q + "'" : ""),
      "Link: " + window.location.href, "", "Could you send me the current version of the perishable ones?"
    ], "Hi Big Sky Systems,");
  });
  if (state.sel) M() && M().say("Someone sent you straight to a claim. That's how it's supposed to work.", { mood: "smirk" });

  if ($("rClaims")) $("rClaims").textContent = String(CLAIMS.length);
  renderBoard(); renderDetail(); renderTimeline();
  window.BSS_EVIDENCE = { state, CLAIMS, decay, select, count: () => CLAIMS.filter(visible).length };
})();
