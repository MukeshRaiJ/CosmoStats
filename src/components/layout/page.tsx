"use client";

import React, { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsGrid from "@/components/grid/page";
import Footer from "@/components/layout/footer";
import Hero from "@/components/layout/hero";
import { LaunchData, LaunchVisualizerContentProps } from "@/theme/types";
import { ThemeToggle, useTheme, ThemeProvider } from "@/theme/theme"; // Import from your theme context file

// Memoized Tabs Component
const TabsSection = memo<{
  selectedTab: string;
  onTabChange: (tab: string) => void;
}>(({ selectedTab, onTabChange }) => {
  const { isDark } = useTheme(); // Use theme context
  const tabItems = React.useMemo(
    () => ["Vehicles", "Timeline", "Payloads"],
    []
  );

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

// Optimized Launch Visualizer Content Component
const LaunchVisualizerContent = memo<LaunchVisualizerContentProps>(
  ({ launchData }) => {
    const [selectedTab, setSelectedTab] = useState<string>("vehicles");

    const handleTabChange = React.useCallback((tab: string) => {
      setSelectedTab(tab);
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full relative z-10 p-4"
      >
        <div className="mb-8">
          <StatsGrid data={launchData} />
        </div>

        <TabsSection selectedTab={selectedTab} onTabChange={handleTabChange} />

        <Footer />
      </motion.div>
    );
  }
);

LaunchVisualizerContent.displayName = "LaunchVisualizerContent";

// Main LaunchVisualizer Component
const LaunchVisualizer = memo(() => {
  const [launchData, setLaunchData] = useState<LaunchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div className="min-h-screen relative">
      <ThemeToggle />
      <Hero
        title="ISRO Launch Analytics"
        subtitle={`Exploring India's Journey to the Stars (Last Updated: ${launchData.metadata.lastUpdated})`}
        videoUrl="/0108.mp4"
      />
      <LaunchVisualizerContent launchData={launchData} />
    </div>
  );
});

LaunchVisualizer.displayName = "LaunchVisualizer";

// Wrapped component with ThemeProvider
const WrappedLaunchVisualizer: React.FC = () => {
  return (
    <ThemeProvider>
      <LaunchVisualizer />
    </ThemeProvider>
  );
};

export default WrappedLaunchVisualizer;
