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

    // Enhanced constellation patterns
    const constellationPaths = useMemo(
      () => [
        // Sagittarius (The Archer)
        "M300,400 L350,380 L400,390 L450,400 L480,420 L500,450 L520,460 L540,440 L560,430 M400,390 L380,360 L390,340 L420,330",
        // Cygnus (The Swan)
        "M600,200 L650,180 L700,150 L750,120 M650,180 L630,220 L650,260 L670,220 L650,180",
        // Ursa Minor (Little Dipper - contains Polaris)
        "M150,150 L180,130 L220,120 L260,140 L280,180 L240,200 L200,190",
        // Perseus
        "M400,100 L450,120 L500,110 L550,130 L600,140 L580,180 L620,200 M500,110 L480,150",
        // Lyra
        "M700,300 L750,280 L800,290 L750,320 L700,300 M750,280 L750,320",
        // Canis Major
        "M100,600 L150,580 L200,590 L250,570 L300,580 M200,590 L180,620 L200,650",
        // Cassiopeia
        "M800,100 L750,120 L700,100 L650,120 L600,100",
        // Orion
        "M100,500 L150,480 L200,500 L250,480 L200,450 L200,400 L200,350 M150,450 L250,450",
        // Ursa Major (Big Dipper)
        "M300,150 L350,160 L400,170 L450,180 L470,220 L440,260 L400,240",
        // Scorpius
        "M850,450 L800,470 L750,500 L700,550 L680,600 L670,650 M750,500 L780,520",
      ],
      []
    );

    // Enhanced constellation points
    const constellationPoints = useMemo(
      () => [
        // Polaris (North Star) - brighter and larger
        { x: 150, y: 150, size: 4, brightness: 0.8 },
        // Major stars in Sagittarius
        { x: 300, y: 400 },
        { x: 400, y: 390 },
        { x: 500, y: 450 },
        // Bright stars in Cygnus (including Deneb)
        { x: 600, y: 200 },
        { x: 650, y: 180, size: 3, brightness: 0.7 },
        // Perseus bright stars
        { x: 400, y: 100 },
        { x: 500, y: 110, size: 3 },
        // Lyra (including Vega)
        { x: 750, y: 280, size: 3, brightness: 0.7 },
        // Canis Major (including Sirius)
        { x: 200, y: 590, size: 4, brightness: 0.8 },
        // Bright stars in other constellations
        { x: 200, y: 450, size: 3 },
        { x: 400, y: 170 },
        { x: 750, y: 500 },
        { x: 800, y: 470 },
      ],
      []
    );

    // Background stars
    const stars = useMemo(
      () =>
        Array.from({ length: 250 }).map((_, i) => ({
          id: `star-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() < 0.1 ? 3 : Math.random() < 0.3 ? 2 : 1,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2,
        })),
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

        {/* Background Stars */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
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

        {/* Constellations SVG layer */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {/* Constellation lines */}
          {constellationPaths.map((path, index) => (
            <motion.path
              key={`constellation-${index}`}
              d={path}
              className="stroke-white"
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

          {/* Constellation points with special handling for bright stars */}
          {constellationPoints.map((point, index) => (
            <motion.circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r={point.size || 2}
              className="fill-white"
              initial={{ opacity: point.brightness || 0.1 }}
              animate={{
                opacity: [
                  point.brightness || 0.1,
                  point.brightness ? 1 : 0.6,
                  point.brightness || 0.1,
                ],
                r: point.size
                  ? [point.size, point.size + 1, point.size]
                  : [2, 3, 2],
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
