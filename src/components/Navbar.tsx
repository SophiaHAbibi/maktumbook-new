import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { LogIn, LayoutDashboard, Library, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { getSession } from "@/lib/backend";

const publicNav = [{ to: "/", label: "خانه" }] as const;
const privateNav = [
  { to: "/books", label: "کتاب‌های من", icon: Library },
  { to: "/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { to: "/profile", label: "پروفایل", icon: User },
] as const;

export function Navbar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const authenticated = Boolean(getSession());
  const nav = authenticated ? [...publicNav, ...privateNav] : publicNav;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <Logo size={38} />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-xl font-semibold text-primary">مکتوم‌بوک</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hidden sm:block">
              Private Digital Library
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => {
            const active = path === item.to || (item.to !== "/" && path.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <LogIn className="h-4 w-4" />
            ورود
          </Link>
          <button
            className="md:hidden rounded-lg p-2 hover:bg-secondary"
            onClick={() => setOpen((o) => !o)}
            aria-label="menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-primary"
            >
              ورود
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
