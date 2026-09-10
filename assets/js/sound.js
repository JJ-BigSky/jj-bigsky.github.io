/* Tiny WebAudio sound kit. Off by default; toggled in the nav. */
(function () {
  const KEY = "bss.sound";
  let ctx = null;
  let enabled = false;
  try { enabled = localStorage.getItem(KEY) === "1"; } catch (e) {}

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, gain, when, slideTo) {
    if (!enabled) return;
    const c = ensure(); if (!c) return;
    const t = c.currentTime + (when || 0);
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain || 0.08, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }

  const S = {
    get enabled() { return enabled; },
    set enabled(v) {
      enabled = !!v;
      try { localStorage.setItem(KEY, enabled ? "1" : "0"); } catch (e) {}
      if (enabled) { ensure(); S.success(); }
    },
    click() { tone(880, 0.05, "sine", 0.05); },
    tick() { tone(1400, 0.02, "square", 0.015); },
    place() { tone(520, 0.08, "triangle", 0.07, 0, 780); },
    remove() { tone(420, 0.1, "triangle", 0.06, 0, 200); },
    success() { tone(660, 0.09, "sine", 0.06); tone(990, 0.12, "sine", 0.06, 0.09); },
    error() { tone(220, 0.16, "sawtooth", 0.05, 0, 160); },
    grab() { tone(300, 0.06, "square", 0.04, 0, 420); },
    // R2-style chatter while SKY-1 "talks"
    speak(n) {
      n = n || 4;
      for (let i = 0; i < n; i++) {
        const f = 600 + Math.random() * 900;
        tone(f, 0.05, i % 2 ? "square" : "triangle", 0.03, i * 0.06, f * (Math.random() > .5 ? 1.5 : .7));
      }
    },
    dance() {
      const notes = [523, 659, 784, 1046, 784, 659, 523, 392];
      notes.forEach((f, i) => tone(f, 0.12, "square", 0.05, i * 0.11));
    }
  };
  window.BSS_SOUND = S;
})();
