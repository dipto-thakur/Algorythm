"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="rail-bounded">
      <Reveal>
        <SectionHeading id="about-title" label="About ALGORYTHM" title="kya hai ALGORYTHM?" color="orange" align="left" />
      </Reveal>
      <Reveal delay={0.15}>
        <div className=" px-5 py-10">
          <p className="text-sm font-medium text-orange">
            {"if (year <= 3) { aa_jao(); }"}
            <span className="ml-3 font-light text-muted">{"// any college, 1st to 3rd year"}</span>
          </p>
          <p className="mt-6 text-base leading-7">
            <span className="text-orange">{"{`"}</span>
            Computer Science department ka ek event, jisme ek hackathon, ek design battle, ek presentation, ek quiz aur
            thoda culture sab ek saath hai. Kyunki hum CS wale sirf coding nahi karte (aur sirf ChatGPT se copy
            bhi nahi karte. Mostly). Certificates milenge,
            toh LinkedIn pe daalne ka bahana pakka. 😁
            <span className="text-orange">{"`}"}</span>
          </p>
        </div>
      </Reveal>
    </section>
  );
}