// page.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import "swiper/css";
import RocketDetails from "./RocketDetails";
import RocketNavigation from "./button";
import vehicleData from "./vehicle.json";
import launch_vehicle_images from "./rocket_image";

// Types
interface Vehicle {
  id: string;
  name: string;
  status: "Active" | "Retired" | "In Development";
  manufacturer?: string;
  country?: string;
  description?: string;
  generation?: {
    generation: string;
    period: string;
  };
  dimensions?: {
    height: number;
    diameter: number;
    mass: number | { min: number; max: number } | Record<string, number>;
  };
  payload_capacity?: {
    LEO?: {
      mass: number | { min: number; max: number } | Record<string, number>;
    };
    GTO?: {
      mass: number | { min: number; max: number } | Record<string, number>;
    };
    SSO?: {
      mass: number | { min: number; max: number } | Record<string, number>;
    };
  };
  launch_history?: {
    total_launches: number;
    successes: number;
    failures: number;
    partial_failures: number;
    last_flight: string | Record<string, string>;
  };
  stages?: Record<
    string,
    {
      engine_type?: string;
      propellant?: string | string[];
      thrust?: string;
      burn_time?: string;
      engines?: {
        total_thrust: string;
      };
    }
  >;
  special_features?: string[];
  [key: string]: unknown;
}

interface Colors {
  background: string;
  text: string;
  subText: string;
  highlight: string;
  cardBg: string;
  cardGlow: string;
  border: string;
}

interface RocketShowcaseProps {
  background: string;
  text: string;
  contentBackground: string;
}

const RocketShowcase: React.FC<RocketShowcaseProps> = ({
  background,
  text,
  contentBackground,
}) => {
  // Memoize vehicles data
  const vehicles = useMemo<Vehicle[]>(
    () =>
      Object.entries(vehicleData.launch_vehicles).map(([key, vehicle]) => ({
        id: key,
        name: key,
        ...(vehicle as object),
      })),
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle>(vehicles[0]);
  const swiperRef = React.useRef<SwiperType>();

  // Memoize colors object
  const colors: Colors = useMemo(
    () => ({
      background,
      text,
      subText: "text-slate-400",
      highlight: "text-blue-500",
      cardBg: contentBackground,
      cardGlow: "bg-blue-500/10",
      border: "border-slate-700/20",
    }),
    [background, text, contentBackground]
  );

  // Memoize navigation functions
  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      setCurrentIndex(swiper.activeIndex);
      setCurrentVehicle(vehicles[swiper.activeIndex]);
    },
    [vehicles]
  );

  const navigateRocket = useCallback((direction: "prev" | "next") => {
    if (!swiperRef.current) return;
    if (direction === "prev") {
      swiperRef.current.slidePrev();
    } else {
      swiperRef.current.slideNext();
    }
  }, []);

  // Memoize prev/next vehicles
  const { prev, next } = useMemo(() => {
    const prevIndex =
      currentIndex === 0 ? vehicles.length - 1 : currentIndex - 1;
    const nextIndex =
      currentIndex === vehicles.length - 1 ? 0 : currentIndex + 1;
    return {
      prev: vehicles[prevIndex].name,
      next: vehicles[nextIndex].name,
    };
  }, [currentIndex, vehicles]);

  // Memoize image getter
  const getDefaultImage = useCallback((vehicle: Vehicle): string => {
    const imageData = launch_vehicle_images.find(
      (item) => item.rocket === vehicle.name
    );
    return imageData?.image ?? "/rockets/default.png";
  }, []);

  return (
    <section
      className={`relative min-h-screen py-4 px-4 sm:px-6 lg:px-8 ${colors.background} bg-opacity-50 backdrop-blur-sm`}
    >
      <div className="max-w-7xl mx-auto relative z-10 h-full">
        <div className="flex flex-col xl:flex-row xl:gap-8 h-full">
          {/* Image Card */}
          <motion.div
            className="w-full xl:w-1/3 h-[40vh] xl:h-screen xl:max-h-[calc(100vh-2rem)] mb-4 xl:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            layout
          >
            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              className="h-full rounded-xl overflow-hidden shadow-2xl"
              onSlideChange={handleSlideChange}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              speed={500}
              touchRatio={1.5}
              resistance={true}
              resistanceRatio={0.85}
            >
              {vehicles.map((vehicle) => (
                <SwiperSlide key={vehicle.id}>
                  <motion.div
                    className="relative w-full h-full bg-gradient-to-b from-slate-900/80 to-slate-800/80 backdrop-blur-sm flex items-center justify-center overflow-hidden group"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
                      <div className="relative w-full h-full">
                        <Image
                          src={getDefaultImage(vehicle)}
                          alt={vehicle.name}
                          fill
                          className="object-contain transform group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 50vw, 33vw"
                          priority
                          loading="eager"
                        />
                      </div>
                    </div>
                    <div
                      className={`absolute inset-x-0 bottom-0 ${colors.cardBg} backdrop-blur-lg bg-opacity-70 p-3 sm:p-4`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4
                          className={`text-lg sm:text-xl font-bold ${colors.text}`}
                        >
                          {vehicle.name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            vehicle.status === "Active"
                              ? "bg-green-500/80"
                              : vehicle.status === "Retired"
                              ? "bg-red-500/80"
                              : "bg-yellow-500/80"
                          } backdrop-blur-sm text-white`}
                        >
                          {vehicle.status}
                        </span>
                      </div>
                      {vehicle.generation && (
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs sm:text-sm ${colors.subText}`}
                          >
                            {vehicle.generation.period}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          {/* Data Card */}
          <motion.div
            className="w-full xl:w-2/3 h-[calc(60vh-1rem)] xl:h-screen xl:max-h-[calc(100vh-2rem)]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            layout
          >
            <div
              className={`${colors.cardBg} bg-opacity-70 backdrop-blur-lg backdrop-saturate-150 rounded-xl p-4 sm:p-6 h-full`}
            >
              <RocketNavigation
                prev={prev}
                next={next}
                onNavigate={navigateRocket}
                colors={colors}
                currentIndex={currentIndex}
                totalRockets={vehicles.length}
              />
              <RocketDetails currentVehicle={currentVehicle} colors={colors} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RocketShowcase;
