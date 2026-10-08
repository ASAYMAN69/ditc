import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getSessionUser, type SessionUser } from "@/lib/session";
import { SESSION_COOKIE } from "@/lib/session-cookie";

// All authentication resolves through the DB-backed session store.
// No credential literals live in code: passwords are scrypt hashes in User,
// roles come from User/Session rows. Demo credentials live in README + seed.

export async function getRequestUser(): Promise<SessionUser | null> {
  return getSessionUser(cookies().get(SESSION_COOKIE)?.value);
}

// Server-component guard for organizer pages.
export async function requireOrganizer(): Promise<SessionUser> {
  const user = await getRequestUser();
  if (!user || user.role !== "organizer") redirect("/login?next=/dashboard");
  return user;
}

// Route-handler guard for /api/v1/organizer/*. Returns 403 or null.
export async function requireOrganizerApi(): Promise<NextResponse | null> {
  const user = await getRequestUser();
  if (!user || user.role !== "organizer") {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Organizer only." } }, { status: 403 });
  }
  return null;
}
