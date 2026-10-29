"use client";

import { useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

/**
 * Atmospheric WebGL light rays. Fills its positioned parent; draws only while on screen, holds a single
 * WebGL context at a time and releases it when it leaves the viewport.
 */

export type RaysOrigin =
  | "top-center"
  | "top-left"
  | "top-right"
  | "right"
  | "left"
  | "bottom-center"
  | "bottom-right"
  | "bottom-left";

interface LightRaysProps {
  raysOrigin?: RaysOrigin;
  /** Hex color of the rays. */
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  /** Rays tilt towards the pointer while it is over the parent element. */
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
}

const DEFAULT_COLOR = "#ffffff";
const MOUSE_SMOOTHING = 0.95;
// Time (seconds) shown by the single still frame when the visitor prefers reduced motion.
const STILL_FRAME_TIME = 2;

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
};

const getAnchorAndDir = (
  origin: RaysOrigin,
  w: number,
  h: number,
): { anchor: [number, number]; dir: [number, number] } => {
  const outside = 0.2;
  switch (origin) {
    case "top-left":
      return { anchor: [0, -outside * h], dir: [0.7, 0.7] };
    case "top-right":
      return { anchor: [w, -outside * h], dir: [-0.7, 0.7] };
    case "left":
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case "right":
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case "bottom-left":
      return { anchor: [0, (1 + outside) * h], dir: [0.7, -0.7] };
    case "bottom-center":
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case "bottom-right":
      return { anchor: [w, (1 + outside) * h], dir: [-0.7, -0.7] };
    default:
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

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
  uniform float iTime;
  uniform vec2  iResolution;
  uniform vec2  rayPos;
  uniform vec2  rayDir;
  uniform vec3  raysColor;
  uniform float raysSpeed;
  uniform float lightSpread;
  uniform float rayLength;
  uniform float pulsating;
  uniform float fadeDistance;
  uniform float saturation;
  uniform vec2  mousePos;
  uniform float mouseInfluence;
  uniform float noiseAmount;
  uniform float distortion;
  varying vec2 vUv;

  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                    float seedA, float seedB, float speed) {
    vec2 sourceToCoord = coord - raySource;
    vec2 dirNorm = normalize(sourceToCoord);
    float cosAngle = dot(dirNorm, rayRefDirection);

    float d = distortion * sin(iTime * 1.5 + length(sourceToCoord) * 0.005);
    float distortedAngle = cosAngle + d;

    float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
    float distance = length(sourceToCoord);
    float maxDistance = max(iResolution.x, iResolution.y) * rayLength;
    float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);

    float fadeFactor = fadeDistance * max(iResolution.x, iResolution.y);
    float fadeFalloff = clamp((fadeFactor - distance) / fadeFactor, 0.0, 1.0);

    float pulse = pulsating > 0.5 ? (0.85 + 0.15 * sin(iTime * speed * 4.0)) : 1.0;

    float baseStrength = clamp(
      (0.5 + 0.2 * sin(distortedAngle * seedA + iTime * speed)) +
      (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed * 0.8)),
      0.0, 1.0
    );

    return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
  }

  void main() {
    // gl_FragCoord has y pointing up; flip it so origins and the pointer use screen coordinates (y down).
    vec2 coord = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y);

    vec2 finalRayDir = normalize(rayDir);
    if (mouseInfluence > 0.0) {
      vec2 mouseScreenPos = mousePos * iResolution.xy;
      vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
      finalRayDir = normalize(mix(finalRayDir, mouseDirection, mouseInfluence));
    }

    float r1 = rayStrength(rayPos, finalRayDir, coord, 45.2, 31.4, 0.8 * raysSpeed);
    float r2 = rayStrength(rayPos, finalRayDir, coord, 28.5, 19.8, 1.2 * raysSpeed);
    float r3 = rayStrength(rayPos, finalRayDir, coord, 12.1, 56.2, 0.5 * raysSpeed);

    float combined = (r1 * 0.4 + r2 * 0.4 + r3 * 0.2);
    combined = pow(combined, 0.7);
    combined *= 1.5;
    vec3 finalColor = raysColor * combined;

    if (noiseAmount > 0.0) {
      float n = noise(coord * 0.01 + iTime * 0.05);
      finalColor *= (1.0 - noiseAmount + noiseAmount * n);
    }

    if (saturation != 1.0) {
      float gray = dot(finalColor, vec3(0.299, 0.587, 0.114));
      finalColor = mix(vec3(gray), finalColor, saturation);
    }

    gl_FragColor = vec4(finalColor, combined);
  }
