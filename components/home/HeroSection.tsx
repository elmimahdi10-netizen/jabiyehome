"use client";
import Image from "next/image";
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
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-white"
      aria-label="Hero section"
    >
      
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
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900"
          >
            Your home,{" "}
            <span className="text-primary">always protected</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl"
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
              <li key={point} className="flex items-center gap-2 text-sm text-slate-700"> 
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
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
            <Button className="bg-primary hover:bg-primary-hover text-white">
              <Link href="/category/kits">
                Shop security kits
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-slate-300 text-slate-800 hover:bg-white/10 hover:text-white hover:border-white/40"
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
              {[
"bg-slate-700",
"bg-slate-600",
"bg-slate-500",
"bg-primary"
].map(
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
                <span className="text-sm font-semibold text-slate-900 ml-1">4.9</span>
              </div>
              <p className="text-xs text-slate-500">from 12,400+ verified reviews</p>
            </div>
          </motion.div>
        </div>
           </motion.div>
      {/* Hero Image */}
<div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 w-[45%]">
  <Image
  src="/hero-home.png"
  alt="Smart Home Security"
  width={900}
  height={700}
  priority
  className="rounded-3xl shadow-2xl"
/>
</div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
