"use client";
import React, { useEffect, useState } from "react";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

/**
 * SearchFilters
 * Left-side filter panel for the search page — pairs visually with
 * SearchTips on the right. Manages its own state and reports changes
 * via onFilterChange; it doesn't fetch or filter anything itself.
 *
 * TMDB's multi-search results already carry `media_type`,
 * `original_language`, and (for TV) `origin_country`, so Search.jsx can
 * apply these filters client-side against results already on the page
 * rather than needing a new endpoint:
 *
 *   const [filters, setFilters] = useState({ type: "all", country: "all", language: "all" })
 *   const filtered = movies.results.filter((m) => {
 *     if (filters.type !== "all" && m.media_type !== filters.type) return false
 *     if (filters.language !== "all" && m.original_language !== filters.language) return false
 *     if (filters.country !== "all" && !(m.origin_country || []).includes(filters.country)) return false
 *     return true
 *   })
 *
 *   <SearchFilters onFilterChange={setFilters} />
 *
 * Props:
 * - onFilterChange({ type, country, language }) — called whenever any
 *   filter changes, including on mount with the initial ("all") state.
 * - className — merged onto the outer panel.
 */
const TYPES = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "Series" },
  { value: "person", label: "People" },
];

// ISO 3166-1 alpha-2 codes, matching TMDB's origin_country field.
const COUNTRIES = [
  { value: "all", label: "All countries" },
  { value: "US", label: "United States" },
  { value: "IN", label: "India" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "FR", label: "France" },
  { value: "DE", label: "Germany" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
  { value: "JP", label: "Japan" },
  { value: "KR", label: "South Korea" },
  { value: "CN", label: "China" },
  { value: "HK", label: "Hong Kong" },
  { value: "BR", label: "Brazil" },
  { value: "MX", label: "Mexico" },
  { value: "RU", label: "Russia" },
  { value: "SE", label: "Sweden" },
  { value: "NG", label: "Nigeria" },
];

// ISO 639-1 codes, matching TMDB's original_language field.
const LANGUAGES = [
  { value: "all", label: "All languages" },
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "pa", label: "Punjabi" },
  { value: "ar", label: "Arabic" },
];

const PANEL_CLASSES = `
  hidden lg:flex flex-col gap-6
  w-full max-w-[200px] p-6
  rounded-2xl
  border border-white/10
  bg-[#121111]
  shadow-[0_0_40px_rgba(0,0,0,0.6)]
  sticky top-16
`;

const SELECT_CLASSES = `
  w-full rounded-lg
  border border-white/10 bg-white/5
  px-3 py-2 text-sm text-white
  focus:outline-none focus:ring-1 focus:ring-[#3b82f6]
  appearance-none cursor-pointer
`;

function Select({ label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-slate-400 text-xs font-semibold mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={SELECT_CLASSES}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#121111]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const SearchFilters = ({ onFilterChange, className = "" }) => {
  const [type, setType] = useState("all");
  const [country, setCountry] = useState("all");
  const [language, setLanguage] = useState("all");

  useEffect(() => {
    onFilterChange?.({ type, country, language });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, country, language]);

  const hasActiveFilters = type !== "all" || country !== "all" || language !== "all";

  const handleReset = () => {
    setType("all");
    setCountry("all");
    setLanguage("all");
  };

  return (
    <div className={PANEL_CLASSES + " " + className}>
      <div className="flex items-start justify-between gap-3">
        <div className="text-lg font-bold text-white">
          <AnimatedShinyText>Filters</AnimatedShinyText>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-white/40 hover:text-white transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* TYPE */}
      <div>
        <p className="text-slate-400 text-xs font-semibold mb-2">Type</p>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => {
            const active = type === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`
                  text-xs sm:text-sm px-3 py-1.5 rounded-full transition-colors
                  ${
                    active
                      ? "bg-gradient-to-r from-[#7c3aed] via-[#3b82f6] to-[#10b981] text-white"
                      : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* COUNTRY */}
      <Select label="Country" options={COUNTRIES} value={country} onChange={setCountry} />

      {/* LANGUAGE */}
      <Select label="Language" options={LANGUAGES} value={language} onChange={setLanguage} />
    </div>
  );
};

export default SearchFilters;