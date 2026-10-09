// Server-only LLM access: Gemini primary, OpenRouter fallback.
// Keys never leave the server. No key configured → AiUnavailable, and routes
// answer 503 with an honest "AI is off" state instead of failing the page.

export class AiUnavailable extends Error {
  constructor(message = "AI is not configured.") {
    super(message);
    this.name = "AiUnavailable";
  }
}

const TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS ?? "45000") || 45000;
const MAX_TOKENS = Number(process.env.AI_MAX_TOKENS ?? "400") || 400;

async function postJson(url: string, headers: Record<string, string>, body: unknown): Promise<unknown> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);
    return (await res.json()) as unknown;
  } finally {
    clearTimeout(timer);
  }
}

async function viaGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY ?? "";
  if (key === "") throw new AiUnavailable("GEMINI_API_KEY is not set.");
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const data = (await postJson(
    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    { Authorization: `Bearer ${key}` },
    { model, messages: [{ role: "user", content: prompt }], max_tokens: MAX_TOKENS, temperature: 0.4 },
  )) as { choices?: Array<{ message?: { content?: unknown } }> };
  const raw = data.choices?.[0]?.message?.content;
  const text = typeof raw === "string" ? raw.trim() : "";
  if (text === "") throw new Error("Empty Gemini response.");
  return text;
}

async function viaOpenRouter(prompt: string): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY ?? "";
  if (key === "") throw new AiUnavailable("OPENROUTER_API_KEY is not set.");
  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";
  const data = (await postJson(
    "https://openrouter.ai/api/v1/chat/completions",
    { Authorization: `Bearer ${key}`, "HTTP-Referer": "https://github.com/ASAYMAN69/ditc", "X-Title": "DITC Smart Club" },
    { model, messages: [{ role: "user", content: prompt }], max_tokens: MAX_TOKENS, temperature: 0.4 },
  )) as { choices?: Array<{ message?: { content?: unknown } }> };
  const raw = data.choices?.[0]?.message?.content;
  const text = typeof raw === "string" ? raw.trim() : "";
  if (text === "") throw new Error("Empty OpenRouter response.");
  return text;
}

// Primary Gemini, fallback OpenRouter. Throws AiUnavailable when neither is
// usable — callers translate that into a 503 + friendly UI state.
export async function complete(prompt: string): Promise<{ text: string; via: string }> {
  const errors: string[] = [];
  try {
    return { text: await viaGemini(prompt), via: "gemini" };
  } catch (e) {
    errors.push(e instanceof Error ? e.message : String(e));
  }
  try {
    return { text: await viaOpenRouter(prompt), via: "openrouter" };
  } catch (e) {
    errors.push(e instanceof Error ? e.message : String(e));
  }
  if (errors.every((m) => m.includes("not set"))) throw new AiUnavailable("Set GEMINI_API_KEY or OPENROUTER_API_KEY to enable AI.");
  throw new AiUnavailable(`AI providers failed (${errors.join("; ")})`);
}
