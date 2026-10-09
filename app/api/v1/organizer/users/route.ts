import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { getRequestUser, requireOrganizerApi } from "@/lib/auth";
import { organizerCreateUserSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const denied = await requireOrganizerApi();
  if (denied) return denied;
  const users = await db.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ users });
}

export async function POST(req: Request): Promise<NextResponse> {
  const denied = await requireOrganizerApi();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  const parsed = organizerCreateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Name, valid email, phone, 8+ char password and role required." } }, { status: 400 });
  }
  const email = parsed.data.email.trim().toLowerCase();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: { code: "EMAIL_TAKEN", message: "This email already has an account." } }, { status: 409 });
  }
  const actor = await getRequestUser();
  if (parsed.data.role === "organizer" && actor?.email === email) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Role change for your own account is not allowed here." } }, { status: 400 });
  }
  const user = await db.user.create({
    data: { name: parsed.data.name.trim(), email, phone: parsed.data.phone.trim(), passwordHash: hashPassword(parsed.data.password), role: parsed.data.role },
  });
  return NextResponse.json({ id: user.id, email: user.email, role: user.role }, { status: 201 });
}
