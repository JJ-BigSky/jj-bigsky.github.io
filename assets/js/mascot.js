/* SKY-1: the resident robot. Eyes follow the cursor, it blinks, it talks. */
(function () {
  const mascot = document.getElementById("mascot");
  const btn = document.getElementById("mascotBtn");
  const head = document.getElementById("botHead");
  const pupils = [document.getElementById("pupilL"), document.getElementById("pupilR")];
  const eyes = [document.getElementById("eyeL"), document.getElementById("eyeR")];
  const mouth = document.getElementById("botMouth");
  const bubble = document.getElementById("bubble");
  const bubbleText = document.getElementById("bubbleText");
  if (!mascot || !btn) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const S = () => window.BSS_SOUND;

  const MOUTHS = {
    happy: "M50 69 Q60 75 70 69",
    flat: "M50 70 L70 70",
    o: "M55 66 H65 V74 H55 Z",
    wow: "M52 65 H68 V76 H52 Z",
    smirk: "M50 70 Q60 74 70 67"
  };

  // ---- eye tracking ----
  let mx = window.innerWidth / 2, my = 0, lookOverride = null;
  window.addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  let lastPx = 0, lastPy = 0;
  function track() {
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height * .38;
    const tx = lookOverride ? lookOverride.x : mx, ty = lookOverride ? lookOverride.y : my;
    const dx = tx - cx, dy = ty - cy, d = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, d / 260);
    let px = dx / d * 3.4 * k, py = dy / d * 3.4 * k;
    lastPx += (px - lastPx) * .25; lastPy += (py - lastPy) * .25;
    const tf = "translate(" + lastPx.toFixed(2) + "px," + lastPy.toFixed(2) + "px)";
    pupils[0].style.transform = tf; pupils[1].style.transform = tf;
    head.style.transform = "rotate(" + (dx / window.innerWidth * 9).toFixed(2) + "deg) translate(" + (lastPx * .5).toFixed(2) + "px," + (lastPy * .35).toFixed(2) + "px)";
    requestAnimationFrame(track);
  }
  if (!reduce) requestAnimationFrame(track);

  // ---- blinking ----
  function blink(times) {
    eyes.forEach((e) => { e.classList.remove("is-blink"); void e.offsetWidth; e.classList.add("is-blink"); });
    if (times > 1) setTimeout(() => blink(times - 1), 260);
  }
  (function scheduleBlink() {
    setTimeout(() => { if (!reduce) blink(Math.random() < .2 ? 2 : 1); scheduleBlink(); }, 2200 + Math.random() * 4200);
  })();

  // ---- mood ----
  let moodTimer = null;
  function mood(name, ms) {
    mouth.setAttribute("d", MOUTHS[name] || MOUTHS.happy);
    clearTimeout(moodTimer);
    if (ms) moodTimer = setTimeout(() => mouth.setAttribute("d", MOUTHS.happy), ms);
  }

  // ---- speech queue ----
  const queue = [];
  let speaking = false, hideTimer = null, typeTimer = null;
  function say(text, opts) {
    opts = opts || {};
    if (opts.priority) { queue.unshift({ text, opts }); } else { queue.push({ text, opts }); }
    if (queue.length > 4) queue.length = 4;
    if (!speaking) next();
  }
  function next() {
    const item = queue.shift();
    if (!item) { speaking = false; return; }
    speaking = true;
    const { text, opts } = item;
    clearTimeout(hideTimer); clearInterval(typeTimer);
    bubble.classList.add("is-on");
    mascot.classList.add("is-talking");
    if (opts.mood) mood(opts.mood);
    const hold = opts.ms || Math.min(9000, 2200 + text.length * 45);
    if (reduce) {
      bubbleText.textContent = text;
      mascot.classList.remove("is-talking");
      hideTimer = setTimeout(done, hold);
      return;
    }
    let i = 0; bubbleText.textContent = "";
    if (S()) S().speak(3);
    typeTimer = setInterval(() => {
      i++; bubbleText.textContent = text.slice(0, i);
      if (i % 9 === 0 && S()) S().speak(1);
      if (i >= text.length) {
        clearInterval(typeTimer);
        mascot.classList.remove("is-talking");
        hideTimer = setTimeout(done, hold);
      }
    }, 22);
    function done() {
      bubble.classList.remove("is-on");
      mood("happy");
      setTimeout(next, 350);
    }
  }
  function hush() { queue.length = 0; clearTimeout(hideTimer); clearInterval(typeTimer); bubble.classList.remove("is-on"); mascot.classList.remove("is-talking"); speaking = false; }

  function excite() {
    mascot.classList.remove("is-excited"); void mascot.offsetWidth; mascot.classList.add("is-excited");
    mood("wow", 900);
    if (!reduce) blink(2);
  }

  // ---- section commentary (once each per visit) ----
  const LINES = {
    loop: "Five stations and no end. I live in the DECIDE one, mostly.",
    services: "Six services. I helped write the safety one. I'm biased, but I'm also a robot.",
    playground: "Ooh, the arm. Be gentle. It's my cousin.",
    builder: "Build something. I'll be honest but kind. Mostly honest.",
    method: "Watch the little box go down the belt. That's your lab. Metaphorically.",
    diagnostic: "Seven questions. No wrong answers. A few sad ones.",
    contact: "That email goes to a real human. Say hi from me."
  };
  const said = new Set();
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && en.intersectionRatio >= .35 && !said.has(en.target.id) && LINES[en.target.id]) {
          said.add(en.target.id); say(LINES[en.target.id]);
        }
      });
    }, { threshold: [.35] });
    Object.keys(LINES).forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  // ---- idle chatter ----
  const IDLE = [
    "I counted the stars again. Same number. Suspicious.",
    "Fun fact: I run entirely in your browser. No cloud. Just JavaScript and ambition.",
    "You can flip the sheet with the toggle up top. I prefer graphite. Less glare on my screen.",
    "Try typing the Konami code. Or press Dance mode. I won't tell anyone.",
    "Robots don't dream. But if I did, it would be about well-labeled cables.",
    "The arm over there has real inverse kinematics. I have real opinions. We're a team.",
    "If you hover the hero stars, they constellate. It's not useful. It's lovely."
  ];
  let idleIdx = Math.floor(Math.random() * IDLE.length);
  (function idle() {
    setTimeout(() => {
      if (!speaking && document.visibilityState === "visible" && !document.getElementById("chat").hidden === false) {
        say(IDLE[idleIdx++ % IDLE.length]);
      }
      idle();
    }, 42000 + Math.random() * 30000);
  })();

  // hover interest: SKY-1 looks at what you're about to click
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest && e.target.closest("[data-cursor], .btn, .pal, .tile, .opt");
    if (t && !reduce) { const r = t.getBoundingClientRect(); lookOverride = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; setTimeout(() => { lookOverride = null; }, 700); }
  }, { passive: true });

  btn.addEventListener("click", () => { excite(); if (S()) S().click(); });

  window.BSS_MASCOT = { say, hush, mood, excite, blink, lookAt(x, y, ms) { lookOverride = { x, y }; setTimeout(() => { lookOverride = null; }, ms || 800); } };
})();
