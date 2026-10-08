import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { seatInfo } from "@/lib/events";
import { RegForm } from "@/components/reg-form";
import { TicketCard } from "@/components/ticket-card";

export const dynamic = "force-dynamic";

export default async function EventPage({
  params,
  searchParams,
}: {
  params: { eventId: string };
  searchParams: { code?: string };
}) {
  const e = await db.event.findUnique({
    where: { id: params.eventId },
    include: {
      fest: true,
      registrations: { where: { status: { in: ["pending", "confirmed", "checkedIn"] } }, select: { id: true } },
    },
  });
  if (!e || e.status !== "published") notFound();
  const s = seatInfo(e.registrations.length, e.capacity, e.registrationDeadline, e.status);
  const reason = s.isFull ? "This event reached full capacity." : "Registration deadline passed.";

  return (
    <div className="flex flex-col gap-6">
      <a href={`/fests/${e.festId}`} className="text-sm font-medium text-zinc-500 hover:text-zinc-900">← {e.fest.title}</a>
      {searchParams.code && <TicketCard code={searchParams.code} eventTitle={e.title} venue={e.venue} startAt={e.startAt.toDateString()} />}
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="card overflow-hidden">
          {e.image !== "" && (
            <div className="relative h-48 md:h-56">
              <img src={e.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <span className="badge absolute bottom-3 left-4 bg-black/55 capitalize text-white backdrop-blur-sm">{e.category}</span>
            </div>
          )}
          <div className="p-5 pt-4 md:p-8 md:pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge bg-zinc-100 text-zinc-700 capitalize">{e.category}</span>
            <span className={`badge ${s.isOpen ? "bg-accent-100 text-accent-700" : "bg-zinc-200 text-zinc-600"}`}>
              {s.isOpen ? `Open · ${s.seatsLeft} seats left` : s.isFull ? "Full" : "Closed"}
            </span>
            <span className="badge bg-zinc-100 text-zinc-700">{e.fee === 0 ? "Free entry" : `BDT ${e.fee}`}</span>
          </div>
          <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{e.title}</h1>
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl bg-zinc-50/80 p-4 text-sm md:grid-cols-2">
            <div><dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Date & time</dt><dd className="mt-0.5 font-medium text-zinc-700">{e.startAt.toString().slice(0, 21)} → {e.endAt.toString().slice(0, 21)}</dd></div>
            <div><dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Venue</dt><dd className="mt-0.5 font-medium text-zinc-700">{e.venue}</dd></div>
            <div><dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Registration deadline</dt><dd className="mt-0.5 font-medium text-zinc-700">{e.registrationDeadline.toString().slice(0, 21)} ({s.closesIn})</dd></div>
            <div><dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Capacity</dt><dd className="mt-0.5 font-medium tabular-nums text-zinc-700">{s.taken}/{e.capacity} taken · {s.seatsLeft} left</dd></div>
          </dl>
          <p className="mt-4 leading-relaxed text-zinc-700">{e.description}</p>
          </div>
        </div>
        <RegForm eventId={e.id} closed={!s.isOpen} reason={reason} />
      </div>
    </div>
  );
}
