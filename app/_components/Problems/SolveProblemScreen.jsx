"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Flame,
  Zap,
  Bookmark,
  BookmarkCheck,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Award,
  SkipForward,
} from "lucide-react";

const options = [
  { label: "A", text: "V = kQ / √(R² + x²)" },
  { label: "B", text: "V = kQ / (R + x)" },
  { label: "C", text: "V = kQ / x²" },
  { label: "D", text: "V = kQ(R²+x²)" },
];

const CORRECT_INDEX = 0;

const HINTS = [
  "Electric potential is a scalar quantity — you can add contributions from each charge element directly.",
  "Every charge element dq on the ring is at the same distance √(R² + x²) from point P on the axis.",
  "Integrate dV = k·dq / √(R² + x²) over the full ring. Since the distance is constant, it factors out.",
];

const EXPLANATION =
  "Since potential is scalar, V = k∫dq/r where r = √(R² + x²) is constant for all ring elements. This gives V = kQ/√(R² + x²).";

function useTimer(running) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function ZoomableImage({ src, alt }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="relative cursor-zoom-in group"
        onClick={() => setOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          className="block mx-auto max-h-64 sm:max-h-80 max-w-full object-contain transition-opacity group-hover:opacity-85"
        />
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-lg tracking-wide pointer-events-none">
          Click to zoom
        </div>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-6 cursor-zoom-out animate-fadeIn"
        >
          <img
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl animate-scaleIn"
          />
          <button
            onClick={() => setOpen(false)}
            className="fixed top-5 right-5 w-10 h-10 rounded-full bg-white/15 border-none text-white cursor-pointer flex items-center justify-center backdrop-blur-sm"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        .animate-fadeIn { animation: fadeIn 0.15s ease; }
        .animate-scaleIn { animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>
    </>
  );
}

export default function SolveProblemScreen() {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [xpAnimating, setXpAnimating] = useState(false);

  const timerStr = useTimer(!submitted);
  const isCorrect = submitted && selected === CORRECT_INDEX;

  useEffect(() => {
    document.body.style.overflow = mobileSheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSheetOpen]);

  function handleSubmit() {
    if (selected === null) return;
    setSubmitted(true);
    setMobileSheetOpen(false);
    if (selected === CORRECT_INDEX) {
      setXpAnimating(true);
      setTimeout(() => setXpAnimating(false), 1200);
    }
  }

  function revealHint() {
    if (revealedHints < HINTS.length) setRevealedHints((h) => h + 1);
  }

  const answerPanel = (
    <div className="flex flex-col gap-0">
      <div className="px-6 pt-6">
        <h3 className="m-0 text-[17px] font-bold text-gray-900">
          Choose your answer
        </h3>
        <p className="mt-1 text-xs text-gray-400">
          Select one option and submit
        </p>
      </div>

      <div className="px-6 py-5 flex flex-col gap-2.5">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isRight = submitted && i === CORRECT_INDEX;
          const isWrong = submitted && isSelected && i !== CORRECT_INDEX;

          let containerClass = "border-[1.5px] border-gray-200 bg-white";
          let labelClass = "bg-gray-100 text-gray-500";
          let textClass = "text-gray-800";

          if (!submitted && isSelected) {
            containerClass = "border-[1.5px] border-gray-900 bg-gray-900";
            labelClass = "bg-white text-gray-900";
            textClass = "text-white";
          }
          if (isRight) {
            containerClass = "border-[1.5px] border-green-400 bg-green-50";
            labelClass = "bg-green-500 text-white";
            textClass = "text-green-700";
          }
          if (isWrong) {
            containerClass = "border-[1.5px] border-red-400 bg-red-50";
            labelClass = "bg-red-500 text-white";
            textClass = "text-red-700";
          }

          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left transition-all duration-150 relative ${containerClass} ${submitted ? "cursor-default" : "cursor-pointer"}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-150 ${labelClass}`}
              >
                {opt.label}
              </div>
              <span className={`text-sm font-medium flex-1 ${textClass}`}>
                {opt.text}
              </span>
              {isRight && (
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
              )}
              {isWrong && (
                <XCircle size={18} className="text-red-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <div className="px-6 pb-6">
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className={`w-full py-3.5 rounded-2xl font-bold text-[15px] transition-all duration-150 tracking-[0.01em] ${
              selected !== null
                ? "bg-gray-900 text-white cursor-pointer hover:bg-gray-800"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            Submit answer
          </button>
        </div>
      ) : (
        <div
          className={`mx-6 mb-6 p-4 rounded-2xl border ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <CheckCircle2 size={18} className="text-green-500" />
            ) : (
              <XCircle size={18} className="text-red-500" />
            )}
            <span
              className={`font-bold text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}
            >
              {isCorrect ? "Correct! +220 XP" : "Incorrect — see explanation"}
            </span>
          </div>
          <p className="m-0 text-sm text-gray-500 leading-relaxed">
            {EXPLANATION}
          </p>
          <div className="mt-3.5 flex gap-2">
            <button className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white border-none font-semibold text-sm cursor-pointer flex items-center justify-center gap-1.5 hover:bg-gray-800 transition-colors">
              Next <ChevronRight size={15} />
            </button>
            <button className="flex-1 py-2.5 rounded-xl bg-white text-gray-500 border border-gray-200 font-semibold text-sm cursor-pointer flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors">
              <SkipForward size={14} /> Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',system-ui,sans-serif] flex flex-col">
      {/* Mobile backdrop */}
      {mobileSheetOpen && (
        <div
          onClick={() => setMobileSheetOpen(false)}
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-30 bg-white/92 backdrop-blur-[14px] border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3 sm:gap-4">
          {/* Back */}
          <Link
            href="/problems"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 no-underline font-medium hover:text-gray-800 transition-colors shrink-0"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Problems</span>
          </Link>

          <span className="text-gray-300 text-sm hidden sm:inline">/</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
            Electric Potential on Axis
          </span>

          <div className="flex-1" />

          {/* Stats row */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Timer */}
            <div
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold tabular-nums transition-all duration-300 ${submitted ? "bg-gray-100 text-gray-400" : "bg-gray-900 text-white"}`}
            >
              <Clock size={12} />
              <span className="hidden sm:inline">{timerStr}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 text-xs sm:text-sm font-bold">
              <Flame size={12} className="text-orange-500" />
              18
            </div>

            {/* XP */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border transition-all duration-300 ${xpAnimating ? "bg-gray-900 text-white border-transparent scale-105" : "bg-gray-100 text-gray-500 border-transparent"}`}
            >
              <Zap
                size={12}
                className={xpAnimating ? "text-yellow-400" : "text-gray-400"}
              />
              18,420 XP
            </div>

            {/* Subject pill */}
            <span className="hidden md:inline-flex px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-600">
              Physics
            </span>

            {/* Bookmark */}
            <button
              onClick={() => setBookmarked((b) => !b)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-gray-200 flex items-center justify-center cursor-pointer transition-all duration-150 ${bookmarked ? "bg-gray-900 border-gray-900" : "bg-white hover:bg-gray-50"}`}
              aria-label="Bookmark"
            >
              {bookmarked ? (
                <BookmarkCheck size={14} className="text-white" />
              ) : (
                <Bookmark size={14} className="text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-gray-100">
          <div className="h-full w-[41%] bg-gray-900 transition-all duration-500" />
        </div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            Problem 42 of 102 · Electrostatics
          </span>
          <span className="text-[11px] text-gray-400">41% complete</span>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-0 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* ── LEFT: Problem ── */}
        <div className="flex flex-col gap-4 pb-36 lg:pb-12">
          {/* Problem card */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {/* Card header */}
            <div className="px-5 sm:px-7 pt-5 sm:pt-6 pb-5 border-b border-gray-100 flex items-start gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black text-sm sm:text-[15px] shrink-0">
                42
              </div>
              <div>
                <h1 className="m-0 text-base sm:text-lg font-extrabold text-gray-900 leading-snug">
                  Electric Potential on Axis of a Charged Ring
                </h1>
                <p className="mt-1 text-xs text-gray-400">
                  Electrostatics · 8 min · 220 XP
                </p>
              </div>
            </div>

            {/* Problem body */}
            <div className="px-5 sm:px-7 py-5 sm:py-6">
              <p className="m-0 mb-3 text-sm sm:text-[15px] text-gray-700 leading-[1.75]">
                A thin ring of radius <strong>R</strong> carries a total charge{" "}
                <strong>Q</strong> uniformly distributed along its
                circumference. Find the electric potential <strong>V</strong> at
                a point <strong>P</strong> on the axis of the ring, at a
                distance <strong>x</strong> from the center.
              </p>
              <p className="m-0 text-sm sm:text-[15px] text-gray-700 leading-[1.75]">
                Assume the ring lies in the xy-plane with its center at the
                origin, and that <strong>k</strong> is Coulomb's constant.
              </p>
            </div>

            {/* Diagram */}
            <div className="mx-5 sm:mx-7 mb-7 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 py-5">
              <ZoomableImage
                src="https://media.cheggcdn.com/media%2F5ee%2F5eed6ed3-89e6-4a74-97d9-a5599b9ddc9b%2Fimage.png"
                alt="Charged ring diagram"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {[
              "Coulomb's Law",
              "Integration",
              "Symmetry",
              "Potential",
              "Scalar",
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full border border-gray-200 bg-white text-xs text-gray-500 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Hints accordion */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setHintsOpen((o) => !o)}
              className="w-full flex items-center justify-between px-5 py-4 bg-transparent border-none cursor-pointer text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className="text-amber-600" />
                Hints ({revealedHints}/{HINTS.length} revealed)
              </div>
              {hintsOpen ? (
                <ChevronUp size={16} className="text-gray-400" />
              ) : (
                <ChevronDown size={16} className="text-gray-400" />
              )}
            </button>

            {hintsOpen && (
              <div className="px-5 pb-5 flex flex-col gap-2.5">
                {HINTS.slice(0, revealedHints).map((h, i) => (
                  <div
                    key={i}
                    className="px-3.5 py-3 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 leading-relaxed"
                  >
                    <span className="font-bold mr-1.5">Hint {i + 1}:</span>
                    {h}
                  </div>
                ))}

                {revealedHints < HINTS.length && (
                  <button
                    onClick={revealHint}
                    className="py-2.5 rounded-xl border border-dashed border-amber-500 bg-transparent text-amber-600 text-sm font-semibold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-amber-50 transition-colors"
                  >
                    <Lightbulb size={14} />
                    Reveal hint {revealedHints + 1}
                  </button>
                )}
              </div>
            )}
          </div>
          <YouTubeEmbed
            videoId="Uwo6u9GGP1Y" // e.g. "dQw4w9WgXcQ"
            title="Electric potential on ring axis"
          />
        </div>

        {/* ── RIGHT: Answer panel (desktop only) ── */}
        <aside className="hidden lg:block sticky top-[110px] bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {answerPanel}
        </aside>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200 bg-white mt-8 pb-28 lg:pb-0">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all duration-150">
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Problem dots */}
          <div className="flex gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === 2
                    ? "w-6 bg-gray-900"
                    : i < 2
                      ? "w-2 bg-green-500"
                      : "w-2 bg-gray-200"
                }`}
              />
            ))}
          </div>

          <button
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold cursor-pointer transition-all duration-150 ${
              submitted
                ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>

      {/* ── MOBILE FLOATING BUTTON ── */}
      <div className="fixed bottom-5 left-0 right-0 px-5 z-40 lg:hidden">
        <button
          onClick={() => setMobileSheetOpen(true)}
          className="w-full py-4 rounded-2xl bg-gray-900 text-white border-none text-[15px] font-bold cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.25)] flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
        >
          {selected === null ? (
            "Choose answer"
          ) : (
            <>
              <Award size={16} />
              {`Selected ${options[selected].label} — Submit`}
            </>
          )}
        </button>
      </div>

      {/* ── MOBILE BOTTOM SHEET ── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.12)] lg:hidden transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          mobileSheetOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Sheet header */}
        <div className="flex items-center justify-between px-5 pt-3">
          <h2 className="m-0 text-lg font-extrabold text-gray-900">
            Choose answer
          </h2>
          <button
            onClick={() => setMobileSheetOpen(false)}
            className="w-8 h-8 rounded-xl border border-gray-200 bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto py-1">{answerPanel}</div>
      </div>
    </div>
  );
}
function YouTubeEmbed({ videoId, title = "Related video" }) {
  const [loaded, setLoaded] = useState(false);

  if (!videoId) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-sm font-semibold text-gray-900">
          Watch explanation
        </span>
        <span className="ml-auto text-xs text-gray-400">YouTube</span>
      </div>

      {/* Video */}
      <div className="relative w-full aspect-video bg-gray-950">
        {!loaded && (
          <div
            onClick={() => setLoaded(true)}
            className="absolute inset-0 cursor-pointer group"
          >
            {/* Thumbnail */}
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover opacity-80"
            />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:bg-red-500 group-hover:scale-110 transition-all duration-150">
                {/* Triangle play icon */}
                <div className="w-0 h-0 ml-1 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent" />
              </div>
            </div>
          </div>
        )}

        {loaded && (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
