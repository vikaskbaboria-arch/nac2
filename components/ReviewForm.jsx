"use client"
import { useState } from 'react'

export default function ReviewForm({ movieId, onSuccess }) {
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!movieId) return setError('Missing movie id')

    const numRating = Number(rating)
    if (isNaN(numRating) || numRating < 0.5 || numRating > 10) {
      return setError('Rating must be between 0.5 and 10')
    }

    setLoading(true)
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ movieId, reviewText, rating: numRating }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Failed to save review')
      } else {
        setSuccess('Review saved')
        setReviewText('')
        setRating('')
        if (onSuccess) onSuccess(data)
      }
    } catch (err) {
      setError('Network error')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg sm:max-w-2xl p-4 bg-black mx-auto rounded-md">
      <div className="mb-2 text-white font-bold">Write a review</div>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Share your thoughts"
        className="w-full p-2 mb-2 rounded textarea bg-slate-900 text-white"
        rows={4}
      />

      <div className="flex items-center gap-2 mb-3">
        <label className="text-slate-200">Rating</label>
        <input
          type="number"
          step="0.5"
          min="0.5"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-24 p-1 rounded bg-slate-800 text-white"
        />
        <div className="text-sm text-slate-400">(0.5 - 10)</div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1 bg-emerald-500 rounded text-black font-semibold"
        >
          {loading ? 'Saving...' : 'Submit Review'}
        </button>
        {error && <div className="text-red-400">{error}</div>}
        {success && <div className="text-green-400">{success}</div>}
      </div>
    </form>
  )
}
