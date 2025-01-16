"use client";
import React from "react";
import { RiRocketLine } from "react-icons/ri";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="text-slate-100 py-4 relative overflow-hidden z-10 w-full">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between space-x-4 w-full"
        >
          <motion.div
            className="flex items-center shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <span className="ml-2 font-semibold text-sm sm:text-base whitespace-nowrap">
              SolidBoosters
            </span>
          </motion.div>
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          <motion.div
            className="flex items-center shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <a
              href="https://x.com/SolidBoosters"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-500 transition-colors p-2"
              aria-label="Follow on X"
            >
              <RiRocketLine className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
