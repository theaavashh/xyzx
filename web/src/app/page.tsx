import type { Metadata } from 'next';
import DualCardSection from '@/components/DualCardSection';
import EditorialSection from '@/components/EditorialSection';
import Feature from '@/components/Feature';
import PromotionalBanner from '@/components/PromotionalBanner';
import OfflineCouponBanner from '@/components/OfflineCouponBanner';
import Hero from '@/components/Hero';
import HeroSection from '@/components/HeroSection';
import ShortDescription from '@/components/ShortDescription';
import { CategoryGrid } from '@/components/CategoryGrid';
import Navbar from '@/components/Navbar';
import NewIn from '@/components/NewIn';
import TwoImageGrid from '@/components/TwoImageGrid';
import ThreeImageGrid from '@/components/ThreeImageGrid';
import WomenItems from '@/components/WomenItems';
import NewsletterSignup from '@/components/NewsletterSignup';
import AboutSection from '@/components/AboutSection';
import { generateSEOMetadata } from '@/components/SEO';
import ShopByCategory from '@/components/ShopByCategory';
import CategoryTileGrid from '@/components/CategoryTileGrid';
import VisitOurStore from '@/components/VisitOurStore';
import { FooterSocial } from '@/components/Footer/components';
import PageLoadBlur from '@/components/PageLoadBlur';
import {
  OrganizationStructuredData,
  WebsiteStructuredData,
} from '@/components/StructuredData';

export const revalidate = 300;

export const metadata: Metadata = generateSEOMetadata({
  title: 'Premium Fashion & Footwear',
  description:
    'Shop the latest in premium fashion, sneakers, and accessories at RaphArch. Discover high-quality streetwear, athletic footwear, and exclusive collections with fast shipping.',
  keywords: [
    'premium fashion',
    'footwear',
    'sneakers',
    'streetwear',
    'athletic shoes',
    'clothing',
    'accessories',
  ],
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rapharch.com',
  type: 'website',
});

export default function Home() {
  return (
    <>
      <PageLoadBlur />
      <OfflineCouponBanner />
      <OrganizationStructuredData />
      <WebsiteStructuredData />
      <div className="min-h-screen bg-white">
        <div className="relative">
          <Navbar />
          <HeroSection />
          <ShortDescription />         
        </div>
        <CategoryGrid />
        <NewIn />
         <EditorialSection />
          <ShopByCategory />
          <CategoryTileGrid />
        <Hero />
        <WomenItems />
        <NewsletterSignup />

        <TwoImageGrid />
        <ThreeImageGrid />
       
        <DualCardSection />
         <AboutSection />
        {/* <VisitOurStore /> */}
         <PromotionalBanner />
          <Feature />
          <FooterSocial />

      </div>
    </>
  );
}
