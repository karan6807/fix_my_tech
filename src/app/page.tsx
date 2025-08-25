import { HeroSection, AboutSection, ServicesSection, WhyChooseUsSection, TestimonialsSection } from '@/sections';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
    </div>
  );
}