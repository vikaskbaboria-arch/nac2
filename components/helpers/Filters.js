"use client";
import React, { useEffect, useState } from "react";
import { ChevronDown, SlidersHorizontal, Circle, Play, X } from "lucide-react";
import { GENRES } from "@/lib/genres";
import { COUNTRIES } from "@/lib/countries";

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
 * - types — override the Content Type pills (defaults to All/Movies/Shows/People).
 *   Pass a narrower list on a page where a type doesn't apply — e.g. a
 *   country page built on /discover has no "People" results.
 * - showCountryFilter — set false to hide the Country selector on a page
 *   that's already scoped to one country (its own route param), so the
 *   panel isn't asking the same question twice. Defaults to true.
 */
const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "rating", label: "Top rated" },
  { value: "az", label: "A–Z" },
];

const DEFAULT_TYPES = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "Shows" },
  { value: "person", label: "People" },
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
const PANEL_CLASSES = `{
  flex  flex-col gap-4
  rounded-lg 
  w-[95vw] p-1 md:px-4
  backdrop-blur-2xl
        lg:border lg:border-white/20
        shadow-[0_0_40px_rgba(0,0,0,0.6)]
      
   lg:top-22 lg:w-76 lg:rounded-2xl
}`;

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

const Filters = ({
  onFilterChange,
  className = "",
  types = DEFAULT_TYPES,
  showCountryFilter = true,
  showGenreFilter = false,
  initialGenre = "all",
}) => {
  const [sort, setSort] = useState("newest");
  const [type, setType] = useState("all");
  const [country, setCountry] = useState("all");
  const [language, setLanguage] = useState("all");
  const [genre, setGenre] = useState(initialGenre);
  const [providers, setProviders] = useState([]);
  const [ottOpen, setOttOpen] = useState(false);
  const [moctaleSelect, setMoctaleSelect] = useState(false);
  const [familyFriendly, setFamilyFriendly] = useState(false);

  useEffect(() => {
    onFilterChange?.({ sort, type, country, language, genre, providers, moctaleSelect, familyFriendly });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, type, country, language, genre, providers, moctaleSelect, familyFriendly]);

  useEffect(() => {
    setGenre(initialGenre);
  }, [initialGenre]);

  const hasActiveFilters =
    sort !== "newest" ||
    type !== "all" ||
    country !== "all" ||
    language !== "all" ||
    genre !== "all" ||
    providers.length > 0 ||
    moctaleSelect ||
    familyFriendly;

  const handleReset = () => {
    setSort("newest");
    setType("all");
    setCountry("all");
    setLanguage("all");
    setGenre("all");
    setProviders([]);
    setMoctaleSelect(false);
    setFamilyFriendly(false);
  };

  const toggleProvider = (value) => {
    setProviders((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };
  var fixer;
if(!genre){
  fixer="lg:fixed"
}
  return (
    <>
    <div className={PANEL_CLASSES + fixer+" " + className}>
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

      <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 lg:hidden">
        <div className="w-36 shrink-0">
          <PillSelect options={SORTS} value={sort} onChange={setSort} />
        </div>
        <div className="w-36 shrink-0">
          <PillSelect options={types} value={type} onChange={setType} />
        </div>
        {showCountryFilter && (
          <div className="w-40 shrink-0">
            <PillSelect options={COUNTRIES} value={country} onChange={setCountry} />
          </div>
        )}
        {showGenreFilter && (
          <div className="w-40 shrink-0">
            <PillSelect
              options={[{ value: "all", label: "All genres" }, ...GENRES.map(({ slug, name }) => ({ value: slug, label: name }))]}
              value={genre}
              onChange={setGenre}
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => setOttOpen(true)}
          aria-expanded={ottOpen}
          aria-haspopup="dialog"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white hover:bg-white/10"
        >
          OTT{providers.length > 0 ? ` · ${providers.length}` : ""}
          <ChevronDown className="size-4 text-white/50" aria-hidden="true" />
        </button>
      </div>

      <div className="hidden flex-col gap-4 lg:flex">

      {/* SORT BY */}
      <div></div>
      <div>
        <PillSelect label="Sort By" options={SORTS} value={sort} onChange={setSort} />
      </div>

      {/* CONTENT TYPE */}
      <div className="border-t border-white/10 pt-5">
        <p className="text-slate-400 text-sm mb-3">Content Type</p>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => {
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
      {showCountryFilter && (
        <div className="border-t border-white/10 pt-5">
          <PillSelect label="Country" options={COUNTRIES} value={country} onChange={setCountry} />
        </div>
      )}

      {showGenreFilter && (
        <div className="border-t border-white/10 pt-5">
          <PillSelect
            label="Genre"
            options={[{ value: "all", label: "All genres" }, ...GENRES.map(({ slug, name }) => ({ value: slug, label: name }))]}
            value={genre}
            onChange={setGenre}
          />
        </div>
      )}

      {/* LANGUAGE */}
      {/* <div className="border-t border-white/10 pt-5">
        <PillSelect label="Language" options={LANGUAGES} value={language} onChange={setLanguage} />
      </div> */}

      {/* OTT */}
      <div className="border-t border-white/10 pt-5 ">
        <p className="text-slate-400 text-sm mb-3">OTT</p>
        <div className="grid    md:grid-cols-2 gap-2">
          {PROVIDERS.map((p) => {
            const active = providers.includes(p.value);
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => toggleProvider(p.value)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors
                  ${
                    active
                      ? "border-purple-500 bg-purple-600/10"
                      : "border-white/15 bg-white/5 hover:bg-white/10"
                  }
                `}
              >
                <span
                  className={`size-5 rounded flex items-center justify-center flex-shrink-0 ${p.color}`}
                >
                  {p.mono ? (
                    <span className="text-[10px] font-bold text-white">{p.mono}</span>
                  ) : (
                    <Play className="size-3 text-white fill-current" aria-hidden="true" />
                  )}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white truncate">
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BADGES */}
{/* {      <div className="border-t border-white/10 pt-5 flex flex-wrap gap-2">
        <ToggleBadge
          active={moctaleSelect}
          onClick={() => setMoctaleSelect((v) => !v)}
          colorClass="border-amber-400/60 text-amber-400"
        >
          Moctale Select
        </ToggleBadge>
        <ToggleBadge
          active={familyFriendly}
          onClick={() => setFamilyFriendly((v) => !v)}
          colorClass="border-sky-400/60 text-sky-400"
        >
          Family Friendly
        </ToggleBadge>
      </div>} */}
      </div>
    </div>
    {ottOpen && (
      <div
        className="fixed inset-0 z-[100] flex items-end bg-black/70 backdrop-blur-sm lg:hidden"
        onClick={() => setOttOpen(false)}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="ott-filter-title"
          className="w-full rounded-t-2xl border border-white/15 bg-[#121111] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 id="ott-filter-title" className="text-base font-bold text-white">Select OTT</h2>
            <button
              type="button"
              onClick={() => setOttOpen(false)}
              aria-label="Close OTT filters"
              className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PROVIDERS.map((provider) => {
              const active = providers.includes(provider.value);
              return (
                <button
                  key={provider.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleProvider(provider.value)}
                  className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${
                    active
                      ? "border-purple-500 bg-purple-600/10"
                      : "border-white/15 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className={`flex size-5 shrink-0 items-center justify-center rounded ${provider.color}`}>
                    {provider.mono ? (
                      <span className="text-[10px] font-bold text-white">{provider.mono}</span>
                    ) : (
                      <Play className="size-3 fill-current text-white" aria-hidden="true" />
                    )}
                  </span>
                  <span className="truncate text-sm font-semibold text-white">{provider.label}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setOttOpen(false)}
            className="mt-4 h-11 w-full rounded-full bg-white text-sm font-semibold text-black"
          >
            Done
          </button>
        </section>
      </div>
    )}
    </>
  );
};

export default Filters;