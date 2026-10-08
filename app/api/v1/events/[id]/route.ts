import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seatInfo } from "@/lib/events";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const e = await db.event.findUnique({
    where: { id: params.id },
    include: {
      fest: true,
      registrations: { where: { status: { in: ["pending", "confirmed", "checkedIn"] } }, select: { id: true } },
    },
  });
  if (!e) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Event not found" } }, { status: 404 });
  return NextResponse.json({ event: { ...e, seats: seatInfo(e.registrations.length, e.capacity, e.registrationDeadline, e.status) } });
}
