import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Rocket,
  Ruler,
  Weight,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe2,
  Atom,
  Flame,
  Building2,
  Boxes,
  Flag,
  Clock,
  ArrowBigUpDash,
} from "lucide-react";

const RocketSpecCard = ({ title, value, icon: Icon, colors }) => (
  <div
    className={`${colors.cardBg} bg-opacity-70 backdrop-blur-sm p-4 rounded-lg flex items-center gap-3`}
  >
    <div className={`${colors.cardGlow} bg-opacity-50 p-2 rounded-md`}>
      <Icon className={colors.highlight} size={24} />
    </div>
    <div>
      <p className={`text-xs ${colors.subText} uppercase tracking-wider`}>
        {title}
      </p>
      <p className={`text-sm font-bold ${colors.text}`}>{value}</p>
    </div>
  </div>
);

const LaunchStats = ({ stats, colors }) => {
  const total = stats.total_launches || 0;
  const successes = stats.successes || 0;
  const failures = stats.failures || 0;
  const partialFailures = stats.partial_failures || 0;

  const getLatestFlightDate = (lastFlight) => {
    if (!lastFlight) return "N/A";
    if (typeof lastFlight === "string") return lastFlight.split("-")[0];
    return Object.values(lastFlight)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
      .split("-")[0];
  };

  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      <div
        className={`col-span-4 ${colors.cardBg} bg-opacity-70 backdrop-blur-sm p-4 rounded-lg`}
      >
        <div className="flex justify-between mb-3">
          <span className={`text-sm font-bold ${colors.text}`}>
            Total Launches: {total}
          </span>
          <span className={`text-sm ${colors.subText}`}>
            Success Rate:{" "}
            {total > 0 ? ((successes / total) * 100).toFixed(1) : 0}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200/30 backdrop-blur-sm rounded-sm overflow-hidden">
          <div className="h-full flex">
            <div
              style={{ width: `${(successes / total) * 100}%` }}
              className="bg-green-500/80"
            />
            <div
              style={{ width: `${(failures / total) * 100}%` }}
              className="bg-red-500/80"
            />
            <div
              style={{ width: `${(partialFailures / total) * 100}%` }}
              className="bg-yellow-500/80"
            />
          </div>
        </div>
      </div>
      {[
        {
          icon: CheckCircle,
          label: "Successful",
          value: successes,
          color: "text-green-500",
        },
        {
          icon: XCircle,
          label: "Failed",
          value: failures,
          color: "text-red-500",
        },
        {
          icon: AlertCircle,
          label: "Partial",
          value: partialFailures,
          color: "text-yellow-500",
        },
        {
          icon: Clock,
          label: "Last Launch",
          value: getLatestFlightDate(stats.last_flight),
          color: colors.highlight,
        },
      ].map(({ icon: Icon, label, value, color }) => (
        <div
          key={label}
          className={`${colors.cardBg} bg-opacity-70 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2`}
        >
          <Icon className={color} size={16} />
          <div>
            <p className={`text-xs ${colors.subText}`}>{label}</p>
            <p className={`text-sm font-bold ${colors.text}`}>{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const StageCard = ({ stage, details, index, colors }) => (
  <div
    className={`${colors.cardBg} bg-opacity-70 backdrop-blur-sm p-4 rounded-lg space-y-3`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`${colors.cardGlow} bg-opacity-50 p-2 rounded-md`}>
          <ArrowBigUpDash className={colors.highlight} size={20} />
        </div>
        <h4 className={`font-bold ${colors.text}`}>
          {stage.replace(/_/g, " ")}
        </h4>
      </div>
      <span
        className={`text-xs px-3 py-1 rounded-md ${colors.cardGlow} bg-opacity-50`}
      >
        Stage {index + 1}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {details.engine_type && (
        <div className="flex items-center gap-2">
          <Atom size={16} className={colors.highlight} />
          <span className={`text-sm ${colors.text}`}>
            {details.engine_type}
          </span>
        </div>
      )}
      {details.propellant && (
        <div className="flex items-center gap-2">
          <Flame size={16} className={colors.highlight} />
          <span className={`text-sm ${colors.text}`}>
            {Array.isArray(details.propellant)
              ? details.propellant.join(", ")
              : details.propellant}
          </span>
        </div>
      )}
      {(details.thrust ||
        (details.engines && details.engines.total_thrust)) && (
        <div className="flex items-center gap-2">
          <Rocket size={16} className={colors.highlight} />
          <span className={`text-sm ${colors.text}`}>
            {details.thrust || details.engines.total_thrust}
          </span>
        </div>
      )}
      {details.burn_time && (
        <div className="flex items-center gap-2">
          <Clock size={16} className={colors.highlight} />
          <span className={`text-sm ${colors.text}`}>{details.burn_time}</span>
        </div>
      )}
    </div>
  </div>
);

const RocketDetails = ({ currentVehicle, colors }) => {
  const formatPayloadCapacity = (payload) => {
    if (!payload) return "N/A";
    if ("mass" in payload) {
      if (typeof payload.mass === "number") {
        return `${payload.mass.toLocaleString()}kg`;
      }
      if (typeof payload.mass === "object") {
        if ("min" in payload.mass && "max" in payload.mass) {
          return `${payload.mass.min.toLocaleString()}-${payload.mass.max.toLocaleString()}kg`;
        }
      }
    }
    const variants = Object.values(payload);
    if (variants.length > 0) {
      const masses = variants
        .map((v) => v.mass)
        .filter((m) => typeof m === "number");
      if (masses.length > 0) {
        const min = Math.min(...masses);
        const max = Math.max(...masses);
        return `${min.toLocaleString()}-${max.toLocaleString()}kg`;
      }
    }
    return "N/A";
  };

  const formatMass = (mass) => {
    if (!mass) return "N/A";
    if (typeof mass === "number") return `${mass.toLocaleString()}kg`;
    if ("min" in mass && "max" in mass) {
      return `${mass.min.toLocaleString()}-${mass.max.toLocaleString()}kg`;
    }
    const values = Object.values(mass);
    if (values.length > 0) {
      const min = Math.min(...values);
      const max = Math.max(...values);
      return `${min.toLocaleString()}-${max.toLocaleString()}kg`;
    }
    return "N/A";
  };

  return (
    <ScrollArea className="h-[calc(100%-3rem)] pr-4">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className={`text-3xl font-bold ${colors.text}`}>
              {currentVehicle.name}
            </h2>
            <span
              className={`px-3 py-1 rounded-md text-xs font-medium ${
                currentVehicle.status === "Active"
                  ? "bg-green-500/80"
                  : currentVehicle.status === "Retired"
                  ? "bg-red-500/80"
                  : "bg-yellow-500/80"
              } backdrop-blur-sm text-white`}
            >
              {currentVehicle.status}
            </span>
          </div>
          <div className="flex gap-4">
            {currentVehicle.manufacturer && (
              <div className="flex items-center gap-1">
                <Building2 size={16} className={colors.highlight} />
                <span className={`text-sm ${colors.subText}`}>
                  {currentVehicle.manufacturer}
                </span>
              </div>
            )}
            {currentVehicle.country && (
              <div className="flex items-center gap-1">
                <Flag size={16} className={colors.highlight} />
                <span className={`text-sm ${colors.subText}`}>
                  {currentVehicle.country}
                </span>
              </div>
            )}
          </div>
          {currentVehicle.description && (
            <p className={`mt-2 text-sm ${colors.subText}`}>
              {currentVehicle.description}
            </p>
          )}
        </div>
        {currentVehicle.generation && (
          <div
            className={`${colors.cardGlow} bg-opacity-50 p-3 rounded-lg text-right`}
          >
            <p className={`text-xs font-bold ${colors.text}`}>
              {currentVehicle.generation.generation} Generation
            </p>
            <p className={`text-xs ${colors.subText}`}>
              {currentVehicle.generation.period}
            </p>
          </div>
        )}
      </div>

      {currentVehicle.dimensions && (
        <div className="mb-6">
          <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
            Vehicle Specifications
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <RocketSpecCard
              title="Height"
              value={`${currentVehicle.dimensions.height}m`}
              icon={Ruler}
              colors={colors}
            />
            <RocketSpecCard
              title="Diameter"
              value={`${currentVehicle.dimensions.diameter}m`}
              icon={Target}
              colors={colors}
            />
            <RocketSpecCard
              title="Mass"
              value={formatMass(currentVehicle.dimensions.mass)}
              icon={Weight}
              colors={colors}
            />
          </div>
        </div>
      )}

      {currentVehicle.payload_capacity && (
        <div className="mb-6">
          <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
            Payload Capacity
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {currentVehicle.payload_capacity.LEO && (
              <RocketSpecCard
                title="LEO Payload"
                value={formatPayloadCapacity(
                  currentVehicle.payload_capacity.LEO
                )}
                icon={Rocket}
                colors={colors}
              />
            )}
            {currentVehicle.payload_capacity.GTO && (
              <RocketSpecCard
                title="GTO Payload"
                value={formatPayloadCapacity(
                  currentVehicle.payload_capacity.GTO
                )}
                icon={Globe2}
                colors={colors}
              />
            )}
            {currentVehicle.payload_capacity.SSO && (
              <RocketSpecCard
                title="SSO Payload"
                value={formatPayloadCapacity(
                  currentVehicle.payload_capacity.SSO
                )}
                icon={Boxes}
                colors={colors}
              />
            )}
          </div>
        </div>
      )}

      {currentVehicle.launch_history && (
        <div className="mb-6">
          <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
            Launch History
          </h3>
          <LaunchStats stats={currentVehicle.launch_history} colors={colors} />
        </div>
      )}

      {currentVehicle.stages && (
        <div className="mb-6">
          <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
            Stage Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(currentVehicle.stages)
              .filter(([stage]) => stage !== "boosters")
              .map(([stage, details], index) => (
                <StageCard
                  key={stage}
                  stage={stage}
                  details={details}
                  index={index}
                  colors={colors}
                />
              ))}
          </div>
        </div>
      )}

      {currentVehicle.special_features && (
        <div>
          <h3 className={`text-lg font-bold mb-3 ${colors.text}`}>
            Special Features
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {currentVehicle.special_features.map((feature, index) => (
              <div
                key={index}
                className={`${colors.cardBg} bg-opacity-70 backdrop-blur-sm p-3 rounded-lg flex items-start gap-2`}
              >
                <Rocket className={`${colors.highlight} mt-1`} size={16} />
                <span className={`${colors.text} text-sm`}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ScrollArea>
  );
};

export default RocketDetails;
