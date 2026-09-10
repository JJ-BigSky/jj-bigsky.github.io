/* Lab Readiness Diagnostic: seven questions, one honest analog needle. */
(function () {
  const $ = (id) => document.getElementById(id);
  const qEl = $("quizQ"), opts = $("quizOpts"), prog = $("quizProgress"), result = $("quizResult");
  if (!qEl) return;
  const S = () => window.BSS_SOUND, M = () => window.BSS_MASCOT;

  const QUESTIONS = [
    { q: "Where does your robotics work live right now?", a: [["A napkin, a dream, and a very patient spouse", 0], ["A corner of the office with a borrowed arm", 1], ["A dedicated room with power and a door that locks", 2], ["A proper lab with cells, zones, and a sign-in sheet", 3]] },
    { q: "How do you decide which robot to buy?", a: [["Whichever vendor replies first", 0], ["Spec sheets and a gut feeling", 1], ["Bake-offs with our actual parts", 3], ["We already have a fleet and a standard", 2]] },
    { q: "Describe your software situation.", a: [["Python scripts named final_v2_REAL.py", 0], ["Vendor software and a teach pendant", 1], ["ROS 2 with version control, mostly", 2], ["ROS 2, simulation, CI, and a person who owns it", 3]] },
    { q: "Safety. Be honest.", a: [["We stand back and hope", 0], ["E-stop on the table, fence coming soon", 1], ["Risk assessment done, zones marked", 2], ["Validated, documented, and audited", 3]] },
    { q: "Who owns robotics at your company?", a: [["Whoever is most excited this week", 0], ["One brilliant engineer who never sleeps", 1], ["A small team with a roadmap", 2], ["A team, a lead, and a budget line", 3]] },
    { q: "What happens when the robot does something weird?", a: [["Power cycle and prayer", 0], ["Call the vendor", 1], ["Check the logs, then the runbook", 2], ["The dashboard already paged someone", 3]] },
    { q: "What's the goal for the next 12 months?", a: [["Figure out if robots make sense for us", 1], ["Get a pilot cell running reliably", 2], ["Scale from one cell to many", 3], ["Replace duct tape with documentation", 2]] }
  ];
  const TIERS = [
    { min: 0, name: "Napkin Stage", blurb: "Everything is possible and nothing is plugged in. This is the cheapest moment to get the plan right.", recs: ["Start with a 2-week discovery sprint before buying anything", "Simulate the cell before you pick the robot", "Write the safety requirements on day one, not day ninety"], track: "Discovery Sprint" },
    { min: 25, name: "Garage Tier", blurb: "You have a robot and a lot of enthusiasm. Now it needs a home, a plan, and fewer extension cords.", recs: ["Design the lab layout with reach envelopes and zones", "Run a vendor-neutral bake-off with your real parts", "Stand up ROS 2 with version control and a sim loop"], track: "Lab Design + Integration" },
    { min: 50, name: "Pilot-Ready", blurb: "Solid foundations. The risk now is scaling the wrong thing very efficiently.", recs: ["Formal task-based risk assessment and validation", "Hardware-in-the-loop tests and a soak test rig", "A fractional robotics lead to hold the roadmap"], track: "Safety + Fractional Lead" },
    { min: 75, name: "Lab-Grade", blurb: "You're the lab other labs visit. Our job is to make you boring: repeatable, documented, and fast to change.", recs: ["Scale playbook: cell N+1 in weeks, not quarters", "Runbooks, training, and an on-call that isn't one person", "Data pipelines so every run makes the next one better"], track: "Scale + Enablement" }
  ];

  let i = 0, score = 0, picks = [];
  const needle = $("gaugeNeedle"), arc = $("gaugeArc"), gval = $("gaugeValue");
  const maxScore = QUESTIONS.length * 3;

  function setGauge(pct) {
    needle.style.transform = "rotate(" + (-90 + pct * 1.8) + "deg)";
    arc.style.strokeDashoffset = String(251.3 * (1 - pct / 100));
    gval.textContent = Math.round(pct);
  }

  function render() {
    result.hidden = true; opts.hidden = false; qEl.hidden = false;
    const Q = QUESTIONS[i];
    prog.textContent = "Q " + (i + 1) + " / " + QUESTIONS.length;
    qEl.textContent = Q.q;
    opts.innerHTML = "";
    Q.a.forEach(([text, pts], k) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "opt"; b.dataset.cursor = "PICK";
      b.innerHTML = "<kbd>" + (k + 1) + "</kbd><span>" + text + "</span>";
      b.addEventListener("click", () => pick(k, pts, b));
      opts.appendChild(b);
    });
  }

  function pick(k, pts, btn) {
    opts.querySelectorAll(".opt").forEach((o) => o.classList.remove("is-picked"));
    btn.classList.add("is-picked");
    picks[i] = k; score += pts;
    setGauge(score / maxScore * 100);
    if (S()) S().click();
    setTimeout(() => { i++; if (i < QUESTIONS.length) render(); else finish(); }, 380);
  }

  function finish() {
    const pct = Math.round(score / maxScore * 100);
    const tier = TIERS.slice().reverse().find((t) => pct >= t.min) || TIERS[0];
    qEl.hidden = true; opts.hidden = true; result.hidden = false;
    prog.textContent = "RESULT // " + pct + " / 100";
    $("quizTier").textContent = tier.name;
    $("quizBlurb").textContent = tier.blurb + " Suggested track: " + tier.track + ".";
    $("quizRecs").innerHTML = tier.recs.map((r) => "<li>" + r + "</li>").join("");
    setGauge(pct);
    if (S()) S().success();
    M() && M().say(pct >= 75 ? "Lab-grade? Show-off. I like you." : pct >= 50 ? "Pilot-ready. Respectable. The needle didn't even flinch." : pct >= 25 ? "Garage tier. Every great lab started with an extension cord." : "Napkin stage. Honestly the most fun stage. Nothing is broken yet.", { mood: pct >= 50 ? "wow" : "smirk" });
    $("quizEmail").onclick = () => {
      const cfg = window.BSS_CONFIG || {};
      const body = ["Hi Big Sky Systems,", "", "I ran your Lab Readiness Diagnostic and scored " + pct + "/100 (" + tier.name + ").", "Suggested track: " + tier.track, "", "My answers:", ...QUESTIONS.map((Q, n) => (n + 1) + ". " + Q.q + "\n   -> " + Q.a[picks[n]][0]), "", "I'd like to talk about a plan.", ""].join("\n");
      window.location.href = "mailto:" + (cfg.email || "build@bigsky.systems") + "?subject=" + encodeURIComponent("Lab readiness: " + tier.name + " (" + pct + "/100)") + "&body=" + encodeURIComponent(body);
      window.BSS_TOAST && window.BSS_TOAST("Opening your mail app…");
    };
  }

  $("quizRetry").addEventListener("click", () => { i = 0; score = 0; picks = []; setGauge(0); render(); if (S()) S().click(); });
  document.addEventListener("keydown", (e) => {
    if (result.hidden === false || !/^[1-4]$/.test(e.key)) return;
    const r = document.getElementById("quiz").getBoundingClientRect();
    if (r.top > window.innerHeight || r.bottom < 0) return;
    if (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    const b = opts.querySelectorAll(".opt")[+e.key - 1]; if (b) b.click();
  });

  setGauge(0); render();
})();
