"use client"
import { useState, useRef, useEffect } from "react"

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

      {/* 🎚️ Slider Rating */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-300 font-semibold">Rating</span>
          <span className="text-purple-400 font-bold text-lg">
            {rating}
          </span>
        </div>

        <input
          type="range"
          min="0.5"
          max="10"
          step="0.5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full accent-purple-500 cursor-pointer"
        />

        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>0.5</span>
          <span>10</span>
        </div>
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
