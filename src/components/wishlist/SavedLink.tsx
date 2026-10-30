"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useWishlist } from "./WishlistProvider";

/** Header link to /saved, styled like the destination heart buttons. */
export function SavedLink() {
  const { items, ready } = useWishlist();
  const count = ready ? items.length : 0;
  const hasSaved = count > 0;

  return (
    <Link
      href="/saved"
      aria-label={`Saved trips${hasSaved ? `, ${count} saved` : ""}`}
      title="Saved trips"
      className={cn(
        "group/heart relative grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md",
        "shadow-[0_2px_10px_rgba(0,0,0,0.18)] transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        "motion-safe:hover:scale-[1.08]",
        hasSaved
          ? "border-saffron-500 bg-saffron-500/15"
          : "border-ink-900/10 bg-white/60 hover:border-saffron-400/60 dark:border-white/25 dark:bg-white/15 dark:hover:border-saffron-400/60",
      )}
    >
      <Heart
        aria-hidden
        strokeWidth={2}
        className={cn(
          "h-[18px] w-[18px] transition-colors duration-200",
          hasSaved
            ? "fill-saffron-500 stroke-saffron-500"
            : "fill-transparent stroke-ink-900 group-hover/heart:stroke-saffron-400 group-focus-visible/heart:stroke-saffron-400 dark:stroke-white dark:group-hover/heart:stroke-saffron-400 dark:group-focus-visible/heart:stroke-saffron-400",
        )}
      />
      {hasSaved && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-saffron-500 px-1 text-[11px] font-bold text-ink-950">
          {count}
        </span>
      )}
    </Link>
  );
}
