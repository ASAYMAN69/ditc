import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/session-cookie";

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  const body = await req.json().catch(() => ({}));
  const parsed = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Email + password required." } }, { status: 400 });
  }
  const email = parsed.data.email.trim().toLowerCase();
  const user = await db.user.findUnique({ where: { email } });
  const ok = user !== null && user.passwordHash !== "" && verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    // Same message + small delay whether the email exists or not: no account enumeration.
    await new Promise((resolve) => setTimeout(resolve, 300));
    return NextResponse.json({ error: { code: "BAD_CREDENTIALS", message: "Wrong email or password." } }, { status: 401 });
  }
  const { token, user: sessionUser } = await createSession(user.id);
  const res = NextResponse.json({ ok: true, role: sessionUser.role, name: sessionUser.name });
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: SESSION_MAX_AGE_SECONDS });
  return res;
}
