interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Mark only, without the wordmark. */
  markOnly?: boolean;
}

const ICON_SIZES = { sm: "size-7", md: "size-9", lg: "size-11" } as const;
const TEXT_SIZES = { sm: "text-base", md: "text-xl", lg: "text-2xl" } as const;

/** The Adisyon Merkezi app icon: a bill (adisyon) with a confirmed-payment check, on a blue tile. Mirrors app/icon.svg. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="brand-mark-gradient" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#brand-mark-gradient)" />
      <path d="M19 12h26a2 2 0 0 1 2 2v36l-4.5-3-4.5 3-4.5-3-4.5 3-4.5-3-4.5 3V14a2 2 0 0 1 2-2Z" fill="#fff" />
      <path d="M24 22h16M24 29h16M24 36h9" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
      <circle cx="44" cy="40" r="9" fill="#22c55e" stroke="#fff" strokeWidth="2.5" />
      <path d="m40 40 3 3 5-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BrandLogo({ className = "", size = "md", markOnly = false }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <BrandMark className={`shrink-0 drop-shadow-sm ${ICON_SIZES[size]}`} />
      {!markOnly && (
        <span className={`font-bold tracking-tight whitespace-nowrap text-foreground ${TEXT_SIZES[size]}`}>
          Adisyon <span className="text-primary">Merkezi</span>
        </span>
      )}
    </div>
  );
}
