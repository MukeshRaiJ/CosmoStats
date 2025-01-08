"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsGrid from "@/components/grid/page";
import Footer from "@/components/layout/footer";
import Hero from "@/components/layout/hero";

// Animated Background Component
const AnimatedBackground: React.FC = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
          className="w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl"
        />
      </div>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
            scale: 0,
          }}
          animate={{
            y: [null, "-100vh"],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
          className="absolute w-1 h-1 bg-white rounded-full opacity-50"
        />
      ))}
    </div>
  );
};

// Interfaces
interface Launch {
  launchNo: number;
  flightNo: string;
  dateTime: string;
  rocket: string;
  configuration: string;
  launchOutcome: string;
  orbit?: string;
  payload: {
    totalMass?: number;
    massUnit?: string;
    satellites: Array<{
      name: string;
      country: string;
      mass?: number;
      massUnit?: string;
    }>;
  };
  missionDescription: string;
  notes: string;
}

interface LaunchData {
  metadata: {
    lastUpdated: string;
    totalLaunches: number;
    launchVehicles: string[];
  };
  launches: Launch[];
}

// LaunchVisualizerContent Component
const LaunchVisualizerContent: React.FC<{ launchData: LaunchData }> = ({
  launchData,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>("vehicles");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full relative z-10 p-4"
    >
      {/* Stats Grid */}
      <div className="mb-8">
        <StatsGrid data={launchData} />
      </div>

      {/* Tabs Section */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full space-y-4"
      >
        <TabsList className="bg-slate-900/50 backdrop-blur-lg backdrop-saturate-150 p-1 rounded-xl w-full grid grid-cols-3">
          {["Vehicles", "Timeline", "Payloads"].map((tab) => (
            <TabsTrigger
              key={tab.toLowerCase()}
              value={tab.toLowerCase()}
              className="rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-slate-400"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="vehicles" className="w-full">
          <div className="text-slate-100 p-4 bg-slate-900/50 backdrop-blur-lg backdrop-saturate-150 rounded-xl">
            Vehicles component coming soon...
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="w-full">
          <div className="text-slate-100 p-4 bg-slate-900/50 backdrop-blur-lg backdrop-saturate-150 rounded-xl">
            Timeline component coming soon...
          </div>
        </TabsContent>

        <TabsContent value="payloads" className="w-full">
          <div className="text-slate-100 p-4 bg-slate-900/50 backdrop-blur-lg backdrop-saturate-150 rounded-xl">
            Payloads component coming soon...
          </div>
        </TabsContent>
      </Tabs>
      <Footer />
    </motion.div>
  );
};

// Main LaunchVisualizer Component
const LaunchVisualizer: React.FC = () => {
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
      <div className="flex items-center justify-center h-screen text-slate-100">
        Loading...
      </div>
    );
  }

  if (!launchData) {
    return <div className="text-slate-100">Error loading data</div>;
  }

  return (
    <div className="bg-slate-900 min-h-screen relative">
      <AnimatedBackground />

      {/* Hero Component */}
      <Hero
        title="ISRO Launch Analytics"
        subtitle={`Exploring India's Journey to the Stars (Last Updated: ${launchData.metadata.lastUpdated})`}
        videoUrl="/0108.mp4"
      />

      {/* Main Content */}
      <LaunchVisualizerContent launchData={launchData} />
    </div>
  );
};

export default LaunchVisualizer;
