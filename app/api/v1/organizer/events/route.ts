import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { slugify } from "@/lib/events";
import { eventSchema } from "@/lib/validations";
import { requireOrganizerApi } from "@/lib/auth";

export async function POST(req: Request): Promise<NextResponse> {
  const denied = await requireOrganizerApi();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Invalid event data." } }, { status: 400 });
  }
  const event = await db.event.create({
    data: {
      festId: parsed.data.festId,
      title: parsed.data.title,
      slug: `${slugify(parsed.data.title)}-${Date.now().toString(36)}`,
      description: parsed.data.description,
      category: parsed.data.category,
      venue: parsed.data.venue,
      startAt: new Date(parsed.data.startAt),
      endAt: new Date(parsed.data.endAt),
      registrationDeadline: new Date(parsed.data.registrationDeadline),
      capacity: parsed.data.capacity,
      fee: parsed.data.fee,
      status: parsed.data.status,
    },
  });
  return NextResponse.json({ id: event.id }, { status: 201 });
}
