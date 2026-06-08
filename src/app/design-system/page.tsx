"use client";

import React, { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Info, CheckCircle, AlertTriangle, Copy, Check } from "lucide-react";

// ============================================================================
// 1. HELPERS DE CONVERSIÓN DE COLOR OKLCH -> sRGB -> LUMINANCIA
// ============================================================================

interface OKLCH {
  l: number; // 0 a 1
  c: number; // 0 a 0.4
  h: number; // 0 a 360
}

// Convierte OKLCH a RGB lineal y luego a sRGB estándar (0-255)
function oklchToRgb(oklch: OKLCH): { r: number; g: number; b: number; hex: string } {
  const { l, c, h } = oklch;
  const hRad = (h * Math.PI) / 180;
  
  const oklabA = c * Math.cos(hRad);
  const oklabB = c * Math.sin(hRad);
  
  // Oklab a LMS lineal
  const l_ = Math.pow(l + 0.3963377774 * oklabA + 0.2158037573 * oklabB, 3);
  const m_ = Math.pow(l - 0.1055613458 * oklabA - 0.0638541728 * oklabB, 3);
  const s_ = Math.pow(l - 0.0894841775 * oklabA - 1.291485548 * oklabB, 3);
  
  // LMS lineal a RGB lineal
  let rL = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  let gL = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  let bL = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;
  
  // Clampear RGB lineal entre 0 y 1
  rL = Math.max(0, Math.min(1, rL));
  gL = Math.max(0, Math.min(1, gL));
  bL = Math.max(0, Math.min(1, bL));
  
  // RGB lineal a sRGB estándar
  const toSRgb = (v: number) => {
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  };
  
  const r = Math.round(toSRgb(rL) * 255);
  const g = Math.round(toSRgb(gL) * 255);
  const b = Math.round(toSRgb(bL) * 255);
  
  const toHex = (x: number) => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  
  return { r, g, b, hex };
}

