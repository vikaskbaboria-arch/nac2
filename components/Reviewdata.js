"use client"
import { useEffect, useState } from "react"

/* =========================
   Star Display (read-only)
========================= */

/* =========================
   Review Data Component
========================= */
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
      .catch((err) => mounted && setError(err.message))
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
    <div className="max-w-5xl mx-auto mt-6 sm:mt-8 px-3 sm:px-4 text-white">

      {/* ===== Average Rating ===== */}
    

      {/* ===== Reviews List ===== */}
      <div className="space-y-4">
        {reviews.map((rv) => {
          const isOpen = expanded[rv._id]

          return (
            <div
              key={rv._id}
              className="
                p-4 sm:p-5 rounded-xl
                bg-slate-900/80 border border-slate-800
                hover:border-purple-500/40
                hover:shadow-xl hover:shadow-purple-500/10
                transition-all duration-300
              "
            >
              {/* Header */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="font-semibold text-white text-sm sm:text-base">
                  {rv.user?.username || "User"}
                </div>

          

                <span className="text-xs sm:text-sm text-slate-400">
                  {rv.rating?.toFixed(1)}
                </span>

                <span className="ml-auto text-xs text-slate-500">
                  {new Date(rv.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Review text */}
              <p
                className={`mt-3 text-sm sm:text-base text-slate-200 leading-relaxed ${
                  isOpen ? "" : "line-clamp-2"
                }`}
              >
                {rv.review}
              </p>

              {/* Show more / less */}
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
