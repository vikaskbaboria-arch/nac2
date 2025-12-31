"use client";

import React, { useEffect, useState } from "react";

const WatchListData = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/watchlist", {
          credentials: "same-origin", 
        });

        if (!res.ok) {
          throw new Error("Failed to fetch watchlist");
        }

        const data = await res.json();

 
        setWatchlist(data.watchList || []);
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
    <div className="space-y-4">
      {watchlist.map((item) => (
        <div
          key={item._id}
          className="p-4 rounded-lg bg-white/5 border border-white/10"
        >
          <p className="text-white">
            Movie ID:{" "}
            <span className="text-purple-400">
              {item.movie?.movieid}
            </span>
          </p>

          {item.createdAt && (
            <p className="text-xs text-gray-500">
              Added on {new Date(item.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default WatchListData;
