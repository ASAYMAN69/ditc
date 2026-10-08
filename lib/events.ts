export type SeatInfo = {
  taken: number;
  seatsLeft: number;
  isFull: boolean;
  isClosed: boolean;
  isOpen: boolean;
  closesIn: string;
};

export function seatInfo(
  taken: number,
  capacity: number,
  deadline: Date,
  status: string,
  now = new Date(),
): SeatInfo {
  const seatsLeft = Math.max(0, capacity - taken);
  const isFull = seatsLeft <= 0;
  const isClosed = deadline.getTime() < now.getTime() || status !== "published";
  const isOpen = !isFull && !isClosed;
  const ms = deadline.getTime() - now.getTime();
  const closesIn =
    ms <= 0
      ? "Closed"
      : ms < 86_400_000
        ? "Closes today"
        : ms < 3 * 86_400_000
          ? `Closes in ${Math.ceil(ms / 86_400_000)}d`
          : `${Math.ceil(ms / 86_400_000)} days left`;
  return { taken, seatsLeft, isFull, isClosed, isOpen, closesIn };
}

export function regCode(prefix: string): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${n}`;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
