"use client";

import React, { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket } from "lucide-react";
import StatsGrid from "@/components/grid/page";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Hero from "@/components/layout/hero";
import Timeline from "@/components/timeline/page";
import Overview from "@/components/payloads/page";
import RocketShowcase from "@/components/vehicle/page";
import SatelliteTimeline from "@/components/satellites/page";
import LaunchesOverview from "@/components/upcoming/page";
import Payload from "@/components/payload_mix/page";
import AnimatedBackground, {
  theme,
  defaultAnimation,
} from "./AnimatedBackground";

// Define base interfaces
interface Launch {
  launchNo: number;
  // Add other launch properties here
}

export interface LaunchData {
  launches: Launch[];
  metadata: {
    lastUpdated: string;
  };
}

interface SatelliteLaunch {
  name: string;
  launchDate: string;
  launchVehicle: string;
  mass: number;
  orbit: string;
  purpose: string;
  status: string;
}

interface SatelliteData {
  indian_satellite_launches: SatelliteLaunch[];
}

interface ThemeColors {
  background: string;
  text: string;
  subText: string;
  border: string;
  glassBg: string;
  chartGrid: string;
  chartText: string;
  chartColors: string[];
}

// Theme for Overview component
const overviewColors: ThemeColors = {
  background: "bg-slate-900",
  text: "text-slate-100",
  subText: "text-slate-400",
  border: "border-slate-700",
  glassBg: "bg-slate-900/50 backdrop-blur-lg backdrop-saturate-150",
  chartGrid: "#334155",
  chartText: "#e2e8f0",
  chartColors: ["#3b82f6", "#06b6d4", "#6366f1", "#8b5cf6", "#ec4899"],
};

// Loading Screen Component
const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900">
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mb-8"
      >
        <Rocket size={48} className="text-blue-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="text-xl font-semibold text-slate-100"
      >
        Preparing for Launch...
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-4"
      />
    </div>
  );
};

// Define TabsSectionProps interface
interface TabsSectionProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  launchData: LaunchData;
  satelliteData: SatelliteData;
}

// TabsSection Component
const TabsSection = memo<TabsSectionProps>(
  ({ selectedTab, onTabChange, launchData, satelliteData }) => {
    const tabItems = [
      "Overview",
      "Vehicles",
      "Timeline",
      "Satellites",
      "Payloads",
      "Launches",
    ] as const;

    // Convert launchNo to string in launches array
    const launches =
      launchData?.launches?.map((launch) => ({
        ...launch,
        launchNo: launch.launchNo.toString(),
      })) || [];

    return (
      <Tabs
        value={selectedTab}
        onValueChange={onTabChange}
        className="w-full space-y-4"
      >
        <TabsList
          className={`${theme.tabBackground} backdrop-blur-lg backdrop-saturate-150 
          p-1 rounded-xl w-full grid grid-cols-6`}
        >
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.toLowerCase()}
              value={tab.toLowerCase()}
              className="rounded-lg transition-all duration-300 
              data-[state=active]:bg-gradient-to-r 
              data-[state=active]:from-blue-500 
              data-[state=active]:to-cyan-500 
              data-[state=active]:text-white text-slate-400"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="w-full">
          <Overview data={launchData} colors={overviewColors} />
        </TabsContent>

        <TabsContent value="vehicles" className="w-full">
          <RocketShowcase
            background={theme.background}
            text={theme.text}
            contentBackground={theme.contentBackground}
            animationConfig={defaultAnimation}
          />
        </TabsContent>

        <TabsContent value="timeline" className="w-full">
          <Timeline
            data={launches}
            colors={{
              text: theme.text,
              subText: "text-slate-400",
              border: "border-slate-700/20",
              glassBg: theme.contentBackground,
              cardBg: theme.contentBackground,
              highlight: "text-blue-500",
            }}
          />
        </TabsContent>

        <TabsContent value="satellites" className="w-full">
          <SatelliteTimeline
            data={satelliteData.indian_satellite_launches}
            colors={{
              text: theme.text,
              subText: "text-slate-400",
              border: "border-slate-700/20",
              glassBg: theme.contentBackground,
              cardBg: theme.contentBackground,
              highlight: "text-blue-500",
            }}
          />
        </TabsContent>

        <TabsContent value="payloads" className="w-full">
          <div
            className={`${theme.text} ${theme.contentBackground} 
            p-4 backdrop-blur-lg backdrop-saturate-150 rounded-xl`}
          >
            Payloads component coming soon...
          </div>
        </TabsContent>

        <TabsContent value="launches" className="w-full">
          <LaunchesOverview launchData={launchData} />
        </TabsContent>
      </Tabs>
    );
  }
);

TabsSection.displayName = "TabsSection";

// Main App Component
interface LaunchVisualizerProps {
  animationConfig?: typeof defaultAnimation;
}

const LaunchVisualizer: React.FC<LaunchVisualizerProps> = ({
  animationConfig = defaultAnimation,
}) => {
  const [launchData, setLaunchData] = useState<LaunchData | null>(null);
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(
    null
  );
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [loading, setLoading] = useState<boolean>(true);

  const handleTabChange = useCallback((tab: string) => setSelectedTab(tab), []);

  // Fetch data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [launchResponse, satelliteResponse] = await Promise.all([
          fetch("/isro_data.json"),
          fetch("/satellites.json"),
        ]);
        const [launchData, satelliteData] = await Promise.all([
          launchResponse.json(),
          satelliteResponse.json(),
        ]);
        setLaunchData(launchData);
        setSatelliteData(satelliteData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!launchData || !satelliteData) {
    return <div>Error loading data</div>;
  }

  return (
    <div className={`min-h-screen ${theme.background} ${theme.text}`}>
      <AnimatedBackground animationConfig={animationConfig} />
      <div className="relative">
        <Header onTabChange={handleTabChange} selectedTab={selectedTab} />

        <div className="py-6">
          <Hero
            title="ISRO Launch Analytics"
            subtitle={`Exploring India's Journey to the Stars (Last Updated: ${launchData.metadata.lastUpdated})`}
            videoUrl="/0108.mp4"
          />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full relative z-10 p-4"
      >
        <div className="mb-8">
          <StatsGrid data={launchData} isDark={true} />
        </div>

        <TabsSection
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          launchData={launchData}
          satelliteData={satelliteData}
        />
      </motion.div>
      <Footer />
    </div>
  );
};

export default LaunchVisualizer;
