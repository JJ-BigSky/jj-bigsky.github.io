/* Robot data math: fleet x sensors x hours into terabytes a month, what storing
   it costs by tier, and the date it becomes a problem. Illustrative bitrates and
   list-price-shaped bands; the URL carries the state; nothing is sent. */
(function () {
  const root = document.getElementById("dataCalc");
  if (!root) return;
  const $ = (id) => document.getElementById(id);
  const K = window.BSS_CALC, S = () => window.BSS_SOUND, M = () => window.BSS_MASCOT;
  const PX = { 720: 1280 * 720, 1080: 1920 * 1080, 2160: 3840 * 2160 };
  const BPP = { raw: 24, lossless: 10, h265: .08 }; // bits per pixel per frame, illustrative
  const TIER = { hot: 23, warm: 12.5, cold: 4 };   // $ per TB-month, list-price-shaped
  const EGRESS = [50, 90];                          // $ per TB, once
  const LOGS_MBPS = .133;                           // proprioception + logs, ~60 MB per robot-hour
  const DEF = () => ({ robots: 6, cams: 4, hours: 16, days: 22, hot: 10, warm: 30, limit: 100, res: 1080, fps: 30, codec: "h265", ret: 12, depth: false });
  const state = DEF();
  const q = K.readState();
  ["robots", "cams", "hours", "days", "hot", "warm", "limit", "res", "fps", "ret"].forEach((k) => { if (q[k] != null && !Number.isNaN(+q[k])) state[k] = +q[k]; });
  if (BPP[q.codec]) state.codec = q.codec;
  if (q.depth === "1") state.depth = true;
  if (!PX[state.res]) state.res = 1080; if (![10, 30, 60].includes(state.fps)) state.fps = 30; if (![1, 3, 12, 36].includes(state.ret)) state.ret = 12;

  function compute() {
    const hot = Math.min(100, state.hot), warm = Math.min(100 - hot, state.warm), cold = 100 - hot - warm;
    const camMbps = PX[state.res] * BPP[state.codec] * state.fps / 1e6;
    const robotMbps = state.cams * camMbps * (state.depth ? 1.4 : 1) + LOGS_MBPS;
    const gbPerRobotHour = robotMbps * 3600 / 8 / 1000;
    const tbDay = gbPerRobotHour * state.robots * state.hours / 1000;
    const tbMonth = tbDay * state.days;
    const stored = tbMonth * state.ret;
    const perTb = (hot * TIER.hot + warm * TIER.warm + cold * TIER.cold) / 100;
    const storage = stored * perTb;
    const egress = [stored * EGRESS[0], stored * EGRESS[1]];
    const months = tbMonth > 0 ? state.limit / tbMonth : Infinity;
    const problem = stored < state.limit ? null : months; // never crosses the line at this retention
    return { hot, warm, cold, gbPerRobotHour, tbDay, tbMonth, stored, storage, egress, problem };
  }
  function verdict(R) {
    const t = R.tbMonth;
    if (t < 1) return "Comfortable. Keep everything, keep it raw, and enjoy this while it lasts.";
    if (t < 20) return "Normal for a real pilot. Tier it now, while it's a design decision and not an incident.";
    if (t < 100) return "That's a platform, not a folder. Somebody needs to own this, and it shouldn't be the person who owns the robots.";
    return "At this rate the interesting question isn't storage cost, it's whether you can find anything. Curation beats capacity.";
  }
  function when(months) {
    if (months === null) return "not at this retention";
    if (!isFinite(months)) return "never";
    const d = new Date(); d.setMonth(d.getMonth() + Math.max(0, Math.round(months)));
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" }) + (months < 1 ? " (this month)" : "");
  }
  let said = false;
  function update() {
    const R = compute();
    $("cO1").textContent = K.fmt(R.gbPerRobotHour, R.gbPerRobotHour < 10 ? 1 : 0) + " GB";
    $("cO2").textContent = R.tbDay < 1 ? K.fmt(R.tbDay * 1000, 0) + " GB" : K.fmt(R.tbDay, 1) + " TB";
    $("cO3").textContent = R.tbMonth < 1 ? K.fmt(R.tbMonth * 1000, 0) + " GB" : K.fmt(R.tbMonth, R.tbMonth < 10 ? 1 : 0) + " TB";
    $("cO4").textContent = R.stored < 1 ? K.fmt(R.stored * 1000, 0) + " GB" : K.fmt(R.stored, R.stored < 10 ? 1 : 0) + " TB";
    $("cO5").textContent = K.bandPct(R.storage, .3, K.money);
    $("cO6").textContent = K.band(R.egress[0], R.egress[1], K.money);
    $("cO7").textContent = when(R.problem);
    $("cVerdict").textContent = verdict(R);
    $("cReadout").textContent = state.robots + " robots · " + state.cams + " cameras each · " + state.res + "p " + state.fps + " fps " + state.codec.toUpperCase() + (state.depth ? " + depth" : "") + " · " + K.fmt(R.tbMonth, 1) + " TB a month · " + K.fmt(R.stored, 0) + " TB stored at " + state.ret + " months · tiers " + R.hot + "/" + R.warm + "/" + R.cold;
    $("cHotOut").textContent = R.hot + "%"; $("cWarmOut").textContent = R.warm + "%";
    if (R.tbMonth > 100 && !said) { said = true; M() && M().say("A hundred terabytes a month. The interesting question is whether you can find anything.", { mood: "flat" }); }
    K.writeState({ robots: state.robots, cams: state.cams, hours: state.hours, days: state.days, hot: state.hot, warm: state.warm, limit: state.limit, res: state.res, fps: state.fps, codec: state.codec, ret: state.ret, depth: state.depth ? 1 : "" });
    update.last = R;
  }

  const ranges = { cRobots: "robots", cCams: "cams", cHours: "hours", cDays: "days", cHot: "hot", cWarm: "warm" };
  Object.keys(ranges).forEach((id) => { const el = $(id), k = ranges[id]; el.value = state[k]; K.bindRange(el, (v) => { state[k] = v; update(); }, (k === "hot" || k === "warm") ? (v) => v + "%" : null); });
  const limit = $("cLimit"); limit.value = state.limit;
  limit.addEventListener("input", () => { state.limit = Math.max(1, +limit.value || 1); update(); });
  function seg(id, key, cast) {
    const box = $(id);
    box.querySelectorAll(".seg__btn").forEach((b) => {
      b.classList.toggle("is-active", cast(b.dataset.v) === state[key]);
      b.addEventListener("click", () => { state[key] = cast(b.dataset.v); box.querySelectorAll(".seg__btn").forEach((x) => x.classList.toggle("is-active", x === b)); if (S()) S().click(); update(); });
    });
  }
  seg("cRes", "res", Number); seg("cFps", "fps", Number); seg("cCodec", "codec", String); seg("cRet", "ret", Number);
  const depth = $("cDepth"); depth.checked = state.depth;
  depth.addEventListener("change", () => { state.depth = depth.checked; if (S()) S().tick(); update(); });
  $("cReset").addEventListener("click", () => {
    Object.assign(state, DEF());
    Object.keys(ranges).forEach((id) => { $(id).value = state[ranges[id]]; $(id).dispatchEvent(new Event("input")); });
    limit.value = state.limit; depth.checked = false;
    [["cRes", "res"], ["cFps", "fps"], ["cCodec", "codec"], ["cRet", "ret"]].forEach(([id, k]) => $(id).querySelectorAll(".seg__btn").forEach((x) => x.classList.toggle("is-active", String(x.dataset.v) === String(state[k]))));
    update(); if (S()) S().remove();
  });
  $("cEmail").addEventListener("click", () => {
    const R = update.last || compute();
    K.mailto("Robot data math — " + K.fmt(R.tbMonth, 1) + " TB a month", [
      "I ran the robot data math on your site. Here's the sum:", "",
      "- Robots: " + state.robots + ", cameras per robot: " + state.cams, "- " + state.res + "p at " + state.fps + " fps, " + state.codec.toUpperCase() + (state.depth ? ", plus depth streams" : ""),
      "- " + state.hours + " hours a day, " + state.days + " days a month", "- Retention: " + state.ret + " months, tiers hot/warm/cold " + R.hot + "/" + R.warm + "/" + R.cold, "",
      "Per robot-hour: " + K.fmt(R.gbPerRobotHour, 1) + " GB", "Per month: " + K.fmt(R.tbMonth, 1) + " TB", "Stored at retention: " + K.fmt(R.stored, 0) + " TB",
      "Storage per month: " + K.bandPct(R.storage, .3, K.money), "Egress if moved once: " + K.band(R.egress[0], R.egress[1], K.money), "A problem (" + state.limit + " TB) by: " + when(R.problem),
      "SKY-1 said: " + verdict(R), "", "Link: " + window.location.href, "", "What we're actually recording: [describe it]"
    ]);
  });
  update();
  window.BSS_DATA = { state, compute, reset: () => $("cReset").click() };
})();
