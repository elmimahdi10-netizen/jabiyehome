// app/(store)/page.tsx — Homepage: pulls real featured products from DB
import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import SmartHomeShowcase from "@/components/home/SmartHomeShowcase";
import CamerasShowcase from "@/components/home/CamerasShowcase";
import AlarmsShowcase from "@/components/home/AlarmsShowcase";
import TrustSection from "@/components/home/TrustSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQPreview from "@/components/home/FAQPreview";
import NewsletterSection from "@/components/home/NewsletterSection";
import CTASection from "@/components/home/CTASection";
import { getFeaturedProducts } from "@/lib/services/product.service";

export const metadata: Metadata = {
  title: "Jabiyehome — Professional Home Security & Smart Home Systems",
  description: "Enterprise-grade home security cameras, smart alarms, and complete security kits. Trusted by 150,000+ homeowners. Free installation over $299.",
};

// ISR: revalidate every hour
export const revalidate = 3600;

export default async function HomePage() {
  // Gracefully falls back to empty array if DB is not yet connected
  const featuredProducts = await getFeaturedProducts(4).catch(() => []);

  return (
    <>
      <HeroSection />
      <CategoryShowcase />
      {featuredProducts.length > 0 && <FeaturedProducts products={featuredProducts} />}
      <SmartHomeShowcase />
      <CamerasShowcase />
      <AlarmsShowcase />
      <TrustSection />
      <TestimonialsSection />
      <FAQPreview />
      <NewsletterSection />
      <CTASection />
    </>
  );
}
