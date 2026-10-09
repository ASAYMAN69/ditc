import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { regCode } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const body = await req.json().catch(() => ({}));
  const parsed = z.object({ email: z.string().email(), fullName: z.string().default("Waitlisted guest") }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Valid email required." } }, { status: 400 });
  }
  const event = await db.event.findUnique({ where: { id: params.id } });
  if (!event) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Event not found" } }, { status: 404 });
  const email = parsed.data.email.trim().toLowerCase();
  const prefix = event.title.split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 4) || "EVT";
  try {
    const reg = await db.registration.create({
      data: { code: regCode(`WL-${prefix}`), eventId: event.id, fullName: parsed.data.fullName, email, phone: "", status: "pending", extraData: JSON.stringify({ waitlisted: true }) },
    });
    return NextResponse.json({ id: reg.id, code: reg.code, status: reg.status }, { status: 201 });
  } catch {
    return NextResponse.json({ error: { code: "ALREADY_REGISTERED", message: "This email is already on the list." } }, { status: 409 });
  }
}
