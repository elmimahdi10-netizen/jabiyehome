"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Shield,
  Bell,
  Wifi,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ALARM_STEPS = [
  {
    step: "01",
    title: "Sensor triggered",
    description: "PIR, door, window, or glass-break sensor detects an intrusion.",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  {
    step: "02",
    title: "Entry delay",
    description: "30-second delay lets authorised users disarm before the siren sounds.",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    step: "03",
    title: "Siren + notification",
    description: "105 dB siren activates. Instant push notification and SMS to your phone.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    step: "04",
    title: "Professional response",
    description: "24/7 monitoring centre contacts you then dispatches authorities if needed.",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
];

const ALARM_TYPES = [
  "Wireless — no drilling, no cables",
  "GSM backup — works without internet",
  "Battery backup — stays live in a power cut",
  "Pet-friendly sensors — ignores pets under 25 kg",
  "Grade 2 certified — insurance approved",
];

export default function AlarmsShowcase() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="py-24 bg-[#111827] dark:bg-[#030810] overflow-hidden"
      aria-labelledby="alarms-heading"
    >
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6">
            <Bell className="h-4 w-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">Security Alarms</span>
          </div>
          <h2
            id="alarms-heading"
            className="font-display text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Professional protection,
            <span className="text-red-400"> without the contract</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Our wireless alarm systems install in under an hour, work without internet,
            and qualify for home insurance discounts. Self-monitor or upgrade to
            24/7 professional monitoring at any time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: response flow */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-6">
              How your alarm responds
            </p>
            {ALARM_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex gap-4"
              >
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full ${step.bgColor} flex items-center justify-center shrink-0`}
                  >
                    <span className={`text-xs font-bold ${step.color}`}>{step.step}</span>
                  </div>
                  {i < ALARM_STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-white/10 mt-2 mb-2 min-h-[24px]" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-4">
                  <p className={`text-sm font-semibold ${step.color} mb-1`}>{step.title}</p>
                  <p className="text-sm text-white/60 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: features + alert mockup */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Alert notification mockup */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-4">
                Live alert example
              </p>

              {/* Phone notification */}
              <div className="bg-[#050c18] rounded-xl p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">Jabiyehome Alert</span>
                      <span className="text-[10px] text-white/30">just now</span>
                    </div>
                    <p className="text-xs text-white/70 mt-1">
                      ⚠ Motion detected — Front door sensor
                    </p>
                    <p className="text-[10px] text-white/40 mt-0.5">123 Oak Street • Entry delay: 28s</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 text-xs font-semibold">
                    Disarm
                  </button>
                  <button className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold">
                    Call police
                  </button>
                </div>
              </div>

              {/* Monitoring status */}
              <div className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <div>
                  <p className="text-xs font-semibold text-green-400">24/7 Monitoring active</p>
                  <p className="text-[10px] text-white/40">Response centre alerted • ETA 4 min</p>
                </div>
              </div>
            </div>

            {/* Feature list */}
            <ul className="space-y-3">
              {ALARM_TYPES.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 text-sm text-white/70"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  {feature}
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button
                asChild
                size="lg"
                className="bg-red-500 hover:bg-red-400 text-white"
              >
                <Link href="/category/alarms">
                  <Shield className="h-4 w-4" /> Shop alarm systems
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/services/monitoring">
                  <Phone className="h-4 w-4" /> Professional monitoring
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
