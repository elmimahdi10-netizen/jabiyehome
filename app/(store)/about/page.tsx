import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Jabiye Home",
  description: "Learn about Jabiye Home, your trusted home security specialist.",
};

export default function AboutPage() {
  return (
    <div className="container py-16 max-w-3xl">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">About Jabiye Home</h1>
      <p className="text-lg text-slate-600 mb-6">
        Jabiye Home is a home security specialist based in Arendal, Norway. Our mission is simple: make professional-grade security accessible and affordable for every homeowner.
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
      <p className="text-slate-600 mb-6">
        We believe everyone deserves to feel safe at home. We carefully select the best security products and deliver them directly to your door.
      </p>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Choose Us?</h2>
      <ul className="space-y-3 text-slate-600 mb-6">
        <li>✅ Carefully selected, tested products</li>
        <li>✅ Fast and reliable shipping</li>
        <li>✅ 30-day money-back guarantee</li>
        <li>✅ Dedicated customer support</li>
        <li>✅ Easy DIY installation</li>
      </ul>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
      <p className="text-slate-600">
        Have a question? Email us at support@jabiyehome.com and we will get back to you within 24 hours.
      </p>
    </div>
  );
}
