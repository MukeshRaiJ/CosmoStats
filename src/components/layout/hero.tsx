// components/layout/Hero.tsx
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
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" /> {/* Overlay */}
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
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300">{subtitle}</p>

          {/* Scroll Down Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-slate-400 text-sm">Scroll Down</span>
              <svg
                className="w-6 h-6 text-slate-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
