"use client";

import React from "react";

export function SpaceSkeletonCard() {
  return (
    <div className="mb-10 sm:mb-14 w-full">
      {/* Media skeleton */}
      <div className="w-full aspect-video sm:aspect-[16/10] rounded-2xl sm:rounded-3xl skeleton-shimmer border border-white/10 shadow-xl" />

      {/* Caption & comment button skeleton */}
      <div className="mt-3.5 flex items-start justify-between gap-4 px-1">
        <div className="flex-1 space-y-2">
          <div className="w-3/5 h-4 skeleton-shimmer rounded-md border border-white/[0.06]" />
          <div className="w-2/5 h-3 skeleton-shimmer rounded-md border border-white/[0.04]" />
        </div>
        <div className="w-10 h-10 rounded-full skeleton-shimmer border border-white/10 shrink-0" />
      </div>
    </div>
  );
}

export default function SpaceSkeletonGrid({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SpaceSkeletonCard key={i} />
      ))}
    </div>
  );
}
