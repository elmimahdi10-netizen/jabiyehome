"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Shield, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="py-24 bg-background"
      aria-labelledby="cta-heading"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-[#0a1628] overflow-hidden px-8 py-16 sm:px-16 text-center"
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-cyan-500/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-cyan-400" strokeWidth={1.5} />
            </div>

            <h2
              id="cta-heading"
              className="font-display text-3xl sm:text-5xl font-bold text-white mb-4 text-balance"
            >
              Ready to protect your home?
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join 150,000+ homeowners who trust Jabiyehome. Free professional
              installation on orders over $299. 30-day returns. No contracts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="glow" size="xl" asChild>
                <Link href="/category/kits">
                  Shop security kits <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/40"
                asChild
              >
                <Link href="/contact">
                  <Phone className="h-4 w-4" /> Talk to an expert
                </Link>
              </Button>
            </div>

            {/* Small trust line */}
            <p className="text-white/30 text-xs mt-8">
              No contracts · Cancel anytime · Free 30-day returns · 2-year warranty included
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
