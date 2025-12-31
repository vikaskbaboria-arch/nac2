"use client";

import { useState } from "react";

const Watchlist = ({ movieId }) => {
  const [watchlist, setWatchlist] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const addToWatchlist = async () => {
    if (!movieId) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to add to watchlist");
        return;
      }

      setWatchlist(true);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={addToWatchlist}
        disabled={loading || watchlist}
        className="px-4 py-2 bg-green-600 rounded text-white"
      >
        {watchlist ? "✔ Added to Watchlist" : loading ? "Adding..." : "Add to Watchlist"}
      </button>

      {error && (
        <p className="text-red-400 mt-2 text-sm">{error}</p>
      )}
    </div>
  );
};

export default Watchlist;
