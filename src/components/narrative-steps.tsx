"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  { id: "01", title: "Detectamos el problema", description: "Auditoría profunda de ineficiencias y cuellos de botella operativos." },
  { id: "02", title: "Diseñamos el sistema", description: "Arquitectura escalable. Sin ruido. Solo lo que aporta valor directo." },
  { id: "03", title: "Construimos la solución", description: "Desarrollo técnico de alto rendimiento y diseño de interacciones precisas." },
  { id: "04", title: "Escalamos el negocio", description: "Métricas de adopción, optimización continua y crecimiento sostenible." },
];

export function NarrativeSteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const elements = containerRef.current.querySelectorAll(".narrative-step");
      const viewportHeight = window.innerHeight;
      
      let newActiveIndex = -1;
      
      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        // Check if element is somewhat in the middle of the viewport
        if (rect.top < viewportHeight * 0.6 && rect.bottom > viewportHeight * 0.3) {
          newActiveIndex = index;
        }
      });
      
      if (newActiveIndex !== -1 && newActiveIndex !== activeStep) {
        setActiveStep(newActiveIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on mount
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeStep]);

  return (
    <section className="relative max-w-4xl mx-auto px-6 py-32 z-10" aria-label="Metodología">
      <div className="absolute left-[39px] md:left-[43px] top-40 bottom-40 w-px bg-zinc-900/50" />
      
      <div ref={containerRef} className="flex flex-col gap-24 relative">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          
          return (
            <div 
              key={step.id} 
              className="narrative-step relative flex gap-8 md:gap-16 items-start group"
            >
              {/* Timeline Node */}
              <div className="relative flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-background border border-zinc-900 z-10 transition-luxe mt-1">
                <span 
                  className={`absolute inset-0 rounded-full transition-luxe blur-md ${
                    isActive ? "bg-pink-500/40 opacity-100" : "bg-transparent opacity-0"
                  }`} 
                />
                <span 
                  className={`w-2 h-2 rounded-full transition-luxe ${
                    isActive ? "bg-pink-500 shadow-[0_0_8px_rgba(255,0,128,0.8)]" : "bg-zinc-800"
                  }`} 
                />
              </div>

              {/* Content */}
              <div className={`flex flex-col gap-3 transition-luxe duration-1000 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-30 md:opacity-40 translate-y-4"
              }`}>
                <div className="flex items-baseline gap-4">
                  <span className={`font-mono text-sm tracking-widest transition-luxe ${
                    isActive ? "text-pink-500/80" : "text-zinc-700"
                  }`}>
                    {step.id}
                  </span>
                  <h3 className={`text-2xl md:text-3xl font-serif tracking-tight transition-luxe ${
                    isActive ? "text-white" : "text-zinc-500"
                  }`}>
                    {step.title}
                  </h3>
                </div>
                <p className={`text-base md:text-lg max-w-md leading-relaxed transition-luxe ${
                  isActive ? "text-zinc-400" : "text-zinc-600"
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
