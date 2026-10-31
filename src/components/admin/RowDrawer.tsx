"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { eventForms } from "@/data/registration-forms";
import { eventName, fmtTime } from "@/lib/admin/columns";
import type { AdminRow } from "@/lib/admin/types";
import { telHref, waHref } from "@/lib/contact";
import { displayValue, isVisible } from "@/lib/registration/fields";

function Copy({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* clipboard blocked: ignore */
        }
      }}
      className="min-h-11 shrink-0 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/60 transition-colors hover:text-white"
    >
      {done ? "Copied" : "Copy"}
    </button>
  );
}

function Contact({ label, value, href, external }: { label: string; value: string; href: string; external?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-dashed border-line py-2">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        <a
          href={href}
          {...(external && { target: "_blank", rel: "noopener noreferrer" })}
          className="block truncate font-sans text-lg font-bold tabular-nums transition-colors hover:text-green"
        >
          {value}
        </a>
      </div>
      <Copy value={value} />
    </div>
  );
}

const heading = "text-xs uppercase tracking-wide text-muted";

export function RowDrawer({ row, onClose }: { row: AdminRow | null; onClose: () => void }) {
  return (
    <Dialog.Root open={!!row} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-dashed border-line bg-background p-5 sm:p-6"
        >
          {row && (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Dialog.Title className="font-sans text-2xl font-bold leading-tight">{row.name}</Dialog.Title>
                  <p className="mt-1 text-xs text-white/60">Registered {fmtTime(row.createdAt)}</p>
                </div>
                <Dialog.Close className="min-h-11 shrink-0 border border-dashed border-line px-4 text-sm text-white/85 hover:border-white/60 hover:text-white">
                  Close
                </Dialog.Close>
              </div>

              <section className="mt-6">
                <h3 className={heading}>[Contact]</h3>
                <div className="mt-2 border-t border-dashed border-line">
                  <Contact label="Calling" value={row.calling} href={telHref(`+91${row.calling}`)} />
                  <Contact label="WhatsApp" value={row.whatsapp} href={waHref(`+91${row.whatsapp}`)} external />
                  {row.email && <Contact label="Email" value={row.email} href={`mailto:${row.email}`} />}
                </div>
              </section>

              <section className="mt-6">
                <h3 className={heading}>[Details]</h3>
                <dl className="mt-2 divide-y divide-dashed divide-line border-y border-dashed border-line text-sm">
                  {[
                    ["College", row.college],
                    ["Department", row.department],
                    ["Semester", String(row.semester)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 py-3">
                      <dt className="text-white/60">{k}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {Object.entries(row.entries).map(([slug, data]) => (
                <section key={slug} className="mt-6">
                  <h3 className={heading}>[{eventName(slug)}]</h3>
                  <dl className="mt-2 divide-y divide-dashed divide-line border-y border-dashed border-line text-sm">
                    {(eventForms[slug]?.fields ?? [])
                      .filter((f) => isVisible(f, data))
                      .map((f) => (
                        <div key={f.name} className="flex justify-between gap-4 py-3">
                          <dt className="text-white/60">{f.label}</dt>
                          <dd className="text-right font-medium">{displayValue(f, data[f.name] as string | string[] | undefined)}</dd>
                        </div>
                      ))}
                    {!eventForms[slug]?.fields.length && <p className="py-3 text-white/60">No extra details for this event.</p>}
                  </dl>
                </section>
              ))}

              {row.query && (
                <section className="mt-6 pb-4">
                  <h3 className={heading}>[Query]</h3>
                  <p className="mt-2 whitespace-pre-line border-y border-dashed border-line py-3 text-sm leading-6 text-white/85">{row.query}</p>
                </section>
              )}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}