"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Container } from "@/components/ui/Container";
import type { TourPackage } from "@/data/packages";
import { JourneyLine } from "./JourneyLine";

export function ItineraryButton({ pkg }: { pkg: TourPackage }) {
  const [open, setOpen] = useState(false);
  // State (not a ref) so the journey mounts only once the scroll container exists.
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    const trigger = triggerRef.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 w-full rounded-full border border-lagoon-600/40 px-5 py-2.5 text-sm font-semibold text-lagoon-700 transition hover:bg-lagoon-50 dark:border-lagoon-400/40 dark:text-lagoon-200 dark:hover:bg-lagoon-900"
      >
        View itinerary
      </button>
      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${pkg.title} itinerary`}
            className="fixed inset-0 z-[80] flex flex-col bg-sand-50 text-ink-800 dark:bg-ink-950 dark:text-lagoon-50/90"
          >
            <div className="flex items-center justify-between gap-4 border-b border-lagoon-600/10 px-4 py-3 sm:px-6 dark:border-white/10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-600 dark:text-saffron-400">
                  {pkg.title}
                </p>
                <h2 className="text-xl font-semibold text-ink-900 dark:text-white">Your {pkg.days}-day route</h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close itinerary"
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-lagoon-600/30 text-2xl leading-none dark:border-lagoon-400/30"
              >
                ×
              </button>
            </div>
            <div ref={setScroller} className="flex-1 overflow-y-auto">
              <Container className="max-w-4xl pb-[40vh]">
                {/* Keeps the route below the 60% mark so it starts undrawn and fills as you scroll. */}
                <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                  <p className="text-sm text-ink-800/70 dark:text-lagoon-50/70">
                    {pkg.days} days · {pkg.itinerary.length} stops
                  </p>
                  <p className="mt-2 text-lg font-medium text-ink-900 dark:text-white">Scroll to fly the route</p>
                  <span aria-hidden className="mt-3 animate-bounce text-2xl text-saffron-600 motion-reduce:animate-none dark:text-saffron-400">↓</span>
                </div>
                {scroller && <JourneyLine stops={pkg.itinerary} scrollRoot={scroller} />}
              </Container>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
