"use client";

import { animate, motion, useAnimationControls, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useRef } from "react";

const PULL_LIMIT = 80; // how far the cord can be dragged
const PULL_TRIGGER = 45; // releasing past this toggles the light
const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";
// Every light effect fades with the scene's --dur (0.8s, shortened for reduced motion, 0s on first paint).
const FADE = `transition-opacity duration-[var(--dur)] ${EASE}`;
// Warm glows sit on the page background; on the light theme they are half as strong.
const GLOW_ON = "opacity-50 dark:opacity-100";

// Lamp artwork is drawn in a 300 x 620 box; the shade's bottom rim sits near y = 190.
const SHADE = "M96 40 L204 40 L266 188 Q150 206 34 188 Z";

interface LampSceneProps {
  on: boolean;
  onToggle: () => void;
}

export function LampScene({ on, onToggle }: LampSceneProps) {
  const reduced = useReducedMotion();
  const y = useMotionValue(0);
  const lineHeight = useTransform(y, (v) => 64 + v);
  const sway = useAnimationControls();
  const bead = useAnimationControls();
  const dragged = useRef(false);

  const afterToggle = () => {
    if (reduced) return;
    bead.start({ scale: [1, 0.8, 1], transition: { duration: 0.25 } });
    sway.start({ rotate: [0, 4, -3, 1.5, -0.5, 0], transition: { duration: 1.4, ease: "easeOut" } });
  };
  const springBack = () => {
    if (reduced) y.set(0);
    else animate(y, 0, { type: "spring", stiffness: 400, damping: 15 });
  };

  const toggle = () => {
    onToggle();
    afterToggle();
  };

  return (
    <div className="relative aspect-[300/620] h-full">
      {/* Large soft glow centred on the shade. It is sized to fade out before the auth card (about 45% of the viewport width on desktop). */}
      <div
        aria-hidden
        className={`pointer-events-none absolute left-1/2 top-[18.5%] aspect-square w-[90vw] -translate-x-1/2 -translate-y-1/2 md:w-[48vw] ${FADE} ${on ? GLOW_ON : "opacity-0"}`}
        style={{
          backgroundImage:
            "radial-gradient(closest-side, color-mix(in srgb, var(--color-saffron-500) 20%, transparent), transparent)",
        }}
      />

      {/* Beam from the shade to the floor: blurred edges, feathered sides, fading out before it reaches the ground */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-[-12%] bottom-[5%] top-[30%] blur-[18px] ${FADE} ${on ? GLOW_ON : "opacity-0"}`}
      >
        <div
          className="h-full w-full bg-gradient-to-b from-[rgba(255,226,170,0.6)] via-[rgba(255,184,86,0.2)] via-55% to-transparent to-90%"
          style={{
            clipPath: "polygon(21% 0, 79% 0, 100% 100%, 0 100%)",
            maskImage: "linear-gradient(to right, transparent, black 28%, black 72%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 28%, black 72%, transparent)",
          }}
        />
      </div>

      {/* Small pool of light on the floor around the base */}
      <div
        aria-hidden
        className={`pointer-events-none absolute bottom-[1%] left-1/2 h-[9%] w-[150%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,190,96,0.5),transparent)] ${FADE} ${on ? GLOW_ON : "opacity-0"}`}
      />

      {/* Pull cord: a fixed anchor under the shade rim, a line that stretches as the bead is pulled down */}
      <motion.div
        animate={sway}
        style={{ x: "-50%", originY: 0 }}
        className="absolute left-[78.3%] top-[calc(31%-4px)] z-0 h-0 w-0"
      >
        <motion.span
          aria-hidden
          style={{ height: lineHeight }}
          className="absolute left-[-1px] top-0 w-[2px] bg-gradient-to-b from-[#6b4a1a] to-[#d9a441]"
        />
        <motion.button
          type="button"
          aria-pressed={on}
          aria-label={on ? "Turn off the light" : "Turn on the light"}
          drag="y"
          dragConstraints={{ top: 0, bottom: PULL_LIMIT }}
          dragElastic={0}
          dragMomentum={false}
          style={{ y }}
          onPointerDown={() => (dragged.current = false)}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={() => {
            if (y.get() > PULL_TRIGGER) toggle();
            springBack();
          }}
          onClick={() => {
            if (dragged.current) {
              dragged.current = false;
              return;
            }
            toggle();
            if (!reduced) animate(y, [0, 26, 0], { duration: 0.45 });
          }}
          className="group absolute left-[-18px] top-[56px] flex h-12 w-9 cursor-grab touch-none items-start justify-center pt-2 active:cursor-grabbing"
        >
          <motion.span
            aria-hidden
            animate={bead}
            className="h-4 w-4 rounded-full bg-gradient-to-br from-[#f6d58a] to-[#b27a1d] shadow-[0_0_8px_rgba(245,154,12,0.5)] group-focus-visible:ring-2 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-black group-focus-visible:ring-saffron-300"
          />
          <span
            className={`pointer-events-none absolute left-full top-[6px] ml-2 w-28 text-left text-[11px] leading-tight text-ink-800/70 dark:text-white/60 ${FADE}`}
          >
            {on ? "Pull to turn off" : "Pull to turn on the light"}
          </span>
        </motion.button>
      </motion.div>

      <svg viewBox="0 0 300 620" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="lamp-metal" x1="0" x2="1">
            <stop offset="0" stopColor="#0d0d0d" />
            <stop offset="0.5" stopColor="#2a2928" />
            <stop offset="1" stopColor="#0d0d0d" />
          </linearGradient>
          <linearGradient id="lamp-brass" x1="0" x2="1">
            <stop offset="0" stopColor="#7a5316" />
            <stop offset="0.5" stopColor="#e8b54a" />
            <stop offset="1" stopColor="#7a5316" />
          </linearGradient>
          <linearGradient id="lamp-base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2b2a29" />
            <stop offset="1" stopColor="#0b0b0b" />
          </linearGradient>
          <linearGradient id="shade-off" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#262019" />
            <stop offset="1" stopColor="#120f0c" />
          </linearGradient>
          <radialGradient id="shade-on" cx="0.5" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#fff4d9" />
            <stop offset="0.55" stopColor="#ffd78e" />
            <stop offset="1" stopColor="#e8962c" />
          </radialGradient>
          <radialGradient id="bulb-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff8e3" />
            <stop offset="0.45" stopColor="#ffd88f" stopOpacity="0.75" />
            <stop offset="1" stopColor="#ffbf63" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base and stem */}
        <ellipse cx="150" cy="598" rx="96" ry="14" fill="#000" opacity="0.5" />
        <path
          d="M64 580 Q64 560 150 556 Q236 560 236 580 Q236 604 150 608 Q64 604 64 580Z"
          fill="url(#lamp-base)"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1"
        />
        <ellipse cx="150" cy="560" rx="50" ry="6" fill="#161514" stroke="rgba(255,255,255,0.1)" />
        <rect x="147" y="200" width="6" height="362" fill="url(#lamp-metal)" />
        <rect x="140" y="544" width="20" height="9" rx="3" fill="url(#lamp-brass)" />
        <rect x="141" y="330" width="18" height="7" rx="3" fill="url(#lamp-brass)" />
        <rect x="143" y="338" width="14" height="3" rx="1.5" fill="#7a5316" />
        <rect x="139" y="196" width="22" height="12" rx="3" fill="url(#lamp-brass)" />

        {/* Shade: dark fabric, and the same shape lit from inside crossfaded on top */}
        <path d={SHADE} fill="url(#shade-off)" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" />
        <g className={`${FADE} ${on ? "opacity-100" : "opacity-0"}`}>
          <path d={SHADE} fill="url(#shade-on)" />
          <path d="M34 188 Q150 206 266 188" fill="none" stroke="#ffe3a6" strokeWidth="2" opacity="0.8" />
        </g>
        <g stroke="rgba(0,0,0,0.22)" strokeWidth="1">
          <path d="M120 41 L84 194" />
          <path d="M150 41 L150 202" />
          <path d="M180 41 L216 194" />
        </g>
        <ellipse cx="150" cy="40" rx="54" ry="7" fill="#0c0a08" stroke="rgba(255,255,255,0.12)" />

        {/* Bulb glow just under the shade */}
        <ellipse
          cx="150"
          cy="204"
          rx="62"
          ry="30"
          fill="url(#bulb-glow)"
          className={`${FADE} ${on ? "opacity-100" : "opacity-0"}`}
        />
      </svg>
    </div>
  );
}
