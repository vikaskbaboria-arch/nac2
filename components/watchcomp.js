"use client";
import React, { useEffect, useState } from "react";
import { fetchMovies } from "@/lib/masterfetch";
import { useRouter } from "next/navigation";

const Watchcomp = ({ movieid }) => {
  const [movie, setMovie] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchMovies({
      type: "byid",
      id: movieid,
      type_of: "movie",
    }).then((m) => setMovie(m));
  }, [movieid]);

  if (!movie) {
    return (
      <div className="group cursor-pointer rounded-xl p-2">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-white/5 animate-pulse" />
        <div className="mt-2 h-4 w-3/4 rounded bg-white/5 animate-pulse" />
      </div>
    );
  }

  return (
    <div
      onClick={() => router.push(`/movie/${movie.id}?type=movie`)}
      className="
        group
        cursor-pointer
        rounded-xl
        p-2
        transition-colors
        hover:bg-white/10
      "
    >
      {/* POSTER */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
        <img
          src={
            movie?.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/placeholder.png"
          }
          alt={movie?.title}
          className="
            absolute inset-0
            w-full h-full object-cover
            transition-transform duration-300
            group-hover:scale-105
          "
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
      </div>

      {/* TITLE */}
      <div className="mt-2 text-sm font-semibold truncate">
        {movie?.title}
      </div>
    </div>
  );
};

export default Watchcomp;