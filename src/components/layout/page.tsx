"use client";
import React, { useState, useCallback, memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsGrid from "@/components/grid/page";
import Footer from "@/components/layout/footer";
import Hero from "@/components/layout/hero";
import { LaunchData } from "@/theme/types";

// Memoized Animated Background Component
const AnimatedBackground = memo<{ isDark: boolean }>(({ isDark }) => {
  const bgGradient = useMemo(
    () =>
      isDark
        ? "bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20"
        : "bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20",
    [isDark]
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 10,
      })),
    []
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
});

AnimatedBackground.displayName = "AnimatedBackground";

// Memoized Theme Toggle Component
const ThemeToggle = memo<{ isDark: boolean; onToggle: () => void }>(
  ({ isDark, onToggle }) => (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer z-[9999]"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  )
);

ThemeToggle.displayName = "ThemeToggle";

// Memoized Tabs Component
const TabsSection = memo<{
  selectedTab: string;
  onTabChange: (tab: string) => void;
  isDark: boolean;
}>(({ selectedTab, onTabChange, isDark }) => {
  const tabItems = useMemo(() => ["Vehicles", "Timeline", "Payloads"], []);

  return (
    <Tabs
      value={selectedTab}
      onValueChange={onTabChange}
      className="w-full space-y-4"
    >
      <TabsList
        className={`${
          isDark ? "bg-slate-900/50" : "bg-white/50"
        } backdrop-blur-lg backdrop-saturate-150 p-1 rounded-xl w-full grid grid-cols-3`}
      >
        {tabItems.map((tab) => (
          <TabsTrigger
            key={tab.toLowerCase()}
            value={tab.toLowerCase()}
            className="rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-slate-400"
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabItems.map((tab) => (
        <TabsContent
          key={tab.toLowerCase()}
          value={tab.toLowerCase()}
          className="w-full"
        >
          <div
            className={`${
              isDark
                ? "text-slate-100 bg-slate-900/50"
                : "text-slate-900 bg-white/50"
            } p-4 backdrop-blur-lg backdrop-saturate-150 rounded-xl`}
          >
            {tab} component coming soon...
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
});

TabsSection.displayName = "TabsSection";

// Main App Component
const LaunchVisualizer = () => {
  const [isDark, setIsDark] = useState(false);
  const [launchData, setLaunchData] = useState<LaunchData | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("vehicles");
  const [loading, setLoading] = useState(true);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);
  const handleTabChange = useCallback((tab: string) => setSelectedTab(tab), []);

  // Fetch data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/isro_data.json");
        const data = await response.json();
        setLaunchData(data);
      } catch (error) {
        console.error("Error fetching launch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!launchData) {
    return <div>Error loading data</div>;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <AnimatedBackground isDark={isDark} />
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

      <Hero
        title="ISRO Launch Analytics"
        subtitle={`Exploring India's Journey to the Stars (Last Updated: ${launchData.metadata.lastUpdated})`}
        videoUrl="/0108.mp4"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full relative z-10 p-4"
      >
        <div className="mb-8">
          <StatsGrid data={launchData} isDark={isDark} />
        </div>

        <TabsSection
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          isDark={isDark}
        />

        <Footer />
      </motion.div>
    </div>
  );
};

export default LaunchVisualizer;
