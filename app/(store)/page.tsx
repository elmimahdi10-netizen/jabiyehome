import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewsletterSection from "@/components/home/NewsletterSection";
import { getFeaturedProducts } from "@/lib/services/product.service";
import Link from "next/link";
import { Shield, Truck, RotateCcw, Headphones } from "lucide-react";

export const metadata: Metadata = {
  title: "Jabiye Home — Home Security Products",
  description: "Affordable home security cameras, alarm kits, video doorbells and motion sensors.",
};

export const revalidate = 3600;

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(4).catch(() => []);
  return (
    <>
      <HeroBanner />
      <HeroSection />

      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-2">Our Products</p>
            <h2 className="text-3xl font-bold text-slate-900">Everything you need to secure your home</h2>
          </div>
          {featuredProducts.length > 0 ? (
            <FeaturedProducts products={featuredProducts} />
          ) : (
            <div className="text-center">
              <Link href="/products" className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-2">Why Jabiye Home</p>
            <h2 className="text-3xl font-bold text-slate-900">Simple. Affordable. Reliable.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Quality Products</h3>
              <p className="text-sm text-slate-600">Carefully selected and tested before we sell them.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Fast Shipping</h3>
              <p className="text-sm text-slate-600">Delivered to your door in 7-14 business days.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">30-Day Returns</h3>
              <p className="text-sm text-slate-600">Not happy? Return it within 30 days, no questions asked.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Email Support</h3>
              <p className="text-sm text-slate-600">We reply within 24 hours at support@jabiyehome.com.</p>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
