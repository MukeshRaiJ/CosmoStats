import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import "swiper/css";
import RocketDetails from "./RocketDetails";
import RocketNavigation from "./button";
import vehicleData from "./vehicle.json";
import launch_vehicle_images from "./rocket_image";

// Define type for vehicle data
interface Vehicle {
  id: string;
  name: string;
  status: "Active" | "Retired" | "In Development";
  generation?: {
    period: string;
  };
  [key: string]: unknown;
}

// Animation configuration
interface AnimationConfig {
  particleCount: number;
  rotationDuration: number;
  particleDurationMin: number;
  particleDurationMax: number;
}

const defaultAnimation: AnimationConfig = {
  particleCount: 20,
  rotationDuration: 20,
  particleDurationMin: 5,
  particleDurationMax: 15,
};

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
  animationConfig?: AnimationConfig;
}

const RocketShowcase: React.FC<RocketShowcaseProps> = ({
  background,
  text,
  contentBackground,
  animationConfig = defaultAnimation,
}) => {
  const [vehicles] = useState<Vehicle[]>(() => {
    return Object.entries(vehicleData.launch_vehicles).map(
      ([key, vehicle]) => ({
        id: key,
        name: key,
        ...(vehicle as object),
      })
    );
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle>(vehicles[0]);
  const swiperRef = React.useRef<SwiperType>();

  const colors: Colors = {
    background,
    text,
    subText: "text-slate-400",
    highlight: "text-blue-500",
    cardBg: contentBackground,
    cardGlow: "bg-blue-500/10",
    border: "border-slate-700/20",
  };

  useEffect(() => {
    if (!animationConfig) return;

    const createParticle = () => {
      // Particle animation implementation would go here
      // Implementation removed as it wasn't provided in original code
    };

    const interval = setInterval(
      createParticle,
      1000 / animationConfig.particleCount
    );
    return () => clearInterval(interval);
  }, [animationConfig]);

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentIndex(swiper.activeIndex);
    setCurrentVehicle(vehicles[swiper.activeIndex]);
  };

  const navigateRocket = (direction: "prev" | "next") => {
    if (!swiperRef.current) return;
    if (direction === "prev") {
      swiperRef.current.slidePrev();
    } else {
      swiperRef.current.slideNext();
    }
  };

  const getPrevNextVehicles = () => {
    const prevIndex =
      currentIndex === 0 ? vehicles.length - 1 : currentIndex - 1;
    const nextIndex =
      currentIndex === vehicles.length - 1 ? 0 : currentIndex + 1;
    return {
      prev: vehicles[prevIndex].name,
      next: vehicles[nextIndex].name,
    };
  };

  const { prev, next } = getPrevNextVehicles();

  const getDefaultImage = (vehicle: Vehicle): string => {
    const imageData = launch_vehicle_images.find(
      (item) => item.rocket === vehicle.name
    );
    return imageData?.image ?? "/rockets/default.png";
  };

  return (
    <section
      className={`relative h-screen py-6 px-4 sm:px-6 lg:px-8 ${colors.background} bg-opacity-50 backdrop-blur-sm`}
    >
      <div className="max-w-7xl mx-auto relative z-10 h-full">
        <div className="flex flex-col xl:flex-row xl:gap-8 h-full">
          {/* Image Card */}
          <motion.div
            className="w-full xl:w-1/3 h-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              className="h-full rounded-xl overflow-hidden shadow-2xl"
              onSlideChange={handleSlideChange}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
            >
              {vehicles.map((vehicle) => (
                <SwiperSlide key={vehicle.id}>
                  <motion.div
                    className="relative w-full h-full bg-gradient-to-b from-slate-900/80 to-slate-800/80 backdrop-blur-sm flex items-center justify-center overflow-hidden group"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative w-full h-full flex items-center justify-center p-8">
                      <Image
                        src={getDefaultImage(vehicle)}
                        alt={vehicle.name}
                        fill
                        className="object-contain transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div
                      className={`absolute inset-x-0 bottom-0 ${colors.cardBg} backdrop-blur-lg bg-opacity-70 p-4`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`text-xl font-bold ${colors.text}`}>
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
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-sm ${colors.subText}`}>
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
            className="w-full xl:w-2/3 h-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className={`${colors.cardBg} bg-opacity-70 backdrop-blur-lg backdrop-saturate-150 rounded-xl p-6 h-full`}
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
