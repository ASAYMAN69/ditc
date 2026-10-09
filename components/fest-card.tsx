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
  eager?: boolean;
};

export function FestCard(p: Props) {
  return (
    <a
      href={`/fests/${p.id}`}
      style={{ "--rd": `${Math.min(p.index ?? 0, 8) * 60}ms` } as CSSProperties}
      className="group lift reveal relative flex min-h-[208px] flex-col justify-end overflow-hidden rounded-xl text-white shadow-[0_20px_40px_-24px_rgba(0,0,0,0.5)] hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.55)] active:translate-y-0"
    >
      {p.banner !== "" ? (
        <img src={p.banner} alt="" loading={p.eager ? "eager" : "lazy"} fetchPriority={p.eager ? "high" : "auto"} decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]" />
      ) : (
        <div className="absolute inset-0 bg-emerald-900">
          <GridIcon className="absolute -bottom-6 -right-4 h-36 w-36 text-white opacity-20" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
      <span className="absolute right-2.5 top-2.5 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-bold text-zinc-700 shadow-sm">{p.eventsCount} events</span>
      <div className="relative flex flex-col gap-1.5 p-4">
        <h3 className="font-display truncate text-lg font-bold leading-snug drop-shadow" title={p.title}>{p.title}</h3>
        <div className="flex flex-col gap-1 text-xs text-zinc-200">
          <span className="flex items-center gap-1.5 truncate">
            <CalendarIcon className="h-3.5 w-3.5 shrink-0" />{p.start.toDateString()} → {p.end.toDateString()}
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <PinIcon className="h-3.5 w-3.5 shrink-0" />{p.venue === "" ? "Venue TBA" : p.venue}
          </span>
        </div>
        <div className="flex items-center gap-2 pt-0.5 text-xs">
          {p.openNow > 0 && (
            <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[11px] font-bold text-emerald-950">{p.openNow} open now</span>
          )}
          <ArrowRightIcon className="ml-auto h-4 w-4 text-white/60 transition group-hover:translate-x-0.5 group-hover:text-white" />
        </div>
      </div>
    </a>
  );
}
