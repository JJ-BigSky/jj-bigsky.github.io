/* Shared kit for the V1 calculators. House rules, enforced here so every
   instrument behaves the same: ranges instead of point estimates, a SKY-1
   verdict that is willing to be discouraging, an "email me this" that composes
   a mailto, state kept in the URL so a result is shareable, and nothing
   stored, sent, or logged. */
(function () {
  const cfg = () => window.BSS_CONFIG || {};

  // 1234 -> "1,234"; 12345 -> "12k"; 1.5e6 -> "1.5M". `digits` forces decimals for small numbers.
  function fmt(n, digits) {
    if (n == null || !isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs >= 1e6) return (Math.round(n / 1e5) / 10).toLocaleString("en-US") + "M";
    if (abs >= 1e4) return Math.round(n / 1000).toLocaleString("en-US") + "k";
    if (abs >= 100 || digits === 0) return Math.round(n).toLocaleString("en-US");
    const d = digits == null ? (abs >= 10 ? 0 : 1) : digits;
    return (+n.toFixed(d)).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  // Whole dollars in -> "$4,200" / "$38k" / "$1.2M".
  function money(usd) {
    if (usd == null || !isFinite(usd)) return "—";
    const abs = Math.abs(usd);
    if (abs >= 1e6) return "$" + (Math.round(usd / 1e5) / 10) + "M";
    if (abs >= 1e4) return "$" + Math.round(usd / 1000) + "k";
    return "$" + Math.round(usd).toLocaleString("en-US");
  }
  // Money and time are always bands. band(lo, hi, f) or bandPct(n, .3, f) for ±30%.
  function band(lo, hi, f) { f = f || fmt; return f(lo) + " – " + f(hi); }
  function bandPct(n, pct, f) { return band(n * (1 - pct), n * (1 + pct), f); }

  // <input type="range" data-out="id"> + a paired readout. Returns a getter. `show` formats the readout.
  function bindRange(input, onChange, show) {
    const out = input.dataset.out ? document.getElementById(input.dataset.out) : input.closest("label") && input.closest("label").querySelector("output");
    const paint = () => { if (out) out.textContent = show ? show(+input.value) : input.value; };
    input.addEventListener("input", () => { paint(); onChange && onChange(+input.value); });
    paint();
    return () => +input.value;
  }

  // rules: [[upperBound, text], ..., [Infinity, text]] in ascending order.
  function verdict(rules, value) {
    for (const [max, text] of rules) if (value < max) return text;
    return rules[rules.length - 1][1];
  }

  // Compose the export email. `lines` is an array of strings; null/undefined entries are skipped.
  function mailto(subject, lines, greeting) {
    const body = [greeting || "Hi Big Sky Systems,", "", ...lines.filter((l) => l != null), "", "Can we talk about it?", ""].join("\n");
    window.location.href = "mailto:" + (cfg().email || "build@bigsky.systems") + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    window.BSS_TOAST && window.BSS_TOAST("Opening your mail app…");
    if (window.BSS_SOUND) window.BSS_SOUND.success();
  }

  function debounce(fn, ms) { let t; return function () { clearTimeout(t); const a = arguments; t = setTimeout(() => fn.apply(null, a), ms || 150); }; }

  // URL state: readState() -> {k: "v"}; writeState({k: v}) replaces the query string without a reload.
  function readState() { const o = {}; new URLSearchParams(window.location.search).forEach((v, k) => { o[k] = v; }); return o; }
  function writeState(obj) {
    const p = new URLSearchParams();
    Object.keys(obj).forEach((k) => { if (obj[k] !== "" && obj[k] != null && obj[k] !== false) p.set(k, String(obj[k])); });
    const q = p.toString();
    try { history.replaceState(null, "", window.location.pathname + (q ? "?" + q : "") + window.location.hash); } catch (e) {}
  }

  window.BSS_CALC = { fmt, money, band, bandPct, bindRange, verdict, mailto, debounce, readState, writeState };
})();
