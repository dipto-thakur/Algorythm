"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="rail-bounded">


<Reveal>
  <SectionHeading id="about-title" label="About ALGORYTHM" title="So, what's ALGORYTHM?" color="orange" align="left" />
</Reveal>
<Reveal delay={0.15}>
  <div className="px-5 py-10">
  <p className="text-pretty text-sm leading-6 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
      ALGORYTHM is a group of events presented by Computer Science department which brings together a hackathon, a design battle, quizzes, presentations, and a little cultural & art competetion on the top. Because there's more to CS students than code, caffeine, and asking ChatGPT to fix code.
    </p>
    <p className="text-pretty text-sm leading-6 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
Come compete, learn something new, meet great people, and earn a certificate for LinkedIn. We all have our priorities.
    </p>
  </div>
</Reveal>


    </section>
  );
}