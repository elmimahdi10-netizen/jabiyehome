import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Jabiye Home",
  description: "Frequently asked questions about Jabiye Home products and orders.",
};

const FAQS = [
  {
    q: "How long does shipping take?",
    a: "Orders are processed within 1-2 business days. Delivery typically takes 7-14 business days depending on your location."
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes! We offer free shipping on orders over $299."
  },
  {
    q: "What is your return policy?",
    a: "We offer a 30-day money-back guarantee. If you are not satisfied, contact us at support@jabiyehome.com and we will arrange a return."
  },
  {
    q: "Are the products easy to install?",
    a: "Yes! All our products are designed for DIY installation. No professional help needed. Each product comes with a step-by-step installation guide."
  },
  {
    q: "Do the cameras require a subscription?",
    a: "No! Our cameras and alarm systems work without any monthly subscription fees."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Visa, Mastercard, American Express, and PayPal."
  },
  {
    q: "How do I track my order?",
    a: "Once your order is shipped, you will receive a tracking number by email."
  },
  {
    q: "Do you offer a warranty?",
    a: "Yes, all products come with a 12-month warranty against manufacturing defects."
  },
];

export default function FAQPage() {
  return (
    <div className="container py-16 max-w-3xl">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Frequently Asked Questions</h1>
      <p className="text-slate-600 mb-10">Everything you need to know about our products and orders.</p>
      <div className="space-y-6">
        {FAQS.map((faq, i) => (
          <div key={i} className="border-b border-slate-200 pb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">{faq.q}</h2>
            <p className="text-slate-600">{faq.a}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 p-6 bg-green-50 rounded-xl">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Still have questions?</h2>
        <p className="text-slate-600">Contact us at <a href="mailto:support@jabiyehome.com" className="text-green-600 hover:underline">support@jabiyehome.com</a></p>
      </div>
    </div>
  );
}
