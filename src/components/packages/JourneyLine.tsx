"use client";

import { useEffect, useRef, useState } from "react";
import type { ItineraryStop } from "@/data/packages";
import { cn } from "@/lib/cn";
import { composePath, JourneyPaths, useJourneyDraw, verticalSegment, type Point } from "./journey";

const MOBILE_BREAKPOINT = 720;
const PAD = 48;

interface Layout {
  width: number;
  mobile: boolean;
}

interface JourneyLineProps {
  stops: ItineraryStop[];
  /** Element that scrolls the journey (e.g. a modal body). Defaults to the window. */
  scrollRoot?: HTMLElement | null;
}

function StopCard({ stop, reached, animated }: { stop: ItineraryStop; reached: boolean; animated: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-lagoon-600/15 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-ink-900/80",
        animated && "transition-opacity duration-500",
        reached ? "opacity-100" : "opacity-40",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-saffron-600 dark:text-saffron-400">{stop.day}</p>
      <h3 className="mt-0.5 text-lg font-semibold text-ink-900 dark:text-white">{stop.place}</h3>
      <p className="mt-1 text-sm text-ink-800/75 dark:text-lagoon-50/70">{stop.description}</p>
    </div>
  );
}

export function JourneyLine({ stops, scrollRoot = null }: JourneyLineProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const measureRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [reached, setReached] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Measure only after mount so server and client markup match.
  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = wrapRef.current!;
    const ro = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      if (!width) return;
      setLayout((prev) => (prev && prev.width === width ? prev : { width, mobile: width < MOBILE_BREAKPOINT }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const step = layout?.mobile ? 200 : 190;
  const height = PAD * 2 + (stops.length - 1) * step;
  const points: Point[] = layout
    ? stops.map((_, i) => ({
        x: layout.mobile ? 22 + Math.sin(i * 1.3) * 8 : layout.width * (i % 2 === 0 ? 0.22 : 0.78),
        y: PAD + i * step,
      }))
    : [];

  const route = points.length ? composePath(points[0], points.slice(1).map((p, i) => verticalSegment(points[i], p))) : null;

  useJourneyDraw({
    areaRef,
    drawRef,
    planeRef,
    measureRef,
    pathD: route?.d ?? "",
    prefixes: route?.prefixes ?? [],
    scrollRoot,
    onPaint: (p) => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (percentRef.current) percentRef.current.textContent = `${Math.round(p * 100)}%`;
    },
    onReached: setReached,
  });

  const placeNow = stops[Math.max(0, reached - 1)]?.place;
  const cardWidth = (room: number) => Math.max(140, Math.min(300, room));

  return (
    <div ref={wrapRef} className="relative">
      <div ref={areaRef} className="relative" style={layout ? { height } : undefined}>
        {layout && (
          <svg aria-hidden width={layout.width} height={height} className="pointer-events-none absolute left-0 top-0">
            <JourneyPaths d={route?.d ?? ""} drawRef={drawRef} planeRef={planeRef} measureRef={measureRef} />
          </svg>
        )}
        <ol className={layout ? undefined : "space-y-4"}>
          {stops.map((stop, i) => {
            const isReached = i < reached;
            if (!layout) {
              return (
                <li key={stop.place + i}>
                  <StopCard stop={stop} reached animated={false} />
                </li>
              );
            }
            const p = points[i];
            const onLeft = !layout.mobile && i % 2 === 0;
            const style = layout.mobile
              ? { left: p.x + 28, width: cardWidth(layout.width - p.x - 28 - 8) }
              : onLeft
                ? { right: 28, width: cardWidth(p.x - 28 - 16) }
                : { left: 28, width: cardWidth(layout.width - p.x - 28 - 16) };
            return (
              <li key={stop.place + i} className="absolute h-0 w-0" style={{ left: p.x, top: p.y }}>
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full border-2 border-saffron-500",
                    !reducedMotion && "transition-colors duration-500",
                    isReached ? "bg-saffron-500" : "bg-sand-50 dark:bg-ink-950",
                  )}
                />
                <div className="absolute top-0 -translate-y-1/2" style={style}>
                  <StopCard stop={stop} reached={isReached} animated={!reducedMotion} />
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Sticks to the bottom of the viewport (or modal) only while this journey is on screen. */}
      <div
        aria-hidden
        className="pointer-events-none sticky bottom-4 z-10 mt-6 flex justify-center px-2"
      >
        <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-lagoon-600/15 bg-white/85 px-4 py-2.5 text-sm shadow-lg backdrop-blur dark:border-white/10 dark:bg-ink-900/85">
          <span className="shrink-0 text-ink-800/70 dark:text-lagoon-50/70">
            Now in <strong className="font-semibold text-ink-900 dark:text-white">{placeNow}</strong>
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-lagoon-600/15 dark:bg-white/15">
            <div ref={barRef} className="h-full origin-left scale-x-0 bg-saffron-500" />
          </div>
          <span ref={percentRef} className="w-9 shrink-0 text-right tabular-nums text-ink-800/70 dark:text-lagoon-50/70">0%</span>
        </div>
      </div>
    </div>
  );
}
