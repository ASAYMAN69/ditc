import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: true, service: "ditc-smart-club", version: "v1" });
}
