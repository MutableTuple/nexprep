// Recently-seen question tracker — localStorage-backed ring buffer.
// Prevents the "Solve this next" upsell from ping-ponging between the
// same 2 questions of a topic (getSimilarQuestions returns a stable
// ordering, so without deduping we'd suggest A → B → A → B…).
//
// LocalStorage is faster than any DB round-trip AND appropriate here
// — this is "what did I see in the last few minutes" state, which is
// per-device by nature. No sync needed even for logged-in users.

const KEY = "@rankgrind/recently_seen_v1";
const CAPACITY = 30;

function safeParse(raw) {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function readList() {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(window.localStorage.getItem(KEY));
  } catch {
    return [];
  }
}

function writeList(list) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // quota exceeded or storage disabled — silent fail is fine, the
    // upsell just doesn't dedupe until the next attempt.
  }
}

// Push a question id to the head of the ring, dedupe, cap at CAPACITY.
// Newest first — makes exclusion checks trivial.
export function pushRecentlySeen(questionId) {
  if (!questionId) return;
  const list = readList().filter((id) => id !== questionId);
  list.unshift(questionId);
  if (list.length > CAPACITY) list.length = CAPACITY;
  writeList(list);
}

// Set of ids seen recently — cheap membership check for filtering
// upsell candidates. Returns an empty Set on SSR / private-mode /
// disabled storage — safe to iterate against either way.
export function getRecentlySeenSet() {
  return new Set(readList());
}

export function getRecentlySeenList() {
  return readList();
}

export function clearRecentlySeen() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
}
