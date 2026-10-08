"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["pending", "confirmed", "cancelled", "rejected", "checkedIn"];

export function ParticipantActions({ id, current }: { id: string; current: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function set(status: string) {
    setBusy(true);
    await fetch(`/api/v1/organizer/registrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    router.refresh();
  }
  return (
    <select
      className="input w-auto py-1 text-sm"
      value={current}
      disabled={busy}
      onChange={(e) => set(e.target.value)}
      aria-label="Change registration status"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
