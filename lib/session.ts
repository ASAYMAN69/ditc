import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { SESSION_MAX_AGE_SECONDS } from "@/lib/session-cookie";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
};

type Cached = { user: SessionUser; expiresAtMs: number };

// In-memory access-token → user mapping (the requested cache layer).
// Read-through to the Session table so restarts/deploys keep working:
// a cold cache repopulates from the DB on first use.
const cache = new Map<string, Cached>();

function sweep(): void {
  const now = Date.now();
  for (const [token, entry] of cache) {
    if (entry.expiresAtMs <= now) cache.delete(token);
  }
}

export function newToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createSession(userId: string): Promise<{ token: string; user: SessionUser }> {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  const token = newToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  await db.session.create({ data: { token, userId, role: user.role, expiresAt } });
  const sessionUser: SessionUser = { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role };
  sweep();
  cache.set(token, { user: sessionUser, expiresAtMs: expiresAt.getTime() });
  return { token, user: sessionUser };
}

export async function getSessionUser(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  sweep();
  const hit = cache.get(token);
  if (hit) return hit.user;
  const row = await db.session.findUnique({ where: { token }, include: { user: true } });
  if (!row || row.expiresAt.getTime() <= Date.now()) {
    if (row) await db.session.delete({ where: { token } }).catch(() => undefined);
    return null;
  }
  const sessionUser: SessionUser = { id: row.user.id, email: row.user.email, name: row.user.name, phone: row.user.phone, role: row.role };
  cache.set(token, { user: sessionUser, expiresAtMs: row.expiresAt.getTime() });
  return sessionUser;
}

export async function deleteSession(token: string | undefined): Promise<void> {
  if (!token) return;
  cache.delete(token);
  await db.session.delete({ where: { token } }).catch(() => undefined);
}
