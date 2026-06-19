"use client";

import { useEffect, useRef } from "react";

// ─── Brand colors ─────────────────────────────────────────────────────────────
// Matches --pink-bright, --pink, --pink-dark, plus deep purple for the "back" side
const C_FRONT  = { r: 255, g: 100, b: 160 };  // #ff6aa0 — pink-bright (facing us)
const C_MID    = { r: 232, g: 68,  b: 124 };  // #e8447c — pink
const C_DARK   = { r: 194, g: 32,  b: 107 };  // #c2206b — pink-dark
const C_BACK   = { r: 55,  g: 8,   b: 65  };  // deep purple (away from us)

/** Interpolates color along the front→back axis (t: 0=back, 1=front). */
function helixColor(t: number): [number, number, number] {
  if (t < 0.35) {
    const s = t / 0.35;
    return [
      Math.round(C_BACK.r + (C_DARK.r - C_BACK.r) * s),
      Math.round(C_BACK.g + (C_DARK.g - C_BACK.g) * s),
      Math.round(C_BACK.b + (C_DARK.b - C_BACK.b) * s),
    ];
  }
  if (t < 0.72) {
    const s = (t - 0.35) / 0.37;
    return [
      Math.round(C_DARK.r + (C_MID.r - C_DARK.r) * s),
      Math.round(C_DARK.g + (C_MID.g - C_DARK.g) * s),
      Math.round(C_DARK.b + (C_MID.b - C_DARK.b) * s),
    ];
  }
  const s = (t - 0.72) / 0.28;
  return [
    Math.round(C_MID.r + (C_FRONT.r - C_MID.r) * s),
    Math.round(C_MID.g + (C_FRONT.g - C_MID.g) * s),
    Math.round(C_MID.b + (C_FRONT.b - C_MID.b) * s),
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WaveHelix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    // Respect prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = mq.matches;
    const onMq = (e: MediaQueryListEvent) => { reduced = e.matches; };
    mq.addEventListener("change", onMq);

    // ── Resize ──────────────────────────────────────────────────────────────
    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = Math.round(canvas.offsetWidth  * dpr);
      canvas.height = Math.round(canvas.offsetHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // ── Render ──────────────────────────────────────────────────────────────
    const render = (now: number) => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (!W || !H) { rafId = requestAnimationFrame(render); return; }

      ctx.clearRect(0, 0, W, H);

      // Animation time (slow rotation)
      const t = reduced ? 0 : (now * 0.00028) % (Math.PI * 2);

      // ── Helix parameters ──────────────────────────────────────────────────
      const cx    = W * 0.76;                           // Horizontal center
      const maxR  = Math.min(W * 0.20, H * 0.20, 205); // Maximum radius
      const nTurn = 4.5;   // Full rotations top→bottom
      const nWaist = 4;    // Bulge/constriction cycles (diabolo effect)
      const nWire  = 440;  // Number of longitudinal threads
      const nSeg   = 200;  // Points per thread

      for (let k = 0; k < nWire; k++) {
        // Base angle of this thread around the cylinder
        const u0 = (k / nWire) * Math.PI * 2;

        // How "front-facing" is this thread?
        // cos(u0 + t) = 1 → fully front, -1 → fully back
        const cosU = Math.cos(u0 + t);
        const front = (cosU + 1) * 0.5;  // 0=back, 1=front

        // Skip the deepest back threads (they'd be invisible and waste GPU)
        if (front < 0.06) continue;

        // Color and opacity
        const [r, g, b] = helixColor(front);
        const alpha = 0.012 + 0.80 * Math.pow(front, 1.25);

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.78;

        for (let j = 0; j <= nSeg; j++) {
          const v = j / nSeg;               // Vertical progress 0→1
          const y = v * H;

          // Envelope function: makes the helix "breathe" (wide belly, narrow waist)
          const env = 0.16 + 0.84 * Math.pow(
            Math.abs(Math.sin(v * Math.PI * nWaist)), 0.55
          );
          const R = maxR * env;

          // Horizontal position of this thread at this height
          const theta = u0 + v * nTurn * Math.PI * 2 + t;
          const x = cx + R * Math.cos(theta);

          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      rafId = requestAnimationFrame(render);
    };

    setSize();
    window.addEventListener("resize", setSize);
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", setSize);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
