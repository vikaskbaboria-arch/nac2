"use client";
import React, { useEffect, useState } from "react";
import { getCountryNames, getLanguageName } from "@/lib/localeNames";
import MovieCard from "../MovieCard";
import Filters, { COUNTRIES } from "../helpers/Filters";
import { fetchMovies } from "@/lib/masterfetch";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { useRouter, useSearchParams } from "next/navigation";
import { MediaListSkeleton } from "@/components/skeletons/HomeSectionSkeletons";

// This page is already scoped to one country (its own route param), so
// the panel's own Country selector is hidden and only Movies/Shows are
// offered — /discover has no "People" results the way /search/multi does.
const COUNTRY_PAGE_TYPES = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "Shows" },
];

const PROVIDER_IDS = {
  netflix: 8,
  prime: 119,
  jiohotstar: 220,
  crunchyroll: 283,
  sonyliv: 237,
  zee5: 232,
  appletv: 350,
  youtube: 192,
};

const Country = ({ country }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
    const countryCode = country?.toUpperCase();
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const [movies, setMovies] = useState({ movie: [], tv: [] });
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(pageFromUrl);
  const [filters, setFilters] = useState({
    sort: "newest",
    type: "all",
    language: "all",
    providers: [],
    moctaleSelect: false,
    familyFriendly: false,
  });
   
  const countryLabel =
    COUNTRIES.find((c) => c.value === countryCode)?.label || country;

  // /discover only returns one media type per call, so "All" fetches
  // movie + tv in parallel and tags each result with its media_type
  // (discover results don't carry one the way /search/multi results do).
  useEffect(() => {
    let cancelled = false;

    const wantMovies = filters.type === "all" || filters.type === "movie";
    const wantTv = filters.type === "all" || filters.type === "tv";
    const selectedProviderIds = filters.providers
      .map((provider) => PROVIDER_IDS[provider])
      .filter(Boolean);
    const fetchMedia = (mediaType) => fetchMovies({
      type: selectedProviderIds.length ? "provider" : "discover",
      type_of: mediaType,
      ...(selectedProviderIds.length ? { provider_id: selectedProviderIds } : {}),
      with_origin_country: countryCode,
      page: pages,
    });

    Promise.all([
      wantMovies
        ? fetchMedia("movie")
        : Promise.resolve(null),
      wantTv
        ? fetchMedia("tv")
        : Promise.resolve(null),
    ]).then(([movieRes, tvRes]) => {
      if (cancelled) return;
      setMovies({
        movie: (movieRes?.results || []).map((m) => ({ ...m, media_type: "movie" ,})),
        tv: (tvRes?.results || []).map((m) => ({ ...m, media_type: "tv" })),
        totalPagesMovie: movieRes?.total_pages || 1,
        totalPagesTv: tvRes?.total_pages || 1,
      });
      setLoading(false);
    }).catch((error) => {
      console.error("Failed to load country titles:", error)
      if (!cancelled) {
        setMovies({ movie: [], tv: [], totalPagesMovie: 1, totalPagesTv: 1 })
        setLoading(false)
      }
    });

    return () => {
      cancelled = true;
    };
  }, [country, countryCode, pages, filters.type, filters.providers]);

  useEffect(() => {
    router.push(`?page=${pages}`, { scroll: true });
  }, [pages, router]);

  const totalpages = Math.max(
    movies.totalPagesMovie || 1,
    movies.totalPagesTv || 1
  );

  const handleFilterChange = (nextFilters) => {
    setLoading(true);
    setFilters(nextFilters);
  };

  const results = [...movies.movie, ...movies.tv].filter((m) => {
    if (filters.language !== "all" && m.original_language !== filters.language) return false;
    return true;
  });

  const dateOf = (m) => m.release_date || m.first_air_date || "";
  if (filters.sort === "newest") {
    results.sort((a, b) => dateOf(b).localeCompare(dateOf(a)));
  } else if (filters.sort === "oldest") {
    results.sort((a, b) => dateOf(a).localeCompare(dateOf(b)));
  } else if (filters.sort === "rating") {
    results.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  } else if (filters.sort === "az") {
    results.sort((a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""));
  }

  const handleClick = (m) => {
    router.push(`/movie/${m.id}?type=${m.media_type === "movie" ? "movie" : "tv"}`);
  };

  return (
    <div className="w-full mx-auto relative z-10 px-8 lg:px-24 lg:pt-6">
      {/* HEADER */}
    

      <div className="lg:grid gap-4 grid-cols-[1.5fr_4fr] items-start justify-center">
        <div>
          <Filters
            onFilterChange={handleFilterChange}
            types={COUNTRY_PAGE_TYPES}
            showCountryFilter={false}
          />
        </div>
         <div>
            <div className="mb-6 pl-6">
        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Country
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white truncate">
          <AnimatedShinyText>
         {countryLabel}
          
            </AnimatedShinyText>
        </h1>
      </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1">
          
          {loading ? (
            <div className="col-span-full">
              <MediaListSkeleton label="country titles" count={5} />
            </div>
          ) : results.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}

          {!loading && results.length === 0 && (
            <p className="col-span-full text-sm text-white/40 py-10 text-center">
              No titles found for {countryLabel} with these filters.
            </p>
          )}
        </div></div>
        
      </div>

      {/* PAGINATION */}
     
    </div>
  );
};

export default Country;