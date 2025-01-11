// theme.ts
"use client";
import React, { memo, useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";

// Theme configuration
export interface ThemeConfig {
  dark: {
    background: string;
    gradient: string;
    text: string;
    tabBackground: string;
    contentBackground: string;
    particleColor: string;
  };
  light: {
    background: string;
    gradient: string;
    text: string;
    tabBackground: string;
    contentBackground: string;
    particleColor: string;
  };
}

export const defaultTheme: ThemeConfig = {
  dark: {
    background: "bg-slate-900",
    gradient: "from-blue-900/20 via-purple-900/20 to-cyan-900/20",
    text: "text-slate-100",
    tabBackground: "bg-slate-900/50",
    contentBackground: "bg-slate-900/50",
    particleColor: "bg-white/50",
  },
  light: {
    background: "bg-slate-50",
    gradient: "from-blue-500/20 via-purple-500/20 to-cyan-500/20",
    text: "text-slate-900",
    tabBackground: "bg-white/50",
    contentBackground: "bg-white/50",
    particleColor: "bg-white",
  },
};

// Animation configuration
export interface AnimationConfig {
  particleCount: number;
  rotationDuration: number;
  particleDurationMin: number;
  particleDurationMax: number;
}

export const defaultAnimation: AnimationConfig = {
  particleCount: 20,
  rotationDuration: 20,
  particleDurationMin: 5,
  particleDurationMax: 15,
};

// Theme Toggle Component
export interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle = memo<ThemeToggleProps>(
  ({ isDark, onToggle, className = "" }) => (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 
        hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors 
        cursor-pointer ${className}`}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  )
);

ThemeToggle.displayName = "ThemeToggle";

// Animated Background Component
interface AnimatedBackgroundProps {
  isDark: boolean;
  themeConfig?: ThemeConfig;
  animationConfig?: AnimationConfig;
}

const AnimatedBackground = memo<AnimatedBackgroundProps>(
  ({
    isDark,
    themeConfig = defaultTheme,
    animationConfig = defaultAnimation,
  }) => {
    const theme = isDark ? themeConfig.dark : themeConfig.light;
    const bgGradient = `bg-gradient-to-br ${theme.gradient}`;

    // Add state for window dimensions
    const [windowDimensions, setWindowDimensions] = useState({
      width: 0,
      height: 0,
    });

    // Add state for client-side rendering check
    const [isClient, setIsClient] = useState(false);

    // Set initial dimensions and mark as client-side
    useEffect(() => {
      setIsClient(true);
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Add resize handler
      const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const particles = useMemo(
      () =>
        isClient
          ? Array.from({ length: animationConfig.particleCount }).map(
              (_, i) => ({
                id: i,
                x: Math.random() * windowDimensions.width,
                y: Math.random() * windowDimensions.height,
                delay: Math.random() * 5,
                duration:
                  animationConfig.particleDurationMin +
                  Math.random() *
                    (animationConfig.particleDurationMax -
                      animationConfig.particleDurationMin),
              })
            )
          : [],
      [animationConfig, windowDimensions, isClient]
    );

    // Return null during SSR
    if (!isClient) return null;

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
              duration: animationConfig.rotationDuration,
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
            className={`absolute w-1 h-1 rounded-full ${theme.particleColor}`}
          />
        ))}
      </div>
    );
  }
);

AnimatedBackground.displayName = "AnimatedBackground";

export { AnimatedBackground };
