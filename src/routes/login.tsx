import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { useState } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { signIn, signUp } from "@/lib/backend";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "ورود — مکتوم‌بوک" },
      { name: "description", content: "ورود به کتابخانه دیجیتال خصوصی مکتوم‌بوک." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signup, setSignup] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      if (signup) await signUp(name,email,password); else await signIn(email,password);
      navigate({ to: "/dashboard" });
    } catch (e) { setError(e instanceof Error ? e.message : "ورود انجام نشد."); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background" dir="rtl">
      {/* Visual side */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-primary">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 60% at 30% 20%, oklch(0.72 0.11 78 / 0.4) 0%, transparent 60%), radial-gradient(50% 50% at 80% 90%, oklch(0.55 0.07 150 / 0.5) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 max-w-lg px-12 text-primary-foreground">
          <Logo size={56} variant="light" className="text-primary-foreground" />
          <h2 className="mt-8 font-display text-5xl font-semibold leading-tight">
            خواندن،
            <br />
            <span className="italic text-gold">در سکوت کتابخانه‌ای شخصی.</span>
          </h2>
          <p className="mt-6 text-base leading-loose text-primary-foreground/80">
            به حساب خود وارد شوید و به کتاب‌هایی که انتشارات اختران مکتوم برای شما در نظر گرفته
            است دسترسی داشته باشید.
          </p>
          <blockquote className="mt-12 border-r-2 border-gold ps-6 italic text-primary-foreground/90">
            «کتاب، تنها دوستی است که در تنهایی به آن پناه می‌بریم.»
            <footer className="mt-2 text-sm text-primary-foreground/60">— ناشناس</footer>
          </blockquote>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            بازگشت به صفحه اصلی
          </Link>

          <div className="mt-10 flex items-center gap-3 lg:hidden">
            <Logo size={40} />
            <div>
              <div className="font-display text-xl font-semibold text-primary">مکتوم‌بوک</div>
              <div className="text-xs text-muted-foreground">کتابخانه دیجیتال خصوصی</div>
            </div>
          </div>

          <h1 className="mt-10 font-display text-4xl font-semibold text-foreground">
            {signup ? "ساخت حساب" : "خوش آمدید"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            برای ورود به کتابخانه خصوصی خود، اطلاعات حساب را وارد کنید.
          </p>

          <form onSubmit={submit} className="mt-10 space-y-5">
            {signup && <Field label="نام و نام خانوادگی" icon={<span className="text-xs">نام</span>} type="text" value={name} onChange={setName} placeholder="نام شما" />}
            <Field
              label="ایمیل"
              icon={<Mail className="h-4 w-4" />}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />
            <Field
              label="رمز عبور"
              icon={<Lock className="h-4 w-4" />}
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="rounded border-border" />
                مرا به خاطر بسپار
              </label>
              <a href="#" className="text-primary hover:underline">
                فراموشی رمز عبور؟
              </a>
            </div>

            {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            <button disabled={busy}
              type="submit"
              className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-primary/90 transition-colors"
            >
              {busy ? "کمی صبر کنید…" : signup ? "ثبت‌نام" : "ورود به کتابخانه"}
            </button>
          </form>
          <button type="button" onClick={() => {setSignup(!signup);setError("");}} className="mt-4 w-full text-sm text-primary hover:underline">
            {signup ? "حساب دارید؟ وارد شوید" : "حساب ندارید؟ ثبت‌نام کنید"}
          </button>

          <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            <p>انتشارات اختران مکتوم</p>
            <p className="mt-1 tracking-wider">Akhtaran Maktum Publishing House</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <span className="absolute inset-y-0 start-3 flex items-center text-muted-foreground">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-input bg-card ps-10 pe-3 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-colors"
        />
      </div>
    </div>
  );
}
