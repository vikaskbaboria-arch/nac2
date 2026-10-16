"use client"
import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * <InterestedButton movieID={m.id} type={m.media_type === "movie" ? "movie" : "series"} />
 *
 * `movieID` and `type` ("movie" | "series", required by the Interested
 * schema) must both be passed in — a common bug is a prop-name typo
 * (e.g. movieId instead of movieID) or passing "tv" instead of
 * "series", both of which used to fail silently. This version shows
 * an inline error instead.
 *
 * Only a POST (add) endpoint exists in /api/interested — there's no
 * DELETE — so this can mark something as interested but can't remove
 * it yet. Once a movie is added the button stays disabled/"Interested".
 * Add a DELETE handler to the route if you want a real toggle.
 */
export default function InterestedButton({ movieID, type, className }) {
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!movieID) return
    let mounted = true

    fetch("/api/intrested")
      .then((res) => (res.ok ? res.json() : { interested: [] }))
      .then((data) => {
        if (!mounted) return
        const already = (data.interested || []).some(
          (item) => item.movie?.movieid === movieID
        )
        setAdded(already)
      })
      .catch(() => {})
      .finally(() => mounted && setChecking(false))

    return () => {
      mounted = false
    }
  }, [movieID])

  const handleClick = async (e) => {
    e.stopPropagation()
    if (added || loading) return

    if (!movieID) {
      setError("No movie id was passed to this button.")
      return
    }
    if (!type) {
      setError('Missing "type" prop ("movie" or "series").')
      return
    }

    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/intrested", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieID, type }),
      })
      // 403 = "already in watchlist", which the API itself already treats
      // as a non-error state, so both 201 and 403 mean "it's added now".
      if (res.ok || res.status === 403) {
        setAdded(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data?.error || `Request failed (${res.status})`)
      }
    } catch {
      setError("Network error — please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="flex w-full min-w-0 flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || checking || added}
        aria-pressed={added}
        className={cn(
          "inline-flex w-full max-w-full min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-default",
          added
            ? "border-[#10b981]/50 bg-[#10b981]/10 text-[#34d399] shadow-[0_0_8px_rgba(16,185,129,0.2)]"
            : "border-violet-300/30 bg-white/5 text-white/80 shadow-[0_0_8px_rgba(167,139,250,0.16)] hover:border-violet-300/50 hover:bg-white/10 hover:shadow-[0_0_10px_rgba(167,139,250,0.24)]",
          className
        )}
      >
        <Heart className={cn("size-3.5", added && "fill-current")} aria-hidden="true" />
        {added ? "Interested" : loading ? "Adding..." : "Interested?"}
      </button>

      {error && (
        <span className="max-w-[200px] text-right text-[11px] text-rose-400">
          {error}
        </span>
      )}
    </div>
  )
}