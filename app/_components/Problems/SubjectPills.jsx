import { Button } from "@/components/ui/button";
import React from "react";

export default function SubjectPills({ subjects, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {subjects.map((item) => (
        <Button
          key={item}
          variant={active === item ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(item)}
          className="rounded-full px-4 sm:px-5"
        >
          {item}
        </Button>
      ))}
    </div>
  );
}
