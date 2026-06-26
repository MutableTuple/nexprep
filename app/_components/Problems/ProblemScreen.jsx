import React from "react";
import { Search, Filter, Flame, Trophy, Target } from "lucide-react";
import QuestionCard from "./QuestionCard";

export default function ProblemScreen() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}

      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-8 py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                Practice
              </p>

              <h1 className="mt-3 text-5xl font-bold tracking-tight text-neutral-900">
                Problems
              </h1>

              <p className="mt-3 max-w-xl text-neutral-500">
                Master JEE by solving curated questions from every chapter.
                Build streaks, earn XP and improve your rank.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <StatCard
                icon={<Flame size={20} />}
                label="Current Streak"
                value="18 Days"
              />

              <StatCard
                icon={<Target size={20} />}
                label="Solved"
                value="1,248"
              />

              <StatCard icon={<Trophy size={20} />} label="XP" value="18,420" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-8">
        {/* Search */}

        <div className="mb-8 flex flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 items-center rounded-2xl border border-neutral-200 bg-white px-4">
            <Search size={18} className="text-neutral-400" />

            <input
              placeholder="Search questions..."
              className="h-14 w-full bg-transparent px-3 text-sm outline-none placeholder:text-neutral-400"
            />
          </div>

          <button className="flex h-14 items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 font-medium transition hover:border-neutral-300">
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Subject Pills */}

        <div className="mb-8 flex flex-wrap gap-3">
          {[
            "All",
            "Physics",
            "Chemistry",
            "Mathematics",
            "Easy",
            "Medium",
            "Hard",
          ].map((item, index) => (
            <button
              key={item}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                index === 0
                  ? "bg-black text-white"
                  : "border border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Questions */}

        <div className="space-y-5">
          <QuestionCard
            title="Electrostatic Potential due to Ring"
            difficulty="Hard"
            subject="Physics"
            chapter="Electrostatics"
            xp={220}
            time="8 min"
            questions={456}
          />

          <QuestionCard
            title="Binomial Expansion"
            difficulty="Easy"
            subject="Mathematics"
            chapter="Binomial Theorem"
            xp={90}
            time="3 min"
            questions={1294}
            solved
          />

          <QuestionCard
            title="Chemical Equilibrium"
            difficulty="Medium"
            subject="Chemistry"
            chapter="Equilibrium"
            xp={150}
            time="5 min"
            questions={892}
            bookmarked
          />

          <QuestionCard
            title="Rotation of Rigid Body"
            difficulty="Hard"
            subject="Physics"
            chapter="Rotational Motion"
            xp={240}
            time="10 min"
            questions={337}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="text-neutral-500">{icon}</div>

      <h3 className="mt-4 text-2xl font-bold">{value}</h3>

      <p className="mt-1 text-xs text-neutral-400">{label}</p>
    </div>
  );
}
