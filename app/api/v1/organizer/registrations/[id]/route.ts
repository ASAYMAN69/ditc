import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireOrganizerApi } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const denied = await requireOrganizerApi();
  if (denied) return denied;
  const body = await req.json().catch(() => ({}));
  const parsed = z.object({ status: z.enum(["pending", "confirmed", "cancelled", "rejected", "checkedIn"]) }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Invalid status." } }, { status: 400 });
  }
  const updated = await db.registration.update({ where: { id: params.id }, data: { status: parsed.data.status } });
  return NextResponse.json({ id: updated.id, status: updated.status, code: updated.code });
}
