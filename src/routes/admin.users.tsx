import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import type { User } from "@/lib/mock-data";
import { listUsers } from "@/lib/backend";
import { Eye, Pencil, KeyRound, Search, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "کاربران — پنل مدیریت" }] }),
  component: AdminUsers,
});

function AdminUsers() {
  const [q, setQ] = useState("");
  const [users,setUsers]=useState<User[]>([]);
  useEffect(()=>{listUsers().then(setUsers).catch(()=>setUsers([]));},[]);
  const rows = useMemo(
    () =>
      users.filter(
        (u) => !q || u.name.includes(q) || u.email.toLowerCase().includes(q.toLowerCase())
      ),
    [q,users]
  );

  return (
    <AdminShell>
      <div className="p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">مدیریت</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">کاربران</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute inset-y-0 start-3 my-auto h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="جستجوی کاربر..."
                className="w-72 rounded-lg border border-input bg-card ps-10 pe-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              کاربر جدید
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr className="text-start">
                <Th>نام</Th>
                <Th>ایمیل</Th>
                <Th>کتاب‌های اختصاص‌یافته</Th>
                <Th>وضعیت</Th>
                <Th className="text-end">عملیات</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/40">
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {u.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium text-foreground">{u.name}</span>
                    </div>
                  </Td>
                  <Td>{u.email}</Td>
                  <Td>{u.assignedBookIds.length.toLocaleString("fa-IR")}</Td>
                  <Td>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs ${
                        u.status === "فعال"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {u.status}
                    </span>
                  </Td>
                  <Td className="text-end">
                    <div className="inline-flex items-center gap-1">
                      <IconBtn label="مشاهده"><Eye className="h-4 w-4" /></IconBtn>
                      <IconBtn label="ویرایش"><Pencil className="h-4 w-4" /></IconBtn>
                      <Link
                        to="/admin/access"
                        className="rounded-lg p-2 text-primary hover:bg-primary/10"
                        aria-label="مدیریت دسترسی"
                      >
                        <KeyRound className="h-4 w-4" />
                      </Link>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-5 py-3 text-start font-medium ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3 text-foreground/90 ${className}`}>{children}</td>;
}
function IconBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button aria-label={label} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
      {children}
    </button>
  );
}
