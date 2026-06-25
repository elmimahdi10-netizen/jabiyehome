import Link from "next/link";
import { Shield, Mail, Phone, MapPin } from "lucide-react";
import FooterNewsletter from "./FooterNewsletter";
import { footerLinks } from "@/lib/navigation";

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <Shield className="h-7 w-7 text-green-500 transition-transform group-hover:scale-110 duration-200" />
              <span className="font-display font-bold text-xl tracking-tight">
                Jabiye<span className="text-green-500">Home</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Your home security specialist based in Arendal, Norway. Quality products, fast shipping, no subscription required..
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <a href="tel:+18005551234" className="flex items-center gap-2 hover:text-green-500 transition-colors">
                <Phone className="h-4 w-4 shrink-0" />
                
              </a>
              <a href="mailto:support@jabiyehome.com" className="flex items-center gap-2 hover:text-green-500 transition-colors">
                <Mail className="h-4 w-4 shrink-0" />
                support@jabiyehome.com
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Arendal, Norway</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              {["X / Twitter", "Facebook", "Instagram", "YouTube", "LinkedIn"].map((label) => (
                <a key={label} href="#" aria-label={label}
                  className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-green-600 transition-colors duration-200 text-white/70 hover:text-white">
                  {label.split(" /")[0]}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Products</h3>
            <ul className="space-y-2.5">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-green-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-green-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-green-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Stay Updated</h3>
            <p className="text-sm text-white/60">Security tips, product launches, and exclusive offers.</p>
            <FooterNewsletter />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/50">
            {["🔒 256-bit SSL Encryption","✓ ISO 27001 Certified","⚡ 99.9% Uptime","🛡️ GDPR Compliant","📦 Free Returns within 30 days"].map((badge) => (
              <span key={badge} className="whitespace-nowrap">{badge}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Jabiyehome. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {footerLinks.legal.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-white/40 hover:text-white/70 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <span>Accepted:</span>
            {["Visa", "MC", "Amex", "PayPal", "Apple Pay"].map((pm) => (
              <span key={pm} className="px-2 py-0.5 border border-white/20 rounded text-[10px]">{pm}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}