import { Button } from "@/components/ui/button";
import React from "react";

const STATUS_OPTIONS = [
  { value: "unsolved", label: "Unsolved" },
  { value: "incorrect", label: "Incorrect" },
  { value: "solved", label: "Solved" },
];

export default function StatusFilter({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {STATUS_OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          variant={active === opt.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(active === opt.value ? null : opt.value)}
          className="rounded-full px-4 sm:px-5"
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
