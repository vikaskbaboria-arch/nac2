"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, MessageCircle, Share2, ExternalLink, Heart, Film } from "lucide-react";

function formatTimeAgo(dateString) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function SpaceFeedItem({ space, onCommentClick }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  if (!space) return null;

  const {
    _id,
    spaceType = "discussion",
    title,
    content,
    img,
    backdrop,
    video,
    postedBy,
    movieId,
    createdAt,
  } = space;

  const movieDbId = movieId?.movieId || movieId?.movieid || (typeof movieId === "string" ? movieId : null);
  const movieTitle = movieId?.movieTitle || title || "Movie";
  const mediaType = movieId?.media_type || "movie";
  const movieLink = movieDbId ? `/movie/${movieDbId}?type=${mediaType}` : "#";

  const authorName =
    postedBy?.username ||
    (postedBy?.email ? postedBy.email.split("@")[0] : "NAC Member");

  // Determine media to show: backdrop takes priority, else poster (img)
  const mediaUrl = backdrop || img;

  return (
    <article className="group mb-7 w-full sm:mb-10 lg:mb-14 last:mb-0">
      {/* MEDIA CONTAINER */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#141417] border border-white/5 shadow-2xl">
        {spaceType === "trailer" ? (
          // VIDEO / TRAILER DISPLAY
          <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
            {isPlaying && video ? (
              <iframe
                src={`${video}${video.includes("?") ? "&" : "?"}autoplay=1`}
                title={title || `${movieTitle} Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                {/* Thumbnail Image */}
                <img
                  src={mediaUrl || "/placeholder.png"}
                  alt={movieTitle}
                  className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-[1.02] transition-transform duration-700"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Center Play Button Overlay */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="absolute z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl hover:scale-110 hover:bg-black/90 active:scale-95 transition-all duration-200 cursor-pointer"
                  aria-label="Play trailer"
                >
                  <Play size={24} className="fill-white translate-x-0.5" />
                </button>

                {/* Overlaid Title on Trailer Thumbnail */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-600/90 text-white inline-block mb-1.5 shadow">
                    Trailer
                  </span>
                  <h3 className="text-base sm:text-xl font-bold font-display text-white line-clamp-1 drop-shadow-md">
                    {title || `${movieTitle} | Official Trailer`}
                  </h3>
                </div>
              </>
            )}
          </div>
        ) : (
          // IMAGE / NEWS / DISCUSSION DISPLAY
          <div className="relative w-full aspect-[16/11] bg-[#111114] overflow-hidden sm:aspect-[16/10]">
            {mediaUrl ? (
              <img
                src={mediaUrl}
                alt={movieTitle}
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-black text-zinc-600">
                <Film size={48} className="mb-2 opacity-50" />
                <span className="text-sm font-semibold">{movieTitle}</span>
              </div>
            )}

            {/* Subtle Gradient Shade at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

            {/* Carousel-style Pagination Dots (matching reference) */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              <span className="w-4 h-1.5 rounded-full bg-white shadow-sm" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-sm" />
            </div>

            {/* Type badge at top right */}
            <div className="absolute top-3.5 right-3.5 z-10">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-zinc-300">
                {spaceType}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* METADATA & CONTENT (Below the Media) */}
      <div className="mt-3.5 flex min-w-0 items-start justify-between gap-2 px-1 sm:gap-4">
        <div className="flex-1 min-w-0">
          {spaceType === "trailer" ? (
            <div>
              {/* Title */}
              <h2 className="break-words text-base font-bold text-white transition hover:text-zinc-200 sm:text-lg">
                {title || `${movieTitle} | Official Trailer`}
              </h2>

              {/* Author & Date Line */}
              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 break-words text-xs text-zinc-400 sm:text-sm">
                <span>By {authorName}</span>
                <span>•</span>
                <span>{formatTimeAgo(createdAt)}</span>
                {movieDbId && (
                  <>
                    <span>•</span>
                    <Link
                      href={movieLink}
                      className="text-purple-400 hover:text-purple-300 underline underline-offset-2 flex items-center gap-1"
                    >
                      {movieTitle} <ExternalLink size={11} />
                    </Link>
                  </>
                )}
              </p>
            </div>
          ) : (
            <div>
              {/* News / Discussion Content Paragraph */}
              <div className="break-words text-xs font-normal leading-relaxed text-zinc-300">
                {content}
              </div>

              {/* Linked Movie & Author Tagline */}
              <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 break-words text-xs text-zinc-500">
                {movieDbId && (
                  <Link
                    href={movieLink}
                    className="text-white hover:text-purple-300 font-semibold underline underline-offset-4 transition"
                  >
                    {movieTitle}
                  </Link>
                )}
                <span>•</span>
                <span>By @{authorName}</span>
                <span>•</span>
                <span>{formatTimeAgo(createdAt)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Circular Comment / Discussion Button (matches reference) */}
        <button
          type="button"
          onClick={() => onCommentClick?.(space)}
          className="w-10 h-10 shrink-0 rounded-full bg-[#18181c] hover:bg-[#25252a] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
          title="Discuss & comments"
          aria-label="Discuss"
        >
          <MessageCircle size={18} />
        </button>
      </div>
    </article>
  );
}
