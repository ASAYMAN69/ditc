import { db } from "@/lib/db";
import { requireOrganizerApi } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
): Promise<Response> {
  const denied = await requireOrganizerApi();
  if (denied) return denied;
  const regs = await db.registration.findMany({
    where: { eventId: params.id },
    orderBy: { createdAt: "desc" },
  });
  const rows = ["code,fullName,email,phone,status,createdAt", ...regs.map((r) => [r.code, `"${r.fullName}"`, r.email, r.phone, r.status, r.createdAt.toISOString()].join(","))];
  return new Response(rows.join("\n"), {
    headers: { "Content-Type": "text/csv", "Content-Disposition": `attachment; filename="participants-${params.id}.csv"` },
  });
}
