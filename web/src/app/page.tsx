import type { Metadata } from 'next';
import Banner from '@/components/Banner';
import DualCardSection from '@/components/DualCardSection';
import EditorialSection from '@/components/EditorialSection';
import FeaturedSection from '@/components/FeaturedSection';
import Feature from '@/components/Feature';
import InstagramFollow from '@/components/InstagramFollow';
import OfflineCouponBanner from '@/components/OfflineCouponBanner';
import Gallery from '@/components/Gallery';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import NewArrivals from '@/components/NewArrivals';
import RewardsSection from '@/components/RewardsSection';
import SalesBanner from '@/components/SalesBanner/index';
import { generateSEOMetadata } from '@/components/SEO';
import ShopByCategory from '@/components/ShopByCategory';
import VisitOurStore from '@/components/VisitOurStore';
import {
  OrganizationStructuredData,
  WebsiteStructuredData,
} from '@/components/StructuredData';

export const dynamic = 'force-dynamic';

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
      <OfflineCouponBanner />
      <OrganizationStructuredData />
      <WebsiteStructuredData />
      <div className="min-h-screen bg-white">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 z-[60]">
            <Navbar />
          </div>
          <HeroSection />
        </div>
        <EditorialSection />
        {/* <DualCardSection /> */}
        <FeaturedSection />
        {/* <NewArrivals /> */}
        <Gallery />
        <ShopByCategory />
        {/* <Banner /> */}

        
        <SalesBanner />
        <VisitOurStore />

        <Feature />

        <InstagramFollow />
      </div>
    </>
  );
}
