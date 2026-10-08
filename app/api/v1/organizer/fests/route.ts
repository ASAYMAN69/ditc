import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { slugify } from "@/lib/events";
import { festSchema } from "@/lib/validations";
import { requireOrganizerApi } from "@/lib/auth";

async function guard(): Promise<NextResponse | null> {
  return requireOrganizerApi();
}

export async function POST(req: Request): Promise<NextResponse> {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  const parsed = festSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Invalid fest data." } }, { status: 400 });
  }
  const org = await db.organization.findFirst();
  if (!org) return NextResponse.json({ error: { code: "NO_ORG", message: "Seed the database first." } }, { status: 500 });
  const fest = await db.fest.create({
    data: {
      orgId: org.id,
      title: parsed.data.title,
      slug: `${slugify(parsed.data.title)}-${Date.now().toString(36)}`,
      description: parsed.data.description,
      venue: parsed.data.venue,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      status: parsed.data.status,
    },
  });
  return NextResponse.json({ id: fest.id }, { status: 201 });
}
