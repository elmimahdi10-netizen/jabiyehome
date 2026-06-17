"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, ArrowRight, Play, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TRUST_POINTS = [
  "Professional installation included",
  "30-day money-back guarantee",
  "24/7 monitoring available",
];

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-navy-600 dark:bg-navy-900"
      aria-label="Hero section"
    >
      {/* Animated background grid */}
      <div
        className="absolute inset-0 bg-hero-grid bg-grid opacity-40"
        aria-hidden="true"
      />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-radial from-cyan-500/8 via-transparent to-transparent"
        aria-hidden="true"
      />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
        aria-hidden="true"
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"
        aria-hidden="true"
      />

      <motion.div style={{ y, opacity }} className="relative container z-10">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="cyan" className="mb-6 px-4 py-1.5 text-sm font-medium border-cyan-500/30 bg-cyan-500/10">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Trusted by 150,000+ homeowners
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight text-balance"
          >
            Your home,{" "}
            <span className="gradient-text">always protected</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-white/60 leading-relaxed max-w-xl"
          >
            Enterprise-grade security systems designed for modern homes.
            Smart cameras, intelligent alarms, and seamless home automation — all in one ecosystem.
          </motion.p>

          {/* Trust points */}
          <motion.ul
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-5"
          >
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm text-white/70">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                {point}
              </li>
            ))}
          </motion.ul>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-3"
          >
            <Button variant="glow" size="xl" asChild>
              <Link href="/category/kits">
                Shop security kits
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/40"
              asChild
            >
              <Link href="#how-it-works">
                <Play className="h-4 w-4" />
                See how it works
              </Link>
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex items-center gap-4"
          >
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {["bg-cyan-500", "bg-blue-500", "bg-purple-500", "bg-green-500"].map(
                (color, i) => (
                  <div
                    key={i}
                    className={`h-9 w-9 rounded-full ${color} border-2 border-navy-600 flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                )
              )}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm font-semibold text-white ml-1">4.9</span>
              </div>
              <p className="text-xs text-white/50">from 12,400+ verified reviews</p>
            </div>
          </motion.div>
        </div>

        {/* Hero visual — abstract security shield */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block"
          aria-hidden="true"
        >
          <div className="relative w-[480px] h-[480px]">
            {/* Outer ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-cyan-500/15"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 rounded-full border border-cyan-500/10"
            />
            {/* Center shield */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl scale-150" />
                <div className="relative h-48 w-48 rounded-full bg-navy-700/80 border border-cyan-500/30 flex items-center justify-center glass">
                  <Shield className="h-24 w-24 text-cyan-400" strokeWidth={1} />
                </div>
              </div>
            </div>

            {/* Floating stat cards */}
            {[
              { label: "Response time", value: "< 30s", x: "-left-8", y: "top-16" },
              { label: "Uptime", value: "99.9%", x: "-right-4", y: "top-24" },
              { label: "Cameras online", value: "12", x: "-left-4", y: "bottom-20" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
                className={`absolute ${stat.x} ${stat.y} glass-dark rounded-xl px-4 py-3 min-w-[120px]`}
              >
                <p className="text-xs text-white/50">{stat.label}</p>
                <p className="text-xl font-bold text-cyan-400">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
