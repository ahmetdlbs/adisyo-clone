interface MaterialIconProps {
  name: string;
  className?: string;
}

/** Ligature-based Material Icons glyph, sized like Angular Material's `mat-icon` (24x24 box). */
export default function MaterialIcon({ name, className = "" }: MaterialIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-icons inline-block size-6 shrink-0 select-none overflow-hidden text-[24px] leading-6 ${className}`}
    >
      {name}
    </span>
  );
}
