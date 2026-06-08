"use client";

import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Esperar a que el componente esté montado para evitar inconsistencias de SSR
  useEffect(() => {
    window.requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-11 h-11 rounded-full border border-zinc-200 bg-white text-zinc-800 transition-all hover:bg-zinc-50 hover:text-black dark:border-zinc-800 dark:bg-black dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      aria-label={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
    >
      <span className="sr-only">
        {theme === "light" ? "Activar tema oscuro" : "Activar tema claro"}
      </span>
      <div className="relative w-5 h-5 overflow-hidden">
        <div
          className={`absolute inset-0 transition-transform duration-300 ${
            theme === "light" ? "rotate-0 scale-100" : "rotate-90 scale-0"
          }`}
        >
          <Sun className="w-5 h-5" />
        </div>
        <div
          className={`absolute inset-0 transition-transform duration-300 ${
            theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
          }`}
        >
          <Moon className="w-5 h-5" />
        </div>
      </div>
    </button>
  );
}
