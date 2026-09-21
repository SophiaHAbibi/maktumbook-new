import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { BookCard } from "@/components/BookCard";
import { mockBooks, type Book } from "@/lib/mock-data";
import { listBooks } from "@/lib/backend";
import { useEffect, useState } from "react";
import { BookOpen, Lock, Sparkles, ArrowLeft, Feather } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مکتوم‌بوک — کتابخانه دیجیتال خصوصی انتشارات اختران مکتوم" },
      {
        name: "description",
        content:
          "پلتفرم مطالعه دیجیتال خصوصی؛ به کتاب‌های اختصاص‌یافته به حساب خود، بدون دانلود و در محیطی امن دسترسی داشته باشید.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [books,setBooks]=useState<Book[]>(mockBooks);
  useEffect(()=>{listBooks().then(setBooks).catch(()=>{});},[]);
  const featured = books.slice(0, 4);
  const latest = books.slice(3, 8);

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 80% 0%, oklch(0.4 0.06 150 / 0.12) 0%, transparent 60%), radial-gradient(50% 50% at 10% 100%, oklch(0.72 0.11 78 / 0.1) 0%, transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                کتابخانه رسمی انتشارات اختران مکتوم
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] text-foreground">
                کتابخانه‌ای{" "}
                <span className="text-primary">خصوصی</span>،
                <br /> برای خواندنی که{" "}
                <span className="italic text-primary-soft">تنها از آن شماست.</span>
              </h1>
              <p className="max-w-xl text-lg leading-loose text-muted-foreground">
                مکتوم‌بوک، فضایی امن برای مطالعه کتاب‌هایی است که مدیر انتشارات به‌طور
                پس از خرید و تأیید پرداخت در تلگرام به حساب شما اختصاص داده می‌شود. بدون دانلود، فقط خواندن امن.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-primary/90 transition-colors"
                >
                  ورود به کتابخانه
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  مشاهده کتاب‌های من
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-8 pt-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  دسترسی رمزنگاری‌شده
                </div>
                <div className="flex items-center gap-2">
                  <Feather className="h-4 w-4 text-primary" />
                  خواندنی بی‌وقفه و آرام
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  ذخیرهٔ خودکار پیشرفت
                </div>
              </div>
            </div>

            {/* Hero visual: layered book covers */}
            <div className="relative h-[440px] hidden lg:block">
              <div className="absolute right-0 top-4 w-52 rotate-[6deg]">
                <BookCard book={books[2]||mockBooks[2]} showProgress={false} />
              </div>
              <div className="absolute right-40 top-20 w-56 -rotate-3 z-10">
                <BookCard book={books[0]||mockBooks[0]} showProgress={false} />
              </div>
              <div className="absolute right-[22rem] top-8 w-48 rotate-[4deg]">
                <BookCard book={books[4]||mockBooks[4]} showProgress={false} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <SectionHeader title="کتاب‌های برگزیده" subtitle="Featured Books" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {featured.map((b) => (
            <BookCard key={b.id} book={b} showProgress={false} />
          ))}
        </div>
      </div>

      {/* Latest */}
      <SectionHeader title="تازه‌های کتابخانه" subtitle="Latest Additions" className="mt-24" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {latest.map((b) => (
            <BookCard key={b.id} book={b} showProgress={false} />
          ))}
        </div>
      </div>

      {/* About */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid gap-12 lg:grid-cols-2 items-center rounded-3xl border border-border/70 bg-card p-10 md:p-16">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">درباره ما</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-foreground leading-tight">
              مکتوم‌بوک چیست؟
            </h2>
            <p className="mt-5 leading-loose text-muted-foreground">
              مکتوم‌بوک پلتفرم رسمی و خصوصی مطالعه انتشارات اختران مکتوم است. برخلاف کتاب‌فروشی‌های
              آنلاین، در اینجا خبری از سبد خرید، قیمت یا پرداخت نیست. کاربران تنها می‌توانند
              کتاب‌هایی را بخوانند که مدیر انتشارات به حساب آن‌ها اختصاص داده است.
            </p>
            <p className="mt-4 leading-loose text-muted-foreground">
              تجربه‌ای شبیه به یک کتابخانه شخصی؛ آرام، بدون تبلیغ و متمرکز بر خواندن.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { t: "بدون دانلود", d: "کتاب‌ها فقط داخل پلتفرم قابل مطالعه‌اند." },
              { t: "پیشرفت شخصی", d: "آخرین صفحه به‌طور خودکار ذخیره می‌شود." },
              { t: "خواندن تمرکزیافته", d: "طراحی مینیمال بدون حواس‌پرتی." },
              { t: "دسترسی خصوصی", d: "فقط کتاب‌های اختصاص‌یافته به شما." },
            ].map((f) => (
              <div key={f.t} className="rounded-2xl border border-border/60 bg-parchment/60 p-5">
                <h4 className="font-display text-lg font-semibold text-primary">{f.t}</h4>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why digital */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        <SectionHeader title="چرا مطالعه دیجیتال؟" subtitle="Why Read Digitally" inline />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              t: "همیشه در دسترس",
              d: "کتاب‌های شما در هر دستگاهی، بدون نیاز به حمل نسخه فیزیکی.",
            },
            {
              t: "حفظ نسخه اصلی",
              d: "کتاب‌های نادر و کمیاب انتشارات بدون فرسودگی در اختیار شما.",
            },
            {
              t: "تجربه‌ای متمرکز",
              d: "خوانشی بدون حواس‌پرتی، در فضایی طراحی‌شده برای تأمل.",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-border/60 bg-card p-7">
              <h4 className="font-display text-xl font-semibold text-primary">{c.t}</h4>
              <p className="mt-3 leading-relaxed text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

function SectionHeader({
  title,
  subtitle,
  className = "",
  inline = false,
}: {
  title: string;
  subtitle: string;
  className?: string;
  inline?: boolean;
}) {
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className} ${inline ? "" : "mb-8"}`}>
      <div className="flex items-end justify-between border-b border-border/60 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{subtitle}</p>
          <h2 className="mt-1 font-display text-3xl font-semibold text-foreground">{title}</h2>
        </div>
      </div>
    </div>
  );
}
