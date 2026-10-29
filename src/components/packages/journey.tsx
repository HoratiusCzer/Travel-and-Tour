"use client";

import { useEffect, useRef, type RefObject } from "react";

// Shared pieces of the scroll-drawn route: path helpers, the scroll/ease loop and the SVG layers.

export interface Point {
  x: number;
  y: number;
}

const LERP = 0.14;
const EPSILON = 0.0005;
// Same airplane glyph as the site loader; it points up, so the marker rotates it to face along the path.
const PLANE = "M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z";

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Smooth S-curve with vertical tangents, used when stops run down the page. */
export function verticalSegment(a: Point, b: Point) {
  const dy = (b.y - a.y) * 0.55;
  return `C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
}

/** Joins per-stop segments into one path, and also returns the path up to each stop (for measuring). */
export function composePath(start: Point, segments: string[]) {
  let d = `M ${start.x} ${start.y}`;
  const prefixes = [""];
  for (const segment of segments) {
    d += ` ${segment}`;
    prefixes.push(d);
  }
  return { d, prefixes };
}

interface DrawOptions {
  /** Element whose scroll position drives the line (the route's container). */
  areaRef: RefObject<HTMLElement | null>;
  drawRef: RefObject<SVGPathElement | null>;
  planeRef: RefObject<SVGGElement | null>;
  measureRef: RefObject<SVGPathElement | null>;
  /** The full path; the loop restarts whenever it changes. Empty means not laid out yet. */
  pathD: string;
  /** Path up to each stop, from composePath, used to know when each stop is reached. */
  prefixes: string[];
  /** Scrolling element (e.g. a modal body). Defaults to the window. */
  scrollRoot?: HTMLElement | null;
  /** Length at which the first stop counts as reached (0 means immediately). */
  firstStopAt?: number;
  onPaint?: (progress: number) => void;
  onReached?: (count: number) => void;
}

/**
 * Progress is how far the area has passed a point 60% down the viewport, eased with rAF.
 * Paints the solid path, the plane marker and the reached count; the loop stops once it catches up.
 */
export function useJourneyDraw(options: DrawOptions) {
  const latest = useRef(options);
  latest.current = options;
  const { pathD, scrollRoot } = options;

  useEffect(() => {
    if (!pathD) return;
    const { areaRef, drawRef, planeRef, measureRef, prefixes, firstStopAt = 0 } = latest.current;
    const area = areaRef.current;
    const draw = drawRef.current;
    const measurer = measureRef.current;
    if (!area || !draw || !measurer) return;

    const total = draw.getTotalLength();
    const lens = prefixes.map((d, i) => {
      if (i === 0) return firstStopAt;
      measurer.setAttribute("d", d);
      return measurer.getTotalLength();
    });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = scrollRoot ?? null;
    let target = 0;
    let current = 0;
    let raf = 0;
    let lastReached = -1;

    const paint = (p: number) => {
      const drawn = p * total;
      draw.style.strokeDasharray = `${total}`;
      draw.style.strokeDashoffset = `${total - drawn}`;
      const at = draw.getPointAtLength(drawn);
      const ahead = draw.getPointAtLength(Math.min(total, drawn + 2));
      const behind = draw.getPointAtLength(Math.max(0, drawn - 2));
      const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
      planeRef.current?.setAttribute("transform", `translate(${at.x} ${at.y}) rotate(${angle})`);
      latest.current.onPaint?.(p);
      const count = lens.filter((len) => drawn >= len - 0.5).length;
      if (count !== lastReached) {
        lastReached = count;
        latest.current.onReached?.(count);
      }
    };
    const measure = () => {
      const rect = area.getBoundingClientRect();
      const viewTop = root ? root.getBoundingClientRect().top : 0;
      const viewH = root ? root.clientHeight : window.innerHeight;
      return clamp01((viewTop + viewH * 0.6 - rect.top) / rect.height);
    };
    const tick = () => {
      raf = 0;
      const diff = target - current;
      if (Math.abs(diff) < EPSILON) {
        current = target;
        paint(current);
        return;
      }
      current += diff * LERP;
      paint(current);
      raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      target = measure();
      if (reduced) {
        current = target;
        paint(current);
      } else if (!raf) {
        raf = requestAnimationFrame(tick);
      }
    };

    target = current = measure();
    paint(current);
    const scroller: HTMLElement | Window = root ?? window;
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathD, scrollRoot]);
}

interface JourneyPathsProps {
  d: string;
  drawRef: RefObject<SVGPathElement | null>;
  planeRef: RefObject<SVGGElement | null>;
  measureRef: RefObject<SVGPathElement | null>;
}

/** Faint dashed ghost route, the solid accent route drawn on top, and the plane that rides its tip. */
export function JourneyPaths({ d, drawRef, planeRef, measureRef }: JourneyPathsProps) {
  return (
    <>
      <path ref={measureRef} fill="none" stroke="none" />
      <path
        d={d}
        fill="none"
        strokeWidth="2"
        strokeDasharray="6 8"
        strokeLinecap="round"
        className="stroke-lagoon-700/35 dark:stroke-white/25"
      />
      <path ref={drawRef} d={d} fill="none" strokeWidth="3" strokeLinecap="round" className="stroke-saffron-500" />
      <g ref={planeRef}>
        <path d={PLANE} transform="scale(1.1) rotate(90) translate(-12 -12)" className="fill-saffron-500" />
      </g>
    </>
  );
}
