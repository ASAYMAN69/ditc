import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/auth";
import { ParticipantActions } from "@/components/participant-actions";

export const dynamic = "force-dynamic";

const STATUSES = ["", "pending", "confirmed", "cancelled", "rejected", "checkedIn"];

export default async function ParticipantsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { q?: string; status?: string };
}) {
  await requireOrganizer();
  const event = await db.event.findUnique({ where: { id: params.id }, include: { fest: true } });
  if (!event) notFound();
  const q = (searchParams.q ?? "").toLowerCase();
  const status = searchParams.status ?? "";
  const regs = await db.registration.findMany({
    where: { eventId: event.id, ...(status !== "" ? { status } : {}) },
    orderBy: { createdAt: "desc" },
  });
  const rows = q === "" ? regs : regs.filter((r) => `${r.fullName} ${r.email} ${r.code}`.toLowerCase().includes(q));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <a href="/dashboard" className="text-sm font-medium text-zinc-500 hover:text-zinc-900">← Dashboard</a>
          <h1 className="font-display text-3xl font-bold tracking-tight">{event.title} — participants</h1>
          <p className="text-sm text-zinc-600">{event.fest.title} · {rows.length} shown</p>
        </div>
        <a href={`/api/v1/organizer/events/${event.id}/export`} className="btn-ghost text-sm">Export CSV</a>
      </div>

      <form className="card flex flex-wrap gap-2 p-4" method="GET">
        <input name="q" className="input min-w-52 flex-1" placeholder="Search name, email, code…" defaultValue={searchParams.q ?? ""} />
        <select name="status" className="input w-auto" defaultValue={status}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === "" ? "All statuses" : s}</option>
          ))}
        </select>
        <button className="btn-primary text-sm" type="submit">Filter</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-3xl text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Registered</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-zinc-50">
                <td className="px-4 py-2.5 font-mono text-xs tabular-nums">{r.code}</td>
                <td className="px-4 py-2 font-semibold">{r.fullName}</td>
                <td className="px-4 py-2">{r.email}</td>
                <td className="px-4 py-2">{r.phone}</td>
                <td className="px-4 py-2"><span className="badge bg-zinc-100 text-zinc-700">{r.status}</span></td>
                <td className="px-4 py-2 text-zinc-500">{r.createdAt.toDateString()}</td>
                <td className="px-4 py-2"><ParticipantActions id={r.id} current={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-8 text-center font-medium">No participants match. Adjust search or filters.</p>}
      </div>
    </div>
  );
}
