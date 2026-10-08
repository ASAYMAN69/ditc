import { seatInfo } from "@/lib/events";
import type { CSSProperties } from "react";
import { ArrowRightIcon, BoltIcon, BookIcon, BotIcon, CalendarIcon, ChatIcon, GamepadIcon, PinIcon, TicketIcon, TrophyIcon, UsersIcon } from "@/components/icons";

export const CATEGORY_STYLE: Record<string, { chip: string; bar: string; Icon: (p: { className?: string }) => JSX.Element }> = {
  contest: { chip: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500", Icon: TrophyIcon },
  hackathon: { chip: "bg-sky-100 text-sky-700", bar: "bg-sky-500", Icon: BoltIcon },
  workshop: { chip: "bg-amber-100 text-amber-700", bar: "bg-amber-500", Icon: BookIcon },
  robotics: { chip: "bg-rose-100 text-rose-700", bar: "bg-rose-500", Icon: BotIcon },
  gaming: { chip: "bg-orange-100 text-orange-700", bar: "bg-orange-500", Icon: GamepadIcon },
  quiz: { chip: "bg-teal-100 text-teal-700", bar: "bg-teal-500", Icon: ChatIcon },
  seminar: { chip: "bg-slate-200 text-slate-700", bar: "bg-slate-400", Icon: UsersIcon },
};

function styleFor(category: string) {
  return CATEGORY_STYLE[category] ?? { chip: "bg-zinc-200 text-zinc-700", bar: "bg-zinc-400", Icon: TicketIcon };
}

type Props = {
  id: string;
  title: string;
  category: string;
  venue: string;
  festName: string;
  startAt: Date;
  fee: number;
  capacity: number;
  taken: number;
  deadline: Date;
  status: string;
  image: string;
  index?: number;
};

export function EventCard(p: Props) {
  const s = seatInfo(p.taken, p.capacity, p.deadline, p.status);
  const st = styleFor(p.category);
  const Icon = st.Icon;
  const fill = p.capacity === 0 ? 0 : Math.min(100, Math.round((p.taken / p.capacity) * 100));
  const urgent = s.isOpen && p.capacity > 0 && s.seatsLeft / p.capacity < 0.2;
  const pill = s.isOpen
    ? urgent
      ? { text: "Filling fast", tone: "bg-amber-400 text-amber-950" }
      : { text: "Open", tone: "bg-emerald-400 text-emerald-950" }
    : s.isFull
      ? { text: "Full", tone: "bg-zinc-100 text-zinc-600" }
      : { text: "Closed", tone: "bg-rose-400 text-rose-950" };
  return (
    <a
      href={`/events/${p.id}`}
      style={{ "--rd": `${Math.min(p.index ?? 0, 8) * 60}ms` } as CSSProperties}
      className="group lift reveal flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white hover:border-emerald-300 hover:shadow-[0_16px_32px_-20px_rgba(0,0,0,0.3)] active:translate-y-0"
    >
      <div className="relative h-28 shrink-0 overflow-hidden">
        {p.image !== "" ? (
          <img src={p.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
        ) : (
          <div className={`absolute inset-0 ${st.chip}`}>
            <Icon className="absolute -bottom-4 -right-2 h-28 w-28 opacity-25" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-bold shadow-sm ${pill.tone}`}>{pill.text}</span>
        <span className="absolute bottom-2 left-2.5 rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">{p.category}</span>
      </div>
      <div className="flex flex-col gap-2 p-3.5 pt-2.5">
        <h3 className="truncate text-[15px] font-bold leading-snug" title={p.title}>{p.title}</h3>
        <div className="flex flex-col gap-1 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5 truncate">
            <CalendarIcon className="h-3.5 w-3.5 shrink-0" />{p.startAt.toDateString()} · {p.festName}
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <PinIcon className="h-3.5 w-3.5 shrink-0" />{p.venue} · {s.closesIn}
          </span>
        </div>
        <div className="mt-auto flex flex-col gap-1.5 pt-1">
          <div className="h-1 overflow-hidden rounded-full bg-zinc-100">
            <div className={`h-full rounded-full ${s.isOpen ? st.bar : "bg-zinc-300"}`} style={{ width: `${fill}%` }} />
          </div>
          <div className="flex items-center text-xs">
            <span className="flex items-center gap-1 font-semibold text-zinc-700">
              <UsersIcon className="h-3.5 w-3.5" />{s.seatsLeft}/{p.capacity} left
            </span>
            <span className="ml-2 font-semibold text-zinc-500">{p.fee === 0 ? "Free" : `BDT ${p.fee}`}</span>
            <ArrowRightIcon className="ml-auto h-4 w-4 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" />
          </div>
        </div>
      </div>
    </a>
  );
}
