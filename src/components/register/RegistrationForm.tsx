"use client";
//src\components\register\RegistrationForm.tsx
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, WifiOff } from "lucide-react";
import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { submitRegistration } from "@/app/register/actions";
import { events } from "@/data/events";
import { commonFields, eventForms } from "@/data/registration-forms";
import { fieldSchema, validateFields, type Errors } from "@/lib/registration/schema";
import { useDraft } from "@/lib/registration/useDraft";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useRegistrationClosed } from "@/lib/useNow";
import { FieldRenderer } from "./FieldRenderer";
import { ReviewStep } from "./ReviewStep";
import { SuccessCard, type Done } from "./SuccessCard";
import { emptyValues, isVisible, type Field, type Values } from "@/lib/registration/fields";

type Draft = { step: number; common: Values; entries: Record<string, Values>; submissionId: string };
type StepKey = "details" | "events" | "review";

const initial: Draft = { step: 0, common: emptyValues(commonFields), entries: {}, submissionId: "" };

const titles: Record<StepKey, string> = { details: "About you", events: "Event details", review: "Review" };
const hints: Record<StepKey, string> = {
  details: "Tell us who you are.",
  events: "A few details per event.",
  review: "One last look before you submit.",
};

const bySlug = new Map(events.map((e) => [e.slug, e]));
const fieldsOf = (slug: string): Field[] => eventForms[slug]?.fields ?? [];
const eventName = (slug: string) => bySlug.get(slug)?.name ?? slug;
const fid = (key: string) => `f-${key.replace(/\./g, "-")}`;
const half = (f: Field) => f.type === "text" || f.type === "email" || f.type === "tel";
const isEmpty = (v: string | string[] | undefined) => v == null || v === "" || (Array.isArray(v) && v.length === 0);

const subscribe = (cb: () => void) => {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
};
const useOnline = () => useSyncExternalStore(subscribe, () => navigator.onLine, () => true);

const btn =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition-transform active:scale-[0.97] disabled:active:scale-100";
const glass =
  "bg-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_40px_90px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl backdrop-saturate-150 sm:backdrop-blur-2xl supports-[backdrop-filter]:bg-white/[0.08]";
const TEXT_INPUTS = new Set(["text", "email", "tel", "number"]);

