import "@/env";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SkipLink } from "@/components/ui/skip-link";

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
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SkipLink />
        <main id="main-content" className="flex flex-col flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}

