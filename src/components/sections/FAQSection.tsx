"use client";
//src\components\sections\FAQSection.tsx
import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { faq } from "@/data/faq";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function FAQSection() {
  const reduce = useReducedMotion();
  return (
    <section id="faq" aria-labelledby="faq-title" className="rail-bounded pb-16">
      <Reveal>
        <SectionHeading
          id="faq-title"
          label={`FAQs`}
          title="aksar pooche jane waale sawaal"
          color="green"
        />
      </Reveal>

      <Accordion.Root
        type="single"
        collapsible
        className="mt-12 border-t border-dashed border-line md:columns-2 md:gap-0 md:[column-rule:1px_dashed_var(--color-line)]"
      >
        {faq.map((q, i) => (
          <Accordion.Item key={q.id} value={q.id} asChild>
            <motion.div
              className="group/item break-inside-avoid border-b border-dashed border-line transition-colors data-[state=open]:bg-green/[0.04]"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <Accordion.Header asChild>
                <h3>
                  <Accordion.Trigger className="group flex w-full items-start gap-4 px-5 py-4 text-left outline-none transition-colors hover:bg-white/[0.03] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green sm:gap-5">
                    <span className="pt-0.5 text-sm font-medium text-blue transition-colors group-data-[state=open]:text-green">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-medium leading-6 transition-colors group-hover:text-green group-data-[state=open]:text-green sm:text-base">
                      {q.question}
                    </span>
                    <Plus
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-white/50 transition-transform duration-200 group-hover:text-green group-data-[state=open]:rotate-45 group-data-[state=open]:text-green"
                    />
                  </Accordion.Trigger>
                </h3>
              </Accordion.Header>
              <Accordion.Content className="acc-content">
                <p className="pb-5 pl-[3.25rem] pr-5 text-sm leading-6 text-muted sm:pl-[3.5rem]">
                  {q.answer ?? "Answer coming soon."}
                </p>
              </Accordion.Content>
            </motion.div>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}