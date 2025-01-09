// types.ts
import { ReactNode } from "react";

export interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}

export interface AnimatedBackgroundProps {
  isDark: boolean;
  variant?: string;
}

export interface ThemeProviderProps {
  children: ReactNode;
}

export interface Launch {
  launchNo: number;
  flightNo: string;
  dateTime: string;
  rocket: string;
  configuration: string;
  launchOutcome: string;
  orbit?: string;
  payload: {
    totalMass?: number;
    massUnit?: string;
    satellites: Array<{
      name: string;
      country: string;
      mass?: number;
      massUnit?: string;
    }>;
  };
  missionDescription: string;
  notes: string;
}

export interface LaunchData {
  metadata: {
    lastUpdated: string;
    totalLaunches: number;
    launchVehicles: string[];
  };
  launches: Launch[];
}

export interface LaunchVisualizerContentProps {
  launchData: LaunchData;
}

// Animation variants can be extended based on needs
export const ANIMATION_VARIANTS = {
  GENTLE: "gentle",
  MODERATE: "moderate",
  INTENSE: "intense",
} as const;

export type AnimationVariant =
  (typeof ANIMATION_VARIANTS)[keyof typeof ANIMATION_VARIANTS];
