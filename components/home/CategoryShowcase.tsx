"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Shield, Wifi, Package, Radar } from "lucide-react";
import { useInView } from "react-intersection-observer";

const CATEGORIES = [
  {
    label: "Smart Home",
    description: "Locks, thermostats, lighting, and automation",
    href: "/category/smart-home",
    Icon: Wifi,
    color: "from-green-600/20 to-green-600/5",
    iconColor: "text-green-500",
    count: "120+ products",
  },
  {
    label: "Security Cameras",
    description: "Indoor, outdoor, 4K, AI-powered surveillance",
    href: "/category/cameras",
    Icon: Camera,
    color: "from-green-600/20 to-green-600/5",
    iconColor: "text-green-500",
    count: "85+ products",
    featured: true,
  },
  {
    label: "Alarm Systems",
    description: "Wireless, smart, GSM, professional alarms",
    href: "/category/alarms",
    Icon: Shield,
    color: "from-purple-600/20 to-purple-600/5",
    iconColor: "text-purple-400",
    count: "60+ products",
  },
  {
    label: "Security Kits",
    description: "Complete bundles for every home size",
    href: "/category/kits",
    Icon: Package,
    color: "from-green-600/20 to-green-600/5",
    iconColor: "text-green-400",
    count: "15+ bundles",
  },
  {
    label: "Motion Sensors",
    description: "PIR, outdoor, AI-powered, pet-friendly",
    href: "/category/sensors",
    Icon: Radar,
    color: "from-amber-600/20 to-amber-600/5",
    iconColor: "text-amber-400",
    count: "40+ products",
  },
];

export default function CategoryShowcase() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-background" aria-labelledby="categories-heading">
      <div className="container">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-green-500 uppercase tracking-wider mb-3">
            Product categories
          </p>
          <h2
            id="categories-heading"
            className="font-display text-3xl sm:text-4xl font-bold text-foreground text-balance"
          >
            Everything your home needs,
            <br className="hidden sm:block" /> in one place
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={cat.href}
                className={`group relative flex flex-col p-6 rounded-2xl border bg-gradient-to-br ${cat.color} border-border/60 hover:border-green-500/40 transition-all duration-300 hover:shadow-card-hover h-full min-h-[200px]`}
              >
                {cat.featured && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold bg-green-500 text-[#111827] px-2 py-0.5 rounded-full">
                    POPULAR
                  </span>
                )}
                <div
                  className={`h-12 w-12 rounded-xl bg-background/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <cat.Icon className={`h-6 w-6 ${cat.iconColor}`} />
                </div>
                <h3 className="font-semibold text-base text-foreground mb-1">
                  {cat.label}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">{cat.count}</span>
                  <ArrowRight
                    className={`h-4 w-4 text-muted-foreground group-hover:${cat.iconColor} group-hover:translate-x-1 transition-all duration-200`}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
