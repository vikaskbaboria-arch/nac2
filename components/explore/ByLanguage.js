"use client";
import React, { useEffect, useState } from "react";
import { getLanguageName } from "@/lib/localeNames";
import MovieCard from "../MovieCard";
import Filters from "../helpers/Filters";
import { fetchMovies } from "@/lib/masterfetch";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { useRouter, useSearchParams } from "next/navigation";
import { MediaListSkeleton } from "@/components/skeletons/HomeSectionSkeletons";

const LANGUAGE_PAGE_TYPES = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "Shows" },
];

const PROVIDER_IDS = {
  netflix: 8,
  prime: 119,
  jiohotstar: 2336,
  crunchyroll: 283,
  sonyliv: 237,
  zee5: 232,
  appletv: 350,
  youtube: 192,
};

const Language = ({ language }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const languageCode = String(language || "").toLowerCase();
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

  const languageLabel = getLanguageName(languageCode) || language;

  useEffect(() => {
    let cancelled = false;

    const wantMovies = filters.type === "all" || filters.type === "movie";
    const wantTv = filters.type === "all" || filters.type === "tv";
    const selectedProviderIds = filters.providers
      .map((provider) => PROVIDER_IDS[provider])
      .filter(Boolean);

    const fetchMedia = (mediaType) =>
      fetchMovies({
        type: selectedProviderIds.length ? "provider" : "discover",
        type_of: mediaType,
        ...(selectedProviderIds.length ? { provider_id: selectedProviderIds } : {}),
        with_original_language: languageCode,
        region: "",
        page: pages,
      });

    Promise.all([
      wantMovies ? fetchMedia("movie") : Promise.resolve(null),
      wantTv ? fetchMedia("tv") : Promise.resolve(null),
    ])
      .then(([movieRes, tvRes]) => {
        if (cancelled) return;
        setMovies({
          movie: (movieRes?.results || []).map((m) => ({ ...m, media_type: "movie" })),
          tv: (tvRes?.results || []).map((m) => ({ ...m, media_type: "tv" })),
          totalPagesMovie: movieRes?.total_pages || 1,
          totalPagesTv: tvRes?.total_pages || 1,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load language titles:", error);
        if (!cancelled) {
          setMovies({ movie: [], tv: [], totalPagesMovie: 1, totalPagesTv: 1 });
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [languageCode, pages, filters.type, filters.providers]);

  useEffect(() => {
    router.push(`?page=${pages}`, { scroll: true });
  }, [pages, router]);

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

  return (
    <div className="relative z-10 mx-auto w-full px-4 pt-4 sm:px-6 lg:px-24 lg:pt-6">
      <div className="grid items-start justify-center gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,4fr)]">
        <div>
          <Filters
            onFilterChange={setFilters}
            types={LANGUAGE_PAGE_TYPES}
            showCountryFilter={false}
            className="lg:fixed"
          />
        </div>

        <div>
          <div className="mb-6 pl-6">
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Language
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white truncate">
              <AnimatedShinyText>{languageLabel}</AnimatedShinyText>
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-4 sm:p-3 lg:grid-cols-5">
            {loading ? (
              <div className="col-span-full">
                <MediaListSkeleton label="language titles" count={5} />
              </div>
            ) : (
              results.map((m) => <MovieCard key={m.id} movie={m} />)
            )}

            {!loading && results.length === 0 && (
              <p className="col-span-full py-10 text-center text-sm text-white/40">
                No titles found for {languageLabel} with these filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Language;