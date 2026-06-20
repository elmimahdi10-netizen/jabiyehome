"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Wifi,
  Smartphone,
  Lock,
  Thermometer,
  Lightbulb,
  Cpu,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    Icon: Lock,
    title: "Smart Locks",
    description: "Fingerprint, PIN, RFID and remote app access. Auto-lock with tamper detection.",
  },
  {
    Icon: Thermometer,
    title: "Smart Thermostats",
    description: "Learning schedules that cut energy bills by up to 23%. Remote control from anywhere.",
  },
  {
    Icon: Lightbulb,
    title: "Smart Lighting",
    description: "Automated scenes, motion-triggered lighting, and integration with your alarm system.",
  },
  {
    Icon: Cpu,
    title: "Smart Hubs",
    description: "Central control for every connected device. Works with Matter, Zigbee, and Z-Wave.",
  },
];

const AUTOMATIONS = [
  "Away mode arms the alarm, locks the door, and sets thermostat to eco",
  "Motion at 2 am triggers all outdoor lights and sends you an alert",
  "Front door unlocks automatically when you arrive home",
  "Bedtime scene dims lights, sets temperature, and activates cameras",
];

export default function SmartHomeShowcase() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="py-24 bg-background overflow-hidden"
      aria-labelledby="smart-home-heading"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: content */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">Smart Home</span>
            </div>

            <h2
              id="smart-home-heading"
              className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6 leading-tight"
            >
              Your home works for you,
              <br />
              <span className="text-green-500">automatically</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Connect every device in your home into a single intelligent system.
              Set automations once and let your home respond to your life —
              not the other way around.
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="flex gap-3"
                >
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <feature.Icon className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button variant="default" size="lg" asChild>
              <Link href="/category/smart-home">
                Explore Smart Home <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Right: automations panel */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            {/* Phone mockup with app UI */}
            <div className="relative mx-auto w-72 sm:w-80">
              {/* Glow */}
              <div className="absolute inset-0 bg-slate-500/10 blur-3xl rounded-full scale-75" />

              {/* App window */}
              <div className="relative bg-[#111827] rounded-3xl border border-white/10 p-5 shadow-2xl">
                {/* Header bar */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-white/40">Good evening</p>
                    <p className="text-sm font-semibold text-white">Home Dashboard</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-green-500" />
                  </div>
                </div>

                {/* Status tiles */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {[
                    { label: "Front door", status: "Locked", color: "text-green-400", bg: "bg-green-500/10" },
                    { label: "Alarm", status: "Armed", color: "text-green-500", bg: "bg-green-500/10" },
                    { label: "Thermostat", status: "21 °C", color: "text-amber-400", bg: "bg-amber-500/10" },
                    { label: "Lights", status: "3 on", color: "text-green-500", bg: "bg-green-500/10" },
                  ].map((tile) => (
                    <div key={tile.label} className={`${tile.bg} rounded-xl p-3`}>
                      <p className="text-[10px] text-white/50 mb-1">{tile.label}</p>
                      <p className={`text-sm font-bold ${tile.color}`}>{tile.status}</p>
                    </div>
                  ))}
                </div>

                {/* Automation list */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                    Active automations
                  </p>
                  {AUTOMATIONS.map((automation, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-start gap-2 p-2 rounded-lg bg-white/5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-white/60 leading-snug">{automation}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
