"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import styles from "./MovieCard.module.css";

/**
 * MovieCard (MediaCard)
 * Reusable poster card component used across:
 * - Trending & TrendingOnNAC
 * - Don't Miss rows (Netflix, Prime Video, etc.)
 * - Editor's Pick & NAC Collection
 * - Most Interested & My Interested
 * - Search results & Explore Country pages
 *
 * Keeps 100% identical styling, hover animations, marquee overflow,
 * and navigation behavior without changing any UI appearance.
 */
export default function MovieCard({
  movie,
  onClick,
  className = "w-full",
  typeFallback = "movie",
  badge,
  subtitle,
  showRating = false,
}) {
  const router = useRouter();

  if (!movie) return null;

  const id = movie.movieId || movie.id;
  const title = movie.title || movie.name || "Untitled";
  const mediaType = movie.media_type || movie.mediaType || movie.interestedType || typeFallback;
  const isMovie = mediaType === "movie";
  const posterPath = movie.poster_path;
  const profilePath = movie.profile_path;

  const imageSrc = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : profilePath
    ? `https://image.tmdb.org/t/p/w500${profilePath}`
    : "/placeholder.png";

  const defaultClick = () => {
    router.push(`/movie/${id}?type=${isMovie ? "movie" : "tv"}`);
  };

  const handleClick = onClick ? () => onClick(movie) : defaultClick;

  const resolvedBadge =
    badge !== undefined
      ? badge
      : movie.tag ? (
          <div className="absolute top-2 left-2 max-w-[85%] bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-amber-300 font-semibold border border-amber-500/30 truncate">
            {movie.tag}
          </div>
        ) : movie.curatorNote ? (
          <div className="absolute top-2 left-2 max-w-[85%] bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-purple-200 border border-purple-500/30 truncate">
            ★ {movie.curatorNote}
          </div>
        ) : null;

  const mediaLabel = isMovie ? "Movie" : "Series";
  const shouldMarquee = title?.length > 22;

  return (
    <div
      onClick={handleClick}
      className={`
        group
        ${styles.movieCard}
        cursor-pointer
        rounded-xl
        p-2
        transition-colors
        hover:bg-white/5
        ${className}
      `}
    >
      {/* POSTER */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-poster rounded-xl">
        <img
          src={imageSrc}
          className="
            absolute inset-0
            w-full h-full object-cover
            rounded-xl
          "
          alt={title}
        />

        {/* subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

        {/* Optional Badge (Tag / Curator Note) */}
        {resolvedBadge}
      </div>

      {/* TITLE */}
      <div className="mt-2 text-sm font-semibold overflow-hidden">
        <div className={shouldMarquee ? styles.titleViewport : "whitespace-nowrap"}>
          {shouldMarquee ? (
            <div className={styles.titleTrack}>
              <span className={styles.titleCopy}>
                <AnimatedShinyText>{title}</AnimatedShinyText>
              </span>
              <span aria-hidden="true" className={styles.titleCopy}>
                <AnimatedShinyText>{title}</AnimatedShinyText>
              </span>
            </div>
          ) : (
            <AnimatedShinyText>{title}</AnimatedShinyText>
          )}
        </div>
      </div>

      {/* SUBTITLE & OPTIONAL RATING */}
      <div className=" text-muted-foreground text-xs ">
        {subtitle !== undefined ? (
          typeof subtitle === "string" ? (
            <AnimatedShinyText>{subtitle}</AnimatedShinyText>
          ) : (
            subtitle
          )
        ) : (
          <AnimatedShinyText className={styles.mediaLabelShine} shimmerWidth={80}>
            {mediaLabel}
          </AnimatedShinyText>
        )}

     
      </div>
    </div>
  );
}
