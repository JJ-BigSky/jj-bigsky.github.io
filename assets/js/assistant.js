/* SKY-1 assistant. Default brain: a scripted intent matcher that runs in the
   browser (no network). Optional: set BSS_CONFIG.assistantEndpoint to your own
   AI backend and SKY-1 will talk to it instead. */
(function () {
  const $ = (id) => document.getElementById(id);
  const chat = $("chat"), log = $("chatLog"), chips = $("chatChips"), form = $("chatForm"), input = $("chatInput"), status = $("chatStatus");
  if (!chat) return;
  const S = () => window.BSS_SOUND, M = () => window.BSS_MASCOT;
  const cfg = window.BSS_CONFIG || {};
  const EMAIL = cfg.email || "build@bigsky.systems";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const history = [];
  let opened = false;
  const PAGE = document.body.dataset.page || "home";
  const GREET = {
    vision: "You're on the perception page. Ask me what breaks it. That list is more useful than the list of what works.",
    embedded: "Latency page. My honest advice: measure the tail, not the mean.",
    "world-models": "Simulation page. I have opinions about which third of your task list belongs in here.",
    cloud: "Data page. Least glamorous, most decisive. Ask me the multiplication.",
    "physical-ai": "The hub. Everything here is real and most of it is early. Want the honest cost first?",
    notes: "Field notes. The long versions of the arguments. Ask me which one to read first and I'll pick the one that saves you a quarter.",
    research: "The evidence. Every number on the site, rated and dated, with its sources. Pick a plate, or ask me which ones are perishable."
  };
  const PAGE_CHIPS = {
    vision: ["What breaks vision?", "Run the perception lab", "Draft an email"],
    embedded: ["Build a latency budget", "Why p99.9?", "Draft an email"],
    "world-models": ["What is a world model?", "How many demos?", "Draft an email"],
    cloud: ["Keep the raw?", "How many demos?", "Draft an email"],
    "physical-ai": ["Is AI ready for us?", "How many demos?", "Draft an email"],
    notes: ["Which note first?", "Is AI ready for us?", "Draft an email"],
    research: ["Which claims are perishable?", "Is AI ready for us?", "Draft an email"]
  };
  const HELLO = GREET[PAGE]
    ? GREET[PAGE] + " I can also explain what Big Sky Systems does, how an engagement works, or draft an email to a human."
    : "Hi! I'm SKY-1, the resident robot. I can explain what Big Sky Systems does, how an engagement works, or help you draft an email to a human. What are you building?";
  // where each instrument lives, for __CALC: on a sheet that doesn't have it
  const CALC_PAGES = { visionLab: "/vision/#lab", latencyCalc: "/embedded/#lab", demoCalc: "/physical-ai/", dataCalc: "/cloud/", gapMeter: "/world-models/" };
  const PAGE_NAMES = { "/research/": "the research page", "/notes/": "the field notes", "/vision/": "the Vision page", "/embedded/": "the Embedded page", "/physical-ai/": "the Physical AI page", "/cloud/": "the Data & cloud page", "/world-models/": "the World models page", "/": "the home page" };

  const KB = [
    { k: ["hello", "hi", "hey", "yo", "howdy", "morning", "evening"], a: HELLO, chips: PAGE_CHIPS[PAGE] || ["What do you do?", "Show me the loop", "Draft an email"] },
    { k: ["what do you do", "services", "offer", "help with", "capabilities", "do you do"], a: "Ten things, in two families. Six make your lab boring:\n• Lab design, robot selection, software & simulation, safety, a fractional robotics lead, training\nFour make it think:\n• Perception, on-robot autonomy, simulation & world models, robot data & cloud\n\nAsk about any of them and I'll go deeper. Boring is still the goal.", chips: ["Lab design", "Safety", "Do you do AI?"] },
    { k: ["lab design", "buildout", "layout", "floor plan", "build a lab", "new lab", "empty bay", "power", "facility"], a: "Lab design starts with your parts and your people, not the robot. We produce a floor plan with reach envelopes and safety zones, a utility schedule (power, air, data), a vendor-neutral bill of materials, and a build sequence so nothing blocks anything. Try the Lab Builder on this page for a taste.", chips: ["Open the Lab Builder", "How long does it take?"] },
    { k: ["robot selection", "which robot", "cobot", "arm", "amr", "mobile robot", "gripper", "vendor", "bake-off", "bakeoff", "integration", "universal robots", "fanuc", "kuka", "abb"], a: "We're vendor-neutral on purpose. We write a requirements matrix, shortlist, then run hands-on bake-offs with your real parts. Then we integrate the winner: end-of-arm tooling, fixturing, commissioning, and acceptance tests. No brochures were harmed.", chips: ["Safety", "Timelines"] },
    { k: ["ros", "ros 2", "ros2", "software", "ci", "code", "python", "c++", "dds", "qos"], a: "Software: ROS 2 architecture with sane package conventions, sim-first workflows (Isaac Sim, Gazebo, MuJoCo), digital twins, hardware-in-the-loop test rigs, and CI that runs on the actual robot. Also data pipelines, because every run should make the next one better.", chips: ["Do you do AI?", "Training"] },
    { k: ["ai", "machine learning", "ml", "learning", "foundation model", "llm", "vla", "policy", "neural", "deep learning", "do you do ai"], a: "Yes, carefully. We integrate vision and learned policies where they earn their place, with evals and fallbacks, and we're honest when a fixture and a limit switch would beat a neural net. I say this as a neural-net-adjacent entity.\n\nThere's a whole loop behind that answer now: perception, on-robot autonomy, simulation, and the data platform underneath. Ask me about any of them, or I can show you the honest cost of the demonstrations first.", chips: ["Show me the loop", "How many demos?", "Is AI ready for us?"] },
    { k: ["physical ai", "embodied", "embodied ai", "humanoid", "humanoids", "generalist policy", "generalist policies", "foundation model for robots", "robot foundation model", "learned policy", "learned policies"], a: "Physical AI is real, moving fast, and being sold about four years ahead of where it is. The bottleneck isn't the model:\n• Demonstrations: roughly fifty to two hundred per task, depending on the task\n• Evaluation: the harness is the deliverable and the model is a detail\n• The distance between a policy that works most of the time and one you'd leave unattended\nWe work in that gap. The long version is on the Physical AI page.", chips: ["Take me to Physical AI", "How many demos?", "Is AI ready for us?"] },
    { k: ["world model", "world models", "simulation", "simulator", "sim", "sim to real", "sim-to-real", "reality gap", "isaac", "isaac sim", "isaac lab", "mujoco", "gazebo", "newton", "digital twin", "synthetic data", "domain randomization", "gaussian splat", "what is a world model"], a: "Three things get called a world model, and only one of them is new:\n• Physics simulators: mature, GPU-parallel, where the budget goes today\n• Video world models: genuinely impressive, not yet a training environment for your cell\n• Latent world models: the planning branch, early in industrial practice\nSim transfers well for locomotion and rigid picking, badly for contact and deformables. That's knowable before you build the environment.", chips: ["Take me to World models", "How many demos?", "Do you do AI?"] },
    { k: ["embedded", "edge", "edge ai", "on-robot", "on robot", "jetson", "latency", "real time", "real-time", "rt kernel", "quantization", "quantize", "quantized", "int8", "fp16", "inference", "tensorrt", "compute", "p99", "p99.9", "why p99.9", "tail latency", "control loop", "hertz", "hz"], a: "On-robot autonomy is a latency budget with a power budget stapled to it:\n• Anything inside the control loop runs on the robot. Anything that can wait a second can go to the cloud. There is no third category\n• The number that breaks robots is p99.9, not the mean\n• A quantized model is a different model, and it gets the full evaluation suite\nThere's a latency budget builder on the Embedded page. Fill it and watch it overflow.", chips: ["Take me to Embedded", "Build a latency budget", "Safety"] },
    { k: ["cloud", "data", "dataset", "datasets", "storage", "fleet", "model training", "training infrastructure", "train a policy", "gpu", "gpus", "mlops", "rollout", "logs", "logging", "mcap", "rosbag", "retention", "data pipeline", "keep the raw", "provenance"], a: "Your fleet is a data business with a floor plan. Three rules:\n• Keep the raw. Tiered and compressed, but keep it\n• Record provenance, not just data: which robot, which policy, which gripper, which shift\n• Decide retention on day one, before the bill decides for you\nAnd training compute is the cheap part. Collecting the demonstrations and proving the result is what costs. Do the multiplication on the Data & cloud page.", chips: ["Take me to Data & cloud", "How many demos?", "Physical AI"] },
    { k: ["vision", "camera", "cameras", "perception", "pose", "6dof", "6-dof", "grasp", "grasping", "bin picking", "depth", "lighting", "calibration", "hand-eye", "segmentation", "detection", "occlusion", "specular", "transparent", "sensor", "what breaks vision"], a: "Six stages: detect, segment, depth, pose, grasp, verify. Four got much easier. Two didn't. What actually ends pilots:\n• Specular and transparent parts\n• Clutter and occlusion\n• Lighting drift and calibration drift\n• The last two percent of pose error\nControlled lighting is the cheapest reliability upgrade in the building. The Vision page has a pipeline you can ruin yourself.", chips: ["Take me to Vision", "Run the perception lab", "Safety"] },
    { k: ["how many demos", "how many demonstrations", "demonstrations", "demos", "demo", "teleop", "teleoperation", "data collection", "imitation learning", "imitation", "behavior cloning", "behaviour cloning", "demo budget"], a: "Rough rule: fifty to two hundred teleoperated demonstrations per task, depending on the task. A cell with twenty distinct tasks lands between one and four thousand. Someone has to perform every one, and someone has to throw out the bad ones.\n\nThirty productive hours a week per operator, not forty, because teleop is tiring and people have meetings. The demonstration budget calculator on the Physical AI page turns that into operator-weeks and a number for your CFO.", chips: ["Take me to Physical AI", "Is AI ready for us?", "Draft an email"] },
    { k: ["is ai ready", "should we use ai", "do we need ai", "need ai", "hype", "worth it", "just use ai", "ready for ai", "ai ready", "use ai", "triage"], a: "Honest triage, in order:\n• Same part, same pose, every cycle: a fixture and a limit switch. Cheaper, and no GPU\n• High part variation, contact-rich, deformable, or a long tail of variants: a learned policy is probably right\n• Either way, the data pipeline and the evaluation harness come first, because that's the part nobody demos\nUsually the answer is three of your tasks, and not the one you're excited about. A human will tell you which three.", chips: ["Physical AI", "How many demos?", "Draft an email"] },
    { k: ["which note first", "field notes", "notes", "essays", "reading", "blog", "articles"], a: "Six notes, each the long version of a page:\n• Your average latency is a lie (the p99.9 argument)\n• Fifty to two hundred (what demonstrations cost)\n• The simulator lied to you, and that's fine\n• Keep the raw (three data decisions for week one)\n• A fixture and a limit switch (in defence of not using AI)\n• AI in a safety function (the 2025 and 2027 rule changes)\nStart with the fixture one. It's the cheapest advice on the site.", chips: ["Take me to the notes", "Is AI ready for us?", "Draft an email"] },
    { k: ["take me to the notes", "go to notes", "notes page", "read the notes"], a: "__NAV:/notes/__" },
    { k: ["research", "evidence", "sources", "source", "citations", "citation", "references", "bibliography", "papers", "where does this number come from", "how do you know", "is that true", "perishable", "which claims are perishable", "stale"], a: "Every number on the site has a source and a grade: verified, reported, directional, or a position we hold. The perishable ones age in public, on the research page, from the day we checked them. If a bar has gone red, ask a human for the current version before you quote it.\n\nPerishable right now: the humanoid runtime figure, the flagship embedded module numbers, GPU prices, fine-tune times, the physics-engine and video-world-model specifics, and the generalist model landscape. Everything else is built to stay true.", chips: ["Take me to the research", "Is AI ready for us?", "Draft an email"] },
    { k: ["take me to the research", "go to research", "research page", "evidence page", "show me the sources", "show me the evidence"], a: "__NAV:/research/__" },
    { k: ["show me the loop", "the loop", "loop", "five stations", "closed loop"], a: "__GOTO:loop__" },
    { k: ["take me to vision", "go to vision", "vision page"], a: "__NAV:/vision/__" },
    { k: ["take me to embedded", "go to embedded", "embedded page", "autonomy page"], a: "__NAV:/embedded/__" },
    { k: ["take me to physical ai", "go to physical ai", "physical ai page", "the hub"], a: "__NAV:/physical-ai/__" },
    { k: ["take me to data", "take me to data & cloud", "take me to cloud", "go to cloud", "cloud page", "data page"], a: "__NAV:/cloud/__" },
    { k: ["take me to world models", "go to world models", "world models page", "simulation page"], a: "__NAV:/world-models/__" },
    { k: ["run the perception lab", "perception lab", "vision lab", "perception pipeline"], a: "__CALC:visionLab__" },
    { k: ["build a latency budget", "latency budget", "latency builder", "budget builder"], a: "__CALC:latencyCalc__" },
    { k: ["safety", "compliance", "iso", "10218", "10218-1", "10218-2", "2025", "15066", "r15.06", "risk assessment", "e-stop", "estop", "fence", "guarding", "osha", "machinery regulation", "eu ai act"], a: "Safety is a design input, not a sign-off. We do task-based risk assessments, a safety architecture (performance levels, categories, zones), collaborative-operation validation per ISO/TS 15066, and a documentation package for your insurer and your sleep. Standards we work against: ISO 10218-1:2025 and -2:2025 (the 2011 editions were superseded), ISO/TS 15066, ANSI/RIA R15.06.", chips: ["Timelines", "Draft an email"] },
    { k: ["fractional", "leadership", "head of robotics", "cto", "roadmap", "hiring", "hire", "lead"], a: "A fractional robotics lead is a part-time head of robotics: quarterly roadmap tied to milestones, hiring plans and interview loops, vendor and budget management, and someone to kindly blame when it slips. Good for teams between 'one brilliant engineer' and 'a real org chart'.", chips: ["Pricing", "Draft an email"] },
    { k: ["training", "enablement", "course", "teach", "learn", "runbook", "documentation", "docs"], a: "Training is role-based: operators, engineers, and leads each get their own curriculum. Runbooks, troubleshooting trees, and recorded walkthroughs of your actual lab. The goal is a team that doesn't need us anymore. We're weirdly proud of that.", chips: ["How does it start?", "Services"] },
    { k: ["how does it start", "process", "method", "engagement", "work with you", "first step", "get started", "begin", "steps"], a: "Five stations on one belt: Listen (a discovery sprint), Sketch (concepts and simulation), Build (short loops with weekly demos), Prove (acceptance tests and safety validation), Hand off (training and docs). Most people start with the discovery sprint. It's low-commitment and high-clarity.", chips: ["How long does it take?", "Pricing"] },
    { k: ["how long", "timeline", "timelines", "duration", "weeks", "months", "fast", "schedule", "when"], a: "Typical shapes: a discovery sprint is about two weeks. A pilot cell is usually two to four months. A full lab buildout runs one to three quarters depending on scope and procurement. Robots ship slower than software. I say this with love.", chips: ["Pricing", "Draft an email"] },
    { k: ["price", "pricing", "cost", "budget", "rate", "how much", "expensive", "fee", "quote"], a: "Discovery sprints are fixed-fee. Builds are scoped after discovery so the number means something. Fractional leadership is a monthly retainer. For a real quote, talk to a human: I can draft the email for you.", chips: ["Draft an email", "How does it start?"] },
    { k: ["where", "location", "based", "remote", "on-site", "onsite", "travel", "montana", "office"], a: "We work remotely and on-site, and yes, we will come stand in your lab. 'Big Sky' is a state of mind and also a very large sky.", chips: ["Contact", "Services"] },
    { k: ["contact", "email", "reach", "talk to a human", "human", "person", "call", "phone"], a: "The human is at " + EMAIL + ". There's a form at the bottom of the home page that composes the email for you, or say 'draft an email' and I'll do it here.", chips: ["Draft an email", "Scroll to contact"] },
    { k: ["draft an email", "draft", "write an email", "compose", "send email", "mail"], a: "__EMAIL__" },
    { k: ["who are you", "what are you", "are you ai", "are you real", "are you a bot", "chatgpt", "claude", "model", "sky-1", "sky1", "your name"], a: "I'm SKY-1. By default I'm a small scripted brain running entirely in your browser: no cloud, no tracking, nothing leaves this page. The site owner can plug me into a real AI backend if they want me smarter. Until then I'm charmingly limited.", chips: ["What do you do?", "Tell me a joke"] },
    { k: ["joke", "funny", "laugh", "pun"], a: "__JOKE__" },
    { k: ["dance", "party", "celebrate", "konami"], a: "__DANCE__" },
    { k: ["dark", "light", "theme", "day", "night", "sky", "paper", "graphite", "sheet"], a: "__THEME__" },
    { k: ["open the lab builder", "lab builder", "builder"], a: "__GOTO:builder__" },
    { k: ["scroll to contact", "go to contact"], a: "__GOTO:contact__" },
    { k: ["playground", "drive the arm", "robot arm"], a: "__GOTO:playground__" },
    { k: ["thanks", "thank you", "cheers", "great", "awesome", "cool", "nice"], a: "Anytime. I'll be down here in the corner, counting stars.", chips: ["Draft an email", "Tell me a joke"] },
    { k: ["bye", "goodbye", "see you", "later"], a: "Bye! Go build something boring. Boring means it works." },
    { k: ["help", "what can you do", "options", "menu"], a: "Ask me about services, how engagements start, timelines, pricing, ROS 2, safety, or AI. New this season: vision, embedded, world models, data & cloud, and physical AI. Or say 'draft an email', 'tell me a joke', 'dance', or 'toggle the sky'.", chips: ["Services", "Is AI ready for us?", "Tell me a joke"] }
  ];
  const JOKES = [
    "Why did the robot go back to school? Its skills were getting a little rusty.",
    "I asked the conveyor belt for its opinion. It just kept going on and on.",
    "Our safety fence has zero sense of humor. It's very guarded.",
    "A ROS 2 node walks into a bar. Nobody hears it. Wrong QoS settings.",
    "I told the cobot a joke. It didn't laugh. Collaborative, but not that collaborative.",
    "I asked the world model to imagine a cup of coffee. It imagined seven, all slightly wrong, at 24 frames a second.",
    "We quantized the policy to INT8 and it got 40% faster and 6% weirder. That's the trade, written honestly.",
    "My latency budget has a hole in it. It's shaped exactly like a vision transformer.",
    "The digital twin is doing great. The physical one has a loose cable."
  ];

  function norm(s) { return s.toLowerCase().replace(/[^a-z0-9+#\s-]/g, " ").replace(/\s+/g, " ").trim(); }
  function score(msg, entry) {
    let s = 0;
    const words = msg.split(" ");
    for (const k of entry.k) {
      if (msg === k) s += 10;
      else if (k.includes(" ")) { if (msg.includes(k)) s += 5; }
      else if (words.includes(k)) s += 3; // whole word only: "hi" must not match "which"
      else if (k.length > 4 && words.some((w) => w.length > 3 && (k.startsWith(w) || w.startsWith(k)))) s += 1;
    }
    return s;
  }
  function localReply(raw) {
    const msg = norm(raw);
    let best = null, bs = 0;
    for (const e of KB) { const s = score(msg, e); if (s > bs) { bs = s; best = e; } }
    if (!best || bs < 3) {
      return { text: "I'm a scripted robot with a narrow but enthusiastic brain. I didn't catch that. Try 'services', 'timelines', 'safety', 'ROS 2', or 'draft an email'. Or just email the human at " + EMAIL + ".", chips: ["Services", "Timelines", "Draft an email"] };
    }
    return { text: best.a, chips: best.chips };
  }

  // ---- rendering ----
  function add(role, text) {
    const d = document.createElement("div");
    d.className = "msg msg--" + (role === "me" ? "me" : "bot");
    d.innerHTML = linkify(text);
    log.appendChild(d); log.scrollTop = log.scrollHeight;
    return d;
  }
  function linkify(t) {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>');
  }
  function typing(on) {
    let t = log.querySelector(".msg--typing");
    if (on && !t) { t = document.createElement("div"); t.className = "msg msg--bot msg--typing"; t.innerHTML = "<i></i><i></i><i></i>"; log.appendChild(t); log.scrollTop = log.scrollHeight; }
    if (!on && t) t.remove();
  }
  function setChips(list) {
    chips.innerHTML = "";
    (list || []).forEach((c) => { const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = c; b.addEventListener("click", () => send(c)); chips.appendChild(b); });
  }
  function typeOut(el, text) {
    return new Promise((res) => {
      if (reduce) { el.innerHTML = linkify(text); res(); return; }
      let i = 0; const step = Math.max(1, Math.round(text.length / 60));
      const iv = setInterval(() => { i += step; el.innerHTML = linkify(text.slice(0, i)); log.scrollTop = log.scrollHeight; if (i % 12 < step && S()) S().speak(1); if (i >= text.length) { clearInterval(iv); res(); } }, 16);
    });
  }

  function special(text) {
    if (text === "__EMAIL__") {
      const draft = "Hi Big Sky Systems,\n\nWe're building: [describe your cell or lab]\nParts / payload: [ ]\nTimeline: [ ]\nWhat's breaking today: [ ]\n\nCan we talk?\n";
      setTimeout(() => { window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Robotics lab inquiry") + "&body=" + encodeURIComponent(draft); }, 600);
      return { text: "Opening your mail app with a starter draft to " + EMAIL + ". Fill in the brackets, hit send, and a human will reply. If nothing opened, the address is right there.", chips: ["Services", "Timelines"] };
    }
    if (text === "__JOKE__") return { text: JOKES[Math.floor(Math.random() * JOKES.length)], chips: ["Another one", "What do you do?"] };
    if (text === "__DANCE__") { setTimeout(() => window.BSS_DANCE && window.BSS_DANCE(), 300); return { text: "Initiating dance protocol. The arm is in on it. So are the stars.", chips: ["Stop", "Services"] }; }
    if (text === "__THEME__") { setTimeout(() => document.getElementById("themeToggle").click(), 300); return { text: "Flipping the sheet for you. I prefer graphite, personally. Less glare on my screen.", chips: ["Flip it back", "Services"] }; }
    if (text.startsWith("__GOTO:")) {
      const id = text.slice(7, -2), el = document.getElementById(id);
      if (el) { setTimeout(() => el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }), 300); return { text: "Taking you there. Watch your step.", chips: ["Services", "Draft an email"] }; }
      setTimeout(() => { window.location.href = "/#" + id; }, 600);
      return { text: "That's on the home page. Taking you there. Watch your step.", chips: [] };
    }
    if (text.startsWith("__NAV:")) { const path = text.slice(6, -2); setTimeout(() => { window.location.href = path; }, 600); return { text: "Taking you to " + (PAGE_NAMES[path] || path) + ". Same robot, different sheet.", chips: [] }; }
    if (text.startsWith("__CALC:")) {
      const id = text.slice(7, -2), el = document.getElementById(id);
      if (el) { setTimeout(() => el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }), 300); return { text: "It's right there. Ruin it responsibly.", chips: ["Is AI ready for us?", "Draft an email"] }; }
      const path = CALC_PAGES[id] || "/";
      setTimeout(() => { window.location.href = path; }, 600);
      return { text: "That instrument lives on another sheet. Taking you there.", chips: [] };
    }
    return null;
  }

  async function reply(userText) {
    typing(true);
    let out;
    if (cfg.assistantEndpoint) {
      try {
        status.textContent = "// thinking (remote)";
        const r = await fetch(cfg.assistantEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: userText, history: history.slice(-12) }) });
        const j = await r.json(); out = { text: j.reply || j.text || "Hmm, the backend said nothing.", chips: j.chips };
      } catch (e) { out = { text: "My remote brain isn't answering. Falling back to the local one.", chips: [] }; const l = localReply(userText); out.text += "\n\n" + l.text; out.chips = l.chips; }
      status.textContent = "// remote assistant";
    } else {
      await new Promise((r) => setTimeout(r, reduce ? 50 : 350 + Math.random() * 400));
      if (/another|again|more/i.test(userText) && history.length && /joke|laugh|rusty|conveyor|guarded|QoS|cobot|world model|INT8|latency budget|digital twin/i.test(history[history.length - 1].content)) out = special("__JOKE__");
      else if (/^(stop|flip it back)$/i.test(userText.trim())) { if (/flip/i.test(userText)) document.getElementById("themeToggle").click(); else window.BSS_DANCE && window.BSS_DANCE(false); out = { text: "Done.", chips: ["Services", "Draft an email"] }; }
      else { out = localReply(userText); const sp = special(out.text); if (sp) out = sp; }
    }
    typing(false);
    const el = add("bot", "");
    M() && M().mood("happy");
    await typeOut(el, out.text);
    history.push({ role: "assistant", content: out.text });
    setChips(out.chips);
  }

  function send(text) {
    text = (text || "").trim(); if (!text) return;
    add("me", text); history.push({ role: "user", content: text });
    input.value = ""; setChips([]);
    if (S()) S().click();
    reply(text);
  }

  function open() {
    chat.hidden = false; M() && M().hush();
    if (!opened) { opened = true; reply("hello"); }
    setTimeout(() => input.focus({ preventScroll: true }), 50);
  }
  function close() { chat.hidden = true; }
  function toggle() { chat.hidden ? open() : close(); }

  document.getElementById("mascotBtn").addEventListener("click", toggle);
  const ask = document.getElementById("heroAsk"); if (ask) ask.addEventListener("click", open); // hero button is home-only
  document.getElementById("chatClose").addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !chat.hidden) close(); });
  form.addEventListener("submit", (e) => { e.preventDefault(); send(input.value); });
  if (cfg.assistantEndpoint) status.textContent = "// remote assistant";

  if (GREET[PAGE]) setTimeout(() => { M() && M().say(GREET[PAGE], { mood: "happy" }); }, 1400);

  window.BSS_CHAT = { open, close, toggle, send };
})();
