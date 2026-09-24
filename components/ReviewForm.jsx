"use client"
import { useState, useRef, useEffect } from "react"

const MAX_LEN = 1000

// Anchors: 3 = Worst, 5 = Timepass, 6 = Good, 8 = Go for it, 10 = Masterpiece.
// Gaps between them are filled in so every step on the slider has a label.
const RATING_LABELS = [
  { max: 2, label: "Awful", tone: "text-rose-400" },
  { max: 3.5, label: "Worst", tone: "text-rose-400" },
  { max: 4.5, label: "Meh", tone: "text-orange-400" },
  { max: 5.5, label: "Timepass", tone: "text-blue-300" },
  { max: 6.5, label: "Good", tone: "text-blue-400" },
  { max: 7.5, label: "Great", tone: "text-violet-400" },
  { max: 8.5, label: "Go for it", tone: "text-violet-300" },
  { max: 9.5, label: "Excellent", tone: "text-emerald-400" },
  { max: 10, label: "Masterpiece", tone: "text-emerald-300" },
]

function getRatingMeta(rating) {
  return (
    RATING_LABELS.find((b) => rating <= b.max) ??
    RATING_LABELS[RATING_LABELS.length - 1]
  )
}

export default function ReviewForm({ movieId, onSuccess }) {
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const textareaRef = useRef(null)
  const { label: ratingLabel, tone: ratingTone } = getRatingMeta(rating)

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = Math.min(400, ta.scrollHeight) + "px"
  }, [reviewText])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!movieId) return setError("Missing movie id")
    if (rating < 0.5 || rating > 10)
      return setError("Rating must be between 0.5 and 10")

    setLoading(true)
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, reviewText, rating }),
      })

      const data = await res.json()
      if (!res.ok) setError(data?.error || "Failed")
      else {
        setSuccess("Review saved!")
        setReviewText("")
        setRating(5)
        onSuccess?.(data)
      }
    } catch {
      setError("Network error")
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative max-w-2xl  rounded-xl bg-black  border-white/10 overflow-hidden"
    >
      {/* Signature accent bar, matches the rest of the site */}
      <div className="h-1 w-full" />

      <div className="p-5">
        <h2 className="text-white font-display text-xl mb-3">
          Write a review
        </h2>

        <textarea
          ref={textareaRef}
          value={reviewText}
          maxLength={MAX_LEN}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your thoughts"
          className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white resize-none placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
        />

        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>Be constructive — your review helps others</span>
          <span>{reviewText.length}/{MAX_LEN}</span>
        </div>

        {/* Rating slider */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-white/70 text-sm font-medium">Rating</span>
            <div className="flex items-baseline gap-2">
              <span className="text-white font-bold text-lg tabular-nums">
                {rating}
              </span>
              <span className={`text-sm font-semibold ${ratingTone}`}>
                {ratingLabel}
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full cursor-pointer accent-[#7c3aed]"
          />

          <div className="flex justify-between text-[11px] text-white/30 mt-1">
            <span>0.5</span>
            <span>10</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg font-semibold text-white bg-purple-500 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Saving..." : "Submit Review"}
          </button>

          {error && <span className="text-rose-400 text-sm">{error}</span>}
          {success && <span className="text-emerald-400 text-sm">{success}</span>}
        </div>
      </div>
    </form>
  )
}