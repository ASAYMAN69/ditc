import type { Metadata } from "next";
import "./globals.css";
import { getRequestUser } from "@/lib/auth";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "DRMC Tech Club — Fests & Events",
  description: "Browse fests, explore events, and register. No Google Forms needed.",
};

export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const user = await getRequestUser();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fastly.picsum.photos" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fastly.picsum.photos" />
      </head>
      <body>
        <header className="relative border-b border-zinc-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3">
            <a href="/" className="font-display shrink-0 text-lg font-bold">
              DRMC <span className="text-accent-600">Tech Club</span>
            </a>
            <SiteNav user={user ? { name: user.name, role: user.role } : null} />
          </div>
        </header>
        <main className="mx-auto min-h-[100dvh] w-full max-w-7xl px-4 py-8">{children}</main>
        <footer className="border-t border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500">
          Built for the AI Web Development Contest.
        </footer>
      </body>
    </html>
  );
}
