import { Link } from "@tanstack/react-router";
import { BookCover } from "./BookCover";
import { ProgressBar } from "./ProgressBar";
import type { Book } from "@/lib/mock-data";
import { BookOpen } from "lucide-react";

type Props = {
  book: Book;
  showProgress?: boolean;
  showContinue?: boolean;
};

export function BookCard({ book, showProgress = true, showContinue = false }: Props) {
  return (
    <div className="group flex flex-col gap-3">
      <Link
        to="/books/$id"
        params={{ id: book.id }}
        className="block transition-transform duration-300 group-hover:-translate-y-1"
      >
        <BookCover book={book} />
      </Link>
      <div className="space-y-1">
        <Link
          to="/books/$id"
          params={{ id: book.id }}
          className="block font-display text-lg font-semibold leading-tight text-foreground hover:text-primary transition-colors"
        >
          {book.title}
        </Link>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        {book.translator && (
          <p className="text-xs text-muted-foreground/80">ترجمه: {book.translator}</p>
        )}
      </div>
      {showProgress && typeof book.progress === "number" && book.progress > 0 && (
        <div className="space-y-1.5">
          <ProgressBar value={book.progress} />
          <p className="text-xs text-muted-foreground">{book.progress}٪ خوانده شده</p>
        </div>
      )}
      {showContinue && (
        <Link
          to="/reader/$id"
          params={{ id: book.id }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <BookOpen className="h-4 w-4" />
          ادامه مطالعه
        </Link>
      )}
    </div>
  );
}
