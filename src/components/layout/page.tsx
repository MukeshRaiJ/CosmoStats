"use client";

import React, { useState, useCallback, memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsGrid from "@/components/grid/page";
import Footer from "@/components/layout/footer";
import Hero from "@/components/layout/hero";
import { LaunchData } from "@/theme/types";
import Timeline from "@/components/timeline/page";
import Overview from "@/components/payloads/page";
import RocketShowcase from "@/components/vehicle/page";

// Theme configuration
const theme = {
  background: "bg-slate-900",
  gradient: "from-blue-900/20 via-purple-900/20 to-cyan-900/20",
  text: "text-slate-100",
  tabBackground: "bg-slate-900/50",
  contentBackground: "bg-slate-900/50",
  particleColor: "bg-white/50",
};

// Theme for Overview component
const overviewColors = {
  background: "bg-slate-900",
  text: "text-slate-100",
  subText: "text-slate-400",
  border: "border-slate-700",
  glassBg: "bg-slate-900/50 backdrop-blur-lg backdrop-saturate-150",
  chartGrid: "#334155",
  chartText: "#e2e8f0",
  chartColors: ["#3b82f6", "#06b6d4", "#6366f1", "#8b5cf6", "#ec4899"],
};

// Animation configuration
const defaultAnimation = {
  particleCount: 20,
  rotationDuration: 20,
  particleDurationMin: 5,
  particleDurationMax: 15,
};

// Animated Background Component
interface AnimatedBackgroundProps {
  animationConfig?: typeof defaultAnimation;
}

const AnimatedBackground = memo<AnimatedBackgroundProps>(
  ({ animationConfig = defaultAnimation }) => {
    const bgGradient = `bg-gradient-to-br ${theme.gradient}`;

    // Constellation points for the SVG paths
    const constellationPaths = useMemo(
      () => [
        "M100,100 L200,150 L300,200 L400,180",
        "M500,200 L600,180 L700,250 L800,220",
        "M150,300 L250,320 L350,280 L450,350",
        "M850,100 L750,150 L650,120 L550,180",
      ],
      []
    );

    // Stars configuration
    const stars = useMemo(
      () =>
        Array.from({ length: 100 }).map((_, i) => ({
          id: `star-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2,
        })),
      []
    );

    // Orbital circles configuration
    const orbitalCircles = useMemo(
      () => [
        { size: "w-48 h-48", position: "top-1/4 -left-24", delay: 0 },
        { size: "w-64 h-64", position: "bottom-1/4 -right-32", delay: 0.2 },
        { size: "w-32 h-32", position: "top-1/3 right-24", delay: 0.4 },
        { size: "w-40 h-40", position: "bottom-1/3 left-16", delay: 0.6 },
      ],
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

        {/* Orbital Circles */}
        {orbitalCircles.map((circle, index) => (
          <div
            key={`orbital-${index}`}
            className={`absolute ${circle.position}`}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 20 + index * 5,
                repeat: Infinity,
                ease: "linear",
                delay: circle.delay,
              }}
              className={`relative ${circle.size}`}
            >
              <div className="absolute inset-0 border border-current opacity-20 rounded-full" />
              <div className="absolute inset-4 border border-current opacity-10 rounded-full" />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 20 + index * 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: circle.delay,
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-current opacity-30 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              />
            </motion.div>
          </div>
        ))}

        {/* Stars layer */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-current rounded-full"
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
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
            }}
          />
        ))}

        {/* Constellation SVG layer */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {constellationPaths.map((path, index) => (
            <motion.path
              key={`constellation-${index}`}
              d={path}
              className="stroke-current"
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
        </svg>

        {/* Floating geometric accents */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`geometric-${i}`}
            className="absolute opacity-20"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-32 h-32 border border-current rounded-lg transform rotate-45" />
          </motion.div>
        ))}
      </div>
    );
  }
);

AnimatedBackground.displayName = "AnimatedBackground";

// Define TabsSectionProps interface
interface TabsSectionProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  launchData: LaunchData;
}

// TabsSection Component
const TabsSection = memo<TabsSectionProps>(
  ({ selectedTab, onTabChange, launchData }) => {
    const tabItems = ["Overview", "Vehicles", "Timeline", "Payloads"];

    // Prepare launches data
    const launches = useMemo(() => {
      return launchData?.launches || [];
    }, [launchData]);

    return (
      <Tabs
        value={selectedTab}
        onValueChange={onTabChange}
        className="w-full space-y-4"
      >
        <TabsList
          className={`${theme.tabBackground} backdrop-blur-lg backdrop-saturate-150 
          p-1 rounded-xl w-full grid grid-cols-4`}
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

        <TabsContent value="payloads" className="w-full">
          <div
            className={`${theme.text} ${theme.contentBackground} 
            p-4 backdrop-blur-lg backdrop-saturate-150 rounded-xl`}
          >
            Payloads component coming soon...
          </div>
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
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [loading, setLoading] = useState(true);

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
    <div className={`min-h-screen ${theme.background} ${theme.text}`}>
      <AnimatedBackground animationConfig={animationConfig} />

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
          <StatsGrid data={launchData} isDark={true} />
        </div>

        <TabsSection
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          launchData={launchData}
        />

        <Footer />
      </motion.div>
    </div>
  );
};

export default LaunchVisualizer;
