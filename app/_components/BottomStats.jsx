"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const stats = [
  {
    end: 250,
    suffix: "K+",
    label: "Questions Solved",
  },
  {
    end: 18,
    suffix: "K+",
    label: "Active Students",
  },
  {
    end: 96,
    suffix: "%",
    label: "Average Accuracy",
  },
  {
    end: 1.2,
    suffix: "M",
    decimals: 1,
    label: "XP Earned Today",
  },
];

export default function BottomStats() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div
      ref={ref}
      className="mt-28 grid w-full max-w-6xl grid-cols-2 gap-6 rounded-[36px] border border-neutral-200 bg-white p-8 shadow-xl md:grid-cols-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            delay: index * 0.15,
            duration: 0.6,
          }}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          className="cursor-pointer rounded-2xl p-4 text-center transition-colors hover:bg-neutral-50"
        >
          <h2 className="text-4xl font-bold text-neutral-900">
            {inView && (
              <CountUp
                end={stat.end}
                duration={2}
                decimals={stat.decimals || 0}
              />
            )}
            {stat.suffix}
          </h2>

          <p className="mt-2 text-neutral-500">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
