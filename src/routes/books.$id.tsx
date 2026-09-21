import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { BookCover } from "@/components/BookCover";
import { ProgressBar } from "@/components/ProgressBar";
import { getBookById, type Book } from "@/lib/mock-data";
import { BookOpen, ArrowLeft, Globe, FileText, User as UserIcon } from "lucide-react";
import { createPurchaseRequest, getSession, listBooks, telegramPurchaseUrl, userHasBook } from "@/lib/backend";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/books/$id")({
  component: BookDetails,
});

function BookDetails() {
  const { id } = useParams({ from: "/books/$id" });
  const [book,setBook]=useState<Book|undefined>(()=>getBookById(id));
  const [entitled,setEntitled]=useState(false);
  const [receipt,setReceipt]=useState("");
  const [sent,setSent]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{listBooks().then(rows=>setBook(rows.find(b=>b.id===id)||getBookById(id)));userHasBook(id).then(setEntitled).catch(()=>setEntitled(false));},[id]);

  if (!book) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-semibold text-foreground">کتاب یافت نشد</h1>
          <p className="mt-3 text-muted-foreground">این کتاب در کتابخانه شما موجود نیست.</p>
          <Link to="/books" className="mt-6 inline-flex items-center gap-2 text-primary">
            <ArrowLeft className="h-4 w-4" /> بازگشت به کتاب‌های من
          </Link>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/books"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          کتاب‌های من
        </Link>

        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <div>
            <BookCover book={book} />
            {entitled ? <Link
              to="/reader/$id"
              params={{ id: book.id }}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              {book.progress && book.progress > 0 ? "ادامه مطالعه" : "شروع مطالعه"}
            </Link> : <div className="mt-6 rounded-xl border border-border bg-card p-4"><p className="text-sm font-medium">خرید و فعال‌سازی کتاب</p><p className="mt-1 text-xs text-muted-foreground">ابتدا در تلگرام پیام بدهید و پس از پرداخت، کد یا توضیح رسید را اینجا ثبت کنید.</p><a href={telegramPurchaseUrl(book)} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-full justify-center rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">ادامه خرید در تلگرام</a><input value={receipt} onChange={e=>setReceipt(e.target.value)} placeholder="کد پیگیری یا توضیح رسید" className="mt-3 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"/><button onClick={async()=>{setError("");if(!getSession()){setError("برای ثبت درخواست ابتدا وارد شوید.");return;}try{await createPurchaseRequest(book.id,receipt);setSent(true);}catch(e){setError(e instanceof Error?e.message:"ثبت نشد");}}} className="mt-2 w-full rounded-xl border border-primary px-5 py-2 text-sm text-primary">{sent?"درخواست ثبت شد ✓":"ثبت درخواست خرید"}</button>{error&&<p className="mt-2 text-xs text-destructive">{error}</p>}</div>}
            {book.progress && book.progress > 0 && (
              <div className="mt-4 space-y-1.5">
                <ProgressBar value={book.progress} />
                <p className="text-xs text-muted-foreground">{book.progress}٪ خوانده شده</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">{book.category}</p>
            <h1 className="mt-3 font-display text-5xl font-semibold text-foreground leading-tight">
              {book.title}
            </h1>
            {book.titleEn && (
              <p className="mt-2 font-display italic text-lg text-muted-foreground">{book.titleEn}</p>
            )}

            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <MetaItem icon={<UserIcon className="h-4 w-4" />} label="نویسنده" value={book.author} />
              {book.translator && (
                <MetaItem icon={<UserIcon className="h-4 w-4" />} label="مترجم" value={book.translator} />
              )}
              <MetaItem icon={<FileText className="h-4 w-4" />} label="تعداد صفحات" value={book.pageCount.toLocaleString("fa-IR")} />
              <MetaItem icon={<Globe className="h-4 w-4" />} label="زبان" value={book.language} />
            </div>

            <div className="mt-10">
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">درباره کتاب</h2>
              <p className="leading-loose text-foreground/80 text-lg">{book.description}</p>
              <p className="mt-4 leading-loose text-muted-foreground">
                این کتاب بخشی از مجموعه انتشارات اختران مکتوم است که به‌طور خصوصی برای مطالعه در
                مکتوم‌بوک در دسترس شما قرار گرفته است.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
