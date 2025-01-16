"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface HeroProps {
  videoUrl: string;
}

const Hero: React.FC<HeroProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      videoRef.current.defaultPlaybackRate = 1.0;

      // Preload the video
      videoRef.current.preload = "auto";

      // Add play and error handling
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
        } catch (error) {
          console.error("Video playback error:", error);
        }
      };

      playVideo();

      // Handle visibility changes
      const handleVisibilityChange = () => {
        if (document.hidden) {
          videoRef.current?.pause();
        } else {
          playVideo();
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, []);

  const rocketHoverAnimation = {
    y: -8,
    scale: 1.1,
    rotate: 0,
    transition: { duration: 0.2 },
  };

  return (
    <section className="w-full relative px-4 sm:px-6 lg:px-16">
      <div className="flex flex-col md:flex-row items-start pt-0 md:pt-12">
        {/* Content */}
        <div className="absolute z-20 w-full md:relative md:w-1/2 p-4 pt-12 md:p-6 lg:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-6 md:space-y-8"
          >
            {/* Title */}
            <div className="relative space-y-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-start text-white md:text-current"
              >
                <span className="text-sm sm:text-base md:text-sm lg:text-base font-light tracking-[0.3em] uppercase mb-4">
                  Welcome to
                </span>
                <div className="space-y-2">
                  <span className="block text-4xl sm:text-7xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-none">
                    ISRO
                  </span>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-3xl sm:text-6xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-none text-white/90 md:text-current/90">
                      LAUNCH ANALYTICS
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <p className="text-lg sm:text-xl md:text-lg lg:text-xl xl:text-2xl text-white md:text-current font-light tracking-wide max-w-2xl">
                Exploring India&apos;s Journey to the Stars <br />
                Last Updated: 2024-12-30
              </p>
            </motion.div>

            {/* Rocket-themed interactive squares */}
            <div className="flex gap-8 sm:gap-10 md:gap-8 lg:gap-10 mt-12 md:mt-8">
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
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 bg-white md:bg-current opacity-80 rounded-lg transform group-hover:rotate-0 transition-all duration-300" />

                  {/* Rocket trail effect */}
                  <motion.div
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0.5 sm:w-1 opacity-0 group-hover:opacity-100"
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
                    <div className="w-full h-full bg-white md:bg-current rounded-full blur-sm" />
                  </motion.div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-white md:bg-current opacity-20 rounded-lg blur-sm lg:blur-xl group-hover:blur-xl lg:group-hover:blur-2xl group-hover:scale-150 transition-all duration-300" />

                  {/* Side thrusters */}
                  <motion.div
                    className="absolute -left-1 top-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 opacity-0 group-hover:opacity-80"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                  >
                    <div className="w-full h-full bg-white md:bg-current rounded-full blur-sm" />
                  </motion.div>
                  <motion.div
                    className="absolute -right-1 top-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 opacity-0 group-hover:opacity-80"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                  >
                    <div className="w-full h-full bg-white md:bg-current rounded-full blur-sm" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Video Display */}
        <div className="relative w-full md:w-1/2 h-[32rem] md:h-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full h-full md:aspect-[4/3] md:max-h-[60vh] lg:max-h-none rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg group"
          >
            {/* Video overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 md:bg-current md:backdrop-blur-sm md:opacity-5 md:group-hover:opacity-10 transition-opacity duration-300" />

            {/* Corner decorations */}
            {["top-left", "top-right", "bottom-left", "bottom-right"].map(
              (position, i) => (
                <motion.div
                  key={position}
                  className={`absolute ${
                    position.includes("top")
                      ? "top-2 sm:top-3 lg:top-4"
                      : "bottom-2 sm:bottom-3 lg:bottom-4"
                  } ${
                    position.includes("left")
                      ? "left-2 sm:left-3 lg:left-4"
                      : "right-2 sm:right-3 lg:right-4"
                  } w-6 sm:w-8 md:w-10 lg:w-12 h-6 sm:h-8 md:h-10 lg:h-12 opacity-20 z-20`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 90 * i }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="absolute inset-0 border-2 border-white md:border-current rounded-lg transform rotate-45" />
                  <div className="absolute inset-2 border border-white md:border-current rounded-lg transform rotate-45" />
                </motion.div>
              )
            )}

            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 will-change-transform"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "translate3d(0, 0, 0)",
                WebkitTransform: "translate3d(0, 0, 0)",
              }}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Text and Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-white md:text-current text-sm font-light tracking-wider uppercase">
          Scroll Down
        </span>
        <motion.div
          className="relative w-4 lg:w-6 h-6 lg:h-10 rounded-2xl border-2 border-white md:border-current opacity-60 p-1"
          animate={{ opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 lg:w-1.5 h-1 lg:h-1.5 bg-white md:bg-current rounded-full mx-auto"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
