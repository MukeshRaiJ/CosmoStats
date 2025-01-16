import React, { useState } from "react";
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

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-8 py-4 rounded-2xl text-sm font-medium transition-all duration-500 relative overflow-hidden
    ${
      active
        ? "text-white shadow-lg shadow-blue-500/10"
        : "text-slate-400 hover:text-slate-200"
    }`}
  >
    {children}
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 
                 border border-white/5 backdrop-blur-sm -z-10"
      />
    )}
  </button>
);

const MissionCard = ({ mission }) => {
  const getStatusColor = (outcome) => {
    switch (outcome?.toLowerCase()) {
      case "success":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
      case "failure":
        return "bg-rose-500/10 text-rose-300 border-rose-500/20";
      case "partial success":
      case "partial failure":
        return "bg-amber-500/10 text-amber-300 border-amber-500/20";
      default:
        return "bg-blue-500/10 text-blue-300 border-blue-500/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Card
        className="bg-white/5 hover:bg-white/10 backdrop-blur-2xl border-white/10 
                     transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/5 mb-6
                     rounded-2xl overflow-hidden"
      >
        <CardContent className="p-6">
          <div className="flex gap-8">
            <div className="relative w-28 h-28 flex-shrink-0">
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 
                           rounded-xl overflow-hidden group-hover:from-blue-500/30 group-hover:to-cyan-500/30 
                           transition-all duration-500"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.4),rgba(255,255,255,0))]" />
                <Rocket
                  className="w-14 h-14 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                               text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {mission.payload.satellites[0].name}
                  </h3>
                  <p className="text-sm text-slate-300 flex items-center gap-2">
                    <Satellite className="w-4 h-4" />
                    {mission.payload.satellites[0].country}
                  </p>
                </div>

                <Badge
                  className={`${getStatusColor(
                    mission.launchOutcome
                  )} border px-4 py-1.5 
                               backdrop-blur-md rounded-xl font-medium flex items-center gap-2`}
                >
                  {mission.rocket}
                  <ArrowUpRight className="w-4 h-4" />
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-white/5 rounded-xl p-4 backdrop-blur-sm">
                <div className="space-y-3">
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
                  <span>{mission.launchSite}</span>
                </div>
              </div>

              <p
                className="text-sm text-slate-300 line-clamp-2 group-hover:text-slate-100 transition-colors duration-300 
                        pl-4 border-l border-blue-500/20 group-hover:border-blue-500/40"
              >
                {mission.missionDescription || mission.notes}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const LaunchesOverview = ({ launchData }) => {
  const [activeTab, setActiveTab] = useState("completed");
  const recentLaunches = [...launchData.launches].reverse().slice(0, 5);
  const upcomingLaunches = [
    {
      dateTime: "2025-02-15 | 10:30",
      rocket: "PSLV",
      configuration: "XL",
      launchSite: "FLP - SDSC SHAR",
      payload: {
        satellites: [
          {
            name: "RISAT-2BR3",
            country: "India",
          },
        ],
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
        satellites: [
          {
            name: "GSAT-30",
            country: "India",
          },
        ],
      },
      missionDescription: "Communication Satellite Launch",
      launchOutcome: "Scheduled",
    },
  ];

  return (
    <Card className="bg-transparent border-0 overflow-hidden">
      <CardHeader className="pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <CardTitle className="text-4xl font-bold text-white flex items-center gap-4">
            <div
              className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                          backdrop-blur-xl border border-white/10"
            >
              <Rocket className="w-10 h-10 text-blue-400" />
            </div>
            Space Missions
            <Sparkles className="w-6 h-6 text-blue-400 ml-2" />
          </CardTitle>
        </motion.div>

        <div className="flex gap-3 p-1.5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 w-fit">
          <TabButton
            active={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
          >
            Completed Missions
            <span className="ml-2 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 text-xs">
              {recentLaunches.length}
            </span>
          </TabButton>
          <TabButton
            active={activeTab === "upcoming"}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Missions
            <span className="ml-2 px-3 py-1 rounded-xl bg-blue-500/10 text-blue-300 text-xs">
              {upcomingLaunches.length}
            </span>
          </TabButton>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <AnimatePresence mode="wait">
          {activeTab === "completed" ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {recentLaunches.map((mission, index) => (
                <MissionCard key={index} mission={mission} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {upcomingLaunches.map((mission, index) => (
                <MissionCard key={index} mission={mission} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default LaunchesOverview;
