"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Shield, X } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { navigation } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function MobileNav() {
  const { isMobileNavOpen, closeMobileNav } = useUIStore();

  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileNavOpen]);

  return (
    <AnimatePresence>
      {isMobileNavOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={closeMobileNav}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-[300px] bg-background border-r shadow-xl flex flex-col lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/" onClick={closeMobileNav} className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-cyan-500" />
                <span className="font-display font-bold text-lg">
                  Secure<span className="text-cyan-500">Home</span>
                </span>
              </Link>
              <Button variant="ghost" size="icon" onClick={closeMobileNav}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto py-4">
              {navigation.map((item) => (
                <div key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={closeMobileNav}
                      className="flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                    >
                      {item.label}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ) : (
                    <div>
                      <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {item.label}
                      </p>
                      {item.categories?.map((cat) =>
                        cat.items.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={closeMobileNav}
                            className="flex items-center px-6 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}

              <Separator className="my-2" />

              <Link
                href="/blog"
                onClick={closeMobileNav}
                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                Blog
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>

            {/* Footer actions */}
            <div className="p-4 border-t space-y-2">
              <Button asChild className="w-full" variant="glow">
                <Link href="/login" onClick={closeMobileNav}>Sign in</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/register" onClick={closeMobileNav}>Create account</Link>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
