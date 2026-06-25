"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    // Phase 3: wire to /api/v1/newsletter
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
  };

  return (
    <section ref={ref} className="py-24 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="h-14 w-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-7 w-7 text-green-500" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Stay one step ahead
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Get the latest security tips, product launches, and exclusive subscriber
            discounts delivered to your inbox. No spam, ever. Unsubscribe anytime.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 text-green-600 dark:text-green-400"
            >
              <CheckCircle2 className="h-6 w-6" />
              <span className="font-medium">You're subscribed! Check your inbox for a welcome gift.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 h-12"
                disabled={status === "loading"}
              />
              <Button
                type="submit"
                variant="glow"
                size="lg"
                disabled={status === "loading"}
                className="shrink-0"
              >
                {status === "loading" ? (
                  "Subscribing..."
                ) : (
                  <>Subscribe <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
