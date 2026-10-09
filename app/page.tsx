import { db } from "@/lib/db";
import { seatInfo } from "@/lib/events";
import type { CSSProperties } from "react";
import { EventAssistant } from "@/components/event-assistant";
import { EventCard } from "@/components/event-card";
import { FestCard } from "@/components/fest-card";
import { SearchFilter } from "@/components/search-filter";

export const dynamic = "force-dynamic";

type SP = { q?: string; category?: string; open?: string };

export default async function Home({ searchParams }: { searchParams: SP }) {
  const q = (searchParams.q ?? "").toLowerCase();
  const category = searchParams.category ?? "all";
  const openOnly = searchParams.open === "1";

  const fests = await db.fest.findMany({
    where: { status: "published" },
    include: {
      events: {
        where: { status: "published" },
        include: { registrations: { where: { status: { in: ["pending", "confirmed", "checkedIn"] } }, select: { id: true } } },
      },
    },
    orderBy: { startDate: "asc" },
  });

  const events = await db.event.findMany({
    where: { status: "published" },
    include: {
      fest: true,
      registrations: { where: { status: { in: ["pending", "confirmed", "checkedIn"] } }, select: { id: true } },
    },
    orderBy: { startAt: "asc" },
  });

  const cards = events
    .map((e) => ({ e, s: seatInfo(e.registrations.length, e.capacity, e.registrationDeadline, e.status) }))
    .filter(({ e, s }) => {
      if (category !== "all" && e.category !== category) return false;
      if (openOnly && !s.isOpen) return false;
      if (q !== "" && !`${e.title} ${e.description} ${e.venue} ${e.fest.title}`.toLowerCase().includes(q)) return false;
      return true;
    });

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-6 md:grid-cols-[2fr_1fr] md:items-end">
        <div className="reveal">
          <h1 className="font-display mt-1 text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
            Fests & events, <span className="text-accent-600">one home.</span>
          </h1>
          <p className="mt-3 max-w-[60ch] leading-relaxed text-zinc-600">
            Browse fests from the tech club, explore events inside each fest, and register directly. No third-party forms.
          </p>
        </div>
        <div className="card reveal flex items-center gap-4 p-5" style={{ "--rd": "120ms" } as CSSProperties}>
          <p className="font-display text-4xl font-extrabold tabular-nums tracking-tight">{fests.length}</p>
          <p className="text-sm leading-snug text-zinc-600">live fests<br />{events.length} events to discover</p>
        </div>
      </section>

      <SearchFilter />

      <section>
        <h2 className="font-display mb-3 text-xl font-bold">Available fests</h2>
        {fests.length === 0 ? (
          <Empty text="No fests published yet." />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {fests.map((f, fi) => {
              const openNow = f.events.filter((e) => seatInfo(e.registrations.length, e.capacity, e.registrationDeadline, e.status).isOpen).length;
              return (
                <FestCard
                  key={f.id}
                  index={fi}
                  id={f.id}
                  title={f.title}
                  venue={f.venue}
                  start={f.startDate}
                  end={f.endDate}
                  eventsCount={f.events.length}
                  openNow={openNow}
                  banner={f.banner}
                  eager={fi === 0}
                />
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display mb-3 text-xl font-bold">Events {q !== "" ? `matching “${searchParams.q}”` : ""}</h2>
        {cards.length === 0 ? (
          <Empty text="No events match. Clear search or filters." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ e, s }, ei) => (
              <EventCard
                key={e.id}
                index={ei}
                id={e.id}
                title={e.title}
                category={e.category}
                venue={e.venue}
                festName={e.fest.title}
                startAt={e.startAt}
                fee={e.fee}
                capacity={e.capacity}
                taken={s.taken}
                deadline={e.registrationDeadline}
                status={e.status}
                image={e.image}
                eager={ei === 0}
              />
            ))}
          </div>
        )}
      </section>
      <EventAssistant />
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="card p-10 text-center">
      <p className="font-semibold">{text}</p>
      <a href="/" className="btn-ghost mt-4 text-sm">Reset filters</a>
    </div>
  );
}
