import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/auth";
import { UserCreateForm } from "@/components/user-create-form";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireOrganizer();
  const users = await db.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="flex flex-col gap-6">
      <div>
        <a href="/dashboard" className="text-sm font-medium text-zinc-500 hover:text-zinc-900">← Dashboard</a>
        <h1 className="font-display text-3xl font-bold tracking-tight">Users & roles</h1>
        <p className="text-sm text-zinc-600">{users.length} accounts. Signups arrive as participants; create organizer accounts here for co-organizers.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <UserCreateForm />
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2 font-semibold">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">
                    <span className={`badge ${u.role === "organizer" ? "bg-accent-100 text-accent-700" : "bg-zinc-100 text-zinc-700"}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-2 text-zinc-500">{u.createdAt.toDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="p-8 text-center font-medium">No users yet.</p>}
        </div>
      </div>
    </div>
  );
}
