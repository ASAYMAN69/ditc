import { NextResponse } from "next/server";
import { getRequestUser } from "@/lib/auth";

export async function GET(): Promise<NextResponse> {
  const user = await getRequestUser();
  if (!user) {
    return NextResponse.json({ error: { code: "UNAUTHENTICATED", message: "Sign in first." } }, { status: 401 });
  }
  return NextResponse.json({ user });
}
