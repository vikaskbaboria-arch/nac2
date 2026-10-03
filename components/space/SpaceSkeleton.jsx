"use client";

import React from "react";

export function SpaceSkeletonCard() {
  return (
    <div className="mb-10 sm:mb-14 w-full animate-pulse">
      {/* Media skeleton */}
      <div className="w-full aspect-video sm:aspect-[16/10] rounded-2xl sm:rounded-3xl bg-[#141418] border border-white/5" />

      {/* Caption & comment button skeleton */}
      <div className="mt-3.5 flex items-start justify-between gap-4 px-1">
        <div className="flex-1 space-y-2">
          <div className="w-3/5 h-4 bg-zinc-800 rounded-md" />
          <div className="w-2/5 h-3 bg-zinc-900 rounded-md" />
        </div>
        <div className="w-10 h-10 rounded-full bg-[#18181c] shrink-0" />
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
