import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Package, Globe2, Rocket, Satellite } from "lucide-react";
import _ from "lodash";

const PayloadsDashboard = ({ launchData, satelliteData }) => {
  const missionStats = useMemo(() => {
    if (!launchData?.launches) return null;

    const stats = {
      totalMass: 0,
      totalSatellites: 0,
      uniqueCountries: new Set(),
      missionTypes: {},
      successRate: 0,
      successfulMissions: 0,
    };

    let totalMissions = 0;

    launchData.launches.forEach((launch) => {
      if (launch.payload) {
        // Add total mass
        if (launch.payload.totalMass) {
          stats.totalMass += launch.payload.totalMass;
        }

        // Count satellites
        if (launch.payload.satellites) {
          launch.payload.satellites.forEach((sat) => {
            stats.totalSatellites++;
            if (sat.country) {
              stats.uniqueCountries.add(sat.country);
            }
          });
        }
      }

      // Track mission success
      totalMissions++;
      if (launch.launchOutcome?.toLowerCase().includes("success")) {
        stats.successfulMissions++;
      }
    });

    stats.successRate = (stats.successfulMissions / totalMissions) * 100;

    return stats;
  }, [launchData]);

  const yearlyTrends = useMemo(() => {
    if (!launchData?.launches) return [];

    const yearlyData = {};

    launchData.launches.forEach((launch) => {
      const year = new Date(launch.dateTime.split("|")[0]).getFullYear();

      if (!yearlyData[year]) {
        yearlyData[year] = {
          year,
          totalMass: 0,
          satelliteCount: 0,
          missions: 0,
        };
      }

      if (launch.payload?.totalMass) {
        yearlyData[year].totalMass += launch.payload.totalMass;
      }

      if (launch.payload?.satellites) {
        yearlyData[year].satelliteCount += launch.payload.satellites.length;
      }

      yearlyData[year].missions++;
    });

    return Object.values(yearlyData).sort((a, b) => a.year - b.year);
  }, [launchData]);

  const orbitDistribution = useMemo(() => {
    if (!launchData?.launches) return [];

    const orbits = {};
    launchData.launches.forEach((launch) => {
      if (launch.orbit) {
        const orbitType = launch.orbit.toUpperCase();
        orbits[orbitType] = (orbits[orbitType] || 0) + 1;
      }
    });

    return Object.entries(orbits)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [launchData]);

  const missionTypeDistribution = useMemo(() => {
    if (!satelliteData?.indian_satellite_launches) return [];

    const missions = {};
    satelliteData.indian_satellite_launches.forEach((satellite) => {
      if (satellite.mission) {
        const missionTypes = satellite.mission.split(", ");
        missionTypes.forEach((type) => {
          missions[type] = (missions[type] || 0) + 1;
        });
      }
    });

    return Object.entries(missions)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [satelliteData]);

  const COLORS = [
    "#3b82f6",
    "#06b6d4",
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#10b981",
  ];

  if (!missionStats) {
    return <div className="text-slate-400">Loading payload data...</div>;
  }

  return (
    <div className="w-full space-y-6 p-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-lg backdrop-saturate-150">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Payload Mass
                </p>
                <h3 className="text-2xl font-bold text-slate-100 mt-2">
                  {Math.round(missionStats.totalMass).toLocaleString()} kg
                </h3>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg backdrop-saturate-150">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Success Rate
                </p>
                <h3 className="text-2xl font-bold text-slate-100 mt-2">
                  {missionStats.successRate.toFixed(1)}%
                </h3>
              </div>
              <Rocket className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg backdrop-saturate-150">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Satellites
                </p>
                <h3 className="text-2xl font-bold text-slate-100 mt-2">
                  {missionStats.totalSatellites.toLocaleString()}
                </h3>
              </div>
              <Satellite className="w-8 h-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-lg backdrop-saturate-150">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Partner Countries
                </p>
                <h3 className="text-2xl font-bold text-slate-100 mt-2">
                  {missionStats.uniqueCountries.size}
                </h3>
              </div>
              <Globe2 className="w-8 h-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 backdrop-blur-lg backdrop-saturate-150">
          <CardHeader>
            <CardTitle>Yearly Launch Mass Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalMass"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6" }}
                    name="Total Mass (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-lg backdrop-saturate-150">
          <CardHeader>
            <CardTitle>Mission Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={missionTypeDistribution}
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {missionTypeDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {missionTypeDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-slate-400 truncate">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-lg backdrop-saturate-150 lg:col-span-2">
          <CardHeader>
            <CardTitle>Satellite Distribution by Orbit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orbitDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PayloadsDashboard;
