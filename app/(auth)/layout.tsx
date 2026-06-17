// app/(auth)/layout.tsx — Split-panel auth layout with SessionProvider
import Link from "next/link";
import { Shield, Camera, Bell, Lock, CheckCircle2 } from "lucide-react";
import SessionProviderWrapper from "@/components/auth/SessionProviderWrapper";

const FEATURES = [
  { Icon: Camera, text: "280+ professional security products" },
  { Icon: Bell, text: "24/7 monitoring & instant alerts" },
  { Icon: Lock, text: "Military-grade 256-bit encryption" },
  { Icon: CheckCircle2, text: "Trusted by 150,000+ homeowners" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProviderWrapper>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left: brand panel */}
        <div className="hidden lg:flex flex-col justify-between bg-[#0a1628] p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-cyan-400" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Secure<span className="text-cyan-400">Home</span>
            </span>
          </Link>

          {/* Feature list */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-white leading-snug">
                Protect what<br />matters most
              </h2>
              <p className="mt-3 text-white/60 text-sm leading-relaxed">
                Enterprise-grade security made simple. Set up in minutes, monitor 24/7.
              </p>
            </div>

            <ul className="space-y-4">
              {FEATURES.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-sm text-white/80">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((l) => (
                <div key={l} className="h-8 w-8 rounded-full border-2 border-[#0a1628] flex items-center justify-center text-xs font-bold bg-cyan-500/20 text-cyan-400">
                  {l}
                </div>
              ))}
            </div>
            <p className="text-xs text-white/50">
              Join <span className="text-white/80 font-semibold">150,000+</span> homeowners
            </p>
          </div>
        </div>

        {/* Right: auth form */}
        <div className="flex items-center justify-center p-6 lg:p-12"
          style={{ background: "var(--color-background)" }}>
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <Link href="/" className="flex items-center gap-2 w-fit mb-8 lg:hidden">
              <Shield className="h-6 w-6 text-cyan-500" />
              <span className="font-display font-bold text-lg">
                Secure<span className="text-cyan-500">Home</span>
              </span>
            </Link>
            {children}
          </div>
        </div>
      </div>
    </SessionProviderWrapper>
  );
}
