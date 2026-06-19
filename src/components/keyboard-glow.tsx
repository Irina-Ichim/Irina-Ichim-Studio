"use client";

import { useEffect, useState } from "react";

// ─── Oleadas de teclas ────────────────────────────────────────────────────────
// Cada oleada (WAVE) es un grupo de teclas repartidas por TODA la pantalla
// que se iluminan y apagan juntas. Corren de forma independiente y simultánea.
// Resultado: en cualquier momento hay 2-4 zonas iluminadas a la vez.

const WAVES = [
  // Oleada A — diagonal top-left → bottom-right
  [
    { col: 0,  row: 0, color: "magenta" },
    { col: 3,  row: 2, color: "magenta" },
    { col: 7,  row: 3, color: "magenta" },
    { col: 11, row: 5, color: "magenta" },
    { col: 13, row: 6, color: "magenta" },
  ],

  // Oleada B — borde derecho + centro
  [
    { col: 13, row: 0, color: "indigo"  },
    { col: 10, row: 2, color: "indigo"  },
    { col: 6,  row: 4, color: "indigo"  },
    { col: 2,  row: 5, color: "indigo"  },
    { col: 0,  row: 6, color: "indigo"  },
  ],

  // Oleada C — franja superior + inferior
  [
    { col: 2,  row: 0, color: "purple"  },
    { col: 8,  row: 0, color: "purple"  },
    { col: 5,  row: 6, color: "purple"  },
    { col: 11, row: 6, color: "purple"  },
  ],

  // Oleada D — franja media horizontal
  [
    { col: 0,  row: 3, color: "cyan"    },
    { col: 4,  row: 3, color: "cyan"    },
    { col: 8,  row: 3, color: "cyan"    },
    { col: 12, row: 3, color: "cyan"    },
  ],

  // Oleada E — columna izquierda + columna derecha
  [
    { col: 0,  row: 1, color: "magenta" },
    { col: 1,  row: 4, color: "magenta" },
    { col: 12, row: 1, color: "cyan"    },
    { col: 13, row: 4, color: "cyan"    },
  ],

  // Oleada F — centro difuminado
  [
    { col: 5,  row: 1, color: "purple"  },
    { col: 8,  row: 2, color: "indigo"  },
    { col: 6,  row: 5, color: "magenta" },
    { col: 9,  row: 4, color: "purple"  },
  ],
];

// ─── Geometría ────────────────────────────────────────────────────────────────
const KEY_SIZE = 120;
const KEY_GAP  = 6;
const KEY_W    = KEY_SIZE - KEY_GAP * 2;
const KEY_H    = KEY_SIZE - KEY_GAP * 2;

const COLOR_CLASSES: Record<string, string> = {
  magenta: "key-glow-dark key-glow-magenta",
  indigo:  "key-glow-dark key-glow-indigo",
  purple:  "key-glow-dark key-glow-purple",
  cyan:    "key-glow-dark key-glow-cyan",
};

// ─── Timing ambiental ─────────────────────────────────────────────────────────
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

// Cada oleada encendida: 3–7s. Apagada: 5–14s. Arranque escalonado: 0–16s.
const WAVE_ON_RANGE:  [number, number] = [3000,  7000];
const WAVE_OFF_RANGE: [number, number] = [5000,  14000];
const INIT_RANGE:     [number, number] = [0,     16000];

// ─── Tecla estática (solo recibe si está activa) ──────────────────────────────
type KeyDef = { col: number; row: number; color: string };

function GlowKey({ col, row, color, active }: KeyDef & { active: boolean }) {
  const x = col * KEY_SIZE + KEY_GAP;
  const y = row * KEY_SIZE + KEY_GAP;
  const glowClass = COLOR_CLASSES[color] ?? COLOR_CLASSES.indigo;

  return (
    <div
      className={`absolute rounded-[14px] pointer-events-none transition-all duration-[1500ms] ease-in-out ${active ? glowClass : "key-inactive"}`}
      ref={(el) => {
        if (!el) return;
        el.style.left   = `${x}px`;
        el.style.top    = `${y}px`;
        el.style.width  = `${KEY_W}px`;
        el.style.height = `${KEY_H}px`;
      }}
    />
  );
}

// ─── Oleada: grupo de teclas con ciclo compartido ─────────────────────────────
function GlowWave({ keys, initDelay }: { keys: KeyDef[]; initDelay: number }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const cycle = () => {
      setActive(true);
      timeoutId = setTimeout(() => {
        setActive(false);
        timeoutId = setTimeout(cycle, rand(...WAVE_OFF_RANGE));
      }, rand(...WAVE_ON_RANGE));
    };

    timeoutId = setTimeout(cycle, initDelay);
    return () => clearTimeout(timeoutId);
  }, [initDelay]);

  return (
    <>
      {keys.map((k, i) => (
        <GlowKey key={i} {...k} active={active} />
      ))}
    </>
  );
}

// ─── Contenedor principal ─────────────────────────────────────────────────────
export function KeyboardGlow({ dark }: { dark: boolean }) {
  const [mounted, setMounted] = useState(false);
  // Delays fijos para cada oleada (calculados una sola vez en mount)
  const [initDelays] = useState<number[]>(() =>
    WAVES.map(() => rand(...INIT_RANGE))
  );

  useEffect(() => {
    window.requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted || !dark) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {WAVES.map((keys, i) => (
        <GlowWave key={i} keys={keys} initDelay={initDelays[i]} />
      ))}
    </div>
  );
}
