import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { BookCard } from "@/components/BookCard";
import { StatsCard } from "@/components/StatsCard";
import { EmptyState } from "@/components/EmptyState";
import type { Book, User } from "@/lib/mock-data";
import { BookOpen, Clock, Library, TrendingUp, ArrowLeft } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { currentProfile, myBooks } from "@/lib/backend";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "داشبورد — مکتوم‌بوک" }] }),
  component: () => <ProtectedRoute><Dashboard /></ProtectedRoute>,
});

function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    Promise.all([myBooks(), currentProfile()]).then(([assigned, profile]) => {
      setBooks(assigned);
      setUser(profile);
    }).catch(() => { setBooks([]); setUser(null); });
  }, []);
  const reading = books.filter((b) => b.progress && b.progress > 0 && b.progress < 100);
  const finished = books.filter((b) => b.progress === 100);
  const recent = [...books]
    .filter((b) => b.lastRead)
    .slice(0, 4);
  const continueBook = reading[0];

  const totalPages = books.reduce((s, b) => s + b.pageCount, 0);
  const readPages = books.reduce(
    (s, b) => s + Math.round(((b.progress ?? 0) / 100) * b.pageCount),
    0
  );

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">داشبورد</p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-foreground">
              خوش آمدید{user?.name ? `، ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="mt-2 text-muted-foreground">
              ادامه بدهید از جایی که رها کرده بودید.
            </p>
          </div>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            کتاب‌های من
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard label="کتاب‌های اختصاص‌یافته" value={books.length} icon={<Library className="h-5 w-5" />} />
          <StatsCard label="در حال مطالعه" value={reading.length} icon={<BookOpen className="h-5 w-5" />} />
          <StatsCard label="اتمام‌شده" value={finished.length} icon={<TrendingUp className="h-5 w-5" />} />
          <StatsCard
            label="صفحات خوانده‌شده"
            value={readPages.toLocaleString("fa-IR")}
            hint={`از ${totalPages.toLocaleString("fa-IR")} صفحه`}
            icon={<Clock className="h-5 w-5" />}
          />
        </div>

        {/* Continue reading */}
        {continueBook && (
          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-5">ادامه مطالعه</h2>
            <div className="grid gap-8 lg:grid-cols-2 rounded-3xl border border-border/70 bg-card p-8 md:p-10">
              <div className="max-w-[220px] mx-auto lg:mx-0">
                <BookCard book={continueBook} showProgress />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-primary">در حال مطالعه</p>
                <h3 className="font-display text-3xl font-semibold text-foreground">
                  {continueBook.title}
                </h3>
                <p className="text-sm text-muted-foreground">{continueBook.author}</p>
                <p className="leading-loose text-muted-foreground">{continueBook.description}</p>
                <div className="flex items-center gap-4">
                  <Link
                    to="/reader/$id"
                    params={{ id: continueBook.id }}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                    ادامه مطالعه از صفحه {Math.round(((continueBook.progress ?? 0) / 100) * continueBook.pageCount).toLocaleString("fa-IR")}
                  </Link>
                  <span className="text-sm text-muted-foreground">{continueBook.progress}٪</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recently read */}
        <section>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-5">
            اخیراً خوانده‌شده
          </h2>
          {recent.length === 0 ? (
            <EmptyState description="هنوز مطالعه‌ای انجام نشده است." />
          ) : (
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {recent.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          )}
        </section>

        {/* All assigned */}
        <section>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-5">
            کتاب‌های اختصاص‌یافته
          </h2>
          {books.length === 0 ? (
            <EmptyState description="هنوز کتابی به حساب شما اختصاص داده نشده است." />
          ) : (
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
              {books.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          )}
        </section>
      </div>
    </SiteShell>
  );
}
