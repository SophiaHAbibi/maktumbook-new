import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { BookCard } from "@/components/BookCard";
import { EmptyState } from "@/components/EmptyState";
import type { Book } from "@/lib/mock-data";
import { myBooks } from "@/lib/backend";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

export const Route = createFileRoute("/books")({
  head: () => ({ meta: [{ title: "کتاب‌های من — مکتوم‌بوک" }] }),
  component: MyBooks,
});

function MyBooks() {
  const [books,setBooks]=useState<Book[]>([]);
  useEffect(()=>{myBooks().then(setBooks).catch(()=>setBooks([]));},[]);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim();
    if (!t) return books;
    return books.filter(
      (b) => b.title.includes(t) || b.author.includes(t) || (b.translator?.includes(t) ?? false)
    );
  }, [q, books]);

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-border/60 pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">کتابخانه شخصی</p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-foreground">
              کتاب‌های من
            </h1>
            <p className="mt-2 text-muted-foreground">
              {books.length.toLocaleString("fa-IR")} کتاب به حساب شما اختصاص یافته است.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute inset-y-0 start-3 my-auto h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جستجو در کتاب‌های شما..."
              className="w-full rounded-xl border border-input bg-card ps-10 pe-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary"
            />
          </div>
        </div>

        <div className="mt-10">
          {books.length === 0 ? (
            <EmptyState
              title="کتابخانه شما خالی است"
              description="هنوز کتابی به حساب شما اختصاص داده نشده است."
            />
          ) : filtered.length === 0 ? (
            <EmptyState description="نتیجه‌ای برای جستجوی شما پیدا نشد." />
          ) : (
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((b) => (
                <BookCard key={b.id} book={b} showContinue={!!(b.progress && b.progress > 0)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
