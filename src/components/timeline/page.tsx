import React, { useState, useMemo, useCallback } from "react";
import {
  Rocket,
  Calendar,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Globe,
  Weight,
  Satellite,
  MapPin,
  Flag,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FiltersComponent from "./filters";

interface Satellite {
  name: string;
  country: string;
  mass?: number;
  massUnit?: string;
}

interface Payload {
  totalMass?: number;
  massUnit?: string;
  satellites: Satellite[];
}

interface Launch {
  launchNo: string;
  rocket: string;
  configuration?: string;
  flightNo: string;
  dateTime: string;
  launchOutcome: string;
  orbit?: string;
  launchSite?: string;
  missionDescription: string;
  user?: string;
  payload: Payload;
  notes?: string;
}

interface Colors {
  glassBg: string;
  border: string;
  text: string;
  highlight: string;
  subText: string;
  cardBg: string;
}

interface TimelineCardProps {
  launch: Launch;
  colors: Colors;
}

interface Filters {
  year: string;
  orbit: string;
  status: string;
  rocket: string;
  country: string;
}

interface UniqueValues {
  year: string[];
  orbit: string[];
  status: string[];
  rocket: string[];
  country: string[];
}

interface TimelineProps {
  data: Launch[];
  colors: Colors;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ launch, colors }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getStatusColor = useCallback((outcome: string): string => {
    switch (outcome.toLowerCase()) {
      case "success":
        return "text-emerald-500 bg-emerald-500/10";
      case "failure":
        return "text-red-500 bg-red-500/10";
      case "partial success":
      case "partial failure":
        return "text-amber-500 bg-amber-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  }, []);

  const getStatusIcon = useCallback((outcome: string): JSX.Element => {
    switch (outcome.toLowerCase()) {
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "failure":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  }, []);

  const [dateStr, timeStr] = launch.dateTime.split("|");
  const launchDate = new Date(dateStr);
  const launchTime = timeStr?.trim() || "N/A";

  return (
    <div className="relative ml-8 md:ml-16 mb-6">
      <div className="absolute -left-8 md:-left-12 top-1/2 w-8 md:w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />

      <div className="absolute -left-12 md:-left-16 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg z-10 hover:scale-110 transition-transform duration-200">
        <span className="text-white text-xs md:text-sm font-bold">
          {launch.launchNo}
        </span>
      </div>

      <Card
        className={`${colors.glassBg} ${colors.border} hover:shadow-lg transition-shadow duration-300`}
      >
        <CardHeader
          className="p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <CardTitle
                className={`text-lg md:text-xl flex items-center gap-2 ${colors.text}`}
              >
                <Rocket className={`w-5 h-5 ${colors.highlight}`} />
                {launch.rocket}
                {launch.configuration && ` (${launch.configuration})`} •{" "}
                {launch.flightNo}
              </CardTitle>
              <Button variant="ghost" size="sm" className={colors.text}>
                {isExpanded ? "Show Less" : "Show More"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className={`${colors.text} text-sm`}>
                  {launchDate.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {launchTime !== "N/A" && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className={`${colors.text} text-sm`}>
                    {launchTime} IST
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={`${getStatusColor(
                  launch.launchOutcome
                )} flex items-center gap-1`}
              >
                {getStatusIcon(launch.launchOutcome)}
                {launch.launchOutcome}
              </Badge>

              {launch.orbit && (
                <Badge className="bg-blue-500/10 text-blue-500 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {launch.orbit}
                </Badge>
              )}

              {launch.launchSite && (
                <Badge className="bg-purple-500/10 text-purple-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {launch.launchSite}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="mb-4">
            <p className={`${colors.text} text-sm`}>
              {launch.missionDescription}
            </p>
          </div>

          {isExpanded && (
            <div className="space-y-4 mt-4 pt-4 border-t border-gray-700/20">
              <div className="space-y-2">
                <h4
                  className={`${colors.text} font-medium flex items-center gap-2`}
                >
                  <Info className="w-4 h-4 text-blue-500" />
                  Mission Details
                </h4>

                {launch.launchSite && (
                  <div
                    className={`${colors.text} text-sm flex items-center gap-2`}
                  >
                    <MapPin className="w-4 h-4 text-purple-500" />
                    Launch Site: {launch.launchSite}
                  </div>
                )}

                {launch.user && (
                  <div
                    className={`${colors.text} text-sm flex items-center gap-2`}
                  >
                    <Flag className="w-4 h-4 text-green-500" />
                    Customer: {launch.user}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {launch.payload.totalMass && (
                  <Badge className="bg-green-500/10 text-green-500">
                    <Weight className="w-3 h-3 mr-1" />
                    Total Payload Mass: {launch.payload.totalMass}{" "}
                    {launch.payload.massUnit}
                  </Badge>
                )}

                {launch.payload.satellites.length > 0 && (
                  <div className="space-y-2">
                    <h4
                      className={`${colors.text} font-medium flex items-center gap-2`}
                    >
                      <Satellite className="w-4 h-4 text-blue-500" />
                      Satellites ({launch.payload.satellites.length})
                    </h4>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {launch.payload.satellites.map((sat, idx) => (
                        <div
                          key={`${launch.launchNo}-sat-${idx}`}
                          className={`${colors.cardBg} rounded-lg p-3 text-sm border border-gray-700/20`}
                        >
                          <div className={`font-medium ${colors.text}`}>
                            {sat.name}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="flex items-center gap-1">
                              <Flag className="w-3 h-3 text-blue-500" />
                              <span className={colors.subText}>
                                {sat.country}
                              </span>
                            </span>
                            {sat.mass && (
                              <span
                                className={`${colors.subText} flex items-center gap-1`}
                              >
                                <Weight className="w-3 h-3 text-green-500" />
                                {sat.mass} {sat.massUnit}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {launch.notes && (
                  <div
                    className={`${colors.cardBg} rounded-lg p-3 mt-4 text-sm border-l-4 border-blue-500`}
                  >
                    <p className={colors.text}>{launch.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Timeline: React.FC<TimelineProps> = ({ data, colors }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    year: "all",
    orbit: "all",
    status: "all",
    rocket: "all",
    country: "all",
  });

  const uniqueValues = useMemo<UniqueValues>(() => {
    const values = {
      year: new Set<string>(),
      orbit: new Set<string>(),
      status: new Set<string>(),
      rocket: new Set<string>(),
      country: new Set<string>(),
    };

    data.forEach((launch) => {
      values.year.add(launch.dateTime.split("-")[0]);
      if (launch.orbit) values.orbit.add(launch.orbit);
      values.status.add(launch.launchOutcome);
      values.rocket.add(launch.rocket);
      launch.payload.satellites.forEach((sat) => {
        if (sat.country) values.country.add(sat.country);
      });
    });

    return Object.fromEntries(
      Object.entries(values).map(([key, set]) => [key, Array.from(set).sort()])
    ) as UniqueValues;
  }, [data]);

  const filteredLaunches = useMemo(() => {
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.dateTime.split("|")[0]);
      const dateB = new Date(b.dateTime.split("|")[0]);
      return dateB.getTime() - dateA.getTime();
    });

    const searchTermLower = searchTerm.toLowerCase();

    return sortedData
      .filter((launch) => {
        if (
          searchTerm &&
          !launch.rocket.toLowerCase().includes(searchTermLower) &&
          !launch.missionDescription.toLowerCase().includes(searchTermLower) &&
          !launch.flightNo.toLowerCase().includes(searchTermLower)
        ) {
          return false;
        }

        if (filters.year !== "all" && !launch.dateTime.startsWith(filters.year))
          return false;
        if (filters.orbit !== "all" && launch.orbit !== filters.orbit)
          return false;
        if (filters.status !== "all" && launch.launchOutcome !== filters.status)
          return false;
        if (filters.rocket !== "all" && launch.rocket !== filters.rocket)
          return false;
        if (
          filters.country !== "all" &&
          !launch.payload.satellites.some(
            (sat) => sat.country === filters.country
          )
        )
          return false;

        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
      );
  }, [data, searchTerm, filters]);

  return (
    <div className="relative min-h-screen">
      <FiltersComponent
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        uniqueValues={uniqueValues}
        filteredCount={filteredLaunches.length}
        totalCount={data.length}
        colors={colors}
      />

      <div className="relative">
        <div className="absolute left-0 md:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-blue-500/50 to-transparent" />

        {filteredLaunches.length > 0 ? (
          filteredLaunches.map((launch) => (
            <TimelineCard
              key={`launch-${launch.launchNo}`}
              launch={launch}
              colors={colors}
            />
          ))
        ) : (
          <div
            className={`ml-8 md:ml-16 p-8 ${colors.glassBg} rounded-xl text-center ${colors.text}`}
          >
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-lg font-medium mb-2">No launches found</h3>
            <p className={`${colors.subText} text-sm`}>
              Try adjusting your search or filters to find what you&apos;re
              looking
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
