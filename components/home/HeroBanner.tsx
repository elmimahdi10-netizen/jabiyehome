import Link from "next/link";

export default function HeroBanner() {
  return (
    <section style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2444 50%, #0a2e1a 100%)" }} className="py-24">
      <div className="container text-center">
        
        {/* Logo grand format */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <svg viewBox="0 0 60 74" xmlns="http://www.w3.org/2000/svg" style={{ height: "50px", width: "40px" }}>
            <path d="M30 0 L60 12 L60 40 C60 58 47 67 30 74 C13 67 0 58 0 40 L0 12 Z" fill="#16A34A"/>
            <path d="M30 5 L55 16 L55 40 C55 56 43 64 30 70 C17 64 5 56 5 40 L5 16 Z" fill="#15803D"/>
            <polyline points="17,40 26,50 43,28" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="text-left">
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#ffffff", letterSpacing: "-1px", lineHeight: "1" }}>JABIYE</div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#16A34A", letterSpacing: "8px", lineHeight: "1.2" }}>HOME</div>
          </div>
        </div>

        {/* Tagline */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Protect What <span className="text-green-400">Matters Most.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-white/60 mb-4 tracking-wide">
          Cameras &nbsp;•&nbsp; Alarms &nbsp;•&nbsp; Doorbells &nbsp;•&nbsp; Motion Sensors
        </p>

        <p className="text-white/40 text-sm mb-10">
          Fast delivery to Norway & Europe — No subscription required
        </p>

        {/* CTA */}
        <Link href="/products" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-12 py-4 rounded-xl text-lg transition-colors">
          Shop Now →
        </Link>

      </div>
    </section>
  );
}