import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { seatInfo } from "@/lib/events";
import { EventCard } from "@/components/event-card";

export const dynamic = "force-dynamic";

export default async function FestPage({ params }: { params: { festId: string } }) {
  const fest = await db.fest.findUnique({
    where: { id: params.festId },
    include: {
      events: {
        where: { status: "published" },
        include: { registrations: { where: { status: { in: ["pending", "confirmed", "checkedIn"] } }, select: { id: true } } },
        orderBy: { startAt: "asc" },
      },
    },
  });
  if (!fest || fest.status !== "published") notFound();

  return (
    <div className="flex flex-col gap-6">
      <a href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-900">← All fests</a>
      <div className="card p-6 md:p-8">
        <p className="badge bg-zinc-100 text-zinc-700">{fest.events.length} events</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight md:text-4xl">{fest.title}</h1>
        <p className="mt-2 max-w-[65ch] text-zinc-600">{fest.description}</p>
        <p className="mt-3 text-sm font-medium text-zinc-700">{fest.venue} · {fest.startDate.toDateString()} → {fest.endDate.toDateString()}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fest.events.length === 0 && (
          <div className="card p-10 text-center md:col-span-3">
            <p className="font-semibold">No events announced for this fest yet.</p>
            <p className="mt-1 text-sm text-zinc-600">Check back soon — organizers add events here.</p>
          </div>
        )}
        {fest.events.map((e, ei) => {
          const s = seatInfo(e.registrations.length, e.capacity, e.registrationDeadline, e.status);
          return (
            <EventCard
              key={e.id}
              index={ei}
              id={e.id}
              title={e.title}
              category={e.category}
              venue={e.venue}
              festName={fest.title}
              startAt={e.startAt}
              fee={e.fee}
              capacity={e.capacity}
              taken={s.taken}
              deadline={e.registrationDeadline}
              status={e.status}
              image={e.image}
            />
          );
        })}
      </div>
    </div>
  );
}
