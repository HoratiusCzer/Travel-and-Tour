"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Loaded on the client only, so the WebGL code stays out of the initial bundle and can't mismatch on hydration.
const LightRays = dynamic(() => import("./LightRays"), { ssr: false });

const FALLBACK_COLOR = "#f59a0c";

/** Amber light rays for the Traveller Stories section, plus a soft fade into the section background. */
export function StoriesRays() {
  const [color, setColor] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    // Read the accent from the theme instead of hardcoding it.
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--color-saffron-500").trim();
    setColor(accent || FALLBACK_COLOR);

    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!color) return null;

  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-60">
        <LightRays
          raysOrigin="top-center"
          raysColor={color}
          raysSpeed={0.8}
          lightSpread={0.9}
          rayLength={mobile ? 1.1 : 1.4}
          fadeDistance={0.9}
          saturation={0.9}
          followMouse={!mobile}
          mouseInfluence={0.15}
          noiseAmount={0.03}
          distortion={0.05}
        />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-b from-transparent to-lagoon-900" />
    </>
  );
}
