import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seatInfo } from "@/lib/events";

export async function GET(
  _req: Request,
  { params }: { params: { festId: string } },
): Promise<NextResponse> {
  const fest = await db.fest.findUnique({
    where: { id: params.festId },
    include: {
      events: {
        where: { status: "published" },
        include: { registrations: { where: { status: { in: ["pending", "confirmed", "checkedIn"] } }, select: { id: true } } },
      },
    },
  });
  if (!fest) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Fest not found" } }, { status: 404 });
  return NextResponse.json({
    fest: {
      ...fest,
      events: fest.events.map((e) => ({ ...e, seats: seatInfo(e.registrations.length, e.capacity, e.registrationDeadline, e.status) })),
    },
  });
}
