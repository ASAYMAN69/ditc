import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const user = await requireOrganizer();
  const [festCount, events, totalRegs, recent] = await Promise.all([
    db.fest.count({ where: { status: "published" } }),
    db.event.findMany({
      where: { status: "published" },
      include: { registrations: { where: { status: { in: ["pending", "confirmed", "checkedIn"] } }, select: { id: true, status: true } }, fest: { select: { title: true } } },
      orderBy: { startAt: "asc" },
    }),
    db.registration.count(),
    db.registration.findMany({ include: { event: { select: { title: true } } }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight">Organizer dashboard</h1>
        <div className="flex gap-2">
          <a href="/dashboard/new" className="btn-primary text-sm">+ New fest / event</a>
          <a href="/dashboard/users" className="btn-ghost text-sm">Users</a>
          <LogoutButton />
        </div>
      </div>
      <p className="-mt-3 text-sm text-zinc-500">Signed in as {user.name} · {user.email}</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Kpi label="Published fests" value={festCount} />
        <Kpi label="Published events" value={events.length} />
        <Kpi label="Total registrations" value={totalRegs} />
      </div>

      <div className="card divide-y divide-zinc-100 p-2">
        <p className="px-4 py-3 font-display text-lg font-bold">Fill rate per event</p>
        {events.length === 0 && <p className="px-4 py-6 text-center text-sm text-zinc-500">No published events yet. Create one to get started.</p>}
        {events.map((e) => {
          const fill = e.capacity === 0 ? 0 : Math.round((e.registrations.length / e.capacity) * 100);
          return (
            <div key={e.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{e.title} <span className="text-xs font-normal text-zinc-500">{e.fest.title}</span></p>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div className="h-full rounded-full bg-accent-500" style={{ width: `${Math.min(100, fill)}%` }} />
                </div>
              </div>
              <span className="font-mono text-sm">{e.registrations.length}/{e.capacity}</span>
              <a href={`/dashboard/events/${e.id}/participants`} className="btn-ghost text-sm">Participants</a>
              <a href={`/api/v1/organizer/events/${e.id}/export`} className="btn-ghost text-sm">CSV</a>
            </div>
          );
        })}
      </div>

      <div className="card p-6">
        <p className="font-display mb-3 text-lg font-bold">Recent signups</p>
        {recent.length === 0 ? (
          <p className="text-sm text-zinc-500">No registrations yet. Share an event link to get signups.</p>
        ) : (
        <ul className="flex flex-col gap-2 text-sm">
          {recent.map((r) => (
            <li key={r.id} className="flex flex-wrap gap-2">
              <span className="font-mono text-zinc-500">{r.code}</span>
              <span className="font-semibold">{r.fullName}</span>
              <span className="text-zinc-500">→ {r.event.title} · {r.status}</span>
            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-6">
      <p className="font-display text-4xl font-extrabold tabular-nums tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-zinc-600">{label}</p>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/api/v1/auth/logout" method="POST">
      <button className="btn-ghost text-sm" type="submit" formAction="/api/v1/auth/logout">Sign out</button>
    </form>
  );
}
