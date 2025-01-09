"use client";
import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  memo,
  useMemo,
} from "react";
import { motion } from "framer-motion";

// Theme context type definition
type ThemeContextType = {
  isDark: boolean;
  toggle: () => void;
};

// Animation variant type
export enum ANIMATION_VARIANTS {
  GENTLE = "gentle",
  ACTIVE = "active",
}

// Props types
type AnimatedBackgroundProps = {
  isDark: boolean;
  variant?: ANIMATION_VARIANTS;
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

// Create theme context
const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggle: () => {},
});

// Theme hook for easy access
export const useTheme = () => useContext(ThemeContext);

// Memoized Animated Background Component
export const AnimatedBackground = memo<AnimatedBackgroundProps>(
  ({ isDark, variant = ANIMATION_VARIANTS.GENTLE }) => {
    const bgGradient = useMemo(
      () =>
        isDark
          ? "bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20"
          : "bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20",
      [isDark]
    );

    const particles = useMemo(
      () =>
        Array.from({
          length: variant === ANIMATION_VARIANTS.GENTLE ? 20 : 40,
        }).map((_, i) => ({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          delay: Math.random() * 5,
          duration: 5 + Math.random() * 10,
        })),
      [variant]
    );

    return (
      <div
        className={`fixed inset-0 overflow-hidden pointer-events-none ${bgGradient}`}
      >
        <div className="absolute -top-1/2 -right-1/2 w-full h-full">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`w-full h-full blur-3xl ${bgGradient}`}
          />
        </div>
        {particles.map(({ id, x, y, delay, duration }) => (
          <motion.div
            key={id}
            initial={{ x, y, scale: 0 }}
            animate={{
              y: [null, "-100vh"],
              scale: [0, 1, 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "linear",
              delay,
            }}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? "bg-white/50" : "bg-white"
            }`}
          />
        ))}
      </div>
    );
  }
);

AnimatedBackground.displayName = "AnimatedBackground";

// Memoized Theme Toggle Component
export const ThemeToggle = memo(() => {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer z-[9999]"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
});

ThemeToggle.displayName = "ThemeToggle";

// Theme Provider Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggle = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const value = useMemo(() => ({ isDark, toggle }), [isDark, toggle]);

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
        }`}
      >
        <AnimatedBackground
          isDark={isDark}
          variant={ANIMATION_VARIANTS.GENTLE}
        />
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
