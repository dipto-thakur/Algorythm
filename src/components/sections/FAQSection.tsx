"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import Image from "next/image";
import { faq } from "@/data/faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function FAQSection() {
  const reduce = useReducedMotion();
  return (
    <section id="faq" aria-labelledby="faq-title" className="rail-bounded pb-16">
      <SectionHeading id="faq-title" label="Frequently Asked Questions" title="aksar pooche jane waale sawaal" color="green" />
      <Accordion.Root type="single" collapsible className="grid items-start gap-4 px-4 pt-12 sm:px-6 md:grid-cols-2">
        {faq.map((q, i) => (
          <Accordion.Item key={q.id} value={q.id} asChild>
            <motion.div
              className="rounded-md border border-white/70 transition-colors hover:border-green data-[state=open]:border-green data-[state=open]:bg-green/[0.04]"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.55, delay: (i % 2) * 0.1 + Math.floor(i / 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduce ? undefined : { y: -3 }}
            >
            <Accordion.Header asChild>
              <h3>
                <Accordion.Trigger className="group flex min-h-[74px] w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium transition-colors sm:px-7 sm:text-base">
                  {q.question}
                  <Image
                    src="/assets/icon-chevron.svg"
                    alt=""
                    width={9}
                    height={15}
                    className="shrink-0 transition-transform group-data-[state=open]:rotate-90"
                  />
                </Accordion.Trigger>
              </h3>
            </Accordion.Header>
            <Accordion.Content className="acc-content">
              <p className="px-5 pb-5 text-sm leading-6 text-muted sm:px-7">{q.answer ?? "Answer coming soon."}</p>
            </Accordion.Content>
            </motion.div>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
