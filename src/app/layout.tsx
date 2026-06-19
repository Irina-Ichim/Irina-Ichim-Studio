import "@/env";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SkipLink } from "@/components/ui/skip-link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Irina Ichim Studio | Diseño y Desarrollo Web Premium",
  description: "Estudio de diseño y desarrollo web a medida. Creamos interfaces digitales exclusivas, interactivas y accesibles (WCAG AAA).",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Irina Ichim Studio",
  "url": "https://irinaichim.studio",
  "logo": "https://irinaichim.studio/logo.png",
  "description": "Estudio de diseño y desarrollo web de alto rendimiento y accesibilidad nivel AAA.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "ES"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased dark`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground transition-colors duration-300 font-sans selection:bg-pink-600 selection:text-white">
        <ThemeProvider>
          <SkipLink />
          
          <div className="flex min-h-screen">
            {/* ── BARRA LATERAL IZQUIERDA (DESKTOP) ── */}
            <aside className="hidden lg:flex flex-col justify-between items-center w-28 border-r border-zinc-900/50 bg-background py-8 text-center shrink-0 z-30 fixed left-0 top-0 bottom-0">
              {/* Logo */}
              <div className="flex flex-col items-center gap-2">
                <Link href="/" aria-label="Irina Ichim Studio Inicio" className="group">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9 text-pink-500 hover:scale-110 transition-transform duration-300">
                    <path d="M12 2C12 2 12.5 8.5 15.5 11.5C18.5 14.5 25 15 25 15C25 15 18.5 15.5 15.5 18.5C12.5 21.5 12 28 12 28C12 28 11.5 21.5 8.5 18.5C5.5 15.5 2 15 2 15C2 15 5.5 14.5 8.5 11.5C11.5 8.5 12 2 12 2Z" fill="currentColor" fillOpacity="0.15" />
                  </svg>
                </Link>
                <span className="text-[10px] tracking-[0.25em] font-semibold text-zinc-400 mt-1">STUDIO</span>
              </div>

              {/* Vertical Text */}
              <div className="rotate-180 select-none py-4 writing-mode-vertical">
                <span className="text-xs uppercase tracking-[0.3em] text-zinc-600 font-mono">
                  IRINA ICHIM STUDIO
                </span>
              </div>

              {/* Menu items */}
              <nav aria-label="Menu lateral" className="flex flex-col gap-6 font-mono text-[11px]">
                <Link href="#inicio" className="flex flex-col items-center gap-1 group text-pink-500 font-semibold">
                  <span className="text-[9px] opacity-75">01</span>
                  <span className="tracking-wider uppercase hover:text-pink-500 transition-colors">INICIO</span>
                </Link>
                <Link href="#proyectos" className="flex flex-col items-center gap-1 group text-zinc-500 hover:text-zinc-300">
                  <span className="text-[9px] opacity-75">02</span>
                  <span className="tracking-wider uppercase transition-colors">PROYECTOS</span>
                </Link>
                <Link href="#servicios" className="flex flex-col items-center gap-1 group text-zinc-500 hover:text-zinc-300">
                  <span className="text-[9px] opacity-75">03</span>
                  <span className="tracking-wider uppercase transition-colors">SERVICIOS</span>
                </Link>
                <Link href="#sobre-mi" className="flex flex-col items-center gap-1 group text-zinc-500 hover:text-zinc-300">
                  <span className="text-[9px] opacity-75">04</span>
                  <span className="tracking-wider uppercase transition-colors">SOBRE MÍ</span>
                </Link>
                <Link href="#femcoders" className="flex flex-col items-center gap-1 group text-zinc-500 hover:text-zinc-300">
                  <span className="text-[9px] opacity-75">05</span>
                  <span className="tracking-wider uppercase transition-colors text-center max-w-[80px] leading-tight">FEMCODERS</span>
                </Link>
                <Link href="#recursos" className="flex flex-col items-center gap-1 group text-zinc-500 hover:text-zinc-300">
                  <span className="text-[9px] opacity-75">06</span>
                  <span className="tracking-wider uppercase transition-colors">RECURSOS</span>
                </Link>
                <Link href="#contacto" className="flex flex-col items-center gap-1 group text-zinc-500 hover:text-zinc-300">
                  <span className="text-[9px] opacity-75">07</span>
                  <span className="tracking-wider uppercase transition-colors">CONTACTO</span>
                </Link>
              </nav>

              {/* Idiomas & Tema */}
              <div className="flex flex-col items-center gap-6 mt-4">
                <div className="text-[10px] tracking-wider text-zinc-500 font-mono">
                  <span className="text-zinc-300 font-semibold cursor-pointer">ES</span>
                  <span className="mx-1">/</span>
                  <span className="hover:text-zinc-300 cursor-pointer">EN</span>
                </div>
                <ThemeToggle />
              </div>
            </aside>

            {/* ── ÁREA PRINCIPAL ── */}
            <div className="flex-1 flex flex-col lg:pl-28">
              {/* Header de Navegación Responsiva / Superior */}
              <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-zinc-900/60 lg:border-0 lg:bg-transparent">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between lg:justify-end gap-6">
                  {/* Logo Mobile */}
                  <div className="flex lg:hidden items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-pink-500">
                      <path d="M12 2C12 2 12.5 8.5 15.5 11.5C18.5 14.5 25 15 25 15C25 15 18.5 15.5 15.5 18.5C12.5 21.5 12 28 12 28C12 28 11.5 21.5 8.5 18.5C5.5 15.5 2 15 2 15C2 15 5.5 14.5 8.5 11.5C11.5 8.5 12 2 12 2Z" fill="currentColor" fillOpacity="0.15" />
                    </svg>
                    <span className="text-sm font-semibold tracking-wider text-white">IRINA ICHIM STUDIO</span>
                  </div>

                  <div className="flex items-center gap-8">
                    {/* Hablemos */}
                    <a href="#contacto" className="text-sm font-medium tracking-wider text-white hover:text-pink-400 transition-colors flex items-center gap-1.5 group">
                      <span>HABLEMOS</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-pink-500 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
                        <path d="M7 7h10v10M7 17L17 7" />
                      </svg>
                    </a>

                    {/* Hamburger menu button */}
                    <button className="flex items-center justify-center w-11 h-11 rounded-full border border-zinc-800 bg-[#09090b] text-white hover:bg-zinc-900 transition-all focus:outline-none" aria-label="Abrir menú">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </header>

              <main id="main-content" className="flex-1 flex flex-col">
                {children}
              </main>

              <footer className="border-t border-zinc-900 bg-black/40 py-12 text-sm text-zinc-500">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <p>&copy; {new Date().getFullYear()} Irina Ichim Studio. Todos los derechos reservados.</p>
                  <nav aria-label="Navegación legal" className="flex gap-8">
                    <Link href="/privacidad" className="hover:text-zinc-300 transition-colors">Privacidad</Link>
                    <Link href="/cookies" className="hover:text-zinc-300 transition-colors">Cookies</Link>
                  </nav>
                </div>
              </footer>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
