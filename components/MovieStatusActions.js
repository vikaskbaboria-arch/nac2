"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CollectionButton from "./CollectionButton";

const MovieStatusActions = ({ movie }) => {
  const { data: session, status } = useSession();
  const [statuses, setStatuses] = useState({ watchLater: false, watched: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !movie?.id) {
      setLoading(false);
      return;
    }

    let active = true;
    fetch(`/api/watchlist?movieid=${movie.id}&mediaType=${movie.mediaType}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load movie status");
        if (active) {
          setStatuses({
            watchLater: Boolean(data.watchLater),
            watched: Boolean(data.watched),
          });
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [movie?.id, movie?.mediaType, session, status]);

  const updateStatus = async (action) => {
    if (!session) {
      setShowLogin(true);
      return;
    }
    if (statuses[action] || saving) return;
    setError("");
    setSaving(action);
    try {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieid: Number(movie.id),
          mediaType: movie.mediaType,
          action,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update movie status");
      setStatuses({
        watchLater: Boolean(data.watch.watchLater),
        watched: Boolean(data.watch.watched),
      });
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving("");
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => updateStatus("watched")}
        disabled={loading || saving === "watched" || statuses.watched}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition hover:brightness-110 disabled:cursor-default disabled:opacity-75"
      >
        <Eye size={18} />
        {loading ? "Loading…" : saving === "watched" ? "Saving…" : statuses.watched ? "Watched" : "Mark as Watched"}
      </button>
      <div className="mt-2">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="h-11">
            <CollectionButton movie={movie} />
          </div>
          <button
            type="button"
            onClick={() => updateStatus("watchLater")}
            disabled={loading || saving === "watchLater" || statuses.watchLater}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-default disabled:opacity-75"
          >
            {loading ? "Loading…" : saving === "watchLater" ? "Saving…" : statuses.watchLater ? "Added" : "Watch Later"}
          </button>
        </div>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-red-300">{error}</p>}
      {showLogin && (
        <p className="mt-2 text-center text-xs text-white/65">
          <Link href="/login" className="text-purple-300 hover:underline">
            Sign in
          </Link>{" "}
          to save your status.
        </p>
      )}
    </div>
  );
};

export default MovieStatusActions;
