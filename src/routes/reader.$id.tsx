import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { getBookById, type Book } from "@/lib/mock-data";
import { bookPages, getSession, listBooks, userHasBook } from "@/lib/backend";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Menu,
  ArrowLeft,
  Type,
} from "lucide-react";

export const Route = createFileRoute("/reader/$id")({
  component: Reader,
});

const STORAGE_PREFIX = "maktumbook:last-page:";

function Reader() {
  const { id } = useParams({ from: "/reader/$id" });
  const [book,setBook]=useState<Book|undefined>(()=>getBookById(id));
  const [pages,setPages]=useState<string[]>([]);
  const [allowed,setAllowed]=useState<boolean|null>(null);
  useEffect(()=>{listBooks().then(rows=>setBook(rows.find(b=>b.id===id)||getBookById(id)));if(!getSession()){setAllowed(false);return;}userHasBook(id).then(ok=>{setAllowed(ok);if(ok)bookPages(id).then(setPages);}).catch(()=>setAllowed(false));},[id]);

  const total = pages.length || book?.pageCount || 1;
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [fit, setFit] = useState<"width" | "custom">("width");
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jump, setJump] = useState("");
  const [chromeVisible, setChromeVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // load last page from localStorage
  useEffect(() => {
    if (!book) return;
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + book.id);
      if (saved) {
        const n = parseInt(saved, 10);
        if (!isNaN(n) && n >= 1 && n <= total) setPage(n);
      } else if (book.progress) {
        setPage(Math.max(1, Math.round((book.progress / 100) * total)));
      }
    } catch {}
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [book, total]);

  // save last page
  useEffect(() => {
    if (!book) return;
    try {
      localStorage.setItem(STORAGE_PREFIX + book.id, String(page));
    } catch {}
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, [page, book]);

  // keyboard nav
  const next = useCallback(() => setPage((p) => Math.min(total, p + 1)), [total]);
  const prev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") prev(); // RTL: right arrow = previous
      else if (e.key === "ArrowLeft") next();
      else if (e.key === "Home") setPage(1);
      else if (e.key === "End") setPage(total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, total]);

  // block right click + drag + selection at page container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const stop = (e: Event) => e.preventDefault();
    el.addEventListener("contextmenu", stop);
    el.addEventListener("dragstart", stop);
    el.addEventListener("selectstart", stop);
    return () => {
      el.removeEventListener("contextmenu", stop);
      el.removeEventListener("dragstart", stop);
      el.removeEventListener("selectstart", stop);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const progress = useMemo(() => Math.round((page / total) * 100), [page, total]);

  if (!book || allowed===false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-foreground">{!book?"کتاب یافت نشد":"دسترسی به این کتاب فعال نیست"}</h1>
          <p className="mt-2 text-muted-foreground">{book&&"پس از تأیید پرداخت، کتاب در کتابخانه شما باز می‌شود."}</p>
          {book ? <Link to="/books/$id" params={{id:book.id}} className="mt-4 inline-block text-primary">بازگشت به کتاب</Link> : <Link to="/books" className="mt-4 inline-block text-primary">بازگشت</Link>}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-[oklch(0.2_0.025_150)] text-primary-foreground select-none"
      dir="rtl"
    >
      {/* Top bar */}
      <header
        className={`sticky top-0 z-30 border-b border-white/5 bg-[oklch(0.24_0.03_150)]/95 backdrop-blur transition-transform ${
          chromeVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/books/$id"
              params={{ id: book.id }}
              className="rounded-lg p-2 hover:bg-white/5"
              aria-label="خروج از خواندن"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold">{book.title}</p>
              <p className="truncate text-xs text-white/60">{book.author}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <ToolBtn onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)))} label="کوچک‌نمایی">
              <ZoomOut className="h-4 w-4" />
            </ToolBtn>
            <span className="w-12 text-center text-xs tabular-nums text-white/70">
              {Math.round(zoom * 100)}٪
            </span>
            <ToolBtn onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)))} label="بزرگ‌نمایی">
              <ZoomIn className="h-4 w-4" />
            </ToolBtn>
            <ToolBtn onClick={() => { setFit("width"); setZoom(1); }} label="متناسب با عرض">
              <Type className="h-4 w-4" />
            </ToolBtn>
            <div className="mx-1 h-6 w-px bg-white/10" />
            <ToolBtn onClick={toggleFullscreen} label="تمام‌صفحه">
              {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </ToolBtn>
            <ToolBtn onClick={() => setChromeVisible(false)} label="پنهان کردن نوار">
              <Menu className="h-4 w-4" />
            </ToolBtn>
          </div>
        </div>
      </header>

      {/* Reading area */}
      <div
        className="relative flex-1 flex items-center justify-center px-4 py-8 overflow-hidden"
        onClick={() => !chromeVisible && setChromeVisible(true)}
      >
        {/* prev / next click regions */}
        <button
          type="button"
          onClick={prev}
          disabled={page === 1}
          className="group absolute inset-y-0 end-0 z-10 w-1/4 flex items-center justify-end px-4 disabled:opacity-0"
          aria-label="صفحه قبل"
        >
          <span className="rounded-full bg-white/5 p-3 opacity-0 transition group-hover:opacity-100 group-hover:bg-white/10">
            <ChevronRight className="h-6 w-6" />
          </span>
        </button>
        <button
          type="button"
          onClick={next}
          disabled={page === total}
          className="group absolute inset-y-0 start-0 z-10 w-1/4 flex items-center justify-start px-4 disabled:opacity-0"
          aria-label="صفحه بعد"
        >
          <span className="rounded-full bg-white/5 p-3 opacity-0 transition group-hover:opacity-100 group-hover:bg-white/10">
            <ChevronLeft className="h-6 w-6" />
          </span>
        </button>

        {/* page */}
        <div
          ref={containerRef}
          className="no-select relative"
          style={{
            width: fit === "width" ? `min(720px, 92vw)` : undefined,
            transform: `scale(${zoom})`,
            transformOrigin: "center top",
            transition: "transform 200ms ease",
          }}
        >
          <div
            className="relative aspect-[1/1.414] rounded-md bg-[oklch(0.985_0.012_85)] text-[oklch(0.22_0.03_150)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
            style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.55)" }}
          >
            {loading ? (
              <PageSkeleton />
            ) : (
              pages.length ? <img src={pages[page-1]} alt={`صفحه ${page.toLocaleString("fa-IR")}`} draggable={false} className="absolute inset-0 h-full w-full object-contain pointer-events-none"/> : <PageContent book={book} page={page} />
            )}
            {/* Watermark */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <span
                className="font-display text-xl md:text-2xl text-primary/5 rotate-[-24deg] whitespace-nowrap tracking-widest"
                style={{ letterSpacing: "0.25em" }}
              >
                {getSession()?.user.email || "Maktumbook"} • Private Reading Access
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <footer
        className={`sticky bottom-0 z-30 border-t border-white/5 bg-[oklch(0.24_0.03_150)]/95 backdrop-blur transition-transform ${
          chromeVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              disabled={page === 1}
              className="rounded-lg bg-white/5 p-2 hover:bg-white/10 disabled:opacity-40"
              aria-label="قبل"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              disabled={page === total}
              className="rounded-lg bg-white/5 p-2 hover:bg-white/10 disabled:opacity-40"
              aria-label="بعد"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm tabular-nums text-white/80">
              صفحه <span className="font-semibold">{page.toLocaleString("fa-IR")}</span> از{" "}
              {total.toLocaleString("fa-IR")}
            </div>
          </div>

          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${progress}%`, background: "var(--color-gold)" }}
              />
            </div>
            <p className="mt-1 text-center text-[10px] tracking-wider text-white/50">
              {progress}٪ خوانده شده
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = parseInt(jump, 10);
              if (!isNaN(n) && n >= 1 && n <= total) setPage(n);
              setJump("");
            }}
            className="flex items-center gap-2"
          >
            <input
              value={jump}
              onChange={(e) => setJump(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="پرش به صفحه"
              className="w-28 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="rounded-lg bg-gold px-3 py-1.5 text-sm font-medium text-[oklch(0.2_0.025_150)] hover:opacity-90"
            >
              برو
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}

function ToolBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-lg p-2 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
    >
      {children}
    </button>
  );
}

function PageSkeleton() {
  return (
    <div className="absolute inset-0 p-12 space-y-3 animate-pulse">
      <div className="h-6 w-1/2 rounded bg-[oklch(0.9_0.02_82)]" />
      <div className="h-4 w-1/3 rounded bg-[oklch(0.92_0.018_82)]" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-3 rounded bg-[oklch(0.92_0.018_82)]" style={{ width: `${88 - (i % 4) * 6}%` }} />
        ))}
      </div>
    </div>
  );
}

// Renders faux page typography — we simulate the "page image" without ever exposing raw text.
function PageContent({ book, page }: { book: { title: string; author: string }; page: number }) {
  const chapter = Math.floor(page / 12) + 1;
  const lines = 22;
  return (
    <div className="absolute inset-0 p-10 md:p-14 flex flex-col no-select" style={{ direction: "rtl" }}>
      <div className="flex items-baseline justify-between text-xs text-muted-foreground/70">
        <span>{book.title}</span>
        <span className="tabular-nums">{page.toLocaleString("fa-IR")}</span>
      </div>
      <div className="mt-8">
        {page % 12 === 1 && (
          <>
            <p className="text-xs uppercase tracking-[0.3em] text-primary/60">فصل {chapter.toLocaleString("fa-IR")}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
              در باب اندیشیدن
            </h2>
            <div className="mt-6 h-px w-16 bg-primary/30" />
          </>
        )}
      </div>
      <div className="mt-6 flex-1 space-y-3 leading-loose text-[15px] text-foreground/90" style={{ textAlign: "justify" }}>
        {Array.from({ length: lines }).map((_, i) => (
          <FakeLine key={i} seed={page * 100 + i} />
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between text-[11px] text-muted-foreground/60">
        <span>{book.author}</span>
        <span>مکتوم‌بوک</span>
      </div>
    </div>
  );
}

const WORDS = [
  "در",
  "این",
  "کتاب",
  "نویسنده",
  "با",
  "زبانی",
  "شاعرانه",
  "به",
  "روایت",
  "زندگی",
  "می‌پردازد",
  "و",
  "خواننده",
  "را",
  "هم‌راه",
  "خود",
  "می‌کند",
  "تا",
  "لحظه‌های",
  "ناب",
  "اندیشیدن",
  "را",
  "تجربه",
  "کند",
  "چرا",
  "که",
  "ادبیات",
  "همیشه",
  "پناهگاه",
  "انسان",
  "بوده",
  "است",
];

function FakeLine({ seed }: { seed: number }) {
  // deterministic pseudo-random line width and word count
  const rand = (n: number) => Math.abs(Math.sin(seed + n)) ;
  const width = 78 + Math.floor(rand(1) * 20);
  const count = 8 + Math.floor(rand(2) * 6);
  const words = Array.from({ length: count }, (_, i) => WORDS[(seed + i) % WORDS.length]);
  return (
    <p style={{ width: `${width}%` }} className="text-foreground/85">
      {words.join(" ")}.
    </p>
  );
}
