import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/auth";
import { AdminCreateForms } from "@/components/admin-create-forms";

export const dynamic = "force-dynamic";

export default async function NewPage() {
  await requireOrganizer();
  const fests = await db.fest.findMany({
    where: { status: "published" },
    select: { id: true, title: true },
    orderBy: { startDate: "asc" },
  });
  return (
    <div className="flex flex-col gap-4">
      <a href="/dashboard" className="text-sm font-medium text-zinc-500 hover:text-zinc-900">← Dashboard</a>
      <AdminCreateForms fests={fests} />
    </div>
  );
}
