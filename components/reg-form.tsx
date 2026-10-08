"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function RegForm({ eventId, closed, reason }: { eventId: string; closed: boolean; reason: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [account, setAccount] = useState({ name: "", email: "", phone: "" });
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) {
          setSignedIn(true);
          setAccount({ name: d.user.name ?? "", email: d.user.email ?? "", phone: d.user.phone ?? "" });
        }
      })
      .catch(() => undefined);
  }, []);

  if (closed) {
    return (
      <div className="card p-6">
        <p className="font-semibold">Registration unavailable</p>
        <p className="mt-1 text-sm text-zinc-600">{reason}</p>
        <Waitlist eventId={eventId} />
      </div>
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      fullName: String(fd.get("fullName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
    };
    try {
      const res = await fetch(`/api/v1/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error?.message ?? "Registration failed. Try again.");
        return;
      }
      router.push(`/events/${eventId}?code=${data.code}`);
      router.refresh();
    } catch {
      setError("Network error. Check your connection and retry — your input is preserved.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card flex flex-col gap-4 p-6">
      <h2 className="font-display text-xl font-bold">Register for this event</h2>
      {signedIn && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">Signed in — your details are filled in. Just hit submit.</p>}
      <div>
        <label className="label" htmlFor="fullName">Full name</label>
        <input id="fullName" name="fullName" className="input" required minLength={2} maxLength={120} placeholder="Your name" value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} />
      </div>
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="input" required placeholder="you@example.com" value={account.email} readOnly={signedIn} onChange={(e) => setAccount({ ...account, email: e.target.value })} />
        <p className="mt-1 text-xs text-zinc-500">{signedIn ? "Locked to your account email." : "Used to look up your registration later under My registrations."}</p>
      </div>
      <div>
        <label className="label" htmlFor="phone">Phone</label>
        <input id="phone" name="phone" className="input" required minLength={6} maxLength={30} placeholder="01XXXXXXXXX" value={account.phone} onChange={(e) => setAccount({ ...account, phone: e.target.value })} />
      </div>
      {error !== "" && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Registering…" : "Submit registration"}
      </button>
    </form>
  );
}

function Waitlist({ eventId }: { eventId: string }) {
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  async function join() {
    const res = await fetch(`/api/v1/events/${eventId}/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) setDone(true);
  }
  if (done) return <p className="mt-3 text-sm font-semibold text-accent-700">You are on the waitlist.</p>;
  return (
    <div className="mt-3 flex gap-2">
      <input className="input" placeholder="Email for waitlist" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="button" className="btn-ghost shrink-0 text-sm" onClick={join}>Join waitlist</button>
    </div>
  );
}
