"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="card mx-auto max-w-md p-8">Loading…</div>}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("password") ?? "") !== String(fd.get("confirm") ?? "")) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone"), password: fd.get("password") }),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d?.error?.message ?? "Sign up failed.");
      return;
    }
    router.push("/my");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={submit} className="card flex flex-col gap-4 p-8">
        <h1 className="font-display text-2xl font-bold">Create account</h1>
        <p className="text-sm text-zinc-600">Participants register for events with their account. Organizer accounts are created by an organizer.</p>
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" name="name" className="input" required minLength={2} maxLength={120} placeholder="Your name" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" required placeholder="you@example.com" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" className="input" required minLength={6} maxLength={30} placeholder="01XXXXXXXXX" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password (8+ characters)</label>
          <input id="password" name="password" type="password" className="input" required minLength={8} maxLength={200} placeholder="••••••••" />
        </div>
        <div>
          <label className="label" htmlFor="confirm">Confirm password</label>
          <input id="confirm" name="confirm" type="password" className="input" required minLength={8} maxLength={200} placeholder="••••••••" />
        </div>
        {error !== "" && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
        <button className="btn-primary" disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
        <p className="text-center text-sm text-zinc-600">Have an account? <a className="font-semibold text-accent-700 hover:underline" href="/login">Sign in</a></p>
      </form>
    </div>
  );
}
