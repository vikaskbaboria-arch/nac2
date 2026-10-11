"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const compact = new Intl.NumberFormat("en", { notation: "compact" });

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function Avatar({ name, src, className }) {
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary text-xs font-medium text-secondary-foreground ring-1 ring-border",
        className
      )}
    >
      {src ? (
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}

/**
 * ReviewCard
 * Shared review card used in homereviews and showrevonprofile.
 */
export default function ReviewCard({ review, onSaveChange, variant = "default" }) {
  const [saved, setSaved] = useState(false);
  const { featured } = review || {};

  function toggleSave() {
    const next = !saved;
    setSaved(next);
    onSaveChange?.(review.id || review._id, next);
  }

  const isProfileVariant = variant === "profile";
  const authorName = review.author || review.user?.username || "Anonymous";
  const quoteText = review.quote || review.review;

  return (
    <article
      className={cn(
        "flex flex-col justify-between gap-8 rounded-xl border p-6 transition-all",
        isProfileVariant
          ? "border-white/10 bg-black shadow-md shadow-black/40"
          : featured
          ? "border-primary/40 bg-white/50 shadow-[0_16px_40px_-20px_rgba(232,169,74,0.35)]"
          : "border-border bg-card"
      )}
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          {review.movieTitle ? (
            <Link
              href={review.movieHref || "#"}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                featured ? "text-primary" : "text-muted-foreground"
              )}
            >
              {review.movieTitle}
            </Link>
          ) : (
            <span className="text-sm font-medium text-muted-foreground">Movie Review</span>
          )}

          <button
            type="button"
            onClick={toggleSave}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved reviews" : "Save review"}
            className={cn(
              "-mr-2 -mt-2 grid size-8 place-items-center rounded-md transition-colors hover:bg-accent",
              saved ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Bookmark className={cn("size-4", saved && "fill-current")} aria-hidden="true" />
          </button>
        </div>

        <blockquote>
          {review.reviewHref ? (
            <Link
              href={review.reviewHref}
              className="font-display text-2xl leading-snug text-foreground text-balance transition-colors hover:text-primary"
            >
              &ldquo;{quoteText}&rdquo;
            </Link>
          ) : (
            <p className="text-sm text-white/80 leading-relaxed line-clamp-3">
              {quoteText}
            </p>
          )}
        </blockquote>
      </div>

      <footer className="flex items-center gap-3">
        <Avatar name={authorName} src={review.avatarUrl} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{authorName}</p>
          <p className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="size-3 fill-primary text-primary" aria-hidden="true" />
              {Number(review.rating || 0).toFixed(1)}
              <span className="sr-only">rating</span>
            </span>
            {review.likes !== undefined && (
              <span className="inline-flex items-center gap-1">
                <Heart className="size-3" aria-hidden="true" />
                {compact.format(review.likes)}
                <span className="sr-only">likes</span>
              </span>
            )}
          </p>
        </div>
      </footer>
    </article>
  );
}
