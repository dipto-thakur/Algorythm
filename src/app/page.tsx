import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/sections/AboutSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { CreditsSection } from "@/components/sections/CreditsSection";
import { getRegisteredCount } from "@/lib/registration/count";
import { AdRow } from "@/components/layout/AdRow";

export const revalidate = 60;

export default async function Home() {
  const registeredCount = await getRegisteredCount();
  return (
    <>
      <ScrollProgress />
      <main id="main">
      <HeroSection registeredCount={registeredCount} />
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
 <AdRow />

      </main>
      <Footer />
    </>
  );
}
