export function TicketCard({ code, eventTitle, venue, startAt }: { code: string; eventTitle: string; venue: string; startAt: string }) {
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${eventTitle}\nLOCATION:${venue}\nDESCRIPTION:Registration ${code}\nEND:VEVENT\nEND:VCALENDAR`;
  const href = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  return (
    <div className="card border-accent-500 p-6">
      <p className="badge bg-accent-100 text-accent-700">Registration confirmed</p>
      <h2 className="font-display mt-2 text-2xl font-bold">Ticket {code}</h2>
      <p className="mt-1 text-sm text-zinc-600">{eventTitle} · {venue} · {startAt}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a className="btn-ghost text-sm" href={href} download={`${code}.ics`}>Add to calendar (.ics)</a>
        <a className="btn-ghost text-sm" href="/my">View my registrations</a>
      </div>
    </div>
  );
}
