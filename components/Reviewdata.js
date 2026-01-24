"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";


import { useRouter, useSearchParams } from "next/navigation";
/* =========================
   Star Display (read-only)
========================= */

/* =========================
   Review Data Component
========================= */
export default function Reviewdata({ movieId, refreshKey }) {
const router = useRouter();
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [pop, setPop] = useState(false)
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
  if (error) return <p className="text-red-400">{error}</p>
  if (!reviews.length) return <p className="text-white">No reviews yet</p>
  
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
       setReviews([]);
 
    }
    const data = await response.json();
    console.log(data);
  }
catch (error) {
    console.error('Error deleting review:', error);
}


}
const handleClickk = (id) => {
    router.push(`/user/${id}`);
}
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
                <div className="font-semibold text-white text-sm sm:text-base"   onClick={()=>(handleClickk(rv.user?.username))}>
                  {rv.user?.username || "User"}
                </div>



          

                <span className="text-xs sm:text-sm text-slate-400">
                  {rv.rating?.toFixed(1)}
                </span>

                <span className="ml-auto text-xs text-slate-500">
                  {new Date(rv.createdAt).toLocaleDateString()}
                </span>
                <div>
           
   {rv.user?._id === currentUserId && (  <div onClick={()=>setPop(!pop)} className="text-xs px-3 py-1 rounded bg-red-500 hover:bg-red-600 transition">
      delete
    </div>)}

<div
  className={`
    fixed inset-0 z-50
    ${pop ? "flex" : "hidden"}
    items-center justify-center
    bg-black/60 backdrop-blur-sm
  `}
>
  {/* Popup Card */}
  <div
    className="
      w-[320px]
      rounded-2xl
      bg-[#111]
      p-6
      shadow-2xl
      border border-white/10
      animate-[fadeIn_0.25s_ease-out]
    "
  >
    <h3 className="text-white text-lg font-semibold mb-2">
      Delete Review?
    </h3>

    <p className="text-sm text-gray-400 mb-6">
      Are you sure you want to delete this review? This action cannot be undone.
    </p>

    <div className="flex justify-end gap-3">
      {/* Cancel */}
      <button
        onClick={() => setPop(false)}
        className="
          px-4 py-2 rounded-lg
          text-sm text-gray-300
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
            bg-red-500 hover:bg-red-600
            text-white
            transition
            shadow-lg shadow-red-500/20
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
