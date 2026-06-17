"use client";
import Clock from "@/components/ui/Clock";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Camera, Eye, Zap, Cloud, Moon, ArrowRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SPECS = [
  { label: "Resolution", value: "4K Ultra HD", highlight: true },
  { label: "Night vision", value: "Colour to 30m" },
  { label: "Detection", value: "AI: Person / Vehicle / Animal", highlight: true },
  { label: "Storage", value: "128 GB SD + cloud" },
  { label: "Weather", value: "IP67 rated" },
  { label: "Audio", value: "Two-way noise-cancel" },
];

const DETECTION_EVENTS = [
  { time: "02:14", event: "Person detected — front door", severity: "high" },
  { time: "08:32", event: "Vehicle in driveway", severity: "low" },
  { time: "14:07", event: "Package delivered", severity: "low" },
  { time: "22:41", event: "Motion — backyard", severity: "medium" },
];

export default function CamerasShowcase() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="py-24 bg-muted/30 overflow-hidden"
      aria-labelledby="cameras-heading"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: camera UI mockup */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative mx-auto max-w-sm">
              <div className="absolute inset-0 bg-cyan-500/15 blur-3xl rounded-full" />

              {/* Camera feed card */}
              <div className="relative bg-[#0a1628] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                {/* Camera feed placeholder */}
                <div className="relative aspect-video bg-[#050c18] flex items-center justify-center">
                  {/* Simulated camera feed grid overlay */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)",
                      backgroundSize: "30px 30px",
                    }}
                  />
                  <Camera className="h-16 w-16 text-white/10" strokeWidth={1} />

                  {/* Live badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500/90 px-2.5 py-1 rounded-full">
                    <Radio className="h-3 w-3 text-white" />
                    <span className="text-[10px] font-bold text-white tracking-wider">LIVE</span>
                  </div>

                  {/* AI detection overlay box */}
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-8 left-12 w-16 h-20 border-2 border-cyan-400 rounded"
                  >
                    <span className="absolute -top-4 left-0 text-[9px] font-bold text-cyan-400 bg-[#0a1628] px-1">
                      PERSON
                    </span>
                  </motion.div>

                  {/* Timestamp */}
<div className="absolute bottom-2 right-3 text-[10px] text-white/50 font-mono">
  <Clock />
</div>
                </div>

                {/* Event log */}
                <div className="p-4">
                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-3">
                    Detection log
                  </p>
                  <div className="space-y-2">
                    {DETECTION_EVENTS.map((evt, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.3 + i * 0.12 }}
                        className="flex items-center gap-3"
                      >
                        <span className="text-[10px] text-white/40 font-mono w-10 shrink-0">
                          {evt.time}
                        </span>
                        <div
                          className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                            evt.severity === "high"
                              ? "bg-red-400"
                              : evt.severity === "medium"
                              ? "bg-amber-400"
                              : "bg-green-400"
                          }`}
                        />
                        <span className="text-[11px] text-white/60">{evt.event}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: content */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
              <Camera className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">Security Cameras</span>
              <Badge variant="cyan" className="text-[10px] px-1.5 py-0">4K AI</Badge>
            </div>

            <h2
              id="cameras-heading"
              className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6 leading-tight"
            >
              See everything.
              <br />
              <span className="text-cyan-500">Miss nothing.</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Our AI-powered 4K cameras don't just record — they understand. Person,
              vehicle, and animal detection means you only get alerted when it matters,
              with crystal-clear footage day or night.
            </p>

            {/* Spec table */}
            <div className="rounded-xl border border-border overflow-hidden mb-8">
              {SPECS.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`flex items-center justify-between px-4 py-3 text-sm ${
                    i % 2 === 0 ? "bg-muted/30" : "bg-background"
                  }`}
                >
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span
                    className={`font-medium ${
                      spec.highlight ? "text-cyan-500" : "text-foreground"
                    }`}
                  >
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Icon features */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { Icon: Eye, label: "Colour night vision" },
                { Icon: Zap, label: "Instant alerts" },
                { Icon: Cloud, label: "Cloud + local storage" },
                { Icon: Moon, label: "24/7 recording" },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm text-foreground/70 bg-muted/50 px-3 py-1.5 rounded-full border border-border/60"
                >
                  <Icon className="h-3.5 w-3.5 text-cyan-500" />
                  {label}
                </div>
              ))}
            </div>

            <Button variant="glow" size="lg" asChild>
              <Link href="/category/cameras">
                Shop cameras <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
