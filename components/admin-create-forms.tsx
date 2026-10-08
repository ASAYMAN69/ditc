"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiDescriptionButton } from "@/components/ai-description-button";

export function AdminCreateForms({ fests }: { fests: Array<{ id: string; title: string }> }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function post(url: string, fd: FormData) {
    const obj: Record<string, string> = {};
    fd.forEach((v, k) => { obj[k] = String(v); });
    setBusy(true);
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setMsg(d?.error?.message ?? "Failed.");
        return;
      }
      setMsg("Created. Redirecting to dashboard…");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setMsg("Network error. Nothing was saved — try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form className="card flex flex-col gap-3 p-6" onSubmit={(e) => { e.preventDefault(); void post("/api/v1/organizer/fests", new FormData(e.currentTarget)); }}>
        <h2 className="font-display text-xl font-bold">New fest</h2>
        <label className="label">Title<input name="title" className="input mt-1" required minLength={3} /></label>
        <label className="label">Description<textarea name="description" className="input mt-1" rows={3} /></label>
        <label className="label">Venue<input name="venue" className="input mt-1" /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="label">Starts<input name="startDate" type="date" className="input mt-1" required /></label>
          <label className="label">Ends<input name="endDate" type="date" className="input mt-1" required /></label>
        </div>
        <button className="btn-primary" type="submit" disabled={busy}>{busy ? "Creating…" : "Create fest"}</button>
      </form>

      <form className="card flex flex-col gap-3 p-6" onSubmit={(e) => { e.preventDefault(); void post("/api/v1/organizer/events", new FormData(e.currentTarget)); }}>
        <h2 className="font-display text-xl font-bold">New event</h2>
        <label className="label">Fest
          <select name="festId" className="input mt-1" required defaultValue={fests[0]?.id ?? ""}>
            {fests.map((f) => (
              <option key={f.id} value={f.id}>{f.title}</option>
            ))}
          </select>
        </label>
        <label className="label">Title<input name="title" className="input mt-1" required minLength={3} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="label">Category
            <select name="category" className="input mt-1">
              <option value="contest">contest</option>
              <option value="hackathon">hackathon</option>
              <option value="workshop">workshop</option>
              <option value="robotics">robotics</option>
              <option value="gaming">gaming</option>
              <option value="quiz">quiz</option>
              <option value="seminar">seminar</option>
            </select>
          </label>
          <label className="label">Venue<input name="venue" className="input mt-1" /></label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="label">Starts<input name="startAt" type="datetime-local" className="input mt-1" required /></label>
          <label className="label">Ends<input name="endAt" type="datetime-local" className="input mt-1" required /></label>
        </div>
        <label className="label">Registration deadline<input name="registrationDeadline" type="datetime-local" className="input mt-1" required /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="label">Capacity<input name="capacity" type="number" min={1} defaultValue={50} className="input mt-1" required /></label>
          <label className="label">Fee (BDT)<input name="fee" type="number" min={0} defaultValue={0} className="input mt-1" /></label>
        </div>
        <label className="label">Description<AiDescriptionButton /><textarea name="description" className="input mt-1" rows={3} /></label>
        <button className="btn-primary" type="submit" disabled={busy}>{busy ? "Creating…" : "Create event"}</button>
      </form>
      {msg !== "" && <p className="md:col-span-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium">{msg}</p>}
    </div>
  );
}
