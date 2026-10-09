type P = { className?: string };

function base(className?: string): string {
  return className ?? "h-4 w-4";
}

export function CalendarIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

export function PinIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function UsersIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M17.5 14.2a6.5 6.5 0 0 1 4 5.8" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TicketIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2.5 2.5 0 0 0 0 5v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2.5 2.5 0 0 0 0-5Z" />
      <path d="M14 5v2M14 11v2M14 17v2" strokeLinecap="round" strokeDasharray="1 3" />
    </svg>
  );
}

export function GridIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

export function TrophyIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H4.5a.5.5 0 0 0-.5.5C4 8 6 10 8.5 10M16 5h3.5a.5.5 0 0 1 .5.5C20 8 18 10 15.5 10M12 13v4M8.5 20h7M10 17h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BotIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <rect x="5" y="9" width="14" height="10" rx="2" />
      <path d="M12 9V5M9 5h6M9 13.5h.01M15 13.5h.01M9.5 16h5" strokeLinecap="round" />
    </svg>
  );
}

export function GamepadIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <path d="M7 8h10a5 5 0 0 1 4.9 6l-.6 2.4a2 2 0 0 1-3.5 1L16 15.5h-8l-1.8 2a2 2 0 0 1-3.5-1L2.1 14A5 5 0 0 1 7 8Z" />
      <path d="M7.5 11.5v3M6 13h3M15.5 12h.01M17.5 14h.01" strokeLinecap="round" />
    </svg>
  );
}

export function BookIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5V4.5Z" />
      <path d="M5 19.5A1.5 1.5 0 0 1 6.5 18H19" />
    </svg>
  );
}

export function BoltIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" strokeLinejoin="round" />
    </svg>
  );
}

export function ChatIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V6Z" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" strokeLinecap="round" />
    </svg>
  );
}

export function XIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export function LayersIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={base(className)} aria-hidden="true">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" strokeLinejoin="round" />
      <path d="m4.5 12.5 7.5 4.2 7.5-4.2M4.5 16.5 12 20.7l7.5-4.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
