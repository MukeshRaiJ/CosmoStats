"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { theme as defaultTheme, defaultAnimation } from "./AnimatedBackground";

// Extended theme type with additional color options
interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  subtext: string;
  border: string;
  glass: string;
  chart: {
    grid: string;
    text: string;
    colors: string[];
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const defaultColors: ThemeColors = {
  primary: "text-blue-500",
  secondary: "text-cyan-500",
  accent: "text-purple-500",
  background: defaultTheme.background,
  text: defaultTheme.text,
  subtext: "text-slate-400",
  border: "border-slate-700",
  glass: "bg-slate-900/50 backdrop-blur-lg backdrop-saturate-150",
  chart: {
    grid: "#334155",
    text: "#e2e8f0",
    colors: ["#3b82f6", "#06b6d4", "#6366f1", "#8b5cf6", "#ec4899"],
  },
  gradients: {
    primary: "from-blue-900/20 via-purple-900/20 to-cyan-900/20",
    secondary: "from-cyan-900/20 via-blue-900/20 to-purple-900/20",
    accent: "from-purple-900/20 via-cyan-900/20 to-blue-900/20",
  },
};

type ThemeType = typeof defaultTheme;
type AnimationConfigType = typeof defaultAnimation;

interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  animationConfig: AnimationConfigType;
  updateColors: (newColors: Partial<ThemeColors>) => void;
  updateTheme: (newTheme: Partial<ThemeType>) => void;
  updateAnimationConfig: (newConfig: Partial<AnimationConfigType>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({
  children,
  initialTheme = defaultTheme,
  initialColors = defaultColors,
  initialAnimationConfig = defaultAnimation,
}: {
  children: ReactNode;
  initialTheme?: Partial<ThemeType>;
  initialColors?: Partial<ThemeColors>;
  initialAnimationConfig?: Partial<AnimationConfigType>;
}) => {
  const [theme, setTheme] = React.useState<ThemeType>({
    ...defaultTheme,
    ...initialTheme,
  });
  const [colors, setColors] = React.useState<ThemeColors>({
    ...defaultColors,
    ...initialColors,
  });
  const [animationConfig, setAnimationConfig] =
    React.useState<AnimationConfigType>({
      ...defaultAnimation,
      ...initialAnimationConfig,
    });

  const updateColors = React.useCallback((newColors: Partial<ThemeColors>) => {
    setColors((prev) => ({ ...prev, ...newColors }));
  }, []);

  const updateTheme = React.useCallback((newTheme: Partial<ThemeType>) => {
    setTheme((prev) => ({ ...prev, ...newTheme }));
  }, []);

  const updateAnimationConfig = React.useCallback(
    (newConfig: Partial<AnimationConfigType>) => {
      setAnimationConfig((prev) => ({ ...prev, ...newConfig }));
    },
    []
  );

  const value = React.useMemo(
    () => ({
      theme,
      colors,
      animationConfig,
      updateColors,
      updateTheme,
      updateAnimationConfig,
    }),
    [
      theme,
      colors,
      animationConfig,
      updateColors,
      updateTheme,
      updateAnimationConfig,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className={colors.background}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Helper hook for common theme combinations
export const useThemeStyles = () => {
  const { colors } = useTheme();

  return {
    card: `${colors.glass} ${colors.border} rounded-xl`,
    heading: `${colors.text} font-semibold`,
    subheading: `${colors.subtext}`,
    gradientText: `bg-clip-text text-transparent bg-gradient-to-r ${colors.gradients.primary}`,
    button: `${colors.glass} ${colors.text} hover:bg-opacity-75 transition-all duration-200`,
    input: `${colors.glass} ${colors.text} ${colors.border} focus:ring-2 focus:ring-opacity-50`,
  };
};

export type { ThemeColors };
export { defaultTheme, defaultAnimation, defaultColors };
