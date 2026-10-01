"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import MovieCard from "@/components/MovieCard";
import Filters from "@/components/helpers/Filters";
import { MediaListSkeleton } from "@/components/skeletons/HomeSectionSkeletons";
import { fetchMovies } from "@/lib/masterfetch";
import { getGenreBySlug } from "@/lib/genres";

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

const TYPES = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "Shows" },
];

export default function Discovery() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const genreSlug = searchParams.get("genre") || "all";
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState(pageFromUrl);
  const [movies, setMovies] = useState([]);
  const [loadedRequest, setLoadedRequest] = useState(null);
  const [filters, setFilters] = useState({
    sort: "newest",
    type: "all",
    country: "all",
    language: "all",
    genre: genreSlug,
    providers: [],
  });

  const requestKey = JSON.stringify({
    genreSlug,
    page,
    type: filters.type,
    country: filters.country,
    language: filters.language,
    providers: filters.providers,
  });
  const loading = loadedRequest !== requestKey;

  useEffect(() => {
    let cancelled = false;

    const genre = getGenreBySlug(genreSlug);
    const selectedProviderIds = filters.providers
      .map((provider) => PROVIDER_IDS[provider])
      .filter(Boolean);
    const shouldLoadMovies = filters.type === "all" || filters.type === "movie";
    const shouldLoadTv = filters.type === "all" || filters.type === "tv";
    const load = (type_of) => fetchMovies({
      type: selectedProviderIds.length ? "provider" : "discover",
      type_of,
      page,
      genre: genre?.id || "",
      with_origin_country: filters.country === "all" ? "" : filters.country,
      with_original_language: filters.language === "all" ? "" : filters.language,
      ...(selectedProviderIds.length ? { provider_id: selectedProviderIds } : {}),
    });

    Promise.all([
      shouldLoadMovies ? load("movie") : Promise.resolve(null),
      shouldLoadTv ? load("tv") : Promise.resolve(null),
    ]).then(([movieResults, tvResults]) => {
      if (cancelled) return;
      setMovies([
        ...(movieResults?.results || []).map((movie) => ({ ...movie, media_type: "movie" })),
        ...(tvResults?.results || []).map((show) => ({ ...show, media_type: "tv" })),
      ]);
      setLoadedRequest(requestKey);
    }).catch((error) => {
      console.error("Failed to load discovery titles:", error);
      if (!cancelled) {
        setMovies([]);
        setLoadedRequest(requestKey);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [filters.country, filters.language, filters.providers, filters.type, genreSlug, page, requestKey]);

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (nextFilters.genre && nextFilters.genre !== "all") {
      params.set("genre", nextFilters.genre);
    } else {
      params.delete("genre");
    }
    params.delete("page");
    const query = params.toString();
    router.replace(query ? `/discovery?${query}` : "/discovery", { scroll: false });
  };

  const results = [...movies];
  const dateOf = (movie) => movie.release_date || movie.first_air_date || "";
  if (filters.sort === "newest") results.sort((a, b) => dateOf(b).localeCompare(dateOf(a)));
  if (filters.sort === "oldest") results.sort((a, b) => dateOf(a).localeCompare(dateOf(b)));
  if (filters.sort === "rating") results.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  if (filters.sort === "az") results.sort((a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""));

  const selectedGenre = getGenreBySlug(genreSlug);
  const title = selectedGenre?.name || "Discover";

  return (
    <div className="relative z-10 mx-auto w-full px-4 pt-4 sm:px-6 lg:px-24 lg:pt-6">
      <div className="grid items-start justify-center gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,4fr)]">
        <Filters
          onFilterChange={handleFilterChange}
          types={TYPES}
          showGenreFilter
          initialGenre={genreSlug}
          
        />

        <section>
          <header className="mb-6 pl-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Discovery</p>
            <h1 className="truncate text-3xl font-extrabold text-white sm:text-4xl">
              <AnimatedShinyText>{title}</AnimatedShinyText>
            </h1>
          </header>

          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-4 sm:p-3 lg:grid-cols-5">
            {loading ? (
              <div className="col-span-full">
                <MediaListSkeleton label="discovery titles" count={5} />
              </div>
            ) : results.map((movie) => (
              <MovieCard key={`${movie.media_type}-${movie.id}`} movie={movie} />
            ))}
            {!loading && results.length === 0 && (
              <p className="col-span-full py-10 text-center text-sm text-white/40">
                No titles found for {title} with these filters.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}