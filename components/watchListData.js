"use client";

import React, { useEffect, useState } from "react";
import { fetchMovies } from "@/lib/masterfetch";
import { useRouter } from "next/navigation";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const WatchListData = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/watchlist", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch watchlist");

        const data = await res.json();
        const list = data.watchList || [];

        if (list.length === 0) {
          setWatchlist([]);
          return;
        }

        const enriched = await Promise.all(
          list.map(async (item) => {
            try {
              // Try movie endpoint first, then fallback to TV if not found
              let tmdb = await fetchMovies({
                type: "byid",
                id: item.movie.movieid,
                type_of: "movie",
              });

              // TMDB returns an object with `status_code` on error
              if (tmdb?.status_code || tmdb?.success === false) {
                tmdb = await fetchMovies({
                  type: "byid",
                  id: item.movie.movieid,
                  type_of: "tv",
                });
                // mark inferred type
                tmdb = { ...tmdb, _inferred_media_type: "tv" };
              } else {
                tmdb = { ...tmdb, _inferred_media_type: "movie" };
              }

              return { ...item, tmdb };
            } catch (e) {
              console.error("watchlist item enrich failed", e);
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
    return (
      <div className="text-gray-400 text-center py-10">
        Loading watchlist...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-10">
        {error}
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="text-gray-400 text-center py-10">
        Your watchlist is empty
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        gap-4
        sm:gap-6
      "
    >
      {watchlist.map((item) => {
        const tmdb = item.tmdb;
        const poster = tmdb?.poster_path
          ? `${IMAGE_BASE}${tmdb.poster_path}`
          : "/placeholder.png";

        // decide route based on inferred media type or TMDB shape
        const mediaType = tmdb?._inferred_media_type
          || (tmdb?.name && !tmdb?.title ? "tv" : "movie");
        const targetPath = mediaType === "tv" ? `/series/${item.movie.movieid}` : `/movie/${item.movie.movieid}`;

        return (
          <div
            key={item._id}
            onClick={() => router.push(targetPath)}
            className="
              group cursor-pointer
              rounded-xl overflow-hidden
              bg-white/5 border border-white/10
              transition-all duration-300
              hover:border-purple-500/50
              hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20
              active:scale-95
            "
          >
            {/* Poster */}
            <div className="aspect-[2/3] bg-black/30">
              <img
                src={poster}
                alt={tmdb?.title || tmdb?.name || "Poster"}
                className="
                  w-full h-full object-cover
                  transition-transform duration-300
                  group-hover:scale-105
                "
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div className="p-3">
              <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                {tmdb?.title || tmdb?.name || "Unknown Title"}
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
