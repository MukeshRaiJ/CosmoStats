import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Satellite,
  Weight,
  Calendar,
  Globe,
  Award,
  LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";

// Interfaces remain the same
interface Constellation {
  quantity?: number;
  totalConstellationMass?: number;
}

interface Satellite {
  country?: string;
  mass?: number;
  quantity?: number;
  constellation?: Constellation;
  satellites?: Satellite[];
}

interface Launch {
  dateTime: string;
  launchOutcome: string;
  orbit?: string;
  payload: {
    totalMass?: number;
    satellites: Satellite[];
  };
}

interface LaunchData {
  launches: Launch[];
}

interface Stat {
  title: string;
  value: number | string;
  subtext: string;
  icon: LucideIcon;
  gradient: string;
}

// Helper function remains the same
const countSatellites = (satellites: Satellite[], isIndian = false): number => {
  return satellites.reduce((count, sat) => {
    if (sat.satellites) {
      return count + countSatellites(sat.satellites, isIndian);
    }
    if (sat.constellation?.quantity) {
      return (
        count +
        ((isIndian && sat.country === "India") ||
        (!isIndian && sat.country !== "India")
          ? sat.constellation.quantity
          : 0)
      );
    }
    if (sat.quantity) {
      return (
        count +
        ((isIndian && sat.country === "India") ||
        (!isIndian && sat.country !== "India")
          ? sat.quantity
          : 0)
      );
    }
    return (
      count +
      ((isIndian && sat.country === "India") ||
      (!isIndian && sat.country !== "India")
        ? 1
        : 0)
    );
  }, 0);
};

const StatCard = ({ stat, index }: { stat: Stat; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <Card className="group h-full bg-slate-900/50 backdrop-blur-lg border-slate-700/50 relative overflow-hidden hover:border-blue-500/50 transition-all duration-300">
          {/* Gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-all duration-700 ease-out`}
          />

          {/* Floating orb effect */}
          <motion.div
            className={`absolute w-32 h-32 rounded-full bg-gradient-to-r ${stat.gradient} blur-3xl opacity-5 -z-10`}
            animate={{
              x: [0, 10, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Main content */}
          <div className="relative z-10 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-100 tracking-wide">
                {stat.title}
              </h3>
              <motion.div
                whileHover={{
                  rotate: 360,
                  scale: 1.2,
                }}
                transition={{ duration: 0.4 }}
                className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} bg-opacity-10 hover:bg-opacity-20 transition-all duration-300`}
              >
                <stat.icon className="h-4 w-4 text-white" />
              </motion.div>
            </div>

            {/* Value */}
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
              >
                {stat.value}
              </motion.div>

              {/* Subtext with decorative lines */}
              <div className="flex items-center space-x-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <p className="text-xs text-slate-300 font-medium">
                  {stat.subtext}
                </p>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
            </div>
          </div>

          {/* Bottom highlight */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent" />

          {/* Side highlight */}
          <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-slate-500/20 to-transparent" />
        </Card>
      </motion.div>
    </motion.div>
  );
};

const StatsGrid: React.FC<{ data: LaunchData }> = ({ data }) => {
  const stats: Stat[] = useMemo(() => {
    const totalLaunches = data.launches.length;
    const successfulLaunches = data.launches.filter(
      (l) => l.launchOutcome === "Success"
    ).length;
    const foreignSatellites = data.launches.reduce(
      (acc, launch) => acc + countSatellites(launch.payload.satellites, false),
      0
    );

    const totalMass = data.launches.reduce((acc, launch) => {
      if (launch.payload.totalMass) return acc + launch.payload.totalMass;
      return (
        acc +
        launch.payload.satellites.reduce((massAcc, sat) => {
          if (sat.mass) return massAcc + sat.mass;
          if (sat.constellation?.totalConstellationMass)
            return massAcc + sat.constellation.totalConstellationMass;
          return massAcc;
        }, 0)
      );
    }, 0);

    const uniqueOrbits = new Set(
      data.launches
        .map((launch) => launch.orbit)
        .filter(
          (orbit): orbit is string => orbit !== undefined && orbit.length > 0
        )
    ).size;

    let currentStreak = 0;
    for (let i = data.launches.length - 1; i >= 0; i--) {
      if (data.launches[i].launchOutcome === "Success") currentStreak++;
      else break;
    }

    const years = data.launches.map((launch) =>
      new Date(launch.dateTime.split(" ")[0]).getFullYear()
    );
    const yearsActive = Math.max(...years) - Math.min(...years) + 1;

    return [
      {
        title: "Total Launches",
        value: totalLaunches,
        subtext: `${successfulLaunches} successful (${(
          (successfulLaunches / totalLaunches) *
          100
        ).toFixed(1)}%)`,
        icon: Rocket,
        gradient: "from-blue-500 to-cyan-500",
      },
      {
        title: "Foreign Satellites",
        value: foreignSatellites,
        subtext: "International Payloads",
        icon: Satellite,
        gradient: "from-green-500 to-emerald-500",
      },
      {
        title: "Total Payload Mass",
        value: `${(totalMass / 1000).toFixed(1)}`,
        subtext: "Metric tonnes to orbit",
        icon: Weight,
        gradient: "from-yellow-500 to-orange-500",
      },
      {
        title: "Years Active",
        value: yearsActive,
        subtext: "Of space exploration",
        icon: Calendar,
        gradient: "from-purple-500 to-pink-500",
      },
      {
        title: "Unique Orbits",
        value: uniqueOrbits,
        subtext: "Orbital destinations",
        icon: Globe,
        gradient: "from-red-500 to-pink-500",
      },
      {
        title: "Current Streak",
        value: currentStreak,
        subtext: "Successful launches",
        icon: Award,
        gradient: "from-teal-500 to-green-500",
      },
    ];
  }, [data]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} index={index} />
        ))}
      </div>
    </div>
  );
};

export default StatsGrid;
