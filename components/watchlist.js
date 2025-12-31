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
        <div className="w-full sm:inline-block">
          <button
            onClick={addToWatchlist}
            disabled={loading || watchlist}
            aria-pressed={watchlist}
            className={
              `
              ${loading || watchlist ? "opacity-70 cursor-not-allowed" : "hover:brightness-95"}
              w-full sm:w-auto flex items-center justify-center gap-2
              px-4 py-2 sm:px-4 sm:py-2 rounded text-white
              bg-purple-600 disabled:bg-purple-500
              transition-all duration-150
            `
            }
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : watchlist ? (
              <span className="text-sm sm:text-base">✔</span>
            ) : null}

            <span className="text-sm sm:text-base">
              {watchlist ? "Added" : loading ? "Adding..." : "Add to Watchlist"}
            </span>
          </button>
        </div>

        {error && (
          <p className="text-red-400 mt-2 text-sm">{error}</p>
        )}

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
