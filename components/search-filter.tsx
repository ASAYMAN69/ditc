"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { BoltIcon, BookIcon, BotIcon, ChatIcon, GamepadIcon, LayersIcon, SearchIcon, TrophyIcon, UsersIcon, XIcon } from "@/components/icons";

const CATS = [
  { key: "all", label: "All", Icon: LayersIcon },
  { key: "contest", label: "Contests", Icon: TrophyIcon },
  { key: "hackathon", label: "Hackathons", Icon: BoltIcon },
  { key: "workshop", label: "Workshops", Icon: BookIcon },
  { key: "robotics", label: "Robotics", Icon: BotIcon },
  { key: "gaming", label: "Gaming", Icon: GamepadIcon },
  { key: "quiz", label: "Quizzes", Icon: ChatIcon },
  { key: "seminar", label: "Seminars", Icon: UsersIcon },
];

type Props = {
  counts: Record<string, number>;
  shown: number;
  total: number;
};

export function SearchFilter({ counts, shown, total }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const active = params.get("category") ?? "all";
  const openOnly = params.get("open") === "1";
  const submittedQ = params.get("q") ?? "";
  const hasFilter = submittedQ !== "" || active !== "all" || openOnly;

  function push(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v === "" || v === "all") sp.delete(k);
      else sp.set(k, v);
    }
    const qs = sp.toString();
    router.push(qs === "" ? "/" : `/?${qs}`);
  }

  return (
    <div className="flex flex-col gap-3">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          push({ q });
        }}
      >
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            className="input rounded-full py-3 pl-11 pr-10 shadow-sm"
            placeholder="Search events, fests, venues…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search events"
          />
          {q !== "" && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQ("");
                push({ q: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 active:scale-95"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        <button className="btn-primary shrink-0" type="submit">Search</button>
      </form>

      <div className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max snap-x gap-2">
          {CATS.map(({ key, label, Icon }) => {
            const on = active === key;
            const n = key === "all" ? total : (counts[key] ?? 0);
            return (
              <button
                key={key}
                type="button"
                onClick={() => push({ category: key })}
                aria-pressed={on}
                className={`flex snap-start items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                  on
                    ? "bg-zinc-900 text-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.6)]"
                    : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                <span className={`rounded-full px-1.5 text-[11px] font-bold tabular-nums ${on ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"}`}>{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <p className="text-zinc-600">
          <span className="font-bold tabular-nums text-zinc-900">{shown}</span> of <span className="tabular-nums">{total}</span> events
          {submittedQ !== "" && <> for <span className="font-semibold text-zinc-900">“{submittedQ}”</span></>}
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={openOnly}
          aria-label="Only open for registration"
          onClick={() => push({ open: openOnly ? "" : "1" })}
          className="flex items-center gap-2 font-medium text-zinc-700"
        >
          <span className={`flex h-5 w-9 items-center rounded-full p-0.5 transition ${openOnly ? "justify-end bg-emerald-500" : "justify-start bg-zinc-300"}`}>
            <span className="h-4 w-4 rounded-full bg-white shadow" />
          </span>
          Open now
        </button>
        {hasFilter && (
          <button type="button" onClick={() => { setQ(""); router.push("/"); }} className="font-semibold text-emerald-700 hover:underline">
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
