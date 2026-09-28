"use client";
import React, { useEffect, useState } from "react";
import { ChevronDown, SlidersHorizontal, Circle, Play } from "lucide-react";

/**
 * SearchFilters
 * Left-side filter panel for the search page — pairs visually with
 * SearchTips on the right. Manages its own state and reports changes
 * via onFilterChange; it doesn't fetch or filter anything itself.
 *
 * Of the fields below, `type`, `language`, and `country` map straight onto
 * TMDB multi-search results, so Search.jsx can filter client-side:
 *
 *   const filtered = movies.results.filter((m) => {
 *     if (filters.type !== "all" && m.media_type !== filters.type) return false
 *     if (filters.language !== "all" && m.original_language !== filters.language) return false
 *     if (filters.country !== "all" && !(m.origin_country || []).includes(filters.country)) return false
 *     return true
 *   })
 *
 *   // `sort` can also be applied client-side, e.g.:
 *   const dateOf = (m) => m.release_date || m.first_air_date || ""
 *   if (filters.sort === "newest") filtered.sort((a, b) => dateOf(b).localeCompare(dateOf(a)))
 *   if (filters.sort === "oldest") filtered.sort((a, b) => dateOf(a).localeCompare(dateOf(b)))
 *   if (filters.sort === "rating") filtered.sort((a, b) => b.vote_average - a.vote_average)
 *
 * `providers`, `moctaleSelect`, and `familyFriendly` have no equivalent
 * field on a TMDB search result — they're included here as UI state for
 * whenever there's a backend endpoint (or a separate discover call) that
 * can actually apply them. Until then they're inert.
 *
 * Props:
 * - onFilterChange(filters) — called whenever any filter changes,
 *   including on mount with the initial state. filters shape:
 *   { sort, type, country, language, providers: string[], moctaleSelect, familyFriendly }
 * - className — merged onto the outer panel.
 */
const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "rating", label: "Top rated" },
  { value: "az", label: "A–Z" },
];

const TYPES = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "Shows" },
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

// No brand logos here on purpose — same call the repo already makes in
// footer.js for icons lucide-react doesn't ship (see the comment there).
// These are plain colour + monogram tiles, not the providers' real marks.
const PROVIDERS = [
  { value: "netflix", label: "Netflix", mono: "N", color: "bg-red-600" },
  { value: "prime", label: "Prime Video", mono: "P", color: "bg-sky-600" },
  { value: "jiohotstar", label: "JioHotstar", mono: "J", color: "bg-fuchsia-600" },
  { value: "crunchyroll", label: "Crunchyroll", mono: "C", color: "bg-orange-500" },
  { value: "sonyliv", label: "SonyLIV", mono: "S", color: "bg-indigo-600" },
  { value: "zee5", label: "Zee5", mono: "Z", color: "bg-purple-600" },
  { value: "appletv", label: "Apple TV+", mono: "A", color: "bg-zinc-800 border border-white/20" },
  { value: "youtube", label: "YouTube", mono: null, color: "bg-red-600" },
];

// Matches SearchTips.jsx's panel shell, so the two read as one system
// on either side of the results grid.
const PANEL_CLASSES = `
  flex w-full max-w-full flex-col gap-4
  rounded-lg p-4
    backdrop-blur-2xl
        border border-white/20
        shadow-[0_0_40px_rgba(0,0,0,0.6)]
  lg:fixed lg:top-22 lg:w-76 lg:rounded-2xl
`;

// Full-rounded pill dropdown, matching the "Sort By" control shape.
const SELECT_CLASSES = `
  w-full rounded-full
  border border-white/15 bg-white/5
  pl-4 pr-10 py-2.5 text-sm text-white
  hover:bg-white/10 transition-colors
  focus:outline-none focus:ring-1 focus:ring-purple-500
  appearance-none cursor-pointer
`;

function PillSelect({ label, options, value, onChange }) {
  return (
    <div>
      {label && <p className="text-slate-400 text-sm mb-2">{label}</p>}
      <div className="relative">
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
        <ChevronDown
          className="size-4 text-white/50 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function ToggleBadge({ active, onClick, colorClass, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-2
        px-3 py-1.5 rounded-full border text-xs font-semibold
        transition-colors
        ${active ? "bg-white/10" : "bg-transparent"}
        ${colorClass}
      `}
    >
      <Circle
        className={`size-3.5 ${active ? "fill-current" : ""}`}
        aria-hidden="true"
      />
      {children}
    </button>
  );
}

const SearchFilters = ({ onFilterChange, className = "" }) => {
  const [sort, setSort] = useState("newest");
  const [type, setType] = useState("all");
  const [country, setCountry] = useState("all");
  const [language, setLanguage] = useState("all");
  const [providers, setProviders] = useState([]);
  const [moctaleSelect, setMoctaleSelect] = useState(false);
  const [familyFriendly, setFamilyFriendly] = useState(false);

  useEffect(() => {
    onFilterChange?.({ sort, type, country, language, providers, moctaleSelect, familyFriendly });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, type, country, language, providers, moctaleSelect, familyFriendly]);

  const hasActiveFilters =
    sort !== "newest" ||
    type !== "all" ||
    country !== "all" ||
    language !== "all" ||
    providers.length > 0 ||
    moctaleSelect ||
    familyFriendly;

  const handleReset = () => {
    setSort("newest");
    setType("all");
    setCountry("all");
    setLanguage("all");
    setProviders([]);
    setMoctaleSelect(false);
    setFamilyFriendly(false);
  };

  const toggleProvider = (value) => {
    setProviders((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  return (
    <div className={PANEL_CLASSES + " " + className}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-white" aria-hidden="true" />
          <span className="text-lg font-bold text-white">Filters</span>
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

      {/* SORT BY */}
      <div>
        <PillSelect label="Sort By" options={SORTS} value={sort} onChange={setSort} />
      </div>

      {/* CONTENT TYPE */}
      <div className="border-t border-white/10 pt-5">
        <p className="text-slate-400 text-sm mb-3">Content Type</p>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => {
            const active = type === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`
                  text-sm font-medium px-4 py-2 rounded-full transition-colors
                  border
                  ${
                    active
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
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
      <div className="border-t border-white/10 pt-5">
        <PillSelect label="Country" options={COUNTRIES} value={country} onChange={setCountry} />
      </div>

      {/* LANGUAGE */}
      <div className="border-t border-white/10 pt-5">
        <PillSelect label="Language" options={LANGUAGES} value={language} onChange={setLanguage} />
      </div>

      {/* OTT */}

    </div>
  );
};

export default SearchFilters;