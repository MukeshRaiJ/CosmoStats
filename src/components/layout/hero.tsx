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
  return (
    <section className="relative w-full h-screen mb-8">
      <div className="h-full flex items-center">
        {/* Left Side - Content */}
        <div className="relative z-20 w-1/2 p-8 md:p-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Decorative Element */}
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />

            <h1 className="text-5xl md:text-7xl font-bold text-left">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500">
                {title}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 text-left max-w-2xl leading-relaxed">
              {subtitle}
            </p>

            {/* Optional: Modern accent decorations */}
            <div className="flex gap-4 mt-4">
              <div className="w-3 h-3 rounded-full bg-blue-500/50" />
              <div className="w-3 h-3 rounded-full bg-cyan-400/50" />
              <div className="w-3 h-3 rounded-full bg-blue-600/50" />
            </div>
          </motion.div>
        </div>

        {/* Right Side - Video */}
        <div className="relative w-1/2 h-4/5 pr-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 z-10" />

            {/* Decorative corner accents */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/20 z-20" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/20 z-20" />

            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator with enhanced styling */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center space-y-3">
          <span className="text-slate-400 text-sm tracking-wider uppercase">
            Scroll Down
          </span>
          <div className="relative w-6 h-10 rounded-full border-2 border-slate-400">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute top-1 left-1/2 w-1 h-1 bg-slate-400 rounded-full transform -translate-x-1/2"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
