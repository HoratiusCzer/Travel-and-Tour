"use client";

import { cn } from "@/lib/cn";
import { useWishlist } from "./WishlistProvider";

interface HeartButtonProps {
  itemKey: string;
  name: string;
  showLabel?: boolean;
  className?: string;
}

export function HeartButton({ itemKey, name, showLabel = false, className }: HeartButtonProps) {
  const { has, toggle } = useWishlist();
  const saved = has(itemKey);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from saved trips` : `Save ${name} to saved trips`}
      onClick={() => toggle(itemKey)}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition",
        showLabel
          ? "border border-lagoon-600/30 px-4 py-2 text-sm font-medium hover:bg-lagoon-50 dark:border-lagoon-400/30 dark:hover:bg-lagoon-900"
          : "h-10 w-10 bg-black/35 text-white backdrop-blur hover:bg-black/55",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className={cn("h-5 w-5 transition", saved ? "scale-110 fill-saffron-500 stroke-saffron-500" : "fill-none stroke-current")}
        strokeWidth="2"
        aria-hidden
      >
        <path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3 5.5 6.2 5.5c1.9 0 3.2 1 3.8 2.1.6-1.1 1.9-2.1 3.8-2.1 3.2 0 5 3.1 3.7 6.3C19.500 16.400 12 21 12 21z" strokeLinejoin="round" />
      </svg>
      {showLabel && (saved ? "Saved" : "Save trip")}
    </button>
  );
}
