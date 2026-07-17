import React from "react";
import FilterChip from "./FilterChip";
import { Button } from "@/components/ui/button";

const STATUS_LABELS = {
  unsolved: "Unsolved",
  incorrect: "Incorrect",
  solved: "Solved",
};

export default function ActiveFilters({
  activeSubject,
  activeDiffs,
  activeStatus,
  query,
  onRemoveSubject,
  onRemoveDiff,
  onRemoveStatus,
  onRemoveQuery,
  onClearAll,
}) {
  const hasFilters =
    activeSubject !== "All" ||
    activeDiffs.length > 0 ||
    !!activeStatus ||
    query !== "";
  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">Active filters:</span>
      {activeSubject !== "All" && (
        <FilterChip label={activeSubject} onRemove={onRemoveSubject} />
      )}
      {activeDiffs.map((d) => (
        <FilterChip key={d} label={d} onRemove={() => onRemoveDiff(d)} />
      ))}
      {activeStatus && (
        <FilterChip
          label={STATUS_LABELS[activeStatus]}
          onRemove={onRemoveStatus}
        />
      )}
      {query && <FilterChip label={`"${query}"`} onRemove={onRemoveQuery} />}
      <Button
        variant="link"
        size="sm"
        onClick={onClearAll}
        className="text-xs text-muted-foreground h-auto p-0 underline-offset-2"
      >
        Clear all
      </Button>
    </div>
  );
}
