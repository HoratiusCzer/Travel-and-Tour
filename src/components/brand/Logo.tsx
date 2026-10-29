import Link from "next/link";
import { cn } from "@/lib/cn";

interface LogoProps {
  /** Size of the mark in px. */
  size?: number;
  showWordmark?: boolean;
  /** White text for dark backgrounds, regardless of theme. */
  light?: boolean;
  /** Drop the wordmark under 380px, where the navbar gets crowded. */
  collapseOnTiny?: boolean;
  className?: string;
}

/** Ridge & Reef mark (mountain, sun and wave) with the wordmark, linking home. */
export function Logo({ size = 36, showWordmark = true, light = false, collapseOnTiny = false, className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Ridge & Reef home"
      className={cn(
        "brand-logo flex w-fit items-center gap-3 whitespace-nowrap",
        light ? "text-white" : "text-ink-900 dark:text-white",
        className,
      )}
    >
      {/* The mountain follows the text color; the sun and wave stay amber in light and dark. */}
      <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" className="shrink-0">
        <circle className="brand-sun" cx="29" cy="9" r="3.6" fill="var(--color-saffron-500)" />
        <path
          d="M5 26 L14.5 12 L20.5 20 L24.5 15 L35 26"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          className="brand-wave"
          d="M5 32 q3.75 -3 7.5 0 t7.5 0 t7.5 0 t7.5 0"
          fill="none"
          stroke="var(--color-saffron-500)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      {showWordmark && (
        <span
          className={cn(
            "font-display text-xl font-semibold tracking-[-0.015em]",
            collapseOnTiny && "max-[379px]:hidden",
          )}
        >
          Ridge &amp; Reef
        </span>
      )}
    </Link>
  );
}
