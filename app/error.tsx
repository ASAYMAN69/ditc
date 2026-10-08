"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="card mx-auto max-w-md p-10 text-center">
      <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-sm text-zinc-600">{error.message !== "" ? error.message : "An unexpected error occurred. Your data is safe — try again."}</p>
      <div className="mt-4 flex justify-center gap-2">
        <button className="btn-primary text-sm" onClick={reset}>Try again</button>
        <a href="/" className="btn-ghost text-sm">Back home</a>
      </div>
    </div>
  );
}
