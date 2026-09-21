type LogoProps = {
  size?: number;
  className?: string;
  variant?: "primary" | "light";
};

export function Logo({ size = 40, className, variant = "primary" }: LogoProps) {
  const color = variant === "light" ? "currentColor" : "var(--color-primary)";
  const accent = variant === "light" ? "currentColor" : "var(--color-gold)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Maktumbook logo"
    >
      {/* open book spine */}
      <path
        d="M32 14 L32 54"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      {/* left page */}
      <path
        d="M8 18 Q8 14 12 14 L30 16 Q32 16.5 32 19 L32 52 Q32 54 30 53.5 L12 52 Q8 52 8 48 Z"
        fill={color}
        fillOpacity="0.06"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* right page */}
      <path
        d="M56 18 Q56 14 52 14 L34 16 Q32 16.5 32 19 L32 52 Q32 54 34 53.5 L52 52 Q56 52 56 48 Z"
        fill={color}
        fillOpacity="0.06"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* stylised M formed from page peaks */}
      <path
        d="M14 42 L14 24 L22 34 L32 22 L42 34 L50 24 L50 42"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* subtle gold serif accent under the M */}
      <circle cx="32" cy="48" r="1.6" fill={accent} />
    </svg>
  );
}
