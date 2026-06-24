import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Jabiye Home",
  description: "Get in touch with Jabiye Home support team.",
};

export default function ContactPage() {
  return (
    <div className="container py-16 max-w-2xl">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Contact Us</h1>
      <p className="text-slate-600 mb-10">We typically respond within 24 hours.</p>

      <div className="grid gap-6 mb-12">
        <div className="p-6 bg-green-50 rounded-xl">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Email Support</h2>
          <p className="text-slate-600 mb-2">For orders, returns, and product questions:</p>
          <a href="mailto:support@jabiyehome.com" className="text-green-600 font-semibold hover:underline">
            support@jabiyehome.com
          </a>
        </div>

        <div className="p-6 bg-slate-50 rounded-xl">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Location</h2>
          <p className="text-slate-600">Arendal, Norway</p>
        </div>

        <div className="p-6 bg-slate-50 rounded-xl">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Business Hours</h2>
          <p className="text-slate-600">Monday – Friday: 9:00 AM – 5:00 PM (CET)</p>
        </div>
      </div>

      <div className="p-6 border border-slate-200 rounded-xl">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Send us a message</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your name</label>
            <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input type="email" className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea rows={5} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="How can we help you?" />
          </div>
          <a href="mailto:support@jabiyehome.com" className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors">
            Send Message
          </a>
        </div>
      </div>
    </div>
  );
}
