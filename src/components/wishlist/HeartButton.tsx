"use client";

import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { useWishlist } from "./WishlistProvider";

interface HeartButtonProps {
  itemKey: string;
  name: string;
  /** Pill with a text label (used in the destination sidebar) instead of the round icon button. */
  showLabel?: boolean;
  className?: string;
}

// Six small dots that fly outwards from the heart when a trip is saved.
const DOTS = Array.from({ length: 6 }, (_, i) => {
  const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
  return { x: Math.cos(angle) * 23, y: Math.sin(angle) * 23 };
});
const BURST_MS = 520;

export function HeartButton({ itemKey, name, showLabel = false, className }: HeartButtonProps) {
  const { has, toggle } = useWishlist();
  const saved = has(itemKey);
  const reduced = useReducedMotion();
  const icon = useAnimationControls();
  const [bursting, setBursting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function onClick(e: MouseEvent<HTMLButtonElement>) {
    // Never let a click on the heart follow the card's link.
    e.preventDefault();
    e.stopPropagation();
    const willSave = !saved;
    toggle(itemKey);
    if (reduced) return;

    if (willSave) {
      setBursting(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setBursting(false), BURST_MS);
      await icon.start({ scale: 1.3, transition: { type: "spring", stiffness: 700, damping: 14 } });
      icon.start({ scale: 1, transition: { type: "spring", stiffness: 420, damping: 12 } });
    } else {
      // Unsaving: a quick shrink-and-fade back to the outline, no burst.
      await icon.start({ scale: 0.7, opacity: 0.5, transition: { duration: 0.12 } });
      icon.start({ scale: 1, opacity: 1, transition: { duration: 0.2 } });
    }
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      title={saved ? "Saved" : "Save"}
      onClick={onClick}
      className={cn(
        // Frosted glass circle that reads as part of the card (40px, which is also the minimum tap target)
        "group/heart inline-flex h-10 items-center justify-center gap-2 rounded-full border backdrop-blur-md",
        "shadow-[0_2px_10px_rgba(0,0,0,0.18)] transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        "motion-safe:hover:scale-[1.08]",
        showLabel ? "px-4 text-sm font-medium text-ink-900 dark:text-white" : "w-10",
        saved
          ? "border-saffron-500 bg-saffron-500/15"
          : "border-ink-900/10 bg-white/60 hover:border-saffron-400/60 dark:border-white/25 dark:bg-white/15 dark:hover:border-saffron-400/60",
        className,
      )}
    >
      <span className="relative inline-flex">
      <motion.span animate={icon} className="inline-flex">
        <Heart
          aria-hidden
          strokeWidth={2}
          className={cn(
            "h-[18px] w-[18px] transition-colors duration-200",
            saved
              ? "fill-saffron-500 stroke-saffron-500"
              : "fill-transparent stroke-ink-900 group-hover/heart:stroke-saffron-400 group-focus-visible/heart:stroke-saffron-400 dark:stroke-white dark:group-hover/heart:stroke-saffron-400 dark:group-focus-visible/heart:stroke-saffron-400",
          )}
        />
      </motion.span>

      <AnimatePresence>
        {bursting && !reduced && (
          <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
            <motion.span
              className="absolute -left-5 -top-5 h-10 w-10 rounded-full border-2 border-saffron-500"
              initial={{ scale: 0.6, opacity: 0.9 }}
              animate={{ scale: 1.9, opacity: 0 }}
              transition={{ duration: BURST_MS / 1000, ease: "easeOut" }}
            />
            {DOTS.map((d, i) => (
              <motion.span
                key={i}
                className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-saffron-500"
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{ x: d.x, y: d.y, scale: 0.3, opacity: 0 }}
                transition={{ duration: BURST_MS / 1000, ease: "easeOut" }}
              />
            ))}
          </span>
        )}
      </AnimatePresence>
      </span>
      {showLabel && <span>{saved ? "Saved" : "Save trip"}</span>}
    </button>
  );
}
