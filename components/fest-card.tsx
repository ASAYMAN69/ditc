import { ArrowRightIcon, CalendarIcon, GridIcon, PinIcon } from "@/components/icons";
import type { CSSProperties } from "react";

type Props = {
  id: string;
  title: string;
  venue: string;
  start: Date;
  end: Date;
  eventsCount: number;
  openNow: number;
  banner: string;
  index?: number;
};

export function FestCard(p: Props) {
  return (
    <a
      href={`/fests/${p.id}`}
      style={{ "--rd": `${Math.min(p.index ?? 0, 8) * 60}ms` } as CSSProperties}
      className="group lift reveal flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white hover:border-emerald-300 hover:shadow-[0_16px_32px_-20px_rgba(0,0,0,0.3)] active:translate-y-0"
    >
      <div className="relative h-24 shrink-0 overflow-hidden">
        {p.banner !== "" ? (
          <img src={p.banner} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
        ) : (
          <div className="absolute inset-0 bg-emerald-100">
            <GridIcon className="absolute -bottom-4 -right-2 h-24 w-24 text-emerald-700 opacity-25" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
        <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-bold text-zinc-700 shadow-sm">{p.eventsCount} events</span>
        <h3 className="absolute inset-x-3 bottom-2 truncate text-[15px] font-bold leading-snug text-white drop-shadow" title={p.title}>{p.title}</h3>
      </div>
      <div className="flex flex-col gap-1.5 p-3.5 pt-2.5 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5 truncate">
          <CalendarIcon className="h-3.5 w-3.5 shrink-0" />{p.start.toDateString()} → {p.end.toDateString()}
        </span>
        <span className="flex items-center gap-1.5 truncate">
          <PinIcon className="h-3.5 w-3.5 shrink-0" />{p.venue === "" ? "Venue TBA" : p.venue}
        </span>
        <div className="flex items-center gap-2 pt-0.5">
          {p.openNow > 0 && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">{p.openNow} open now</span>
          )}
          <ArrowRightIcon className="ml-auto h-4 w-4 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" />
        </div>
      </div>
    </a>
  );
}
