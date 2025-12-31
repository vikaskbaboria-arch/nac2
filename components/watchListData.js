"use client";

import React, { useEffect, useState } from "react";
import { fetchMovies } from "@/lib/masterfetch";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const WatchListData = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/watchlist", {
          credentials: "include", // ✅ best for NextAuth
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch watchlist");
        }

        const data = await res.json();

        // ✅ FIXED KEY (THIS WAS THE BUG)
        const list = data.watchList || [];

        if (list.length === 0) {
          setWatchlist([]);
          return;
        }

        const enriched = await Promise.all(
          list.map(async (item) => {
            try {
              const movieData = await fetchMovies({
                type: "byid",
                id: item.movie.movieid,
                type_of: "movie",
              });

              return {
                ...item,
                tmdb: movieData,
              };
            } catch {
              return item;
            }
          })
        );

        setWatchlist(enriched);
      } catch (err) {
        console.error(err);
        setError("Could not load watchlist");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return <div className="text-gray-400">Loading watchlist...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (watchlist.length === 0) {
    return <div className="text-gray-400">Your watchlist is empty</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {watchlist.map((item) => {
        const movie = item.tmdb;
        const poster = movie?.poster_path
          ? `${IMAGE_BASE}${movie.poster_path}`
          : "/placeholder.png";

        return (
          <div
            key={item._id}
            className="bg-white/5 rounded-xl overflow-hidden
            border border-white/10 hover:border-purple-500/50 transition"
          >
            <div className="aspect-[2/3] bg-black/30">
              <img
                src={poster}
                alt={movie?.title || "Movie poster"}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3">
              <h3 className="text-sm font-semibold text-white truncate">
                {movie?.title || movie?.name || "Unknown Title"}
              </h3>

              {item.createdAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Added on{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WatchListData;
