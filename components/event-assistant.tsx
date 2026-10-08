"use client";

import { useState } from "react";

type Msg = { from: "you" | "ai"; text: string; links?: Array<{ id: string; title: string }> };

export function EventAssistant() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "ai", text: "Ask me anything — free events this weekend, robotics seats, deadlines…" },
  ]);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (q === "" || busy) return;
    setError("");
    setInput("");
    setMsgs((m) => [...m, { from: "you", text: q }]);
    setBusy(true);
    try {
      const res = await fetch("/api/v1/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(d?.error?.message ?? "Assistant failed.");
        return;
      }
      setMsgs((m) => [...m, { from: "ai", text: String(d.answer ?? ""), links: Array.isArray(d.links) ? d.links : [] }]);
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-zinc-700 active:scale-95"
      >
        Ask about events
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex h-[420px] w-[min(92vw,360px)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-zinc-900 px-4 py-3 text-white">
        <p className="text-sm font-bold">Event assistant</p>
        <button onClick={() => setOpen(false)} className="text-sm text-zinc-300 hover:text-white" aria-label="Close assistant">✕</button>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        {msgs.map((m, i) => (
          <div key={i} className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.from === "you" ? "ml-auto bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-800"}`}>
            <p className="whitespace-pre-wrap">{m.text}</p>
            {m.links && m.links.length > 0 && (
              <div className="mt-1.5 flex flex-col gap-1">
                {m.links.map((l) => (
                  <a key={l.id} href={`/events/${l.id}`} className="font-semibold text-emerald-700 hover:underline">→ {l.title}</a>
                ))}
              </div>
            )}
          </div>
        ))}
        {busy && <p className="animate-pulse rounded-xl bg-zinc-100 px-3 py-2 text-sm text-zinc-500">Thinking…</p>}
        {error !== "" && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
      </div>
      <form onSubmit={ask} className="flex gap-2 border-t border-zinc-200 p-2.5">
        <input className="input py-2 text-sm" placeholder="e.g. free robotics events?" value={input} onChange={(e) => setInput(e.target.value)} maxLength={500} />
        <button className="btn-primary shrink-0 px-4 py-2 text-sm" disabled={busy}>Ask</button>
      </form>
    </div>
  );
}
