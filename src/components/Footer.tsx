import { Logo } from "./Logo";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-parchment/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Logo size={36} />
              <div>
                <div className="font-display text-lg font-semibold text-primary">مکتوم‌بوک</div>
                <div className="text-xs text-muted-foreground">کتابخانه دیجیتال خصوصی</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              پلتفرم رسمی مطالعه دیجیتال انتشارات اختران مکتوم. دسترسی خصوصی، امن و بدون
              دانلود به کتاب‌های اختصاص‌یافته.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-3">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">خانه</Link></li>
              <li><Link to="/books" className="hover:text-primary transition-colors">کتاب‌های من</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">داشبورد</Link></li>
              <li><Link to="/profile" className="hover:text-primary transition-colors">پروفایل کاربری</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-3">ناشر</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              انتشارات اختران مکتوم
              <br />
              <span className="text-xs">Akhtaran Maktum Publishing House</span>
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <p>© ۱۴۰۴ مکتوم‌بوک — تمامی حقوق محفوظ است.</p>
          <p className="tracking-wider">Maktumbook • Private Reading Access</p>
        </div>
      </div>
    </footer>
  );
}
