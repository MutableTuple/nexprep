import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "default", label: "Shuffled" },
  { value: "popular", label: "Most Solved" },
];

// Styled with the brand amber rather than the plain Select used elsewhere
// (Settings, Signup, subject pages) — scoped to this trigger/items only so
// those other pages keep their neutral look.
export default function SortControl({ value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        size="sm"
        className="gap-2 border-amber-400/40 hover:border-amber-400/70 focus-visible:ring-amber-400/30 data-[state=open]:border-amber-400"
      >
        <ArrowUpDown size={14} className="text-amber-500" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="focus:bg-amber-400/10 data-[state=checked]:font-semibold data-[state=checked]:text-amber-600 dark:data-[state=checked]:text-amber-400"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
