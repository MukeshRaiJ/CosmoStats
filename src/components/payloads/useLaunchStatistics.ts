import { useMemo } from "react";
import _ from "lodash";
import { LaunchData } from "@/theme/types";

interface Satellite {
  name: string;
  country: string;
  mass?: number;
  massUnit?: string;
}

interface ConstellationSatellite extends Satellite {
  constellation?: {
    quantity: number;
    massPerUnit: number;
    massUnit: string;
  };
  satellites?: Satellite[];
  quantity?: number;
  massPerUnit?: number;
}

interface Payload {
  satellites?: ConstellationSatellite[];
  totalMass?: number;
}

interface Launch {
  payload: Payload;
  dateTime: string;
  launchNo: number;
  rocket: string;
  launchOutcome: string;
  launchSite: string;
}

const extractSatellites = (payload: Payload): Satellite[] => {
  const satellites: Satellite[] = [];
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
      satellites.push(...nestedSats);
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

export const useLaunchStatistics = (data: LaunchData) => {
  return useMemo(() => {
    // Process all satellites
    const allSatellites: Array<{
      name: string;
      country: string;
      mass: number;
      year: string;
      launchNo: number;
    }> = [];

    data.launches.forEach((launch: Launch) => {
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
        firstLaunch: _.minBy(sats, "launchNo")?.launchNo,
        lastLaunch: _.maxBy(sats, "launchNo")?.launchNo,
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
      totals: {
        foreignSatellites: _.sumBy(countryStats, "totalSatellites"),
        partnerCountries: countryStats.length,
        totalMass: _.sumBy(yearlyStats, "totalMass"),
        peakYear: _.maxBy(yearlyStats, "satellites"),
      },
    };
  }, [data]);
};

export default useLaunchStatistics;
