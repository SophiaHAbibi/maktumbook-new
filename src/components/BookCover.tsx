import type { Book } from "@/lib/mock-data";

type Props = {
  book: Book;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "aspect-[2/3] text-sm",
  md: "aspect-[2/3] text-base",
  lg: "aspect-[2/3] text-lg",
};

export function BookCover({ book, className = "", size = "md" }: Props) {
  const [c1, c2] = book.coverPalette;
  return (
    <div
      className={`relative overflow-hidden rounded-lg no-select ${sizes[size]} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
        boxShadow: "var(--shadow-book)",
      }}
    >
      {book.coverUrl && <img src={book.coverUrl} alt={`جلد ${book.title}`} className="absolute inset-0 h-full w-full object-cover" draggable={false}/>}
      {/* subtle grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, #fff 0%, transparent 40%), radial-gradient(circle at 80% 90%, #fff 0%, transparent 35%)",
        }}
      />
      {/* spine highlight */}
      <div
        aria-hidden
        className="absolute inset-y-0 start-0 w-2"
        style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.35), transparent)" }}
      />
      {/* frame */}
      <div className="absolute inset-3 border border-white/15 rounded-md" />

      <div className={`relative h-full flex-col justify-between p-5 text-white ${book.coverUrl ? "hidden" : "flex"}`}>
        <div className="font-display text-[0.7em] tracking-[0.3em] text-white/60 uppercase">
          Maktumbook
        </div>
        <div className="space-y-2">
          <h3 className="font-display font-semibold leading-tight text-white" style={{ fontSize: "1.35em" }}>
            {book.title}
          </h3>
          <p className="text-[0.72em] text-white/70">{book.author}</p>
        </div>
      </div>
    </div>
  );
}
