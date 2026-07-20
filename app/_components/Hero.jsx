"use client";

import { motion } from "framer-motion";
import { ArrowRight, Flame, Users, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const features = [
  { icon: Zap, value: "Daily Question", label: "A fresh challenge every day" },
  { icon: Users, value: "1v1 Duels", label: "Battle another aspirant live" },
  {
    icon: Flame,
    value: "Streaks & XP",
    label: "Build consistency, get scored",
  },
  { icon: Trophy, value: "Free to Join", label: "No credit card required" },
];

export default function Hero() {
  return (
    <section className="bg-background pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="outline"
            className="mb-6 sm:mb-8 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium gap-2 border-border bg-card h-auto"
          >
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            India's Most Gamified JEE Platform
          </Badge>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Crack JEE with
          <span className="block mt-1 sm:mt-2">
            <span className="bg-primary text-primary-foreground rounded-2xl px-4 py-1 inline-block">
              Daily Practice
            </span>{" "}
            &amp; XP
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 sm:mt-8 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
        >
          Practice every day, maintain streaks, earn XP and climb the national
          leaderboard with AI-powered performance insights.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <Link href={"/problems"}>
            <Button
              size="lg"
              className="rounded-full px-8 gap-2 h-12 text-base w-full sm:w-auto cursor-pointer"
            >
              Start Practicing
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 h-12 text-base w-full sm:w-auto"
          >
            Explore Features
          </Button>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 sm:mt-20 w-full"
        >
          <Card className="w-full border-border shadow-sm">
            <CardContent className="p-0">
              <div className="grid grid-cols-2 sm:grid-cols-4">
                {features.map(({ icon: Icon, label, value }, i) => (
                  <div
                    key={value}
                    className="flex flex-col items-center justify-center py-6 px-4 relative"
                  >
                    {/* Vertical separator between cols */}
                    {i !== 0 && (
                      <div className="absolute left-0 top-1/4 h-1/2 w-px bg-border" />
                    )}
                    {/* Horizontal separator between rows on mobile */}
                    {i >= 2 && (
                      <div className="absolute top-0 left-1/4 w-1/2 h-px bg-border sm:hidden" />
                    )}
                    <Icon className="h-5 w-5 text-muted-foreground mb-2" />
                    <span className="text-base sm:text-lg font-bold text-foreground">
                      {value}
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground text-center">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Early-access framing instead of fake social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-6 text-xs text-muted-foreground"
        >
          🚀 Just launched —{" "}
          <span className="font-semibold text-foreground">
            be one of the first
          </span>{" "}
          to claim a spot on the leaderboard.
        </motion.p>
      </div>
    </section>
  );
}
