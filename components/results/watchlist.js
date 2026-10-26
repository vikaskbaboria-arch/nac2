"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Clock, BookmarkCheck } from "lucide-react";

const Watchlist = ({ movieId, className = "" }) => {
  const { data: session } = useSession();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logpop, setLogpop] = useState(false);

  useEffect(() => {
    if (!session || !movieId) return;
    let mounted = true;

    fetch("/api/watchlist")
      .then((res) => (res.ok ? res.json() : { watchlist: [] }))
      .then((data) => {
        if (!mounted) return;
        const exists = (data.watchlist || []).some(
          (item) => Number(item.movie?.movieid) === Number(movieId)
        );
        if (exists) setInWatchlist(true);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [movieId, session]);

  const handleSubmit = async () => {
    if (!session) {
      setLogpop(true);
      setTimeout(() => setLogpop(false), 3000);
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (inWatchlist) {
        const response = await fetch("/api/watchlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movieid: Number(movieId) }),
        });
        if (response.ok) {
          setInWatchlist(false);
        }
      } else {
        const response = await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movieid: Number(movieId) }),
        });
        if (response.ok || response.status === 403) {
          setInWatchlist(true);
        }
      }
    } catch (err) {
      console.error("Watchlist action error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        title={inWatchlist ? "Remove from Watch Later" : "Add to Watch Later"}
        className={`flex h-11 w-full items-center justify-center gap-1.5 sm:gap-2 rounded-xl border px-2 text-xs sm:text-sm font-semibold transition active:scale-[0.98] ${
          inWatchlist
            ? "border-purple-500/40 bg-purple-500/15 text-purple-300 hover:bg-purple-500/25"
            : "border-white/10 bg-white/[0.04] text-white hover:bg-white/10"
        } ${className}`}
      >
        {inWatchlist ? (
          <BookmarkCheck size={16} className="shrink-0 text-purple-400" />
        ) : (
          <Clock size={16} className="shrink-0 text-white/70" />
        )}
        <span className="truncate">
          {loading ? "Saving…" : inWatchlist ? "Added" : "Watch Later"}
        </span>
      </button>

      {logpop && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap rounded-xl border border-white/10 bg-[#121016] px-3.5 py-2 text-xs text-white shadow-2xl backdrop-blur-md">
          Please{" "}
          <Link href="/login" className="font-semibold text-purple-400 hover:underline">
            sign in
          </Link>{" "}
          first
        </div>
      )}
    </div>
  );
};

export default Watchlist;
