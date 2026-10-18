"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { fetchMovies } from "@/lib/masterfetch";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { PosterRailSkeleton } from "@/components/skeletons/HomeSectionSkeletons";

const MyInterested = ({ onCountChange }) => {
  const [movies, setMovies] = useState(null);
  const [listCount, setListCount] = useState(0);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    fetch("/api/intrested")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load your interested list");
        return data;
      })
      .then(async (data) => {
        const items = data?.interested || [];
        if (mounted) {
          setListCount(items.length);
          onCountChange?.(items.length);
        }
        const results = await Promise.all(
          items
            .filter((item) => item.movie?.movieid)
            .map((item) =>
              fetchMovies({
                type: "byid",
                id: item.movie.movieid,
                type_of: item.type === "series" ? "tv" : "movie",
              })
                .then((movie) => movie && ({ ...movie, interestedType: item.type }))
                .catch(() => null)
            )
        );
        if (mounted) setMovies(results.filter(Boolean));
      })
      .catch((loadError) => {
        if (!mounted) return;
        setError(loadError.message || "Unable to load your interested list");
        setMovies([]);
        setListCount(0);
        onCountChange?.(0);
      });

    return () => {
      mounted = false;
    };
  }, [onCountChange]);

  const removeTitle = async (movie) => {
    if (removingId !== null) return;
    setError("");
    setRemovingId(movie.id);
    try {
      const response = await fetch("/api/intrested", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieID: Number(movie.id) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to remove this title");
      const nextMovies = movies.filter((entry) => entry.id !== movie.id);
      const nextCount = Math.max(0, listCount - 1);
      setMovies(nextMovies);
      setListCount(nextCount);
      onCountChange?.(nextCount);
    } catch (removeError) {
      setError(removeError.message || "Unable to remove this title");
    } finally {
      setRemovingId(null);
    }
  };

  if (movies === null) return <PosterRailSkeleton label="your interested titles" />;

  return (
    <section className="w-full">
      <div className="mb-3 flex items-end justify-between gap-3 px-1">
        <div>
          <h2 className="text-xl font-semibold text-white">Your Interested List</h2>
          <p className="mt-1 text-sm text-white/45">Titles you’re looking forward to watching.</p>
        </div>
        <span className="text-sm text-white/40">{listCount} saved</span>
      </div>
      {error && <p role="alert" className="mb-3 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-200">{error}</p>}
      {movies.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center">
          <p className="text-sm text-white/45">Nothing here yet. Mark a movie or series as interested and it’ll appear here.</p>
          <Link href="/explore/trending" className="mt-4 inline-flex rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500">Explore trending</Link>
        </div>
      ) : (
        <div className="relative flex w-full snap-x snap-mandatory gap-4 overflow-x-auto rounded-xl p-2 scroll-px-2">
          {movies.map((movie) => {
            const href = `/movie/${movie.id}?type=${movie.interestedType === "series" ? "tv" : "movie"}`;
            const title = movie.title || movie.name || "Untitled";
            return (
              <article key={`${movie.interestedType}-${movie.id}`} className="group relative w-[38vw] shrink-0 snap-start rounded-xl p-2 transition-colors hover:bg-white/10 xs:w-[30vw] sm:w-[22vw] lg:w-[160px]">
                <Link href={href} className="block">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-white/5">
                    <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/pic.png"} className="absolute inset-0 size-full rounded-xl object-cover" alt={title} />
                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                  </div>
                  <p className="mt-2 truncate text-sm font-semibold"><AnimatedShinyText>{title}</AnimatedShinyText></p>
                  <p className="text-xs text-white/45">{movie.interestedType === "series" ? "Series" : "Movie"}</p>
                </Link>
                <button type="button" onClick={() => removeTitle(movie)} disabled={removingId !== null} aria-label={`Remove ${title} from your interested list`} title="Remove from interested list" className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/75 p-2 text-white/75 opacity-100 shadow-lg transition hover:bg-red-500/80 hover:text-white sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-50"><Trash2 size={14} /></button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyInterested;