// Calcula la luminancia relativa a partir de componentes RGB estándar (0-255)
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const rS = rgb.r / 255;
  const gS = rgb.g / 255;
  const bS = rgb.b / 255;
  
  const toLinear = (v: number) => {
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  
  const rL = toLinear(rS);
  const gL = toLinear(gS);
  const bL = toLinear(bS);
  
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

// Calcula el ratio de contraste entre dos colores OKLCH
function getContrastRatio(color1: OKLCH, color2: OKLCH): number {
  const rgb1 = oklchToRgb(color1);
  const rgb2 = oklchToRgb(color2);
  
  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

// ============================================================================
// 2. COMPONENTE INTERACTIVO DE PÁGINA (PLAYGROUND)
// ============================================================================

export default function DesignSystemPage() {
  const { theme } = useTheme();
  
  // 2.1. Estados para los colores en tiempo real
  // Valores iniciales basados en globals.css
  const [lightBg, setLightBg] = useState<OKLCH>({ l: 1.0, c: 0.0, h: 0 });
  const [lightFg, setLightFg] = useState<OKLCH>({ l: 0.145, c: 0.0, h: 0 });
  const [lightPri, setLightPri] = useState<OKLCH>({ l: 0.205, c: 0.0, h: 0 });
  
  const [darkBg, setDarkBg] = useState<OKLCH>({ l: 0.145, c: 0.0, h: 0 });
  const [darkFg, setDarkFg] = useState<OKLCH>({ l: 0.985, c: 0.0, h: 0 });
  const [darkPri, setDarkPri] = useState<OKLCH>({ l: 0.922, c: 0.0, h: 0 });
  
  // 2.2. Mostrar áreas de touch target e información
  const [showTargets, setShowTargets] = useState(false);
  const [copied, setCopied] = useState(false);

  // Determinar los colores activos en base al tema
  const activeBg = theme === "dark" ? darkBg : lightBg;
  const activeFg = theme === "dark" ? darkFg : lightFg;
  const activePri = theme === "dark" ? darkPri : lightPri;

  // Calcular contrastes dinámicos
  const textContrast = getContrastRatio(activeFg, activeBg);
  const primaryContrast = getContrastRatio(activePri, activeBg);
  const textVsPrimaryContrast = getContrastRatio(activeFg, activePri);

  // Convertir a RGB hexadecimal para previsualización inline
  const hexBg = oklchToRgb(activeBg).hex;
  const hexFg = oklchToRgb(activeFg).hex;
  const hexPri = oklchToRgb(activePri).hex;

  // Aplicar las variables CSS dinámicamente al DOM del playground
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.style.setProperty("--background", `oklch(${darkBg.l} ${darkBg.c} ${darkBg.h})`);
      root.style.setProperty("--foreground", `oklch(${darkFg.l} ${darkFg.c} ${darkFg.h})`);
      root.style.setProperty("--primary", `oklch(${darkPri.l} ${darkPri.c} ${darkPri.h})`);
      root.style.setProperty("--primary-foreground", `oklch(${darkBg.l} ${darkBg.c} ${darkBg.h})`);
    } else {
      root.style.setProperty("--background", `oklch(${lightBg.l} ${lightBg.c} ${lightBg.h})`);
      root.style.setProperty("--foreground", `oklch(${lightFg.l} ${lightFg.c} ${lightFg.h})`);
      root.style.setProperty("--primary", `oklch(${lightPri.l} ${lightPri.c} ${lightPri.h})`);
      root.style.setProperty("--primary-foreground", `oklch(${lightBg.l} ${lightBg.c} ${lightBg.h})`);
    }
  }, [theme, lightBg, lightFg, lightPri, darkBg, darkFg, darkPri]);

  const copyCssToClipboard = () => {
    const cssText = `:root {
  --background: oklch(${lightBg.l} ${lightBg.c} ${lightBg.h});
  --foreground: oklch(${lightFg.l} ${lightFg.c} ${lightFg.h});
  --primary: oklch(${lightPri.l} ${lightPri.c} ${lightPri.h});
  --primary-foreground: oklch(${lightBg.l} ${lightBg.c} ${lightBg.h});
}

.dark {
  --background: oklch(${darkBg.l} ${darkBg.c} ${darkBg.h});
  --foreground: oklch(${darkFg.l} ${darkFg.c} ${darkFg.h});
  --primary: oklch(${darkPri.l} ${darkPri.c} ${darkPri.h});
  --primary-foreground: oklch(${darkBg.l} ${darkBg.c} ${darkBg.h});
}`;
    
    navigator.clipboard.writeText(cssText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Renderizador de un slider de control OKLCH
  const renderSlider = (
    label: string, 
    value: number, 
    min: number, 
    max: number, 
    step: number, 
    onChange: (val: number) => void
  ) => {
    const sliderId = `slider-${label.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${value.toString().replace(".", "-")}`;
    return (
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <label htmlFor={sliderId}>{label}</label>
          <span>{value}</span>
        </div>
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
        />
      </div>
    );
  };

  const renderColorTuner = (
    title: string, 
    color: OKLCH, 
    setColor: React.Dispatch<React.SetStateAction<OKLCH>>,
    previewHex: string
  ) => {
    return (
      <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold">{title}</h4>
          <div 
            ref={(el) => {
              if (el) el.style.backgroundColor = previewHex;
            }}
            className="w-6 h-6 rounded-md border border-zinc-300 dark:border-zinc-700 shadow-sm"
          />
        </div>
        {renderSlider("L (Luminosidad)", color.l, 0, 1, 0.005, (l) => setColor({ ...color, l }))}
        {renderSlider("C (Croma)", color.c, 0, 0.4, 0.005, (c) => setColor({ ...color, c }))}
        {renderSlider("H (Matiz / Hue)", color.h, 0, 360, 1, (h) => setColor({ ...color, h }))}
        <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 text-right">
          oklch({color.l} {color.c} {color.h})
        </div>
      </div>
    );
  };

  const renderContrastBadge = (ratio: number, expected: number = 7) => {
    const passed = ratio >= expected;
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
        passed 
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
      }`}>
        {passed ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
        <span>
          Ratio: {ratio}:1 {passed ? `(Pasa AAA >= ${expected}:1)` : `(Falla AAA < ${expected}:1)`}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col p-8 md:p-16 gap-8 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      
      {/* =====================================================================
          HEADER & THEME CONTROLS
          ===================================================================== */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Playground del Sistema de Diseño</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Ajusta los parámetros de color OKLCH interactivos y calibra la accesibilidad WCAG AAA.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTargets(!showTargets)}
            className={`px-4 h-11 text-xs font-semibold rounded-full border transition-all ${
              showTargets 
                ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                : "bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50 dark:bg-black dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-900"
            }`}
          >
            {showTargets ? "Ocultar Áreas Táctiles" : "Mostrar Áreas Táctiles"}
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* =====================================================================
          CALIBRADOR DE COLOR EN VIVO
          ===================================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controles de Entrada */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold tracking-tight">Calibradores OKLCH (Tema Activo: {theme === "dark" ? "Oscuro" : "Claro"})</h2>
            <div className="text-xs text-zinc-400 dark:text-zinc-500">
              Desliza para cambiar y ver los componentes del Playground actualizarse.
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {theme === "dark" ? (
              <>
                {renderColorTuner("Fondo (--background)", darkBg, setDarkBg, hexBg)}
                {renderColorTuner("Texto (--foreground)", darkFg, setDarkFg, hexFg)}
                {renderColorTuner("Primario (--primary)", darkPri, setDarkPri, hexPri)}
              </>
            ) : (
              <>
                {renderColorTuner("Fondo (--background)", lightBg, setLightBg, hexBg)}
                {renderColorTuner("Texto (--foreground)", lightFg, setLightFg, hexFg)}
                {renderColorTuner("Primario (--primary)", lightPri, setLightPri, hexPri)}
              </>
            )}
          </div>
        </div>

        {/* Indicadores de Contraste en Caliente */}
        <div className="lg:col-span-4 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Validador de Contraste en Caliente</h3>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Texto vs Fondo</span>
                <span className="font-mono">{textContrast}:1</span>
              </div>
              {renderContrastBadge(textContrast, 7.0)}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Botón Primario vs Fondo</span>
                <span className="font-mono">{primaryContrast}:1</span>
              </div>
              {renderContrastBadge(primaryContrast, 3.0)}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Texto de Botón vs Fondo de Botón</span>
                <span className="font-mono">{textVsPrimaryContrast}:1</span>
              </div>
              {renderContrastBadge(textVsPrimaryContrast, 4.5)}
            </div>
          </div>

          <button
            onClick={copyCssToClipboard}
            className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 font-semibold transition-all text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copiado en Portapapeles</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Variables CSS</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* =====================================================================
          PREVISUALIZACIÓN DE COMPONENTES E INTERFAZ
          ===================================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-zinc-200 dark:border-zinc-800 pt-8">
        
        {/* Tipografías y Textos Semánticos */}
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-bold tracking-tight">Muestrario de Tipografía Accesible</h2>
          
          <div className="flex flex-col gap-4 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-900 pb-4">
              <h1 className="text-3xl font-extrabold tracking-tight">H1: Título de Sección Principal</h1>
              <span className="text-[10px] font-mono text-zinc-400">text-3xl / font-extrabold / tracking-tight</span>
            </div>
            
            <div className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-900 pb-4">
              <h2 className="text-xl font-bold tracking-tight">H2: Subtítulo Destacado de Contenido</h2>
              <span className="text-[10px] font-mono text-zinc-400">text-xl / font-bold / tracking-tight</span>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-base leading-relaxed">
                Este es un párrafo de texto normal utilizando la tipografía sans-serif. Tiene un interlineado de 1.5 
                (`leading-relaxed`) para asegurar una legibilidad cómoda para personas con dificultades cognitivas o de visión reducida.
              </p>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Este es un bloque de descripción secundaria o metadatos utilizando la variable de contraste secundario. 
                Debe calibrarse para mantener el ratio de lectura accesible.
              </p>
            </div>
          </div>
        </div>

        {/* Componentes Interactivos y Touch Targets */}
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-bold tracking-tight">Grilla de Estados de Botón & Touch Targets</h2>
          
          <div className="flex flex-col gap-6 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 justify-center">
            
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Variantes y Estados Similares</h3>
              <div className="flex flex-wrap gap-4 items-center">
                
                {/* Botón Default */}
                <div className="flex flex-col gap-1.5 items-center">
                  <div className="relative">
                    <Button variant="default">Primario</Button>
                    {showTargets && (
                      <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 border-2 border-dashed border-pink-500 rounded-md pointer-events-none flex items-center justify-center">
                        <span className="absolute -top-4 text-[9px] font-mono font-bold text-pink-500 bg-white dark:bg-black px-1">44px</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400">Default</span>
                </div>

                {/* Botón Secondary */}
                <div className="flex flex-col gap-1.5 items-center">
                  <div className="relative">
                    <Button variant="secondary">Secundario</Button>
                    {showTargets && (
                      <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 border-2 border-dashed border-pink-500 rounded-md pointer-events-none" />
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400">Secondary</span>
                </div>

                {/* Botón Outline */}
                <div className="flex flex-col gap-1.5 items-center">
                  <div className="relative">
                    <Button variant="outline">Bordeado</Button>
                    {showTargets && (
                      <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 border-2 border-dashed border-pink-500 rounded-md pointer-events-none" />
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400">Outline</span>
                </div>

                {/* Botón Ghost */}
                <div className="flex flex-col gap-1.5 items-center">
                  <div className="relative">
                    <Button variant="ghost">Fantasma</Button>
                    {showTargets && (
                      <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 border-2 border-dashed border-pink-500 rounded-md pointer-events-none" />
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400">Ghost</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-zinc-100 dark:border-zinc-900 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Comprobador de Altura y Touch Target AAA</h3>
              
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-xs flex flex-col gap-2.5">
                <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                  <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <p>
                    Activa la visualización de áreas táctiles para observar el contorno rosa de **44x44px** (el tamaño mínimo 
                    físico operable recomendado por la pauta WCAG 2.2).
                  </p>
                </div>
                <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                  <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <p>
                    Los botones por defecto tienen una altura de 40px (`h-10`) lo que requiere un área de margen/padding 
                    vertical de al menos 2px adicionales arriba y abajo para cumplir con el touch target del dedo sin colisionar con otros elementos.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
      
    </div>
  );
}
