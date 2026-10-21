/* The evidence board: every technical claim and benchmark on the site,
   organized by loop station, graded by source type, and linked directly to
   primary specifications, standards, and papers. */
(function () {
  const root = document.getElementById("evidenceBoard");
  if (!root) return;
  const $ = (id) => document.getElementById(id);
  const K = window.BSS_CALC;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SHELF_DAYS = 180;
  const STATIONS = [
    { id: "perceive", name: "Perceive", page: "/vision/", pageName: "Vision" },
    { id: "decide", name: "Decide", page: "/embedded/", pageName: "Embedded" },
    { id: "act", name: "Act", page: "/#services", pageName: "The cell" },
    { id: "capture", name: "Capture", page: "/cloud/", pageName: "Data & cloud" },
    { id: "imagine", name: "Imagine", page: "/world-models/", pageName: "World models" }
  ];
  const PAGE_LABELS = {
    "/vision/": "Vision",
    "/embedded/": "Embedded",
    "/#services": "Services",
    "/cloud/": "Data & Cloud",
    "/world-models/": "World Models"
  };
  const RATINGS = {
    verified: { name: "Verified", def: "Primary source: standards body or vendor specification." },
    reported: { name: "Reported", def: "Consistent across peer-reviewed literature and industry benchmarks." },
    directional: { name: "Directional", def: "Published order-of-magnitude range across tasks." },
    position: { name: "Position", def: "Big Sky engineering judgment from field deployments." }
  };
  const C = "2026-09-10";
  const CLAIMS = [
    // ---- perceive ----
    { id: "zero-shot-detect", s: "perceive", r: "reported", checked: C, claim: "Detection and segmentation are largely solved zero-shot by current foundation models for typical industrial parts.", note: "Applies to standard matte or textured parts; specular and transparent parts still require optical filtering or structured illumination.", used: ["/vision/"], src: [["Best computer vision models in 2026 — Roboflow", "https://blog.roboflow.com/best-computer-vision-models/"], ["Merging outcomes of SAM applied to RGB and depth — NIST", "https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=957706"]] },
    { id: "mono-depth", s: "perceive", r: "position", checked: C, claim: "Monocular depth foundation models provide strong relative geometry but are not a substitute for calibrated metrology.", note: "Use monocular depth for obstacle avoidance and coarse approach; use stereo or structured light when sub-millimeter clearances matter.", used: ["/vision/"], src: [["Best computer vision models in 2026 — Roboflow", "https://blog.roboflow.com/best-computer-vision-models/"]] },
    { id: "pose-6dof", s: "perceive", r: "reported", checked: C, claim: "Zero-shot 6-DoF pose estimation from a CAD model or reference views now operates reliably in cluttered industrial bins.", note: "Eliminates weeks of per-SKU synthetic dataset generation for rigid components.", used: ["/vision/"], src: [["SAM-6D: SAM meets zero-shot 6D object pose estimation", "https://arxiv.org/pdf/2311.15707"], ["Accurate and efficient zero-shot 6D pose estimation", "https://arxiv.org/pdf/2506.09784"], ["SDT-6D: sparse depth-transformer for bin picking", "https://arxiv.org/pdf/2512.08430"], ["Pickalo: 6D pose estimation for industrial bin picking", "https://arxiv.org/html/2604.04690"]] },
    { id: "grasp-verify-hard", s: "perceive", r: "position", checked: C, claim: "Grasp execution and post-grasp verification remain the primary bottlenecks in industrial manipulation pipelines.", note: "Contact physics, finger compliance, and in-hand slip require closed-loop verification rather than better bounding boxes.", used: ["/vision/"], src: [["SDT-6D: sparse depth-transformer for bin picking", "https://arxiv.org/pdf/2512.08430"]] },
    { id: "failure-modes", s: "perceive", r: "position", checked: C, claim: "Specularity, transparency, heavy occlusion, ambient light drift, and mount vibration cause the majority of field perception failures.", note: "Most production vision failures are solved with enclosures, rigid mounts, and controlled illumination rather than model retraining.", used: ["/vision/"], src: [["Merging outcomes of SAM applied to RGB and depth — NIST", "https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=957706"]] },
    { id: "fewer-custom-models", s: "perceive", r: "position", checked: C, claim: "Engineering budgets in 2026 should shift from training custom 2D detectors toward controlled lighting, calibration checks, and verification cameras.", note: "Foundation detectors handle localization out of the box; cell reliability is won in optics and verification.", used: ["/vision/"], src: [["Best computer vision models in 2026 — Roboflow", "https://blog.roboflow.com/best-computer-vision-models/"]] },
    // ---- decide ----
    { id: "control-rates", s: "decide", r: "reported", checked: C, claim: "Sub-10 ms policy inference is achievable on embedded modules using compiled runtimes and reduced precision, supporting 10 to 100 Hz control loops.", note: "Requires TensorRT/ONNX compilation, pinned cores, and pre-allocated memory buffers.", used: ["/embedded/"], src: [["Efficient Foundation Models for Real-Time Embodied AI (CoRL 2026)", "https://efficient-embodied-ai.github.io/"], ["Accelerate AI inference for edge and robotics — Edge AI Alliance", "https://www.edge-ai-vision.com/2026/01/accelerate-ai-inference-for-edge-and-robotics-with-nvidia-jetson-t4000-and-nvidia-jetpack-7-1/"]] },
    { id: "quant-speedup", s: "decide", r: "reported", checked: C, claim: "FP8 and INT8 quantization routinely deliver 2× to 4× latency reductions on embedded robot compute.", note: "Actual speedup depends on operator support and memory bandwidth on the target SoC.", used: ["/embedded/"], src: [["Accelerate AI inference for edge and robotics — Edge AI Alliance", "https://www.edge-ai-vision.com/2026/01/accelerate-ai-inference-for-edge-and-robotics-with-nvidia-jetson-t4000-and-nvidia-jetpack-7-1/"]] },
    { id: "quant-different-model", s: "decide", r: "position", checked: C, claim: "A quantized model is a distinct control policy and must pass the full closed-loop evaluation suite before deployment.", note: "Precision reduction alters decision boundaries on edge-case grasps and contact transitions.", used: ["/embedded/"], src: [["Efficient Foundation Models for Real-Time Embodied AI (CoRL 2026)", "https://efficient-embodied-ai.github.io/"]] },
    { id: "p999", s: "decide", r: "position", checked: C, claim: "Closed-loop robot stability is governed by p99.9 tail latency under thermal load, not mean inference time.", note: "At 30 Hz, a 99.9th-percentile stall occurs roughly once every 33 seconds of operation.", used: ["/embedded/"], src: [["Efficient Foundation Models for Real-Time Embodied AI (CoRL 2026)", "https://efficient-embodied-ai.github.io/"]] },
    { id: "jetson-thor", s: "decide", r: "verified", rots: true, checked: C, claim: "Current flagship embedded robotics modules deliver up to ~2,000 sparse FP4 TFLOPS within a 40 to 130 W thermal envelope.", note: "Sustained clocks inside sealed industrial enclosures are typically 25–40% below peak datasheet ratings without active cooling.", used: ["/embedded/"], src: [["NVIDIA Jetson Thor product specification", "https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/"], ["Introducing NVIDIA Jetson Thor", "https://developer.nvidia.com/blog/introducing-nvidia-jetson-thor-the-ultimate-platform-for-physical-ai/"]] },
    // ---- act (safety) ----
    { id: "iso-10218-2025", s: "act", r: "verified", checked: C, claim: "ISO 10218-1:2025 (robots) and ISO 10218-2:2025 (robot systems and integration) are published and supersede the 2011 editions.", note: "Merges guidance previously split into ISO/TS 15066 directly into the normative cell standard.", used: ["/#services"], src: [["ISO 10218-1:2025 standard", "https://www.iso.org/standard/73933.html"], ["Updated ISO 10218 FAQ — A3", "https://www.automate.org/robotics/blogs/updated-iso-10218-faq"], ["ISO 10218-1:2025 overview — ANSI", "https://blog.ansi.org/ansi/iso-10218-1-2025-robots-and-robotic-devices-safety/"]] },
    { id: "iso-functional-safety", s: "act", r: "reported", checked: C, claim: "The 2025 revision of ISO 10218 makes functional safety, cybersecurity, and collaborative operation requirements explicit.", note: "Safety functions must be specified with defined Performance Levels (PL) or SIL ratings.", used: ["/#services"], src: [["Updated ISO 10218 FAQ — A3", "https://www.automate.org/robotics/blogs/updated-iso-10218-faq"], ["ISO 10218 overhaul — The Robot Report", "https://www.therobotreport.com/iso-10218-industrial-robot-safety-standard-receives-major-overhaul/"]] },
    { id: "national-withdrawal", s: "act", r: "reported", checked: C, claim: "Conflicting national robot safety standards in Europe are scheduled for withdrawal by March 2027.", note: "New cells commissioning in 2026–2027 should be engineered directly to the 2025 text.", used: ["/#services"], src: [["Updated ISO 10218 FAQ — A3", "https://www.automate.org/robotics/blogs/updated-iso-10218-faq"]] },
    { id: "eu-mr-2027", s: "act", r: "verified", checked: C, claim: "The EU Machinery Regulation (EU) 2023/1230 applies from 20 January 2027, replacing Machinery Directive 2006/42/EC.", note: "Mandatory enforcement date across EU member states with no transition window.", used: ["/#services"], src: [["Guide to the 2027 EU Machinery Regulation — Nemko", "https://digital.nemko.com/regulations/eu-machinery-regulation"]] },
    { id: "eu-mr-ai-highrisk", s: "act", r: "reported", checked: C, claim: "Under Regulation (EU) 2023/1230, machinery with safety functions driven by evolving or learned behavior falls under Annex I high-risk conformity.", note: "Keeping the safety envelope in deterministic, rated hardware avoids third-party conformity bottlenecks for the learned policy.", used: ["/#services", "/embedded/"], src: [["Smart robots, dual regulations — Bird & Bird", "https://www.twobirds.com/en/insights/2026/smart-robots,-dual-regulations-navigating-the-ai-act-and-machinery-compliance"], ["Navigating the legal maze — Timelex", "https://www.timelex.eu/en/blog/navigating-legal-maze-ai-autonomous-robots-and-eus-regulatory-overhaul"]] },
    { id: "three-frameworks", s: "act", r: "reported", checked: C, claim: "AI-enabled industrial cells in Europe must simultaneously satisfy the Machinery Regulation, the EU AI Act, and GDPR (for camera telemetry).", note: "Camera retention and face/badge redaction policies should be established during cell design.", used: ["/cloud/", "/#services"], src: [["Smart robots, dual regulations — Bird & Bird", "https://www.twobirds.com/en/insights/2026/smart-robots,-dual-regulations-navigating-the-ai-act-and-machinery-compliance"]] },
    // ---- capture ----
    { id: "mcap-default", s: "capture", r: "verified", checked: C, claim: "MCAP is the default rosbag2 storage format from ROS 2 Iron (May 2023) onward.", note: "Provides self-contained schema registration and indexed seeking across heterogeneous streams.", used: ["/cloud/"], src: [["MCAP as the ROS 2 default bag format — Foxglove", "https://foxglove.dev/blog/mcap-as-the-ros2-default-bag-format"], ["ROS 2 MCAP recording — ROS Discourse", "https://discourse.openrobotics.org/t/new-ros-2-support-for-recording-data-directly-to-mcap-files/27735"]] },
    { id: "episode-formats", s: "capture", r: "reported", checked: C, claim: "Robot learning pipelines have converged on episode-indexed dataset formats (LeRobot, RLDS) distinct from operational ROS 2 logs.", note: "Requires a deterministic, versioned ETL pipeline from raw MCAP ring buffers to training episodes.", used: ["/cloud/"], src: [["LeRobot: open-source library for robot learning", "https://arxiv.org/pdf/2602.22818"], ["Visualizing Open X-Embodiment — Foxglove", "https://foxglove.dev/blog/visualizing-open-x-embodiment-dataset-in-foxglove"]] },
    { id: "gpu-prices", s: "capture", r: "reported", rots: true, checked: C, claim: "Cloud H100-class GPU capacity rents for roughly $2 to $4 per card-hour on current spot and reserved markets.", note: "Fine-tuning compute is a minor line item compared to teleoperation labor and storage.", used: ["/cloud/"], src: [["H100 GPU cloud pricing in 2026 — CloudZero", "https://www.cloudzero.com/blog/h100-gpu-cost/"]] },
    { id: "finetune-time", s: "capture", r: "reported", rots: true, checked: C, claim: "Parameter-efficient fine-tuning of a VLA or diffusion policy on a few hundred episodes completes overnight on a single GPU.", note: "Full-weight fine-tuning across 8 GPUs typically completes within 24 to 48 hours.", used: ["/cloud/"], src: [["Scaling VLA model training on a budget", "https://www.roboticscenter.ai/blog/scaling-vla-training-on-a-budget"]] },
    { id: "training-cheap", s: "capture", r: "position", checked: C, claim: "In industrial physical AI programs, data collection, curation, and hardware evaluation cost 5× to 10× more than GPU training compute.", note: "Budget for operator rigs, automated episode QC, and closed-loop test benches first.", used: ["/cloud/"], src: [["Teleoperation data collection benchmarks", "https://www.dataxpower.com/blog/teleoperation-data-collection-service"], ["H100 GPU cloud pricing — CloudZero", "https://www.cloudzero.com/blog/h100-gpu-cost/"]] },
    { id: "managed-robotics-withdrawn", s: "capture", r: "reported", checked: C, claim: "First-generation cloud robotics PaaS offerings (such as AWS RoboMaker) have been deprecated in favor of edge agents and modular fleet stacks.", note: "Avoid monolithic cloud lock-in; keep wire formats open (MCAP, Parquet, OCI containers).", used: ["/cloud/"], src: [["AWS RoboMaker support lifecycle", "https://docs.aws.amazon.com/robomaker/latest/dg/chapter-support-policy.html"]] },
    // ---- imagine ----
    { id: "three-families", s: "imagine", r: "reported", checked: C, claim: "Three distinct architectures are marketed as 'world models': GPU physics simulators, generative video models, and latent dynamics planners.", note: "Only GPU physics engines are production-ready for closed-loop policy training today.", used: ["/world-models/"], src: [["The State of Simulation for Physical AI — Hugging Face", "https://huggingface.co/blog/nvidia/state-of-simulation-for-physical-ai"], ["From World Models to World Action Models", "https://arxiv.org/pdf/2607.00836"]] },
    { id: "newton", s: "imagine", r: "reported", rots: true, checked: C, claim: "Open-source GPU-accelerated differentiable physics (Newton 1.0 / MuJoCo Warp) with SDF collision and deformables reached 1.0 in 2026.", note: "Enables thousands of parallel contact environments per GPU with validated sim-to-real transfer.", used: ["/world-models/"], src: [["Newton physics integration — Isaac Lab", "https://isaac-sim.github.io/IsaacLab/main/source/experimental-features/newton-physics-integration/index.html"], ["Isaac Lab: GPU-accelerated simulation framework", "https://arxiv.org/pdf/2511.04831"]] },
    { id: "video-world-models", s: "imagine", r: "reported", rots: true, checked: C, claim: "Generative video world models synthesize visually consistent interactive scenes for visual domain augmentation and rare-event testing.", note: "Useful for perception stress-testing, but pixel prediction does not model contact forces or friction.", used: ["/world-models/"], src: [["Genie (world model) — Overview", "https://en.wikipedia.org/wiki/Genie_%28world_model%29"], ["The State of Simulation for Physical AI — Hugging Face", "https://huggingface.co/blog/nvidia/state-of-simulation-for-physical-ai"]] },
    { id: "latent-world-models", s: "imagine", r: "reported", checked: C, claim: "Latent dynamics world models enable short-horizon counterfactual planning and higher sample efficiency than pure behavior cloning.", note: "Promising for recovery behaviors; still early in industrial deployment.", used: ["/world-models/"], src: [["From World Models to World Action Models", "https://arxiv.org/pdf/2607.00836"]] },
    { id: "gaussian-splat", s: "imagine", r: "reported", checked: C, claim: "3D Gaussian Splatting (3DGS) reconstructs photorealistic cell digital twins from sparse camera views in minutes, with mesh extraction for collision.", note: "Captures cable trays, workbenches, and lighting as-built rather than relying on outdated facility CAD.", used: ["/world-models/"], src: [["High-fidelity digital twin for manipulation via 3DGS", "https://arxiv.org/abs/2601.03200"], ["3D Gaussian Splatting in Robotics survey", "https://arxiv.org/pdf/2410.12262"]] },
    { id: "gap-task-shaped", s: "imagine", r: "position", checked: C, claim: "Sim-to-real transfer is task-dependent: locomotion and rigid picking transfer at 70–85%, whereas tight-tolerance contact assembly transfers at 20–50%.", note: "Measure the transfer gap per task before committing engineering months to photorealistic simulation.", used: ["/world-models/"], src: [["The State of Simulation for Physical AI — Hugging Face", "https://huggingface.co/blog/nvidia/state-of-simulation-for-physical-ai"], ["Isaac Lab framework", "https://arxiv.org/pdf/2511.04831"]] },
    // ---- cross-loop benchmarks ----
    { id: "demos-per-task", s: "capture", r: "directional", checked: C, claim: "Current imitation-learning policies require 50 to 200 clean teleoperated demonstrations per task variant.", note: "A 20-task cell requires 1,000 to 4,000 clean episodes plus held-out evaluation runs.", used: ["/cloud/"], src: [["Survey on Vision-Language-Action Models", "https://arxiv.org/pdf/2405.14093"], ["Embodied AI teleoperation benchmarks 2026", "https://www.evsint.com/embodied-ai-data-collection-teleoperation-sim-to-real-2026/"]] },
    { id: "uptime-vs-runtime", s: "act", r: "reported", rots: true, checked: C, claim: "Manufacturing lines require 95% to 99% uptime, whereas current battery-powered humanoid platforms run 1.5 to 5 hours per charge.", note: "Fixed-base or rail-mounted arms on plant power remain the workhorse for continuous multi-shift production.", used: ["/#services"], src: [["Humanoid robot battery reality check — RobotWale", "https://www.robotwale.com/article/humanoid-robot-battery-runtime-reality-check"], ["State of humanoid robotics 2026", "https://roboticsandautomationnews.com/2026/02/07/the-state-of-humanoid-robotics-from-research-labs-to-real-world-potential/98732/"]] },
    { id: "validation-year", s: "act", r: "reported", checked: C, claim: "2026 industrial physical AI deployments are concentrated in supervised, narrow pilots rather than lights-out factory-wide autonomy.", note: "Scope initial deployments to 1–3 high-mix stations with clear cycle-time and fallback criteria.", used: ["/#services"], src: [["Humanoid robots 2026 deployment tracker", "https://robobrief.tech/blog/humanoid-robots-2026/"], ["Humanoid robotics engineering challenges", "https://blog.robozaps.com/b/challenges-in-humanoid-robotics"]] },
    { id: "deployment-clusters", s: "act", r: "reported", checked: C, claim: "Proven physical AI ROI clusters in tote handling, line-side kitting, disordered bin picking, machine tending, and visual inspection.", note: "Sub-millimeter high-speed assembly on rigid datums is still faster and cheaper with hard automation.", used: ["/#services"], src: [["State of humanoid robotics 2026", "https://roboticsandautomationnews.com/2026/02/07/the-state-of-humanoid-robotics-from-research-labs-to-real-world-potential/98732/"]] },
    { id: "generalist-landscape", s: "decide", r: "reported", rots: true, checked: C, claim: "Production policy architectures span flow-matching VLAs, compact diffusion policies, and cross-embodiment foundation backbones.", note: "Distilling a task-specific policy from a larger backbone is standard practice to meet embedded loop budgets.", used: ["/embedded/"], src: [["Survey on Vision-Language-Action Models", "https://arxiv.org/pdf/2405.14093"]] }
  ];
  const EVENTS = [
    { d: "2023-05-01", label: "MCAP becomes the rosbag2 default (ROS 2 Iron)", s: "capture" },
    { d: "2025-06-01", label: "ISO 10218-1:2025 and -2:2025 published", s: "act" },
    { d: "2026-03-01", label: "Open GPU physics engine Newton reaches 1.0", s: "imagine" },
    { d: C, label: "All sources on this page verified", s: "act", checked: true },
    { d: "2027-01-20", label: "EU Machinery Regulation (EU) 2023/1230 applies", s: "act" },
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

  // ---- render 2-column readable claim cards ----
  const board = $("boardGrid");
  function renderBoard() {
    const shown = CLAIMS.filter(visible);
    if (!shown.length) {
      board.innerHTML = '<div class="plate claims-grid__empty"><p class="mono muted">No claims match the current filters.</p></div>';
    } else {
      board.innerHTML = shown.map((c) => {
        const s = STATIONS.find((x) => x.id === c.s) || STATIONS[0];
        const d = decay(c);
        const sel = state.sel === c.id;
        return '<article class="plate marks claim-card' + (sel ? " is-sel" : "") + '" id="claim-' + c.id + '" data-id="' + c.id + '">' +
          '<div class="claim-card__head mono">' +
            '<a class="claim-card__station" href="' + s.page + '">' + s.name + ' // ' + s.pageName + '</a>' +
            '<span class="claim-card__badges">' +
              (d ? '<span class="claim-card__decay" title="Time-sensitive benchmark: checked ' + fmtDate(c.checked) + '">Time-sensitive</span>' : '') +
              '<span class="claim-card__grade" title="' + RATINGS[c.r].def + '"><i class="sq sq--' + c.r + '"></i>' + RATINGS[c.r].name + '</span>' +
            '</span>' +
          '</div>' +
          '<h3 class="claim-card__title">' + c.claim + '</h3>' +
          '<p class="claim-card__note muted">' + c.note + '</p>' +
          '<div class="claim-card__foot">' +
            '<div class="claim-card__sources">' +
              c.src.map((x) => '<a class="claim-card__src" href="' + x[1] + '" target="_blank" rel="noopener">' + x[0] + ' ↗</a>').join("") +
            '</div>' +
            '<div class="claim-card__used mono muted">Used on: ' +
              c.used.map((u) => '<a href="' + u + '">' + (PAGE_LABELS[u] || u) + '</a>').join(" · ") +
            '</div>' +
          '</div>' +
        '</article>';
      }).join("");
    }
    const overdueCount = CLAIMS.filter((c) => { const d = decay(c); return d && d.state === "overdue"; }).length;
    if ($("boardCount")) $("boardCount").textContent = shown.length + " of " + CLAIMS.length + " claims shown";
    if ($("rOverdue")) $("rOverdue").textContent = String(overdueCount);
    return shown;
  }

  function select(id) {
    state.sel = state.sel === id ? null : id;
    renderBoard(); save();
    if (state.sel) {
      const el = document.getElementById("claim-" + state.sel);
      if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }
  }

  // ---- timeline ----
  function renderTimeline() {
    const svg = $("evidenceTimeline"); if (!svg) return;
    const t0 = new Date("2023-01-01T00:00:00"), t1 = new Date("2028-01-01T00:00:00");
    const X = (d) => 60 + (new Date(d + "T00:00:00") - t0) / (t1 - t0) * 780;
    let html = '<line x1="60" y1="120" x2="840" y2="120" stroke="var(--line-strong)" stroke-width="1"/>';
    for (let y = 2023; y <= 2028; y++) { const x = X(y + "-01-01"); html += '<line x1="' + x + '" y1="114" x2="' + x + '" y2="126" stroke="var(--ink)" stroke-width="1"/><text x="' + x + '" y="146" text-anchor="middle">' + y + '</text>'; }
    EVENTS.forEach((e, i) => {
      const x = X(e.d), up = i % 2 === 0, y = up ? 70 : 170, ty = up ? 58 : 190;
      html += '<line x1="' + x + '" y1="120" x2="' + x + '" y2="' + y + '" stroke="var(--line-strong)" stroke-width="1" stroke-dasharray="2 3"/>';
      html += e.checked ? '<rect x="' + (x - 4) + '" y="' + (y - 4) + '" width="8" height="8" fill="var(--accent)"/>' : '<rect x="' + (x - 3.5) + '" y="' + (y - 3.5) + '" width="7" height="7" fill="none" stroke="var(--ink)" stroke-width="1.5"/>';
      html += '<text x="' + x + '" y="' + ty + '" text-anchor="middle"' + (e.checked ? ' fill="var(--accent)"' : "") + '>' + String(i + 1).padStart(2, "0") + '</text>';
    });
    const xt = X(TODAY.toISOString().slice(0, 10));
    html += '<line x1="' + xt + '" y1="100" x2="' + xt + '" y2="140" stroke="var(--accent)" stroke-width="1.5"/><text x="' + xt + '" y="96" text-anchor="middle" fill="var(--accent)">Today</text>';
    svg.innerHTML = html;
    const list = $("timelineList");
    if (list) list.innerHTML = EVENTS.map((e, i) => '<li' + (e.checked ? ' class="is-checked"' : "") + '><span class="mono">' + String(i + 1).padStart(2, "0") + ' · ' + fmtDate(e.d) + '</span>' + e.label + '</li>').join("");
  }

  // ---- controls ----
  function save() {
    const on = Object.keys(state.ratings).filter((k) => state.ratings[k]);
    K.writeState({ station: state.station === "all" ? "" : state.station, rating: on.length === 1 ? on[0] : "", perishable: state.perishable ? 1 : "", q: state.q, claim: state.sel || "" });
  }
  const seg = $("boardStations");
  seg.querySelectorAll(".seg__btn").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.station === state.station);
    b.addEventListener("click", () => { state.station = b.dataset.station; seg.querySelectorAll(".seg__btn").forEach((x) => x.classList.toggle("is-active", x === b)); renderBoard(); save(); });
  });
  Object.keys(RATINGS).forEach((r) => { const el = $("rate-" + r); el.checked = state.ratings[r]; el.addEventListener("change", () => { state.ratings[r] = el.checked; renderBoard(); save(); }); });
  const per = $("rate-perishable"); per.checked = state.perishable; per.addEventListener("change", () => { state.perishable = per.checked; renderBoard(); save(); });
  const search = $("boardSearch"); search.value = state.q;
  search.addEventListener("input", K.debounce(() => { state.q = search.value.trim().slice(0, 60); renderBoard(); save(); }, 120));
  $("boardReset").addEventListener("click", () => {
    Object.assign(state, { station: "all", ratings: { verified: true, reported: true, directional: true, position: true }, perishable: false, q: "", sel: null });
    seg.querySelectorAll(".seg__btn").forEach((x) => x.classList.toggle("is-active", x.dataset.station === "all"));
    Object.keys(RATINGS).forEach((r) => { $("rate-" + r).checked = true; }); per.checked = false; search.value = "";
    renderBoard(); save();
  });
  $("boardEmail").addEventListener("click", () => {
    const shown = CLAIMS.filter(visible);
    K.mailto("Big Sky Systems research & sources — " + shown.length + " claims", [
      "Selected claims and sources from the Big Sky Systems research page:", "",
      ...shown.map((c) => "- [" + RATINGS[c.r].name + (c.rots ? ", time-sensitive" : "") + "] " + c.claim + "\n  Sources: " + c.src.map((x) => x[1]).join(" ; ")),
      "", "Filters: " + (state.station === "all" ? "all stations" : state.station) + (state.perishable ? ", time-sensitive only" : "") + (state.q ? ", search '" + state.q + "'" : ""),
      "Link: " + window.location.href
    ], "Hi Big Sky Systems,");
  });

  if ($("rClaims")) $("rClaims").textContent = String(CLAIMS.length);
  renderBoard(); renderTimeline();
  if (state.sel) {
    setTimeout(() => {
      const el = document.getElementById("claim-" + state.sel);
      if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }, 100);
  }
  window.BSS_EVIDENCE = { state, CLAIMS, decay, select, count: () => CLAIMS.filter(visible).length };
})();
