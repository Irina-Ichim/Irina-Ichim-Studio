"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Al montar en el cliente, sincronizar el estado de React con el HTML
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    window.requestAnimationFrame(() => {
      setThemeState(isDark ? "dark" : "light");
      setMounted(true);
    });
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Evitar hydration mismatches si el renderizado inicial no coincide con el cliente
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={`contents ${mounted ? "visible" : "invisible"}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
}
