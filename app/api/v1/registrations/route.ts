import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getRequestUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<NextResponse> {
  const user = await getRequestUser();
  const requested = (new URL(req.url).searchParams.get("email") ?? "").trim().toLowerCase();
  if (!user) {
    if (requested === "") return NextResponse.json({ registrations: [] });
  } else if (user.role !== "organizer" && requested !== "" && requested !== user.email) {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "You can only look up your own registrations." } }, { status: 403 });
  }
  const email = user && user.role !== "organizer" ? user.email : requested;
  if (email === "") return NextResponse.json({ registrations: [] });
  const regs = await db.registration.findMany({
    where: { email },
    include: { event: { include: { fest: { select: { title: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ registrations: regs });
}
