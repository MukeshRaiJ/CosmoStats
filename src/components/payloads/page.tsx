import React, { useState } from "react";
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
  Line,
  TooltipProps,
} from "recharts";

import { useLaunchStatistics } from "./useLaunchStatistics";

// Define the shape of your launch data
interface LaunchData {
  id: string;
  date: string;
  vehicle: string;
  site: string;
  outcome: string;
  payload: {
    satellite: string;
    country: string;
    mass?: number;
  }[];
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

interface OverviewProps {
  data: LaunchData[];
  colors: ThemeColors;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  colors: ThemeColors;
}

interface TooltipPayloadItem {
  name: string;
  value: number | string;
  unit?: string;
}

type ChartType =
  | "yearlyForeign"
  | "yearlyLaunches"
  | "topPartners"
  | "vehiclePerformance"
  | "launchSites";

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  colors,
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={`${colors.glassBg} p-2 border ${colors.border} rounded-lg shadow-xl max-w-[200px]`}
    >
      <p className={`${colors.text} font-medium text-sm truncate`}>{label}</p>
      {payload.map((item, index) => {
        const typedItem = item as unknown as TooltipPayloadItem;
        return (
          <p key={index} className={`${colors.subText} text-xs truncate`}>
            {typedItem.name}:{" "}
            {typeof typedItem.value === "number"
              ? typedItem.value.toLocaleString()
              : typedItem.value}
            {typedItem.unit ? ` ${typedItem.unit}` : ""}
          </p>
        );
      })}
    </div>
  );
};

const Overview: React.FC<OverviewProps> = ({ data, colors }) => {
  const [chartType, setChartType] = useState<ChartType>("yearlyForeign");
  const statistics = useLaunchStatistics(data);

  const getChartTitle = (type: ChartType): string => {
    const titles = {
      yearlyForeign: "Foreign Satellite Launches Over Time",
      yearlyLaunches: "Annual Launch Activity",
      topPartners: "Top International Launch Partners",
      vehiclePerformance: "Launch Vehicle Success Rates",
      launchSites: "Launch Site Distribution",
    };
    return titles[type];
  };

  const getChartDescription = (type: ChartType): string => {
    const descriptions = {
      yearlyForeign:
        "Number of foreign satellites and partner countries by year",
      yearlyLaunches: "Annual number of launches and foreign satellites",
      topPartners: "Countries by total number of satellites launched",
      vehiclePerformance: "Success and failure rates by launch vehicle",
      launchSites: "Distribution of launches across different launch sites",
    };
    return descriptions[type];
  };

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
            <Tooltip
              content={(props) => <CustomTooltip {...props} colors={colors} />}
            />
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

      case "yearlyLaunches":
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
            <Tooltip
              content={(props) => <CustomTooltip {...props} colors={colors} />}
            />
            <Bar
              yAxisId="left"
              dataKey="launches"
              name="Total Launches"
              fill={colors.chartColors[2]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="satellites"
              name="Foreign Satellites"
              stroke={colors.chartColors[0]}
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
              tickFormatter={(value: string) =>
                value.length > 10 ? `${value.slice(0, 10)}...` : value
              }
            />
            <Tooltip
              content={(props) => <CustomTooltip {...props} colors={colors} />}
            />
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
            <Tooltip
              content={(props) => <CustomTooltip {...props} colors={colors} />}
            />
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
              label={({ name, percent }: { name: string; percent: number }) =>
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
            <Tooltip
              content={(props) => <CustomTooltip {...props} colors={colors} />}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", bottom: 0 }}
              formatter={(value: string) =>
                value.length > 20 ? `${value.slice(0, 20)}...` : value
              }
            />
          </PieChart>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Select
          value={chartType}
          onValueChange={(value: ChartType) => setChartType(value)}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yearlyForeign">
              Foreign Satellites Timeline
            </SelectItem>
            <SelectItem value="yearlyLaunches">
              Annual Launch Activity
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
            {getChartTitle(chartType)}
          </CardTitle>
          <CardDescription className={`${colors.subText} text-xs sm:text-sm`}>
            {getChartDescription(chartType)}
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
              {statistics.totals.foreignSatellites}
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
              {statistics.totals.partnerCountries}
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
              {(statistics.totals.totalMass / 1000).toFixed(1)} tons
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
              {statistics.totals.peakYear.year}
            </p>
            <p className={`${colors.subText} text-xs sm:text-sm`}>
              {statistics.totals.peakYear.satellites} satellites
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
