"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme") as Theme | null;
    let initialTheme: Theme = "light";
    if (currentTheme) {
      initialTheme = currentTheme;
    } else {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      if (savedTheme) {
        initialTheme = savedTheme;
      } else {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        initialTheme = isDark ? "dark" : "light";
      }
    }

    const timeoutId = setTimeout(() => {
      setTheme(initialTheme);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
