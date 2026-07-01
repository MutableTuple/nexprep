import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Spinner } from "../Spinner";

export default function SearchBar({ query, onChange, loading }) {
  return (
    <div className="flex items-center h-12 sm:h-14 rounded-2xl border border-border bg-card px-4 sm:px-5 gap-3 focus-within:ring-2 focus-within:ring-ring transition-shadow w-full">
      <Search size={18} className="text-muted-foreground shrink-0" />

      <Input
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search questions…"
        className="flex-1 h-full border-0 bg-transparent shadow-none focus-visible:ring-0 text-base sm:text-sm placeholder:text-muted-foreground px-0 py-0"
      />

      <div className="flex items-center gap-1.5 shrink-0">
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X size={16} />
          </Button>
        )}
        {loading && <Spinner size={18} className="text-muted-foreground" />}
      </div>
    </div>
  );
}
