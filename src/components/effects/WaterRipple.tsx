"use client";

import { useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer, Texture, Triangle } from "ogl";

/**
 * A "cinemagraph" for the hero photo: the same image drawn on a canvas with a calm ripple applied to the
 * water only, while the mountains, trees and sky stay completely still. Moving the cursor over the water
 * leaves soft elliptical rings that spread and fade; a click or tap drops a "pebble".
 *
 * Tune the look with the constants below.
 */

// --- Ambient shimmer -------------------------------------------------------------------------------

// How far the water pixels are pushed, in texture UV units (about 0.002 to 0.004 reads as a calm lake).
export const RIPPLE_STRENGTH = 0.003;
// Animation speed multiplier (1 is a lively surface, 0.5 to 0.7 is calm).
export const RIPPLE_SPEED = 0.6;
// Where the water starts, as a fraction of the image height from the top. Nothing above this line moves.
// In the current photo the far shoreline sits at about 0.52.
export const WATER_START = 0.55;
// How much of the image height it takes for the movement to fade in below WATER_START (no visible seam).
export const WATER_FADE = 0.08;
// Brightness (a few percent) of the faint glints of light moving on the water. 0 turns them off.
export const GLINT_AMOUNT = 0.04;

// --- Cursor ripples --------------------------------------------------------------------------------

// Peak displacement of a ring, in texture UV units (0.006 to 0.01 is a bit stronger than the shimmer).
export const CURSOR_RIPPLE_STRENGTH = 0.008;
// How fast a ring spreads, in image heights per second (0.12 to 0.2 feels like a calm lake).
export const RING_SPEED = 0.14;
// How long a ring lasts before it has faded away, in seconds.
export const RING_LIFETIME = 1.8;
// How far the cursor must travel before the next ring is dropped, as a fraction of the hero width.
export const SPAWN_DISTANCE = 0.025;
// How many rings can be alive at once. Older ones are overwritten.
export const MAX_RIPPLES = 12;
// Height of a ring relative to its width. Below 1 the circles lie flat, as on a lake seen at a low angle.
export const ELLIPSE_SQUASH = 0.45;
// Brightness (a few percent) of the light catching the ring crests. 0 turns it off.
export const CREST_HIGHLIGHT = 0.04;
// A click or tap makes a "pebble drop": a larger, slower, longer-lived ring (multipliers of the values above).
export const PEBBLE_STRENGTH = 1.4;
export const PEBBLE_SPEED = 0.7;
export const PEBBLE_LIFETIME = 1.35;

const MAX_DPR = 1.5;
const MAX_DPR_MOBILE = 1;

