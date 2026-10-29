"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { composePath, JourneyPaths, useJourneyDraw, verticalSegment, type Point } from "./journey";

const DOT_LIFT = 10; // card dots sit this far above the card's top border
const CORNER = 14; // radius of the turns around a card's edge
const EDGE_OUT = 16; // how far the route runs outside a card's side edge (clears the card by 2px past the turn)
const WAVE = 6;
const LANDING_LIFT = 28; // landing dot sits this far above the Trip budget eyebrow
const LANDING_R = 7;
const CARD_R = 5;

interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
  cx: number;
}

interface Route {
  width: number;
  height: number;
  /** Card dots in visiting order, then the landing point. */
  points: Point[];
  /** Card index (grid order) visited at each of the first points. */
  order: number[];
  d: string;
  prefixes: string[];
  /** Vertical range that maps to 0-100% progress: first dot down to the Trip budget eyebrow. */
  startY: number;
  endY: number;
}

// Quarter turns between a horizontal run and a vertical one.
const turnDown = (a: Point, b: Point) =>
  `C ${a.x + (b.x - a.x) * 0.55} ${a.y}, ${b.x} ${b.y - (b.y - a.y) * 0.55}, ${b.x} ${b.y}`;
const turnInto = (a: Point, b: Point) =>
  `C ${a.x} ${a.y + (b.y - a.y) * 0.55}, ${b.x - (b.x - a.x) * 0.55} ${b.y}, ${b.x} ${b.y}`;

/** Run out along the card's top edge, round its corner and down the side to (edgeX, toY). */
function aroundEdge(a: Point, edgeX: number, sign: 1 | -1, toY: number) {
  const startX = edgeX - sign * CORNER;
  return `L ${startX} ${a.y} ${turnDown({ x: startX, y: a.y }, { x: edgeX, y: a.y + CORNER })} L ${edgeX} ${toY}`;
}

function buildRoute(
  boxes: Box[],
  width: number,
  height: number,
  gridLeft: number,
  landing: Point,
  targetTop: number,
): Route {
  const rows: number[][] = [];
  boxes
    .map((b, i) => ({ b, i }))
    .sort((a, b) => a.b.top - b.b.top || a.b.left - b.b.left)
    .forEach(({ b, i }) => {
      const row = rows.find((r) => Math.abs(boxes[r[0]].top - b.top) < 4);
      if (row) row.push(i);
      else rows.push([i]);
    });
  const lastRowBottom = Math.max(...rows[rows.length - 1].map((i) => boxes[i].bottom));
  const yTurn = lastRowBottom + (landing.y - lastRowBottom) * 0.35;
  const toLanding = (a: Point) => {
    const h = landing.y - yTurn;
    return `C ${a.x} ${yTurn + h * 0.5}, ${landing.x} ${landing.y - h * 0.5}, ${landing.x} ${landing.y}`;
  };

  // Single column: the line runs down the left edge with a dot beside each card's top, then curves to the landing.
  if (rows.every((r) => r.length === 1)) {
    const order = rows.map((r) => r[0]);
    const cardPoints = order.map((idx, n) => ({ x: gridLeft + 10 + Math.sin(n * 1.3) * 3, y: boxes[idx].top + 24 }));
    const points = [...cardPoints, landing];
    const segments = cardPoints.slice(1).map((p, n) => verticalSegment(cardPoints[n], p));
    const last = cardPoints[cardPoints.length - 1];
    segments.push(`L ${last.x} ${yTurn} ${toLanding({ x: last.x, y: yTurn })}`);
    const { d, prefixes } = composePath(points[0], segments);
    return { width, height, points, order, d, prefixes, startY: points[0].y, endY: targetTop };
  }

  const order: number[] = [];
  rows.forEach((r, ri) => {
    const sorted = [...r].sort((a, b) => boxes[a].left - boxes[b].left);
    order.push(...(ri % 2 === 0 ? sorted : sorted.reverse()));
  });
  const cardPoints = order.map((idx) => ({ x: boxes[idx].cx, y: boxes[idx].top - DOT_LIFT }));
  const rowOf = (idx: number) => rows.findIndex((r) => r.includes(idx));
  // Rows alternate direction, so a row that went left to right turns round its right edge, and vice versa.
  const edgeOf = (idx: number) => {
    const sign = rowOf(idx) % 2 === 0 ? 1 : -1;
    return { sign: sign as 1 | -1, x: sign === 1 ? boxes[idx].right + EDGE_OUT : boxes[idx].left - EDGE_OUT };
  };

  const segments = cardPoints.slice(1).map((b, n) => {
    const a = cardPoints[n];
    const from = order[n];
    if (rowOf(from) === rowOf(order[n + 1])) {
      // Same row: a gentle wave along the gap above the card tops.
      const dx = b.x - a.x;
      const s = n % 2 === 0 ? WAVE : -WAVE;
      return `C ${a.x + dx * 0.5} ${a.y - s}, ${b.x - dx * 0.5} ${b.y + s}, ${b.x} ${b.y}`;
    }
    // Next row: round the end card's edge, down the row gap, then back in above the next card.
    const { sign, x: edgeX } = edgeOf(from);
    const startX = edgeX - sign * CORNER;
    return [
      aroundEdge(a, edgeX, sign, b.y - CORNER),
      turnInto({ x: edgeX, y: b.y - CORNER }, { x: startX, y: b.y }),
      `L ${b.x} ${b.y}`,
    ].join(" ");
  });
  // After the last card: round its edge, down past the grid, then curve to the centre and land.
  const lastIdx = order[order.length - 1];
  const last = cardPoints[cardPoints.length - 1];
  const { sign, x: edgeX } = edgeOf(lastIdx);
  segments.push(`${aroundEdge(last, edgeX, sign, yTurn)} ${toLanding({ x: edgeX, y: yTurn })}`);

  const points = [...cardPoints, landing];
  const { d, prefixes } = composePath(points[0], segments);
  return { width, height, points, order, d, prefixes, startY: points[0].y, endY: targetTop };
}

