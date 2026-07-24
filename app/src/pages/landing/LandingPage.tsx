import HeroSection from './HeroSection';
import TrustStatistics from './TrustStatistics';
import FeaturedCategories from './FeaturedCategories';
import TopProductsSection from './TopProductsSection';
import WhyChooseUs from './WhyChooseUs';
import BecomeVendorSection from './BecomeVendorSection';

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <TrustStatistics />
      <FeaturedCategories />
      <TopProductsSection />
      <WhyChooseUs />
      <BecomeVendorSection />
    </div>
  );
}