const VERT = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  #define MAX_RIPPLES ${MAX_RIPPLES}
  uniform sampler2D uTex;
  uniform float uTime;
  uniform vec2  uCover;      // visible fraction of the image on each axis (object-fit: cover, centred)
  uniform float uStrength;
  uniform float uSpeed;
  uniform float uWaterStart;
  uniform float uWaterFade;
  uniform float uGlint;
  uniform float uAspect;     // image width / height
  uniform vec4  uRipples[MAX_RIPPLES]; // xy: texture uv, z: start time (seconds), w: 1 for a pebble drop
  uniform float uRippleStrength;
  uniform float uRingSpeed;
  uniform float uRingLife;
  uniform float uSquash;
  uniform float uCrest;
  uniform vec3  uPebble;     // strength, speed and lifetime multipliers
  varying vec2 vUv;

  void main() {
    // Same crop as object-fit: cover with the image centred
    vec2 uv = (vUv - 0.5) * uCover + 0.5;
    float imgY = 1.0 - uv.y;                       // 0 at the top of the photo, 1 at the bottom

    // Soft vertical mask: still above the shoreline, fading in smoothly, full effect towards the bottom
    float mask = smoothstep(uWaterStart, uWaterStart + uWaterFade, imgY);
    float nearness = smoothstep(uWaterStart, 1.0, imgY);
    float amount = mask * mix(0.55, 1.0, nearness);  // water close to the camera moves a little more

    float t = uTime * uSpeed;
    // Mostly horizontal shimmer from layered sine waves, with a slight vertical wobble
    float sx = sin(uv.y * 70.0 + t * 1.2 + sin(uv.x * 9.0 + t * 0.5) * 1.6)
             + 0.6 * sin(uv.y * 150.0 - t * 1.7 + uv.x * 22.0);
    float sy = sin(uv.x * 48.0 + t * 0.9 + uv.y * 34.0);
    vec2 disp = vec2(sx * 0.7, sy * 0.3) * uStrength * amount;

    // Cursor ripples: soft rings that spread, flattened into ellipses and faded over their lifetime
    vec2 rippleDisp = vec2(0.0);
    float crest = 0.0;
    for (int i = 0; i < MAX_RIPPLES; i++) {
      vec4 r = uRipples[i];
      float pebble = step(0.5, r.w);
      float life = uRingLife * mix(1.0, uPebble.z, pebble);
      float age = uTime - r.z;
      if (age <= 0.0 || age >= life) continue;

      // Measure in image-height units so the shape does not depend on the viewport, then squash vertically
      vec2 p = (uv - r.xy) * vec2(uAspect, 1.0);
      vec2 q = vec2(p.x, p.y / uSquash);
      float d = length(q);
      float radius = age * uRingSpeed * mix(1.0, uPebble.y, pebble);

      float band = d - radius;
      float wave = sin(band * 140.0) * exp(-band * band / 0.0049);       // a few crests within a soft band
      float fade = (1.0 - age / life);
      float strength = fade * fade * smoothstep(0.0, 0.12, age) / (1.0 + radius * 8.0);
      wave *= strength;

      vec2 dir = q / (d + 0.00001);
      rippleDisp += vec2(dir.x / uAspect, dir.y * uSquash) * wave * uRippleStrength * mix(1.0, uPebble.x, pebble);
      crest += max(wave, 0.0) * max(wave, 0.0);
    }
    // Rings use the same water mask, so they never distort the trees or mountains
    rippleDisp *= mask;

    vec4 col = texture2D(uTex, clamp(uv + disp + rippleDisp, 0.0, 1.0));

    // Very faint glints of light drifting over the surface
    float g = sin(uv.x * 230.0 + t * 2.0 + sin(uv.y * 85.0 - t) * 3.0) * sin(uv.y * 170.0 - t * 1.3 + uv.x * 44.0);
    col.rgb += pow(max(g, 0.0), 8.0) * uGlint * amount;
    // Light catching the ring crests
    col.rgb += crest * uCrest * mask;

    gl_FragColor = vec4(col.rgb, 1.0);
  }
