"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import Watchcomp from "@/components/profile/watchcomp";
import { WatchlistGridSkeleton } from "@/components/skeletons/HomeSectionSkeletons";

const Userwatchlist = () => {
  const [watchlist, setWatchlist] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/watchlist");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to load your watchlist");
        setWatchlist(data.watchlist || []);
      } catch (error) {
        console.error("Failed to load watchlist:", error);
        setError(error.message || "Unable to load your watchlist");
        setWatchlist([]);
      }
    };
    loadData();
  }, []);

  if (watchlist === null) return <WatchlistGridSkeleton />

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div><h2 className="text-xl font-semibold">Watchlist</h2><p className="mt-1 text-sm text-white/45">Titles you’ve saved for later.</p></div>
        <span className="text-sm text-white/40">{watchlist.length} saved</span>
      </div>
      {error && <p role="alert" className="mb-4 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-200">{error}</p>}
      {watchlist.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/5 text-white/45"><Bookmark size={20} /></div>
          <h3 className="mt-4 font-medium">Your watchlist is clear</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-white/45">Save movies you want to watch and find them here later.</p>
          <Link href="/explore/trending" className="mt-4 inline-flex rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium hover:bg-purple-500">Find something to watch</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {watchlist.map((item) => item.movie?.movieid ? (
            <Watchcomp key={item._id} movieid={item.movie.movieid} type_of={item.movie.media_type} />
          ) : null)}
        </div>
      )}
    </section>
  );
};

export default Userwatchlist;
