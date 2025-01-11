import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Legend,
  ComposedChart,
} from "recharts";
import _ from "lodash";
import { LaunchData } from "@/theme/types";

interface OverviewProps {
  data: LaunchData;
  colors: {
    background: string;
    text: string;
    subText: string;
    border: string;
    glassBg: string;
    chartGrid: string;
    chartText: string;
    chartColors: string[];
  };
}

const Overview: React.FC<OverviewProps> = ({ data, colors }) => {
  const [chartType, setChartType] = useState("yearlyForeign");

  // Rest of the component remains the same, just remove AnimatedBackground
  // and useTheme references since we're getting colors as props

  const extractSatellites = (payload) => {
    let satellites = [];
    if (!payload.satellites) return satellites;

    for (const sat of payload.satellites) {
      if (sat.constellation) {
        for (let i = 0; i < sat.constellation.quantity; i++) {
          satellites.push({
            name: `${sat.name}-${i + 1}`,
            country: sat.country,
            mass: sat.constellation.massPerUnit,
            massUnit: sat.constellation.massUnit,
          });
        }
      } else if (sat.satellites) {
        const nestedSats = extractSatellites({ satellites: sat.satellites });
        satellites = satellites.concat(nestedSats);
      } else if (sat.quantity && sat.massPerUnit) {
        for (let i = 0; i < sat.quantity; i++) {
          satellites.push({
            name: `${sat.name}-${i + 1}`,
            country: sat.country,
            mass: sat.massPerUnit,
            massUnit: sat.massUnit,
          });
        }
      } else {
        satellites.push(sat);
      }
    }
    return satellites;
  };

  // Mobile-optimized tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`${colors.glassBg} p-2 border ${colors.border} rounded-lg shadow-xl max-w-[200px]`}
        >
          <p className={`${colors.text} font-medium text-sm truncate`}>
            {label}
          </p>
          {payload.map((item, index) => (
            <p key={index} className={`${colors.subText} text-xs truncate`}>
              {item.name}:{" "}
              {typeof item.value === "number"
                ? item.value.toLocaleString()
                : item.value}
              {item.unit ? ` ${item.unit}` : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const statistics = useMemo(() => {
    // Process all satellites
    const allSatellites = [];
    data.launches.forEach((launch) => {
      const satellites = extractSatellites(launch.payload);
      satellites.forEach((sat) => {
        if (sat.country && sat.country !== "India") {
          allSatellites.push({
            name: sat.name,
            country: sat.country,
            mass: sat.mass || 0,
            year: launch.dateTime.split("-")[0],
            launchNo: launch.launchNo,
          });
        }
      });
    });

    const countryStats = _.chain(allSatellites)
      .groupBy("country")
      .map((sats, country) => ({
        country,
        totalSatellites: sats.length,
        totalMass: _.sumBy(sats, "mass"),
        firstLaunch: _.minBy(sats, "launchNo").launchNo,
        lastLaunch: _.maxBy(sats, "launchNo").launchNo,
        years: _.uniq(sats.map((s) => s.year)).length,
      }))
      .orderBy(["totalSatellites"], ["desc"])
      .take(10)
      .value();

    const yearlyStats = _.chain(allSatellites)
      .groupBy("year")
      .map((sats, year) => ({
        year,
        satellites: sats.length,
        countries: _.uniq(sats.map((s) => s.country)).length,
        totalMass: _.sumBy(sats, "mass"),
      }))
      .orderBy(["year"], ["asc"])
      .value();

    const vehicleStats = _.chain(data.launches)
      .groupBy("rocket")
      .map((launches, vehicle) => ({
        vehicle,
        launches: launches.length,
        success: launches.filter((l) => l.launchOutcome === "Success").length,
        partial: launches.filter(
          (l) =>
            l.launchOutcome === "Partial Success" ||
            l.launchOutcome === "Partial failure"
        ).length,
        failure: launches.filter((l) => l.launchOutcome === "Failure").length,
        totalMass: _.sumBy(launches, "payload.totalMass") || 0,
      }))
      .value();

    const siteStats = _.chain(data.launches)
      .groupBy("launchSite")
      .map((launches, site) => ({
        site: site || "Unknown",
        total: launches.length,
        success: launches.filter((l) => l.launchOutcome === "Success").length,
        vehicles: _.uniq(launches.map((l) => l.rocket)).length,
      }))
      .value();

    return {
      countryStats,
      yearlyStats,
      vehicleStats,
      siteStats,
    };
  }, [data]);

  const renderMainChart = () => {
    switch (chartType) {
      case "yearlyForeign":
        return (
          <ComposedChart data={statistics.yearlyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />
            <XAxis
              dataKey="year"
              stroke={colors.chartText}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={1}
              fontSize={12}
            />
            <YAxis
              yAxisId="left"
              stroke={colors.chartText}
              width={40}
              fontSize={12}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={colors.chartText}
              width={30}
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId="left"
              dataKey="satellites"
              name="Foreign Satellites"
              fill={colors.chartColors[0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="countries"
              name="Partner Countries"
              stroke={colors.chartColors[1]}
            />
          </ComposedChart>
        );

      case "topPartners":
        return (
          <BarChart
            data={statistics.countryStats}
            layout="vertical"
            margin={{ left: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />
            <XAxis type="number" stroke={colors.chartText} fontSize={12} />
            <YAxis
              dataKey="country"
              type="category"
              stroke={colors.chartText}
              width={75}
              fontSize={11}
              tickFormatter={(value) =>
                value.length > 10 ? `${value.slice(0, 10)}...` : value
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="totalSatellites"
              name="Total Satellites"
              fill={colors.chartColors[0]}
            />
          </BarChart>
        );

      case "vehiclePerformance":
        return (
          <BarChart data={statistics.vehicleStats} margin={{ bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />
            <XAxis
              dataKey="vehicle"
              stroke={colors.chartText}
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={11}
              interval={0}
            />
            <YAxis stroke={colors.chartText} fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="success"
              name="Successful"
              stackId="a"
              fill={colors.chartColors[0]}
            />
            <Bar
              dataKey="partial"
              name="Partial Success"
              stackId="a"
              fill={colors.chartColors[1]}
            />
            <Bar
              dataKey="failure"
              name="Failed"
              stackId="a"
              fill={colors.chartColors[2]}
            />
          </BarChart>
        );

      case "launchSites":
        return (
          <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
            <Pie
              data={statistics.siteStats}
              dataKey="total"
              nameKey="site"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name.length > 15 ? name.slice(0, 15) + "..." : name} (${(
                  percent * 100
                ).toFixed(0)}%)`
              }
              labelLine={{ strokeWidth: 1 }}
            >
              {statistics.siteStats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors.chartColors[index % colors.chartColors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "12px", bottom: 0 }}
              formatter={(value) =>
                value.length > 20 ? `${value.slice(0, 20)}...` : value
              }
            />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yearlyForeign">
              Foreign Satellites Timeline
            </SelectItem>
            <SelectItem value="topPartners">
              Top International Partners
            </SelectItem>
            <SelectItem value="vehiclePerformance">
              Launch Vehicle Performance
            </SelectItem>
            <SelectItem value="launchSites">
              Launch Site Distribution
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card
        className={`${colors.glassBg} border ${colors.border} hover:shadow-lg transition-all duration-300`}
      >
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className={`${colors.text} text-base sm:text-lg`}>
            {chartType === "yearlyForeign" &&
              "Foreign Satellite Launches Over Time"}
            {chartType === "topPartners" && "Top International Launch Partners"}
            {chartType === "vehiclePerformance" &&
              "Launch Vehicle Success Rates"}
            {chartType === "launchSites" && "Launch Site Distribution"}
          </CardTitle>
          <CardDescription className={`${colors.subText} text-xs sm:text-sm`}>
            {chartType === "yearlyForeign" &&
              "Number of foreign satellites and partner countries by year"}
            {chartType === "topPartners" &&
              "Countries by total number of satellites launched"}
            {chartType === "vehiclePerformance" &&
              "Success and failure rates by launch vehicle"}
            {chartType === "launchSites" &&
              "Distribution of launches across different launch sites"}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-72 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            {renderMainChart()}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card className={`${colors.glassBg} border ${colors.border}`}>
          <CardHeader className="p-2 sm:p-4">
            <CardTitle className={`${colors.text} text-xs sm:text-sm`}>
              Total Foreign Satellites
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <p className={`${colors.text} text-lg sm:text-2xl font-bold`}>
              {_.sumBy(statistics.countryStats, "totalSatellites")}
            </p>
          </CardContent>
        </Card>

        <Card className={`${colors.glassBg} border ${colors.border}`}>
          <CardHeader className="p-2 sm:p-4">
            <CardTitle className={`${colors.text} text-xs sm:text-sm`}>
              Partner Countries
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <p className={`${colors.text} text-lg sm:text-2xl font-bold`}>
              {statistics.countryStats.length}
            </p>
          </CardContent>
        </Card>

        <Card className={`${colors.glassBg} border ${colors.border}`}>
          <CardHeader className="p-2 sm:p-4">
            <CardTitle className={`${colors.text} text-xs sm:text-sm`}>
              Total Launch Mass
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <p className={`${colors.text} text-lg sm:text-2xl font-bold`}>
              {(_.sumBy(statistics.yearlyStats, "totalMass") / 1000).toFixed(1)}{" "}
              tons
            </p>
          </CardContent>
        </Card>

        <Card className={`${colors.glassBg} border ${colors.border}`}>
          <CardHeader className="p-2 sm:p-4">
            <CardTitle className={`${colors.text} text-xs sm:text-sm`}>
              Peak Year
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <p className={`${colors.text} text-lg sm:text-2xl font-bold`}>
              {_.maxBy(statistics.yearlyStats, "satellites").year}
            </p>
            <p className={`${colors.subText} text-xs sm:text-sm`}>
              {_.maxBy(statistics.yearlyStats, "satellites").satellites}{" "}
              satellites
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
