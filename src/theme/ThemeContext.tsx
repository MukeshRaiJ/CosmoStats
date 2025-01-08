"use client";
import React, { createContext, useContext } from "react";

interface ThemeContextType {
  background: string;
  cardBackground: string;
  textColor: string;
  accentGradient: string;
  monoText: string;
}

const themeValues = {
  background: "bg-slate-900",
  cardBackground: "bg-slate-900/50 backdrop-blur-lg backdrop-saturate-150",
  textColor: "text-slate-100",
  accentGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
  monoText: "font-mono", // Using Geist Mono for specific text elements
};

export const ThemeContext = createContext<ThemeContextType>(themeValues);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeContext.Provider value={themeValues}>
      {children}
    </ThemeContext.Provider>
  );
};
