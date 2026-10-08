import { seatInfo } from "@/lib/events";
import type { CSSProperties } from "react";
import { ArrowRightIcon, BoltIcon, BookIcon, BotIcon, CalendarIcon, ChatIcon, GamepadIcon, PinIcon, TicketIcon, TrophyIcon, UsersIcon } from "@/components/icons";

export const CATEGORY_STYLE: Record<string, { bar: string; Icon: (p: { className?: string }) => JSX.Element }> = {
  contest: { bar: "bg-emerald-400", Icon: TrophyIcon },
  hackathon: { bar: "bg-sky-400", Icon: BoltIcon },
  workshop: { bar: "bg-amber-400", Icon: BookIcon },
  robotics: { bar: "bg-rose-400", Icon: BotIcon },
  gaming: { bar: "bg-orange-400", Icon: GamepadIcon },
  quiz: { bar: "bg-teal-300", Icon: ChatIcon },
  seminar: { bar: "bg-slate-300", Icon: UsersIcon },
};

function styleFor(category: string) {
  return CATEGORY_STYLE[category] ?? { bar: "bg-zinc-300", Icon: TicketIcon };
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
      ? { text: "Full", tone: "bg-white/90 text-zinc-700" }
      : { text: "Closed", tone: "bg-rose-400 text-rose-950" };
  return (
    <a
      href={`/events/${p.id}`}
      style={{ "--rd": `${Math.min(p.index ?? 0, 8) * 60}ms` } as CSSProperties}
      className="group lift reveal relative flex min-h-[248px] flex-col justify-end overflow-hidden rounded-xl text-white shadow-[0_20px_40px_-24px_rgba(0,0,0,0.5)] hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.55)] active:translate-y-0"
    >
      {p.image !== "" ? (
        <img src={p.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]" />
      ) : (
        <div className="absolute inset-0 bg-zinc-800">
          <Icon className="absolute -bottom-6 -right-4 h-40 w-40 text-white opacity-20" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
      <span className={`absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 text-[11px] font-bold shadow-sm ${pill.tone}`}>{pill.text}</span>
      <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
        <Icon className="h-3.5 w-3.5" />{p.category}
      </span>
      <div className="relative flex flex-col gap-1.5 p-4">
        <h3 className="font-display truncate text-lg font-bold leading-snug drop-shadow" title={p.title}>{p.title}</h3>
        <div className="flex flex-col gap-1 text-xs text-zinc-200">
          <span className="flex items-center gap-1.5 truncate">
            <CalendarIcon className="h-3.5 w-3.5 shrink-0" />{p.startAt.toDateString()} · {p.festName}
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <PinIcon className="h-3.5 w-3.5 shrink-0" />{p.venue} · {s.closesIn}
          </span>
        </div>
        <div className="mt-1 flex flex-col gap-1.5 pt-1">
          <div className="h-1 overflow-hidden rounded-full bg-white/25">
            <div className={`h-full rounded-full ${s.isOpen ? st.bar : "bg-white/50"}`} style={{ width: `${fill}%` }} />
          </div>
          <div className="flex items-center text-xs">
            <span className="flex items-center gap-1 font-bold">
              <UsersIcon className="h-3.5 w-3.5" />{s.seatsLeft}/{p.capacity} left
            </span>
            <span className="ml-2 font-semibold text-zinc-300">{p.fee === 0 ? "Free" : `BDT ${p.fee}`}</span>
            <ArrowRightIcon className="ml-auto h-4 w-4 text-white/60 transition group-hover:translate-x-0.5 group-hover:text-white" />
          </div>
        </div>
      </div>
    </a>
  );
}
