import { db } from "@/lib/db";
import { getRequestUser } from "@/lib/auth";
import { CancelButton } from "@/components/cancel-button";

export const dynamic = "force-dynamic";

export default async function MyPage({ searchParams }: { searchParams: { email?: string } }) {
  const user = await getRequestUser();
  const email = user && user.role !== "organizer" ? user.email : (searchParams.email ?? "").trim().toLowerCase();
  const regs = email
    ? await db.registration.findMany({
        where: { email },
        include: { event: { include: { fest: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">My registrations</h1>
      {user ? (
        <p className="card w-fit px-4 py-2 text-sm">Signed in as <span className="font-semibold">{user.name}</span> · {user.email}</p>
      ) : (
        <form className="card flex gap-2 p-5" method="GET">
          <input name="email" className="input" placeholder="Enter the email you registered with" defaultValue={email} type="email" required />
          <button className="btn-primary shrink-0" type="submit">Look up</button>
        </form>
      )}
      {email !== "" && regs.length === 0 && (
        <div className="card p-10 text-center">
          <p className="font-semibold">No registrations found{user ? "" : ` for ${email}`}.</p>
          <a href="/" className="btn-ghost mt-4 text-sm">Browse events</a>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {regs.map((r) => (
          <div key={r.id} className="card flex flex-wrap items-center gap-3 p-5">
            <div className="min-w-0 flex-1">
              <p className="font-bold">{r.event.title} <span className="font-mono text-xs text-zinc-500">{r.code}</span></p>
              <p className="text-sm text-zinc-600">{r.event.fest.title} · {r.event.startAt.toDateString()} · <StatusBadge status={r.status} /></p>
            </div>
            {(r.status === "confirmed" || r.status === "pending") && (
              <CancelButton id={r.id} email={r.email} signedIn={user !== null} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "confirmed" ? "bg-accent-100 text-accent-700"
    : status === "pending" ? "bg-amber-100 text-amber-800"
    : status === "checkedIn" ? "bg-sky-100 text-sky-800"
    : "bg-zinc-200 text-zinc-600";
  return <span className={`badge ${tone}`}>{status}</span>;
}
