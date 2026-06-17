"use client";

export default function FooterNewsletter() {
  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
        if (email) {
          // Phase 3: wire to newsletter action
          form.reset();
        }
      }}
    >
      <input
        type="email"
        name="email"
        placeholder="your@email.com"
        className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/10 text-sm placeholder-white/40 text-white focus:outline-none focus:border-cyan-500 focus:bg-white/15 transition-colors"
      />
      <button
        type="submit"
        className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#0a1628] text-sm font-semibold transition-colors"
      >
        Subscribe
      </button>
    </form>
  );
}
