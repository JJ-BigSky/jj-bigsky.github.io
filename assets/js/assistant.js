/* SKY-1 assistant. Default brain: a scripted intent matcher that runs in the
   browser (no network). Optional: set BSS_CONFIG.assistantEndpoint to your own
   AI backend and SKY-1 will talk to it instead. */
(function () {
  const $ = (id) => document.getElementById(id);
  const chat = $("chat"), log = $("chatLog"), chips = $("chatChips"), form = $("chatForm"), input = $("chatInput"), status = $("chatStatus");
  if (!chat) return;
  const S = () => window.BSS_SOUND, M = () => window.BSS_MASCOT;
  const cfg = window.BSS_CONFIG || {};
  const EMAIL = cfg.email || "jj@bigsky.systems";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const history = [];
  let opened = false;

  const KB = [
    { k: ["hello", "hi", "hey", "yo", "howdy", "morning", "evening"], a: "Hi! I'm SKY-1, the resident robot. I can explain what Big Sky Systems does, how an engagement works, or help you draft an email to a human. What are you building?", chips: ["What do you do?", "How does it start?", "Draft an email"] },
    { k: ["what do you do", "services", "offer", "help with", "capabilities", "do you do"], a: "Six things, roughly:\n• Lab design & buildout\n• Robot selection & integration\n• Software & simulation (ROS 2, digital twins, CI)\n• Safety & compliance\n• Fractional robotics leadership\n• Training & enablement\n\nAsk about any of them and I'll go deeper.", chips: ["Lab design", "Safety", "ROS 2"] },
    { k: ["lab design", "buildout", "layout", "floor plan", "build a lab", "new lab", "empty bay", "power", "facility"], a: "Lab design starts with your parts and your people, not the robot. We produce a floor plan with reach envelopes and safety zones, a utility schedule (power, air, data), a vendor-neutral bill of materials, and a build sequence so nothing blocks anything. Try the Lab Builder on this page for a taste.", chips: ["Open the Lab Builder", "How long does it take?"] },
    { k: ["robot selection", "which robot", "cobot", "arm", "amr", "mobile robot", "gripper", "vendor", "bake-off", "bakeoff", "integration", "universal robots", "fanuc", "kuka", "abb"], a: "We're vendor-neutral on purpose. We write a requirements matrix, shortlist, then run hands-on bake-offs with your real parts. Then we integrate the winner: end-of-arm tooling, fixturing, commissioning, and acceptance tests. No brochures were harmed.", chips: ["Safety", "Timelines"] },
    { k: ["ros", "ros 2", "ros2", "software", "simulation", "sim", "isaac", "gazebo", "mujoco", "digital twin", "ci", "code", "python", "c++"], a: "Software: ROS 2 architecture with sane package conventions, sim-first workflows (Isaac Sim, Gazebo, MuJoCo), digital twins, hardware-in-the-loop test rigs, and CI that runs on the actual robot. Also data pipelines, because every run should make the next one better.", chips: ["Do you do AI?", "Training"] },
    { k: ["ai", "machine learning", "ml", "learning", "vision", "foundation model", "llm", "vla", "policy", "imitation"], a: "Yes, carefully. We integrate vision and learned policies where they earn their place, with evals and fallbacks, and we're honest when a fixture and a limit switch would beat a neural net. I say this as a neural-net-adjacent entity.", chips: ["ROS 2", "Safety"] },
    { k: ["safety", "compliance", "iso", "10218", "15066", "r15.06", "risk assessment", "e-stop", "estop", "fence", "guarding", "osha"], a: "Safety is a design input, not a sign-off. We do task-based risk assessments, a safety architecture (performance levels, categories, zones), collaborative-operation validation per ISO/TS 15066, and a documentation package for your insurer and your sleep. Standards we work against: ISO 10218, ISO/TS 15066, ANSI/RIA R15.06.", chips: ["Timelines", "Draft an email"] },
    { k: ["fractional", "leadership", "head of robotics", "cto", "roadmap", "hiring", "hire", "lead"], a: "A fractional robotics lead is a part-time head of robotics: quarterly roadmap tied to milestones, hiring plans and interview loops, vendor and budget management, and someone to kindly blame when it slips. Good for teams between 'one brilliant engineer' and 'a real org chart'.", chips: ["Pricing", "Draft an email"] },
    { k: ["training", "enablement", "course", "teach", "learn", "runbook", "documentation", "docs"], a: "Training is role-based: operators, engineers, and leads each get their own curriculum. Runbooks, troubleshooting trees, and recorded walkthroughs of your actual lab. The goal is a team that doesn't need us anymore. We're weirdly proud of that.", chips: ["How does it start?", "Services"] },
    { k: ["how does it start", "process", "method", "engagement", "work with you", "first step", "get started", "begin", "steps"], a: "Five stations on one belt: Listen (a discovery sprint), Sketch (concepts and simulation), Build (short loops with weekly demos), Prove (acceptance tests and safety validation), Hand off (training and docs). Most people start with the discovery sprint. It's low-commitment and high-clarity.", chips: ["How long does it take?", "Pricing"] },
    { k: ["how long", "timeline", "timelines", "duration", "weeks", "months", "fast", "schedule", "when"], a: "Typical shapes: a discovery sprint is about two weeks. A pilot cell is usually two to four months. A full lab buildout runs one to three quarters depending on scope and procurement. Robots ship slower than software. I say this with love.", chips: ["Pricing", "Draft an email"] },
    { k: ["price", "pricing", "cost", "budget", "rate", "how much", "expensive", "fee", "quote"], a: "Discovery sprints are fixed-fee. Builds are scoped after discovery so the number means something. Fractional leadership is a monthly retainer. For a real quote, talk to a human: I can draft the email for you.", chips: ["Draft an email", "How does it start?"] },
    { k: ["where", "location", "based", "remote", "on-site", "onsite", "travel", "montana", "office"], a: "We work remotely and on-site, and yes, we will come stand in your lab. 'Big Sky' is a state of mind and also a very large sky.", chips: ["Contact", "Services"] },
    { k: ["contact", "email", "reach", "talk to a human", "human", "person", "call", "phone"], a: "The human is at " + EMAIL + ". There's a form at the bottom of the page that composes the email for you, or say 'draft an email' and I'll do it here.", chips: ["Draft an email", "Scroll to contact"] },
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
    { k: ["help", "what can you do", "options", "menu"], a: "Ask me about services, how engagements start, timelines, pricing, ROS 2, safety, or AI. Or say 'draft an email', 'tell me a joke', 'dance', or 'toggle the sky'.", chips: ["Services", "Timelines", "Tell me a joke"] }
  ];
  const JOKES = [
    "Why did the robot go back to school? Its skills were getting a little rusty.",
    "I asked the conveyor belt for its opinion. It just kept going on and on.",
    "Our safety fence has zero sense of humor. It's very guarded.",
    "A ROS 2 node walks into a bar. Nobody hears it. Wrong QoS settings.",
    "I told the cobot a joke. It didn't laugh. Collaborative, but not that collaborative."
  ];

  function norm(s) { return s.toLowerCase().replace(/[^a-z0-9+#\s-]/g, " ").replace(/\s+/g, " ").trim(); }
  function score(msg, entry) {
    let s = 0;
    for (const k of entry.k) {
      if (msg === k) s += 10;
      else if (msg.includes(k)) s += k.includes(" ") ? 5 : 3;
      else if (k.length > 4 && msg.split(" ").some((w) => w.length > 3 && (k.startsWith(w) || w.startsWith(k)))) s += 1;
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
    if (text.startsWith("__GOTO:")) { const id = text.slice(7, -2); setTimeout(() => document.getElementById(id).scrollIntoView({ behavior: "smooth" }), 300); return { text: "Taking you there. Watch your step.", chips: ["Services", "Draft an email"] }; }
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
      if (/another|again|more/i.test(userText) && history.length && /joke|laugh|rusty|conveyor|guarded|QoS|cobot/i.test(history[history.length - 1].content)) out = special("__JOKE__");
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
  document.getElementById("heroAsk").addEventListener("click", open);
  document.getElementById("chatClose").addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !chat.hidden) close(); });
  form.addEventListener("submit", (e) => { e.preventDefault(); send(input.value); });
  if (cfg.assistantEndpoint) status.textContent = "// remote assistant";

  window.BSS_CHAT = { open, close, toggle, send };
})();
