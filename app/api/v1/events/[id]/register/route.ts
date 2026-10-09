import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { regCode } from "@/lib/events";
import { registrationSchema } from "@/lib/validations";
import { getRequestUser } from "@/lib/auth";

const ACTIVE = ["pending", "confirmed", "checkedIn"] as const;

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const body = await req.json().catch(() => null);
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Check the highlighted fields.", issues: parsed.error.flatten() } },
      { status: 400 },
    );
  }
  const event = await db.event.findUnique({
    where: { id: params.id },
    include: { registrations: { where: { status: { in: [...ACTIVE] } }, select: { id: true } } },
  });
  if (!event || event.status !== "published") {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Event not found." } }, { status: 404 });
  }
  if (event.registrationDeadline.getTime() < Date.now()) {
    return NextResponse.json({ error: { code: "REGISTRATION_CLOSED", message: "Registration deadline has passed." } }, { status: 409 });
  }
  if (event.registrations.length >= event.capacity) {
    return NextResponse.json({ error: { code: "EVENT_FULL", message: "This event is full. Join the waitlist instead." } }, { status: 409 });
  }

  const requestUser = await getRequestUser();
  const email = requestUser ? requestUser.email : parsed.data.email.trim().toLowerCase();
  const existing = await db.registration.findUnique({
    where: { eventId_email: { eventId: event.id, email } },
  });
  if (existing && existing.status !== "cancelled" && existing.status !== "rejected") {
    return NextResponse.json(
      { error: { code: "ALREADY_REGISTERED", message: `Already registered with code ${existing.code}.`, regCode: existing.code } },
      { status: 409 },
    );
  }

  const prefix = event.title.split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 4) || "EVT";
  const data = {
    code: existing ? existing.code : regCode(prefix),
    fullName: parsed.data.fullName.trim(),
    email,
    phone: parsed.data.phone.trim(),
    extraData: JSON.stringify(parsed.data.extraData ?? {}),
    status: "confirmed" as const,
    userId: requestUser ? requestUser.id : null,
  };

  const reg =
    existing
      ? await db.registration.update({ where: { id: existing.id }, data })
      : await db.registration.create({ data: { ...data, eventId: event.id } });

  return NextResponse.json({ id: reg.id, code: reg.code, status: reg.status }, { status: 201 });
}
