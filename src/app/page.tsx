"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Cpu, ArrowRight, Eye, MousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [showDemoGrid, setShowDemoGrid] = useState(false);

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b from-zinc-50 via-white to-zinc-100/50 dark:from-[#050505] dark:via-[#08080a] dark:to-[#020203] transition-colors duration-300 relative overflow-hidden">
      
      {/* Patrón de Rejilla Brillante de Fondo (Glow & Ambient effects) */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-[160px] pointer-events-none" 
        aria-hidden="true"
      />

      {/* =====================================================================
          HERO SECTION
          ===================================================================== */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24 flex flex-col items-center text-center">
        
        {/* Badge superior premium */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 bg-white/50 text-zinc-800 dark:border-zinc-800/80 dark:bg-black/40 dark:text-zinc-200 text-xs font-semibold backdrop-blur-md mb-8 animate-fade-in shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400" />
          <span>Diseño Web Premium & Accesibilidad AAA</span>
        </div>

        {/* Encabezado Principal */}
        <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-700 dark:from-white dark:via-zinc-100 dark:to-zinc-500 leading-[1.1] mb-6">
          Interfaces exclusivas que se sienten vivas.
        </h1>

        {/* Descripción */}
        <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-zinc-600 dark:text-zinc-400 mb-10">
          Diseño contemporáneo y desarrollo web a medida para marcas digitales. 
          Garantizamos una estética premium de alto brillo, accesibilidad rigurosa y optimización IA.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button 
            variant="default"
            size="lg"
            className="w-full sm:w-auto h-12 shadow-lg shadow-black/10 dark:shadow-white/5"
            onClick={() => setShowDemoGrid(!showDemoGrid)}
          >
            <span>Probar Interactivos</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Link href="/design-system" passHref legacyBehavior>
            <Button 
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-black/30 backdrop-blur"
            >
              Ver Design System
            </Button>
          </Link>
        </div>
      </section>

      {/* =====================================================================
          SECCIÓN DEMOSTRACIÓN: NEGRO BRILLANTE / CLARO BRILLANTE
          ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 text-zinc-900 dark:text-zinc-50">
            Contraste de Brillo Inteligente
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Explora las diferencias en el tratamiento del reflejo del fondo, los bordes metálicos 
            y la legibilidad perfecta tanto en entornos oscuros como claros.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Tarjeta Claro Brillante */}
          <div className="group relative p-8 rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-100/80 transition-all duration-500 flex flex-col justify-between min-h-[380px] overflow-hidden">
            {/* Efecto de brillo de fondo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-zinc-200/40 via-zinc-100/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            
            <div className="relative flex flex-col gap-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-800 shadow-sm">
                <Sparkles className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Claro Brillante</h3>
              <p className="text-sm leading-relaxed text-zinc-600">
                Un fondo blanco perlado refinado con bordes nítidos y sombras suaves y difusas. 
                Utiliza transparencias vítreas que se integran en la interfaz aportando luz y limpieza visual.
              </p>
            </div>

            <div className="relative mt-8 p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-zinc-400">Card Background</span>
                <span className="font-semibold text-zinc-800">#FFFFFF / #FAFAFA</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-zinc-400">Glass Border</span>
                <span className="font-semibold text-zinc-800">rgba(0,0,0, 0.08)</span>
              </div>
            </div>
          </div>

          {/* Tarjeta Negro Brillante */}
          <div className="group relative p-8 rounded-3xl border border-zinc-800/80 bg-zinc-950/80 shadow-2xl shadow-black/60 transition-all duration-500 flex flex-col justify-between min-h-[380px] overflow-hidden">
            {/* Efecto de brillo de fondo (Negro Brillante) */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-zinc-800/20 via-zinc-900/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            
            <div className="relative flex flex-col gap-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800/60 flex items-center justify-center text-zinc-200 shadow-sm">
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-50">Negro Brillante</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Un negro obsidiana profundo con un matiz metálico y reflejos sutiles. Los bordes 
                tienen un contraste calibrado que delimita perfectamente el volumen espacial, evitando la pérdida de contraste.
              </p>
            </div>

            <div className="relative mt-8 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/40 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-zinc-500">Card Background</span>
                <span className="font-semibold text-zinc-200">#08080A / #020203</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-zinc-500">Glass Border</span>
                <span className="font-semibold text-zinc-200">rgba(255,255,255, 0.08)</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================================
          SECCIÓN DETALLE COMPONENTES (ACCESIBILIDAD & COMPORTAMIENTO)
          ===================================================================== */}
      {showDemoGrid && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-down">
          <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white/40 dark:bg-black/30 backdrop-blur-xl">
            <h3 className="text-lg font-bold mb-6 text-zinc-900 dark:text-zinc-50">Interactivos del Sistema de Diseño</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Demo 1: Área Táctil AAA */}
              <div className="flex flex-col gap-3 p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  <MousePointer className="w-4 h-4 text-primary" />
                  <span>Área Táctil Activa</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Prueba a pulsar en los bordes invisibles. Los botones compactos responden en un área completa de 44x44px.
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <Button size="xs" variant="default">Compacto XS</Button>
                  <Button size="sm" variant="outline">Compacto SM</Button>
                </div>
              </div>

              {/* Demo 2: Croma & Contraste 7:1 */}
              <div className="flex flex-col gap-3 p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Cumplimiento Legal y RGPD</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Todas las llamadas a la acción enlazan correctamente a políticas oficiales y declaran el tratamiento de datos.
                </p>
                <div className="flex gap-4 mt-2">
                  <Link href="/privacidad" className="text-xs font-semibold text-primary underline">Política de Privacidad</Link>
                  <Link href="/cookies" className="text-xs font-semibold text-primary underline">Cookies</Link>
                </div>
              </div>

              {/* Demo 3: GEO y Crawlability */}
              <div className="flex flex-col gap-3 p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span>Rastreo para IA</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Disponemos de documentación fail-fast en texto plano para indexadores semánticos de LLMs.
                </p>
                <div className="mt-2">
                  <a href="/llms.txt" className="text-xs font-semibold inline-flex items-center gap-1 hover:underline">
                    <span>Ver llms.txt</span>
                    <Eye className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

    </div>
  );
}
