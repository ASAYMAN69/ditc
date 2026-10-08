export default function NotFound() {
  return (
    <div className="card mx-auto max-w-md p-10 text-center">
      <h1 className="font-display text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-zinc-600">This fest, event or page does not exist or is no longer published.</p>
      <a href="/" className="btn-primary mt-4 text-sm">Browse fests</a>
    </div>
  );
}
