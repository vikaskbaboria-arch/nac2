"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MovieCard from "@/components/media/MovieCard";
import { fetchMovies } from "@/lib/masterfetch";

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
    <main className="min-h-[70vh] w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        {/* HEADER (Matches explore/genre style) */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Explore
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Trending
            </h1>
          </div>

          {/* Simple controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* TIME FILTER */}
            <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => handleTimeChange("day")}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                  time === "day"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleTimeChange("week")}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                  time === "week"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                This Week
              </button>
            </div>

            {/* TYPE FILTER */}
            <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => handleTypeChange("all")}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                  type === "all"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("movie")}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                  type === "movie"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Movies
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("tv")}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                  type === "tv"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Shows
              </button>
            </div>
          </div>
        </header>

        {/* TITLES GRID */}
        {loading ? (
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-4 sm:p-3 lg:grid-cols-5">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="w-full rounded-xl p-2">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl skeleton-shimmer border border-white/[0.08] shadow-lg shadow-black/40" />
                <div className="mt-2.5 h-4 w-4/5 rounded-md skeleton-shimmer border border-white/[0.05]" />
                <div className="mt-2 h-3 w-2/5 rounded-md skeleton-shimmer border border-white/[0.04]" />
              </div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-4 sm:p-3 lg:grid-cols-5">
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-sm text-white/40">
            No trending titles found.
          </div>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4 text-white pb-12">
            <button
              type="button"
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="px-4 py-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm font-medium"
            >
              Prev
            </button>

            <span className="text-sm text-white/70">
              {page} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm font-medium"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
