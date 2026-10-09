"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type NavUser = { name: string; role: string } | null;

const LINK = "rounded-xl px-4 py-3 text-[15px] font-semibold transition active:scale-[0.98] hover:bg-zinc-100";

export function SiteNav({ user }: { user: NavUser }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function signOut() {
    await fetch("/api/v1/auth/logout", { method: "POST" }).catch(() => undefined);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const first = user?.name.split(" ")[0] ?? "";

  return (
    <>
      <nav className="hidden min-w-0 items-center gap-1 text-sm font-medium md:flex">
        <a href="/" className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 hover:bg-zinc-100">Fests</a>
        <a href="/my" className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 hover:bg-zinc-100">My registrations</a>
        {user?.role === "organizer" && (
          <a href="/dashboard" className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 hover:bg-zinc-100">Dashboard</a>
        )}
        {user ? (
          <a href="/my" className="shrink-0 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-2 text-white">Hi, {first}</a>
        ) : (
          <>
            <a href="/login" className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 hover:bg-zinc-100">Sign in</a>
            <a href="/signup" className="shrink-0 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-2 text-white">Sign up</a>
          </>
        )}
      </nav>

      <div className="md:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-zinc-100 active:scale-95"
        >
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-zinc-900 transition-all duration-200 ease-out ${open ? "top-1/2 -translate-y-1/2 rotate-45" : ""}`} />
            <span className={`absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-zinc-900 transition-all duration-200 ease-out ${open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""}`} />
          </span>
        </button>
        {open && (
          <div className="pop-in absolute inset-x-3 top-full z-40 flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl">
            <a href="/" onClick={() => setOpen(false)} className={LINK}>Fests</a>
            <a href="/my" onClick={() => setOpen(false)} className={LINK}>My registrations</a>
            {user?.role === "organizer" && (
              <a href="/dashboard" onClick={() => setOpen(false)} className={LINK}>Dashboard</a>
            )}
            {user ? (
              <>
                <a href="/my" onClick={() => setOpen(false)} className={`${LINK} bg-zinc-900 text-white`}>Hi, {first}</a>
                <button onClick={signOut} className={`${LINK} text-left text-zinc-600`}>Sign out</button>
              </>
            ) : (
              <>
                <a href="/login" onClick={() => setOpen(false)} className={LINK}>Sign in</a>
                <a href="/signup" onClick={() => setOpen(false)} className={`${LINK} bg-zinc-900 text-white`}>Create account</a>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
