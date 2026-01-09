"use client"
import { useState, useRef, useEffect } from "react"

/* =========================
   SVG Star (Full / Half)
========================= */
function Star({ fill }) {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <defs>
        <linearGradient id={`half-${fill}`}>
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#475569" />
        </linearGradient>
      </defs>

      <path
        d="M12 2l2.9 6 6.6.6-5 4.4 1.5 6.5L12 16l-6 3.5 1.5-6.5-5-4.4 6.6-.6L12 2z"
        fill={
          fill === "full"
            ? "#a855f7"
            : fill === "half"
            ? "url(#half-half)"
            : "#475569"
        }
      />
    </svg>
  )
}

/* =========================
   Star Rating Component
========================= */
function StarRating({ value, onChange, max = 10 }) {
  const [hover, setHover] = useState(null)
  const display = hover ?? value

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const star = i + 1
        let fill = "empty"

        if (display >= star) fill = "full"
        else if (display >= star - 0.5) fill = "half"

        return (
          <div
            key={i}
            className="relative cursor-pointer"
            onMouseLeave={() => setHover(null)}
          >
            {/* Left half */}
            <div
              className="absolute left-0 top-0 w-1/2 h-full z-10"
              onMouseEnter={() => setHover(star - 0.5)}
              onClick={() => onChange(star - 0.5)}
            />

            {/* Right half */}
            <div
              className="absolute right-0 top-0 w-1/2 h-full z-10"
              onMouseEnter={() => setHover(star)}
              onClick={() => onChange(star)}
            />

            <Star fill={fill} />
          </div>
        )
      })}

      <span className="ml-2 text-white font-semibold">
        {display}
      </span>
    </div>
  )
}

/* =========================
   Review Form
========================= */
export default function ReviewForm({ movieId, onSuccess }) {
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const textareaRef = useRef(null)
  const MAX_LEN = 1000

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
      className="max-w-2xl mx-auto p-4 rounded-lg bg-gradient-to-br from-slate-900 to-black border border-neutral-800"
    >
      <h2 className="text-white font-bold text-xl mb-3">
        Write a review
      </h2>

      <textarea
        ref={textareaRef}
        value={reviewText}
        maxLength={MAX_LEN}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Share your thoughts"
        className="w-full p-3 rounded-lg bg-slate-800 text-white resize-none focus:ring-2 focus:ring-purple-500"
      />

      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>Be constructive — your review helps others</span>
        <span>{reviewText.length}/{MAX_LEN}</span>
      </div>

      {/* ⭐ Rating */}
      <div className="flex items-center gap-3 mt-4">
        <span className="text-slate-300 font-semibold">Rating</span>
        <StarRating value={rating} onChange={setRating} max={10} />
        <span className="text-sm text-slate-400">(0.5 – 10)</span>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-emerald-400 hover:bg-emerald-500 rounded-md font-semibold"
        >
          {loading ? "Saving..." : "Submit Review"}
        </button>

        {error && <span className="text-red-400">{error}</span>}
        {success && <span className="text-emerald-400">{success}</span>}
      </div>
    </form>
  )
}

