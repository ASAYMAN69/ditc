import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getRequestUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const body = await req.json().catch(() => ({}));
  const parsed = z.object({ email: z.string().email().optional(), phone: z.string().optional() }).safeParse(body);
  const email = (parsed.success ? parsed.data.email : undefined)?.trim().toLowerCase() ?? "";
  const phone = (parsed.success ? parsed.data.phone : undefined)?.trim() ?? "";
  const reg = await db.registration.findUnique({ where: { id: params.id } });
  if (!reg) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Registration not found" } }, { status: 404 });
  const user = await getRequestUser();
  const isOrganizer = user?.role === "organizer";
  const isOwner = user !== null && (reg.userId === user.id || reg.email === user.email);
  const guestProof = !user && email !== "" && phone !== "" && reg.email === email && reg.phone === phone;
  if (!isOrganizer && !isOwner && !guestProof) {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Not allowed. Sign in as the owner, or provide the booking email and phone." } }, { status: 403 });
  }
  const updated = await db.registration.update({ where: { id: reg.id }, data: { status: "cancelled" } });
  return NextResponse.json({ id: updated.id, status: updated.status });
}
