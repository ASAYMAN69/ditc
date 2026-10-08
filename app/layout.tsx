import type { Metadata } from "next";
import "./globals.css";
import { getRequestUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "DRMC Tech Club — Fests & Events",
  description: "Browse fests, explore events, and register. No Google Forms needed.",
};

export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const user = await getRequestUser();
  return (
    <html lang="en">
      <body>
        <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <a href="/" className="font-display text-lg font-bold">
              DRMC <span className="text-accent-600">Tech Club</span>
            </a>
            <nav className="flex items-center gap-2 text-sm font-medium">
              <a href="/" className="rounded-lg px-3 py-1.5 hover:bg-zinc-100">Fests</a>
              <a href="/my" className="rounded-lg px-3 py-1.5 hover:bg-zinc-100">My registrations</a>
              {user?.role === "organizer" && (
                <a href="/dashboard" className="rounded-lg px-3 py-1.5 hover:bg-zinc-100">Dashboard</a>
              )}
              {user ? (
                <a href="/my" className="rounded-lg bg-zinc-900 px-3 py-1.5 text-white">Hi, {user.name.split(" ")[0]}</a>
              ) : (
                <>
                  <a href="/login" className="rounded-lg px-3 py-1.5 hover:bg-zinc-100">Sign in</a>
                  <a href="/signup" className="rounded-lg bg-zinc-900 px-3 py-1.5 text-white">Sign up</a>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto min-h-[100dvh] w-full max-w-7xl px-4 py-8">{children}</main>
        <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500">
          Built for the AI Web Development Contest — Smart Club Operations.
        </footer>
      </body>
    </html>
  );
}
