import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { StatsCard } from "@/components/StatsCard";
import { mockBooks, mockUsers } from "@/lib/mock-data";
import { BookMarked, Users, KeyRound, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "پنل مدیریت — مکتوم‌بوک" }] }),
  component: AdminHome,
});

function AdminHome() {
  const totalAssignments = mockUsers.reduce((s, u) => s + u.assignedBookIds.length, 0);
  const activeUsers = mockUsers.filter((u) => u.status === "فعال").length;

  return (
    <AdminShell>
      <div className="p-8 space-y-8">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">پنل مدیریت</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-foreground">
            داشبورد مدیریت
          </h1>
          <p className="mt-2 text-muted-foreground">
            مروری کلی بر کاربران، کتاب‌ها و دسترسی‌های مکتوم‌بوک.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard label="کل کاربران" value={mockUsers.length} icon={<Users className="h-5 w-5" />} />
          <StatsCard label="کاربران فعال" value={activeUsers} icon={<TrendingUp className="h-5 w-5" />} />
          <StatsCard label="کتاب‌های موجود" value={mockBooks.length} icon={<BookMarked className="h-5 w-5" />} />
          <StatsCard
            label="دسترسی‌های اعطاشده"
            value={totalAssignments}
            icon={<KeyRound className="h-5 w-5" />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              آخرین کاربران
            </h3>
            <ul className="divide-y divide-border/60">
              {mockUsers.slice(0, 5).map((u) => (
                <li key={u.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {u.assignedBookIds.length.toLocaleString("fa-IR")} کتاب
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              کتاب‌های پرمخاطب
            </h3>
            <ul className="divide-y divide-border/60">
              {mockBooks.slice(0, 5).map((b) => {
                const count = mockUsers.filter((u) => u.assignedBookIds.includes(b.id)).length;
                return (
                  <li key={b.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{b.title}</p>
                      <p className="text-xs text-muted-foreground">{b.author}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {count.toLocaleString("fa-IR")} کاربر
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
