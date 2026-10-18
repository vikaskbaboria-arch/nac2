"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { fetchMovies } from "@/lib/masterfetch";

const Watchcomp = ({ movieid, type_of = "movie", onRemove, removing = false }) => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    let active = true;
    fetchMovies({
      type: "byid",
      id: movieid,
      type_of: type_of === "tv" ? "tv" : "movie",
    })
      .then((result) => active && setMovie(result || { id: movieid, title: "Title unavailable" }))
      .catch(() => active && setMovie({ id: movieid, title: "Title unavailable" }));
    return () => {
      active = false;
    };
  }, [movieid, type_of]);

  if (!movie) {
    return (
      <div className="rounded-xl p-2">
        <div className="aspect-[2/3] rounded-xl skeleton-shimmer border border-white/[0.08] shadow-lg shadow-black/40" />
        <div className="mt-2.5 h-4 w-4/5 rounded-md skeleton-shimmer border border-white/[0.05]" />
      </div>
    );
  }

  const mediaType = type_of === "tv" ? "tv" : "movie";
  const title = movie.title || movie.name || "Untitled";

  return (
    <article className="group relative rounded-xl p-2 transition-colors hover:bg-white/10">
      <Link href={`/movie/${movie.id || movieid}?type=${mediaType}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-white/5">
          {movie.poster_path ? (
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={title} className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : <div className="grid size-full place-items-center text-center text-xs text-white/40">Poster unavailable</div>}
          <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
        </div>
        <p className="mt-2 truncate text-sm font-semibold">{title}</p>
      </Link>
      {onRemove && <button type="button" onClick={onRemove} disabled={removing} aria-label={`Remove ${title} from watchlist`} title="Remove from watchlist" className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/75 p-2 text-white/75 opacity-100 shadow-lg transition hover:bg-red-500/80 hover:text-white sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-50"><Trash2 size={14} /></button>}
    </article>
  );
};

export default Watchcomp;