/**
 * Wraps the packages grid and the start of the Trip budget section. Draws a route behind them that visits
 * each card in order as you scroll, then lands just above the Trip budget heading.
 */
export function PackageJourney({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const measureRef = useRef<SVGPathElement>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [reached, setReached] = useState(0);

  const cardEls = () => Array.from(wrapRef.current?.querySelectorAll(".package-route > article") ?? []);
  const eyebrow = () => wrapRef.current?.querySelector<HTMLElement>("#calculator p") ?? null;

  // Measure after mount, and again on resize, when cards change, or when either section changes size.
  useEffect(() => {
    const wrap = wrapRef.current!;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const w = wrap.getBoundingClientRect();
      const grid = wrap.querySelector(".package-route");
      const target = eyebrow();
      const cards = cardEls();
      if (!grid || !target || !cards.length || !w.width) {
        setRoute(null);
        return;
      }
      const boxes = cards.map((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left - w.left, right: r.right - w.left, top: r.top - w.top, bottom: r.bottom - w.top, cx: (r.left + r.right) / 2 - w.left };
      });
      const targetTop = target.getBoundingClientRect().top - w.top;
      const landing = { x: w.width / 2, y: targetTop - LANDING_LIFT };
      const next = buildRoute(boxes, w.width, w.height, grid.getBoundingClientRect().left - w.left, landing, targetTop);
      setRoute((prev) =>
        prev && prev.d === next.d && prev.width === next.width && prev.height === next.height && prev.endY === next.endY
          ? prev
          : next,
      );
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    const ro = new ResizeObserver(schedule);
    const observe = () => {
      ro.disconnect();
      ro.observe(wrap);
      const grid = wrap.querySelector(".package-route");
      if (grid) ro.observe(grid);
      const calc = wrap.querySelector("#calculator");
      if (calc) ro.observe(calc);
      cardEls().forEach((el) => ro.observe(el));
    };
    const mo = new MutationObserver(() => {
      observe();
      schedule();
    });
    observe();
    const grid = wrap.querySelector(".package-route");
    if (grid) mo.observe(grid, { childList: true });
    // The sections slide in as they appear (a transform), which moves positions without resizing anything.
    wrap.addEventListener("transitionend", schedule);
    measure();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      wrap.removeEventListener("transitionend", schedule);
    };
  }, []);

  useJourneyDraw({
    areaRef: rangeRef,
    drawRef,
    planeRef,
    measureRef,
    pathD: route?.d ?? "",
    prefixes: route?.prefixes ?? [],
    firstStopAt: 1,
    onReached: setReached,
  });

  // Visited cards get data-reached, and the Trip budget eyebrow lights up once the line has landed.
  useEffect(() => {
    if (!route) return;
    const cards = cardEls();
    cards.forEach((el) => el.removeAttribute("data-reached"));
    route.order.slice(0, reached).forEach((idx) => cards[idx]?.setAttribute("data-reached", "true"));
    const target = eyebrow();
    target?.setAttribute("data-route-target", "");
    if (reached >= route.points.length) target?.setAttribute("data-reached", "true");
    else target?.removeAttribute("data-reached");
  }, [route, reached]);

  useEffect(() => {
    const wrap = wrapRef.current;
    return () => {
      wrap?.querySelector("#calculator p")?.removeAttribute("data-route-target");
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      {route && (
        <>
          <svg
            aria-hidden
            width={route.width}
            height={route.height}
            className="pointer-events-none absolute left-0 top-0 overflow-visible"
          >
            <JourneyPaths d={route.d} drawRef={drawRef} planeRef={planeRef} measureRef={measureRef} />
            {route.points.map((p, n) => {
              const landing = n === route.points.length - 1;
              return (
                <circle
                  key={n}
                  cx={p.x}
                  cy={p.y}
                  r={landing ? LANDING_R : CARD_R}
                  strokeWidth="2"
                  className={
                    n < reached
                      ? "fill-saffron-500 stroke-saffron-500 transition-colors duration-500 motion-reduce:transition-none"
                      : "fill-sand-100 stroke-saffron-500 transition-colors duration-500 motion-reduce:transition-none dark:fill-ink-950"
                  }
                />
              );
            })}
          </svg>
          {/* Maps scroll to progress: 0 when the first dot is 60% down the viewport, 100% when the eyebrow is. */}
          <div
            ref={rangeRef}
            aria-hidden
            className="pointer-events-none absolute left-0 w-px"
            style={{ top: route.startY, height: Math.max(1, route.endY - route.startY) }}
          />
        </>
      )}
      {children}
    </div>
  );
}
