"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Target, Flame, Brain, BookOpen, Star } from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const dashboard = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
    },
  },
};

export default function HomeDashboard() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="mt-24 w-full max-w-7xl"
    >
      <div className="grid items-center gap-8 xl:grid-cols-[240px_1fr_240px]">
        {/* LEFT */}
        <div className="hidden xl:flex flex-col gap-6">
          <motion.div
            variants={card}
            whileHover={{ y: -8, scale: 1.03 }}
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Brain className="mb-3 text-violet-600" />
            </motion.div>

            <h3 className="text-lg font-semibold">Today's Challenge</h3>

            <p className="mt-2 text-sm text-neutral-500">
              Solve 15 Physics questions to earn 300 XP.
            </p>
          </motion.div>

          <motion.div
            variants={card}
            whileHover={{ y: -8, scale: 1.03 }}
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3.4 }}
            >
              <Target className="mb-3 text-green-600" />
            </motion.div>

            <p className="text-sm text-neutral-500">Accuracy</p>

            <h2 className="mt-2 text-4xl font-bold">92%</h2>

            <span className="text-green-600 text-sm">+8% This Week</span>
          </motion.div>
        </div>
        {/* MAIN DASHBOARD */}
        <motion.div
          variants={dashboard}
          whileHover={{
            y: -4,
            scale: 1.01,
          }}
          className="rounded-[40px] bg-black p-8 text-white shadow-[0_35px_80px_rgba(0,0,0,.28)]"
        >
          <div className="mb-10 flex justify-between">
            <div>
              <p className="text-neutral-400">Current Rank</p>

              <h2 className="mt-2 text-6xl font-bold">#142</h2>
            </div>

            <motion.div
              animate={{
                rotate: [0, 8, -8, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
              }}
              className="rounded-3xl bg-neutral-900 p-5"
            >
              <Trophy size={46} className="text-yellow-400" />
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <motion.div
              whileHover={{ y: -6, scale: 1.05 }}
              className="rounded-2xl bg-neutral-900 p-5"
            >
              <BookOpen className="mb-3" />

              <p className="text-sm text-neutral-400">Questions</p>

              <h3 className="mt-2 text-3xl font-bold">1,248</h3>
            </motion.div>

            <motion.div
              whileHover={{ y: -6, scale: 1.05 }}
              className="rounded-2xl bg-neutral-900 p-5"
            >
              <Flame className="mb-3 text-orange-400" />

              <p className="text-sm text-neutral-400">Streak</p>

              <h3 className="mt-2 text-3xl font-bold">34</h3>
            </motion.div>

            <motion.div
              whileHover={{ y: -6, scale: 1.05 }}
              className="rounded-2xl bg-neutral-900 p-5"
            >
              <Star className="mb-3 text-yellow-400" />

              <p className="text-sm text-neutral-400">XP</p>

              <h3 className="mt-2 text-3xl font-bold">18.2K</h3>
            </motion.div>
          </div>
        </motion.div>{" "}
        {/* RIGHT */}
        <div className="hidden xl:flex flex-col gap-6">
          <motion.div
            variants={card}
            whileHover={{
              y: -8,
              scale: 1.03,
            }}
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3.2,
              }}
            >
              <Trophy className="mb-3 text-yellow-500" />
            </motion.div>

            <h3 className="text-lg font-semibold">National Leaderboard</h3>

            <p className="mt-2 text-sm text-neutral-500">You're ahead of</p>

            <h2 className="mt-2 text-4xl font-bold">94%</h2>

            <span className="text-sm text-green-600">Keep going 🚀</span>
          </motion.div>

          <motion.div
            variants={card}
            whileHover={{
              y: -8,
              scale: 1.03,
            }}
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.8,
              }}
            >
              <Flame className="mb-3 text-red-500" />
            </motion.div>

            <p className="text-sm text-neutral-500">Daily Streak</p>

            <h2 className="mt-2 text-4xl font-bold">🔥 34</h2>

            <span className="text-sm text-orange-500">Don't miss today!</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
