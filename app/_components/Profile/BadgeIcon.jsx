import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

// Tier only controls rarity "feel" now — glow strength and whether the
// shine sweep plays. Actual color comes from the badge's own `colors`
// (see badges.js) so every badge has its own identity, not just its tier's.
const TIER_GLOW_BLUR = {
  bronze: 0,
  silver: 14,
  gold: 22,
  diamond: 30,
};

const TIER_SHINE = {
  bronze: false,
  silver: false,
  gold: true,
  diamond: true,
};

const DEFAULT_COLORS = ["#78716c", "#a8a29e"]; // fallback stone gray

export default function BadgeIcon({
  icon: Icon,
  tier = "bronze",
  colors,
  size = 48,
  locked = false,
}) {
  const [from, to] = colors ?? DEFAULT_COLORS;
  const blur = TIER_GLOW_BLUR[tier] ?? 0;
  const shine = TIER_SHINE[tier] ?? false;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl ring-2",
        locked ? "bg-muted grayscale ring-border" : "ring-white/40 dark:ring-white/15",
      )}
      style={{
        width: size,
        height: size,
        background: locked
          ? undefined
          : `linear-gradient(135deg, ${from}, ${to})`,
        boxShadow:
          !locked && blur > 0 ? `0 0 ${blur}px -4px ${to}` : undefined,
      }}
    >
      <Icon
        size={Math.round(size * 0.46)}
        strokeWidth={2.25}
        className={cn(
          "relative z-10 drop-shadow-sm",
          locked ? "text-muted-foreground" : "text-white",
        )}
      />
      {!locked && shine && (
        <span className="badge-shine pointer-events-none absolute inset-0" />
      )}
      {locked && (
        <Lock
          size={Math.round(size * 0.32)}
          className="absolute bottom-1 right-1 text-muted-foreground"
        />
      )}
    </div>
  );
}