`;

export function LightRays({
  raysOrigin = "top-center",
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.02,
  distortion = 0.05,
  className = "",
}: LightRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Only run (and hold a WebGL context) while the container is on screen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!isVisible || !container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tracksMouse = followMouse && mouseInfluence > 0 && !reducedMotion;

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 1.5), alpha: true });
    const gl = renderer.gl;
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";
    container.replaceChildren(gl.canvas);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      rayPos: { value: [0, 0] },
      rayDir: { value: [0, 1] },
      raysColor: { value: hexToRgb(raysColor) },
      raysSpeed: { value: raysSpeed },
      lightSpread: { value: lightSpread },
      rayLength: { value: rayLength },
      pulsating: { value: pulsating ? 1.0 : 0.0 },
      fadeDistance: { value: fadeDistance },
      saturation: { value: saturation },
      mousePos: { value: [0.5, 0.5] },
      mouseInfluence: { value: tracksMouse ? mouseInfluence : 0 },
      noiseAmount: { value: noiseAmount },
      distortion: { value: distortion },
    };
    const mesh = new Mesh(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, { vertex: VERT, fragment: FRAG, uniforms, transparent: true }),
    });

    // Pointer target and its smoothed value; leaving the section sets the target back to the centre.
    const target = { x: 0.5, y: 0.5 };
    const smooth = { x: 0.5, y: 0.5 };
    let raf = 0;

    const draw = (seconds: number) => {
      uniforms.iTime.value = seconds;
      renderer.render({ scene: mesh });
    };

    const place = () => {
      const { clientWidth: wCSS, clientHeight: hCSS } = container;
      if (!wCSS || !hCSS) return;
      renderer.setSize(wCSS, hCSS);
      const w = wCSS * renderer.dpr;
      const h = hCSS * renderer.dpr;
      const { anchor, dir } = getAnchorAndDir(raysOrigin, w, h);
      uniforms.iResolution.value = [w, h];
      uniforms.rayPos.value = anchor;
      uniforms.rayDir.value = dir;
      if (reducedMotion) draw(STILL_FRAME_TIME);
    };

    const loop = (t: number) => {
      smooth.x = smooth.x * MOUSE_SMOOTHING + target.x * (1 - MOUSE_SMOOTHING);
      smooth.y = smooth.y * MOUSE_SMOOTHING + target.y * (1 - MOUSE_SMOOTHING);
      uniforms.mousePos.value = [smooth.x, smooth.y];
      draw(t * 0.001);
      raf = requestAnimationFrame(loop);
    };

    // The pointer is tracked on the section (the container's parent), since the rays layer ignores the mouse.
    const section = container.parentElement;
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = (e.clientY - rect.top) / rect.height;
    };
    const onLeave = () => {
      target.x = 0.5;
      target.y = 0.5;
    };
    if (tracksMouse && section) {
      section.addEventListener("mousemove", onMove);
      section.addEventListener("mouseleave", onLeave);
    }

    const ro = new ResizeObserver(place);
    ro.observe(container);
    place();
    if (!reducedMotion) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      section?.removeEventListener("mousemove", onMove);
      section?.removeEventListener("mouseleave", onLeave);
      gl.canvas.parentNode?.removeChild(gl.canvas);
      // Browsers cap live WebGL contexts, so release this one explicitly.
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    isVisible,
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
  ]);

  return <div ref={containerRef} className={`pointer-events-none absolute inset-0 h-full w-full overflow-hidden ${className}`} />;
}

export default LightRays;
