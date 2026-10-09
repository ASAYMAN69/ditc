import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireOrganizerApi } from "@/lib/auth";

const ACTIVE = ["pending", "confirmed", "checkedIn"] as const;

async function guard(): Promise<NextResponse | null> {
  return requireOrganizerApi();
}

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const denied = await guard();
  if (denied) return denied;
  const [fests, events, regs] = await Promise.all([
    db.fest.count({ where: { status: "published" } }),
    db.event.findMany({
      where: { status: "published" },
      select: { id: true, title: true, capacity: true, category: true, registrationDeadline: true, registrations: { where: { status: { in: [...ACTIVE] } }, select: { id: true, createdAt: true, status: true } } },
    }),
    db.registration.findMany({ select: { createdAt: true, status: true }, orderBy: { createdAt: "desc" }, take: 200 }),
  ]);
  const totalRegs = regs.length + (await db.registration.count({ skip: 200 }));
  const fillByEvent = events.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    taken: e.registrations.length,
    capacity: e.capacity,
    fill: e.capacity === 0 ? 0 : Math.round((e.registrations.length / e.capacity) * 100),
    deadline: e.registrationDeadline,
  }));
  const byDay = new Map<string, number>();
  for (const r of regs) {
    const d = r.createdAt.toISOString().slice(0, 10);
    byDay.set(d, (byDay.get(d) ?? 0) + 1);
  }
  const byCategory = new Map<string, number>();
  for (const e of events) byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.registrations.length);
  const now = Date.now();
  const attention = events
    .filter((e) => {
      const fill = e.capacity === 0 ? 0 : e.registrations.length / e.capacity;
      const urgentDeadline = e.registrationDeadline.getTime() - now < 3 * 86_400_000;
      return (urgentDeadline && fill < 0.3) || fill >= 1 || e.registrations.filter((r) => r.status === "pending").length > 5;
    })
    .map((e) => ({ id: e.id, title: e.title, taken: e.registrations.length, capacity: e.capacity }));
  const recent = await db.registration.findMany({ include: { event: { select: { title: true } } }, orderBy: { createdAt: "desc" }, take: 10 });
  return NextResponse.json({
    totals: { fests, events: events.length, registrations: totalRegs },
    fillByEvent,
    byDay: [...byDay.entries()].map(([day, count]) => ({ day, count })).slice(0, 14),
    byCategory: [...byCategory.entries()].map(([category, count]) => ({ category, count })),
    attention,
    recent: recent.map((r) => ({ id: r.id, code: r.code, name: r.fullName, email: r.email, status: r.status, event: r.event.title, at: r.createdAt })),
  });
}
