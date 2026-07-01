"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const stats = [
  { end: 250, suffix: "K+", label: "Questions Solved" },
  { end: 18, suffix: "K+", label: "Active Students" },
  { end: 96, suffix: "%", label: "Average Accuracy" },
  { end: 1.2, suffix: "M", decimals: 1, label: "XP Earned Today" },
];

export default function BottomStats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <Card
      ref={ref}
      className="mt-16 sm:mt-20 lg:mt-28 w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 rounded-[28px] sm:rounded-[36px] border-border bg-card p-4 sm:p-6 lg:p-8 shadow-xl"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.15, duration: 0.6 }}
          whileHover={{ y: -8, scale: 1.03 }}
          className="cursor-pointer rounded-2xl p-3 sm:p-4 text-center transition-colors hover:bg-accent"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tabular-nums">
            {inView && (
              <CountUp
                end={stat.end}
                duration={2}
                decimals={stat.decimals ?? 0}
              />
            )}
            {stat.suffix}
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </Card>
  );
}
