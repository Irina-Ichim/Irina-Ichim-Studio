import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NarrativeSteps } from "@/components/narrative-steps";
import { HeroBackground } from "@/components/hero-background";

export default function Home() {

  return (
    <div className="flex-1 bg-background text-foreground relative overflow-hidden pb-24">
      {/* ── HERO CONTAINER — fondo negro ónix + hélice de ondas ── */}
      <div className="relative w-full border-b border-zinc-900/40 overflow-hidden">

        {/* Canvas: Fondo dinámico del Hero R3F */}
        <HeroBackground />

        {/* ── HERO SECTION ── */}
        <section id="inicio" className="relative max-w-7xl mx-auto px-6 pt-12 md:pt-24 pb-20 z-10" aria-label="Introducción">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Wording & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <span className="text-zinc-500 font-mono text-[11px] tracking-[0.3em] uppercase mb-4 flex items-center gap-2 cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500/80 animate-pulse shadow-[0_0_6px_rgba(255,0,128,0.5)]" />
              AI SYSTEMS STUDIO
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-[5.5rem] font-bold font-serif leading-[1.1] text-white tracking-tight mb-8">
              Convertimos complejidad en{" "}
              <span className="text-zinc-400 hover:text-pink-500 hover:drop-shadow-[0_0_8px_rgba(255,0,128,0.4)] italic block sm:inline font-serif font-medium transition-luxe cursor-default">sistemas digitales</span>{" "}
              que generan impacto.
            </h1>

            <p className="max-w-xl text-zinc-400 text-base md:text-lg leading-relaxed mb-10">
              Diseñamos y construimos productos, arquitecturas y automatizaciones con IA que escalan negocios y mejoran la vida de las personas.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <a href="#proyectos">
                <Button 
                  variant="outline"
                  size="lg"
                  className="bg-zinc-950/80 text-zinc-300 border border-zinc-800 hover:border-pink-500/50 hover:text-white hover:bg-pink-950/10 hover:shadow-[0_0_20px_rgba(255,0,128,0.18)] font-medium px-8 h-13 rounded-lg group transition-luxe"
                >
                  <span>Ver proyectos</span>
                  <ArrowRight className="w-4 h-4 ml-1 text-zinc-500 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                </Button>
              </a>

              <a href="#servicios" className="text-sm font-semibold tracking-wider text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group">
                <span>Cómo trabajo</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-zinc-600 group-hover:text-pink-500 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-luxe">
                  <path d="M7 7h10v10M7 17L17 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Mockup Showcase (Static) */}
          <div className="lg:col-span-6 relative w-full h-[520px] flex items-center justify-center">
            {/* 1. Architecture Flow Card */}
            <div className="absolute top-4 left-6 w-[75%] bg-card/90 border border-zinc-900/50 rounded-xl p-4 backdrop-blur-md z-10">
              <div className="flex justify-between items-center border-b border-zinc-900/50 pb-2 mb-3">
                <span className="text-[10px] tracking-wider text-zinc-500 uppercase font-mono">Arquitectura</span>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-zinc-800" />
                  <span className="w-2 h-2 rounded-full bg-zinc-800" />
                  <span className="w-2 h-2 rounded-full bg-zinc-800" />
                </div>
              </div>
              {/* Architecture blocks */}
              <div className="flex flex-col gap-3 py-1 font-mono text-[9px]">
                <div className="flex justify-between gap-2">
                  <div className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded px-2 py-1.5 flex-1 text-center">APP</div>
                  <div className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded px-2 py-1.5 flex-1 text-center">API GATEWAY</div>
                  <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 rounded px-2 py-1.5 flex-1 text-center">
                    AI SERVICE
                  </div>
                </div>
                <div className="flex justify-center my-0.5 text-zinc-700">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <path d="M12 4v16m0 0l-4-4m4 4l4-4" />
                  </svg>
                </div>
                <div className="flex justify-between gap-2">
                  <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 rounded px-2 py-1.5 flex-1 text-center">DATABASE</div>
                  <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 rounded px-2 py-1.5 flex-1 text-center">VECTOR DB</div>
                </div>
              </div>
            </div>

            {/* 2. Mobile App Overlay */}
            <div className="absolute top-12 right-2 w-[180px] h-[280px] bg-background border border-zinc-900/60 rounded-2xl p-4 z-20 flex flex-col justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="font-mono text-[9px] text-zinc-400">tv.mtch</span>
              </div>
              <div className="my-auto">
                <h4 className="text-xs font-serif font-medium text-white mb-2 leading-snug">Conecta. Comparte. Colabora.</h4>
                <div className="w-6 h-0.5 bg-zinc-800 mb-4" />
                <button className="w-full py-1.5 bg-zinc-900 text-zinc-300 rounded text-[9px] font-medium mb-1.5">Crear cuenta</button>
                <button className="w-full py-1.5 border border-zinc-850 text-zinc-400 rounded text-[9px]">Iniciar sesión</button>
              </div>
            </div>

            {/* 3. Code Snippet Card ("EXTRACTO REAL") */}
            <div className="absolute bottom-6 left-2 w-[65%] bg-card/95 border border-zinc-900/50 rounded-xl p-4 font-mono text-[9px] text-zinc-400 z-20">
              <div className="flex justify-between items-center border-b border-zinc-900/50 pb-2 mb-2.5">
                <span className="text-[9px] tracking-wider text-zinc-500 uppercase font-mono">Extracto Real</span>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
                </div>
              </div>
              <pre className="overflow-x-auto text-[8px] leading-relaxed text-zinc-300">
{`1  import { NextResponse } from 'next/server'
2  
3  export async function POST(req: Request) {
4    const { prompt } = await req.json()
5    try {
6      const completion = await openai.chat.completions({
7        model: 'gpt-4o-mini',
8        messages: [{ role: 'user', content: prompt }]
9      })
10     return NextResponse.json(completion.choices[0])
11   }
12 }`}
              </pre>
            </div>

            {/* 4. IA + Automatización Card */}
            <div className="absolute bottom-16 right-6 w-[200px] bg-card/95 border border-zinc-900/50 rounded-xl p-4 z-10">
              <span className="text-[8px] tracking-widest text-zinc-500 font-mono block mb-3 uppercase">IA + AUTOMATIZACIÓN</span>
              <ul className="flex flex-col gap-2.5 text-[9px] font-medium text-zinc-400">
                <li className="flex items-center gap-2 cursor-default text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  Procesamiento natural
                </li>
                <li className="flex items-center gap-2 cursor-default text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  Automatización de flujos de trabajo
                </li>
                <li className="flex items-center gap-2 cursor-default text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  Análisis predictivo
                </li>
                <li className="flex items-center gap-2 cursor-default text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  Integración de sistemas
                </li>
              </ul>
            </div>

            {/* 5. FemCoders Mini Banner */}
            <div className="absolute -bottom-2 right-12 w-[160px] bg-zinc-950/90 border border-zinc-900 rounded-xl p-3 backdrop-blur z-20 flex flex-col gap-2">
              <span className="text-[8px] tracking-wider text-zinc-500 font-semibold font-mono">FemCoders Club</span>
              <p className="text-[8px] text-zinc-400 leading-snug">Comunidad y educación para mujeres en tecnología.</p>
              <div className="text-[8px] text-zinc-400 font-semibold flex items-center gap-1 mt-1">
                <span>Quiero unirme</span>
                <span className="text-zinc-600">➔</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      <NarrativeSteps />

      {/* ── TECNOLOGÍAS & NOTION SYSTEMS ROW ── */}
      <section className="relative max-w-7xl mx-auto px-6 py-12 z-10 border-t border-zinc-900/60" aria-label="Tecnologías">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Tech list */}
          <div className="lg:col-span-7 flex flex-col items-start gap-4">
            <span className="text-[10px] tracking-[0.25em] text-zinc-600 font-mono uppercase">TECNOLOGÍAS</span>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-zinc-500 font-mono text-sm">
              <span className="hover:text-zinc-350 transition-colors cursor-default">NEXT.js</span>
              <span className="hover:text-zinc-350 transition-colors cursor-default">TypeScript</span>
              <span className="hover:text-zinc-350 transition-colors cursor-default">node.js</span>
              <span className="hover:text-zinc-350 transition-colors cursor-default">PostgreSQL</span>
              <span className="hover:text-zinc-350 transition-colors cursor-default">▲ Vercel</span>
            </div>
          </div>

          {/* Notion status bar */}
          <div className="lg:col-span-5 bg-card/45 border border-zinc-900/50 hover:border-zinc-800/80 rounded-xl p-4 flex flex-col gap-2.5 group/notion transition-luxe">
            <span className="text-[9px] tracking-widest text-zinc-500 font-mono uppercase">SISTEMAS EN NOTION</span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[9px] font-mono text-zinc-500 group-hover/notion:text-pink-400 transition-luxe">
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-zinc-700 group-hover/notion:bg-pink-500 group-hover/notion:animate-pulse" />
                &gt; ANALIZANDO DATOS
              </span>
              <span className="text-zinc-800">|</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-zinc-800 group-hover/notion:bg-pink-500/40" />
                &gt; CONSTRUYENDO SOLUCIONES
              </span>
              <span className="text-zinc-800">|</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-zinc-900 group-hover/notion:bg-pink-500/20" />
                &gt; GENERANDO IMPACTO
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROYECTOS DESTACADOS ── */}
      <section id="proyectos" className="relative max-w-7xl mx-auto px-6 py-20 z-10 border-t border-zinc-900/40" aria-label="Proyectos Destacados">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-pink-500 font-mono text-[10px] tracking-[0.25em] uppercase block mb-3">PROYECTOS DESTACADOS</span>
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">Sistemas y productos que construyen el futuro.</h2>
          </div>
          <a href="#proyectos" className="text-sm font-semibold tracking-wider text-zinc-400 hover:text-white transition-colors flex items-center gap-1 mt-4 md:mt-0 shrink-0 group">
            <span>Ver todos los proyectos</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-pink-500 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
              <path d="M7 7h10v10M7 17L17 7" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="group bg-card/60 border border-zinc-900/50 rounded-2xl overflow-hidden p-6 hover:border-zinc-800 hover:bg-card/80 transition-luxe flex flex-col justify-between h-[480px]">
            <div>
              {/* Preview mockup graphic */}
              <div className="h-44 bg-background border border-zinc-900/50 rounded-xl mb-6 flex flex-col justify-between p-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex justify-between items-center text-[8px] text-zinc-500 font-mono">
                  <span>tu.mtch dashboard</span>
                  <span>v1.0</span>
                </div>
                <div className="my-auto">
                  <div className="h-2 w-12 bg-pink-500/40 rounded mb-2" />
                  <div className="h-6 w-24 bg-zinc-800/80 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-1.5 w-6 bg-zinc-900 rounded" />
                  <div className="h-1.5 w-8 bg-zinc-900 rounded" />
                  <div className="h-1.5 w-5 bg-zinc-900 rounded" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">tu.mtch</h3>
              <span className="inline-block text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full mb-4">Plataforma SaaS</span>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Plataforma colaborativa que conecta talento con oportunidades reales. Emparejamiento inteligente, chat, eventos y comunidad.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-6 font-mono text-[9px] text-zinc-500">
              <span>Next.js</span>
              <span>•</span>
              <span>TypeScript</span>
              <span>•</span>
              <span>PostgreSQL</span>
              <span>•</span>
              <span>Tailwind</span>
              <span>•</span>
              <span>Pusher</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-card/60 border border-zinc-900/50 rounded-2xl overflow-hidden p-6 hover:border-zinc-800 hover:bg-card/80 transition-luxe flex flex-col justify-between h-[480px]">
            <div>
              {/* Preview node graph mockup */}
              <div className="h-44 bg-background border border-zinc-900/50 rounded-xl mb-6 flex flex-col justify-between p-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex justify-between items-center text-[8px] text-zinc-500 font-mono">
                  <span>node flow agent</span>
                  <span>active</span>
                </div>
                <div className="my-auto flex justify-center gap-4 items-center">
                  <div className="w-8 h-8 rounded-full border border-pink-500/30 flex items-center justify-center text-pink-500 font-mono text-[9px]">AI</div>
                  <div className="w-6 h-px bg-zinc-800" />
                  <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 font-mono text-[9px]">API</div>
                </div>
                <div className="flex justify-between text-[7px] text-zinc-600 font-mono">
                  <span>openai-gpt-4o</span>
                  <span>temp=0.2</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">IA para automatización de procesos</h3>
              <span className="inline-block text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full mb-4">AI Systems</span>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Sistema de agentes inteligentes que automatiza flujos de trabajo, procesa información y genera conocimientos de valor.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-6 font-mono text-[9px] text-zinc-500">
              <span>OpenAI</span>
              <span>•</span>
              <span>LangChain</span>
              <span>•</span>
              <span>Node.js</span>
              <span>•</span>
              <span>Redis</span>
              <span>•</span>
              <span>Docker</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-card/60 border border-zinc-900/50 rounded-2xl overflow-hidden p-6 hover:border-zinc-800 hover:bg-card/80 transition-luxe flex flex-col justify-between h-[480px]">
            <div>
              {/* Preview image */}
              <div 
                className="h-44 border border-zinc-900/50 rounded-xl mb-6 bg-cover bg-center overflow-hidden relative bg-[url('/assests/img/femcoders-group.png')]"
              >
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-[8px] tracking-wider text-pink-400 font-bold uppercase font-mono">FemCoders Club Meetup</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">FemCoders Club</h3>
              <span className="inline-block text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full mb-4">Comunidad</span>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Comunidad y plataforma educativa que impulsa a mujeres en tecnología a través de formación, contactos y proyectos colaborativos.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-6 font-mono text-[9px] text-zinc-500">
              <span>Next.js</span>
              <span>•</span>
              <span>MongoDB</span>
              <span>•</span>
              <span>Stripe</span>
              <span>•</span>
              <span>Tailwind</span>
              <span>•</span>
              <span>Resend</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOBRE MÍ ── */}
      <section id="sobre-mi" className="relative max-w-7xl mx-auto px-6 py-20 z-10 border-t border-zinc-900/40" aria-label="Sobre Mí">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Portrait image */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[380px] aspect-4/5 rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl group">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 bg-[url('/assests/img/irina-ichim-portrait.png')]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
            </div>
            {/* Ambient pink light accent */}
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Biography text */}
          <div className="lg:col-span-4 flex flex-col items-start text-left">
            <span className="text-pink-500 font-mono text-[10px] tracking-[0.25em] uppercase block mb-3">SOBRE MÍ</span>
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight mb-6">Ingeniera. Creadora. Constructora de sistemas.</h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6">
              Me llamo Irina Ichim y llevo más de 7 años diseñando y desarrollando soluciones digitales que combinan tecnología, estrategia y propósito.
            </p>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
              Me especializo en arquitectura de software, IA aplicada y automatización de procesos. Disfruto llevar proyectos desde una idea inicial hasta sistemas escalables que generan impacto real.
            </p>
            <a href="#sobre-mi" className="text-sm font-semibold tracking-wider text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group">
              <span>Conoce mi historia</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-pink-500 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
                <path d="M7 7h10v10M7 17L17 7" />
              </svg>
            </a>
          </div>

          {/* Stats column */}
          <div className="lg:col-span-3 flex flex-col gap-8 lg:pl-8 border-t lg:border-t-0 lg:border-l border-zinc-900 pt-8 lg:pt-0">
            <div className="flex flex-col">
              <span className="text-3xl font-serif text-white mb-1">+30</span>
              <span className="text-xs text-zinc-400 font-mono tracking-wide">Proyectos entregados</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-serif text-white mb-1">+10k</span>
              <span className="text-xs text-zinc-400 font-mono tracking-wide">Personas impactadas a través de FemCoders</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-serif text-white mb-1">5</span>
              <span className="text-xs text-zinc-400 font-mono tracking-wide">Años liderando comunidades tecnológicas</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-serif text-white mb-1">∞</span>
              <span className="text-xs text-zinc-400 font-mono tracking-wide">Curiosidad por seguir aprendiendo</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEMCODERS CLUB ── */}
      <section id="femcoders" className="relative max-w-7xl mx-auto px-6 py-20 z-10 border-t border-zinc-900/40" aria-label="FemCoders Club">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: descriptive text and statistics */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <span className="text-pink-500 font-mono text-[10px] tracking-[0.25em] uppercase block mb-3">FEMCODERS CLUB</span>
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight mb-6">Tecnología con propósito. Comunidad con impacto.</h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
              FemCoders Club es mi forma de devolver y multiplicar. Un espacio seguro donde mujeres en tecnología aprenden, se apoyan y crecen juntas.
            </p>
            
            {/* Inline statistics row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full mb-8 font-mono">
              <div className="flex flex-col">
                <span className="text-xl text-white font-semibold mb-1">+2.500</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Miembros</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl text-white font-semibold mb-1">+120</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Eventos</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl text-white font-semibold mb-1">+60</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Mentoras</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl text-white font-semibold mb-1">18</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Países</span>
              </div>
            </div>

            <a href="#femcoders" className="text-sm font-semibold tracking-wider text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group">
              <span>Quiero saber más</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-pink-500 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
                <path d="M7 7h10v10M7 17L17 7" />
              </svg>
            </a>
          </div>

          {/* Right: Collage images */}
          <div className="lg:col-span-6 grid grid-cols-12 gap-4 items-center relative">
            {/* Ambient light overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Left large photo */}
            <div className="col-span-7 aspect-4/5 rounded-xl overflow-hidden border border-zinc-800/60 shadow-2xl relative">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-[url('/assests/img/femcoders-group.png')]"
              />
            </div>
            
            {/* Right smaller photos stacking */}
            <div className="col-span-5 flex flex-col gap-4">
              <div className="aspect-4/3 rounded-xl overflow-hidden border border-zinc-800/60 shadow-2xl relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-[url('/assests/img/femcoders-speaker.png')]"
                />
              </div>
              <div className="aspect-4/3 rounded-xl overflow-hidden border border-zinc-800/60 shadow-2xl relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-[url('/assests/img/women-coding.png')]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT CONTACT SECTION (Fallback for anchors) ── */}
      <section id="contacto" className="relative max-w-xl mx-auto px-6 py-24 z-10 text-center" aria-label="Contacto">
        <span className="text-pink-500 font-mono text-[10px] tracking-[0.25em] uppercase block mb-3">HABLEMOS</span>
        <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight mb-6">¿Listo para crear algo increíble juntos?</h2>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
          Estoy disponible para consultoría de arquitectura, integraciones de IA aplicada y desarrollos web de alto rendimiento.
        </p>
        <a href="mailto:hola@irinaichim.studio">
          <Button 
            variant="default"
            size="lg"
            className="bg-zinc-100 hover:bg-white text-zinc-950 font-semibold px-8 h-13 rounded-lg shadow-xl"
          >
            hola@irinaichim.studio
          </Button>
        </a>
      </section>
    </div>
  );
}
