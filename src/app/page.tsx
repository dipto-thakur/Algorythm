import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AboutSection } from "@/components/sections/AboutSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { CreditsSection } from "@/components/sections/CreditsSection";



export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <HeroSection />
        <div className="page-rails flex flex-col">
        <AboutSection />
<div className="section-divider" aria-hidden="true" />
<CreditsSection />
<div className="section-divider" aria-hidden="true" />
<EventsSection />
<div className="section-divider" aria-hidden="true" />
<ScheduleSection />
          <div className="section-divider" aria-hidden="true" />
          <FAQSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
