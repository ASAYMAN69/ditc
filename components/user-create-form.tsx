"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UserCreateForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/v1/organizer/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone"), password: fd.get("password"), role: fd.get("role") }),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d?.error?.message ?? "Could not create user.");
      return;
    }
    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card flex h-fit flex-col gap-3 p-6">
      <h2 className="font-display text-xl font-bold">Add user</h2>
      <label className="label">Name<input name="name" className="input mt-1" required minLength={2} maxLength={120} /></label>
      <label className="label">Email<input name="email" type="email" className="input mt-1" required /></label>
      <label className="label">Phone<input name="phone" className="input mt-1" required minLength={6} maxLength={30} /></label>
      <label className="label">Password (8+ chars)<input name="password" type="password" className="input mt-1" required minLength={8} maxLength={200} /></label>
      <label className="label">Role
        <select name="role" className="input mt-1" defaultValue="participant">
          <option value="participant">participant</option>
          <option value="organizer">organizer</option>
        </select>
      </label>
      {error !== "" && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
      <button className="btn-primary" disabled={busy}>{busy ? "Adding…" : "Add user"}</button>
    </form>
  );
}
