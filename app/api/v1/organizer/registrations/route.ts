import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireOrganizerApi } from "@/lib/auth";

async function guard(): Promise<NextResponse | null> {
  return requireOrganizerApi();
}

export async function GET(req: Request): Promise<NextResponse> {
  const denied = await guard();
  if (denied) return denied;
  const url = new URL(req.url);
  const eventId = url.searchParams.get("eventId") ?? "";
  const q = (url.searchParams.get("q") ?? "").toLowerCase();
  const status = url.searchParams.get("status") ?? "";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
  const limit = 20;

  const all = await db.registration.findMany({
    where: {
      ...(eventId !== "" ? { eventId } : {}),
      ...(status !== "" ? { status: status as never } : {}),
    },
    include: { event: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });
  const filtered = q === "" ? all : all.filter((r) => `${r.fullName} ${r.email} ${r.code}`.toLowerCase().includes(q));
  return NextResponse.json({
    data: filtered.slice((page - 1) * limit, page * limit),
    page,
    totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
    total: filtered.length,
  });
}
