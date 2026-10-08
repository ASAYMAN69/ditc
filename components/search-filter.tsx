"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const CATS = ["all", "contest", "hackathon", "workshop", "robotics", "gaming", "quiz", "seminar"];

export function SearchFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const active = params.get("category") ?? "all";
  const openOnly = params.get("open") === "1";

  function push(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v === "" || v === "all") sp.delete(k);
      else sp.set(k, v);
    }
    router.push(`/?${sp.toString()}`);
  }

  return (
    <div className="card flex flex-col gap-4 p-5">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          push({ q });
        }}
      >
        <input
          className="input"
          placeholder="Search events, fests, venues…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn-primary shrink-0" type="submit">Search</button>
      </form>
      <div className="flex flex-wrap items-center gap-2">
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => push({ category: c })}
            className={`badge cursor-pointer border px-3 py-1 capitalize transition active:scale-95 ${
              active === c
                ? "border-accent-600 bg-accent-600 text-white shadow-[0_6px_16px_-8px_rgba(11,132,87,0.8)]"
                : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100"
            }`}
          >
            {c}
          </button>
        ))}
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={openOnly}
            onChange={(e) => push({ open: e.target.checked ? "1" : "" })}
          />
          Only open for registration
        </label>
      </div>
    </div>
  );
}
