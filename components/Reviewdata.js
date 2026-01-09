"use client"
import { useEffect, useState } from "react"

/* =========================
   Star Display (read-only)
========================= */
function StarDisplay({ value, max = 10, size = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const star = i + 1
        let fill = "empty"

        if (value >= star) fill = "full"
        else if (value >= star - 0.5) fill = "half"

        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className={`w-${size} h-${size}`}
          >
            <defs>
              <linearGradient id={`half-${i}`}>
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="50%" stopColor="#334155" />
              </linearGradient>
            </defs>

            <path
              d="M12 2l2.9 6 6.6.6-5 4.4 1.5 6.5L12 16l-6 3.5 1.5-6.5-5-4.4 6.6-.6L12 2z"
              fill={
                fill === "full"
                  ? "#facc15"
                  : fill === "half"
                  ? `url(#half-${i})`
                  : "#334155"
              }
            />
          </svg>
        )
      })}
    </div>
  )
}

export default function Reviewdata({ movieId, refreshKey }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [average, setAverage] = useState(null)
  const [count, setCount] = useState(0)
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    if (!movieId) return
    let mounted = true

    setLoading(true)
    setError(null)

    fetch(`/api/review?movieId=${movieId}`)
      .then(async (res) => {
        const text = await res.text()
        if (!res.ok) throw new Error("Failed to load reviews")
        return JSON.parse(text)
      })
      .then((data) => {
        if (!mounted) return
        setReviews(data.reviews || [])
        setAverage(data.averageRating ?? null)
        setCount(data.count ?? data.reviews?.length ?? 0)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message)
      })
      .finally(() => mounted && setLoading(false))

    return () => (mounted = false)
  }, [movieId, refreshKey])

  if (!movieId) return null
  if (loading) return <p className="text-white">Loading reviews...</p>
  if (error) return <p className="text-red-400">{error}</p>
  if (!reviews.length) return <p className="text-white">No reviews yet</p>

  const avg =
    average ??
    reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length

  return (
    <div className="max-w-5xl mx-auto mt-8 text-white">
      {/* ===== Average Rating ===== */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-slate-900 to-black border border-neutral-800 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-extrabold text-yellow-400">
            {avg.toFixed(1)}
          </div>
          <div>
            <StarDisplay value={avg} size={6} />
            <div className="text-sm text-slate-400 mt-1">
              Based on {count} review{count !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Reviews ===== */}
      <div className="space-y-4">
        {reviews.map((rv) => {
          const isOpen = expanded[rv._id]
          return (
            <div
              key={rv._id}
              className="
                group relative p-4 rounded-xl
                bg-slate-900/80 border border-slate-800
                hover:border-purple-500/40
                hover:shadow-xl hover:shadow-purple-500/10
                transition-all duration-300
              "
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="font-semibold text-white">
                  {rv.user?.username || "User"}
                </div>

                <StarDisplay value={rv.rating || 0} size={4} />

                <span className="text-sm text-slate-400">
                  {rv.rating?.toFixed(1)}
                </span>

                <span className="ml-auto text-xs text-slate-500">
                  {new Date(rv.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Review text */}
              <p
                className={`mt-3 text-slate-200 leading-relaxed transition-all ${
                  isOpen ? "" : "line-clamp-2"
                }`}
              >
                {rv.review}
              </p>

              {/* Show more */}
              {rv.review?.length > 120 && (
                <button
                  onClick={() =>
                    setExpanded((p) => ({
                      ...p,
                      [rv._id]: !p[rv._id],
                    }))
                  }
                  className="mt-2 text-purple-400 text-sm font-semibold hover:underline"
                >
                  {isOpen ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
