import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  Rocket,
  Satellite,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Satellite {
  name: string;
  country: string;
}

interface Payload {
  satellites: Satellite[];
}

interface Mission {
  dateTime: string;
  rocket: string;
  configuration?: string;
  launchSite: string;
  payload: Payload;
  missionDescription?: string;
  notes?: string;
  launchOutcome?: string;
}

interface LaunchData {
  launches: Mission[];
}

interface TabButtonProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

interface MissionCardProps {
  mission: Mission;
  index: number;
}

interface LaunchesOverviewProps {
  launchData?: LaunchData;
}

// Mission images mapping
const getMissionImage = (missionName: string): string => {
  const missionImages: Record<string, string> = {
    // Past launches
    "SPADEX-A": "/missions/SPADEX.jpg",
    "Proba-3": "/missions/PROBA3.webp",
    "EOS-8": "/missions/sslvd3.jpg",
    "INSAT-3DS": "/missions/insat3ds.jpg",
    XPoSat: "/missions/xoposat.webp",
    // Upcoming launches
    "RISAT-2BR3": "/missions/INSAT3DS.JPG",
    "GSAT-30": "/missions/gsat.jpg",
  };

  return missionImages[missionName] || "/missions/default-mission.jpg";
};

const TabButton: React.FC<TabButtonProps> = ({ active, children, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-medium 
                transition-all duration-500 relative overflow-hidden whitespace-nowrap
                ${
                  active ? "text-white" : "text-slate-400 hover:text-slate-200"
                }`}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    {children}
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 
                   border border-white/5 backdrop-blur-sm -z-10"
      />
    )}
  </motion.button>
);

const MissionCard: React.FC<MissionCardProps> = ({ mission, index }) => {
  const missionImage = getMissionImage(mission.payload.satellites[0].name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <Card
        className="bg-slate-900/50 relative overflow-hidden 
                  border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 h-96"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={missionImage}
            alt={`${mission.payload.satellites[0].name} mission`}
            fill
            className="object-cover opacity-50 group-hover:opacity-60
              transition-all duration-300"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col">
          {/* Header Section */}
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-300 
                           transition-colors duration-300 flex items-center gap-2"
                >
                  <span>{mission.payload.satellites[0].name}</span>
                  <span className="text-blue-400">|</span>
                  <span>{mission.dateTime.split(" ")[0]}</span>
                </h3>
              </div>
              <Badge
                className="px-4 py-1.5 text-white rounded-xl 
                          text-sm font-medium flex items-center gap-2 bg-black/30"
              >
                {mission.rocket}
                <ArrowUpRight className="w-4 h-4" />
              </Badge>
            </div>
          </div>

          {/* Spacer to push the info section to bottom */}
          <div className="flex-grow" />

          {/* Info Section at Bottom */}
          <div className="p-6 backdrop-blur-sm bg-black/40">
            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>{mission.dateTime.split(" ")[0]}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>{mission.dateTime.split(" ")[1] || "TBD"}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="line-clamp-2">{mission.launchSite}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <Satellite className="w-4 h-4 text-blue-400" />
                <span>{mission.payload.satellites[0].country}</span>
              </div>
            </div>

            {/* Description */}
            <p
              className="mt-4 text-sm text-slate-300 line-clamp-2 group-hover:text-slate-100 
                       transition-colors duration-300 pl-4 border-l border-blue-500/20 
                       group-hover:border-blue-500/40"
            >
              {mission.missionDescription || mission.notes}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const LaunchesOverview: React.FC<LaunchesOverviewProps> = ({ launchData }) => {
  const [activeTab, setActiveTab] = useState<"completed" | "upcoming">(
    "completed"
  );
  const recentLaunches = [...(launchData?.launches || [])]
    .reverse()
    .slice(0, 5);

  const upcomingLaunches: Mission[] = [
    {
      dateTime: "2025-02-15 | 10:30",
      rocket: "PSLV",
      configuration: "XL",
      launchSite: "FLP - SDSC SHAR",
      payload: {
        satellites: [{ name: "RISAT-2BR3", country: "India" }],
      },
      missionDescription: "Radar Imaging Satellite Launch",
      launchOutcome: "Scheduled",
    },
    {
      dateTime: "2025-03-20 | 12:00",
      rocket: "GSLV Mk III",
      configuration: "M5",
      launchSite: "SLP - SDSC SHAR",
      payload: {
        satellites: [{ name: "GSAT-30", country: "India" }],
      },
      missionDescription: "Communication Satellite Launch",
      launchOutcome: "Scheduled",
    },
  ];

  return (
    <Card className="bg-transparent border-0 overflow-hidden">
      <CardHeader className="pb-4 md:pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6 md:mb-8"
        >
          <CardTitle className="text-2xl md:text-4xl font-bold text-white flex items-center gap-3 md:gap-4">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.4 }}
              className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br 
                        from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10"
            >
              <Rocket className="w-6 h-6 md:w-10 md:h-10 text-blue-400" />
            </motion.div>
            Space Missions
            <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-blue-400 ml-1 md:ml-2" />
          </CardTitle>
        </motion.div>

        <div
          className="flex gap-2 md:gap-3 p-1 md:p-1.5 bg-white/5 backdrop-blur-xl 
                     rounded-xl md:rounded-2xl border border-white/10 w-full md:w-fit"
        >
          <TabButton
            active={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
          >
            Completed
            <span
              className="ml-2 px-2 md:px-3 py-0.5 md:py-1 rounded-lg md:rounded-xl 
                           bg-emerald-500/10 text-emerald-300 text-xs"
            >
              {recentLaunches.length}
            </span>
          </TabButton>
          <TabButton
            active={activeTab === "upcoming"}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
            <span
              className="ml-2 px-2 md:px-3 py-0.5 md:py-1 rounded-lg md:rounded-xl 
                           bg-blue-500/10 text-blue-300 text-xs"
            >
              {upcomingLaunches.length}
            </span>
          </TabButton>
        </div>
      </CardHeader>

      <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
        <AnimatePresence mode="wait">
          {activeTab === "completed" ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {recentLaunches.map((mission, index) => (
                <MissionCard key={index} mission={mission} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {upcomingLaunches.map((mission, index) => (
                <MissionCard key={index} mission={mission} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default LaunchesOverview;
