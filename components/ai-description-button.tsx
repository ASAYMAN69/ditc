"use client";

import { useState } from "react";

export function AiDescriptionButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function improve(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const get = (name: string): string => {
      const el = form.querySelector(`[name="${name}"]`);
      return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement ? el.value : "";
    };
    const title = get("title");
    if (title.trim().length < 3) {
      setError("Enter an event title first.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/v1/organizer/ai/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category: get("category"), venue: get("venue"), bullets: get("description") }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(d?.error?.message ?? "AI draft failed.");
        return;
      }
      const box = form.querySelector('[name="description"]');
      if (box instanceof HTMLTextAreaElement) {
        box.value = typeof d.description === "string" ? d.description : "";
        box.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="ml-2 inline-flex items-center gap-2">
      <button type="button" onClick={improve} disabled={busy} className="btn-ghost px-2.5 py-1 text-xs">
        {busy ? "Drafting…" : "Improve with AI"}
      </button>
      {error !== "" && <span className="text-xs font-medium text-red-700">{error}</span>}
    </span>
  );
}
