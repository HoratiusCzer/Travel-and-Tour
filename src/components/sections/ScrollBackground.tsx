"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Single source of truth for the image sequence in /public/frames.
const TOTAL = 241;
const frameSrc = (i: number) => `/frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;

interface ScrollBackgroundProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

// Scroll-driven image sequence that plays behind its children as the section scrolls past.
export function ScrollBackground({ id, className, children }: ScrollBackgroundProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const section = sectionRef.current!;
    const ctx = canvas.getContext("2d")!;
    const images: HTMLImageElement[] = new Array(TOTAL);
    let current = -1;
    let cancelled = false;
    let raf = 0;
    let count = 0;

    const draw = (index: number) => {
      const img = images[index];
      if (!img || !img.complete || !img.naturalWidth) return;
      const w = canvas.width;
      const h = canvas.height;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      if (current >= 0) draw(current);
    };

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const span = rect.height - canvas.clientHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      const index = Math.min(TOTAL - 1, Math.floor(p * (TOTAL - 1)));
      if (index !== current) {
        current = index;
        draw(index);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const onLoad = () => {
      count += 1;
      setProgress(count / TOTAL);
      if (count === TOTAL && !cancelled) {
        resize();
        update();
        setLoaded(true);
      }
    };
    for (let i = 0; i < TOTAL; i++) {
      const img = new Image();
      img.onload = onLoad;
      img.onerror = onLoad;
      img.src = frameSrc(i);
      images[i] = img;
    }

    resize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section ref={sectionRef} id={id} className={`relative bg-ink-950 ${className ?? ""}`}>
      {/* overflow-clip (not hidden) keeps the sticky stage working */}
      <div className="pointer-events-none absolute inset-0 overflow-clip" aria-hidden>
        <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-ink-950/55" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,5,5,0.75)_100%)]" />
        </div>
      </div>

      {/* The background is always dark, so children use their dark-mode styling. */}
      <div className="dark relative z-10 text-white">{children}</div>

      {!hidden && (
        <div
          className={`fixed inset-0 z-[70] flex flex-col items-center justify-center bg-ink-950 text-white transition-opacity duration-700 ${loaded ? "opacity-0 motion-safe:delay-[700ms]" : "opacity-100"}`}
          onTransitionEnd={(e) => e.target === e.currentTarget && loaded && setHidden(true)}
          role="status"
        >
          <style>{`
            @keyframes loader-plane-float { 0%,100% { transform: translateY(-1.5px) } 50% { transform: translateY(1.5px) } }
            @media (prefers-reduced-motion: no-preference) { .loader-plane-float { animation: loader-plane-float 1.6s ease-in-out infinite } }
          `}</style>
          <div
            className="relative h-6 w-[var(--track-w)]"
            style={{ "--track-w": "min(14rem, 70vw)", "--p": progress } as React.CSSProperties}
          >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-white/25" />
            <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded">
              <div
                className="h-full w-full bg-gradient-to-r from-lagoon-400 to-saffron-400 transition-transform duration-300 ease-out"
                style={{ transform: `translateX(${(progress - 1) * 100}%)` }}
              />
            </div>
            <div
              className="absolute left-0 top-1/2 -mt-[11px] h-[22px] w-[22px] transition-transform duration-300 ease-out"
              style={{ transform: `translateX(calc(var(--p) * var(--track-w) - 70%))` }}
              aria-hidden
            >
              <div
                className={`h-full w-full transition-[transform,opacity] ease-in ${
                  loaded ? "motion-safe:translate-x-24 motion-safe:-translate-y-8 motion-safe:-rotate-[25deg] motion-safe:opacity-0 motion-safe:delay-300 motion-safe:duration-700" : ""
                }`}
              >
                <svg viewBox="0 0 24 24" className="loader-plane-float h-full w-full rotate-90 fill-saffron-400" focusable="false">
                  <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
                </svg>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/50">Preparing your journey</p>
        </div>
      )}
    </section>
  );
}
