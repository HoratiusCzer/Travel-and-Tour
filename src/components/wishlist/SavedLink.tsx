"use client";

import Link from "next/link";
import { useWishlist } from "./WishlistProvider";

export function SavedLink() {
  const { items, ready } = useWishlist();
  const count = ready ? items.length : 0;

  return (
    <Link
      href="/saved"
      aria-label={`Saved trips${count ? `, ${count} saved` : ""}`}
      className="relative grid h-10 w-10 place-items-center rounded-full border border-lagoon-600/30 text-ink-800 transition hover:bg-lagoon-50 dark:border-lagoon-400/30 dark:text-lagoon-50 dark:hover:bg-lagoon-900"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" aria-hidden>
        <path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3 5.5 6.2 5.5c1.9 0 3.2 1 3.8 2.1.6-1.1 1.9-2.1 3.8-2.1 3.2 0 5 3.1 3.7 6.3C19.500 16.400 12 21 12 21z" strokeLinejoin="round" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-saffron-500 px-1 text-[11px] font-bold text-ink-950">
          {count}
        </span>
      )}
    </Link>
  );
}
