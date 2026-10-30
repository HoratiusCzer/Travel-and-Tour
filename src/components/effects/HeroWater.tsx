"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Client-only, so it adds nothing to the first paint and can't cause a hydration mismatch.
const WaterRipple = dynamic(() => import("./WaterRipple"), { ssr: false });

/** Mounts the water effect over the hero photo, unless the visitor prefers reduced motion (then: static photo only). */
export function HeroWater({ src }: { src: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[15]">
      <WaterRipple src={src} />
    </div>
  );
}
