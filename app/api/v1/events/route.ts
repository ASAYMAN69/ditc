import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seatInfo } from "@/lib/events";

export async function GET(req: Request): Promise<NextResponse> {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").toLowerCase();
  const category = url.searchParams.get("category") ?? "all";
  const festId = url.searchParams.get("festId") ?? "";
  const openOnly = url.searchParams.get("open") === "1";

  const events = await db.event.findMany({
    where: {
      status: "published",
      ...(festId !== "" ? { festId } : {}),
      ...(category !== "all" ? { category } : {}),
    },
    include: {
      fest: { select: { id: true, title: true } },
      registrations: { where: { status: { in: ["pending", "confirmed", "checkedIn"] } }, select: { id: true } },
    },
    orderBy: { startAt: "asc" },
  });

  const out = events
    .map((e) => ({ ...e, seats: seatInfo(e.registrations.length, e.capacity, e.registrationDeadline, e.status) }))
    .filter((e) =>
      q === "" || `${e.title} ${e.description} ${e.venue} ${e.fest.title}`.toLowerCase().includes(q),
    )
    .filter((e) => (!openOnly || e.seats.isOpen));

  return NextResponse.json({ events: out });
}
