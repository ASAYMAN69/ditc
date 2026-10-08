"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CancelButton({ id, email, signedIn }: { id: string; email: string; signedIn: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [needPhone, setNeedPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  async function send(guestPhone: string) {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/v1/registrations/${id}/cancel`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signedIn ? {} : { email, phone: guestPhone }),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d?.error?.message ?? "Cancel failed.");
      return;
    }
    setNeedPhone(false);
    router.refresh();
  }

  function start() {
    if (signedIn) {
      void send("");
      return;
    }
    setNeedPhone(true);
  }

  if (needPhone) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input className="input" placeholder="Booking phone to confirm" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button className="btn-primary shrink-0 text-sm" onClick={() => void send(phone)} disabled={busy || phone.trim() === ""}>
            {busy ? "…" : "Confirm cancel"}
          </button>
        </div>
        {error !== "" && <p className="text-sm font-medium text-red-700">{error}</p>}
      </div>
    );
  }
  return (
    <button className="btn-ghost text-sm" onClick={start} disabled={busy}>
      {busy ? "Cancelling…" : "Cancel"}
    </button>
  );
}
