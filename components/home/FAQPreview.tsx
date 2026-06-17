"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const FAQS = [
  {
    q: "Do I need professional installation?",
    a: "All our wireless systems are designed for DIY installation with step-by-step video guides. Professional installation is available for free on orders over $299, or can be added to any order. Most customers complete installation in under 2 hours.",
  },
  {
    q: "What happens if my internet goes down?",
    a: "Our systems include cellular (GSM) backup. If your internet fails, the system switches to the cellular network automatically. Local storage means footage is still recorded. All our alarm systems also include battery backup for power cuts.",
  },
  {
    q: "Can I monitor my cameras when I'm away?",
    a: "Yes. The Jabiyehome app gives you live video feeds, two-way audio, and instant push notifications from anywhere in the world. You can also share access with family members or a trusted neighbour.",
  },
  {
    q: "Are the products compatible with Alexa, Google Home, and HomeKit?",
    a: "All our smart home products support the Matter standard and are compatible with Amazon Alexa, Google Home, Apple HomeKit, and Samsung SmartThings. Most products also work with IFTTT for advanced automations.",
  },
  {
    q: "What's included in your warranty?",
    a: "Every product comes with a 2-year manufacturer warranty covering hardware defects. Extended 5-year warranties are available at checkout. Our premium subscribers also get next-day hardware replacement if a device fails.",
  },
];

export default function FAQPreview() {
  const [open, setOpen] = useState<number | null>(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-muted/30" aria-labelledby="faq-heading">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold text-cyan-500 uppercase tracking-wider mb-3">
              FAQ
            </p>
            <h2
              id="faq-heading"
              className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6"
            >
              Common questions
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Everything you need to know before you buy. Can't find your answer?
            </p>
            <Button variant="outline" asChild>
              <Link href="/help">
                Visit Help Centre <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Right accordion */}
          <div className="lg:col-span-2 space-y-0 divide-y divide-border rounded-2xl border border-border overflow-hidden bg-background">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: i * 0.07 }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-muted/30 transition-colors"
                  aria-expanded={open === i}
                >
                  <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                      open === i && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