`;

interface WaterRippleProps {
  /** Same-origin URL of the photo (the hero passes the optimized copy of the image it already shows). */
  src: string;
  strength?: number;
  speed?: number;
  waterStart?: number;
  waterFade?: number;
  glint?: number;
}

export function WaterRipple({
  src,
  strength = RIPPLE_STRENGTH,
  speed = RIPPLE_SPEED,
  waterStart = WATER_START,
  waterFade = WATER_FADE,
  glint = GLINT_AMOUNT,
}: WaterRippleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [ready, setReady] = useState(false);

  // Only run (and hold a WebGL context) while the hero is on screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!isVisible || !container) return;

    let cancelled = false;
    let raf = 0;
    let tabVisible = !document.hidden;
    let cleanup = () => {};

    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      let renderer: Renderer;
      try {
        const mobile = window.matchMedia("(max-width: 767px)").matches;
        renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, mobile ? MAX_DPR_MOBILE : MAX_DPR), alpha: false });
      } catch {
        return; // no WebGL: the static photo underneath stays
      }
      const gl = renderer.gl;
      if (!gl) return;

      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      gl.canvas.style.display = "block";
      container.replaceChildren(gl.canvas);

      const texture = new Texture(gl, { generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR });
      texture.image = img;

      // Ring buffer of the last MAX_RIPPLES ripples: x, y (texture uv), start time, pebble flag.
      // Start times far in the past mean "inactive". ogl only uploads array uniforms given as a plain Array
      // (a typed array is silently skipped), so this is a number[].
      const ripples: number[] = new Array(MAX_RIPPLES * 4).fill(0);
      for (let i = 0; i < MAX_RIPPLES; i++) ripples[i * 4 + 2] = -1000;
      let nextRipple = 0;

      const uniforms = {
        uTex: { value: texture },
        uTime: { value: 0 },
        uCover: { value: [1, 1] },
        uStrength: { value: strength },
        uSpeed: { value: speed },
        uWaterStart: { value: waterStart },
        uWaterFade: { value: waterFade },
        uGlint: { value: glint },
        uAspect: { value: img.naturalWidth / img.naturalHeight },
        uRipples: { value: ripples },
        uRippleStrength: { value: CURSOR_RIPPLE_STRENGTH },
        uRingSpeed: { value: RING_SPEED },
        uRingLife: { value: RING_LIFETIME },
        uSquash: { value: ELLIPSE_SQUASH },
        uCrest: { value: CREST_HIGHLIGHT },
        uPebble: { value: [PEBBLE_STRENGTH, PEBBLE_SPEED, PEBBLE_LIFETIME] },
      };
      const mesh = new Mesh(gl, {
        geometry: new Triangle(gl),
        program: new Program(gl, { vertex: VERT, fragment: FRAG, uniforms }),
      });

      const draw = (seconds: number) => {
        uniforms.uTime.value = seconds;
        renderer.render({ scene: mesh });
      };
      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h);
        // object-fit: cover, centred: scale the image to fill, crop what overflows
        const containerAspect = w / h;
        const imageAspect = img.naturalWidth / img.naturalHeight;
        uniforms.uCover.value =
          containerAspect > imageAspect ? [1, imageAspect / containerAspect] : [containerAspect / imageAspect, 1];
        draw(performance.now() / 1000);
      };

      // Drop a ring under a screen position, unless it is above the shoreline. Returns whether one was added.
      const spawnRipple = (clientX: number, clientY: number, pebble: boolean) => {
        const rect = container.getBoundingClientRect();
        if (!rect.width || !rect.height) return false;
        // Screen position to the image's texture uv, undoing the object-fit: cover crop
        const [coverX, coverY] = uniforms.uCover.value;
        const u = ((clientX - rect.left) / rect.width - 0.5) * coverX + 0.5;
        const v = ((1 - (clientY - rect.top) / rect.height) - 0.5) * coverY + 0.5;
        if (1 - v < waterStart) return false;
        const o = nextRipple * 4;
        ripples[o] = u;
        ripples[o + 1] = v;
        ripples[o + 2] = performance.now() / 1000;
        ripples[o + 3] = pebble ? 1 : 0;
        nextRipple = (nextRipple + 1) % MAX_RIPPLES;
        return true;
      };

      // Pointer input is read from the hero section, since the canvas itself ignores the pointer.
      // Touch drags are not tracked (they would fight with scrolling): on touch, only a tap makes a ripple.
      const section = container.closest("section");
      let lastX = -Infinity;
      let lastY = -Infinity;
      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        const rect = container.getBoundingClientRect();
        if (Math.hypot(e.clientX - lastX, e.clientY - lastY) < SPAWN_DISTANCE * rect.width) return;
        if (spawnRipple(e.clientX, e.clientY, false)) {
          lastX = e.clientX;
          lastY = e.clientY;
        }
      };
      const onClick = (e: MouseEvent) => {
        // A click fires for taps but not for scroll gestures. Never prevented, so the search bar etc. work as usual.
        spawnRipple(e.clientX, e.clientY, true);
      };

      const loop = (now: number) => {
        draw(now / 1000);
        raf = requestAnimationFrame(loop);
      };
      // Loop and pointer listeners run together, and only while the hero is visible and the tab is shown
      const start = () => {
        if (raf || !tabVisible) return;
        raf = requestAnimationFrame(loop);
        section?.addEventListener("pointermove", onPointerMove, { passive: true });
        section?.addEventListener("click", onClick, { passive: true });
      };
      const stop = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        section?.removeEventListener("pointermove", onPointerMove);
        section?.removeEventListener("click", onClick);
      };
      const onVisibility = () => {
        tabVisible = !document.hidden;
        if (tabVisible) start();
        else stop();
      };

      const ro = new ResizeObserver(resize);
      ro.observe(container);
      document.addEventListener("visibilitychange", onVisibility);
      resize();
      start();
      // Fade the canvas in over the photo once the first frame is drawn
      requestAnimationFrame(() => !cancelled && setReady(true));

      cleanup = () => {
        stop();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        gl.canvas.parentNode?.removeChild(gl.canvas);
        // Browsers cap live WebGL contexts, so release this one explicitly.
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    };
    img.onerror = () => {}; // texture failed to load: keep showing the static photo
    img.src = src;

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanup();
      setReady(false);
    };
  }, [isVisible, src, strength, speed, waterStart, waterFade, glint]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 transition-opacity duration-[600ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}

export default WaterRipple;
