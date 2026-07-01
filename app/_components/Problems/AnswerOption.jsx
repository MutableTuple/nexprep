import { CheckCircle2, XCircle } from "lucide-react";
import React from "react";

export default function AnswerOption({
  opt,
  index,
  selected,
  submitted,
  correctIndex,
  onSelect,
}) {
  const isSelected = selected === index;
  const isRight = submitted && index === correctIndex;
  const isWrong = submitted && isSelected && index !== correctIndex;

  let containerClass = "border bg-card text-card-foreground";
  let labelClass = "bg-muted text-muted-foreground";

  if (!submitted && isSelected) {
    containerClass = "border-primary bg-primary text-primary-foreground";
    labelClass = "bg-background text-foreground";
  }
  if (isRight) {
    containerClass =
      "border-green-400 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300";
    labelClass = "bg-green-500 text-white";
  }
  if (isWrong) {
    containerClass =
      "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300";
    labelClass = "bg-red-500 text-white";
  }

  return (
    <button
      onClick={() => !submitted && onSelect(index)}
      disabled={submitted}
      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left transition-all duration-150 border ${containerClass} ${submitted ? "cursor-default" : "cursor-pointer"}`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${labelClass}`}
      >
        {opt.label}
      </div>
      <span className="text-sm font-medium flex-1">{opt.text}</span>
      {isRight && (
        <CheckCircle2 size={18} className="text-green-500 shrink-0" />
      )}
      {isWrong && <XCircle size={18} className="text-red-500 shrink-0" />}
    </button>
  );
}
