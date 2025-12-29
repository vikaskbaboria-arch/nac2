"use client"
import { useEffect, useState } from 'react'

export default function Reviewdata({ movieId }) {
  const [reviews, setReviews] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [average, setAverage] = useState(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!movieId) return
    let mounted = true
    setLoading(true)
    setError(null)

    fetch(`/api/review?movieId=${movieId}`)
      .then(async (res) => {
        const text = await res.text()
        if (!res.ok) throw new Error(`Server ${res.status}: ${text || res.statusText}`)
        try {
          return JSON.parse(text)
        } catch (e) {
          throw new Error('Invalid JSON from server')
        }
      })
      .then((data) => {
        if (!mounted) return
        // API returns { reviews, averageRating, count }
        if (data && Array.isArray(data.reviews)) {
          setReviews(data.reviews)
          setAverage(typeof data.averageRating === 'number' ? data.averageRating : null)
          setCount(typeof data.count === 'number' ? data.count : data.reviews.length)
        } else if (Array.isArray(data)) {
          setReviews(data)
          setAverage(null)
          setCount(data.length)
        } else {
          setReviews([])
          setAverage(null)
          setCount(0)
        }
      })
      .catch((err) => {
        if (!mounted) return
        console.error('Review fetch error:', err)
        setError(err.message || 'Error loading reviews')
        setReviews([])
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [movieId])

  if (!movieId) {
    return <div className="text-white">No movie specified</div>
  }

  if (loading) return <div className="text-white">Loading reviews...</div>
  if (error) return <div className="text-red-400">{error}</div>
  if (!reviews || reviews.length === 0) return <div className="text-white ">No reviews yet</div>

  // compute average client-side if server didn't provide it
  const computedAverage = average ?? (reviews.length > 0 ? (reviews.reduce((s, r) => s + (typeof r.rating === 'number' ? r.rating : 0), 0) / reviews.filter(r=>typeof r.rating==='number').length) : null)
  const displayCount = count || reviews.length

  return (
    <div className="max-w-3xl mx-auto mt-6 text-white">
      <h3 className="font-bold mb-3">Reviews</h3>
      {computedAverage !== null && (
        <div className="mb-2 text-slate-200">⭐ Average: {Number(computedAverage).toFixed(1)} ({displayCount} review{displayCount!==1? 's':''})</div>
      )}
      {reviews.map((rv) => (
        <div key={rv._id} className="p-3 mb-3 bg-slate-900 rounded ">
          <div className="flex items-center gap-3">
            <div className="font-semibold">{rv.user?.username || 'User'}</div>
            <div className="text-sm text-slate-400">⭐ {rv.rating ?? '-'}</div>
            <div className="text-xs text-slate-500 ml-auto">{new Date(rv.createdAt).toLocaleString()}</div>
          </div>
          <div className="mt-2 text-slate-200">{rv.review}</div>
        </div>
      ))}
    </div>
  )
} 