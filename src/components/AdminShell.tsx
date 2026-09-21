import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "./Logo";
import { LayoutDashboard, Users, BookMarked, KeyRound, ArrowLeft } from "lucide-react";
import { currentProfile } from "@/lib/backend";
import { useEffect, useState } from "react";

type NavItem = {
  to: "/admin" | "/admin/users" | "/admin/books" | "/admin/access";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const items: NavItem[] = [
  { to: "/admin", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "کاربران", icon: Users },
  { to: "/admin/books", label: "کتاب‌ها", icon: BookMarked },
  { to: "/admin/access", label: "مدیریت دسترسی", icon: KeyRound },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [authorized,setAuthorized]=useState<boolean|null>(null);
  useEffect(()=>{currentProfile().then(p=>setAuthorized(p?.role==="admin")).catch(()=>setAuthorized(false));},[]);
  if(authorized===null)return <div className="min-h-screen grid place-items-center bg-background text-muted-foreground">در حال بررسی دسترسی…</div>;
  if(!authorized)return <div className="min-h-screen grid place-items-center bg-background p-6"><div className="max-w-md text-center"><h1 className="font-display text-2xl font-semibold">دسترسی مدیریت ندارید</h1><p className="mt-2 text-muted-foreground">نقش حساب مدیر باید در جدول profiles روی admin تنظیم شود.</p><a href="/login" className="mt-5 inline-block text-primary">ورود با حساب مدیر</a></div></div>;
  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3">
            <Logo size={38} variant="light" className="text-gold" />
            <div>
              <p className="font-display text-lg font-semibold">مکتوم‌بوک</p>
              <p className="text-xs opacity-70">پنل مدیریت</p>
            </div>
          </Link>
        </div>
        <nav className="mt-4 flex-1 space-y-1 px-3">
          {items.map((it) => {
            const active = it.exact ? path === it.to : path === it.to || path.startsWith(it.to + "/");
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
                }`}
              >
                <it.icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-sidebar-foreground/70 hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            بازگشت به کتابخانه
          </Link>
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
