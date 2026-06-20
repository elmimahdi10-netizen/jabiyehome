"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Shield, Zap, HeadphonesIcon, RefreshCw, Award, Globe } from "lucide-react";

const TRUST_ITEMS = [
  {
    Icon: Shield,
    title: "Military-grade encryption",
    description: "All communications use AES-256 encryption, the same standard used by financial institutions.",
  },
  {
    Icon: Zap,
    title: "Instant alerts",
    description: "Real-time push notifications and SMS alerts delivered in under 30 seconds.",
  },
  {
    Icon: HeadphonesIcon,
    title: "24/7 expert support",
    description: "Our security specialists are available around the clock via phone, chat, or email.",
  },
  {
    Icon: RefreshCw,
    title: "30-day free returns",
    description: "Not satisfied? Return any product within 30 days for a full refund, no questions asked.",
  },
  {
    Icon: Award,
    title: "ISO 27001 certified",
    description: "Independently audited and certified to the highest international security management standard.",
  },
  {
    Icon: Globe,
    title: "Ships worldwide",
    description: "Fast, tracked delivery to over 80 countries. Free shipping on orders over $299.",
  },
];

const STATS = [
  { value: "150K+", label: "Happy customers" },
  { value: "99.9%", label: "System uptime" },
  { value: "< 30s", label: "Alert response" },
  { value: "4.9★", label: "Average rating" },
];

export default function TrustSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-20" />

        {/* Trust features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-green-500 uppercase tracking-wider mb-3">
            Why Jabiyehome
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Built on trust, backed by technology
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex gap-4 p-5 rounded-2xl border border-border/60 bg-card hover:border-green-500/30 transition-colors duration-200"
            >
              <div className="h-10 w-10 shrink-0 rounded-xl bg-green-500/10 flex items-center justify-center">
                <item.Icon className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
