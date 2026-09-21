import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { BookCard } from "@/components/BookCard";
import { ProgressBar } from "@/components/ProgressBar";
import { currentUser, getAssignedBooks } from "@/lib/mock-data";
import { Mail, User as UserIcon, Bell, Moon, Type } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "پروفایل — مکتوم‌بوک" }] }),
  component: Profile,
});

function Profile() {
  const books = getAssignedBooks(currentUser.id);
  const initials = currentUser.name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2);

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">حساب کاربری</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-foreground">پروفایل</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* Profile card */}
          <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-[var(--shadow-soft)]">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-3xl">
                {initials}
              </div>
              <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">
                {currentUser.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{currentUser.email}</p>
              <span className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                عضو مکتوم‌بوک
              </span>
            </div>
            <div className="mt-6 space-y-3 text-sm">
              <Row icon={<UserIcon className="h-4 w-4" />} label="نام" value={currentUser.name} />
              <Row icon={<Mail className="h-4 w-4" />} label="ایمیل" value={currentUser.email} />
            </div>
          </div>

          {/* Right */}
          <div className="space-y-8">
            {/* Reading progress */}
            <section className="rounded-3xl border border-border/70 bg-card p-8">
              <h3 className="font-display text-xl font-semibold text-foreground mb-5">
                پیشرفت مطالعه
              </h3>
              <div className="space-y-4">
                {books.map((b) => (
                  <div key={b.id} className="flex items-center gap-4">
                    <div className="w-10">
                      <div
                        className="aspect-[2/3] rounded"
                        style={{
                          background: `linear-gradient(135deg, ${b.coverPalette[0]}, ${b.coverPalette[1]})`,
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{b.title}</p>
                      <div className="mt-1.5">
                        <ProgressBar value={b.progress ?? 0} />
                      </div>
                    </div>
                    <span className="w-12 text-end text-xs tabular-nums text-muted-foreground">
                      {(b.progress ?? 0)}٪
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Assigned books */}
            <section>
              <h3 className="font-display text-xl font-semibold text-foreground mb-5">
                کتاب‌های اختصاص‌یافته
              </h3>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                {books.slice(0, 4).map((b) => (
                  <BookCard key={b.id} book={b} showProgress={false} />
                ))}
              </div>
            </section>

            {/* Settings */}
            <section className="rounded-3xl border border-border/70 bg-card p-8">
              <h3 className="font-display text-xl font-semibold text-foreground mb-5">تنظیمات</h3>
              <div className="divide-y divide-border/70">
                <SettingRow icon={<Bell className="h-4 w-4" />} label="اطلاع‌رسانی کتاب جدید" />
                <SettingRow icon={<Moon className="h-4 w-4" />} label="حالت شب در خواندن" />
                <SettingRow icon={<Type className="h-4 w-4" />} label="اندازه فونت پیش‌فرض" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-t border-border/60 pt-3">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function SettingRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-between py-4">
      <span className="flex items-center gap-3 text-sm text-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </span>
      <button className="relative h-6 w-11 rounded-full bg-secondary transition-colors">
        <span className="absolute end-0.5 top-0.5 h-5 w-5 rounded-full bg-card shadow" />
      </button>
    </div>
  );
}
