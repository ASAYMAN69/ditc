import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrganizerApi } from "@/lib/auth";
import { AiUnavailable, complete } from "@/lib/ai";

const input = z.object({
  title: z.string().min(3).max(140),
  category: z.string().min(2).max(40),
  venue: z.string().max(200).default(""),
  bullets: z.string().max(1000).default(""),
});

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  const denied = await requireOrganizerApi();
  if (denied) return denied;
  const parsed = input.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Title, category, venue and notes required." } }, { status: 400 });
  }
  const { title, category, venue, bullets } = parsed.data;
  const prompt = [
    "Write a 2-4 sentence event description for a student tech club website, plus 3 short tags on the last line as Tags: a, b, c.",
    `Title: ${title}`, `Category: ${category}`, `Venue: ${venue === "" ? "TBA" : venue}`,
    `Notes: ${bullets === "" ? "none" : bullets}`,
    "Tone: energetic, concrete, no clichés (no seamless, unleash, next-gen).",
  ].join("\n");
  try {
    const { text, via } = await complete(prompt);
    return NextResponse.json({ description: text, via });
  } catch (e) {
    if (e instanceof AiUnavailable) {
      return NextResponse.json({ error: { code: "AI_OFF", message: "AI is off in this demo (no provider key). Write the description manually." } }, { status: 503 });
    }
    throw e;
  }
}
