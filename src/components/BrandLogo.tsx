interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const ICON_SIZES = { sm: "size-6", md: "size-8", lg: "size-10" } as const;
const TEXT_SIZES = { sm: "text-base", md: "text-xl", lg: "text-2xl" } as const;

/** The Adisyon Merkezi mark: a chef's-hat glyph plus wordmark, in the brand's semantic colours. */
export default function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className={`relative shrink-0 text-primary ${ICON_SIZES[size]}`}>
        <svg viewBox="0 0 64 64" fill="none" className="size-full">
          {/* Chef hat contour */}
          <path
            d="M32 6C24.5 6 18.2 11.2 16.8 18.2C13.5 19.4 11 22.8 11 27C11 31.8 14.3 35.8 19 36.8V48C19 50.2 20.8 52 23 52H41C43.2 52 45 50.2 45 48V36.8C49.7 35.8 53 31.8 53 27C53 22.8 50.5 19.4 47.2 18.2C45.8 11.2 39.5 6 32 6Z"
            fill="currentColor"
          />
          {/* Fork & knife cutout */}
          <path d="M26 26V38H28V33H30V38H32V26H30V30H28V26H26Z" fill="var(--primary-foreground)" />
          <path d="M36 26C34.5 26 34 27.5 34 29V38H36V26Z" fill="var(--primary-foreground)" />
        </svg>
      </div>
      <span className={`font-bold tracking-tight whitespace-nowrap text-foreground ${TEXT_SIZES[size]}`}>Adisyon Merkezi</span>
    </div>
  );
}
