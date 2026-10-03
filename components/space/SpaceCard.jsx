"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Video,
  Newspaper,
  Share2,
  Heart,
  ExternalLink,
  Film,
  Check,
  Play,
  Clock,
  Sparkles,
} from "lucide-react";

/**
 * Calculates human-friendly relative time (e.g. 2h ago, 3d ago)
 */
function formatTimeAgo(dateString) {
  if (!dateString) return "just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getInitials(name = "") {
  return name.replace(/^@/, "").trim().slice(0, 2).toUpperCase() || "NC";
}

export default function SpaceCard({ space }) {
  const [copied, setCopied] = useState(false);
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

  // Resolved movie identifiers
  const movieDbId = movieId?.movieId || movieId?.movieid || (typeof movieId === "string" ? movieId : null);
  const movieTitle = movieId?.movieTitle || title || "Movie";
  const moviePoster = movieId?.moviePoster || img;
  const mediaType = movieId?.media_type || "movie";

  const authorName =
    postedBy?.username ||
    (postedBy?.email ? postedBy.email.split("@")[0] : "cinephile");
  const authorAvatar = postedBy?.profilepic || postedBy?.image;

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/space#${_id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  // Badge configurations based on type
  const typeConfigs = {
    discussion: {
      label: "Discussion",
      icon: MessageSquare,
      badge: "border-purple-500/30 text-purple-300 bg-purple-950/60 shadow-[0_0_12px_rgba(168,85,247,0.2)]",
      gradient: "from-purple-900/40 via-transparent to-transparent",
    },
    trailer: {
      label: "Trailer",
      icon: Video,
      badge: "border-amber-500/30 text-amber-300 bg-amber-950/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
      gradient: "from-amber-900/40 via-transparent to-transparent",
    },
    news: {
      label: "News",
      icon: Newspaper,
      badge: "border-teal-500/30 text-teal-300 bg-teal-950/60 shadow-[0_0_12px_rgba(20,184,166,0.2)]",
      gradient: "from-teal-900/40 via-transparent to-transparent",
    },
  };

  const currentConfig = typeConfigs[spaceType] || typeConfigs.discussion;
  const Icon = currentConfig.icon;

  const movieLink = movieDbId
    ? `/movie/${movieDbId}?type=${mediaType}`
    : "#";

  return (
    <article
      id={_id}
      className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0f0f13] hover:border-white/20 transition-all duration-300 shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-purple-950/20"
    >
      {/* Top Banner (Backdrop Image if available) */}
      {(backdrop || (spaceType === "news" && img)) && (
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-black/50">
          <img
            src={backdrop || img}
            alt={movieTitle}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-[#0f0f13]/40 to-transparent" />

          {/* Floating Type Pill on Backdrop */}
          <div className="absolute top-3 right-3 z-10">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md border ${currentConfig.badge}`}
            >
              <Icon size={13} />
              <span>{currentConfig.label}</span>
            </span>
          </div>

          {/* Overlaid Movie Title on Backdrop */}
          <Link
            href={movieLink}
            className="absolute bottom-3 left-3 sm:left-4 z-10 flex items-center gap-2.5 max-w-[85%] group/movie hover:opacity-90 transition"
          >
            {moviePoster && (
              <img
                src={moviePoster}
                alt=""
                className="w-9 h-13 rounded-lg object-cover shadow-lg border border-white/20 shrink-0"
              />
            )}
            <div className="min-w-0">
              <span className="text-[10px] text-purple-300 uppercase tracking-wider font-semibold block">
                Featured Title
              </span>
              <h4 className="text-sm sm:text-base font-bold text-white truncate group-hover/movie:text-purple-300 transition">
                {movieTitle}
              </h4>
            </div>
          </Link>
        </div>
      )}

      {/* Card Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header (when no backdrop or for Trailer/Discussion without backdrop) */}
          {!backdrop && !(spaceType === "news" && img) && (
            <div className="flex items-center justify-between gap-2 mb-4">
              <Link
                href={movieLink}
                className="flex items-center gap-2.5 min-w-0 hover:opacity-85 transition"
              >
                {moviePoster ? (
                  <img
                    src={moviePoster}
                    alt=""
                    className="w-8 h-11 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-11 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                    <Film size={14} className="text-slate-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Featured Media
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white truncate block">
                    {movieTitle}
                  </span>
                </div>
              </Link>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shrink-0 ${currentConfig.badge}`}
              >
                <Icon size={12} />
                <span>{currentConfig.label}</span>
              </span>
            </div>
          )}

          {/* Author Meta Line */}
          <div className="flex items-center gap-2.5 mb-3">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-8 h-8 rounded-full object-cover border border-white/10"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-800 to-indigo-800 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                {getInitials(authorName)}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-200">@{authorName}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock size={11} /> {formatTimeAgo(createdAt)}
              </span>
            </div>
          </div>

          {/* Video Section (if Trailer) */}
          {spaceType === "trailer" && video && (
            <div className="mb-4 rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video relative group/video">
              <iframe
                src={video}
                title={`${movieTitle} Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Post Title / Topic */}
          {title && (
            <h3 className="text-base sm:text-lg font-bold font-display text-white mb-2 leading-snug">
              {title}
            </h3>
          )}

          {/* Post Body Content */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line line-clamp-6">
            {content}
          </p>
        </div>

        {/* Footer Bar */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
          {/* Quick link to movie page */}
          <Link
            href={movieLink}
            className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white font-medium transition"
          >
            <span>Explore {movieTitle}</span>
            <ExternalLink size={12} />
          </Link>

          {/* Action buttons (Like, Share) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition ${
                liked
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
              title="Like"
            >
              <Heart
                size={14}
                className={liked ? "fill-rose-400 text-rose-400" : ""}
              />
              <span className="text-xs font-semibold">{likeCount}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition"
              title="Share link"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span className="hidden sm:inline text-xs font-medium">Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
