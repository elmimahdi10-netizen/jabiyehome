import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
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
      <HeroSection />
      <NewsletterSection />
    </>
  );
}
