// SatelliteTimeline/page.tsx
import React, { useState, useMemo } from "react";
import {
  Rocket,
  Calendar,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Globe,
  Weight,
  Navigation,
  MapPin,
  Power,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SatelliteFilters from "./filters";

interface SatelliteData {
  launch_number: number;
  name: string;
  launch_date: string;
  launch_vehicle: string;
  launch_site: string;
  mission: string;
  mission_outcome: string;
  launch_mass?: string | number;
  power?: string;
  periapsis?: string | number;
  apoapsis?: string | number;
  period?: string;
  inclination?: string;
  decay_date?: string;
  mission_details?: string;
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
  satellite: SatelliteData;
  colors: Colors;
}

interface SatelliteTimelineProps {
  data: SatelliteData[];
  colors: Colors;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ satellite, colors }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getStatusColor = (outcome: string): string => {
    if (outcome.toLowerCase().includes("success")) {
      return "text-emerald-500 bg-emerald-500/10";
    } else if (outcome.toLowerCase().includes("failure")) {
      return "text-red-500 bg-red-500/10";
    } else if (outcome.toLowerCase().includes("partial")) {
      return "text-amber-500 bg-amber-500/10";
    } else if (outcome.toLowerCase().includes("scheduled")) {
      return "text-blue-500 bg-blue-500/10";
    }
    return "text-gray-500 bg-gray-500/10";
  };

  const getStatusIcon = (outcome: string): JSX.Element => {
    if (outcome.toLowerCase().includes("success")) {
      return <CheckCircle className="w-4 h-4" />;
    } else if (outcome.toLowerCase().includes("failure")) {
      return <XCircle className="w-4 h-4" />;
    } else if (outcome.toLowerCase().includes("scheduled")) {
      return <Clock className="w-4 h-4" />;
    }
    return <AlertCircle className="w-4 h-4" />;
  };

  const launchDate = new Date(satellite.launch_date);

  return (
    <div className="relative ml-8 md:ml-16 mb-6">
      <div className="absolute -left-8 md:-left-12 top-1/2 w-8 md:w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />

      <div className="absolute -left-12 md:-left-16 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg z-10 hover:scale-110 transition-transform duration-200">
        <span className="text-white text-xs md:text-sm font-bold">
          {satellite.launch_number}
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
                {satellite.name}
              </CardTitle>
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
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className={`${colors.text} text-sm`}>
                  {satellite.launch_site}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={`${getStatusColor(
                  satellite.mission_outcome
                )} flex items-center gap-1`}
              >
                {getStatusIcon(satellite.mission_outcome)}
                {satellite.mission_outcome}
              </Badge>

              <Badge className="bg-purple-500/10 text-purple-500 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {satellite.mission}
              </Badge>

              {satellite.launch_vehicle && (
                <Badge className="bg-blue-500/10 text-blue-500 flex items-center gap-1">
                  <Rocket className="w-3 h-3" />
                  {satellite.launch_vehicle}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="p-4">
            <div className="space-y-4">
              {satellite.mission_details && (
                <div className={`${colors.text} text-sm`}>
                  {satellite.mission_details}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {satellite.launch_mass && (
                  <div className="flex items-center gap-2">
                    <Weight className="w-4 h-4 text-green-500" />
                    <span className={`${colors.text} text-sm`}>
                      Mass: {satellite.launch_mass}
                    </span>
                  </div>
                )}

                {satellite.power && (
                  <div className="flex items-center gap-2">
                    <Power className="w-4 h-4 text-yellow-500" />
                    <span className={`${colors.text} text-sm`}>
                      Power: {satellite.power}
                    </span>
                  </div>
                )}

                {satellite.inclination && (
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-blue-500" />
                    <span className={`${colors.text} text-sm`}>
                      Inclination: {satellite.inclination}
                    </span>
                  </div>
                )}
              </div>

              {(satellite.periapsis || satellite.apoapsis) && (
                <div className={`${colors.cardBg} p-3 rounded-lg space-y-2`}>
                  <h4 className={`${colors.text} font-medium`}>
                    Orbit Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {satellite.periapsis && (
                      <div className={`${colors.text} text-sm`}>
                        Periapsis: {satellite.periapsis}
                      </div>
                    )}
                    {satellite.apoapsis && (
                      <div className={`${colors.text} text-sm`}>
                        Apoapsis: {satellite.apoapsis}
                      </div>
                    )}
                    {satellite.period && (
                      <div className={`${colors.text} text-sm`}>
                        Period: {satellite.period}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

const SatelliteTimeline: React.FC<SatelliteTimelineProps> = ({
  data,
  colors,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState({
    year: "all",
    mission: "all",
    status: "all",
    vehicle: "all",
    site: "all",
  });

  const uniqueValues = useMemo(() => {
    const values = {
      year: new Set<string>(),
      mission: new Set<string>(),
      status: new Set<string>(),
      vehicle: new Set<string>(),
      site: new Set<string>(),
    };

    data.forEach((satellite) => {
      const year = new Date(satellite.launch_date).getFullYear().toString();
      values.year.add(year);
      values.mission.add(satellite.mission);
      values.status.add(satellite.mission_outcome);
      values.vehicle.add(satellite.launch_vehicle);
      values.site.add(satellite.launch_site);
    });

    return {
      year: Array.from(values.year).sort((a, b) => b.localeCompare(a)),
      mission: Array.from(values.mission).sort(),
      status: Array.from(values.status).sort(),
      vehicle: Array.from(values.vehicle).sort(),
      site: Array.from(values.site).sort(),
    };
  }, [data]);

  const filteredSatellites = useMemo(() => {
    return data
      .filter((satellite) => {
        const searchLower = searchTerm.toLowerCase();
        if (
          searchTerm &&
          !satellite.name.toLowerCase().includes(searchLower) &&
          !satellite.mission.toLowerCase().includes(searchLower) &&
          !satellite.launch_vehicle.toLowerCase().includes(searchLower)
        ) {
          return false;
        }

        const year = new Date(satellite.launch_date).getFullYear().toString();
        if (filters.year !== "all" && year !== filters.year) return false;
        if (filters.mission !== "all" && satellite.mission !== filters.mission)
          return false;
        if (
          filters.status !== "all" &&
          satellite.mission_outcome !== filters.status
        )
          return false;
        if (
          filters.vehicle !== "all" &&
          satellite.launch_vehicle !== filters.vehicle
        )
          return false;
        if (filters.site !== "all" && satellite.launch_site !== filters.site)
          return false;

        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.launch_date).getTime() - new Date(a.launch_date).getTime()
      );
  }, [data, searchTerm, filters]);

  return (
    <div className="relative min-h-screen">
      <SatelliteFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        uniqueValues={uniqueValues}
        filteredCount={filteredSatellites.length}
        totalCount={data.length}
        colors={colors}
      />

      <div className="relative">
        <div className="absolute left-0 md:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-blue-500/50 to-transparent" />

        {filteredSatellites.length > 0 ? (
          filteredSatellites.map((satellite) => (
            <TimelineCard
              key={`satellite-${satellite.launch_number}`}
              satellite={satellite}
              colors={colors}
            />
          ))
        ) : (
          <div
            className={`ml-8 md:ml-16 p-8 ${colors.glassBg} rounded-xl text-center ${colors.text}`}
          >
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-lg font-medium mb-2">No satellites found</h3>
            <p className={`${colors.subText} text-sm`}>
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SatelliteTimeline;
