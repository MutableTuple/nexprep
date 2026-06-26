"use client";

import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import BottomStats from "./BottomStats";
import HomeDashboard from "./HomeDashboard";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const title = {
  hidden: {
    opacity: 0,
    y: 45,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f5f5f5] pt-40 pb-32">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-0 top-20 h-96 w-96 rounded-full bg-neutral-300/40 blur-[170px]"
        />

        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-0 bottom-0 h-[450px] w-[450px] rounded-full bg-neutral-200/50 blur-[180px]"
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex max-w-7xl flex-col items-center overflow-visible px-6"
      >
        {/* Badge */}
        <motion.div
          variants={item}
          whileHover={{
            y: -3,
            scale: 1.03,
          }}
          className="mb-8 rounded-full border border-neutral-300 bg-white px-5 py-2 shadow-md"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            <motion.span
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="flex"
            >
              <Flame className="h-4 w-4 text-orange-500" />
            </motion.span>

            <span>India's Most Gamified JEE Preparation Platform</span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={title}
          className="max-w-5xl text-center text-5xl font-bold leading-tight tracking-tight text-neutral-900 md:text-7xl"
        >
          Crack{" "}
          <motion.span
            initial={{
              rotate: -6,
              scale: 0.8,
            }}
            animate={{
              rotate: 0,
              scale: 1,
            }}
            transition={{
              delay: 0.5,
              duration: 0.6,
            }}
            className="inline-block rounded-2xl bg-black px-5 py-1 text-white"
          >
            JEE
          </motion.span>{" "}
          with
          <br />
          <motion.span
            initial={{
              scale: 0.85,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              delay: 0.8,
              duration: 0.5,
            }}
            className="inline-block rounded-2xl bg-neutral-200 px-5 py-1"
          >
            Daily Challenges
          </motion.span>{" "}
          &
          <br />
          Smart Competition
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={item}
          className="mt-8 max-w-2xl text-center text-lg leading-8 text-neutral-600"
        >
          Practice every day, maintain streaks, earn XP, complete missions,
          challenge friends and climb the national leaderboard with AI-powered
          performance insights.
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={item}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          <motion.button
            whileHover={{
              y: -4,
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.96,
            }}
            className="flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-white shadow-xl"
          >
            Start Practicing
            <ArrowRight size={18} />
          </motion.button>

          <motion.button
            whileHover={{
              y: -4,
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="rounded-full border border-neutral-300 bg-white px-8 py-4"
          >
            Explore Features
          </motion.button>
        </motion.div>

        {/* Dashboard */}
        <motion.div variants={item} className="w-full flex justify-center">
          <HomeDashboard />
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="w-full flex justify-center">
          <BottomStats />
        </motion.div>
      </motion.div>
    </section>
  );
}
