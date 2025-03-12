import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

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

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  trend?: "up" | "down";
  trendValue?: string;
  colors: ThemeColors;
}

interface LaunchStatistics {
  totals: {
    foreignSatellites: number;
    successRate: number;
    partnerCountries: number;
    totalMass: number;
    launchSites: number;
    peakYear: {
      year: number;
      satellites: number;
    };
  };
  yearlyStats: {
    [key: number]: {
      launches: number;
      satellites: number;
    };
  };
}

interface StatsGridProps {
  data: LaunchStatistics;
  colors: ThemeColors;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  trend,
  trendValue,
  colors,
}) => (
  <Card className={`${colors.glassBg} border ${colors.border}`}>
    <CardHeader className="p-2 sm:p-4">
      <CardTitle className={`${colors.text} text-xs sm:text-sm`}>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-2 sm:p-4">
      <p className={`${colors.text} text-lg sm:text-2xl font-bold`}>{value}</p>
      <p className={`${colors.subText} text-xs sm:text-sm`}>
        {subtext}
        {trend && (
          <span
            className={`ml-2 ${
              trend === "up" ? "text-green-500" : "text-red-500"
            } inline-flex items-center`}
          >
            {trend === "up" ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            {trendValue}
          </span>
        )}
      </p>
    </CardContent>
  </Card>
);

const StatsGrid: React.FC<StatsGridProps> = ({ data, colors }) => {
  const currentYear = 2024;
  const prevYear = currentYear - 1;
  const yearOverYearChange =
    (((data.yearlyStats[currentYear]?.launches || 0) -
      (data.yearlyStats[prevYear]?.launches || 0)) /
      (data.yearlyStats[prevYear]?.launches || 1)) *
    100;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      <StatCard
        title="Total Satellites"
        value={data.totals.foreignSatellites}
        subtext="Foreign satellites"
        trend="up"
        trendValue="80.0%"
        colors={colors}
      />
      <StatCard
        title="Success Rate"
        value={`${data.totals.successRate}%`}
        subtext="Mission success"
        colors={colors}
      />
      <StatCard
        title="Partner Countries"
        value={data.totals.partnerCountries}
        subtext="International partners"
        colors={colors}
      />
      <StatCard
        title="Total Mass"
        value={`${(data.totals.totalMass / 1000).toFixed(1)}t`}
        subtext="Payload to orbit"
        colors={colors}
      />
      <StatCard
        title="Launch Sites"
        value={data.totals.launchSites}
        subtext="Active facilities"
        colors={colors}
      />
      <StatCard
        title="Peak Year"
        value={data.totals.peakYear.year}
        subtext={`${data.totals.peakYear.satellites} satellites`}
        colors={colors}
      />
      <StatCard
        title="Recent Activity"
        value={currentYear}
        subtext={`${data.yearlyStats[currentYear]?.satellites || 0} satellites`}
        trend="down"
        trendValue="80.0%"
        colors={colors}
      />
      <StatCard
        title="Launch Trends"
        value={`${data.yearlyStats[prevYear]?.launches || 0} launches`}
        subtext={`In ${prevYear}`}
        trend={yearOverYearChange > 0 ? "up" : "down"}
        trendValue={`${Math.abs(yearOverYearChange).toFixed(1)}%`}
        colors={colors}
      />
    </div>
  );
};

export default StatsGrid;
