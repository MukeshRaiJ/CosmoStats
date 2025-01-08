// themeContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { motion } from "framer-motion";

interface ThemeContextType {
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    background: string;
    text: {
      primary: string;
      secondary: string;
    };
    gradient: {
      from: string;
      via: string;
      to: string;
    };
  };
}

const defaultTheme: ThemeContextType = {
  colors: {
    primary: "from-blue-500",
    secondary: "to-cyan-500",
    tertiary: "via-purple-500",
    background: "bg-slate-900",
    text: {
      primary: "text-slate-100",
      secondary: "text-slate-400",
    },
    gradient: {
      from: "from-blue-500/20",
      via: "via-purple-500/20",
      to: "to-cyan-500/20",
    },
  },
};

const ThemeContext = createContext<ThemeContextType>(defaultTheme);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  theme?: ThemeContextType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme = defaultTheme,
}) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

// AnimatedBackground.tsx
interface WindowSize {
  width: number;
  height: number;
}

export const AnimatedBackground: React.FC = () => {
  const theme = useTheme();
  const [windowSize, setWindowSize] = React.useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-1/2 -right-1/2 w-full h-full">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className={`w-full h-full bg-gradient-to-br ${theme.colors.gradient.from} ${theme.colors.gradient.via} ${theme.colors.gradient.to} blur-3xl`}
        />
      </div>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
            scale: 0,
          }}
          animate={{
            y: [null, "-100vh"],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
          className="absolute w-1 h-1 bg-white rounded-full opacity-50"
        />
      ))}
    </div>
  );
};
