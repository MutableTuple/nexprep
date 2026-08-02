// Tracks whether we've already celebrated a daily/weekly goal so the
// confetti + toast fire at most once per period, not every time the user
// revisits a page after already hitting the goal. Client-only (localStorage)
// — deliberately not persisted server-side, since missing a celebration on
// a fresh device is a much smaller cost than re-spamming it every visit.

// v2: bumped to invalidate any flags written by earlier, buggier attempts
// (a since-fixed bug could mark a period "celebrated" without the confetti
// having actually fired, permanently suppressing retries for that period).
const STORAGE_PREFIX = "rankgrind:goal-celebrated:v2";

function pad(n) {
  return String(n).padStart(2, "0");
}

function dateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Matches the Sunday-start week boundary used by getStudyProgress().
function periodKey(type) {
  const now = new Date();
  if (type === "daily") return dateKey(now);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  return dateKey(start);
}

export function hasCelebratedGoal(userId, type) {
  if (typeof window === "undefined") return true;
  try {
    return (
      localStorage.getItem(`${STORAGE_PREFIX}:${userId}:${type}:${periodKey(type)}`) === "1"
    );
  } catch {
    return true; // localStorage unavailable — don't crash, just skip celebrating
  }
}

export function markGoalCelebrated(userId, type) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}:${userId}:${type}:${periodKey(type)}`, "1");
  } catch {
    // non-critical — worst case it celebrates again next visit
  }
}
