import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronDown, ChevronUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Colors {
  cardBg: string;
  text: string;
  border: string;
  subText: string;
  glassBg: string;
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

// Custom hook for media queries
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

interface FilterBadgeProps {
  label: string;
  value: string;
  onClear: () => void;
  colors: Colors;
}

const FilterBadge: React.FC<FilterBadgeProps> = ({
  label,
  value,
  onClear,
  colors,
}) => {
  return value !== "all" ? (
    <Badge className={`${colors.cardBg} flex items-center gap-1`}>
      {label}: {value}
      <X className="w-3 h-3 cursor-pointer" onClick={onClear} />
    </Badge>
  ) : null;
};

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  colors: Colors;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  options,
  onChange,
  colors,
}) => (
  <div className="flex flex-col gap-1">
    <label className={`${colors.subText} text-sm font-medium`}>{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${colors.cardBg} ${colors.text} ${colors.border} rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500`}
    >
      <option value="all">All {label}s</option>
      {options.map((option) => (
        <option key={`${label}-${option}`} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

interface FilterSectionProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  uniqueValues: UniqueValues;
  isMobile?: boolean;
  colors: Colors;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  setFilters,
  uniqueValues,
  isMobile = false,
  colors,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="md:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between ${colors.border}`}
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 mt-4"
            >
              {Object.entries(filters).map(([key, value]) => (
                <FilterSelect
                  key={`mobile-filter-${key}`}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value}
                  options={uniqueValues[key as keyof UniqueValues]}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, [key]: value }))
                  }
                  colors={colors}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="hidden md:grid grid-cols-5 gap-4">
      {Object.entries(filters).map(([key, value]) => (
        <FilterSelect
          key={`desktop-filter-${key}`}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value}
          options={uniqueValues[key as keyof UniqueValues]}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, [key]: value }))
          }
          colors={colors}
        />
      ))}
    </div>
  );
};

interface FiltersComponentProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  uniqueValues: UniqueValues;
  filteredCount: number;
  totalCount: number;
  colors: Colors;
}

const FiltersComponent: React.FC<FiltersComponentProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  uniqueValues,
  filteredCount,
  totalCount,
  colors,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const activeFilters = Object.entries(filters).filter(
    ([value]) => value !== "all"
  );

  return (
    <div
      className={`sticky top-0 z-20 mb-6 p-4 ${colors.glassBg} rounded-xl ${colors.border} 
                  backdrop-blur-md shadow-lg`}
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
          <Input
            className={`pl-10 ${colors.cardBg} ${colors.border} ${colors.text}
                     focus:ring-2 focus:ring-blue-500 w-full`}
            placeholder="Search launches by rocket, mission, or flight number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <FilterSection
          filters={filters}
          setFilters={setFilters}
          uniqueValues={uniqueValues}
          isMobile={isMobile}
          colors={colors}
        />

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(([key, value]) => (
              <FilterBadge
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={value}
                onClear={() =>
                  setFilters((prev) => ({ ...prev, [key]: "all" }))
                }
                colors={colors}
              />
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setFilters({
                  year: "all",
                  orbit: "all",
                  status: "all",
                  rocket: "all",
                  country: "all",
                })
              }
              className="text-blue-500 hover:text-blue-600"
            >
              <X className="w-4 h-4 mr-1" />
              Clear all filters
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div
          className={`text-sm ${colors.subText} flex items-center justify-between`}
        >
          <span>
            Showing {filteredCount} of {totalCount} launches
          </span>
          <span className="text-blue-500">Latest launches first</span>
        </div>
      </div>
    </div>
  );
};

export default FiltersComponent;
