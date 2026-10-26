"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * <InterestedButton movieID={m.id} type={m.media_type === "movie" ? "movie" : "series"} />
 */
export default function InterestedButton({ movieID, type, className = "" }) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieID) return;
    let mounted = true;

    fetch("/api/intrested")
      .then((res) => (res.ok ? res.json() : { interested: [] }))
      .then((data) => {
        if (!mounted) return;
        const already = (data.interested || []).some(
          (item) => item.movie?.movieid === movieID
        );
        setAdded(already);
      })
      .catch(() => {})
      .finally(() => mounted && setChecking(false));

    return () => {
      mounted = false;
    };
  }, [movieID]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (added || loading) return;

    if (!movieID) {
      setError("No movie id was passed.");
      return;
    }
    if (!type) {
      setError('Missing "type" prop.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/intrested", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieID, type }),
      });
      if (res.ok || res.status === 403) {
        setAdded(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || `Request failed (${res.status})`);
      }
    } catch {
      setError("Network error — please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="relative w-full min-w-0">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || checking || added}
        aria-pressed={added}
        title={added ? "Marked as interested" : "Mark as interested"}
        className={cn(
          "flex h-11 w-full items-center justify-center gap-1.5 sm:gap-2 rounded-xl border px-2 text-xs sm:text-sm font-semibold transition active:scale-[0.98] disabled:cursor-default",
          added
            ? "border-pink-500/40 bg-pink-500/15 text-pink-300 hover:bg-pink-500/25"
            : "border-white/10 bg-white/[0.04] text-white hover:bg-white/10",
          className
        )}
      >
        <Heart
          size={16}
          className={cn(
            "shrink-0",
            added ? "fill-current text-pink-400" : "text-white/70"
          )}
          aria-hidden="true"
        />
        <span className="truncate">
          {added ? "Interested" : loading ? "Adding…" : "Interested"}
        </span>
      </button>

      {error && (
        <span className="absolute -bottom-5 right-0 whitespace-nowrap text-[11px] text-rose-400">
          {error}
        </span>
      )}
    </div>
  );
}
