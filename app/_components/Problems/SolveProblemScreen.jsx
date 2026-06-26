"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export default function SolveProblemScreen() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileSheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSheetOpen]);

  const options = [
    "V = kQ / √(R² + x²)",
    "V = kQ / (R + x)",
    "V = kQ / x²",
    "V = kQ(R²+x²)",
  ];

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* Backdrop */}
      {mobileSheetOpen && (
        <div
          onClick={() => setMobileSheetOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/problems"
            className="flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to Problems
          </Link>

          <span className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium">
            Physics
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[2fr_1fr] lg:px-8">

        {/* Problem Content — Left Column */}
        <div className="space-y-6 pb-28 lg:pb-0">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h1 className="text-xl font-semibold text-neutral-900">
              Electric Potential on Axis of a Charged Ring
            </h1>
            <p className="mt-1 text-sm text-neutral-500">Problem #42 · Electrostatics</p>

            <div className="mt-6 space-y-4 text-neutral-700 leading-relaxed">
              <p>
                A thin ring of radius <strong>R</strong> carries a total charge <strong>Q</strong>{" "}
                uniformly distributed along its circumference. Find the electric potential{" "}
                <strong>V</strong> at a point <strong>P</strong> on the axis of the ring, at a
                distance <strong>x</strong> from the center.
              </p>
              <p>
                Assume the ring lies in the xy-plane with its center at the origin, and that{" "}
                <strong>k</strong> is Coulomb's constant.
              </p>
            </div>

            {/* Diagram placeholder */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
  <img
    src="https://media.cheggcdn.com/media%2F5ee%2F5eed6ed3-89e6-4a74-97d9-a5599b9ddc9b%2Fimage.png"
    alt="Question Diagram"
    className="mx-auto max-h-[500px] w-full object-contain"
  />
</div>
          </div>

          {/* Hints / Tags */}
          <div className="flex flex-wrap gap-2">
            {["Coulomb's Law", "Integration", "Symmetry", "Potential"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Desktop Sidebar — Right Column */}
        <aside className="hidden h-fit lg:sticky lg:top-28 lg:block">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h3 className="text-xl font-semibold">Choose Answer</h3>

            <div className="mt-6 space-y-4">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`group flex w-full items-center gap-5 rounded-2xl border p-5 text-left transition ${
                    selectedAnswer === index
                      ? "border-black bg-neutral-100"
                      : "border-neutral-200 hover:border-black hover:bg-neutral-50"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition ${
                      selectedAnswer === index
                        ? "bg-black text-white"
                        : "bg-neutral-100"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>

            <button
              disabled={selectedAnswer === null}
              className="mt-8 w-full rounded-2xl bg-black py-4 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit Answer
            </button>
          </div>
        </aside>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white pb-28 lg:pb-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          <button className="flex items-center gap-2 rounded-xl border border-neutral-200 px-5 py-3 transition hover:border-black hover:bg-neutral-50">
            <ChevronLeft size={18} />
            Previous
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-neutral-200 px-5 py-3 transition hover:border-black hover:bg-neutral-50">
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </footer>

      {/* Mobile Floating Button */}
      <div className="fixed bottom-5 left-0 right-0 z-40 px-5 lg:hidden">
        <button
          onClick={() => setMobileSheetOpen(true)}
          className="flex w-full items-center justify-center rounded-2xl bg-black py-4 text-lg font-semibold text-white shadow-2xl"
        >
          {selectedAnswer === null
            ? "Choose Answer"
            : `Selected ${String.fromCharCode(65 + selectedAnswer)}`}
        </button>
      </div>

      {/* Mobile Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-[32px] bg-white transition-transform duration-300 lg:hidden ${
          mobileSheetOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-center py-3">
          <div className="h-1.5 w-16 rounded-full bg-neutral-300" />
        </div>

        <div className="flex items-center justify-between px-6">
          <h2 className="text-xl font-bold">Choose Answer</h2>
          <button onClick={() => setMobileSheetOpen(false)}>
            <X />
          </button>
        </div>

        <div className="mt-6 max-h-[65vh] space-y-4 overflow-y-auto px-6 pb-32">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(index)}
              className={`group flex w-full items-center gap-5 rounded-2xl border p-5 text-left transition-all duration-200 ${
                selectedAnswer === index
                  ? "border-black bg-neutral-100"
                  : "border-neutral-200 hover:border-black hover:bg-neutral-50"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition ${
                  selectedAnswer === index ? "bg-black text-white" : "bg-neutral-100"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>
              <span className="font-medium">{option}</span>
            </button>
          ))}

          <button
            disabled={selectedAnswer === null}
            onClick={() => {
              console.log("Submitted", selectedAnswer);
              setMobileSheetOpen(false);
            }}
            className="mt-8 w-full rounded-2xl bg-black py-4 text-lg font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit Answer
          </button>
        </div>
      </div>

    </div>
  );
}