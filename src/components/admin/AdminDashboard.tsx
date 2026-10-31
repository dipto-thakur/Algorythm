"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { fetchRegistrations, logout } from "@/app/admin/actions";
import { events } from "@/data/events";
import { columnsFor, filterRows, fmtTime, sortRows, toCsv, type Tab } from "@/lib/admin/columns";
import type { AdminRow } from "@/lib/admin/types";
import { cn } from "@/lib/utils";
import { RowDrawer } from "./RowDrawer";

type Initial = { rows: AdminRow[]; fetchedAt: string } | null;

const btn =
  "inline-flex min-h-11 items-center justify-center border border-dashed border-line px-4 text-sm font-medium text-white/85 transition-colors hover:border-white/60 hover:text-white disabled:opacity-50";
const input =
  "h-11 border border-dashed border-line bg-background px-3 text-sm text-white outline-none focus-visible:border-white/70";
const PAGE = 100;

export function AdminDashboard({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [rows, setRows] = useState<AdminRow[]>(initial?.rows ?? []);
  const [fetchedAt, setFetchedAt] = useState<string | null>(initial?.fetchedAt ?? null);
  const [error, setError] = useState<string | null>(initial ? null : "Couldn't load data. Tap Refresh to try again.");
  const [pending, start] = useTransition();

  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [sem, setSem] = useState("");
  const [dept, setDept] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 }>({ key: "createdAt", dir: -1 });
  const [limit, setLimit] = useState(PAGE);
  const [openId, setOpenId] = useState<string | null>(null);

  const cols = useMemo(() => columnsFor(tab), [tab]);
  const sortCol = cols.find((c) => c.key === sort.key) ?? cols.find((c) => c.key === "createdAt");
  const dir = cols.some((c) => c.key === sort.key) ? sort.dir : -1;

  const depts = useMemo(
    () => [...new Map(rows.map((r) => [r.department.toLowerCase(), r.department])).entries()].sort((a, b) => a[1].localeCompare(b[1])),
    [rows],
  );
  const tabs = useMemo(
    () => [
      { key: "all", label: "All", count: rows.length },
      ...events.map((e) => ({ key: e.slug, label: e.name, count: rows.filter((r) => e.slug in r.entries).length })),
    ],
    [rows],
  );
  const result = useMemo(
    () => sortRows(filterRows(rows, { tab, q, sem, dept, cols }), sortCol, dir),
    [rows, tab, q, sem, dept, cols, sortCol, dir],
  );
  const shown = result.slice(0, limit);
  const selected = rows.find((r) => r.id === openId) ?? null;
  const filtered = !!(q || sem || dept);

  const refresh = () =>
    start(async () => {
      const res = await fetchRegistrations();
      if (res.ok) {
        setRows(res.rows);
        setFetchedAt(res.fetchedAt);
        setError(null);
      } else if (res.code === "auth") router.replace("/admin/login");
      else setError(res.message);
    });

  const onSort = (key: string) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
    setLimit(PAGE);
  };
  const clear = () => {
    setQ("");
    setSem("");
    setDept("");
    setLimit(PAGE);
  };
  const exportCsv = () => {
    const blob = new Blob([toCsv(cols, result)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `algorythm-${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto max-w-[96rem] px-3 pb-24 pt-5 sm:px-6">
      {/* header */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-dashed border-line pb-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">[Admin]</p>
          <h1 className="mt-1 font-sans text-2xl font-bold sm:text-3xl">Registrations</h1>
          <p className="mt-1 text-sm text-white/60">
            {rows.length} people{fetchedAt && <> · Updated {fmtTime(fetchedAt)}</>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={refresh} disabled={pending} className={btn}>
            {pending ? "Refreshing…" : "Refresh"}
          </button>
          <button type="button" onClick={exportCsv} disabled={!result.length} className={btn}>
            Export CSV
          </button>
          <form action={logout}>
            <button type="submit" className={btn}>Sign out</button>
          </form>
        </div>
      </header>

      {error && (
        <p role="alert" className="mt-4 border border-dashed border-orange/60 px-4 py-3 text-sm font-medium text-orange">
          {error}
        </p>
      )}

      {/* event tabs */}
      <div role="tablist" aria-label="Events" className="mt-4 flex overflow-x-auto border-b border-dashed border-line">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => {
              setTab(t.key);
              setLimit(PAGE);
            }}
            className={cn(
              "-mb-px min-h-11 shrink-0 whitespace-nowrap border-b-2 px-4 text-sm font-medium transition-colors",
              tab === t.key ? "border-orange text-white" : "border-transparent text-white/60 hover:text-white",
            )}
          >
            {t.label} <span className="ml-1 tabular-nums text-white/50">{t.count}</span>
          </button>
        ))}
      </div>

      {/* toolbar */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setLimit(PAGE);
          }}
          placeholder="Search name, college, phone…"
          aria-label="Search"
          className={cn(input, "col-span-2 sm:w-72")}
        />
        <select
          value={sem}
          onChange={(e) => {
            setSem(e.target.value);
            setLimit(PAGE);
          }}
          aria-label="Filter by semester"
          className={input}
        >
          <option value="">All semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={String(n)}>Semester {n}</option>
          ))}
        </select>
        <select
          value={dept}
          onChange={(e) => {
            setDept(e.target.value);
            setLimit(PAGE);
          }}
          aria-label="Filter by department"
          className={input}
        >
          <option value="">All departments</option>
          {depts.map(([k, label]) => (
            <option key={k} value={k}>{label}</option>
          ))}
        </select>
        {filtered && (
          <button type="button" onClick={clear} className={cn(btn, "col-span-2 sm:col-span-1")}>
            Clear filters
          </button>
        )}
      </div>

      <p aria-live="polite" className="mt-3 text-sm text-white/60">
        Showing {result.length} of {tab === "all" ? rows.length : tabs.find((t) => t.key === tab)?.count}
      </p>

      {/* empty states */}
      {result.length === 0 && (
        <p className="mt-4 border-y border-dashed border-line py-10 text-center text-sm text-white/60">
          {rows.length === 0 ? "No registrations yet." : "No matches. Try clearing the filters."}
        </p>
      )}

      {/* table (md and up) */}
      {result.length > 0 && (
        <div role="tabpanel" className="mt-3 hidden overflow-x-auto border-y border-dashed border-line md:block">
          <table className="w-full min-w-max text-left text-sm">
            <thead>
              <tr className="border-b border-dashed border-line">
                {cols.map((c, i) => (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={sortCol?.key === c.key ? (dir === 1 ? "ascending" : "descending") : "none"}
                    className={cn("whitespace-nowrap px-4 font-normal", i === 0 && "sticky left-0 z-10 bg-background")}
                  >
                    <button
                      type="button"
                      onClick={() => onSort(c.key)}
                      className="inline-flex min-h-11 items-center gap-1.5 text-xs uppercase tracking-wide text-muted transition-colors hover:text-white"
                    >
                      {c.label}
                      {sortCol?.key === c.key && <span aria-hidden>{dir === 1 ? "↑" : "↓"}</span>}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setOpenId(r.id)}
                  className="group cursor-pointer border-b border-dashed border-line last:border-b-0 hover:bg-white/[0.03]"
                >
                  {cols.map((c, i) => {
                    const v = c.text(r);
                    return (
                      <td
                        key={c.key}
                        className={cn(
                          "px-4 py-3 align-top",
                          c.wrap ? "min-w-[12rem] max-w-[18rem]" : "whitespace-nowrap",
                          i === 0 ? "sticky left-0 bg-background font-bold group-hover:bg-[#0d0d0d]" : "text-white/80",
                        )}
                      >
                        {i === 0 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenId(r.id);
                            }}
                            className="text-left font-bold transition-colors hover:text-orange"
                          >
                            {v}
                          </button>
                        ) : (
                          v || <span className="text-white/30">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* cards (below md) */}
      {result.length > 0 && (
        <ul className="mt-3 divide-y divide-dashed divide-line border-y border-dashed border-line md:hidden">
          {shown.map((r) => {
            const extra = cols.slice(5, -1).map((c) => c.text(r)).filter(Boolean).slice(0, 2);
            return (
              <li key={r.id}>
                <button type="button" onClick={() => setOpenId(r.id)} className="block w-full py-4 text-left">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="truncate font-sans text-lg font-bold">{r.name}</span>
                    <span className="shrink-0 text-xs text-white/50">{fmtTime(r.createdAt)}</span>
                  </span>
                  <span className="mt-1 block truncate text-sm text-white/70">
                    {r.college} · {r.department} · Sem {r.semester}
                  </span>
                  {extra.length > 0 && <span className="mt-1 block truncate text-sm text-orange">{extra.join(" · ")}</span>}
                  <span className="mt-1 block text-sm tabular-nums text-white/60">{r.whatsapp}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {result.length > limit && (
        <button type="button" onClick={() => setLimit((l) => l + PAGE)} className={cn(btn, "mt-4 w-full")}>
          Show {Math.min(PAGE, result.length - limit)} more ({result.length - limit} left)
        </button>
      )}

      <RowDrawer row={selected} onClose={() => setOpenId(null)} />
    </main>
  );
}