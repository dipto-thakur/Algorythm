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
    <p className="text-sm font-medium text-orange">
      {"if (year <= 3) { aa_jao(); }"}
      <span className="ml-3 font-light text-muted">{"// open to college students in years 1–3"}</span>
    </p>
    <p className="mt-6 text-base leading-7">
      <span className="text-orange">{"{`"}</span>
      ALGORYTHM is a group of events presented by Computer Science department which brings together a hackathon, a design battle, presentations, a quiz, and a little cultural competetion on the top. Because there's more to CS students than code, caffeine, and occasionally asking ChatGPT to fix code we barely understood in the first place. Come compete, learn something new, meet great people, and earn a certificate for LinkedIn. We all have our priorities.
      <span className="text-orange">{"`}"}</span>
    </p>
  </div>
</Reveal>


    </section>
  );
}