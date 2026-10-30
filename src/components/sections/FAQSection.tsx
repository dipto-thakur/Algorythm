"use client";
//src\components\sections\FAQSection.tsx
import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { faq } from "@/data/faq";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

type Item = (typeof faq)[number];

const split = Math.ceil(faq.length / 2);
const columns: { items: Item[]; offset: number }[] = [
  { items: faq.slice(0, split), offset: 0 },
  { items: faq.slice(split), offset: split },
];

export function FAQSection() {
  const reduce = useReducedMotion();
  // One shared value keeps "single open" working across both columns.
  const [open, setOpen] = useState("");

  return (
    <section id="faq" aria-labelledby="faq-title" className="rail-bounded pb-16">
      <Reveal>
        <SectionHeading id="faq-title" label="FAQs" title="aksar pooche jane waale sawaal" color="green" />
      </Reveal>

      <div className="mt-12 grid border-t border-dashed border-line md:grid-cols-2">
        {columns.map((col, c) => (
          <Accordion.Root
            key={c}
            type="single"
            collapsible
            value={open}
            onValueChange={setOpen}
            className={cn("min-w-0 self-start", c === 0 && "md:border-r md:border-dashed md:border-line")}
          >
            {col.items.map((q, j) => {
              const n = col.offset + j;
              return (
                <Accordion.Item key={q.id} value={q.id} asChild>
                  <motion.div
                    className="border-b border-dashed border-line transition-colors data-[state=open]:bg-green/[0.04]"
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -6% 0px" }}
                    transition={{ duration: 0.5, delay: Math.min(j * 0.06, 0.24), ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Accordion.Header asChild>
                      <h3>
                        <Accordion.Trigger className="group flex w-full items-start gap-4 px-5 py-4 text-left outline-none transition-colors hover:bg-white/[0.03] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green sm:gap-5 sm:py-5">
                          <span className="w-6 shrink-0 text-sm font-medium leading-6 tabular-nums text-blue transition-colors group-data-[state=open]:text-green">
                            {String(n + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1 text-pretty break-words text-sm font-medium leading-6 transition-colors group-hover:text-green group-data-[state=open]:text-green sm:text-base">
                            {q.question}
                          </span>
                          <Plus
                            aria-hidden
                            className="mt-1 size-4 shrink-0 text-white/50 transition-[transform,color] duration-200 group-hover:text-green group-data-[state=open]:rotate-45 group-data-[state=open]:text-green"
                          />
                        </Accordion.Trigger>
                      </h3>
                    </Accordion.Header>
                    <Accordion.Content className="acc-content">
                      <p className="text-pretty break-words pb-5 pl-[3.25rem] pr-5 text-sm leading-6 text-muted sm:pl-[3.5rem] sm:pr-8">
                        {q.answer ?? "Answer coming soon."}
                      </p>
                    </Accordion.Content>
                  </motion.div>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        ))}
      </div>
    </section>
  );
}