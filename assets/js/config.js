/* Big Sky Systems — site configuration. Edit freely. */
window.BSS_CONFIG = {
  company: "Big Sky Systems",
  email: "jj@bigsky.systems",
  // Time zone shown in the hero telemetry strip as "LAB TIME".
  labTimeZone: "America/New_York",
  // Show the 1.5s boot sequence on first visit per browser session.
  boot: true,
  // Vision-system cursor reticle on desktop (fine pointers only).
  reticle: true,
  // Optional: point SKY-1 at your own AI backend. Leave empty to use the
  // built-in scripted brain (runs entirely in the browser, no network).
  // Contract: POST JSON {message, history:[{role, content}]} -> JSON {reply}
  assistantEndpoint: ""
};
