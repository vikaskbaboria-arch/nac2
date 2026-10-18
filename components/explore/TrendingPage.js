"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MovieCard from "@/components/media/MovieCard";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { fetchMovies } from "@/lib/masterfetch";
import { Flame, Calendar, Sparkles, Film, Tv, Compass } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "all", label: "All", icon: Compass },
  { value: "movie", label: "Movies", icon: Film },
  { value: "tv", label: "TV Shows", icon: Tv },
];

const TIME_OPTIONS = [
  { value: "day", label: "Today", icon: Flame },
  { value: "week", label: "This Week", icon: Calendar },
];

export default function TrendingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialType = searchParams.get("type") || "all";
  const initialTime = searchParams.get("time") || "day";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [type, setType] = useState(initialType);
  const [time, setTime] = useState(initialTime);
  const [page, setPage] = useState(initialPage);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (type !== "all") params.set("type", type);
    if (time !== "day") params.set("time", time);
    if (page > 1) params.set("page", String(page));

    const qs = params.toString();
    const url = qs ? `/explore/trending?${qs}` : "/explore/trending";
    router.replace(url, { scroll: false });
  }, [type, time, page, router]);

  // Fetch trending data
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchMovies({
      type: "trending",
      type_of: type,
      time: time,
      page: page,
    })
      .then((data) => {
        if (cancelled) return;
        const results = (data?.results || []).map((m) => ({
          ...m,
          media_type: m.media_type || (type === "all" ? "movie" : type),
        }));
        setMovies(results);
        setTotalPages(Math.min(data?.total_pages || 1, 500));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load trending titles:", error);
        if (!cancelled) {
          setMovies([]);
          setTotalPages(1);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [type, time, page]);

  const handleTypeChange = (newType) => {
    if (newType === type) return;
    setType(newType);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTimeChange = (newTime) => {
    if (newTime === time) return;
    setTime(newTime);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-[75vh] w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        {/* HEADER */}
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Explore
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white sm:text-4xl">
                <Flame className="size-8 text-amber-500 fill-amber-500/20" />
                <AnimatedShinyText>Trending</AnimatedShinyText>
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                The most watched and talked-about movies and television series
                around the world right now.
              </p>
            </div>
          </div>
        </header>

        {/* CONTROLS / FILTERS */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
          {/* CONTENT TYPE TOGGLES */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Format:
            </span>
            {TYPE_OPTIONS.map((opt) => {
              const active = type === opt.value;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleTypeChange(opt.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                    active
                      ? "bg-purple-600 border-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]"
                      : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="size-4" />
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* TIME WINDOW TOGGLES */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Window:
            </span>
            {TIME_OPTIONS.map((opt) => {
              const active = time === opt.value;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleTimeChange(opt.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                    active
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                      : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="size-4" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TITLES GRID */}
        {loading ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="w-full rounded-xl p-2">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl skeleton-shimmer border border-white/[0.08] shadow-lg shadow-black/40" />
                <div className="mt-2.5 h-4 w-4/5 rounded-md skeleton-shimmer border border-white/[0.05]" />
                <div className="mt-2 h-3 w-2/5 rounded-md skeleton-shimmer border border-white/[0.04]" />
              </div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {movies.map((m, index) => {
              const rank = index + 1 + (page - 1) * 20;
              return (
                <MovieCard
                  key={`${m.media_type || type}-${m.id}`}
                  movie={m}
                  typeFallback={type === "all" ? "movie" : type}
                  badge={
                    <div className="absolute top-2 left-2 flex items-center justify-center bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-extrabold text-amber-400 border border-amber-500/30 shadow-md">
                      #{rank}
                    </div>
                  }
                />
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-sm text-white/40">
            No trending titles found for this selection.
          </div>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4 text-white pb-8">
            <button
              type="button"
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="px-4 py-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm font-medium"
            >
              Prev
            </button>

            <span className="text-sm text-white/70">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm font-medium"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
