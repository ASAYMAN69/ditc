import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { AiUnavailable, complete } from "@/lib/ai";

const input = z.object({ question: z.string().min(2).max(500) });

const LIMIT = Number(process.env.AI_ASK_PER_HOUR ?? "30") || 30;
const WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, { count: number; reset: number }>();

const answerCache = new Map<string, { text: string; at: number }>();
const CACHE_TTL = 60 * 60 * 1000;

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() ?? "local";
  return "local";
}

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  const ip = clientIp(req);
  const now = Date.now();
  const slot = hits.get(ip);
  if (!slot || slot.reset <= now) hits.set(ip, { count: 1, reset: now + WINDOW_MS });
  else {
    slot.count += 1;
    if (slot.count > LIMIT) {
      return NextResponse.json({ error: { code: "RATE_LIMITED", message: "Too many questions — try again later." } }, { status: 429 });
    }
  }
  const parsed = input.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Ask a question (2-500 characters)." } }, { status: 400 });
  }
  const question = parsed.data.question.trim();
  const key = question.toLowerCase();
  const cached = answerCache.get(key);
  if (cached && cached.at + CACHE_TTL > now) {
    return NextResponse.json({ answer: cached.text, cached: true, links: [] as Array<{ id: string; title: string }> });
  }

  const events = await db.event.findMany({
    where: { status: "published" },
    include: {
      fest: { select: { title: true } },
      registrations: { where: { status: { in: ["pending", "confirmed", "checkedIn"] } }, select: { id: true } },
    },
    orderBy: { startAt: "asc" },
  });
  const lines = events.map((e) => {
    const left = Math.max(0, e.capacity - e.registrations.length);
    const open = left > 0 && e.registrationDeadline.getTime() > now;
    return `- [${e.id}] ${e.title} (${e.category}) @ ${e.fest.title} | ${e.startAt.toDateString()} | ${e.venue} | ${e.fee === 0 ? "Free" : `BDT ${e.fee}`} | ${open ? `${left} seats left` : "not open"} | deadline ${e.registrationDeadline.toDateString()}`;
  });
  const prompt = [
    "You answer questions about a student tech club's events. Use ONLY the catalog below. Keep answers under 120 words.",
    "Refer to events by title, never by the bracketed id. If nothing matches, say so and suggest the closest alternative.",
    "Catalog:", ...lines, `Question: ${question}`,
  ].join("\n");

  try {
    const { text } = await complete(prompt);
    if (answerCache.size > 200) {
      const oldest = answerCache.keys().next();
      if (!oldest.done) answerCache.delete(oldest.value);
    }
    answerCache.set(key, { text, at: now });
    const mentioned = events
      .filter((e) => text.toLowerCase().includes(e.title.toLowerCase()))
      .slice(0, 3)
      .map((e) => ({ id: e.id, title: e.title }));
    return NextResponse.json({ answer: text, cached: false, links: mentioned });
  } catch (e) {
    if (e instanceof AiUnavailable) {
      return NextResponse.json({ error: { code: "AI_OFF", message: "The event assistant is off in this demo (no provider key). Browse the directory instead." } }, { status: 503 });
    }
    throw e;
  }
}
