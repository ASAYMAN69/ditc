import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/session";
import { SESSION_COOKIE } from "@/lib/session-cookie";

export const dynamic = "force-dynamic";

export async function POST(): Promise<NextResponse> {
  await deleteSession(cookies().get(SESSION_COOKIE)?.value);
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
