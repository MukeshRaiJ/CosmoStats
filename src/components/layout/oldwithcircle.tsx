"use client";

import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";

export const theme = {
  background: "bg-slate-900",
  gradient: "from-blue-900/20 via-purple-900/20 to-cyan-900/20",
  text: "text-slate-100",
  tabBackground: "bg-slate-900/50",
  contentBackground: "bg-slate-900/50",
  particleColor: "bg-white/50",
};

export const defaultAnimation = {
  particleCount: 20,
  rotationDuration: 20,
  particleDurationMin: 5,
  particleDurationMax: 15,
};

interface AnimatedBackgroundProps {
  animationConfig?: typeof defaultAnimation;
}

const AnimatedBackground = memo<AnimatedBackgroundProps>(
  ({ animationConfig = defaultAnimation }) => {
    const bgGradient = `bg-gradient-to-br ${theme.gradient}`;

    // Enhanced constellation points with more complex patterns
    const constellationPaths = useMemo(
      () => [
        "M100,100 L200,150 L300,200 L400,180 L500,150 L400,100 Z",
        "M500,200 L600,180 L700,250 L600,300 L500,250 Z",
        "M150,300 L250,320 L350,280 L250,250 L150,300 Z",
        "M850,100 L750,150 L650,120 L750,50 L850,100 Z",
        "M300,400 L400,380 L500,400 L400,450 L300,400 Z",
      ],
      []
    );

    // Constellation points/dots
    const constellationPoints = useMemo(
      () => [
        { x: 100, y: 100 },
        { x: 200, y: 150 },
        { x: 300, y: 200 },
        { x: 400, y: 180 },
        { x: 500, y: 150 },
        { x: 600, y: 180 },
        { x: 700, y: 250 },
        { x: 850, y: 100 },
      ],
      []
    );

    // Enhanced stars with varying sizes
    const stars = useMemo(
      () =>
        Array.from({ length: 150 }).map((_, i) => ({
          id: `star-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() < 0.3 ? 2 : 1, // Some stars are bigger
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2,
        })),
      []
    );

    // Orbital circles with more varied sizes and positions
    const orbitalCircles = useMemo(
      () => [
        { size: "w-48 h-48", position: "top-1/4 -left-24", delay: 0 },
        { size: "w-96 h-96", position: "bottom-1/4 -right-32", delay: 0.2 },
        { size: "w-32 h-32", position: "top-1/3 right-24", delay: 0.4 },
        { size: "w-64 h-64", position: "bottom-1/3 left-16", delay: 0.6 },
        { size: "w-72 h-72", position: "top-1/2 right-48", delay: 0.8 },
      ],
      []
    );

    return (
      <div
        className={`fixed inset-0 overflow-hidden pointer-events-none ${bgGradient}`}
      >
        {/* Rotating gradient background */}
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

        {/* Orbital Circles */}
        {orbitalCircles.map((circle, index) => (
          <div
            key={`orbital-${index}`}
            className={`absolute ${circle.position}`}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 20 + index * 5,
                repeat: Infinity,
                ease: "linear",
                delay: circle.delay,
              }}
              className={`relative ${circle.size}`}
            >
              <div className="absolute inset-0 border border-current opacity-20 rounded-full" />
              <div className="absolute inset-4 border border-current opacity-10 rounded-full" />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 20 + index * 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: circle.delay,
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-current opacity-30 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              />
            </motion.div>
          </div>
        ))}

        {/* Enhanced Stars layer with varying sizes */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className={`absolute rounded-full bg-current`}
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.x}%`,
              top: `${star.y}%`,
            }}
            initial={{ opacity: 0.1 }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}

        {/* Enhanced Constellation SVG layer */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {/* Constellation lines */}
          {constellationPaths.map((path, index) => (
            <motion.path
              key={`constellation-${index}`}
              d={path}
              className="stroke-current"
              strokeWidth="0.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0.1 }}
              animate={{
                pathLength: [0, 1, 1, 0],
                opacity: [0.1, 0.4, 0.4, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatDelay: index * 2,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Constellation points */}
          {constellationPoints.map((point, index) => (
            <motion.circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r="2"
              className="fill-current"
              initial={{ opacity: 0.1 }}
              animate={{
                opacity: [0.1, 0.6, 0.1],
                r: [2, 3, 2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: index * 0.5,
              }}
            />
          ))}
        </svg>
      </div>
    );
  }
);

AnimatedBackground.displayName = "AnimatedBackground";

export default AnimatedBackground;
