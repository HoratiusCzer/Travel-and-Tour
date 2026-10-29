"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { Logo } from "@/components/brand/Logo";
import { AuthCard, type AuthMode } from "./AuthCard";
import { LampScene } from "./LampScene";

const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";
// Very faint film grain, drawn as an inline SVG noise filter.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** Full-screen login/sign-up page: a dark room where pulling the lamp's cord turns on the light and reveals the card. */
export function AuthScreen({ mode }: { mode: AuthMode }) {
  const reduced = useReducedMotion();
  const [on, setOn] = useState(false);
  // Fades only start after the first paint, so nothing animates during load.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  // The light always starts off when the page opens, on both Login and Sign up.
  const setLight = useCallback((value: boolean) => setOn(value), []);

  const dur = !ready ? "0s" : reduced ? "0.2s" : "0.8s";

  return (
    <div
      className="relative min-h-dvh overflow-hidden bg-sand-50 text-ink-800 dark:bg-ink-950 dark:text-lagoon-50/90"
      style={{ "--dur": dur } as CSSProperties}
    >
      {/* No background colour change: the base is the site background and only the lamp area glows. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />

      <div className="absolute left-4 top-4 z-30 sm:left-8 sm:top-6">
        <Logo />
      </div>

      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center gap-4 px-4 pb-6 pt-16 md:flex-row md:gap-0 md:px-10 md:pt-14">
        <div className="flex h-[30dvh] min-h-[210px] shrink-0 justify-center md:h-[min(76dvh,640px)] md:w-[40%]">
          <LampScene on={on} onToggle={() => setLight(!on)} />
        </div>

        <div className="relative z-20 flex w-full justify-center md:w-[60%]">
          {/* Dim and blurred until the light is on; focusing any field turns it on, so the form is never blocked */}
          <div
            onFocusCapture={() => !on && setLight(true)}
            className={`flex w-full justify-center transition-[opacity,filter,transform] duration-[var(--dur)] ${EASE} ${on ? "translate-y-0 opacity-100 blur-0" : "translate-y-4 opacity-[0.15] blur-[6px]"}`}
          >
            <AuthCard mode={mode} />
          </div>
        </div>
      </main>
    </div>
  );
}
