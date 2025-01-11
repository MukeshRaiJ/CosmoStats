"use client";

import React from "react";
import { motion } from "framer-motion";

interface HeroProps {
  title?: string;
  subtitle?: string;
  videoUrl: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "ISRO Launch Analytics",
  subtitle = "Exploring India's Journey to the Stars",
  videoUrl,
}) => {
  // Rocket hover effect animation
  const rocketHoverAnimation = {
    y: -8,
    scale: 1.1,
    rotate: 0,
    transition: {
      duration: 0.2,
    },
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div className="h-full flex items-center">
        {/* Left Side - Content */}
        <div className="relative z-20 w-1/2 p-8 md:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Title */}
            <div className="relative">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-bold text-left tracking-tight"
              >
                <span className="text-current">{title}</span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-current opacity-80 text-left max-w-2xl leading-relaxed"
            >
              {subtitle}
            </motion.p>

            {/* Rocket-themed interactive squares */}
            <div className="flex gap-8 mt-12">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="relative group cursor-pointer"
                  initial={{ rotate: 45 }}
                  animate={{
                    y: [0, -10, 0],
                    rotate: 45,
                  }}
                  transition={{
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2,
                    },
                  }}
                  whileHover={rocketHoverAnimation}
                >
                  {/* Main rocket body */}
                  <div className="w-6 h-6 bg-current opacity-80 rounded-lg transform group-hover:rotate-0 transition-all duration-300" />

                  {/* Rocket trail effect */}
                  <motion.div
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1 opacity-0 group-hover:opacity-100"
                    initial={{ height: 0 }}
                    whileHover={{
                      height: ["0px", "20px", "10px"],
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                    }}
                  >
                    <div className="w-full h-full bg-current rounded-full blur-sm" />
                  </motion.div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-current opacity-20 rounded-lg blur-xl group-hover:blur-2xl group-hover:scale-150 transition-all duration-300" />

                  {/* Side thrusters - visible on hover */}
                  <motion.div
                    className="absolute -left-1 top-1/2 w-2 h-2 opacity-0 group-hover:opacity-80"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                  >
                    <div className="w-full h-full bg-current rounded-full blur-sm" />
                  </motion.div>
                  <motion.div
                    className="absolute -right-1 top-1/2 w-2 h-2 opacity-0 group-hover:opacity-80"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                  >
                    <div className="w-full h-full bg-current rounded-full blur-sm" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Video Display */}
        <div className="relative w-1/2 h-4/5 pr-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative h-full rounded-3xl overflow-hidden shadow-lg group"
          >
            {/* Video overlay */}
            <div className="absolute inset-0 backdrop-blur-sm bg-current opacity-5 group-hover:opacity-10 transition-opacity duration-300" />

            {/* Corner decorations */}
            {["top-left", "top-right", "bottom-left", "bottom-right"].map(
              (position, i) => (
                <motion.div
                  key={position}
                  className={`absolute ${
                    position.includes("top") ? "top-4" : "bottom-4"
                  } ${position.includes("left") ? "left-4" : "right-4"}
                           w-12 h-12 opacity-20 z-20`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 90 * i }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="absolute inset-0 border-2 border-current rounded-lg transform rotate-45" />
                  <div className="absolute inset-2 border border-current rounded-lg transform rotate-45" />
                </motion.div>
              )
            )}

            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center space-y-4">
          <span className="text-current opacity-60 text-sm tracking-widest uppercase">
            Begin Journey
          </span>
          <motion.div
            className="relative w-8 h-14 rounded-2xl border-2 border-current opacity-60 p-1"
            animate={{ opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-current rounded-full mx-auto"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
