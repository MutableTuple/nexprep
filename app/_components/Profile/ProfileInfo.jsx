import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Check,
  CheckCircle2,
  Edit3,
  Loader2,
  MapPin,
  Trophy,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/app/_lib/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EXAM_SUGGESTIONS = [
  "JEE Main",
  "JEE Advanced",
  "BITSAT",
  "VITEEE",
  "COMEDK UGET",
  "MHT CET",
  "KCET",
  "WBJEE",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from(
  { length: 2050 - CURRENT_YEAR + 1 },
  (_, i) => CURRENT_YEAR + i,
);

export default function ProfileInfo({
  editMode,
  draft,
  profile,
  enterEdit,
  saveEdit,
  cancelEdit,
  updateDraft,
  saving,
  usernameStatus,
}) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          {editMode ? (
            <div className="flex flex-col gap-2.5 max-w-md">
              <Input
                value={draft.name}
                onChange={(e) => updateDraft("name", e.target.value)}
                placeholder="Full name"
                className="h-10 text-lg font-bold"
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-muted-foreground shrink-0">
                    @
                  </span>
                  <div className="relative flex-1">
                    <Input
                      value={draft.username.replace(/^@/, "")}
                      onChange={(e) => updateDraft("username", e.target.value)}
                      placeholder="username"
                      className="h-8 text-sm pr-7"
                    />
                    {usernameStatus === "checking" && (
                      <Loader2
                        size={13}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin"
                      />
                    )}
                    {usernameStatus === "available" && (
                      <CheckCircle2
                        size={13}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500"
                      />
                    )}
                    {usernameStatus === "taken" && (
                      <XCircle
                        size={13}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-destructive"
                      />
                    )}
                  </div>
                </div>
                {usernameStatus === "taken" && (
                  <p className="text-[11px] text-destructive pl-1">
                    That username is already taken.
                  </p>
                )}
              </div>
              <Textarea
                value={draft.bio}
                onChange={(e) => updateDraft("bio", e.target.value)}
                placeholder="A short bio"
                rows={2}
                className="text-sm resize-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Trophy size={11} /> Target Exam
                  </label>
                  <Select
                    value={draft.target || ""}
                    onValueChange={(v) => updateDraft("target", v)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXAM_SUGGESTIONS.map((exam) => (
                        <SelectItem key={exam} value={exam} className="text-xs">
                          {exam}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar size={11} /> Exam Year
                  </label>
                  <Select
                    value={draft.examYear ? String(draft.examYear) : ""}
                    onValueChange={(v) => updateDraft("examYear", v)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {YEAR_OPTIONS.map((y) => (
                        <SelectItem
                          key={y}
                          value={String(y)}
                          className="text-xs"
                        >
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <MapPin size={11} /> Location
                  </label>
                  <Input
                    value={draft.location}
                    onChange={(e) => updateDraft("location", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {profile.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {profile.username}
              </p>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                {profile.bio}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge
                  variant="secondary"
                  className="rounded-full text-xs gap-1"
                >
                  <Trophy size={11} /> {profile.target || "Not set"}
                </Badge>
                <Badge variant="outline" className="rounded-full text-xs gap-1">
                  <Calendar size={11} />{" "}
                  {profile.examYear ? `Target ${profile.examYear}` : "Not set"}
                </Badge>
                <Badge variant="outline" className="rounded-full text-xs gap-1">
                  <MapPin size={11} /> {profile.location || "Unknown"}
                </Badge>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {editMode ? (
            <>
              <Button
                size="sm"
                onClick={saveEdit}
                disabled={
                  saving ||
                  usernameStatus === "checking" ||
                  usernameStatus === "taken"
                }
                className="gap-1.5 rounded-xl"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={cancelEdit}
                disabled={saving}
                className="gap-1.5 rounded-xl"
              >
                <X size={14} />
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={enterEdit}
              className="gap-1.5 rounded-xl"
            >
              <Edit3 size={14} />
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
