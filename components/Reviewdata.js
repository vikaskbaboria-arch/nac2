"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { getRatingMeta } from "@/lib/ratinglabels";

/* =========================
   Review Data Component
========================= */
export default function Reviewdata({ movieId, refreshKey }) {
const router = useRouter();
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [pop, setPop] = useState(null) // holds the review id pending delete, or null
  const [error, setError] = useState(null)
  const [average, setAverage] = useState(null)
  const [count, setCount] = useState(0)
  const [expanded, setExpanded] = useState({})
const { data: session } = useSession();
const currentUserId = session?.user?.id;
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
  if (error) return <p className="text-rose-400">{error}</p>
  if (!reviews.length) return <p className="text-white/50">No reviews yet</p>

  const avg =
    average ??
    reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length

const handleDelete=async(reviewId)=>{
  try {
    const response = await fetch(`/api/review`, {
      method: 'DELETE',
      headers:{ "Content-Type": "application/json" },
      body: JSON.stringify({ movieId, reviewId })
    });

    if(response.ok){
       // Remove only the deleted review, not the whole list.
       setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    }
    const data = await response.json();
    console.log(data);
  }
catch (error) {
    console.error('Error deleting review:', error);
}
  setPop(null)
}
const handleClickk = (id) => {
    router.push(`/user/${id}`);
}
  return (
    <div className="max-w-5xl  mt-6 sm:mt-8   text-white">

      {/* ===== Reviews List ===== */}
      <div className="space-y-4">
        {reviews.map((rv) => {
          const isOpen = expanded[rv._id]
          const { label: ratingLabel, tone: ratingTone } = getRatingMeta(rv.rating || 0)

          return (
            <div
              key={rv._id}
              className="
                relative overflow-hidden
                p-4 sm:p-5 rounded-xl
                bg-black border border-white/10
                hover:border-white/20
                hover:shadow-xl hover:shadow-[#3b82f6]/10
                transition-all duration-300
              "
            >
              {/* Header */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={()=>(handleClickk(rv.user?.username))}
                  className="font-semibold text-white text-sm sm:text-base hover:underline"
                >
                  {rv.user?.username || "User"}
                </button>

                <span className={`text-xs sm:text-sm font-semibold tabular-nums ${ratingTone}`}>
                  {rv.rating?.toFixed(1)}
                </span>
                <span className={`text-xs sm:text-sm ${ratingTone}`}>
                  {ratingLabel}
                </span>

                <span className="ml-auto text-xs text-white/40">
                  {new Date(rv.createdAt).toLocaleDateString()}
                </span>

                <div>
   {rv.user?._id === currentUserId && (
     <button
       type="button"
       onClick={()=>setPop(rv._id)}
       className="text-xs px-3 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition"
     >
      delete
    </button>
   )}

<div
  className={`
    fixed inset-0 z-50
    ${pop === rv._id ? "flex" : "hidden"}
    items-center justify-center
    bg-black/60 backdrop-blur-sm
  `}
>
  {/* Popup Card */}
  <div
    className="
      w-[320px]
      rounded-2xl
      bg-black
      p-6
      shadow-2xl
      border border-white/10
      animate-[fadeIn_0.25s_ease-out]
    "
  >
    <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#3b82f6] to-[#10b981] mb-4" />

    <h3 className="text-white text-lg font-semibold mb-2">
      Delete Review?
    </h3>

    <p className="text-sm text-white/50 mb-6">
      Are you sure you want to delete this review? This action cannot be undone.
    </p>

    <div className="flex justify-end gap-3">
      {/* Cancel */}
      <button
        onClick={() => setPop(null)}
        className="
          px-4 py-2 rounded-lg
          text-sm text-white/70
          bg-white/5 hover:bg-white/10
          transition
        "
      >
        Cancel
      </button>

      {/* Delete */}
      {rv.user?._id === currentUserId && (
        <button
          onClick={() => handleDelete(rv._id)}
          className="
            px-4 py-2 rounded-lg
            text-sm font-medium
            bg-rose-500 hover:bg-rose-600
            text-white
            transition
            shadow-lg shadow-rose-500/20
          "
        >
          Delete
        </button>
      )}
    </div>
  </div>
</div>

                </div>
              </div>

              {/* Review text */}
              <p
                className={`mt-3 text-sm sm:text-base text-white/80 leading-relaxed ${
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
                  className="mt-2 text-blue-400 text-sm font-semibold hover:underline"
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