import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const fests = await db.fest.findMany({
    where: { status: "published" },
    include: { _count: { select: { events: { where: { status: "published" } } } } },
    orderBy: { startDate: "asc" },
  });
  return NextResponse.json({
    fests: fests.map((f) => ({
      id: f.id,
      title: f.title,
      slug: f.slug,
      venue: f.venue,
      startDate: f.startDate,
      endDate: f.endDate,
      eventsCount: f._count.events,
    })),
  });
}
