let synthesis = null;

function getSynthesis() {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  return window.speechSynthesis;
}

export function speak(text, options = {}) {
  const syn = getSynthesis();
  if (!syn || !text?.trim()) return;
  syn.cancel();
  const u = new SpeechSynthesisUtterance(String(text).trim());
  u.rate = options.rate ?? 0.95;
  u.pitch = options.pitch ?? 1;
  u.volume = options.volume ?? 1;
  if (options.lang) u.lang = options.lang;
  syn.speak(u);
}

export function cancelSpeech() {
  const syn = getSynthesis();
  if (syn) syn.cancel();
}

export function isSpeechSupported() {
  return !!getSynthesis();
}
