import StickyNav from "@/components/StickyNav";
import HeroSection from "@/components/HeroSection";
import BrandPromise from "@/components/BrandPromise";
import TrendingGifts from "@/components/TrendingGifts";
import OccasionGrid from "@/components/OccasionGrid";
import CuratedCollection from "@/components/CuratedCollection";
import Testimonials from "@/components/Testimonials";
import GiftFinder from "@/components/GiftFinder";
import Sustainability from "@/components/Sustainability";
import FooterSection from "@/components/FooterSection";
import PageTransition from "@/components/PageTransition";
import ArtisanSpotlight from "@/components/ArtisanSpotlight";
import LogisticsShowcase from "@/components/LogisticsShowcase";
import RecentlyViewed from "@/components/RecentlyViewed";

const Index = () => {
  return (
    <PageTransition>
      <StickyNav />
      <main className="overflow-hidden">
        <HeroSection />
        <BrandPromise />
        <TrendingGifts />
        <ArtisanSpotlight />
        <LogisticsShowcase />
        <OccasionGrid />
        <CuratedCollection />
        <Testimonials />
        {/* <GiftFinder /> */}
        <Sustainability />
        <RecentlyViewed />
      </main>
      <FooterSection />
    </PageTransition>
  );
};

export default Index;
