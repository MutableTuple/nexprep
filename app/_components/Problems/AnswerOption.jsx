import { CheckCircle2, XCircle } from "lucide-react";
import React from "react";
import MarkdownRenderer from "../MarkdownRenderer";

export default function AnswerOption({
  opt,
  index,
  selected, // array of selected indices — one or many
  submitted,
  correctIndices, // array of correct indices — one for single-answer, several for multi
  onSelect,
}) {
  const isSelected = selected.includes(index);
  const isActuallyCorrect = correctIndices.includes(index);
  const isRight = submitted && isActuallyCorrect;
  const isWrong = submitted && isSelected && !isActuallyCorrect;

  // Default unselected option — bg-secondary + text-foreground stays
  // legible in both themes; bg-card was resolving to a near-white
  // shade in some dark-mode configs, killing contrast.
  let containerClass = "border-border bg-secondary text-foreground";
  let labelClass = "bg-background text-foreground";

  if (!submitted && isSelected) {
    // bg-foreground / text-background is the inverse of the page's
    // own tokens — always high-contrast in both light and dark mode,
    // regardless of whatever the theme sets `primary` to. The
    // previous bg-primary + text-primary-foreground combo produced
    // white-on-white in dark mode because both tokens resolved to
    // near-white shades in this app's theme.
    containerClass = "border-foreground bg-foreground text-background";
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
      {/* Universal descendant override — `[&_*]:!text-inherit`
          forces EVERY child element (prose p/strong/code, KaTeX math
          spans, everything) to inherit the button's own color. This
          is heavier-handed than variant-specific overrides but it's
          the only approach that beats both prose-invert AND KaTeX's
          own inline color styles. */}
      <div className="text-sm font-medium flex-1 text-current [&_*]:!text-inherit">
        <MarkdownRenderer className="prose-p:my-0 prose-p:leading-normal prose-p:font-medium">
          {opt.text}
        </MarkdownRenderer>
      </div>
      {isRight && (
        <CheckCircle2 size={18} className="text-green-500 shrink-0" />
      )}
      {isWrong && <XCircle size={18} className="text-red-500 shrink-0" />}
    </button>
  );
}
