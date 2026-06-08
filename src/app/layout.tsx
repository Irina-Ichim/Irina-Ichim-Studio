import "@/env";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
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
      <body className="min-h-full flex flex-col bg-white text-black dark:bg-black dark:text-zinc-50 transition-colors duration-300">
        <ThemeProvider>
          <SkipLink />
          <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link href="/" className="font-semibold tracking-tight text-lg hover:opacity-80 transition-opacity">
                Irina Ichim Studio
              </Link>
              <div className="flex items-center gap-6">
                <nav aria-label="Navegación principal" className="flex items-center space-x-6 text-sm font-medium">
                  <Link href="/" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                    Inicio
                  </Link>
                  <Link href="/design-system" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                    Design System
                  </Link>
                </nav>
                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" aria-hidden="true" />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main id="main-content" className="flex flex-col flex-1">
            {children}
          </main>
          <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500 dark:text-zinc-400">
              <p>&copy; {new Date().getFullYear()} Irina Ichim Studio. Todos los derechos reservados.</p>
              <nav aria-label="Navegación legal" className="flex gap-6">
                <Link href="/privacidad" className="hover:underline">
                  Privacidad
                </Link>
                <Link href="/cookies" className="hover:underline">
                  Cookies
                </Link>
              </nav>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