export function RegistrationForm() {
  const reduce = useReducedMotion();
  const closed = useRegistrationClosed();
  const online = useOnline();
  const { state: d, setState: setD, ready, clear } = useDraft<Draft>("algorythm:registration:v1", initial);
  const [errors, setErrors] = useState<Errors>({});
  const [banner, setBanner] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const [dir, setDir] = useState(1);
  const hp = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const selected = (d.common.events as string[]) ?? [];
  const evSlugs = selected.filter((s) => fieldsOf(s).length > 0);
  const flow: StepKey[] = evSlugs.length ? ["details", "events", "review"] : ["details", "review"];
  const idx = Math.min(d.step, flow.length - 1);
  const step = flow[idx] ?? "details";

  if (done) return <SuccessCard done={done} />;
  if (closed) {
    return (
      <div role="status" className="rounded-[2rem] bg-white/[0.05] p-8 text-center backdrop-blur-xl">
        <h2 className="font-sans text-2xl font-bold">Registrations are closed</h2>
        <p className="mt-2 text-sm text-white/75">
          Thanks for the interest. Reach out on the helpline below if you have questions.
        </p>
      </div>
    );
  }
  if (!ready) return <div aria-hidden className="h-96 rounded-[2rem] bg-white/[0.04] motion-safe:animate-pulse" />;

  const setCommon = (name: string, v: string | string[]) => setD((p) => ({ ...p, common: { ...p.common, [name]: v } }));
  const setEntry = (slug: string, name: string, v: string | string[]) =>
    setD((p) => ({ ...p, entries: { ...p.entries, [slug]: { ...p.entries[slug], [name]: v } } }));

  const check = (key: string, f: Field, v: string | string[]) =>
    setErrors((p) => {
      const n = { ...p };
      const r = fieldSchema(f).safeParse(v);
      if (r.success) delete n[key];
      else n[key] = r.error.issues[0]?.message ?? "Invalid value";
      return n;
    });

  /** Bring the form into view only when its top is off-screen, so short hops never jump the page. */
  const scrollToForm = () => {
    const el = rootRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 72) window.scrollTo({ top: window.scrollY + top - 88, behavior: reduce ? "auto" : "smooth" });
  };

  /** Waits for the field to exist (step transition) instead of assuming it's already mounted. */
  const focusFirst = (errs: Errors) => {
    const key = Object.keys(errs)[0];
    if (!key) return;
    let tries = 0;
    const tick = () => {
      const el = document.getElementById(fid(key));
      if (el) el.focus();
      else if (tries++ < 20) window.setTimeout(tick, 50);
    };
    requestAnimationFrame(tick);
  };

  const go = (to: number, focusHeading = true) => {
    setDir(to > idx ? 1 : -1);
    setBanner(null);
    setD((p) => ({ ...p, step: to }));
    scrollToForm();
    // Screen-reader and keyboard users land on the new step's title.
    if (focusHeading) requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  };
  const goTo = (s: "details" | "events", focusHeading = true) => go(Math.max(0, flow.indexOf(s)), focusHeading);

  const next = () => {
    const errs: Errors =
      step === "details"
        ? validateFields(commonFields, d.common)
        : step === "events"
          ? Object.assign({}, ...evSlugs.map((s) => validateFields(fieldsOf(s), d.entries[s] ?? {}, `${s}.`)))
          : {};
    if (Object.keys(errs).length) {
      setErrors(errs);
      focusFirst(errs);
      return;
    }
    setErrors({});
    setBanner(null);
    if (step === "details") {
      // Keep only selected events' answers and prefill leader details from the common step.
      setD((p) => ({
        ...p,
        entries: Object.fromEntries(
          evSlugs.map((s) => {
            const fields = fieldsOf(s);
            const cur: Values = { ...emptyValues(fields), ...p.entries[s] };
            for (const f of fields) if (f.prefill && !cur[f.name]) cur[f.name] = String(p.common[f.prefill] ?? "");
            return [s, cur];
          }),
        ),
      }));
    }
    go(idx + 1);
  };

  const submit = async () => {
    if (busy) return;
    if (!online) {
      setBanner("You're offline. Your answers are saved on this device. Reconnect and tap Submit again.");
      return;
    }
    const id = d.submissionId || crypto.randomUUID();
    setD((p) => ({ ...p, submissionId: id }));
    setBusy(true);
    setBanner(null);
    try {
      const res = await submitRegistration({ submissionId: id, hp: hp.current?.value ?? "", common: d.common, entries: d.entries });
      if (res.ok) {
        clear();
        setDone({
          name: String(d.common.name),
          whatsapp: String(d.common.whatsapp),
          eventNames: selected.map(eventName),
          groups: res.groups,
        });
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        return;
      }
      if (res.code === "invalid" && res.fieldErrors) {
        setErrors(res.fieldErrors);
        goTo(Object.keys(res.fieldErrors).some((k) => k.includes(".")) ? "events" : "details", false);
        focusFirst(res.fieldErrors);
      }
      setBanner(res.message);
    } catch {
      setBanner("Couldn't reach the server. Your answers are saved on this device. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  /** Enter in a plain text input = Continue (mobile "Go" key). Skips textareas, buttons, and custom comboboxes. */
  const onEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing || step === "review") return;
    const t = e.target;
    if (!(t instanceof HTMLInputElement) || !TEXT_INPUTS.has(t.type)) return;
    if (t.closest('[role="combobox"],[role="listbox"],[role="dialog"]')) return;
    e.preventDefault();
    next();
  };

  const renderFields = (
    fields: Field[],
    values: Values,
    scope: string,
    set: (name: string, v: string | string[]) => void,
  ) => (
    <div className="grid gap-6 sm:grid-cols-2">
      {fields.map((f) => {
        if (!isVisible(f, values)) return null;
        const key = scope + f.name;
        return (
          <motion.div
            key={key}
            initial={f.showIf && !reduce ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={half(f) ? undefined : "sm:col-span-2"}
          >
            <FieldRenderer
              field={f}
              id={fid(key)}
              value={values[f.name] ?? (f.type === "checkbox" ? [] : "")}
              error={errors[key]}
              onChange={(v) => {
                set(f.name, v);
                if (errors[key]) check(key, f, v);
              }}
              onBlur={() => {
                // Don't scold people for merely tabbing past an empty field; Continue reports those.
                const v = values[f.name];
                if (!isEmpty(v) || errors[key]) check(key, f, v ?? "");
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );

  const errCount = Object.keys(errors).length;
  const firstErr = Object.keys(errors)[0];
  const offlineOnly = !online && !banner && !errCount;
  const msg =
    banner ??
    (errCount
      ? `${errCount} ${errCount > 1 ? "fields need" : "field needs"} attention.`
      : !online
        ? "You're offline. Your answers are saved on this device."
        : null);

  return (
    <div ref={rootRef} className="grid gap-5">
      {/* progress: top bar on every screen size */}
      <nav aria-label="Progress" className="px-1">
        <ol className="flex justify-between gap-3 text-xs font-medium uppercase tracking-[0.14em]">
          {flow.map((s, i) => (
            <li
              key={s}
              aria-current={i === idx ? "step" : undefined}
              className={`whitespace-nowrap transition-colors duration-300 ${
                i === idx ? "text-white" : i < idx ? "text-green" : "text-white/40"
              }`}
            >
              {i < idx ? "✓" : `0${i + 1}`}
              {/* Inactive titles collapse to the number on narrow screens, still read by screen readers. */}
              <span className={i === idx ? undefined : "max-sm:sr-only"}> {titles[s]}</span>
            </li>
          ))}
        </ol>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)]"
            initial={false}
            animate={{ width: `${((idx + 1) / flow.length) * 100}%` }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        {selected.length > 0 && (
          <ul aria-label="Your events" className="mt-3 flex flex-wrap gap-2">
            <AnimatePresence initial={false}>
              {selected.map((s) => (
                <motion.li
                  key={s}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.85 }}
                  className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                >
                  {eventName(s)}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </nav>

      <div className="min-w-0" onKeyDown={onEnter}>
        {/* glass panel: same nested-tile language as the hero countdown */}
        <div className={`rounded-[2rem] p-2 ${glass}`}>
          <div className="relative rounded-3xl bg-white/[0.07] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] sm:p-7">
            <header className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/60">
                  Step 0{idx + 1} of 0{flow.length}
                </p>
                <h2 ref={headingRef} tabIndex={-1} className="mt-1 font-sans text-2xl font-bold outline-none sm:text-3xl">
                  {titles[step]}
                </h2>
              </div>
              <p className="hidden max-w-[14rem] text-right text-sm leading-5 text-white/60 sm:block">{hints[step]}</p>
            </header>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={reduce ? false : { opacity: 0, x: dir * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: dir * -28 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === "details" && renderFields(commonFields, d.common, "", setCommon)}

                {step === "events" && (
                  <div className="grid gap-5">
                    {evSlugs.map((s, n) => (
                      <section
                        key={s}
                        aria-labelledby={`h-${s}`}
                        className="rounded-3xl bg-white/[0.05] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] sm:p-5"
                      >
                        <h3 id={`h-${s}`} className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xl font-bold">
                          <span className="text-sm font-medium text-blue">0{n + 1}</span>
                          {eventName(s)}
                          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-white/70">
                            {bySlug.get(s)?.kind}
                          </span>
                        </h3>
                        {eventForms[s]?.intro && (
                          <p className="-mt-2 mb-5 text-sm leading-6 text-white/70">{eventForms[s]?.intro}</p>
                        )}
                        {renderFields(fieldsOf(s), d.entries[s] ?? {}, `${s}.`, (n2, v) => setEntry(s, n2, v))}
                      </section>
                    ))}
                    {selected.length > evSlugs.length && (
                      <p className="px-1 text-sm text-white/60">
                        No extra details needed for {selected.filter((s) => !evSlugs.includes(s)).map(eventName).join(", ")}.
                      </p>
                    )}
                  </div>
                )}

                {step === "review" && <ReviewStep common={d.common} entries={d.entries} slugs={evSlugs} onEdit={goTo} />}
              </motion.div>
            </AnimatePresence>

            {/* honeypot: invisible to people, tempting to bots */}
            <input
              ref={hp}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] size-0 opacity-0"
            />
          </div>
        </div>

        {/* floating action bar: errors surface here, so they're visible wherever the user is on the page */}
        <div className="sticky bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-20 mt-3">
          <div className={`rounded-[1.75rem] p-2 ${glass}`}>
            <AnimatePresence initial={false}>
              {msg && (
                <motion.div
                  key="msg"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div
                    role={offlineOnly ? "status" : "alert"}
                    className={`mb-2 flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium ${
                      offlineOnly ? "bg-white/10 text-white" : "bg-orange/15 text-orange"
                    }`}
                  >
                    {!online && <WifiOff aria-hidden className="size-4 shrink-0" />}
                    <span className="min-w-0 flex-1">{msg}</span>
                    {errCount > 0 && firstErr && (
                      <button
                        type="button"
                        onClick={() => document.getElementById(fid(firstErr))?.focus()}
                        className="min-h-9 shrink-0 rounded-full bg-orange/20 px-3 text-xs font-bold transition-colors hover:bg-orange/30 focus-visible:bg-orange/30"
                      >
                        Show
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2">
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => go(idx - 1)}
                  disabled={busy}
                  className={`${btn} bg-white/[0.08] text-white hover:bg-white/[0.14] focus-visible:bg-white/[0.14] disabled:opacity-50`}
                >
                  <ArrowLeft aria-hidden className="size-4" /> Back
                </button>
              )}
              {step === "review" ? (
                <button
                  type="button"
                  onClick={submit}
                  disabled={busy}
                  aria-busy={busy}
                  className={`${btn} flex-1 bg-white text-black shadow-[0_10px_30px_-8px_rgba(255,255,255,0.4)] disabled:opacity-70`}
                >
                  {busy ? (
                    <>
                      <Loader2 aria-hidden className="size-4 animate-spin" /> Submitting…
                    </>
                  ) : (
                    "Submit registration"
                  )}
                </button>
              ) : (
                <button type="button" onClick={next} className={`${btn} flex-1 bg-white text-black`}>
                  Continue <ArrowRight aria-hidden className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}