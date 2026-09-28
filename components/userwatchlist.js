"use client";

import React, { useEffect, useState } from "react";
import Watchcomp from "./watchcomp";
import { WatchlistGridSkeleton } from "@/components/skeletons/HomeSectionSkeletons";

const Userwatchlist = () => {
  const [watchlist, setWatchlist] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/watchlist");
        const data = await res.json();
        setWatchlist(data.watchlist || []);
      } catch (error) {
        console.error("Failed to load watchlist:", error);
        setWatchlist([]);
      }
    };
    loadData();
  }, []);

  if (watchlist === null) return <WatchlistGridSkeleton />

  return (
    <div
      className="
        grid
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        gap-4
      "
    >
      {watchlist.map((item) => (
        <Watchcomp
          key={item._id}
          movieid={item.movie.movieid}
          posterPath={item.movie.poster_path}
          title={item.movie.title || item.movie.name}
          mediaType={item.movie.media_type}
        />
      ))}
    </div>
  );
};

export default Userwatchlist;