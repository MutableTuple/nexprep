// Detects newly-unlocked badges since the last check, so the UI can
// celebrate them — the actual unlock decision always happens server-side
// (see the award_stat_badges/award_duel_badges Postgres triggers); this
// just diffs against what we last saw, entirely client-side via
// localStorage, to avoid needing a "seen" column in the DB.
import { listUserBadges } from "./data-service";

const STORAGE_PREFIX = "rankgrind:known-badges";

function loadKnownSlugs(userId) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:${userId}`);
    return raw ? JSON.parse(raw) : null; // null = never checked before
  } catch {
    return null;
  }
}

function saveKnownSlugs(userId, slugs) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}:${userId}`, JSON.stringify(slugs));
  } catch {
    // non-critical — worst case a badge gets re-announced once
  }
}

// Returns the badge_slug[] newly unlocked since the last check for this
// user. The very first check ever for a user just baselines silently
// (otherwise every existing badge would get announced as "new" the moment
// this feature ships).
export async function checkForNewBadges(userId) {
  if (!userId) return [];

  const badges = await listUserBadges(userId);
  const currentSlugs = badges.map((b) => b.badge_slug);

  const previous = loadKnownSlugs(userId);
  saveKnownSlugs(userId, currentSlugs);

  if (previous === null) return [];

  const previousSet = new Set(previous);
  return currentSlugs.filter((slug) => !previousSet.has(slug));
}
