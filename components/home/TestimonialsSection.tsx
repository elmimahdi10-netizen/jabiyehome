"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Homeowner, California",
    rating: 5,
    text: "The installation was seamless and the app is incredibly intuitive. I can check on my home from anywhere in the world. The AI detection means I only get alerts when something actually matters — no more false alarms.",
    product: "Premium Security Kit",
    initials: "SM",
    color: "bg-green-500",
  },
  {
    id: 2,
    name: "James R.",
    role: "Property Manager, Texas",
    rating: 5,
    text: "Managing 12 rental properties is so much easier with Jabiyehome. The dashboard gives me live views of every property in one place. Customer support resolved my query in under 10 minutes.",
    product: "Business Security Kit",
    initials: "JR",
    color: "bg-green-500",
  },
  {
    id: 3,
    name: "Elena K.",
    role: "Family of four, New York",
    rating: 5,
    text: "We bought the Family Security Kit after our neighbor was burgled. The smart locks are amazing — I can let the kids in after school without giving them keys. The motion sensors are perfectly calibrated and ignore our dog.",
    product: "Family Security Kit",
    initials: "EK",
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "Marcus T.",
    role: "Small business owner, Florida",
    rating: 5,
    text: "Had the system installed at my restaurant two months ago. The 4K cameras have already helped us resolve two theft incidents with crystal-clear footage. Worth every penny.",
    product: "4K Outdoor Camera System",
    initials: "MT",
    color: "bg-green-500",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);

  return (
    <section
      ref={ref}
      className="py-24 bg-[#111827]  overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-green-500 uppercase tracking-wider mb-3">
            Customer stories
          </p>
          <h2
            id="testimonials-heading"
            className="font-display text-3xl sm:text-4xl font-bold text-white"
          >
            Trusted by thousands of families
          </h2>
        </motion.div>

        {/* Testimonial carousel */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Quote icon */}
              <Quote
                className="absolute -top-2 -left-2 h-10 w-10 text-green-500/30"
                strokeWidth={1}
              />

              <div className="glass-dark rounded-2xl p-8 sm:p-10">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(TESTIMONIALS[current].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Text */}
                <blockquote className="text-white/80 text-lg leading-relaxed font-light italic mb-8">
                  "{TESTIMONIALS[current].text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-full ${TESTIMONIALS[current].color} flex items-center justify-center text-sm font-bold text-white shrink-0`}
                  >
                    {TESTIMONIALS[current].initials}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{TESTIMONIALS[current].name}</p>
                    <p className="text-sm text-white/50">{TESTIMONIALS[current].role}</p>
                  </div>
                  <div className="ml-auto text-right hidden sm:block">
                    <p className="text-xs text-white/40 mb-0.5">Purchased</p>
                    <p className="text-sm text-green-500 font-medium">
                      {TESTIMONIALS[current].product}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-green-500" : "w-1.5 bg-white/30"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
