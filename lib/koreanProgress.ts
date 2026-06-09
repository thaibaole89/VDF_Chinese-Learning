// Korean course local progress (client only). Phase 2C.1.4.
// Korean is local-only for now (server sync is a later phase, same path English
// took before 2C.2). localStorage keys are namespaced to the Korean course.

const KO_LEARNED_KEY = "vdf_ko_learned";
const KO_VOICE_KEY = "vdf_ko_voice";

function readSet(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
function writeSet(key: string, ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids))));
  } catch {
    /* ignore */
  }
}

export function getKoLearned(): string[] {
  return readSet(KO_LEARNED_KEY);
}
export function toggleKoLearned(id: string): string[] {
  const cur = readSet(KO_LEARNED_KEY);
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  writeSet(KO_LEARNED_KEY, next);
  return next;
}
export function getKoVoicePassed(): string[] {
  return readSet(KO_VOICE_KEY);
}
export function markKoVoicePassed(id: string): string[] {
  const cur = readSet(KO_VOICE_KEY);
  if (cur.includes(id)) return cur;
  const next = [...cur, id];
  writeSet(KO_VOICE_KEY, next);
  return next;
}

/** Overwrite the local mirror to match server-truth state (Phase 2D). */
export function writeKoLearned(ids: string[]): void {
  writeSet(KO_LEARNED_KEY, ids);
}
export function writeKoVoicePassed(ids: string[]): void {
  writeSet(KO_VOICE_KEY, ids);
}
