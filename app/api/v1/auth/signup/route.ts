import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/session-cookie";
import { userSignupSchema } from "@/lib/validations";

// Public signup. Role is ALWAYS participant here: the request body has no
// role field, so privilege escalation through this endpoint is impossible.
// Organizers are created via seed or POST /api/v1/organizer/users.
export async function POST(req: Request): Promise<NextResponse> {
  const body = await req.json().catch(() => null);
  const parsed = userSignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Name, valid email, phone and 8+ char password required." } }, { status: 400 });
  }
  const email = parsed.data.email.trim().toLowerCase();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: { code: "EMAIL_TAKEN", message: "This email already has an account. Try signing in." } }, { status: 409 });
  }
  const user = await db.user.create({
    data: { name: parsed.data.name.trim(), email, phone: parsed.data.phone.trim(), passwordHash: hashPassword(parsed.data.password), role: "participant" },
  });
  const { token, user: sessionUser } = await createSession(user.id);
  const res = NextResponse.json({ ok: true, role: sessionUser.role, name: sessionUser.name }, { status: 201 });
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: SESSION_MAX_AGE_SECONDS });
  return res;
}
